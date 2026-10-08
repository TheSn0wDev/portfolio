'use client'

import { useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import styles from './portfolio.module.css'
import { CustomCursor } from './CustomCursor'
import { Header } from './Header'
import { Hero } from './Hero'
import { Marquee } from './Marquee'
import { ExperienceTimeline } from './ExperienceTimeline'
import { ProjectsCarousel } from './ProjectsCarousel'
import { SkillsGrid } from './SkillsGrid'
import { Education } from './Education'
import { ContactSection } from './ContactSection'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useRevealArmed } from '@/hooks/useReveal'
import { useHeaderScroll } from '@/hooks/useHeaderScroll'
import { usePointerFx } from '@/hooks/usePointerFx'
import { SeoLinks } from './SeoLinks'
import { accent } from '@/content/profile'

export function PortfolioRoot() {
  const rootRef = useRef<HTMLDivElement>(null)
  const heroRef = useRef<HTMLElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  const reducedMotion = useReducedMotion()
  const motionEnabled = !reducedMotion
  const armed = useRevealArmed(motionEnabled)
  const scrolled = useHeaderScroll(rootRef, timelineRef, styles.tdotOn)

  usePointerFx({
    rootRef,
    heroRef,
    cursorRef,
    bigClass: styles.curBig,
    dragClass: styles.curDrag,
    pressClass: styles.curPress,
    atStartClass: styles.curAtStart,
    atEndClass: styles.curAtEnd,
    enabled: motionEnabled,
  })

  const rootClassName = [styles.pf, armed ? styles.armed : '', motionEnabled ? '' : styles.still].filter(Boolean).join(' ')

  return (
    <div ref={rootRef} className={rootClassName} style={{ '--accent': accent } as CSSProperties}>
      <CustomCursor ref={cursorRef} />
      <Header scrolled={scrolled} menuOpen={menuOpen} onToggleMenu={() => setMenuOpen((v) => !v)} onCloseMenu={() => setMenuOpen(false)} />
      <main id="main" tabIndex={-1}>
      <Hero heroRef={heroRef} motionEnabled={motionEnabled} />
      <Marquee />
      <ExperienceTimeline timelineRef={timelineRef} armed={armed} motionEnabled={motionEnabled} />
      <ProjectsCarousel armed={armed} motionEnabled={motionEnabled} />
      <SeoLinks />
      <SkillsGrid armed={armed} />
      <Education armed={armed} />
      </main>
      <ContactSection armed={armed} />
    </div>
  )
}
