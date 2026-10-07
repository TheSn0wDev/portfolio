'use client'

import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { useTilt } from '@/hooks/useTilt'
import { DiagonalArrowIcon } from './icons'
import type { CSSProperties } from 'react'
import type { Project } from '@/content/projects'

type ProjectCardProps = {
  project: Project
  armed: boolean
  motionEnabled: boolean
}

function ProjectFlowVisual({ steps }: { steps: string[] }) {
  return (
    <div style={{ position: 'relative', borderRadius: 22, background: 'var(--ink)', padding: '32px 24px', overflow: 'hidden' }}>
      <div className={styles.flow}>
        <span className={styles.flowDot} />
      </div>
      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
        {steps.map((step) => (
          <span key={step} className={styles.step}>
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

// Embedding cloud, as [x%, y%]. Positions are fixed so the server and client
// renders match and the scan wave timing stays deterministic. The top-right
// corner is left empty for the question bubble.
const RAG_POINTS: [number, number][] = [
  [8, 40], [10, 66], [14, 26], [32, 88], [28, 34], [36, 62],
  [44, 82], [40, 46], [48, 66], [52, 40], [56, 88], [60, 56], [64, 34],
  [68, 76], [76, 46], [80, 66], [84, 88], [88, 52], [92, 36], [94, 76],
]
// Where each falling document settles into the cloud, clear of the question.
// The first document holds the answer : its point is the one the search finds.
const RAG_LANDINGS: [number, number][] = [[20, 64], [26, 42], [12, 84]]
// Timeline, in seconds of an 8s cycle (keep in sync with the rag keyframes) :
// 0 question · 0.6–2.4 documents fall · 2.6–4.4 scan from right to left ·
// 4.0 answer point lights up · 4.3 answer pops · 7.2 everything fades out.
const ragDocDelay = (i: number) => `${(0.6 + i * 0.3).toFixed(2)}s`
// The scan starts under the question (right edge) and reaches each point
// according to its x position.
const ragScanDelay = (x: number) => `${(2.6 + 1.8 * (1 - x / 100)).toFixed(2)}s`

function ProjectRagVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'ragCloud' }> }) {
  const [ax, ay] = RAG_LANDINGS[0]
  return (
    <div
      className={styles.rag}
      role="img"
      aria-label={`Question : « ${visual.question} » L’assistant cherche dans les documents et répond : « ${visual.answer} » Source : ${visual.source}.`}
    >
      {visual.docs.map((doc, i) => {
        const [x, y] = RAG_LANDINGS[i % RAG_LANDINGS.length]
        return (
          <span key={doc} className={styles.ragDoc} style={{ left: `${x}%`, '--ty': `${y}`, animationDelay: ragDocDelay(i) } as CSSProperties}>
            <span className={styles.ragDocLines} />
            {doc}
          </span>
        )
      })}
      {RAG_POINTS.map(([x, y], i) => (
        <span key={i} className={styles.ragPt} style={{ left: `${x}%`, top: `${y}%`, animationDelay: ragScanDelay(x) }} />
      ))}
      <span className={styles.ragLands}>
        {RAG_LANDINGS.slice(0, visual.docs.length).map(([x, y], i) => (
          <span key={i} className={styles.ragLand} style={{ left: `${x}%`, top: `${y}%`, animationDelay: ragDocDelay(i) }}>
            {i === 0 ? (
              <span className={styles.ragTarget} />
            ) : (
              <span className={styles.ragPt} style={{ left: 0, top: 0, animationDelay: ragScanDelay(x) }} />
            )}
          </span>
        ))}
      </span>
      <span className={styles.ragBeam} />
      <span className={styles.ragAsk}>{visual.question}</span>
      <span className={styles.ragCite} style={{ left: `calc(${ax}% + 14px)`, top: `${ay}%` }}>
        <span className={styles.ragCiteText}>{visual.answer}</span>
        <span className={styles.ragCiteSrc}>Source · {visual.source}</span>
      </span>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the fo keyframes) :
// 0 names · 0.4–2.9 bars fill one after the other, alternating corners ·
// 3.2 VS flash · 3.6 prediction pops · 3.8–5.2 percentage counts up ·
// 7.2 everything fades out.
const foBarDelay = (row: number, side: number) => (0.4 + (row * 2 + side) * 0.42).toFixed(2)
const foFormat = (value: number, unit = '') => `${value.toLocaleString('fr-FR')}${unit}`

function ProjectFaceOffVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'faceOff' }> }) {
  const sides = [0, 1] as const
  const statsLabel = visual.stats
    .map((stat) => `${stat.label} : ${foFormat(stat.values[0], stat.unit)} contre ${foFormat(stat.values[1], stat.unit)}`)
    .join(', ')
  return (
    <div
      className={styles.fo}
      role="img"
      aria-label={`${visual.fighters[0]} contre ${visual.fighters[1]}. ${statsLabel}. Pronostic IA : ${visual.fighters[visual.pick]} à ${visual.confidence} %.`}
      style={{ '--conf': visual.confidence } as CSSProperties}
    >
      <span className={styles.foFlash} />
      <div className={styles.foBody}>
        <div className={styles.foHead}>
          {sides.map((side) => (
            <span key={side} className={`${styles.foName} ${side === visual.pick ? styles.foPicked : ''}`} data-side={side}>
              {visual.fighters[side]}
            </span>
          ))}
          <span className={styles.foVs}>VS</span>
        </div>
        {visual.stats.map((stat, row) => {
          const max = Math.max(...stat.values) || 1
          return (
            <div key={stat.label} className={styles.foRow}>
              {sides.map((side) => (
                <span
                  key={side}
                  className={styles.foSide}
                  data-side={side}
                  style={{ '--d': foBarDelay(row, side), '--v': (stat.values[side] / max).toFixed(3) } as CSSProperties}
                >
                  <span className={styles.foVal}>{foFormat(stat.values[side], stat.unit)}</span>
                  <span className={styles.foTrack}>
                    <span className={styles.foFill} />
                  </span>
                </span>
              ))}
              <span className={styles.foLabel}>{stat.label}</span>
            </div>
          )
        })}
        <div className={styles.foPred} data-side={visual.pick}>
          <span className={styles.foPredText}>
            <span className={styles.foPredLabel}>Pronostic IA</span>
            {visual.fighters[visual.pick]}
          </span>
          <span className={styles.foPct} />
          <span className={styles.foMeter} />
        </div>
      </div>
    </div>
  )
}

function ProjectChatVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'chatPreview' }> }) {
  return (
    <div style={{ borderRadius: 22, background: 'var(--ink)', padding: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{ alignSelf: 'flex-end', maxWidth: '82%', padding: '12px 16px', borderRadius: '16px 16px 4px 16px', background: 'var(--accent)', color: '#fff', fontSize: 14, lineHeight: 1.5 }}
      >
        {visual.question}
      </div>
      <div
        style={{
          alignSelf: 'flex-start',
          maxWidth: '82%',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          padding: '12px 16px',
          borderRadius: '16px 16px 16px 4px',
          background: '#16224A',
          color: '#E6ECFB',
          fontSize: 14,
          lineHeight: 1.5,
          border: '1px solid rgba(255,255,255,.12)',
        }}
      >
        <span style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#9FB4E8', fontWeight: 600 }}>{visual.searchLabel}</span>
        <span className={styles.typing} aria-label="Réponse en cours">
          <span />
          <span />
          <span />
        </span>
      </div>
      <span style={{ alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#C9D3EA', fontWeight: 600 }}>
        <span className={styles.pulse} />
        {visual.statusLabel}
      </span>
    </div>
  )
}

export function ProjectCard({ project, armed, motionEnabled }: ProjectCardProps) {
  const { onMouseMove, onMouseLeave } = useTilt(motionEnabled)

  if (project.visual.kind === 'placeholder') {
    return (
      <Reveal
        as="article"
        armed={armed}
        className={styles.pcard}
        data-pcard=""
        style={{ border: '1.5px dashed var(--line)', borderRadius: 32, padding: 'clamp(24px, 3vw, 40px)', display: 'flex', flexDirection: 'column', gap: 20, background: 'transparent' }}
      >
        <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          {project.index} · {project.category}
        </span>
        <h3 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(30px, 3.2vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          {project.title}
        </h3>
        <div style={{ flex: 1, minHeight: 180, borderRadius: 22, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14 }}>
          {project.visual.label}
        </div>
        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>{project.description}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.stack.map((tech, i) => (
            <span key={`${tech}-${i}`} className={styles.chip}>
              {tech}
            </span>
          ))}
        </div>
      </Reveal>
    )
  }

  return (
    <Reveal
      as="article"
      armed={armed}
      className={`${styles.pcard} ${styles.tilt}`}
      data-pcard=""
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 32, padding: 'clamp(24px, 3vw, 40px)', display: 'flex', flexDirection: 'column', gap: 24 }}
    >
      <span className={styles.glare} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          {project.index} · {project.category}
        </span>
        {project.url && (
          <a
            href={project.url}
            aria-label={project.linkLabel ?? `Découvrir ${project.title}`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', color: 'var(--ink)' }}
          >
            <DiagonalArrowIcon />
          </a>
        )}
      </div>
      <h3 className={styles.disp} style={{ margin: 0, fontSize: 'clamp(30px, 3.2vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {project.title}
      </h3>
      {project.visual.kind === 'flow' && <ProjectFlowVisual steps={project.visual.steps} />}
      {project.visual.kind === 'ragCloud' && <ProjectRagVisual visual={project.visual} />}
      {project.visual.kind === 'chatPreview' && <ProjectChatVisual visual={project.visual} />}
      {project.visual.kind === 'faceOff' && <ProjectFaceOffVisual visual={project.visual} />}
      {project.bullets && (
        <ul className={styles.bl}>
          {project.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 'auto' }}>
        {project.stack.map((tech, i) => (
          <span key={`${tech}-${i}`} className={styles.chip}>
            {tech}
          </span>
        ))}
      </div>
    </Reveal>
  )
}
