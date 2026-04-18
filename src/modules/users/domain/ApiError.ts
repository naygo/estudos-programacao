import { z } from 'zod'

export const apiErrorCodes = [
  'NETWORK_ERROR',
  'TIMEOUT',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'USER_NOT_FOUND',
  'INVALID_FILTER',
  'INVALID_RESPONSE',
  'INTERNAL_ERROR',
  'UNKNOWN',
] as const

export type ApiErrorCode = (typeof apiErrorCodes)[number]

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
})

export type ApiErrorPayload = z.infer<typeof apiErrorSchema>

export interface ApiError {
  code: ApiErrorCode | string
  message: string
  status?: number
  cause?: unknown
}

export function createApiError(
  code: ApiErrorCode,
  message: string,
  extras?: { status?: number; cause?: unknown },
): ApiError {
  return { code, message, ...extras }
}

const retryableStatuses = new Set([408, 429, 500, 502, 503, 504])

export function isTransientError(error: ApiError): boolean {
  if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') return true
  if (typeof error.status === 'number' && retryableStatuses.has(error.status)) return true
  return false
}

export type Result<T, E = ApiError> =
  | { ok: true; data: T }
  | { ok: false; error: E }
