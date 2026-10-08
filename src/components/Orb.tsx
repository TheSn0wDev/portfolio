import styles from './portfolio.module.css'

type OrbProps = {
  size: 'lg' | 'sm' | 'logo'
  status?: 'idle' | 'thinking' | 'speaking'
  className?: string
}

const sizeClass: Record<OrbProps['size'], string> = {
  lg: styles.orbLg,
  sm: styles.orbSm,
  // The logo orb is the "sm" size with its own box-shadow/hover override on
  // top (matches the original's `class="orb sm logo-orb"`) ; it needs the
  // `.orbSm .b` blur rule too, or its blobs render as hard, unblurred circles.
  logo: `${styles.orbSm} ${styles.logoOrb}`,
}

const statusClass: Record<NonNullable<OrbProps['status']>, string> = {
  idle: '',
  thinking: styles.thinking,
  speaking: styles.speaking,
}

export function Orb({ size, status = 'idle', className }: OrbProps) {
  return (
    <span className={[styles.orb, sizeClass[size], statusClass[status], className].filter(Boolean).join(' ')} aria-hidden="true">
      <span className={styles.blobs}>
        <span className={`${styles.b} ${styles.b1}`} />
        <span className={`${styles.b} ${styles.b2}`} />
        <span className={`${styles.b} ${styles.b3}`} />
      </span>
    </span>
  )
}
