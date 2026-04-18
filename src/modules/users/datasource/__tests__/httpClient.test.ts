import { describe, expect, it, vi } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/modules/users/mocks/server'
import { createHttpClient } from '../httpClient'

const baseUrl = '/api'
const noopSleep = () => Promise.resolve()

describe('httpClient', () => {
  it('GET 200 retorna { ok: true, data } com JSON parseado', async () => {
    server.use(
      http.get('/api/hello', () => HttpResponse.json({ msg: 'hi' })),
    )
    const client = createHttpClient({ baseUrl })
    const result = await client.request<{ msg: string }>('/hello')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data).toEqual({ msg: 'hi' })
  })

  it('4xx com body { code, message } normaliza em ApiError', async () => {
    server.use(
      http.get('/api/bad', () =>
        HttpResponse.json(
          { code: 'INVALID_FILTER', message: 'Filtro inválido' },
          { status: 400 },
        ),
      ),
    )
    const client = createHttpClient({ baseUrl })
    const result = await client.request('/bad')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatchObject({
        code: 'INVALID_FILTER',
        message: 'Filtro inválido',
        status: 400,
      })
    }
  })

  it('4xx sem body conhecido cai em INTERNAL_ERROR com status', async () => {
    server.use(
      http.get('/api/teapot', () => new HttpResponse(null, { status: 418, statusText: 'Teapot' })),
    )
    const client = createHttpClient({ baseUrl })
    const result = await client.request('/teapot')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatchObject({ code: 'INTERNAL_ERROR', status: 418 })
  })

  it('5xx transitório aciona retry e resolve', async () => {
    let attempts = 0
    server.use(
      http.get('/api/flaky', () => {
        attempts += 1
        if (attempts < 2) {
          return HttpResponse.json({ code: 'INTERNAL_ERROR', message: 'temp' }, { status: 503 })
        }
        return HttpResponse.json({ ok: true })
      }),
    )
    const client = createHttpClient({
      baseUrl,
      retry: { sleep: noopSleep, jitter: () => 0 },
    })
    const result = await client.request<{ ok: boolean }>('/flaky')
    expect(result.ok).toBe(true)
    expect(attempts).toBe(2)
  })

  it('5xx contínuo esgota retries e retorna error normalizado', async () => {
    server.use(
      http.get('/api/always-fail', () =>
        HttpResponse.json({ code: 'INTERNAL_ERROR', message: 'boom' }, { status: 500 }),
      ),
    )
    const client = createHttpClient({
      baseUrl,
      retry: { sleep: noopSleep, jitter: () => 0, maxRetries: 2 },
    })
    const result = await client.request('/always-fail')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error).toMatchObject({ status: 500, code: 'INTERNAL_ERROR' })
  })

  it('erro de rede (fetch throws) vira NETWORK_ERROR sem retry-bounce infinito', async () => {
    const fetchImpl = vi.fn().mockRejectedValue(new TypeError('net down'))
    const client = createHttpClient({
      baseUrl,
      fetchImpl: fetchImpl as unknown as typeof fetch,
      retry: { sleep: noopSleep, jitter: () => 0, maxRetries: 2 },
    })
    const result = await client.request('/anything')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('NETWORK_ERROR')
    // 1 initial + 2 retries = 3 tentativas
    expect(fetchImpl).toHaveBeenCalledTimes(3)
  })

  it('inclui Authorization quando getAuthToken retorna valor', async () => {
    let seen: string | null = null
    server.use(
      http.get('/api/auth', ({ request }) => {
        seen = request.headers.get('Authorization')
        return HttpResponse.json({ ok: true })
      }),
    )
    const client = createHttpClient({
      baseUrl,
      getAuthToken: () => 'abc123',
    })
    await client.request('/auth')
    expect(seen).toBe('Bearer abc123')
  })

  it('POST serializa body + seta Content-Type JSON por padrão', async () => {
    let payload: unknown
    let contentType: string | null = null
    server.use(
      http.post('/api/echo', async ({ request }) => {
        contentType = request.headers.get('Content-Type')
        payload = await request.json()
        return HttpResponse.json({ ok: true })
      }),
    )
    const client = createHttpClient({ baseUrl })
    const result = await client.request('/echo', {
      method: 'POST',
      body: JSON.stringify({ hello: 'world' }),
    })
    expect(result.ok).toBe(true)
    expect(contentType).toBe('application/json')
    expect(payload).toEqual({ hello: 'world' })
  })

  it('204 no content retorna data null', async () => {
    server.use(http.get('/api/empty', () => new HttpResponse(null, { status: 204 })))
    const client = createHttpClient({ baseUrl })
    const result = await client.request('/empty')
    expect(result.ok).toBe(true)
    if (result.ok) expect(result.data).toBeNull()
  })

  it('JSON inválido em 200 vira INVALID_RESPONSE', async () => {
    server.use(
      http.get('/api/garbage', () => new HttpResponse('not json at all', { status: 200 })),
    )
    const client = createHttpClient({ baseUrl })
    const result = await client.request('/garbage')
    expect(result.ok).toBe(false)
    if (!result.ok) expect(result.error.code).toBe('INVALID_RESPONSE')
  })
})
