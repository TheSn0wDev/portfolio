'use client'

import { usePathname } from 'next/navigation'
import { useContent, useTranslation, useLocale } from '@/i18n/LocaleProvider'
import * as navContent from '@/content/nav'
import * as profileContent from '@/content/profile'
import styles from './portfolio.module.css'
import { LanguageSwitch } from './LanguageSwitch'
import { Orb } from './Orb'
import { MobileNav } from './MobileNav'

type HeaderProps = {
  scrolled: boolean
  menuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
}

export function Header({ scrolled, menuOpen, onToggleMenu, onCloseMenu }: HeaderProps) {
  const t = useTranslation()
  const locale = useLocale()
  const pathname = usePathname()
  const sectionPrefix = pathname === `/${locale}` ? '' : `/${locale}`
  const { navLinks } = useContent(navContent)
  const { availability, heroCtas, name } = useContent(profileContent)

  return (
    <header className={[styles.hdr, scrolled || menuOpen ? styles.hdrOn : ''].filter(Boolean).join(' ')}>
      <a className={styles.skipLink} href="#main">{locale === 'en' ? 'Skip to content' : 'Aller au contenu'}</a>
      <div
        style={{
          maxWidth: 1312,
          margin: '0 auto',
          padding: '16px clamp(20px, 4.5vw, 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'nowrap',
        }}
      >
        <a
          href={`${sectionPrefix}#top`}
          style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none', color: 'var(--ink)' }}
          aria-label={`${name.line1} ${name.line2}, ${t('retour en haut')}`}
        >
          <Orb size="logo" />
          <span className={styles.disp} style={{ fontWeight: 800, fontSize: 16, letterSpacing: '0.02em' }}>
            Clément Ozor
          </span>
        </a>
        <nav className={styles.nav} aria-label={t('Sections')} style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
          {navLinks.map((link) => (
            <a key={link.href} href={`${sectionPrefix}${link.href}`}>
              {link.label}
            </a>
          ))}
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            className={`${styles.hideSm} ${styles.pillAv}`}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' }}
          >
            <span className={styles.pulse} />
            {availability}
          </span>
          <a
            className={`${styles.btn} ${styles.btnP} ${styles.hdrCta}`}
            href={`${sectionPrefix}${heroCtas.contact.href}`}
            style={{ minHeight: 44, padding: '0 20px', fontSize: 14 }}
          >
            {heroCtas.contact.label}
          </a>
          <LanguageSwitch />
          <button
            type="button"
            className={[styles.burger, menuOpen ? styles.burgerOpen : ''].filter(Boolean).join(' ')}
            onClick={onToggleMenu}
            aria-expanded={menuOpen}
            aria-controls="mnav"
            aria-label={t('Menu')}
          >
            <span />
            <span />
          </button>
        </div>
      </div>
      {menuOpen && <MobileNav onNavigate={onCloseMenu} sectionPrefix={sectionPrefix} />}
    </header>
  )
}
