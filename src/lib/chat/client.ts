export type ChatHistoryMessage = { role: 'user' | 'assistant'; content: string }
export type ChatReply = {
  answer: string
  sources: { citation: number; source: string; chunkId: string }[]
}

export class ChatRequestError extends Error {}

export async function requestChatReply(
  question: string,
  history: ChatHistoryMessage[],
  signal: AbortSignal,
  fetchImpl: typeof fetch = fetch,
): Promise<ChatReply> {
  const response = await fetchImpl('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, history: history.slice(-4) }),
    signal,
    cache: 'no-store',
  })
  const body: unknown = await response.json().catch(() => null)
  const data = body && typeof body === 'object' ? body as Record<string, unknown> : null
  if (!response.ok) {
    throw new ChatRequestError(typeof data?.error === 'string' && data.error.trim()
      ? data.error
      : 'Le chat est temporairement indisponible. Réessayez dans un instant.')
  }
  if (typeof data?.answer !== 'string' || !data.answer.trim()) {
    throw new ChatRequestError('Le chat est temporairement indisponible. Réessayez dans un instant.')
  }
  const sources = Array.isArray(data.sources) ? data.sources.filter((source): source is ChatReply['sources'][number] =>
    !!source && typeof source === 'object' && typeof source.citation === 'number'
      && typeof source.source === 'string' && typeof source.chunkId === 'string') : []
  return { answer: data.answer, sources }
}
