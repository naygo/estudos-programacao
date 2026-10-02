import type { User, UserRole, UserStatus } from '@/modules/users/domain/User'

const firstNames = [
  'Maria',
  'João',
  'Ana',
  'Pedro',
  'Juliana',
  'Carlos',
  'Beatriz',
  'Rafael',
  'Camila',
  'Felipe',
  'Lucas',
  'Fernanda',
  'Gustavo',
  'Larissa',
  'Bruno',
  'Patrícia',
  'Thiago',
  'Amanda',
  'Rodrigo',
  'Sofia',
]

const lastNames = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Lima',
  'Pereira',
  'Alves',
  'Ferreira',
  'Costa',
  'Martins',
  'Rocha',
  'Mendes',
  'Araujo',
  'Ribeiro',
  'Carvalho',
]

const departments = [
  'Frota',
  'Financeiro',
  'Compras',
  'TI',
  'Operações',
  'Atendimento',
  'Jurídico',
  'Recursos Humanos',
  'Marketing',
]

const roles: UserRole[] = ['admin', 'operator', 'viewer']
const statuses: UserStatus[] = ['active', 'inactive', 'pending']

// Mulberry32 — PRNG determinístico
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  const idx = Math.floor(rng() * arr.length)
  return arr[idx] as T
}

function padDigits(n: number, len: number): string {
  return n.toString().padStart(len, '0')
}

function formatCpf(rng: () => number): string {
  const d = (len: number) => padDigits(Math.floor(rng() * 10 ** len), len)
  return `${d(3)}.${d(3)}.${d(3)}-${d(2)}`
}

function isoDaysAgo(rng: () => number, maxDaysAgo: number): string {
  const days = Math.floor(rng() * maxDaysAgo)
  const ms = Date.now() - days * 24 * 60 * 60 * 1000
  return new Date(ms).toISOString()
}

export function generateUsers(count: number, seed = 42): User[] {
  const rng = mulberry32(seed)
  const users: User[] = []
  for (let i = 0; i < count; i++) {
    const first = pick(rng, firstNames)
    const last = pick(rng, lastNames)
    const status = pick(rng, statuses)
    const user: User = {
      id: `usr_${padDigits(i + 1, 6)}`,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@localiza.test`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''),
      cpf: formatCpf(rng),
      role: pick(rng, roles),
      status,
      department: pick(rng, departments),
      createdAt: isoDaysAgo(rng, 720),
      lastLogin: status === 'pending' ? null : isoDaysAgo(rng, 60),
    }
    users.push(user)
  }
  return users
}

export const TOTAL_USERS = 247
export const fixtureUsers = generateUsers(TOTAL_USERS)
