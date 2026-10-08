'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import styles from './portfolio.module.css'
import kit from './SeoPageKit.module.css'
import { DotGrid } from './DotGrid'
import { Marquee } from './Marquee'
import { Orb } from './Orb'
import { ArrowRightIcon, DiagonalArrowIcon } from './icons'
import { Crumbs, DarkSection, HandNote, NextSection, SeoPageShell, SplitSection, StatusCard } from './SeoPageKit'
import { useTilt } from '@/hooks/useTilt'
import { useContent, useLocale } from '@/i18n/LocaleProvider'
import * as profileContent from '@/content/profile'
import type { SeoPage } from '@/content/seo-pages'

type MissionPageProps = {
  page: SeoPage
  related: { slug: string; label: string }[]
}

// The projects the "Projects" band points to, by page slug.
const showcase = [
  { slug: 'personal-rag', name: 'Personal RAG' },
  { slug: 'agents-ia-autonomes', name: 'LevelPilot' },
]

// Splits the heading around `highlight` and gives every word its own rising
// span ; spaces stay as text so the h1 still reads as one sentence.
function headlineWords(heading: string, highlight?: string) {
  const at = highlight ? heading.indexOf(highlight) : -1
  const parts = at < 0 ? [{ text: heading, hl: false }] : [
    { text: heading.slice(0, at), hl: false },
    { text: highlight!, hl: true },
    { text: heading.slice(at + highlight!.length), hl: false },
  ]
  let word = 0
  return parts.flatMap(part => part.text.split(/(\s+)/).filter(Boolean).map(text => ({
    text, hl: part.hl, space: /^\s+$/.test(text),
    delay: /^\s+$/.test(text) ? '' : `${(0.1 + word++ * 0.06).toFixed(2)}s`,
  })))
}

