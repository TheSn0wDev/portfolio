import 'server-only'
import index from '../../../data/rag-index.json'

export type DocumentChunk = {
  id: string
  source: string
  position: number
  text: string
  contentHash: string
  embedding: number[]
}

export type DocumentIndex = {
  version: number
  model: string
  dimensions: number
  chunking?: { maxCharacters: number; overlapCharacters: number }
  documents?: { source: string; contentHash: string; chunks: number }[]
  chunks: DocumentChunk[]
}

// Keep this import in server components or route handlers only.
export function getDocumentIndex(): DocumentIndex {
  return index
}
