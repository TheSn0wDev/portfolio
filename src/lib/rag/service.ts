import 'server-only'
import OpenAI from 'openai'
import { getDocumentIndex } from './index'
import { abstention, answerInstructions, PROMPT_VERSION, context, digest, finalize, indexVersion, retrieve, tokens, truncate, type ChatInput, type Answer } from './core'
import { readCache, reserveGeneration, ServiceError, writeCache } from './storage'

export async function answerQuestion(input: ChatInput, signal: AbortSignal, emit?: (delta: string) => void): Promise<Answer & { cached: boolean }> {
  const started = Date.now()
  const index = getDocumentIndex()
  const version = indexVersion(index)
  const model = process.env.OPENAI_CHAT_MODEL ?? 'gpt-4.1-mini-2025-04-14'
  // Luna's default reasoning effort is medium; disable it for short RAG answers.
  // Omit the parameter for other models (e.g. GPT-4.1) that may not support it.
  const reasoning = /^gpt-6-luna(?:-|$)/.test(model) ? { effort: 'none' as const } : undefined
  const minimum = Number(process.env.RAG_MIN_SIMILARITY ?? 0.3)
  if (!Number.isFinite(minimum) || minimum < 0 || minimum > 1) throw new ServiceError(503, 'Seuil de recherche invalide.')
  const key = digest(JSON.stringify([PROMPT_VERSION, version, model, reasoning, minimum, input.locale ?? 'fr', input.question, input.history]))
  const cached = await readCache(key).catch(() => null)
  if (cached) {
    emit?.(cached.answer)
    console.info(JSON.stringify({ event: 'rag_answer', cached: true, latencyMs: Date.now() - started }))
    return { ...cached, cached: true }
  }
  if (!index.chunks.length) return { answer: abstention(input.locale), sources: [], indexVersion: version, cached: false }
  if (!process.env.OPENAI_API_KEY) throw new ServiceError(503, 'Service OpenAI non configuré.')
  // Reservation before any paid API call; failures still consume one slot.
  await reserveGeneration()
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, maxRetries: 1, timeout: 20_000 })
  const previousQuestion = input.history.filter(m => m.role === 'user').at(-1)?.content
  const query = tokens(input.question) < 24 && previousQuestion ? truncate(previousQuestion, 100) + '\n' + input.question : input.question
  const embedded = await client.embeddings.create({ model: index.model, dimensions: index.dimensions, input: query }, { signal })
  const embedding = embedded.data[0]?.embedding
  if (!embedding || embedding.length !== index.dimensions || !embedding.every(Number.isFinite)) throw new ServiceError(502, 'Recherche temporairement indisponible.')
  const passages = retrieve(index, query, embedding, minimum)
  if (!passages.length) {
    const result = { answer: abstention(input.locale), sources: [], indexVersion: version }
    await writeCache(key, result).catch(() => {})
    emit?.(result.answer)
    console.info(JSON.stringify({ event: 'rag_answer', abstained: true, embeddingTokens: embedded.usage.total_tokens, latencyMs: Date.now() - started }))
    return { ...result, cached: false }
  }
  // History is quoted as untrusted data, never promoted to system/developer instructions.
  const request = {
    model, store: false, max_output_tokens: 350,
    ...(reasoning ? { reasoning } : {}),
    instructions: answerInstructions(input.locale),
    input: [{ role: 'user' as const, content: JSON.stringify({ excerpts: context(passages), history: input.history, question: input.question }) }],
  }
  let text = ''
  let usage: { input_tokens: number; output_tokens: number } | undefined
  if (emit) {
    const stream = await client.responses.create({ ...request, stream: true }, { signal })
    let completed = false
    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') { text += event.delta; emit(event.delta) }
      if (event.type === 'response.completed') { completed = true; usage = event.response.usage ?? undefined }
      if (event.type === 'response.failed' || event.type === 'response.incomplete' || event.type === 'error') throw new ServiceError(502, 'Réponse interrompue. Réessaie avec une question plus précise.')
    }
    if (!completed) throw new ServiceError(502, 'Réponse interrompue.')
  } else {
    const response = await client.responses.create(request, { signal })
    if (response.status !== 'completed') throw new ServiceError(502, 'Réponse interrompue. Réessaie avec une question plus précise.')
    text = response.output_text
    usage = response.usage ?? undefined
  }
  if (!text.trim()) throw new ServiceError(502, 'Réponse vide du service OpenAI.')
  const answer = finalize(text, passages, version)
  await writeCache(key, answer).catch(() => {})
  console.info(JSON.stringify({ event: 'rag_answer', cached: false, model, embeddingTokens: embedded.usage.total_tokens, inputTokens: usage?.input_tokens, outputTokens: usage?.output_tokens, passages: passages.length, latencyMs: Date.now() - started }))
  return { ...answer, cached: false }
}
