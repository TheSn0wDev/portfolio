'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { seoDemos } from '@/content/seo-demos'
import type { ReactNode } from 'react'
import styles from './portfolio.module.css'
import kit from './SeoPageKit.module.css'
import { DotGrid } from './DotGrid'
import { Marquee } from './Marquee'
import { ProjectLevelPilotVisual, ProjectRagVisual } from './ProjectCard'
import { ArrowRightIcon } from './icons'
import { Crumbs, DarkSection, HandNote, NextSection, SeoPageShell, SplitSection, StatusCard } from './SeoPageKit'
import { useTilt } from '@/hooks/useTilt'
import { useContent, useLocale } from '@/i18n/LocaleProvider'
import * as projectsContent from '@/content/projects'
import type { Project } from '@/content/projects'
import type { SeoPage } from '@/content/seo-pages'

type Bilingual = { fr: string; en: string }

// What differs between project pages : the hero visual, the context chips,
// the short section labels and which section becomes the dark band.
type ProjectPageConfig = {
  project: string
  chips: Bilingual[]
  labels: { fr: string[]; en: string[] }
  dark: number
  caption: Bilingual
  visual: (visual: Project['visual']) => ReactNode
}

export const projectPageConfigs: Record<string, ProjectPageConfig> = {
  'personal-rag': {
    project: 'Personal RAG',
    chips: [{ fr: 'Projet personnel', en: 'Personal project' }, { fr: 'Backend & IA générative', en: 'Backend & GenAI' }],
    labels: { fr: ['Objectif', 'Pipeline', 'Enseignements', 'Évaluation'], en: ['Purpose', 'Pipeline', 'Takeaways', 'Evaluation'] },
    dark: 3,
    caption: { fr: 'Illustration du parcours : question, recherche, réponse sourcée.', en: 'Illustration of the flow: question, retrieval, cited answer.' },
    visual: visual => visual.kind === 'ragCloud' && <ProjectRagVisual visual={visual} />,
  },
  'agents-ia-autonomes': {
    project: 'LevelPilot',
    chips: [{ fr: 'SaaS · backend', en: 'SaaS · backend' }, { fr: 'Agents IA', en: 'AI agents' }],
    labels: { fr: ['Boucle', 'Orchestration', 'Autonomie', 'Contribution'], en: ['Loop', 'Orchestration', 'Autonomy', 'Contribution'] },
    dark: 2,
    caption: { fr: 'Illustration : les valeurs et la PR affichées ne sont pas des résultats mesurés.', en: 'Illustration: the values and pull request shown are not measured results.' },
    visual: visual => visual.kind === 'levelPilot' && <ProjectLevelPilotVisual visual={visual} />,
  },
}

type ProjectSeoPageProps = {
  page: SeoPage
  related: { slug: string; label: string }[]
}

// Same entrance as the landing hero name, one span per letter.
function letters(word: string, base: number) {
  return word.split('').map((ch, i) => ({ ch, delay: `${(base + i * 0.045).toFixed(3)}s` }))
}

