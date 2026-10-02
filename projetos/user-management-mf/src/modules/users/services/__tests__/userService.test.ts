import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { server } from '@/modules/users/mocks/server'
import { createHttpClient } from '@/modules/users/datasource/httpClient'
import { createUserDatasource } from '@/modules/users/datasource/userDatasource'
import { createUserService } from '../userService'
import { defaultUserFilters } from '@/modules/users/domain/UserFilters'

function build() {
  const http = createHttpClient({ baseUrl: '/api', retry: { sleep: () => Promise.resolve(), jitter: () => 0 } })
  const ds = createUserDatasource(http)
  return createUserService(ds)
}

describe('userService', () => {
  it('list retorna UserListResponse validado quando API responde 200 válido', async () => {
    const service = build()
    const r = await service.list(defaultUserFilters)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.pagination.total).toBeGreaterThan(0)
      expect(r.data.data.length).toBeGreaterThan(0)
    }
  })

  it('list propaga erro HTTP sem tentar validar', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ code: 'INVALID_FILTER', message: 'role inválida' }, { status: 400 }),
      ),
    )
    const service = build()
    const r = await service.list(defaultUserFilters)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatchObject({ code: 'INVALID_FILTER', status: 400 })
  })

  it('list converte payload malformado em INVALID_RESPONSE', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ data: [{ id: 'x', email: 'bad' }], pagination: { page: 1 } }),
      ),
    )
    const service = build()
    const r = await service.list(defaultUserFilters)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.code).toBe('INVALID_RESPONSE')
  })

  it('getById retorna User validado', async () => {
    const service = build()
    const r = await service.getById('usr_000001')
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.id).toBe('usr_000001')
  })

  it('getById propaga 404 do datasource', async () => {
    const service = build()
    const r = await service.getById('usr_nao_existe')
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error).toMatchObject({ code: 'USER_NOT_FOUND', status: 404 })
  })
})
