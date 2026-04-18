import { delay, http, HttpResponse } from 'msw'
import { fixtureUsers } from './fixtures'

const isTest = import.meta.env.MODE === 'test'
const TRANSIENT_CHANCE = 0.15
const TRANSIENT_STATUS = 503

let forcedFailures = 0

function transientErrorBody() {
  return HttpResponse.json(
    {
      code: 'INTERNAL_ERROR',
      message: 'Falha temporária no servidor. Tente novamente em instantes.',
    },
    { status: TRANSIENT_STATUS },
  )
}

async function simulatedLatency() {
  if (isTest) return
  await delay(300 + Math.floor(Math.random() * 500))
}

function maybeFail(): HttpResponse | null {
  if (forcedFailures > 0) {
    forcedFailures -= 1
    return transientErrorBody()
  }
  if (!isTest && Math.random() < TRANSIENT_CHANCE) {
    return transientErrorBody()
  }
  return null
}

export const handlers = [
  http.get('/api/users', async ({ request }) => {
    await simulatedLatency()
    const err = maybeFail()
    if (err) return err

    const url = new URL(request.url)
    const page = Math.max(1, Number(url.searchParams.get('page') ?? '1'))
    const pageSizeRaw = Number(url.searchParams.get('pageSize') ?? '20')
    const pageSize = Math.min(Math.max(1, pageSizeRaw), 100)
    const search = (url.searchParams.get('search') ?? '').trim().toLowerCase()
    const statuses = url.searchParams.getAll('status')
    const roles = url.searchParams.getAll('role')

    let filtered = fixtureUsers

    if (search) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search),
      )
    }
    if (statuses.length > 0) filtered = filtered.filter((u) => statuses.includes(u.status))
    if (roles.length > 0) filtered = filtered.filter((u) => roles.includes(u.role))

    const total = filtered.length
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    const data = filtered.slice(start, start + pageSize)

    return HttpResponse.json({
      data,
      pagination: { page, pageSize, total, totalPages },
    })
  }),

  http.get('/api/users/:id', async ({ params }) => {
    await simulatedLatency()
    const err = maybeFail()
    if (err) return err

    const user = fixtureUsers.find((u) => u.id === params.id)
    if (!user) {
      return HttpResponse.json(
        { code: 'USER_NOT_FOUND', message: 'Usuário não encontrado.' },
        { status: 404 },
      )
    }
    return HttpResponse.json(user)
  }),

  // endpoint test-only (ADR-009) — permite E2E determinístico do retry
  http.post('/__test__/next-request-fails', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { count?: number }
    const count = typeof body.count === 'number' && body.count > 0 ? body.count : 1
    forcedFailures = count
    return HttpResponse.json({ ok: true, pendingFailures: forcedFailures })
  }),

  http.post('/__test__/reset', () => {
    forcedFailures = 0
    return HttpResponse.json({ ok: true })
  }),
]

// utilitário para testes integration que importam handlers direto
export function resetMswState() {
  forcedFailures = 0
}
