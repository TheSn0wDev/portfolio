'use client'

import { useContent, useTranslation } from '@/i18n/LocaleProvider'
import * as navContent from '@/content/nav'
import * as profileContent from '@/content/profile'
import styles from './portfolio.module.css'

type MobileNavProps = {
  onNavigate: () => void
  sectionPrefix?: string
}

export function MobileNav({ onNavigate, sectionPrefix = '' }: MobileNavProps) {
  const t = useTranslation()
  const { navLinks } = useContent(navContent)
  const { heroCtas } = useContent(profileContent)

  return (
    <nav id="mnav" className={styles.mnav} aria-label={t('Menu mobile')}>
      {navLinks.map((link) => (
        <a key={link.href} href={`${sectionPrefix}${link.href}`} onClick={onNavigate}>
          {link.label}
          <span aria-hidden="true">{link.mobileIndex}</span>
        </a>
      ))}
      <a
        className={`${styles.btn} ${styles.btnP}`}
        href={`${sectionPrefix}${heroCtas.contact.href}`}
        onClick={onNavigate}
        style={{ marginTop: 16, justifyContent: 'center' }}
      >
        {heroCtas.contact.label}
      </a>
    </nav>
  )
}
