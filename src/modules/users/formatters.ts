import type { UserRole, UserStatus } from './domain/User'

const roleLabel: Record<UserRole, string> = {
  admin: 'Administrador',
  operator: 'Operador',
  viewer: 'Leitor',
}

const statusLabel: Record<UserStatus, string> = {
  active: 'Ativo',
  inactive: 'Inativo',
  pending: 'Pendente',
}

export function formatRole(role: UserRole): string {
  return roleLabel[role]
}

export function formatStatus(status: UserStatus): string {
  return statusLabel[status]
}
