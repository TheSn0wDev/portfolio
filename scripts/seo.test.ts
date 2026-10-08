import assert from 'node:assert/strict'
import test from 'node:test'
import { siteOrigin, pageAlternates, seoMetadata, serializeJsonLd } from '../src/lib/seo/site'
import sitemap from '../src/app/sitemap'
import robots from '../src/app/robots'
import { seoDemos } from '../src/content/seo-demos'
import { seoPages, seoSlugs } from '../src/content/seo-pages'

// Isolate origin configuration from the developer's shell.
const saved = { SITE_URL: process.env.SITE_URL, VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL, VERCEL_ENV: process.env.VERCEL_ENV }
test.after(() => { for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value } })

test('production uses the stable origin and rejects unsafe or missing configuration', () => {
  delete process.env.SITE_URL
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL
  process.env.VERCEL_ENV = 'production'
  assert.throws(siteOrigin, /Configure/)
  process.env.VERCEL_PROJECT_PRODUCTION_URL = 'portfolio.vercel.app'
  assert.equal(siteOrigin().origin, 'https://portfolio.vercel.app')
  process.env.SITE_URL = 'https://portfolio.example'
  assert.equal(siteOrigin().origin, 'https://portfolio.example')
  process.env.SITE_URL = ' portfolio-thesn0wdev.vercel.app ';
  assert.equal(siteOrigin().origin, 'https://portfolio-thesn0wdev.vercel.app')
  process.env.SITE_URL = '"private-invalid-value"'
  assert.throws(siteOrigin, error => error instanceof Error && /Invalid site origin/.test(error.message) && !error.message.includes('private-invalid-value'))
  for (const value of ['https://portfolio.example/path', 'https://user:pass@portfolio.example', 'javascript:alert(1)', 'http://localhost:3000', 'https://portfolio.example?x=1']) {
    process.env.SITE_URL = value
    assert.throws(siteOrigin)
  }
  process.env.SITE_URL = 'https://portfolio.example'
})

test('each sitemap URL has reciprocal, self-referencing, absolute language alternatives', () => {
  process.env.SITE_URL = 'https://portfolio.example'
  const entries = sitemap()
  assert.equal(entries.length, 8)
  const urls = new Set(entries.map(entry => entry.url))
  assert.equal(urls.size, 8)
  for (const slug of ['', ...seoSlugs]) {
    const fr = pageAlternates('fr', slug)
    const en = pageAlternates('en', slug)
    assert.deepEqual(fr.languages, en.languages)
    assert.equal(fr.canonical, fr.languages.fr)
    assert.equal(en.canonical, en.languages.en)
    assert.equal(fr.languages['x-default'], fr.canonical)
  }
  for (const entry of entries) for (const alternate of Object.values(entry.alternates!.languages!)) assert.ok(urls.has(String(alternate)))
  assert.equal(robots().sitemap, 'https://portfolio.example/sitemap.xml')
})

test('previews are noindex while production pages can be indexed', () => {
  process.env.VERCEL_ENV = 'preview'
  assert.deepEqual(robots().rules, { userAgent: '*', disallow: '/' })
  assert.deepEqual(seoMetadata('fr', 'Title', 'Description').robots, { index: false, follow: true })
  process.env.VERCEL_ENV = 'production'
  assert.deepEqual(seoMetadata('fr', 'Title', 'Description').robots, { index: true, follow: true })
})

test('translations cover the same routes with unique titles and script-safe JSON-LD', () => {
  const titles = new Set<string>()
  for (const locale of ['fr', 'en'] as const) {
    assert.deepEqual(seoPages[locale].map(page => page.slug), [...seoSlugs])
    for (const page of seoPages[locale]) {
      assert.ok(!titles.has(page.title))
      titles.add(page.title)
      assert.equal(page.sections.length, 4)
      assert.ok(!JSON.stringify(page).includes(String.fromCodePoint(0x2014)))
    }
  }
  const value = { text: '</script><script>alert(1)</script>' }
  const encoded = serializeJsonLd(value)
  assert.ok(!encoded.includes('<'))
  assert.deepEqual(JSON.parse(encoded), value)
})

test('sharing images are absolute and demos distinguish illustration from evidence', () => {
  process.env.SITE_URL = 'https://portfolio.example'
  const metadata = seoMetadata('en', 'Title', 'Description', 'agents-ia-autonomes')
  assert.ok(metadata.twitter && 'card' in metadata.twitter)
  assert.equal(metadata.twitter.card, 'summary_large_image')
  assert.deepEqual(metadata.twitter?.images, ['https://portfolio.example/og?locale=en&slug=agents-ia-autonomes&v=2'])
  for (const locale of ['fr', 'en'] as const) {
    assert.ok(seoDemos[locale]['agents-ia-autonomes'].paragraphs[0].includes(locale === 'fr' ? 'scénario fictif' : 'fictional scenario'))
    assert.ok(!JSON.stringify(seoDemos[locale]).includes(String.fromCodePoint(0x2014)))
  }
})
