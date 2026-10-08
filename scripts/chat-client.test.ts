import assert from 'node:assert/strict'
import test, { afterEach, beforeEach } from 'node:test'
import { createElement } from 'react'
import { act, create, type ReactTestRenderer } from 'react-test-renderer'
import { LocaleProvider } from '../src/i18n/LocaleProvider'
import { useChat } from '../src/hooks/useChat'
import { suggestedQuestions } from '../src/content/chat'
import { requestChatReply } from '../src/lib/chat/client'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
const originalFetch = globalThis.fetch
let renderer: ReactTestRenderer | undefined
let chat: ReturnType<typeof useChat>
type PendingRequest = { body: { question: string; history: { role: string; content: string }[] }; signal: AbortSignal; resolve: (response: Response) => void }
let requests: PendingRequest[]
beforeEach(() => {
  requests = []
  globalThis.fetch = (async (url, options) => {
    assert.equal(url, '/api/chat')
    assert.equal(options?.method, 'POST')
    assert.equal(new Headers(options?.headers).get('content-type'), 'application/json')
    return new Promise<Response>(resolve => requests.push({ body: JSON.parse(String(options?.body)), signal: options?.signal as AbortSignal, resolve }))
  }) as typeof fetch
})
afterEach(async () => {
  await act(async () => renderer?.unmount())
  renderer = undefined
  globalThis.fetch = originalFetch
})
async function mount(motion = false) {
  function Harness() { chat = useChat(motion); return null }
  await act(async () => { renderer = create(createElement(Harness)) })
}
async function reply(index: number, answer: string) {
  await act(async () => requests[index].resolve(Response.json({ answer, sources: [{ citation: 1, source: 'profil.md', chunkId: 'chunk' }] })))
}

test('suggestions call the real endpoint, duplicate sends are blocked and typed follow-ups carry history', async () => {
  await mount()
  const question = suggestedQuestions[0].question
  act(() => { chat.ask(question); chat.ask(question) })
  assert.equal(requests.length, 1)
  assert.equal(requests[0].body.question, question)
  assert.deepEqual(requests[0].body.history, [])
  assert.equal(chat.status, 'thinking')
  assert.equal(chat.busy, true)
  await reply(0, 'Réponse réelle du backend [1].')
  assert.equal(chat.msgs[1].text, 'Réponse réelle du backend [1].')
  assert.equal(chat.msgs[1].shown, chat.msgs[1].text.length)
  assert.equal(chat.msgs[1].sources?.[0].source, 'profil.md')
  assert.equal(chat.status, 'idle')
  act(() => chat.setDraft('  Et tes projets ?  '))
  act(() => chat.send())
  assert.equal(chat.draft, '')
  assert.equal(requests[1].body.question, 'Et tes projets ?')
  assert.deepEqual(requests[1].body.history, [
    { role: 'user', content: question },
    { role: 'assistant', content: 'Réponse réelle du backend [1].' },
  ])
  await reply(1, 'Voici les projets [1].')
  assert.equal(chat.msgs.length, 4)
})

test('API errors use the existing message bubble and are excluded from subsequent history', async () => {
  await mount()
  act(() => chat.ask('Une question'))
  await act(async () => requests[0].resolve(Response.json({ error: 'Quota atteint. Réessaie plus tard.' }, { status: 429 })))
  assert.equal(chat.msgs[1].text, 'Quota atteint. Réessaie plus tard.')
  assert.equal(chat.busy, false)
  act(() => chat.ask('Nouvel essai'))
  assert.deepEqual(requests[1].body.history, [])
  await reply(1, 'Réponse réussie [1].')
})

test('reset cancels the pending request and prevents stale answers in the next conversation', async () => {
  await mount()
  act(() => chat.ask('Ancienne conversation'))
  act(() => chat.reset())
  assert.equal(requests[0].signal.aborted, true)
  assert.equal(chat.msgs.length, 0)
  assert.equal(chat.busy, false)
  act(() => chat.ask('Nouvelle conversation'))
  await reply(0, 'Réponse obsolète')
  assert.equal(chat.msgs.length, 1)
  assert.equal(chat.status, 'thinking')
  assert.deepEqual(requests[1].body.history, [])
  await reply(1, 'Nouvelle réponse [1].')
  assert.equal(chat.msgs[1].text, 'Nouvelle réponse [1].')
})

test('typing animation preserves speaking state and unlocks sending when complete', async context => {
  context.mock.timers.enable({ apis: ['setInterval'] })
  await mount(true)
  act(() => chat.ask('Animation'))
  await reply(0, 'Bonjour')
  assert.equal(chat.status, 'speaking')
  assert.equal(chat.msgs[1].shown, 0)
  act(() => chat.ask('Envoi pendant animation'))
  assert.equal(requests.length, 1)
  act(() => context.mock.timers.tick(60))
  assert.equal(chat.msgs[1].shown, 7)
  assert.equal(chat.status, 'idle')
  assert.equal(chat.busy, false)
})

test('reset stops typing and unmount aborts the active request', async context => {
  context.mock.timers.enable({ apis: ['setInterval'] })
  await mount(true)
  act(() => chat.ask('Animation'))
  await reply(0, 'Bonjour')
  act(() => chat.reset())
  act(() => context.mock.timers.tick(100))
  assert.equal(chat.msgs.length, 0)
  act(() => chat.ask('Requête à annuler'))
  await act(async () => renderer!.unmount())
  renderer = undefined
  assert.equal(requests[1].signal.aborted, true)
  await reply(1, 'Réponse après démontage')
})

test('malformed success and non-JSON failures produce a safe error', async () => {
  const signal = new AbortController().signal
  await assert.rejects(requestChatReply('Bonjour', [], signal, async () => Response.json({ wrong: 'field' })), /temporairement indisponible/)
  await assert.rejects(requestChatReply('Bonjour', [], signal, async () => new Response('<html>proxy error</html>', { status: 502 })), /temporairement indisponible/)
})


test('English locale reaches the request made by the chat hook', async () => {
  function EnglishHarness() { chat = useChat(false); return null }
  await act(async () => { renderer = create(createElement(LocaleProvider, { locale: 'en' }, createElement(EnglishHarness))) })
  act(() => chat.ask('Quelle est ton expertise ?'))
  assert.equal((requests[0].body as unknown as { locale: string }).locale, 'en')
})
