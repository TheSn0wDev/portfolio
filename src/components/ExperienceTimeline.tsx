import type { RefObject } from 'react'
import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { ExperienceCard } from './ExperienceCard'
import { TriangleIcon } from './icons'
import { experienceAside, experiences } from '@/content/experiences'

type ExperienceTimelineProps = {
  timelineRef: RefObject<HTMLDivElement | null>
  armed: boolean
  motionEnabled: boolean
}

export function ExperienceTimeline({ timelineRef, armed, motionEnabled }: ExperienceTimelineProps) {
  return (
    <section id="experiences" style={{ maxWidth: 1312, margin: '0 auto', padding: 'clamp(72px, 9vw, 128px) clamp(20px, 4.5vw, 64px) 0' }}>
      <Reveal armed={armed} className={styles.secH} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
        <TriangleIcon />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>01</span>
        <h2 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--ink)', textTransform: 'uppercase' }}>
          Expériences
        </h2>
        <span style={{ flex: 1, minWidth: 40, height: 1.5, background: 'var(--ink)', opacity: 0.6 }} />
      </Reveal>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'flex-start' }}>
        <Reveal as="aside" armed={armed} className={styles.expAside} style={{ flex: '1 1 260px', position: 'sticky', top: 110, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <span className={styles.disp} style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
            {experienceAside.eyebrow}
          </span>
          <span className={`${styles.disp} ${styles.ol}`} style={{ fontSize: 'clamp(64px, 6.5vw, 96px)', fontWeight: 900, lineHeight: 0.85, letterSpacing: '-0.04em' }}>
            {experienceAside.year}
          </span>
          <p className={styles.disp} style={{ margin: 0, fontSize: 24, fontWeight: 800, color: 'var(--ink)', lineHeight: 1.2 }}>
            {experienceAside.heading}
          </p>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--muted)', maxWidth: 320 }}>{experienceAside.description}</p>
        </Reveal>

        <div ref={timelineRef} style={{ flex: '999 1 620px', minWidth: 0, position: 'relative', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <span className={styles.rail} />
          <span className={styles.railFill} />
          {experiences.map((experience, i) => (
            <ExperienceCard key={i} experience={experience} armed={armed} motionEnabled={motionEnabled} />
          ))}
        </div>
      </div>
    </section>
  )
}
