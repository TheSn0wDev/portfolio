import type { Metadata } from 'next'
import type { Locale } from '@/i18n/locale'

// Use the stable production origin, never the per-deployment VERCEL_URL.
export function siteOrigin(): URL {
  const configured = process.env.SITE_URL?.trim()
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  if (!configured && !productionHost && process.env.VERCEL_ENV === 'production') {
    throw new Error('Configure SITE_URL or VERCEL_PROJECT_PRODUCTION_URL before deploying.')
  }
  const url = new URL(configured || (productionHost ? `https://${productionHost}` : 'http://localhost:3000'))
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
    throw new Error('SITE_URL must be an HTTP(S) origin without credentials, path, query or fragment.')
  }
  if (process.env.VERCEL_ENV === 'production' && (url.protocol !== 'https:' || ['localhost', '127.0.0.1'].includes(url.hostname))) {
    throw new Error('Production SITE_URL must be a public HTTPS origin.')
  }
  return url
}

export function absoluteUrl(path: string): string {
  return new URL(path, siteOrigin()).href
}

export function pageAlternates(locale: Locale, slug = '') {
  const suffix = slug ? `/${slug}` : ''
  return {
    canonical: absoluteUrl(`/${locale}${suffix}`),
    languages: {
      fr: absoluteUrl(`/fr${suffix}`),
      en: absoluteUrl(`/en${suffix}`),
      'x-default': absoluteUrl(`/fr${suffix}`),
    },
  }
}

export function seoMetadata(locale: Locale, title: string, description: string, slug = ''): Metadata {
  const url = absoluteUrl(`/${locale}${slug ? `/${slug}` : ''}`)
  return {
    metadataBase: siteOrigin(), title, description,
    alternates: pageAlternates(locale, slug),
    robots: { index: process.env.VERCEL_ENV !== 'preview', follow: true },
    openGraph: { type: 'website', title, description, url, siteName: 'Clément Ozor', locale: locale === 'fr' ? 'fr_FR' : 'en_US', alternateLocale: locale === 'fr' ? 'en_US' : 'fr_FR', images: [{ url: absoluteUrl(`/og?locale=${locale}&slug=${slug}`), width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [absoluteUrl(`/og?locale=${locale}&slug=${slug}`)] },
  }
}

export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}
