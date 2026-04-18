import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/modules/users/mocks/server'
import { createHttpClient } from '../httpClient'
import { createUserDatasource } from '../userDatasource'
import { defaultUserFilters } from '@/modules/users/domain/UserFilters'

const http200 = { ok: true }

describe('userDatasource', () => {
  it('list monta query params com page/pageSize default', async () => {
    let capturedUrl: string | null = null
    server.use(
      http.get('/api/users', ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json(http200)
      }),
    )
    const ds = createUserDatasource(createHttpClient({ baseUrl: '/api' }))
    await ds.list(defaultUserFilters)
    const url = new URL(capturedUrl!)
    expect(url.searchParams.get('page')).toBe('1')
    expect(url.searchParams.get('pageSize')).toBe('20')
    expect(url.searchParams.get('search')).toBeNull()
    expect(url.searchParams.getAll('status')).toEqual([])
    expect(url.searchParams.getAll('role')).toEqual([])
  })

  it('list inclui search + multiplos status/role como repeatable', async () => {
    let capturedUrl: string | null = null
    server.use(
      http.get('/api/users', ({ request }) => {
        capturedUrl = request.url
        return HttpResponse.json(http200)
      }),
    )
    const ds = createUserDatasource(createHttpClient({ baseUrl: '/api' }))
    await ds.list({
      search: 'maria',
      status: ['active', 'pending'],
      role: ['admin'],
      page: 2,
      pageSize: 50,
    })
    const url = new URL(capturedUrl!)
    expect(url.searchParams.get('search')).toBe('maria')
    expect(url.searchParams.get('page')).toBe('2')
    expect(url.searchParams.get('pageSize')).toBe('50')
    expect(url.searchParams.getAll('status')).toEqual(['active', 'pending'])
    expect(url.searchParams.getAll('role')).toEqual(['admin'])
  })

  it('getById codifica id corretamente', async () => {
    let capturedPath: string | null = null
    server.use(
      http.get('/api/users/:id', ({ request }) => {
        capturedPath = new URL(request.url).pathname
        return HttpResponse.json({ id: 'x' })
      }),
    )
    const ds = createUserDatasource(createHttpClient({ baseUrl: '/api' }))
    await ds.getById('usr_000001')
    expect(capturedPath).toBe('/api/users/usr_000001')
  })

  it('getById propaga 404 como error', async () => {
    server.use(
      http.get('/api/users/:id', () =>
        HttpResponse.json({ code: 'USER_NOT_FOUND', message: 'nao achou' }, { status: 404 }),
      ),
    )
    const ds = createUserDatasource(createHttpClient({ baseUrl: '/api' }))
    const result = await ds.getById('xyz')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toMatchObject({ code: 'USER_NOT_FOUND', status: 404 })
    }
  })
})
