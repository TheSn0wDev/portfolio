import assert from 'node:assert/strict'
import test from 'node:test'
import { preferredLocale } from '../src/i18n/locale'
import { parseInput, answerInstructions, abstention } from '../src/lib/rag/core'
import { requestChatReply } from '../src/lib/chat/client'

test('saved preference wins; browser preference uses quality and defaults to French', () => {
  assert.equal(preferredLocale('fr', 'en-US,en;q=0.9'), 'fr')
  assert.equal(preferredLocale('en', 'fr'), 'en')
  assert.equal(preferredLocale(undefined, 'fr;q=0.5,en-GB;q=0.9'), 'en')
  assert.equal(preferredLocale(undefined, 'de,en;q=0.5'), 'fr')
  assert.equal(preferredLocale(undefined, ''), 'fr')
})
test('chat validates locale and instructions follow page language regardless of question', () => {
  assert.equal(parseInput({ question: 'Bonjour', locale: 'en' }).locale, 'en')
  assert.throws(() => parseInput({ question: 'Hello', locale: 'de' }), /Langue invalide/)
  assert.match(answerInstructions('en'), /Always answer in English/)
  assert.match(answerInstructions('fr'), /toujours en français/)
  assert.match(abstention('en'), /Contact Clément/)
  assert.doesNotMatch(abstention('en'), /Je ne trouve/)
})
test('English page sends its locale with French questions and gets English fallback', async () => {
  const mock: typeof fetch = async (_url, options) => {
    assert.equal(JSON.parse(String(options?.body)).locale, 'en')
    return Response.json({}, { status: 503 })
  }
  await assert.rejects(requestChatReply('Bonjour', [], new AbortController().signal, mock, 'en'), /temporarily unavailable/)
})
