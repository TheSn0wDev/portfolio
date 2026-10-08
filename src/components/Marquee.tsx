import styles from './portfolio.module.css'
import { MarqueeTriangleIcon } from './icons'
import { techMarquee } from '@/content/profile'

export function Marquee({ items: source = techMarquee }: { items?: string[] }) {
  const items = source.concat(source)

  return (
    <div
      className={styles.mqWrap}
      style={{ borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', background: '#fff', overflow: 'hidden', padding: '22px 0' }}
    >
      <div className={styles.marq}>
        {items.map((tech, i) => (
          <span key={`${tech}-${i}`} className={styles.mqI}>
            <span
              className={styles.disp}
              style={{ fontSize: 'clamp(22px, 2.4vw, 32px)', fontWeight: 800, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}
            >
              {tech}
            </span>
            <MarqueeTriangleIcon />
          </span>
        ))}
      </div>
    </div>
  )
}