export function MissionPage({ page, related }: MissionPageProps) {
  const locale = useLocale()
  const en = locale === 'en'
  const { availability, heroChips } = useContent(profileContent)
  const linkedin = page.links[0]
  const [foundations, contributions, projects, arrangement] = page.sections
  const labels = en ? ['Foundations', 'Contributions', 'Projects', 'Arrangement'] : ['Socle', 'Contributions', 'Projets', 'Modalités']
  const pages = Object.fromEntries(related.map(item => [item.slug, item.label]))

  return (
    <SeoPageShell>
      {({ armed, motionEnabled, heroRef }) => <>
        <section ref={heroRef} className={kit.hero}>
          <DotGrid />
          <div className={kit.wrap}>
            <Crumbs trail={[{ label: 'Portfolio', href: `/${locale}` }, { label: page.label }]} />
            <div className={styles.rise} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, animationDelay: '.05s' }}>
              <span className={`${styles.chip} ${kit.live}`}><span className={styles.pulse} />{availability}</span>
              {heroChips.map(chip => <span key={chip} className={`${styles.chip} ${styles.chipW}`}>{chip}</span>)}
            </div>

            <h1 className={`${styles.disp} ${styles.name} ${kit.headline}`}>
              {headlineWords(page.heading, page.highlight).map((word, i) => word.space
                ? word.text
                : <span key={i} className={`${kit.word} ${word.hl ? kit.wordHl : ''}`} style={{ animationDelay: word.delay }}>{word.text}</span>)}
            </h1>

            <div className={kit.heroGrid}>
              <div className={kit.heroText}>
                <p className={`${styles.rise} ${kit.intro}`} style={{ animationDelay: '.65s' }}>{page.intro}</p>
                <div className={`${styles.rise} ${styles.ctaRow}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animationDelay: '.75s' }}>
                  <a className={`${styles.btn} ${styles.btnP}`} href="#contact">
                    {en ? 'Get in touch' : 'Me contacter'} <ArrowRightIcon className={styles.arr} />
                  </a>
                  {linkedin && <a className={`${styles.btn} ${styles.btnG}`} href={linkedin.href} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                </div>
                <StatusCard text={page.status} />
              </div>

              <div className={`${styles.rise} ${kit.stageCol}`} style={{ animationDelay: '.45s' }}>
                <HandNote lines={page.tagline} flip />
                <MissionTicket page={page} motionEnabled={motionEnabled} en={en} />
              </div>
            </div>
          </div>
        </section>

        <Marquee items={page.stack} />

        {foundations && <SplitSection armed={armed} index={1} label={labels[0]} section={foundations} />}
        {contributions && <SplitSection armed={armed} index={2} label={labels[1]} section={contributions} />}
        {projects && (
          <DarkSection armed={armed} index={3} label={labels[2]} section={projects}>
            <div className={kit.showcase}>
              {showcase.map(item => (
                <Link key={item.slug} className={kit.showcaseCard} href={`/${locale}/${item.slug}`}>
                  <span className={kit.repoKind}>{item.name}</span>
                  <span className={`${styles.disp} ${kit.showcaseTitle}`}>{pages[item.slug] ?? item.name}</span>
                  <span className={kit.showcaseArr}><DiagonalArrowIcon className={styles.arr} /></span>
                </Link>
              ))}
            </div>
          </DarkSection>
        )}
        {arrangement && <SplitSection armed={armed} index={4} label={labels[3]} section={arrangement} last="callout" />}
        <NextSection armed={armed} index={5} page={page} related={related} />
      </>}
    </SeoPageShell>
  )
}

// Jagged tear profile : one depth in [0, 1] per step along the line, fixed so
// the server and client renders agree.
const TEAR_STEPS = 32
const tearProfile = Array.from({ length: TEAR_STEPS + 1 }, (_, i) => {
  const r = Math.sin(i * 12.9898 + 4.1414) * 43758.5453
  return (i % 2 ? 0.15 : 0.55) + (r - Math.floor(r)) * 0.45
})

// Clip-path for one half : its edge on the tear line follows the jagged
// profile over the torn stretch and stays straight past the tear tip. Every
// polygon has the same point count, so healing can transition between them.
function tearClip(progress: number, dir: 1 | -1, edge: 'bottom' | 'top') {
  const from = dir === 1 ? 0 : 1 - progress
  const to = dir === 1 ? progress : 1
  const xs = tearProfile.map((_, i) => i / TEAR_STEPS)
  const tip = dir === 1 ? progress : 1 - progress
  const points = [...xs.map((x, i) => ({ x, i })), { x: tip, i: -1 }].sort((a, b) => a.x - b.x).map(({ x, i }) => {
    const torn = i >= 0 && x >= from && x <= to && progress > 0
    const depth = torn ? 0.5 + 3.5 * (edge === 'bottom' ? tearProfile[i] : 1 - tearProfile[i]) : 0
    return edge === 'bottom'
      ? `${(x * 100).toFixed(2)}% calc(100% - ${depth.toFixed(1)}px)`
      : `${(x * 100).toFixed(2)}% ${depth.toFixed(1)}px`
  })
  return edge === 'bottom'
    ? `polygon(0 0, 100% 0, ${points.reverse().join(', ')})`
    : `polygon(${points.join(', ')}, 100% 100%, 0 100%)`
}

type TearState = 'idle' | 'tearing' | 'healing' | 'torn'

// Dragging along the perforation tears the stub off ; a full tear drops it
// and scrolls to the contact footer, then the ticket mends itself.
function useTear(motionEnabled: boolean) {
  const [state, setState] = useState<TearState>('idle')
  const [progress, setProgress] = useState(0)
  const [dir, setDir] = useState<1 | -1>(1)
  const drag = useRef<{ id: number; x: number; width: number; dir: 0 | 1 | -1 } | null>(null)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (state === 'torn' || (e.pointerType === 'mouse' && e.button !== 0)) return
    const ticket = e.currentTarget.closest('[data-ticket]') as HTMLElement | null
    ticket?.style.setProperty('--rx', '0deg')
    ticket?.style.setProperty('--ry', '0deg')
    e.currentTarget.setPointerCapture(e.pointerId)
    drag.current = { id: e.pointerId, x: e.clientX, width: ticket?.offsetWidth ?? 400, dir: 0 }
  }

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    const dx = e.clientX - d.x
    if (!d.dir) {
      if (Math.abs(dx) < 6) return
      d.dir = dx > 0 ? 1 : -1
      setDir(d.dir)
      setState('tearing')
    }
    const next = Math.min(1, Math.max(0, (dx * d.dir) / (d.width * 0.75)))
    setProgress(next)
    if (next < 1) return
    drag.current = null
    setState('torn')
    navigator.vibrate?.(30)
    later(() => document.getElementById('contact')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'auto' }), motionEnabled ? 550 : 0)
    later(() => { setProgress(0); setState('idle') }, 4000)
  }

  const onPointerUp = (e: PointerEvent<HTMLElement>) => {
    if (drag.current?.id !== e.pointerId) return
    const started = drag.current.dir !== 0
    drag.current = null
    if (!started) return
    setProgress(0)
    setState('healing')
    later(() => setState(s => s === 'healing' ? 'idle' : s), 450)
  }

  return {
    state, progress, dir,
    handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp },
  }
}

// The engagement as a boarding pass : role up top, a cycling focus line,
// a perforated tear line, then the practical details.
function MissionTicket({ page, motionEnabled, en }: { page: SeoPage; motionEnabled: boolean; en: boolean }) {
  const tilt = useTilt(motionEnabled)
  const tear = useTear(motionEnabled)
  const [role, ...facts] = page.facts ?? []
  const focus = page.stack.slice(-5)
  const busy = tear.state !== 'idle'
  const topRef = useRef<HTMLDivElement>(null)

  // Publishes where the tear line sits, so the glare can cut the notches too.
  useEffect(() => {
    const top = topRef.current
    const ticket = top?.parentElement
    if (!top || !ticket) return
    const observer = new ResizeObserver(() => ticket.style.setProperty('--tear-y', `${top.offsetHeight}px`))
    observer.observe(top)
    return () => observer.disconnect()
  }, [])
  const angle = tear.progress ** 1.5 * 4 * -tear.dir
  return (
    <div
      className={`${styles.tilt} ${kit.ticket}`}
      data-ticket=""
      data-tear={busy ? tear.state : undefined}
      onMouseMove={tear.state === 'tearing' ? undefined : tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
    >
      <span className={`${styles.glare} ${kit.ticketGlare}`} />
      <div ref={topRef} className={kit.ticketTop} style={{ clipPath: tearClip(tear.progress, tear.dir, 'bottom') }}>
        <div className={kit.ticketHead}>
          <Orb size="sm" />
          <span className={kit.ticketKind}>{en ? 'Engagement sought' : 'Mission recherchée'}</span>
          <span className={kit.ticketOpen}><span className={styles.pulse} />{en ? 'Open' : 'Ouvert'}</span>
        </div>
        {role && <p className={`${styles.disp} ${kit.ticketRole}`}>{role.value}</p>}
        <p className={kit.ticketFocus}>
          <span>Focus</span>
          <span className={kit.focusWords} style={{ '--n': focus.length } as CSSProperties} aria-label={focus.join(', ')}>
            {focus.map((word, i) => <span key={word} aria-hidden="true" style={{ animationDelay: `${i * 2}s` }}>{word}</span>)}
          </span>
        </p>
      </div>
      <div className={kit.tear} aria-hidden="true">
        <span
          className={kit.tearLine}
          style={{ clipPath: tear.dir === 1 ? `inset(0 0 0 ${tear.progress * 100}%)` : `inset(0 ${tear.progress * 100}% 0 0)` }}
        />
        <span className={kit.tearHint}>{en ? '← Drag to tear →' : '← Glisser pour déchirer →'}</span>
        <span className={kit.tearHit} data-pcut="" {...tear.handlers} />
      </div>
      <div
        className={kit.ticketStub}
        style={{
          clipPath: tearClip(tear.progress, tear.dir, 'top'),
          transformOrigin: tear.dir === 1 ? '100% 0' : '0 0',
          transform: tear.state === 'torn'
            ? `translateY(160px) rotate(${-tear.dir * 14}deg)`
            : `rotate(${angle.toFixed(2)}deg)`,
        }}
      >
        <dl className={kit.ticketFacts}>
          {facts.map(fact => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <div className={kit.barcode} aria-hidden="true" />
      </div>
    </div>
  )
}
