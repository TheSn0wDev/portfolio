'use client'

import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { useTilt } from '@/hooks/useTilt'
import { BriefcaseIcon, PinIcon } from './icons'
import type { Experience } from '@/content/experiences'

type ExperienceCardProps = {
  experience: Experience
  armed: boolean
  motionEnabled: boolean
}

export function ExperienceCard({ experience, armed, motionEnabled }: ExperienceCardProps) {
  const { onMouseMove, onMouseLeave } = useTilt(motionEnabled)

  return (
    <Reveal as="article" armed={armed} className={styles.tlItem} style={{ position: 'relative', paddingLeft: 52 }}>
      <span className={styles.tdot} data-tdot="" />
      <div
        className={styles.tilt}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 24, padding: 'clamp(24px, 3vw, 36px)', display: 'flex', flexDirection: 'column', gap: 20 }}
      >
        <span className={styles.glare} />
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h3 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(22px, 2vw, 28px)', fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
              {experience.title}
            </h3>
            <span style={{ display: 'inline-flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 22px', fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <BriefcaseIcon />
                {experience.company}
              </span>
              {experience.location && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <PinIcon />
                {experience.location}
              </span>}
            </span>
          </div>
          <span className={styles.chip}>{experience.period}</span>
        </div>
        <ul className={styles.bl}>
          {experience.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
        {experience.impact && <p>{experience.impact}</p>}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {experience.stack.map((tech) => (
            <span key={tech} className={styles.chip}>
              {tech}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  )
}
