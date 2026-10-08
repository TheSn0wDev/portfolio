import { notFound } from 'next/navigation'
import { PortfolioRoot } from '@/components/PortfolioRoot'
import { isLocale } from '@/i18n/locale'
import { absoluteUrl, seoMetadata, serializeJsonLd } from '@/lib/seo/site'
import { contact } from '@/content/contact'

type Props = { params: Promise<{ locale: string }> }
export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  return seoMetadata(locale,
    locale === 'fr' ? 'Développeur backend & IA générative | Clément Ozor' : 'Backend & GenAI Software Engineer | Clément Ozor',
    locale === 'fr'
      ? 'Développeur backend chez Thales, je crée des projets RAG et des agents IA autonomes. Disponible début 2027 pour une mission backend ou GenAI.'
      : 'Backend engineer at Thales, building RAG assistants and autonomous AI agents. Available early 2027 for a backend or GenAI engagement.')
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const schema = {
    '@context': 'https://schema.org', '@type': 'ProfilePage',
    url: absoluteUrl(`/${locale}`), inLanguage: locale,
    mainEntity: {
      '@type': 'Person', name: 'Clément Ozor', url: absoluteUrl(`/${locale}`),
      jobTitle: 'Backend Software Engineer',
      sameAs: [contact.linkedin.url, contact.github.url],
      knowsAbout: ['Go', 'Python', 'TypeScript', 'RAG', 'LLM', 'LangChain', 'LangGraph', 'AI agents'],
    },
  }
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} /><PortfolioRoot key={locale} /></>
}
