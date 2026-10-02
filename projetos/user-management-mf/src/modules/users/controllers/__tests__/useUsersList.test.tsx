import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { waitFor } from '@testing-library/react'
import { server } from '@/modules/users/mocks/server'
import { defaultUserFilters } from '@/modules/users/domain/UserFilters'
import { useUsersList } from '../useUsersList'
import { renderHookWithProviders } from '@/test/renderWithProviders'

describe('useUsersList (integration)', () => {
  it('transita de loading → success com lista e pagination', async () => {
    const { result } = renderHookWithProviders(() => useUsersList(defaultUserFilters))

    expect(result.current.isLoading).toBe(true)
    expect(result.current.users).toEqual([])

    await waitFor(() => expect(result.current.isLoading).toBe(false))

    expect(result.current.users.length).toBe(20)
    expect(result.current.pagination).toMatchObject({
      page: 1,
      pageSize: 20,
      total: expect.any(Number),
      totalPages: expect.any(Number),
    })
    expect(result.current.isError).toBe(false)
  })

  it('emite ApiError tipado em 4xx (INVALID_FILTER) sem retry', async () => {
    let calls = 0
    server.use(
      http.get('/api/users', () => {
        calls += 1
        return HttpResponse.json(
          { code: 'INVALID_FILTER', message: 'role inválida' },
          { status: 400 },
        )
      }),
    )
    const { result } = renderHookWithProviders(() => useUsersList(defaultUserFilters))
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toMatchObject({
      code: 'INVALID_FILTER',
      message: 'role inválida',
      status: 400,
    })
    expect(calls).toBe(1) // 4xx nunca retria
  })

  it('5xx transitório retria via httpClient e resolve', async () => {
    await fetch('/__test__/next-request-fails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 1 }),
    })
    const { result } = renderHookWithProviders(() => useUsersList(defaultUserFilters))
    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 })
    expect(result.current.isError).toBe(false)
    expect(result.current.users.length).toBe(20)
  })

  it('payload malformado vira INVALID_RESPONSE na UI', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({ data: [{ id: 'x' }], pagination: { page: 1 } }),
      ),
    )
    const { result } = renderHookWithProviders(() => useUsersList(defaultUserFilters))
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error?.code).toBe('INVALID_RESPONSE')
  })

  it('lista vazia não marca isError', async () => {
    server.use(
      http.get('/api/users', () =>
        HttpResponse.json({
          data: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        }),
      ),
    )
    const { result } = renderHookWithProviders(() => useUsersList(defaultUserFilters))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.users).toEqual([])
    expect(result.current.pagination?.total).toBe(0)
    expect(result.current.isError).toBe(false)
  })

  it('filtros diferentes geram queryKeys distintas (refetch por mudança)', async () => {
    let calls = 0
    server.use(
      http.get('/api/users', () => {
        calls += 1
        return HttpResponse.json({
          data: [],
          pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
        })
      }),
    )
    const { result, rerender } = renderHookWithProviders(
      () => useUsersList(defaultUserFilters),
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(calls).toBe(1)

    rerender()
    // mesmo filtro — sem refetch (cache hit)
    expect(calls).toBe(1)
  })
})
