import { ImageResponse } from 'next/og'
import { seoSlugs } from '@/content/seo-pages'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const en = searchParams.get('locale') === 'en'
  const slug = searchParams.get('slug') ?? ''
  if (slug && !seoSlugs.some(value => value === slug)) return new Response('Not found', { status: 404 })
  const topic = slug === 'personal-rag' ? (en ? 'RAG assistants with citations' : 'Assistants RAG et réponses sourcées')
    : slug === 'agents-ia-autonomes' ? (en ? 'Autonomous AI agents' : 'Agents IA autonomes')
    : slug === 'mission-genai' ? (en ? 'Backend & GenAI engagements' : 'Missions backend & GenAI')
    : (en ? 'Backend & GenAI Engineer' : 'Développeur backend & IA générative')
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 70, background: '#F8FAFC', color: '#0F172A', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', fontSize: 26, color: '#2563EB' }}>Go · Python · TypeScript · RAG · AI agents</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', fontSize: 80, fontWeight: 700 }}>Clément Ozor</div>
        <div style={{ display: 'flex', fontSize: 44, color: '#2563EB' }}>{topic}</div>
      </div>
      <div style={{ display: 'flex', fontSize: 25 }}>{en ? 'Projects, architecture & demos' : 'Projets, architecture & démonstrations'}</div>
    </div>,
    { width: 1200, height: 630 },
  )
}
