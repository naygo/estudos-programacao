import { retry, type RetryOptions } from '@/shared/lib/retry'
import { apiErrorSchema, createApiError, type ApiError, type Result } from '@/shared/domain/ApiError'

export interface HttpClientOptions {
  baseUrl: string
  getAuthToken?: () => string | Promise<string> | undefined
  fetchImpl?: typeof fetch
  retry?: RetryOptions
}

export interface HttpClient {
  request<T = unknown>(path: string, init?: RequestInit): Promise<Result<T, ApiError>>
}

export function createHttpClient(opts: HttpClientOptions): HttpClient {
  const { baseUrl, getAuthToken, fetchImpl = fetch, retry: retryOpts } = opts

  async function buildHeaders(init?: RequestInit): Promise<Headers> {
    const headers = new Headers(init?.headers)
    if (!headers.has('Accept')) headers.set('Accept', 'application/json')
    if (init?.body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json')
    }
    if (getAuthToken) {
      const token = await getAuthToken()
      if (token) headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  }

  async function executeOnce<T>(path: string, init?: RequestInit): Promise<T> {
    const headers = await buildHeaders(init)
    let response: Response
    try {
      response = await fetchImpl(joinUrl(baseUrl, path), { ...init, headers })
    } catch (cause) {
      throw createApiError('NETWORK_ERROR', 'Falha de conexão com o servidor.', { cause })
    }

    if (!response.ok) {
      throw await extractApiError(response)
    }

    if (response.status === 204) return null as T

    const text = await response.text()
    if (!text) return null as T
    try {
      return JSON.parse(text) as T
    } catch (cause) {
      throw createApiError('INVALID_RESPONSE', 'Resposta inválida do servidor.', {
        status: response.status,
        cause,
      })
    }
  }

  return {
    async request<T = unknown>(path: string, init?: RequestInit): Promise<Result<T, ApiError>> {
      try {
        const data = await retry<T>(() => executeOnce<T>(path, init), retryOpts)
        return { ok: true, data }
      } catch (error) {
        return { ok: false, error: normalizeError(error) }
      }
    },
  }
}

function joinUrl(base: string, path: string): string {
  if (!base) return path
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  const b = base.endsWith('/') ? base.slice(0, -1) : base
  const p = path.startsWith('/') ? path : `/${path}`
  return `${b}${p}`
}

async function extractApiError(response: Response): Promise<ApiError> {
  try {
    const body = await response.clone().json()
    const parsed = apiErrorSchema.safeParse(body)
    if (parsed.success) {
      return createApiError(parsed.data.code, parsed.data.message, { status: response.status })
    }
  } catch {
    // body não era JSON ou estava vazio
  }
  return createApiError('INTERNAL_ERROR', response.statusText || `HTTP ${response.status}`, {
    status: response.status,
  })
}

function normalizeError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return error as ApiError
  }
  return createApiError('UNKNOWN', error instanceof Error ? error.message : String(error))
}
