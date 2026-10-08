'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import type { CSSProperties, ReactNode, RefObject } from 'react'
import styles from './portfolio.module.css'
import kit from './SeoPageKit.module.css'
import { CustomCursor } from './CustomCursor'
import { Header } from './Header'
import { Reveal } from './Reveal'
import { ContactSection } from './ContactSection'
import { BigDiagonalArrowIcon, DiagonalArrowIcon, SuitcaseIcon, SwishArrowIcon, TriangleIcon } from './icons'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useRevealArmed } from '@/hooks/useReveal'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'
import { usePointerFx } from '@/hooks/usePointerFx'
import { useLocale } from '@/i18n/LocaleProvider'
import { accent } from '@/content/profile'
import type { SeoPage, SeoSection } from '@/content/seo-pages'

// Building blocks shared by the GenAI landing pages : the landing's root
// (cursor, header, reveal, contact) and its section patterns.

export type ShellContext = { armed: boolean; motionEnabled: boolean; heroRef: RefObject<HTMLElement | null> }

export function SeoPageShell({ children }: { children: (ctx: ShellContext) => ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const noTimeline = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const motionEnabled = !useReducedMotion()
  const armed = useRevealArmed(motionEnabled)
  const scrolled = useHeaderScroll(rootRef, noTimeline, styles.tdotOn)
  usePointerFx({
    rootRef, heroRef, cursorRef, enabled: motionEnabled,
    bigClass: styles.curBig, dragClass: styles.curDrag, pressClass: styles.curPress,
    atStartClass: styles.curAtStart, atEndClass: styles.curAtEnd,
    cutClass: styles.curCut, flipClass: styles.curFlip,
  })
  const rootClassName = [styles.pf, armed ? styles.armed : '', motionEnabled ? '' : styles.still].filter(Boolean).join(' ')

  return (
    <div ref={rootRef} className={rootClassName} style={{ '--accent': accent } as CSSProperties}>
      <CustomCursor ref={cursorRef} />
      <Header scrolled={scrolled} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(v => !v)} onCloseMenu={() => setMenuOpen(false)} />
      <main id="main" tabIndex={-1}>{children({ armed, motionEnabled, heroRef })}</main>
      <div style={{ height: 'clamp(80px, 10vw, 144px)' }} />
      <ContactSection armed={armed} />
    </div>
  )
}

export function Crumbs({ trail }: { trail: { label: string; href?: string }[] }) {
  const en = useLocale() === 'en'
  return (
    <nav className={`${styles.rise} ${kit.crumbs}`} aria-label={en ? 'Breadcrumb' : 'Fil d’Ariane'}>
      <ol>
        {trail.map(item => <li key={item.label} aria-current={item.href ? undefined : 'page'}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : item.label}
        </li>)}
      </ol>
    </nav>
  )
}

// `flip` mirrors the arrow so its arc bends the other way.
export function HandNote({ lines, flip }: { lines?: [string, string]; flip?: boolean }) {
  if (!lines) return null
  return (
    <div className={`${kit.note} ${flip ? kit.noteFlip : ''}`} aria-hidden="true">
      <p className={styles.hand}>{lines[0]}<br />{lines[1]}</p>
      <SwishArrowIcon />
    </div>
  )
}

export function StatusCard({ text }: { text: string }) {
  const en = useLocale() === 'en'
  return (
    <div className={`${styles.rise} ${kit.statusCard}`} style={{ animationDelay: '.9s' }}>
      <span className={kit.statusIcon}><SuitcaseIcon /></span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className={kit.statusLabel}>{en ? 'Status' : 'Statut'}</span>
        <span className={kit.statusText}>{text}</span>
      </span>
    </div>
  )
}

// Section heading row from the landing (bolt, number, rule), with the
// sentence-long SEO heading set large underneath instead of tracked caps.
export function Kicker({ index, label }: { index: number; label: string }) {
  return (
    <div className={kit.kicker}>
      <TriangleIcon />
      <span className={kit.kickerNum}>{String(index).padStart(2, '0')}</span>
      <span className={kit.kickerLabel}>{label}</span>
      <span className={kit.kickerRule} />
    </div>
  )
}

