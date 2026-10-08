import { translate } from '@/i18n/messages'
import type { Locale } from '@/i18n/locale'
import { parseInput } from '@/lib/rag/core'
import { answerQuestion } from '@/lib/rag/service'
import { rateLimit, ServiceError } from '@/lib/rag/storage'

export const runtime = 'nodejs'
export const maxDuration = 60
const headers = { 'Cache-Control': 'no-store' }

async function readBody(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) throw new ServiceError(400, 'Corps JSON manquant.')
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 16_384) { await reader.cancel(); throw new ServiceError(413, 'Corps trop volumineux (16 Ko maximum).') }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')) as unknown }
  catch { throw new ServiceError(400, 'Corps JSON invalide.') }
}
function publicError(error: unknown) {
  if (error instanceof ServiceError) return error
  // Never log provider errors that might contain request data or secrets.
  console.error(JSON.stringify({ event: 'rag_error', type: error instanceof Error ? error.name : 'unknown' }))
  return new ServiceError(503, 'Le chat est temporairement indisponible.')
}
function errorMessage(error: unknown, locale: Locale) {
  const message = publicError(error).message
  const localized = translate(message, locale)
  return locale === 'en' && localized === message
    ? 'The chat could not process your request. Please try again shortly.'
    : localized
}
export async function POST(request: Request) {
  let locale: Locale = 'fr'
  try {
    const origin = request.headers.get('origin')
    if (origin && origin !== new URL(request.url).origin) throw new ServiceError(403, 'Origine non autorisée.')
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new ServiceError(415, 'Content-Type application/json requis.')
    let input
    try {
      const body = await readBody(request)
      if (body && typeof body === 'object' && 'locale' in body && body.locale === 'en') locale = 'en'
      input = parseInput(body)
    }
    catch (error) { if (error instanceof ServiceError) throw error; throw new ServiceError(400, error instanceof Error ? error.message : 'Requête invalide.') }
    await rateLimit(request)
    const cancellation = new AbortController()
    const signal = AbortSignal.any([request.signal, cancellation.signal, AbortSignal.timeout(45_000)])
    if (!input.stream) return Response.json(await answerQuestion(input, signal), { headers })
    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown) => { if (!cancellation.signal.aborted) controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)) }
        try {
          const result = await answerQuestion(input, signal, delta => send('delta', { text: delta }))
          send('done', result)
        } catch (error) { send('error', { error: errorMessage(error, locale) }) }
        finally { if (!cancellation.signal.aborted) controller.close() }
      },
      cancel() { cancellation.abort() },
    })
    return new Response(stream, { headers: { ...headers, 'Content-Type': 'text/event-stream; charset=utf-8', 'X-Accel-Buffering': 'no' } })
  } catch (error) {
    const failure = publicError(error)
    return Response.json({ error: errorMessage(failure, locale) }, { status: failure.status, headers: { ...headers, ...(failure.retryAfter ? { 'Retry-After': String(failure.retryAfter) } : {}) } })
  }
}
