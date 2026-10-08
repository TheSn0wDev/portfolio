import { ProjectSeoPage } from '@/components/ProjectSeoPage'
import { MissionPage } from '@/components/MissionPage'
import { notFound } from 'next/navigation'
import { isLocale } from '@/i18n/locale'
import { getSeoPage, seoPages, seoSlugs } from '@/content/seo-pages'
import { absoluteUrl, seoMetadata, serializeJsonLd } from '@/lib/seo/site'

type Props = { params: Promise<{ locale: string; slug: string }> }

export function generateStaticParams() { return seoSlugs.map(slug => ({ slug })) }
export const dynamicParams = false

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const page = getSeoPage(locale, slug)
  if (!page) notFound()
  return seoMetadata(locale, page.title, page.description, slug)
}

export default async function GenAiPage({ params }: Props) {
  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()
  const page = getSeoPage(locale, slug)
  if (!page) notFound()
  const url = absoluteUrl(`/${locale}/${slug}`)
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebPage', '@id': url, url, name: page.heading, description: page.description, inLanguage: locale, author: { '@type': 'Person', name: 'Clément Ozor', url: absoluteUrl(`/${locale}`) } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Portfolio', item: absoluteUrl(`/${locale}`) },
        { '@type': 'ListItem', position: 2, name: page.label, item: url },
      ] },
    ],
  }
  const jsonLd = <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  const related = seoPages[locale].filter(item => item.slug !== slug).map(({ slug, label }) => ({ slug, label }))
  if (slug === 'mission-genai') return <>{jsonLd}<MissionPage page={page} related={related} /></>
  return <>{jsonLd}<ProjectSeoPage page={page} related={related} /></>
}
