import styles from './portfolio.module.css'
import { navLinks } from '@/content/nav'
import { heroCtas } from '@/content/profile'

type MobileNavProps = {
  onNavigate: () => void
}

export function MobileNav({ onNavigate }: MobileNavProps) {
  return (
    <nav id="mnav" className={styles.mnav} aria-label="Menu mobile">
      {navLinks.map((link) => (
        <a key={link.href} href={link.href} onClick={onNavigate}>
          {link.label}
          <span aria-hidden="true">{link.mobileIndex}</span>
        </a>
      ))}
      <a
        className={`${styles.btn} ${styles.btnP}`}
        href={heroCtas.contact.href}
        onClick={onNavigate}
        style={{ marginTop: 16, justifyContent: 'center' }}
      >
        {heroCtas.contact.label}
      </a>
    </nav>
  )
}
