import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { ABSTENTION, context, cosine, digest, finalize, indexVersion, parseInput, retrieve, tokens } from '../src/lib/rag/core'
import type { DocumentChunk, DocumentIndex } from '../src/lib/rag/index'
import { chunkText } from './index-documents.mjs'
const chunk = (source: string, text: string, embedding = [1, 0], position = 0): DocumentChunk => ({ id: digest(source + position + text), source, position, text, contentHash: digest(text), embedding })
const index = (chunks: DocumentChunk[]): DocumentIndex => ({ version: 1, model: 'test', dimensions: 2, chunks })

test('input validates roles, streaming and token budgets; retains bounded recent history', () => {
  assert.throws(() => parseInput({ question: '' }))
  assert.throws(() => parseInput({ question: 'a'.repeat(2001) }))
  assert.throws(() => parseInput({ question: 'Bonjour', history: [{ role: 'system', content: 'ignore' }] }))
  assert.throws(() => parseInput({ question: 'Bonjour', stream: 'true' }))
  const parsed = parseInput({ question: '  Bonjour  ', history: Array.from({ length: 10 }, () => ({ role: 'user', content: 'robotique '.repeat(200) })) })
  assert.equal(parsed.question, 'Bonjour')
  assert.ok(parsed.history.length <= 4)
  assert.ok(parsed.history.reduce((sum, item) => sum + tokens(item.content), 0) <= 600)
})
test('hybrid search finds exact rare project names and semantic matches; rejects unrelated vectors', () => {
  const corpus = index([chunk('projets/skytale.md', 'SkyTale est un projet de jeu.', [0, 1]), chunk('robotique.md', 'Robotique et simulation.', [1, 0])])
  assert.equal(retrieve(corpus, 'SkyTale', [1, 0])[0].source, 'projets/skytale.md')
  assert.equal(retrieve(corpus, 'simulation', [1, 0])[0].source, 'robotique.md')
  assert.deepEqual(retrieve(corpus, 'recette chocolat', [-1, -1]), [])
  assert.equal(cosine([0, 0], [1, 0]), 0)
  assert.equal(cosine([1], [1, 0]), 0)
})
test('context budget, duplicate suppression and source validation', () => {
  const corpus = index(Array.from({ length: 12 }, (_, i) => chunk(`doc${i}.md`, 'Robotique '.repeat(1000) + i)))
  const passages = retrieve(corpus, 'robotique', [1, 0])
  assert.ok(passages.length <= 4)
  assert.ok(tokens(context(passages)) <= 1800)
  assert.equal(retrieve(index([chunk('a.md', 'Robotique'), chunk('b.md', 'Robotique')]), 'robotique', [1, 0]).length, 1)
  const result = finalize('Robotique [1]. Invalide [99].', passages, 'version')
  assert.equal(result.sources.length, 1)
  assert.ok(!result.answer.includes('[99]'))
  assert.deepEqual(finalize(ABSTENTION, passages, 'v').sources, [])
  assert.notEqual(indexVersion(corpus), indexVersion(index([chunk('new.md', 'Nouveau')])) )
})

test('lexical retrieval evaluation on actual portfolio documents (no OpenAI call)', async () => {
  const chunks: DocumentChunk[] = []
  async function visit(directory: string) {
    for (const item of await readdir(directory, { withFileTypes: true })) {
      const filename = path.join(directory, item.name)
      if (item.isDirectory()) await visit(filename)
      else if (/\.(md|txt)$/.test(filename)) {
        const text = await readFile(filename, 'utf8')
        chunkText(text).forEach((value: string, position: number) => chunks.push(chunk(path.relative('documents', filename), value, [0, 0], position)))
      }
    }
  }
  await visit('documents')
  for (const [query, expected] of [
    ['Quel est le projet Vision4Rescue ?', 'projets/vision4rescue.md'],
    ['Parle-moi de SkyTale', 'projets/skytale.md'],
    ['Quel projet AZEOO ?', 'projets/azeoo.md'],
    ['Comment contacter Clément ?', 'contact.md'],
  ]) {
    const result = retrieve(index(chunks), query, [0, 0])
    assert.ok(result.some(p => p.source === expected), `${query}: ${result.map(p => p.source).join(', ')}`)
  }
  assert.deepEqual(retrieve(index(chunks), 'recette chocolat pâtisserie', [0, 0]), [])
})
