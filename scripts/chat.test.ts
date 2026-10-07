import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import { POST } from '../src/app/api/chat/route'
import { getDocumentIndex } from '../src/lib/rag/index'
import { digest } from '../src/lib/rag/core'
const originalFetch = globalThis.fetch
const environment = { ...process.env }
const index = getDocumentIndex()
const originalChunks = index.chunks
beforeEach(() => {
  Object.assign(process.env, { NODE_ENV: 'test', OPENAI_API_KEY: 'test-only', VERCEL_ENV: 'test-' + Math.random() })
  delete process.env.VERCEL
  delete process.env.OPENAI_CHAT_MODEL
  delete process.env.UPSTASH_REDIS_REST_URL
  delete process.env.UPSTASH_REDIS_REST_TOKEN
  process.env.RAG_REQUESTS_PER_MINUTE = '1000'
  process.env.RAG_REQUESTS_PER_DAY = '1000'
  process.env.RAG_GENERATIONS_PER_DAY = '1000'
  index.chunks = [{ id: 'test', source: 'projets/robot.md', position: 0, text: 'Clément développe un robot autonome.', contentHash: digest('robot'), embedding: Array.from({ length: index.dimensions }, (_, i) => i === 0 ? 1 : 0) }]
})
afterEach(() => {
  globalThis.fetch = originalFetch
  index.chunks = originalChunks
  for (const key of Object.keys(process.env)) if (!(key in environment)) delete process.env[key]
  Object.assign(process.env, environment)
})
function request(body: unknown) { return new Request('http://localhost/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) }
function mockOpenAI(stream = false, unrelated = false) {
  const calls: { url: string; body: Record<string, unknown> }[] = []
  globalThis.fetch = (async (url, options) => {
    const body = JSON.parse(String(options?.body))
    calls.push({ url: String(url), body })
    if (String(url).endsWith('/embeddings')) return Response.json({ data: [{ index: 0, embedding: Array.from({ length: index.dimensions }, (_, i) => i === 0 ? (unrelated ? -1 : 1) : 0) }], usage: { total_tokens: 6, prompt_tokens: 6 } })
    const response = { id: 'resp_test', object: 'response', status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: 'Clément développe un robot [1].', annotations: [] }] }], usage: { input_tokens: 60, output_tokens: 10, total_tokens: 70 } }
    if (stream) return new Response([
      { type: 'response.output_text.delta', delta: 'Clément développe un robot [1].' },
      { type: 'response.completed', response },
    ].map(event => `data: ${JSON.stringify(event)}\n\n`).join(''), { headers: { 'Content-Type': 'text/event-stream' } })
    return Response.json(response)
  }) as typeof fetch
  return calls
}
test('JSON endpoint executes retrieval and generation with sources and bounded output', async () => {
  const calls = mockOpenAI()
  const response = await POST(request({ question: 'Quel robot développe Clément ?' }))
  assert.equal(response.status, 200)
  const result = await response.json()
  assert.equal(result.sources[0].source, 'projets/robot.md')
  assert.equal(calls.length, 2)
  assert.equal(calls[1].body.store, false)
  assert.equal(calls[1].body.max_output_tokens, 350)
  assert.equal('reasoning' in calls[1].body, false)
})
test('SSE endpoint provides delta and authoritative done event', async () => {
  mockOpenAI(true)
  const response = await POST(request({ question: 'Quel robot développe Clément ?', stream: true }))
  assert.match(response.headers.get('content-type')!, /text\/event-stream/)
  const stream = await response.text()
  assert.match(stream, /event: delta/)
  assert.match(stream, /event: done/)
  assert.match(stream, /projets\/robot.md/)
})
test('no relevant passage avoids the generation call', async () => {
  const calls = mockOpenAI(false, true)
  const response = await POST(request({ question: 'Recette chocolat pâtisserie' }))
  assert.equal(response.status, 200)
  assert.deepEqual((await response.json()).sources, [])
  assert.equal(calls.length, 1)
})
test('invalid, cross-origin and oversized requests never call OpenAI', async () => {
  const calls = mockOpenAI()
  assert.equal((await POST(request({ question: '' }))).status, 400)
  const cross = request({ question: 'Bonjour' }); cross.headers.set('origin', 'https://attacker.example')
  assert.equal((await POST(cross)).status, 403)
  assert.equal((await POST(request({ question: 'a'.repeat(20000) }))).status, 413)
  assert.equal(calls.length, 0)
})
test('production fails closed without distributed limiter', async () => {
  Object.assign(process.env, { NODE_ENV: 'production' })
  const calls = mockOpenAI()
  assert.equal((await POST(request({ question: 'Bonjour' }))).status, 503)
  assert.equal(calls.length, 0)
})
test('quota exhaustion returns 429 before a paid call', async () => {
  process.env.RAG_GENERATIONS_PER_DAY = '1'
  const calls = mockOpenAI()
  assert.equal((await POST(request({ question: 'Premier robot ?' }))).status, 200)
  const before = calls.length
  const response = await POST(request({ question: 'Quel robot ?' }))
  assert.equal(response.status, 429)
  assert.ok(Number(response.headers.get('retry-after')) > 0)
  assert.equal(calls.length, before)
})

