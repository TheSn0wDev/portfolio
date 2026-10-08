'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useLocale } from '@/i18n/LocaleProvider'
import styles from './portfolio.module.css'

export function LanguageSwitch() {
  const locale = useLocale()
  const pathname = usePathname()
  const suffix = pathname.replace(/^\/(fr|en)(?=\/|$)/, '')
  const [hash, setHash] = useState('')
  useEffect(() => {
    const update = () => setHash(window.location.hash)
    update()
    window.addEventListener('hashchange', update)
    return () => window.removeEventListener('hashchange', update)
  }, [])
  return (
    <nav className={styles.languageSwitch} aria-label={locale === 'en' ? 'Language' : 'Langue'}>
      {(['fr', 'en'] as const).map(language => (
        <Link key={language} href={`/${language}${suffix}${hash}`} hrefLang={language} lang={language}
          aria-label={language === 'en' ? 'English' : 'Français'} aria-current={language === locale ? 'page' : undefined}
          onClick={() => { document.cookie = `portfolio-locale=${language}; Path=/; Max-Age=31536000; SameSite=Lax` }}>
          {language.toUpperCase()}
        </Link>
      ))}
    </nav>
  )
}