export function ProjectSeoPage({ page, related }: ProjectSeoPageProps) {
  const locale = useLocale()
  const en = locale === 'en'
  const config = projectPageConfigs[page.slug]
  const { projects } = useContent(projectsContent)
  const visual = projects.find(project => project.title === config.project)?.visual

  // "Personal RAG : un assistant…" → giant title + subtitle, one h1. The
  // last word of the title takes the accent, like the landing's surname.
  const split = page.heading.search(/\s?:\s/)
  const title = split > 0 ? page.heading.slice(0, split) : page.heading
  const subtitle = split > 0 ? page.heading.slice(split).replace(/^\s?:\s/, '') : ''
  // Each word wraps as a unit ; letter delays run on across words.
  const words = title.split(' ').map((word, w, all) => ({
    word, accent: w > 0 && w === all.length - 1,
    letters: letters(word, 0.1 + all.slice(0, w).join('').length * 0.045 + w * 0.08),
  }))

  const repo = page.links[0]
  const labels = config.labels[locale]

  return (
    <SeoPageShell>
      {({ armed, motionEnabled, heroRef }) => <>
        <section ref={heroRef} className={kit.hero}>
          <DotGrid />
          <div className={kit.wrap}>
            {/* Mirrors the BreadcrumbList in the page's JSON-LD. */}
            <Crumbs trail={[{ label: 'Portfolio', href: `/${locale}` }, { label: page.label }]} />
            <div className={styles.rise} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, animationDelay: '.05s' }}>
              <span className={`${styles.chip} ${kit.live}`}><span className={styles.pulse} />{en ? 'In development' : 'En développement'}</span>
              {config.chips.map(chip => <span key={chip.fr} className={`${styles.chip} ${styles.chipW}`}>{chip[locale]}</span>)}
            </div>

            <h1 className={kit.h1}>
              <span className={`${styles.disp} ${styles.name} ${kit.title} ${title.length > 14 ? kit.titleLong : ''}`}>
                {words.map(({ accent, letters }, w) => <Fragment key={w}>
                  {w > 0 && ' '}
                  <span className={accent ? styles.w2 : undefined} style={{ whiteSpace: 'nowrap' }}>
                    {letters.map((l, i) => <span key={i} className={styles.ltr} style={{ animationDelay: l.delay }}>{l.ch}</span>)}
                  </span>
                </Fragment>)}
              </span>
              {subtitle && <>
                <span className={kit.srOnly}>{en ? ": " : " : "}</span>
                <span className={`${styles.rise} ${kit.subtitle}`} style={{ animationDelay: '.55s' }}>{subtitle}</span>
              </>}
            </h1>

            <div className={kit.heroGrid}>
              <div className={kit.heroText}>
                <p className={`${styles.rise} ${kit.intro}`} style={{ animationDelay: '.65s' }}>{page.intro}</p>
                <div className={`${styles.rise} ${styles.ctaRow}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, animationDelay: '.75s' }}>
                  {repo && <a className={`${styles.btn} ${styles.btnP}`} href={repo.href} target="_blank" rel="noopener noreferrer">
                    {en ? 'View on GitHub' : 'Voir sur GitHub'} <ArrowRightIcon className={styles.arr} />
                  </a>}
                  <a className={`${styles.btn} ${styles.btnG}`} href="#contact">{en ? 'Discuss a GenAI engagement' : 'Discuter d’une mission GenAI'}</a>
                </div>
                <StatusCard text={page.status} />
              </div>

              <div className={`${styles.rise} ${kit.stageCol}`} style={{ animationDelay: '.45s' }}>
                <HandNote lines={page.tagline} flip />
                {visual && <VisualStage caption={config.caption[locale]} motionEnabled={motionEnabled}>{config.visual(visual)}</VisualStage>}
              </div>
            </div>
          </div>
        </section>

        <Marquee items={page.stack} />

        {page.sections.map((section, i) => {
          const index = i + 1
          const props = { armed, index, label: labels[i], section }
          if (index === config.dark) return <DarkSection key={section.heading} {...props} />
          return <SplitSection key={section.heading} {...props} last={index === page.sections.length ? 'caveat' : undefined} />
        })}
        <SplitSection armed={armed} index={page.sections.length + 1} label={en ? 'Demo' : 'Démonstration'} section={seoDemos[locale][page.slug]}>
          {page.slug === 'personal-rag' && <Link className={`${styles.btn} ${styles.btnP}`} style={{ marginTop: 28 }} href={`/${locale}#rag-demo`}>{en ? 'Try the portfolio RAG assistant' : 'Tester le RAG du portfolio'} <ArrowRightIcon className={styles.arr} /></Link>}
        </SplitSection>
        <NextSection armed={armed} index={page.sections.length + 2} page={page} related={related} />
      </>}
    </SeoPageShell>
  )
}

function VisualStage({ caption, motionEnabled, children }: { caption: string; motionEnabled: boolean; children: ReactNode }) {
  const tilt = useTilt(motionEnabled)
  return (
    <figure className={`${styles.tilt} ${kit.stage}`} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave}>
      <span className={styles.glare} />
      {children}
      <figcaption>{caption}</figcaption>
    </figure>
  )
}
