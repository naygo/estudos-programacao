/**
 * Retry com exponential backoff + full jitter.
 *
 * Convenção (AWS full jitter):
 *   exp = min(maxDelayMs, baseDelayMs * multiplier^attempt)
 *   delay = random(0, exp)
 *
 * Retry só em erros transitórios: network, timeout, 5xx, 429.
 * Nunca em 4xx (exceto 429).
 */

export interface RetryOptions {
  maxRetries?: number
  baseDelayMs?: number
  maxDelayMs?: number
  multiplier?: number
  isRetryable?: (error: unknown) => boolean
  sleep?: (ms: number) => Promise<void>
  jitter?: () => number
}

const DEFAULTS = {
  maxRetries: 3,
  baseDelayMs: 300,
  maxDelayMs: 3000,
  multiplier: 2,
}

interface InspectableError {
  status?: number
  code?: string
  isNetworkError?: boolean
}

export function defaultIsRetryable(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const e = error as InspectableError
  if (e.isNetworkError) return true
  if (e.code === 'NETWORK_ERROR' || e.code === 'TIMEOUT') return true
  if (typeof e.status === 'number') {
    if (e.status === 429) return true
    if (e.status >= 500 && e.status < 600) return true
  }
  return false
}

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function retry<T>(task: () => Promise<T>, options: RetryOptions = {}): Promise<T> {
  const maxRetries = options.maxRetries ?? DEFAULTS.maxRetries
  const baseDelayMs = options.baseDelayMs ?? DEFAULTS.baseDelayMs
  const maxDelayMs = options.maxDelayMs ?? DEFAULTS.maxDelayMs
  const multiplier = options.multiplier ?? DEFAULTS.multiplier
  const isRetryable = options.isRetryable ?? defaultIsRetryable
  const sleep = options.sleep ?? defaultSleep
  const jitter = options.jitter ?? Math.random

  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await task()
    } catch (error) {
      lastError = error
      if (attempt === maxRetries || !isRetryable(error)) {
        throw error
      }
      const exp = Math.min(maxDelayMs, baseDelayMs * multiplier ** attempt)
      const delay = Math.floor(exp * jitter())
      await sleep(delay)
    }
  }
  throw lastError
}
