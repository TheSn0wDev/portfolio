import type { MetadataRoute } from 'next'
import { absoluteUrl } from '@/lib/seo/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: process.env.VERCEL_ENV === 'preview'
      ? { userAgent: '*', disallow: '/' }
      : { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  }
}
