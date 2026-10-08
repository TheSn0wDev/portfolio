import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { chunkText, DIMENSIONS, indexDocuments } from './index-documents.mjs'

test('chunks preserve Unicode and overlap without duplicating short documents', () => {
  assert.deepEqual(chunkText('  Bonjour\r\nmonde  '), ['Bonjour\nmonde'])
  assert.deepEqual(chunkText('   '), [])
  const chunks = chunkText('🧊'.repeat(2000))
  assert.equal(Array.from(chunks[0]).length, 1800)
  assert.equal(Array.from(chunks[1]).length, 400)
  assert.equal(chunks.join('').includes('\ufffd'), false)
})

test('index reuses embeddings, removes deleted content, and preserves output on API failure', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'portfolio-index-'))
  const outputFile = path.join(directory, 'index.json')
  const document = path.join(directory, 'cv.md')
  let calls = 0
  const fetchImpl = async (_url, options) => {
    calls++
    const body = JSON.parse(options.body)
    return Response.json({ data: body.input.map((_, index) => ({ index, embedding: Array(DIMENSIONS).fill(0.1) })) })
  }
  const options = { documentsDirectory: directory, outputFile, apiKey: 'test-only', fetchImpl }
  try {
    await writeFile(document, '# CV\nDéveloppeur React.')
    const initial = await indexDocuments(options)
    assert.equal(initial.chunks.length, 1)
    assert.equal(initial.chunks[0].source, 'cv.md')
    const repeated = await indexDocuments({ ...options, apiKey: undefined })
    assert.deepEqual(repeated, initial)
    assert.equal(calls, 1)
    await writeFile(document, '# CV\nNouveau contenu.')
    await assert.rejects(indexDocuments({ ...options, apiKey: undefined }), /OPENAI_API_KEY/)
    const before = await readFile(outputFile, 'utf8')
    await assert.rejects(indexDocuments({ ...options, fetchImpl: async () => new Response(null, { status: 429 }) }), /429/)
    assert.equal(await readFile(outputFile, 'utf8'), before)
    await rm(document)
    const empty = await indexDocuments({ ...options, apiKey: undefined })
    assert.deepEqual(empty.chunks, [])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('changed tail reuses preceding chunk; duplicates and renames reuse embeddings', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'portfolio-incremental-'))
  const outputFile = path.join(directory, 'index.json')
  const filename = path.join(directory, 'a.md')
  const inputs = []
  const options = { documentsDirectory: directory, outputFile, apiKey: 'test-only', fetchImpl: async (_url, options) => {
    const body = JSON.parse(options.body)
    inputs.push(...body.input)
    return Response.json({ data: body.input.map((_, index) => ({ index, embedding: Array(DIMENSIONS).fill(0.1) })) })
  } }
  try {
    await writeFile(filename, 'A'.repeat(1600) + 'B'.repeat(400))
    const initial = await indexDocuments(options)
    assert.equal(inputs.length, 2)
    await writeFile(filename, 'A'.repeat(1600) + 'B'.repeat(300) + 'C'.repeat(100))
    const changed = await indexDocuments(options)
    assert.equal(inputs.length, 3)
    assert.equal(changed.chunks[0].contentHash, initial.chunks[0].contentHash)
    const content = await readFile(filename, 'utf8')
    await writeFile(path.join(directory, 'renamed.md'), content)
    await rm(filename)
    const renamed = await indexDocuments({ ...options, apiKey: undefined })
    assert.equal(inputs.length, 3)
    assert.equal(renamed.chunks[0].source, 'renamed.md')
    await writeFile(path.join(directory, 'duplicate.md'), content)
    const duplicate = await indexDocuments({ ...options, apiKey: undefined })
    assert.equal(inputs.length, 3)
    assert.equal(duplicate.chunks.length, 4)
    assert.equal(duplicate.documents.length, 2)
    const before = await readFile(outputFile, 'utf8')
    await indexDocuments({ ...options, apiKey: undefined })
    assert.equal(await readFile(outputFile, 'utf8'), before)
  } finally { await rm(directory, { recursive: true, force: true }) }
})