test('shared Redis cache avoids paid calls and changes of corpus invalidate it', async () => {
  Object.assign(process.env, { UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'test-redis', NODE_ENV: 'production' })
  const calls = mockOpenAI()
  const openaiFetch = globalThis.fetch
  const values = new Map<string, string>()
  globalThis.fetch = (async (url, options) => {
    if (!String(url).startsWith('https://redis.test')) return openaiFetch(url, options)
    const command = JSON.parse(String(options?.body)) as (string | number)[]
    const name = String(command[0]).toUpperCase()
    if (name === 'EVAL') return Response.json({ result: [1, 0] })
    if (name === 'GET') return Response.json({ result: values.has(String(command[1])) ? Buffer.from(values.get(String(command[1]))!).toString('base64') : null })
    if (name === 'SET') { values.set(String(command[1]), String(command[2])); return Response.json({ result: Buffer.from('OK').toString('base64') }) }
    throw new Error('Unexpected Redis command: ' + name)
  }) as typeof fetch
  const body = { question: 'Quel robot développe Clément ?' }
  const first = await POST(request(body))
  assert.equal(first.status, 200)
  assert.equal((await first.json()).cached, false)
  assert.equal(calls.length, 2)
  const second = await POST(request(body))
  assert.equal(second.status, 200)
  assert.equal((await second.json()).cached, true)
  assert.equal(calls.length, 2)
  index.chunks = [{ ...index.chunks[0], id: 'changed', contentHash: digest('changed'), text: 'Clément développe deux robots autonomes.' }]
  const third = await POST(request(body))
  assert.equal(third.status, 200)
  assert.equal((await third.json()).cached, false)
  assert.equal(calls.length, 4)
})
test('Redis rejection blocks a request before cache and OpenAI', async () => {
  Object.assign(process.env, { UPSTASH_REDIS_REST_URL: 'https://redis.test', UPSTASH_REDIS_REST_TOKEN: 'test-redis', NODE_ENV: 'production' })
  const calls = mockOpenAI()
  const openaiFetch = globalThis.fetch
  globalThis.fetch = (async (url, options) => String(url).startsWith('https://redis.test') ? Response.json({ result: [0, 60] }) : openaiFetch(url, options)) as typeof fetch
  const response = await POST(request({ question: 'Quel robot ?' }))
  assert.equal(response.status, 429)
  assert.equal(response.headers.get('retry-after'), '60')
  assert.equal(calls.length, 0)
})
test('provider failure becomes a sanitized JSON error', async () => {
  globalThis.fetch = (async () => new Response('sensitive provider payload', { status: 400 })) as typeof fetch
  const response = await POST(request({ question: 'Quel robot ?' }))
  assert.equal(response.status, 503)
  assert.ok(!(await response.text()).includes('sensitive'))
})
test('incomplete SSE response has an error event and no done event', async () => {
  const calls = mockOpenAI()
  const embeddingFetch = globalThis.fetch
  globalThis.fetch = (async (url, options) => {
    if (String(url).endsWith('/embeddings')) return embeddingFetch(url, options)
    return new Response(`data: ${JSON.stringify({ type: 'response.incomplete', response: { status: 'incomplete' } })}\n\n`, { headers: { 'Content-Type': 'text/event-stream' } })
  }) as typeof fetch
  const response = await POST(request({ question: 'Quel robot ?', stream: true }))
  const body = await response.text()
  assert.match(body, /event: error/)
  assert.ok(!body.includes('event: done'))
  assert.equal(calls.length, 1)
})

for (const stream of [false, true]) {
  test(`Luna explicitly disables reasoning (${stream ? 'SSE' : 'JSON'})`, async () => {
    process.env.OPENAI_CHAT_MODEL = 'gpt-6-luna'
    const calls = mockOpenAI(stream)
    const response = await POST(request({ question: 'Quel robot développe Clément ?', stream }))
    assert.equal(response.status, 200)
    if (stream) assert.match(await response.text(), /event: done/)
    else assert.equal((await response.json()).sources[0].source, 'projets/robot.md')
    assert.equal(calls[1].body.model, 'gpt-6-luna')
    assert.deepEqual(calls[1].body.reasoning, { effort: 'none' })
  })
}
