'use client'

import { Fragment } from 'react'
import type { RefObject } from 'react'
import { useContent } from '@/i18n/LocaleProvider'
import * as profileContent from '@/content/profile'
import styles from './portfolio.module.css'
import { DotGrid } from './DotGrid'
import { ChatWidget } from './ChatWidget'
import { ArrowRightIcon, SuitcaseIcon, SwishArrowIcon } from './icons'

type HeroProps = {
  heroRef: RefObject<HTMLElement | null>
  motionEnabled: boolean
}

function letters(word: string, base: number) {
  return word.split('').map((ch, i) => ({ ch, delay: `${(base + i * 0.045).toFixed(3)}s` }))
}

export function Hero({ heroRef, motionEnabled }: HeroProps) {
  const { currentRole, eyebrow, handwrittenTagline, heroChips, heroCtas, name, pitch } = useContent(profileContent)

  const line1 = letters(name.line1, 0.1)
  const line2 = letters(name.line2, 0.42)

  return (
    <section id="top" ref={heroRef} style={{ position: 'relative', padding: 'clamp(40px, 6vw, 88px) 0 clamp(56px, 6vw, 96px)' }}>
      <DotGrid />
      <div
        style={{
          position: 'relative',
          maxWidth: 1312,
          margin: '0 auto',
          padding: '0 clamp(20px, 4.5vw, 64px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div className={styles.rise} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, animationDelay: '.05s' }}>
          {heroChips.map((chip) => (
            <span key={chip} className={styles.chip}>
              {chip}
            </span>
          ))}
        </div>

        <h1
          className={`${styles.disp} ${styles.name}`}
          aria-label={`${name.line1} ${name.line2}, ${eyebrow}`}
          style={{
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap',
            columnGap: '0.24em',
            fontSize: 'clamp(32px, 7.6vw, 148px)',
            lineHeight: 0.92,
            fontWeight: 900,
            letterSpacing: '-0.035em',
            color: 'var(--ink)',
          }}
        >
          <span aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
            {line1.map((l, i) => (
              <span key={i} className={styles.ltr} style={{ animationDelay: l.delay }}>
                {l.ch}
              </span>
            ))}
          </span>
          {' '}<span className={styles.w2} aria-hidden="true" style={{ whiteSpace: 'nowrap' }}>
            {line2.map((l, i) => (
              <span key={i} className={styles.ltr} style={{ animationDelay: l.delay }}>
                {l.ch}
              </span>
            ))}
          </span>
          {' '}<span style={{ flexBasis: '100%', marginTop: 20, fontSize: 'clamp(16px, 2vw, 24px)', fontWeight: 600, lineHeight: 1.4, letterSpacing: '0.02em' }}>{eyebrow}</span>
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'flex-end', gap: 24 }}>
          <div className={`${styles.rise} ${styles.hideSm}`} style={{ display: 'flex', alignItems: 'flex-end', gap: 8, transform: 'rotate(-5deg)', animationDelay: '.7s' }}>
            <p className={styles.hand} style={{ margin: 0, fontSize: 30, lineHeight: 0.95, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {handwrittenTagline[0]}
              <br />
              {handwrittenTagline[1]}
            </p>
            <SwishArrowIcon />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 500px), 1fr))', gap: 'clamp(32px, 4vw, 64px)', alignItems: 'center', marginTop: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <p className={styles.rise} style={{ margin: 0, fontSize: 'clamp(18px, 1.6vw, 22px)', lineHeight: 1.6, color: 'var(--text)', maxWidth: 600, animationDelay: '.6s' }}>
              {pitch.map((seg, i) =>
                seg.emphasis === 'strong' ? (
                  <strong key={i} style={{ color: 'var(--ink)' }}>
                    {seg.text}
                  </strong>
                ) : (
                  <Fragment key={i}>{seg.text}</Fragment>
                ),
              )}
            </p>
            <div className={`${styles.rise} ${styles.ctaRow}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animationDelay: '.75s' }}>
              <a className={`${styles.btn} ${styles.btnP}`} href={heroCtas.primary.href}>
                {heroCtas.primary.label} <ArrowRightIcon className={styles.arr} />
              </a>
              <a className={`${styles.btn} ${styles.btnG}`} href={heroCtas.secondary.href}>
                {heroCtas.secondary.label}
              </a>
            </div>
            <div
              className={styles.rise}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '18px 22px',
                borderRadius: 20,
                background: '#fff',
                border: '1px solid var(--line)',
                boxSizing: 'border-box',
                width: '100%',
                animationDelay: '.9s',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flex: 'none', width: 44, height: 44, borderRadius: 12, background: 'var(--soft)' }}>
                <SuitcaseIcon />
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>{currentRole.label}</span>
                <span style={{ fontSize: 15, color: 'var(--ink)', lineHeight: 1.45 }}>{currentRole.description}</span>
              </div>
            </div>
          </div>

          <div id="rag-demo" style={{ scrollMarginTop: 100 }}><ChatWidget motionEnabled={motionEnabled} /></div>
        </div>
      </div>
    </section>
  )
}
