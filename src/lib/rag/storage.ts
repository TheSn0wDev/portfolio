import 'server-only'
import { createHmac } from 'node:crypto'
import { Redis } from '@upstash/redis'
import type { Answer } from './core'

// Atomic check + increment. Rejected attempts cannot increment the global quota.
export const QUOTA_SCRIPT = `
for i, key in ipairs(KEYS) do
  if tonumber(redis.call('GET', key) or '0') >= tonumber(ARGV[(i-1)*2+1]) then
    return {0, math.max(1, redis.call('TTL', key))}
  end
end
for i, key in ipairs(KEYS) do
  local count = redis.call('INCR', key)
  if count == 1 then redis.call('EXPIRE', key, ARGV[(i-1)*2+2]) end
end
return {1, 0}`
export class ServiceError extends Error {
  constructor(public status: number, message: string, public retryAfter?: number) { super(message) }
}
function positive(name: string, fallback: number) {
  const value = Number(process.env[name] ?? fallback)
  if (!Number.isInteger(value) || value < 1) throw new ServiceError(503, `Configuration ${name} invalide.`)
  return value
}
let redis: Redis | undefined
export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (url && token) return redis ??= new Redis({ url, token, retry: { retries: 1 }, enableAutoPipelining: false, signal: () => AbortSignal.timeout(5000) })
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL) throw new ServiceError(503, 'Protection du chat non configurée.')
  return undefined
}
// Local development only: never treated as a distributed production limiter.
const local = new Map<string, { value: number; expires: number }>()
async function quota(keys: string[], limits: number[], ttls: number[]) {
  const store = getRedis()
  if (store) {
    const result = await store.eval<number[], [number, number]>(QUOTA_SCRIPT, keys, limits.flatMap((limit, i) => [limit, ttls[i]]))
    if (result[0] !== 1) throw new ServiceError(429, 'Quota atteint. Réessaie plus tard.', result[1])
    return
  }
  const now = Date.now()
  for (const [key, value] of local) if (value.expires <= now) local.delete(key)
  for (const key of keys) if (!local.has(key)) local.set(key, { value: 0, expires: now + ttls[keys.indexOf(key)] * 1000 })
  keys.forEach((key, i) => { const entry = local.get(key)!; if (entry.value >= limits[i]) throw new ServiceError(429, 'Quota atteint.', Math.ceil((entry.expires - now) / 1000)) })
  keys.forEach(key => { local.get(key)!.value++ })
}
export async function rateLimit(request: Request) {
  getRedis()
  const identity = process.env.VERCEL
    ? request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    : 'local-development'
  const secret = process.env.UPSTASH_REDIS_REST_TOKEN ?? 'local'
  const ip = createHmac('sha256', secret).update(identity).digest('hex')
  const namespace = process.env.VERCEL_ENV ?? 'local'
  await quota([`rag:${namespace}:minute:${ip}`, `rag:${namespace}:day:${ip}`], [positive('RAG_REQUESTS_PER_MINUTE', 20), positive('RAG_REQUESTS_PER_DAY', 100)], [60, 86400])
}
export async function reserveGeneration() {
  await quota([`rag:${process.env.VERCEL_ENV ?? 'local'}:generations:${new Date().toISOString().slice(0, 10)}`], [positive('RAG_GENERATIONS_PER_DAY', 500)], [86400])
}
export async function readCache(key: string): Promise<Answer | null> {
  const store = getRedis()
  return store ? await store.get<Answer>(`rag:answer:${key}`) : null
}
export async function writeCache(key: string, value: Answer) {
  const store = getRedis()
  if (store) await store.set(`rag:answer:${key}`, value, { ex: 86400 })
}