// `last` sets the closing paragraph apart : a dashed caveat or a soft callout.
type SectionProps = { armed: boolean; index: number; label: string; section: SeoSection; children?: ReactNode; last?: 'caveat' | 'callout' }

// Heading left, paragraphs right ; extra content (steps, cards) below.
export function SplitSection({ armed, index, label, section, children, last }: SectionProps) {
  return (
    <section id={`section-${index}`} className={kit.section}>
      <div className={kit.wrap}>
        <Reveal armed={armed}><Kicker index={index} label={label} /></Reveal>
        <div className={kit.split}>
          <Reveal armed={armed} as="h2" className={`${styles.disp} ${kit.h2}`}>{section.heading}</Reveal>
          <Reveal armed={armed} className={kit.prose}>
            {section.paragraphs.map((p, i) => <p key={p} className={last && i === section.paragraphs.length - 1 ? kit[last] : undefined}>{p}</p>)}
          </Reveal>
        </div>
        {section.bullets && <StepCards armed={armed} items={section.bullets} />}
        {children}
      </div>
    </section>
  )
}

export function StepCards({ armed, items }: { armed: boolean; items: string[] }) {
  return (
    <ol className={kit.steps}>
      {items.map((item, i) => (
        <Reveal key={item} as="li" armed={armed} className={`${styles.sk} ${kit.step}`} data-variant={i % 4} style={{ transitionDelay: `${i * 0.08}s` }}>
          <span className={`${styles.disp} ${kit.stepNum}`} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
          <span className={kit.stepText}>{item}</span>
        </Reveal>
      ))}
    </ol>
  )
}

export function DarkSection({ armed, index, label, section, children }: SectionProps) {
  return (
    <section id={`section-${index}`} className={kit.section}>
      <div className={kit.wrap}>
        <Reveal armed={armed} className={kit.dark}>
          <div className={kit.darkGlow} aria-hidden="true" />
          <Kicker index={index} label={label} />
          <div className={kit.split}>
            <h2 className={`${styles.disp} ${kit.h2}`}>{section.heading}</h2>
            <div className={kit.prose}>{section.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          </div>
          {children}
        </Reveal>
      </div>
    </section>
  )
}

const linkKind = (href: string, en: boolean) => /github\.com/.test(href) ? 'GitHub' : /linkedin\.com/.test(href) ? 'LinkedIn' : en ? 'Link' : 'Lien'

export function NextSection({ armed, index, page, related }: { armed: boolean; index: number; page: SeoPage; related: { slug: string; label: string }[] }) {
  const locale = useLocale()
  const en = locale === 'en'
  const feature = page.links[0]
  return (
    <section className={kit.section} aria-labelledby="seo-next">
      <div className={kit.wrap}>
        <Reveal armed={armed}><Kicker index={index} label={en ? 'Next' : 'La suite'} /></Reveal>
        <Reveal armed={armed} as="h2" id="seo-next" className={`${styles.disp} ${kit.h2}`} style={{ marginBottom: 32 }}>
          {en ? 'Continue exploring' : 'Pour aller plus loin'}
        </Reveal>
        <div className={kit.next}>
          {feature && (
            <Reveal as="a" armed={armed} className={`${styles.gh} ${kit.repo}`} href={feature.href} target="_blank" rel="noopener noreferrer">
              <span className={kit.repoKind}>{linkKind(feature.href, en)}</span>
              <span className={`${styles.disp} ${kit.repoTitle}`}>{feature.label}</span>
              <span className={styles.ghArr}><BigDiagonalArrowIcon /></span>
            </Reveal>
          )}
          <Reveal armed={armed} className={kit.related}>
            {related.map(item => (
              <Link key={item.slug} className={kit.relLink} href={`/${locale}/${item.slug}`}>
                <span>{item.label}</span><DiagonalArrowIcon className={styles.arr} />
              </Link>
            ))}
            <Link className={kit.relLink} href={`/${locale}#projets`}>
              <span>{en ? 'All projects' : 'Tous les projets'}</span><DiagonalArrowIcon className={styles.arr} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
