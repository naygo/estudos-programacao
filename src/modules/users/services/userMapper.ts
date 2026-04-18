import type { ZodError, ZodSchema } from 'zod'
import {
  userListResponseSchema,
  userSchema,
  type User,
  type UserListResponse,
} from '@/modules/users/domain/User'
import { createApiError, type ApiError, type Result } from '@/shared/domain/ApiError'

/**
 * Valida payload cru da API via Zod e retorna Result tipado.
 * Falha de validação vira ApiError com code INVALID_RESPONSE —
 * tratado igual a erro de servidor pela UI (mesmo ErrorState).
 */
export function mapUser(raw: unknown): Result<User, ApiError> {
  return parseWith(userSchema, raw)
}

export function mapUserList(raw: unknown): Result<UserListResponse, ApiError> {
  return parseWith(userListResponseSchema, raw)
}

function parseWith<T>(schema: ZodSchema<T>, raw: unknown): Result<T, ApiError> {
  const parsed = schema.safeParse(raw)
  if (parsed.success) return { ok: true, data: parsed.data }
  return {
    ok: false,
    error: createApiError('INVALID_RESPONSE', formatIssues(parsed.error)),
  }
}

function formatIssues(error: ZodError): string {
  const issues = error.issues
    .slice(0, 3)
    .map((i) => {
      const path = i.path.length > 0 ? i.path.join('.') : '(root)'
      return `${path}: ${i.message}`
    })
    .join('; ')
  const more = error.issues.length > 3 ? ` (+${error.issues.length - 3} mais)` : ''
  return `Resposta inválida do servidor. ${issues}${more}`
}
