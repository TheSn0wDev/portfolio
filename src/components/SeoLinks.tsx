'use client'

import Link from 'next/link'
import { useLocale } from '@/i18n/LocaleProvider'
import styles from './SeoPage.module.css'

const links = [
  { slug: 'personal-rag', fr: 'Assistants documentaires RAG', en: 'Document RAG assistants', descriptionFr: 'Indexation, recherche hybride et réponses sourcées : les choix derrière Personal RAG.', descriptionEn: 'Indexing, hybrid search and cited answers: the decisions behind Personal RAG.' },
  { slug: 'agents-ia-autonomes', fr: 'Agents IA autonomes', en: 'Autonomous AI agents', descriptionFr: 'Les workflows backend de LevelPilot : autonomie configurable, permissions, tests et rollback.', descriptionEn: 'LevelPilot backend workflows: configurable autonomy, permissions, tests and rollback.' },
  { slug: 'mission-genai', fr: 'Mission backend & GenAI', en: 'Backend & GenAI engagement', descriptionFr: 'Mon expérience backend, mes projets GenAI et les modalités de la mission recherchée.', descriptionEn: 'My backend experience, GenAI projects and the engagement I am looking for.' },
]

export function SeoLinks() {
  const locale = useLocale()
  const en = locale === 'en'
  return <section className={styles.hub} id="genai">
    <h2>{en ? 'RAG & autonomous AI agents' : 'RAG & agents IA autonomes'}</h2>
    <p>{en ? 'Explore my personal GenAI projects, their architecture and the long-term engagement I am looking for.' : 'Découvrez mes projets personnels GenAI, leurs choix d’architecture et la mission longue que je recherche.'}</p>
    <nav aria-label={en ? 'GenAI projects and engagement' : 'Projets et mission GenAI'}>{links.map(link => <Link key={link.slug} href={`/${locale}/${link.slug}`}><strong>{en ? link.en : link.fr}</strong><span>{en ? link.descriptionEn : link.descriptionFr}</span></Link>)}</nav>
  </section>
}
