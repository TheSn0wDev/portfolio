import type { MetadataRoute } from 'next'
import { seoSlugs } from '@/content/seo-pages'
import { absoluteUrl, pageAlternates } from '@/lib/seo/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', ...seoSlugs].flatMap(slug => (['fr', 'en'] as const).map(locale => ({
    url: absoluteUrl(`/${locale}${slug ? `/${slug}` : ''}`),
    alternates: { languages: pageAlternates(locale, slug).languages },
  })))
}
