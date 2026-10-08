'use client'

import { Fragment, useRef, useState } from 'react'
import { useContent, useTranslation } from '@/i18n/LocaleProvider'
import * as profileContent from '@/content/profile'
import * as contactContent from '@/content/contact'
import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { DiagonalArrowIcon } from './icons'

type ContactSectionProps = {
  armed: boolean
}


export function ContactSection({ armed }: ContactSectionProps) {
  const t = useTranslation()
  const { contactHeading, footerCopyright, footerTagline } = useContent(profileContent)
  const { contact } = useContent(contactContent)

  const links = [
  { category: 'LinkedIn', label: contact.linkedin.label, url: contact.linkedin.url },
  { category: 'GitHub', label: contact.github.label, url: contact.github.url },
  { category: t('Téléphone'), label: contact.phone.label, url: contact.phone.url },
  { category: 'Email', label: contact.mail.label, url: contact.mail.url },
]

  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const onCopy = () => {
    if (!navigator.clipboard?.writeText) return
    navigator.clipboard
      .writeText(contact.email)
      .then(() => {
        setCopied(true)
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => setCopied(false), 1800)
      })
      .catch(() => {})
  }

  return (
    <section id="contact" style={{ background: 'var(--ink)', color: '#fff', borderRadius: 'clamp(28px, 4vw, 48px) clamp(28px, 4vw, 48px) 0 0', position: 'relative', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1312, margin: '0 auto', padding: 'clamp(72px, 9vw, 128px) clamp(20px, 4.5vw, 64px) 40px', display: 'flex', flexDirection: 'column', gap: 56 }}>
        <Reveal armed={armed} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <h2 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(40px, 6.4vw, 96px)', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.035em', maxWidth: 1100 }}>
            {contactHeading.map((seg, i) =>
              seg.emphasis === 'sky' ? (
                <span key={i} style={{ color: 'var(--sky)' }}>
                  {seg.text}
                </span>
              ) : (
                <Fragment key={i}>{seg.text}</Fragment>
              ),
            )}
          </h2>
        </Reveal>
        <Reveal armed={armed} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
          <a className={styles.mail} href={`mailto:${contact.email}`} style={{ fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: 800, letterSpacing: '-0.01em', paddingBottom: 6, wordBreak: 'break-all' }}>
            {contact.email}
          </a>
          <button className={styles.btn} type="button" onClick={onCopy} style={{ background: 'rgba(255,255,255,.1)', color: '#fff', minHeight: 44 }}>
            {copied ? t('Copié !') : t('Copier l’adresse')}
          </button>
        </Reveal>
        <Reveal armed={armed} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: 14 }}>
          {links.map((link) => (
            <a key={link.category} className={styles.clink} href={link.url}>
              <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C9D3EA' }}>{link.category}</span>
                <span style={{ fontSize: 17, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.label}</span>
              </span>
              <span style={{ flex: 'none', display: 'inline-flex' }}>
                <DiagonalArrowIcon className={styles.arr} />
              </span>
            </a>
          ))}
        </Reveal>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,.14)', fontSize: 14, color: '#C9D3EA' }}>
          <span>{footerCopyright}</span>
          <span className={styles.hand} style={{ fontSize: 22, color: 'var(--sky)' }}>
            {footerTagline}
          </span>
        </div>
      </div>
    </section>
  )
}
