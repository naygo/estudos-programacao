import { describe, expect, it, vi } from 'vitest'
import { defaultIsRetryable, retry } from '../retry'

const noopSleep = () => Promise.resolve()
const halfJitter = () => 0.5
const maxJitter = () => 0.999999

describe('retry', () => {
  it('retorna resultado sem retry quando primeira chamada resolve', async () => {
    const task = vi.fn().mockResolvedValue('ok')
    const result = await retry(task, { sleep: noopSleep })
    expect(result).toBe('ok')
    expect(task).toHaveBeenCalledTimes(1)
  })

  it('retry em 503 e resolve na segunda', async () => {
    const task = vi.fn().mockRejectedValueOnce({ status: 503 }).mockResolvedValue('ok')
    const sleep = vi.fn().mockResolvedValue(undefined)
    const result = await retry(task, { sleep, jitter: halfJitter })
    expect(result).toBe('ok')
    expect(task).toHaveBeenCalledTimes(2)
    // exp = 300 * 2^0 = 300 → delay = floor(300 * 0.5) = 150
    expect(sleep).toHaveBeenCalledWith(150)
  })

  it('retry em 429 (rate limit)', async () => {
    const task = vi.fn().mockRejectedValueOnce({ status: 429 }).mockResolvedValue('ok')
    const result = await retry(task, { sleep: noopSleep, jitter: halfJitter })
    expect(result).toBe('ok')
    expect(task).toHaveBeenCalledTimes(2)
  })

  it('retry em network error (isNetworkError flag)', async () => {
    const task = vi.fn().mockRejectedValueOnce({ isNetworkError: true }).mockResolvedValue('ok')
    const result = await retry(task, { sleep: noopSleep, jitter: halfJitter })
    expect(result).toBe('ok')
  })

  it('retry em NETWORK_ERROR / TIMEOUT (code)', async () => {
    for (const code of ['NETWORK_ERROR', 'TIMEOUT']) {
      const task = vi.fn().mockRejectedValueOnce({ code }).mockResolvedValue('ok')
      const result = await retry(task, { sleep: noopSleep, jitter: halfJitter })
      expect(result).toBe('ok')
    }
  })

  it('NÃO retry em 400 (client error deterministico)', async () => {
    const task = vi.fn().mockRejectedValue({ status: 400, code: 'INVALID_FILTER' })
    await expect(retry(task, { sleep: noopSleep })).rejects.toMatchObject({ status: 400 })
    expect(task).toHaveBeenCalledTimes(1)
  })

  it('NÃO retry em 404', async () => {
    const task = vi.fn().mockRejectedValue({ status: 404 })
    await expect(retry(task, { sleep: noopSleep })).rejects.toMatchObject({ status: 404 })
    expect(task).toHaveBeenCalledTimes(1)
  })

  it('throws o último erro após esgotar maxRetries', async () => {
    const task = vi.fn().mockRejectedValue({ status: 503, message: 'down' })
    const sleep = vi.fn().mockResolvedValue(undefined)
    await expect(retry(task, { sleep, maxRetries: 3 })).rejects.toMatchObject({ status: 503 })
    expect(task).toHaveBeenCalledTimes(4) // 1 initial + 3 retries
    expect(sleep).toHaveBeenCalledTimes(3)
  })

  it('backoff exponencial respeita baseDelayMs e multiplier', async () => {
    const task = vi
      .fn()
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 503 })
      .mockResolvedValue('ok')
    const sleep = vi.fn().mockResolvedValue(undefined)
    await retry(task, {
      sleep,
      jitter: halfJitter,
      baseDelayMs: 100,
      maxDelayMs: 10_000,
      multiplier: 2,
    })
    // attempt 0: exp=100*2^0=100, delay=50
    // attempt 1: exp=100*2^1=200, delay=100
    expect(sleep.mock.calls).toEqual([[50], [100]])
  })

  it('cap em maxDelayMs independente de jitter máximo', async () => {
    const task = vi
      .fn()
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 500 })
      .mockRejectedValueOnce({ status: 500 })
      .mockResolvedValue('ok')
    const sleep = vi.fn().mockResolvedValue(undefined)
    await retry(task, {
      sleep,
      jitter: maxJitter,
      baseDelayMs: 1000,
      maxDelayMs: 2500,
      multiplier: 3,
    })
    // attempt 0: exp=min(2500, 1000)=1000, delay≈999
    // attempt 1: exp=min(2500, 3000)=2500, delay≈2499
    // attempt 2: exp=min(2500, 9000)=2500, delay≈2499
    for (const [delay] of sleep.mock.calls) {
      expect(delay).toBeLessThanOrEqual(2500)
      expect(delay).toBeGreaterThanOrEqual(0)
    }
  })

  it('full jitter: delay em [0, exp)', async () => {
    const task = vi.fn().mockRejectedValueOnce({ status: 500 }).mockResolvedValue('ok')
    const sleep = vi.fn().mockResolvedValue(undefined)
    await retry(task, { sleep, jitter: () => 0, baseDelayMs: 500 })
    expect(sleep).toHaveBeenCalledWith(0)
  })

  it('respeita isRetryable customizado', async () => {
    const task = vi.fn().mockRejectedValue({ status: 400 })
    // custom retryable que inclui 400
    await expect(
      retry(task, {
        sleep: noopSleep,
        isRetryable: () => true,
        maxRetries: 2,
      }),
    ).rejects.toMatchObject({ status: 400 })
    expect(task).toHaveBeenCalledTimes(3)
  })
})

describe('defaultIsRetryable', () => {
  it('retryable: 5xx', () => {
    expect(defaultIsRetryable({ status: 500 })).toBe(true)
    expect(defaultIsRetryable({ status: 502 })).toBe(true)
    expect(defaultIsRetryable({ status: 599 })).toBe(true)
  })

  it('retryable: 429', () => {
    expect(defaultIsRetryable({ status: 429 })).toBe(true)
  })

  it('retryable: network flags / codes', () => {
    expect(defaultIsRetryable({ isNetworkError: true })).toBe(true)
    expect(defaultIsRetryable({ code: 'NETWORK_ERROR' })).toBe(true)
    expect(defaultIsRetryable({ code: 'TIMEOUT' })).toBe(true)
  })

  it('NÃO retryable: 4xx (exceto 429)', () => {
    expect(defaultIsRetryable({ status: 400 })).toBe(false)
    expect(defaultIsRetryable({ status: 401 })).toBe(false)
    expect(defaultIsRetryable({ status: 403 })).toBe(false)
    expect(defaultIsRetryable({ status: 404 })).toBe(false)
    expect(defaultIsRetryable({ status: 422 })).toBe(false)
  })

  it('NÃO retryable: 2xx / 3xx', () => {
    expect(defaultIsRetryable({ status: 200 })).toBe(false)
    expect(defaultIsRetryable({ status: 301 })).toBe(false)
  })

  it('NÃO retryable: valores estranhos', () => {
    expect(defaultIsRetryable(null)).toBe(false)
    expect(defaultIsRetryable(undefined)).toBe(false)
    expect(defaultIsRetryable('erro')).toBe(false)
    expect(defaultIsRetryable({})).toBe(false)
  })
})
