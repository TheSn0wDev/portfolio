import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const MODEL = 'text-embedding-3-small'
export const DIMENSIONS = 1536
const hash = (text) => createHash('sha256').update(text).digest('hex')

export function chunkText(text) {
  const characters = Array.from(text.replace(/\r\n?/g, '\n').trim())
  const chunks = []
  for (let start = 0; start < characters.length; start += 1600) {
    const chunk = characters.slice(start, start + 1800).join('').trim()
    if (chunk) chunks.push(chunk)
    if (start + 1800 >= characters.length) break
  }
  return chunks
}

async function listDocuments(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = []
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))) {
    if (entry.name.startsWith('.')) continue
    const filename = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await listDocuments(filename))
    else if (entry.isFile() && /\.(md|txt)$/i.test(entry.name)) files.push(filename)
  }
  return files
}

export async function indexDocuments({
  documentsDirectory = path.resolve('documents'),
  outputFile = path.resolve('data/rag-index.json'),
  apiKey = process.env.OPENAI_API_KEY,
  fetchImpl = fetch,
} = {}) {
  let previous
  let previousBytes
  try {
    previousBytes = await readFile(outputFile, 'utf8')
    previous = JSON.parse(previousBytes)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const cache = new Map()
  if (previous?.model === MODEL && previous?.dimensions === DIMENSIONS) {
    for (const chunk of previous.chunks ?? []) {
      if (chunk.contentHash === hash(chunk.text) && validEmbedding(chunk.embedding)) {
        cache.set(chunk.contentHash, chunk.embedding)
      }
    }
  }

  const chunks = []
  const documents = []
  for (const filename of await listDocuments(documentsDirectory)) {
    const source = path.relative(documentsDirectory, filename).split(path.sep).join('/')
    const text = await readFile(filename, 'utf8')
    const passages = chunkText(text)
    documents.push({ source, contentHash: hash(text.replace(/\r\n?/g, '\n').trim()), chunks: passages.length })
    for (const [position, content] of passages.entries()) {
      const contentHash = hash(content)
      chunks.push({
        id: hash(`${source}:${position}:${contentHash}`),
        source,
        position,
        text: content,
        contentHash,
      })
    }
  }

  const pending = [...new Map(chunks.filter((chunk) => !cache.has(chunk.contentHash))
    .map((chunk) => [chunk.contentHash, chunk])).values()]
  if (pending.length && !apiKey) {
    throw new Error('OPENAI_API_KEY est requise pour indexer les nouveaux passages.')
  }
  for (let start = 0; start < pending.length; start += 32) {
    const batch = pending.slice(start, start + 32)
    const response = await fetchImpl('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: MODEL, dimensions: DIMENSIONS, input: batch.map((chunk) => chunk.text) }),
      signal: AbortSignal.timeout(60_000),
    })
    if (!response.ok) throw new Error(`Échec OpenAI embeddings (HTTP ${response.status}). Index précédent conservé.`)
    const result = await response.json()
    if (!Array.isArray(result.data) || result.data.length !== batch.length) {
      throw new Error('Réponse OpenAI incomplète. Index précédent conservé.')
    }
    for (let position = 0; position < batch.length; position++) {
      const item = result.data.find((entry) => entry.index === position)
      if (!validEmbedding(item?.embedding)) throw new Error('Embedding OpenAI invalide.')
      cache.set(batch[position].contentHash, item.embedding)
    }
  }

  const index = {
    version: 1,
    model: MODEL,
    dimensions: DIMENSIONS,
    chunking: { maxCharacters: 1800, overlapCharacters: 200 },
    documents,
    chunks: chunks.map((chunk) => ({ ...chunk, embedding: cache.get(chunk.contentHash) })),
  }
  const bytes = JSON.stringify(index) + '\n'
  if (bytes === previousBytes) {
    console.log(`Index inchangé : ${documents.length} documents, ${chunks.length} passages, aucun appel OpenAI, aucune écriture.`)
    return index
  }
  await mkdir(path.dirname(outputFile), { recursive: true })
  const temporaryFile = `${outputFile}.${process.pid}.tmp`
  await writeFile(temporaryFile, bytes)
  await rename(temporaryFile, outputFile)
  console.log(`Index : ${documents.length} documents, ${chunks.length} passages, ${pending.length} nouveaux embeddings uniques, ${chunks.filter(c => !pending.some(p => p.contentHash === c.contentHash)).length} passages réutilisés.`)
  return index
}

function validEmbedding(embedding) {
  return Array.isArray(embedding) && embedding.length === DIMENSIONS && embedding.every(Number.isFinite)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // Load local secrets only for the CLI; exported functions remain testable without them.
  for (const filename of ['.env.local', '.env']) {
    try { process.loadEnvFile(filename) } catch (error) { if (error.code !== 'ENOENT') throw error }
  }
  await indexDocuments()
}
