import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'
import { seoPages, seoSlugs } from '@/content/seo-pages'
import { accent, eyebrow, handwrittenTagline, heroChips, name } from '@/content/profile'
import { translate } from '@/i18n/messages'
import type { Locale } from '@/i18n/locale'

// Same tokens as portfolio.module.css; Satori cannot read CSS variables.
const ink = '#0b1533'
const line = '#dce3f2'
const soft = '#e9effd'
const chipText = '#1e4fbc'

// Satori needs TTF/OTF, so the site's Google fonts are vendored here.
const fontDir = join(process.cwd(), 'src/app/og/fonts')
const fonts = Promise.all([
  ['Archivo-Black.ttf', 'Archivo', 900],
  ['InstrumentSans-Medium.ttf', 'Instrument Sans', 500],
  ['InstrumentSans-SemiBold.ttf', 'Instrument Sans', 600],
  ['Caveat-Bold.ttf', 'Caveat', 700],
].map(async ([file, family, weight]) => ({
  name: family as string, weight: weight as 900 | 500 | 600 | 700, style: 'normal' as const,
  data: await readFile(join(fontDir, file as string)),
})))

type Card = {
  chips: string[]
  // Words of the display title; `hl` words take the accent.
  title: { text: string; hl: boolean }[]
  titleSize: number
  subtitle: string
  note: [string, string]
  stack: string[]
}

// One line at the widest size that fits, as on the site heroes. Archivo 900
// runs about 0.6em per lowercase glyph and 0.75em per capital.
function fit(text: string, max: number) {
  const em = /[a-z]/.test(text) ? 0.6 : 0.75
  return Math.round(Math.min(max, 1056 / (text.length * em)))
}

// Satori ignores background-size, so the `.dots` grid is drawn as an SVG.
const dots = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
<defs><pattern id="d" width="26" height="26" patternUnits="userSpaceOnUse"><circle cx="13" cy="13" r="1.5" fill="#c9d3ea"/></pattern>
<linearGradient id="f" x1="0" y1="0" x2="0" y2="1"><stop offset="0.3" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="m"><rect width="1200" height="630" fill="url(#f)"/></mask></defs>
<rect width="1200" height="630" fill="url(#d)" mask="url(#m)"/></svg>`)}`

function words(text: string, hl = false) {
  return text.split(/\s+/).filter(Boolean).map(word => ({ text: word, hl }))
}

// Mirrors the page heroes: the landing name, a project title whose last word
// takes the accent, or the mission heading with its highlight.
function card(locale: Locale, slug: string): Card {
  const page = seoPages[locale].find(entry => entry.slug === slug)
  const t = (text: string) => translate(text, locale)
  if (!page) {
    return {
      chips: heroChips.map(t),
      title: [{ text: name.line1, hl: false }, { text: name.line2, hl: true }],
      titleSize: fit(`${name.line1} ${name.line2}`, 150),
      subtitle: t(eyebrow),
      note: [t(handwrittenTagline[0]), t(handwrittenTagline[1])],
      stack: ['Go', 'Python', 'TypeScript', 'LangGraph', 'PostgreSQL'],
    }
  }
  const note = page.tagline ?? [page.label, '']
  const chips = [page.label]
  const split = page.heading.search(/\s?:\s/)
  if (page.highlight && page.heading.includes(page.highlight)) {
    const at = page.heading.indexOf(page.highlight)
    return {
      chips, note, stack: page.stack.slice(0, 5), subtitle: '', titleSize: 78,
      title: [...words(page.heading.slice(0, at)), ...words(page.highlight, true), ...words(page.heading.slice(at + page.highlight.length))],
    }
  }
  const title = split > 0 ? page.heading.slice(0, split) : page.heading
  const titleWords = words(title).map((word, i, all) => ({ ...word, hl: i > 0 && i === all.length - 1 }))
  return {
    chips, note, stack: page.stack.slice(0, 5), titleSize: fit(title, 150),
    title: titleWords,
    subtitle: split > 0 ? page.heading.slice(split).replace(/^\s?:\s/, '') : '',
  }
}

function Orb() {
  return (
    <div style={{
      display: 'flex', width: 56, height: 56, borderRadius: 999,
      backgroundColor: ink,
      backgroundImage: [
        'radial-gradient(circle at 32% 26%, rgba(255,255,255,0.55), rgba(255,255,255,0) 30%)',
        `radial-gradient(circle at 30% 40%, ${accent}, rgba(37,99,235,0) 55%)`,
        'radial-gradient(circle at 74% 50%, #22d3ee, rgba(34,211,238,0) 50%)',
        'radial-gradient(circle at 46% 82%, #a855f7, rgba(168,85,247,0) 50%)',
        'radial-gradient(circle at 50% 45%, #1a2a5e, #0b1533 72%)',
      ].join(', '),
      boxShadow: '0 10px 24px -10px rgba(37,99,235,0.8)',
    }} />
  )
}

function SwishArrow() {
  return (
    <svg width="50" height="60" viewBox="0 0 44 52" fill="none">
      <path d="M6 4 C 30 8, 40 26, 22 46 M22 46 L 20 34 M22 46 L 33 41" stroke={accent} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const locale: Locale = searchParams.get('locale') === 'en' ? 'en' : 'fr'
  const slug = searchParams.get('slug') ?? ''
  if (slug && !seoSlugs.some(value => value === slug)) return new Response('Not found', { status: 404 })
  const c = card(locale, slug)
  const display = 'Archivo'

  return new ImageResponse(
    <div style={{
      width: '100%', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative',
      padding: '52px 72px 56px', backgroundColor: '#fbfcff', color: ink, fontFamily: 'Instrument Sans', fontWeight: 500,
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={dots} width={1200} height={630} alt="" style={{ position: 'absolute', top: 0, left: 0 }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Orb />
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 600, letterSpacing: '-0.01em' }}>Clément Ozor</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {c.chips.map(chip => (
            <div key={chip} style={{ display: 'flex', alignItems: 'center', height: 44, padding: '0 20px', borderRadius: 999, backgroundColor: soft, color: chipText, fontSize: 20, fontWeight: 600 }}>{chip}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', gap: 22 }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', columnGap: '0.24em', maxWidth: 1056, marginTop: -8,
          fontFamily: display, fontWeight: 900, fontSize: c.titleSize, lineHeight: 0.95, letterSpacing: '-0.035em',
        }}>
          {c.title.map((word, i) => <span key={i} style={{ color: word.hl ? accent : ink }}>{word.text}</span>)}
        </div>
        {c.subtitle && <div style={{ display: 'flex', fontSize: 38, fontWeight: 600, letterSpacing: '0.01em', color: ink }}>{c.subtitle}</div>}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, transform: 'rotate(-4deg)', transformOrigin: 'left bottom', marginLeft: 6 }}>
            <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Caveat', fontWeight: 700, fontSize: 40, lineHeight: 0.95, color: accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              <span>{c.note[0]}</span>
              {c.note[1] && <span>{c.note[1]}</span>}
            </div>
            <SwishArrow />
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {c.stack.map(tech => (
              <div key={tech} style={{ display: 'flex', alignItems: 'center', height: 40, padding: '0 18px', borderRadius: 999, backgroundColor: '#fff', border: `1.5px solid ${line}`, color: ink, fontSize: 19, fontWeight: 600 }}>{tech}</div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts: await fonts },
  )
}
