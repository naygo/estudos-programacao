import { describe, expect, it } from 'vitest'

describe('MSW handlers', () => {
  it('GET /api/users retorna lista paginada', async () => {
    const res = await fetch('/api/users?page=1&pageSize=20')
    expect(res.ok).toBe(true)
    const body = await res.json()
    expect(body).toMatchObject({
      pagination: {
        page: 1,
        pageSize: 20,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      },
    })
    expect(body.data).toHaveLength(20)
  })

  it('filtra por search (nome case-insensitive)', async () => {
    const res = await fetch('/api/users?page=1&pageSize=50&search=maria')
    const body = await res.json()
    expect(body.data.length).toBeGreaterThan(0)
    for (const u of body.data) {
      expect(u.name.toLowerCase()).toContain('maria')
    }
  })

  it('filtra por status', async () => {
    const res = await fetch('/api/users?page=1&pageSize=100&status=active')
    const body = await res.json()
    for (const u of body.data) {
      expect(u.status).toBe('active')
    }
  })

  it('GET /api/users/:id retorna usuário', async () => {
    const list = await fetch('/api/users?page=1&pageSize=1').then((r) => r.json())
    const id = list.data[0].id as string
    const res = await fetch(`/api/users/${id}`)
    expect(res.ok).toBe(true)
    const user = await res.json()
    expect(user.id).toBe(id)
  })

  it('GET /api/users/:id retorna 404 { code, message } quando não existe', async () => {
    const res = await fetch('/api/users/usr_nao_existe')
    expect(res.status).toBe(404)
    const body = await res.json()
    expect(body).toMatchObject({ code: 'USER_NOT_FOUND', message: expect.any(String) })
  })

  it('POST /__test__/next-request-fails força próxima 503', async () => {
    await fetch('/__test__/next-request-fails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 1 }),
    })
    const res = await fetch('/api/users?page=1&pageSize=5')
    expect(res.status).toBe(503)
    const body = await res.json()
    expect(body).toMatchObject({ code: 'INTERNAL_ERROR' })

    // próxima request volta ao normal
    const ok = await fetch('/api/users?page=1&pageSize=5')
    expect(ok.ok).toBe(true)
  })
})
