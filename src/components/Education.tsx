import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { TriangleIcon } from './icons'
import { education } from '@/content/education'

type EducationProps = {
  armed: boolean
}

export function Education({ armed }: EducationProps) {
  return (
    <section id="formation" style={{ maxWidth: 1312, margin: '0 auto', padding: 'clamp(80px, 10vw, 144px) clamp(20px, 4.5vw, 64px) clamp(80px, 10vw, 144px)' }}>
      <Reveal armed={armed} className={styles.secH} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 56 }}>
        <TriangleIcon />
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>04</span>
        <h2 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--ink)', textTransform: 'uppercase' }}>
          Formation
        </h2>
        <span style={{ flex: 1, minWidth: 40, height: 1.5, background: 'var(--ink)', opacity: 0.6 }} />
      </Reveal>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))', gap: 0 }}>
        {education.map((entry, i) => (
          <Reveal
            key={entry.school}
            armed={armed}
            className={styles.edu}
            style={{ padding: `36px ${i < education.length - 1 ? 32 : 0}px 36px 0`, display: 'flex', flexDirection: 'column', gap: 10, borderBottom: '1px solid var(--line)' }}
          >
            <span className={`${styles.disp} ${styles.ol}`} style={{ fontSize: 'clamp(64px, 7vw, 104px)', fontWeight: 900, lineHeight: 0.9, letterSpacing: '-0.04em' }}>
              {entry.year}
            </span>
            <h3 className={styles.disp} style={{ margin: 0, fontSize: 26, fontWeight: 800, color: 'var(--ink)' }}>
              {entry.school}
            </h3>
            <p style={{ margin: 0, fontSize: 16, color: 'var(--muted)' }}>{entry.program}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
