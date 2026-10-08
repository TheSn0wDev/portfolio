'use client'

import type { CSSProperties } from 'react'
import { useContent, useTranslation } from '@/i18n/LocaleProvider'
import * as skillsContent from '@/content/skills'
import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { TriangleIcon } from './icons'
import { skillGroups } from '@/content/skills'

type SkillsGridProps = {
  armed: boolean
}

const variantStyle: Record<(typeof skillGroups)[number]['variant'], CSSProperties> = {
  dark: { background: 'var(--ink)' },
  light: { background: '#fff', border: '1px solid var(--line)' },
  surface: { background: 'var(--surface)' },
}

export function SkillsGrid({ armed }: SkillsGridProps) {
  const t = useTranslation()
  const { skillGroups } = useContent(skillsContent)

  return (
    <section id="stack" style={{ maxWidth: 1312, margin: '0 auto', padding: 'clamp(80px, 10vw, 144px) clamp(20px, 4.5vw, 64px) 0' }}>
      <Reveal armed={armed} className={styles.secH} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
        <TriangleIcon />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>03</span>
        <h2 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--ink)', textTransform: 'uppercase' }}>
          {t('Compétences')}
        </h2>
        <span style={{ flex: 1, minWidth: 40, height: 1.5, background: 'var(--ink)', opacity: 0.6 }} />
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 270px), 1fr))', gap: 20 }}>
        {skillGroups.map((group) => {
          const isHand = group.titleFont === 'hand'
          const titleColor = group.variant === 'dark' ? '#fff' : isHand ? 'var(--accent)' : 'var(--ink)'
          const chipClass = group.chipVariant === 'dark' ? styles.chipD : group.chipVariant === 'white' ? styles.chipW : ''

          return (
            <Reveal
              key={group.title}
              armed={armed}
              className={styles.sk}
              style={{ borderRadius: 24, padding: 28, display: 'flex', flexDirection: 'column', gap: 18, ...variantStyle[group.variant] }}
            >
              <h3
                className={isHand ? styles.hand : styles.disp}
                style={{ margin: 0, fontSize: isHand ? 30 : 22, fontWeight: isHand ? 700 : 800, color: titleColor, lineHeight: isHand ? 1 : undefined }}
              >
                {group.title}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {group.chips.map((chip) => (
                  <span key={chip} className={`${styles.chip} ${chipClass}`}>
                    {chip}
                  </span>
                ))}
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
