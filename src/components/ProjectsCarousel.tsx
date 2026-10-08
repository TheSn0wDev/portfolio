'use client'

import { useContent, useTranslation } from '@/i18n/LocaleProvider'
import * as projectsContent from '@/content/projects'
import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { ProjectCard } from './ProjectCard'
import { BigDiagonalArrowIcon, ChevronLeftIcon, ChevronRightIcon, TriangleIcon } from './icons'
import { useProjectCarousel } from '@/hooks/useProjectCarousel'

type ProjectsCarouselProps = {
  armed: boolean
  motionEnabled: boolean
}

export function ProjectsCarousel({ armed, motionEnabled }: ProjectsCarouselProps) {
  const t = useTranslation()
  const { githubCard, projects } = useContent(projectsContent)

  const { trackRef, pbarRef, mode, index, total, atStart, atEnd, prev, next, trackHandlers } = useProjectCarousel(motionEnabled)

  const trackClassName = [styles.ptrack, mode === 'free' ? styles.ptrackFree : '', mode === 'dragging' ? styles.ptrackDrag : '']
    .filter(Boolean)
    .join(' ')

  return (
    <section id="projets" style={{ padding: 'clamp(80px, 10vw, 144px) 0 0' }}>
      <div style={{ maxWidth: 1312, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 64px)' }}>
        <Reveal armed={armed} className={styles.secH} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
          <TriangleIcon />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--muted)' }}>02</span>
          <h2 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(22px, 2.6vw, 32px)', fontWeight: 900, letterSpacing: '0.2em', color: 'var(--ink)', textTransform: 'uppercase' }}>
            {t('Projets')}
          </h2>
          <span style={{ flex: 1, minWidth: 40, height: 1.5, background: 'var(--ink)', opacity: 0.6 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span className={styles.disp} aria-live="polite" style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums', minWidth: 64, textAlign: 'right' }}>
              {String(index + 1).padStart(2, '0')}{' '}
              <span style={{ color: 'var(--muted)', fontWeight: 500 }}>/ {String(total || projects.length + 1).padStart(2, '0')}</span>
            </span>
            <button type="button" className={`${styles.nb} ${styles.navBtns}`} onClick={prev} disabled={atStart} aria-label={t('Projet précédent')}>
              <ChevronLeftIcon />
            </button>
            <button type="button" className={`${styles.nb} ${styles.navBtns}`} onClick={next} disabled={atEnd} aria-label={t('Projet suivant')}>
              <ChevronRightIcon />
            </button>
          </div>
        </Reveal>
      </div>
      <div
        ref={trackRef}
        data-ptrack=""
        data-at-start={atStart ? '' : undefined}
        data-at-end={atEnd ? '' : undefined}
        className={trackClassName}
        onScroll={trackHandlers.onScroll}
        onPointerDown={trackHandlers.onPointerDown}
        onClickCapture={trackHandlers.onClickCapture}
        onDragStart={trackHandlers.onDragStart}
        role="region"
        aria-label={t('Liste des projets, défilement horizontal')}
        tabIndex={0}
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} armed={armed} motionEnabled={motionEnabled} />
        ))}
        <Reveal
          as="a"
          armed={armed}
          className={`${styles.pcard} ${styles.gh}`}
          data-pcard=""
          data-cursor-drag=""
          href={githubCard.url}
          style={{
            borderRadius: 32,
            padding: 'clamp(24px, 3vw, 40px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 32,
            background: 'var(--ink)',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9FB4E8', fontWeight: 600 }}>{githubCard.eyebrow}</span>
          <span className={styles.disp} style={{ fontSize: 'clamp(36px, 4vw, 60px)', fontWeight: 900, lineHeight: 0.98, letterSpacing: '-0.03em' }}>
            {githubCard.heading} <span style={{ color: 'var(--sky)' }}>{githubCard.highlighted}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <span style={{ fontSize: 17, fontWeight: 600 }}>{githubCard.handle}</span>
            <span className={styles.ghArr}>
              <BigDiagonalArrowIcon />
            </span>
          </span>
        </Reveal>
      </div>
      <div style={{ maxWidth: 1312, margin: '0 auto', padding: '0 clamp(20px, 4.5vw, 64px)' }}>
        <div className={styles.pbar} ref={pbarRef}>
          <span />
        </div>
      </div>
    </section>
  )
}
