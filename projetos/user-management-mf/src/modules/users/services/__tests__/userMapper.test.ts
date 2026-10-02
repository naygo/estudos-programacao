import { describe, expect, it } from 'vitest'
import { mapUser, mapUserList } from '../userMapper'

const validUser = {
  id: 'usr_000001',
  name: 'Maria Silva',
  email: 'maria.silva@localiza.test',
  cpf: '123.456.789-00',
  role: 'admin',
  status: 'active',
  department: 'Frota',
  createdAt: '2024-01-15T10:30:00.000Z',
  lastLogin: '2024-06-01T14:22:00.000Z',
}

describe('mapUser', () => {
  it('aceita payload válido e retorna User tipado', () => {
    const r = mapUser(validUser)
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data).toEqual(validUser)
  })

  it('aceita lastLogin null (usuário pendente nunca acessou)', () => {
    const r = mapUser({ ...validUser, status: 'pending', lastLogin: null })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.lastLogin).toBeNull()
  })

  it('rejeita email inválido', () => {
    const r = mapUser({ ...validUser, email: 'not-an-email' })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.error.code).toBe('INVALID_RESPONSE')
      expect(r.error.message).toContain('email')
    }
  })

  it('rejeita CPF fora do formato XXX.XXX.XXX-XX', () => {
    const r = mapUser({ ...validUser, cpf: '12345678900' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.message).toContain('cpf')
  })

  it('rejeita role desconhecida (fora do enum)', () => {
    const r = mapUser({ ...validUser, role: 'superadmin' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.message).toContain('role')
  })

  it('rejeita status desconhecido', () => {
    const r = mapUser({ ...validUser, status: 'deleted' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.message).toContain('status')
  })

  it('rejeita createdAt que não é ISO 8601', () => {
    const r = mapUser({ ...validUser, createdAt: '2024-01-15' })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.message).toContain('createdAt')
  })

  it('rejeita campos obrigatórios ausentes', () => {
    const { name: _name, ...rest } = validUser
    const r = mapUser(rest)
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.message).toContain('name')
  })

  it('rejeita id vazio', () => {
    const r = mapUser({ ...validUser, id: '' })
    expect(r.ok).toBe(false)
  })

  it('ignora propriedades extras (Zod strip default)', () => {
    const r = mapUser({ ...validUser, extraField: 'lixo' })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data).not.toHaveProperty('extraField')
  })

  it('rejeita payload não-objeto', () => {
    expect(mapUser(null).ok).toBe(false)
    expect(mapUser('string').ok).toBe(false)
    expect(mapUser(42).ok).toBe(false)
    expect(mapUser([]).ok).toBe(false)
  })
})

describe('mapUserList', () => {
  const validResponse = {
    data: [validUser],
    pagination: { page: 1, pageSize: 20, total: 247, totalPages: 13 },
  }

  it('aceita resposta válida', () => {
    const r = mapUserList(validResponse)
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.data.data).toHaveLength(1)
      expect(r.data.pagination.total).toBe(247)
    }
  })

  it('aceita lista vazia', () => {
    const r = mapUserList({ ...validResponse, data: [], pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 } })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.data.data).toEqual([])
  })

  it('rejeita quando um user interno é inválido', () => {
    const r = mapUserList({
      ...validResponse,
      data: [validUser, { ...validUser, email: 'lixo' }],
    })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.error.code).toBe('INVALID_RESPONSE')
      expect(r.error.message).toContain('data.1.email')
    }
  })

  it('rejeita pagination sem campos obrigatórios', () => {
    const r = mapUserList({ data: [], pagination: { page: 1 } })
    expect(r.ok).toBe(false)
  })

  it('rejeita page negativo', () => {
    const r = mapUserList({ ...validResponse, pagination: { ...validResponse.pagination, page: 0 } })
    expect(r.ok).toBe(false)
  })

  it('rejeita total negativo', () => {
    const r = mapUserList({ ...validResponse, pagination: { ...validResponse.pagination, total: -1 } })
    expect(r.ok).toBe(false)
  })

  it('mensagem de erro inclui limite e "+N mais" quando há muitos issues', () => {
    const r = mapUserList({
      data: [
        { ...validUser, email: 'a' },
        { ...validUser, cpf: 'b' },
        { ...validUser, role: 'x' },
        { ...validUser, status: 'y' },
      ],
      pagination: { page: 1, pageSize: 20, total: 0, totalPages: 0 },
    })
    expect(r.ok).toBe(false)
    if (!r.ok) {
      expect(r.error.message).toContain('mais)')
    }
  })
})
