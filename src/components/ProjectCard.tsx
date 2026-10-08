'use client'

import { useLocale, useTranslation } from '@/i18n/LocaleProvider'
import styles from './portfolio.module.css'
import { Reveal } from './Reveal'
import { useTilt } from '@/hooks/useTilt'
import { ArticleIcon, DiagonalArrowIcon, GitHubIcon, GlobeIcon } from './icons'
import { useId } from 'react'
import Link from 'next/link'
import type { ComponentType, CSSProperties } from 'react'
import type { Project, ProjectLink, ProjectStatus } from '@/content/projects'

type ProjectCardProps = {
  project: Project
  armed: boolean
  motionEnabled: boolean
}

function ProjectFlowVisual({ steps }: { steps: string[] }) {
  return (
    <div className={styles.visual} style={{ position: 'relative', display: 'flex', alignItems: 'center', borderRadius: 22, background: 'var(--ink)', padding: '32px 24px', overflow: 'hidden' }}>
      <div className={styles.flow}>
        <span className={styles.flowDot} />
      </div>
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
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
// renders match and the magnifier timing stays deterministic. The top-right
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
// 0 question · 0.6–2.4 documents fall · 2.6–4.6 the magnifier glides between
// candidates, resizing as it goes · 4.6 it settles on the answer's point,
// which lights up · 4.9 answer pops · 7.2 everything fades out.
const ragDocDelay = (i: number) => `${(0.6 + i * 0.3).toFixed(2)}s`
// Magnifier stops as [x%, y%, scale], reached at RAG_LENS_TIMES (seconds).
// It inspects the two other documents before landing on the answer, the last
// stop being RAG_LANDINGS[0]. Keep in sync with the ragLens keyframes.
const RAG_LENS: [number, number, number][] = [
  [70, 70, 1.15], [52, 46, 0.85], [28, 40, 1.25], [12, 80, 0.95], [...RAG_LANDINGS[0], 0.8],
]
const RAG_LENS_TIMES = [2.6, 3.1, 3.6, 4.1, 4.6]
const ragEase = (t: number) => t * t * (3 - 2 * t)
function ragLensAt(time: number): [number, number, number] {
  const i = RAG_LENS_TIMES.findIndex((t, k) => k > 0 && time <= t)
  if (i < 1) return RAG_LENS[time < RAG_LENS_TIMES[0] ? 0 : RAG_LENS.length - 1]
  const k = ragEase((time - RAG_LENS_TIMES[i - 1]) / (RAG_LENS_TIMES[i] - RAG_LENS_TIMES[i - 1]))
  return RAG_LENS[i - 1].map((v, j) => v + (RAG_LENS[i][j] - v) * k) as [number, number, number]
}
// A point flashes the first time the glass passes over it ; the cloud is about
// twice as wide as tall, hence the squashed y distance. Points it never
// reaches stay dim.
function ragHitDelay(x: number, y: number): string | undefined {
  for (let t = RAG_LENS_TIMES[0]; t <= RAG_LENS_TIMES[RAG_LENS_TIMES.length - 1]; t += 0.02) {
    const [lx, ly, ls] = ragLensAt(t)
    if (Math.hypot(x - lx, (y - ly) / 2) < 3.6 * ls) return `${t.toFixed(2)}s`
  }
}
const ragPtStyle = (x: number, y: number): CSSProperties => {
  const delay = ragHitDelay(x, y)
  return delay ? { animationDelay: delay } : { animation: 'none' }
}
const ragLensVars = Object.fromEntries(
  RAG_LENS.flatMap(([x, y, s], i) => [[`--x${i}`, `${x}%`], [`--y${i}`, `${y}%`], [`--s${i}`, s]]),
) as CSSProperties

export function ProjectRagVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'ragCloud' }> }) {
  const locale = useLocale()
  const [ax, ay] = RAG_LANDINGS[0]
  return (
    <div
      className={`${styles.visual} ${styles.rag}`}
      role="img"
      aria-label={locale === 'en' ? `Question: ${visual.question}. The assistant searches the documents and replies: ${visual.answer}. Source: ${visual.source}.` : `Question : « ${visual.question} » L’assistant cherche dans les documents et répond : « ${visual.answer} » Source : ${visual.source}.`}
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
        <span key={i} className={styles.ragPt} style={{ left: `${x}%`, top: `${y}%`, ...ragPtStyle(x, y) }} />
      ))}
      <span className={styles.ragLands}>
        {RAG_LANDINGS.slice(0, visual.docs.length).map(([x, y], i) => (
          <span key={i} className={styles.ragLand} style={{ left: `${x}%`, top: `${y}%`, animationDelay: ragDocDelay(i) }}>
            {i === 0 ? (
              <span className={styles.ragTarget} />
            ) : (
              <span className={styles.ragPt} style={{ left: 0, top: 0, ...ragPtStyle(x, y) }} />
            )}
          </span>
        ))}
      </span>
      <span className={styles.ragLens} style={ragLensVars} />
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
const foFormat = (value: number, unit = '', locale: 'fr' | 'en' = 'fr') => `${value.toLocaleString(locale === 'en' ? 'en-GB' : 'fr-FR')}${unit}`

function ProjectFaceOffVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'faceOff' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  const sides = [0, 1] as const
  const statsLabel = visual.stats
    .map((stat) => `${stat.label} : ${foFormat(stat.values[0], stat.unit, locale)} ${locale === 'en' ? 'versus' : 'contre'} ${foFormat(stat.values[1], stat.unit, locale)}`)
    .join(', ')
  return (
    <div
      className={`${styles.visual} ${styles.fo}`}
      role="img"
      aria-label={locale === 'en' ? `${visual.fighters[0]} versus ${visual.fighters[1]}. ${statsLabel}. AI prediction: ${visual.fighters[visual.pick]} at ${visual.confidence}%.` : `${visual.fighters[0]} contre ${visual.fighters[1]}. ${statsLabel}. Pronostic IA : ${visual.fighters[visual.pick]} à ${visual.confidence} %.`}
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
          <span className={styles.foVs}>
            <span className={styles.foVsText}>VS</span>
          </span>
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
                  <span className={styles.foVal}>{foFormat(stat.values[side], stat.unit, locale)}</span>
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
            <span className={styles.foPredLabel}>{tr('Pronostic IA')}</span>
            {visual.fighters[visual.pick]}
          </span>
          <span className={styles.foPct} />
          <span className={styles.foMeter} />
        </div>
      </div>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the rc styles and
// RECEIVES in scripts/fulgur-drive.mjs) :
// 0.4 / 1.9 / 3.4 / 4.9 the controller sends an order · radio rings reach the
// track 0.55s later · on reception the vehicle surges forward and the latency
// readout updates · 3.2–3.7 it jumps the dirt mound · 7.2 everything fades out.
const RC_SENDS = [0.4, 1.9, 3.4, 4.9]
const RC_TRAVEL = 0.55
const RC_RINGS = 3
const rcReceive = (i: number) => RC_SENDS[i] + RC_TRAVEL

function ProjectRcVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'rcLink' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  // Each readout shows from its reception until the next one ; a dash waits
  // for the first.
  const readouts = [
    { text: '–', from: 0, to: rcReceive(0) },
    ...visual.latencies.map((ms, i) => ({
      text: `${ms} ms`,
      from: rcReceive(i),
      to: i + 1 < RC_SENDS.length ? rcReceive(i + 1) : 9,
    })),
  ]
  return (
    <div
      className={`${styles.visual} ${styles.rc}`}
      role="img"
      aria-label={locale === 'en' ? `The controller sends radio commands; the vehicle moves with each command. Illustrative latency, not measured: ${Math.min(...visual.latencies)} to ${Math.max(...visual.latencies)} ms.` : `La manette envoie ses commandes par radio ; le véhicule avance à chaque ordre reçu. Exemple de latence, non mesurée : ${Math.min(...visual.latencies)} à ${Math.max(...visual.latencies)} ms.`}
    >
      {RC_SENDS.flatMap((send, i) =>
        Array.from({ length: RC_RINGS }, (_, ring) => (
          <span key={`${i}-${ring}`} className={styles.rcWave} style={{ '--d': (send + ring * 0.12).toFixed(2) } as CSSProperties} />
        )),
      )}
      <div className={styles.rcBody}>
        <span className={styles.rcLat}>
          <span className={styles.rcLatLabel}>{tr('Latence')}</span>
          <span className={styles.rcMsWrap}>
            {readouts.map((r) => (
              <span key={r.from} className={styles.rcMs} style={{ '--a': r.from.toFixed(2), '--b': r.to.toFixed(2) } as CSSProperties}>
                {r.text}
              </span>
            ))}
          </span>
        </span>
        <svg className={styles.rcPad} width="48" height="32" viewBox="0 0 48 32">
          <path
            d="M14 4h20c6 0 10 4 11.5 10l2 9c.8 4-2 7-5.5 7-2.5 0-4-1.5-5.5-3.5L34 24H14l-2.5 2.5C10 28.5 8.5 30 6 30c-3.5 0-6.3-3-5.5-7l2-9C4 8 8 4 14 4z"
            fill="#e6ecfb"
          />
          <path d="M11 11h3v3h3v3h-3v3h-3v-3H8v-3h3z" fill="var(--ink)" />
          <circle cx="34" cy="13" r="2.4" fill="var(--accent)" />
          <circle cx="38.5" cy="17.5" r="2.4" fill="var(--ink)" />
        </svg>
        <div className={styles.rcTrack}>
          <span className={styles.rcMound} />
          <span className={styles.rcDust}>
            <span />
            <span />
            <span />
          </span>
          <svg className={styles.rcCar} width="56" height="34" viewBox="0 0 56 34">
            <g className={styles.rcStreaks} stroke="var(--sky)" strokeWidth="1.5" strokeLinecap="round">
              <line x1="-22" y1="11" x2="-6" y2="11" />
              <line x1="-30" y1="17" x2="-4" y2="17" />
              <line x1="-18" y1="23" x2="-3" y2="23" />
            </g>
            {/* Drawn nose-left, mirrored so it drives to the right. */}
            <g transform="matrix(-1 0 0 1 56 0)">
              <line x1="38" y1="12" x2="42" y2="3" stroke="#9fb4e8" strokeWidth="1.5" strokeLinecap="round" />
              <circle className={styles.rcRx} cx="42" cy="3" r="2.5" fill="var(--sky)" />
              <path d="M3 25v-5l5-7h14l5-6h11l7 6h5c2 0 3 1 3 3v9z" fill="var(--sky)" />
              <path d="M24 13l4-4.5h8.5l5 4.5z" fill="var(--ink)" opacity=".55" />
              {[13, 43].map((cx) => (
                <g key={cx}>
                  <circle cx={cx} cy="26" r="7.5" fill="#e6ecfb" />
                  <circle cx={cx} cy="26" r="3" fill="var(--ink)" />
                </g>
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the cs styles) :
// 0.4–3.2 code lines type one after the other · 3.3 run button flashes ·
// 3.4 the editor slides out for the live preview · 3.7 terrain fades in ·
// 3.9 phase line and objective · 4.0–4.25 APP-6 units pop · 4.3–5.0 friendly
// axis of advance draws · 4.8 hostile counterattack · 5.3 diagnostic badge
// pops and pulses · 7.2 fade out.
const CS_START = 0.4
const CS_CHAR = 0.022
const CS_GAP = 0.12
const CS_SWITCH = 3.4
// APP-6 units on the tactical map : friendly rectangles, hostile diamonds,
// with their echelon above (I company, II battalion). --d is their pop time.
const CS_UNITS = [
  { x: 76, y: 94, hostile: false, type: 'inf', echelon: 'II', d: 4 },
  { x: 66, y: 58, hostile: false, type: 'arm', echelon: 'I', d: 4.1 },
  { x: 222, y: 60, hostile: true, type: 'arm', echelon: 'I', d: 4.15 },
  { x: 232, y: 106, hostile: true, type: 'inf', echelon: 'II', d: 4.25 },
] as const
const CS_TOKEN = /('[^']*')|\b(const|new|true|false)\b|([A-Za-z_]\w*)(?=\()|(\w+)|(\s+|.)/g

function csTokens(line: string) {
  return Array.from(line.matchAll(CS_TOKEN), (m) => ({
    text: m[0],
    kind: m[1] ? styles.csStr : m[2] ? styles.csKw : m[3] ? styles.csFn : m[4] ? undefined : styles.csPunct,
  }))
}

function ProjectSandboxVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'codeSandbox' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  // Each line types at a constant pace ; its caret stays until the next line
  // (or the switch to the preview) starts.
  const lines = visual.code.map((code, index) => ({
    code,
    d: CS_START + visual.code.slice(0, index).reduce((delay, line) => delay + line.length * CS_CHAR + CS_GAP, 0),
    dur: code.length * CS_CHAR,
  }))
  const ok = visual.diagnostic.status === 'ok'
  return (
    <div
      className={`${styles.visual} ${styles.cs}`}
      role="img"
      aria-label={locale === 'en' ? `Editor: ${visual.code.join(' ; ')}. Live tactical map with friendly and enemy APP-6 symbols, phase line, objective and attack axis. Diagnostic: ${visual.diagnostic.label}.` : `Éditeur : ${visual.code.join(' ; ')}. La carte tactique s’affiche en direct : unités amies et ennemies en symbologie APP-6, ligne de phase, objectif et axe d’attaque. Diagnostic : ${visual.diagnostic.label}.`}
    >
      <div className={styles.csBody}>
        <div className={styles.csWin}>
          <div className={styles.csBar}>
            <span className={styles.csDots}>
              <span />
              <span />
              <span />
            </span>
            <span className={`${styles.csTab} ${styles.csTabCode}`}>{visual.file}</span>
            <span className={`${styles.csTab} ${styles.csTabView}`}>{tr('Aperçu')}</span>
            <span className={styles.csRun}>▶</span>
          </div>
          <div className={styles.csPanes}>
            <div className={styles.csEditor}>
              {lines.map((line, i) => (
                <div
                  key={i}
                  className={styles.csLine}
                  style={{ '--d': line.d.toFixed(2), '--dur': line.dur.toFixed(2), '--n': line.code.length, '--e': (lines[i + 1]?.d ?? CS_SWITCH).toFixed(2) } as CSSProperties}
                >
                  <span className={styles.csNo}>{i + 1}</span>
                  <span className={styles.csCode}>
                    {csTokens(line.code).map((tok, j) => (
                      <span key={j} className={tok.kind}>
                        {tok.text}
                      </span>
                    ))}
                  </span>
                  <span className={styles.csCaret} />
                </div>
              ))}
            </div>
            <div className={styles.csPreview}>
              <svg className={styles.csMap} viewBox="0 0 300 160" preserveAspectRatio="xMidYMid slice">
                <g className={styles.csTerrain}>
                  <path className={styles.csGrid} d="M50 0v160M100 0v160M150 0v160M200 0v160M250 0v160M0 40h300M0 80h300M0 120h300" />
                  <g className={styles.csContour}>
                    <path d="M92 40c4-16 30-22 46-12s14 28-4 32-44-4-42-20z" />
                    <path d="M76 42c2-26 44-36 70-20s22 46-6 52-66-6-64-32z" />
                    <path d="M58 46c0-36 60-50 96-26s28 64-10 70-86-8-86-44z" />
                    <path d="M240 96c6-12 28-12 32 0s-8 20-20 18-16-8-12-18z" />
                    <path d="M226 98c6-22 50-24 58-2s-14 34-36 30-28-12-22-28z" />
                  </g>
                  <path className={styles.csRiver} d="M-5 136C40 126 70 142 110 136S170 120 210 130s60 16 95 8" />
                </g>
                <g className={styles.csPl}>
                  <path d="M150 8c-4 42 6 82 0 144" />
                  <text x="155" y="20">PL ALPHA</text>
                </g>
                <g className={styles.csObj}>
                  <path pathLength={100} d="M200 52c4-14 30-18 44-8s8 30-8 36-34-6-36-28z" />
                  <text x="208" y="34">OBJ LION</text>
                </g>
                <g className={styles.csAxis}>
                  <path className={styles.csAxisBand} pathLength={100} d="M90 92C120 94 138 68 168 64C182 62 190 63 196 63" />
                  <path className={styles.csAxisLine} pathLength={100} d="M90 92C120 94 138 68 168 64C182 62 190 63 196 63" />
                  <path className={styles.csAxisHead} d="M196 55l10 8-10 8z" />
                </g>
                <g className={styles.csCounter}>
                  <path d="M220 110c-15 6-28 8-40 6" />
                  <path d="M180.8 111.1L172 115l7.2 5.9" />
                </g>
                {CS_UNITS.map((u) => (
                  <g key={`${u.x}-${u.y}`} transform={`translate(${u.x} ${u.y})`}>
                    <g className={`${styles.csSym} ${u.hostile ? styles.csHo : styles.csFr}`} style={{ '--d': u.d } as CSSProperties}>
                      {u.hostile ? <path d="M0-10l10 10-10 10-10-10z" /> : <rect x="-10" y="-7" width="20" height="14" />}
                      {u.type === 'inf' ? (
                        <path className={styles.csIcon} d={u.hostile ? 'M-5-5l10 10M-5 5l10-10' : 'M-10-7l20 14M-10 7l20-14'} />
                      ) : (
                        <ellipse className={styles.csIcon} rx={u.hostile ? 5 : 6.5} ry={u.hostile ? 3 : 3.5} />
                      )}
                      <text className={styles.csEch} y={u.hostile ? -13 : -10}>
                        {u.echelon}
                      </text>
                    </g>
                  </g>
                ))}
              </svg>
              <span className={styles.csLive}>
                <span className={styles.csLiveDot} />
                Live
              </span>
              <span className={`${styles.csDiag} ${ok ? styles.csOk : styles.csErr}`}>
                <span className={styles.csDiagIcon}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {ok ? <path d="M2.5 6.5l2.5 2.5 4.5-5.5" /> : <path d="M3 3l6 6M9 3l-6 6" />}
                  </svg>
                </span>
                {visual.diagnostic.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the ch styles) :
// 0.3–1.9s the feed tiles drop in and stack up, bottom row first · 1.7–2.1s
// the replay timeline fades in · 2.3–4.3s the playhead plays forward ·
// 4.3–5.0s it is dragged back (rewind) · 5.4–6.6s dragged forward to the
// last event marker · 6.6–7.2s plays on · 7.2–7.6s everything fades out. Tiles
// read the --ch-t clock, feed content follows the --ch-p playhead (0–1).
// Base styles are the final frame (playhead on the last event), used as-is
// when motion is off.
const CH_TILE_START = 0.3
const CH_TILE_GAP = 0.3
const CH_COLS = 2
// Length of the replayed recording, in seconds, for the timecode readout.
const CH_DURATION = 900

function chTileStyle(i: number, count: number): CSSProperties {
  const rows = Math.ceil(count / CH_COLS)
  const row = Math.floor(i / CH_COLS)
  // Bottom row lands first so the wall builds up like a stack.
  const order = (rows - 1 - row) * CH_COLS + (i % CH_COLS)
  return { '--d': (CH_TILE_START + order * CH_TILE_GAP).toFixed(2), '--row': row } as CSSProperties
}

const chClock = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`

function ChDroneIcon() {
  return (
    <g>
      <line x1="-8" y1="-8" x2="8" y2="8" stroke="currentColor" strokeWidth="1.4" />
      <line x1="8" y1="-8" x2="-8" y2="8" stroke="currentColor" strokeWidth="1.4" />
      {[
        [-8, -8],
        [8, -8],
        [-8, 8],
        [8, 8],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="currentColor" />
      ))}
      <rect x="-3.5" y="-3.5" width="7" height="7" rx="1.5" fill="currentColor" />
    </g>
  )
}

function ChRoverIcon() {
  return (
    <g>
      <rect x="-10" y="-5" width="20" height="9" rx="2" fill="currentColor" />
      <line x1="0" y1="-5" x2="0" y2="-11" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="0" cy="-12" r="1.8" fill="currentColor" />
      <circle cx="-7" cy="5" r="3.2" fill="currentColor" />
      <circle cx="7" cy="5" r="3.2" fill="currentColor" />
    </g>
  )
}

function ChCamIcon() {
  return (
    <g fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="-7" y="-5" width="14" height="10" rx="2" />
      <circle cx="0" cy="0" r="3" fill="currentColor" stroke="none" />
    </g>
  )
}

const CH_TILE_ICON = { uav: ChDroneIcon, ugv: ChRoverIcon, cam: ChCamIcon }

// Stylised feed content, panned by the playhead so scrubbing visibly
// rewinds / fast-forwards every tile in sync.
function ChFeed({ kind }: { kind: 'uav' | 'ugv' | 'cam' }) {
  if (kind === 'uav') {
    return (
      <span className={styles.chFeed} data-kind="uav">
        <span className={styles.chGround} />
        <span className={styles.chReticle} />
      </span>
    )
  }
  if (kind === 'ugv') {
    return (
      <span className={styles.chFeed} data-kind="ugv">
        <svg className={styles.chRidge} viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0 42 L30 30 L58 38 L92 18 L130 34 L160 26 L200 40 L230 28 L262 36 L296 16 L330 32 L362 24 L400 42 L400 60 L0 60 Z" />
        </svg>
        <span className={styles.chTrack} />
      </span>
    )
  }
  return (
    <span className={styles.chFeed} data-kind="cam">
      <span className={styles.chHot} />
      <span className={styles.chHot} data-alt />
      <span className={styles.chBracket} />
    </span>
  )
}

function ProjectCohomaVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'cohoma' }> }) {
  const locale = useLocale()
  const lastMarker = visual.markers[visual.markers.length - 1] ?? 0.8
  return (
    <div
      className={`${styles.visual} ${styles.ch}`}
      role="img"
      style={{ '--m': lastMarker } as CSSProperties}
      aria-label={locale === 'en' ? `Mosaic of video and sensor feeds (${visual.feeds.map((f) => f.label).join(', ')}) stacking up, then a replay timeline whose cursor scrubs back and forth through ${visual.markers.length} recorded events.` : `Mosaïque de flux vidéo et capteurs (${visual.feeds.map((f) => f.label).join(', ')}) qui s’empilent, puis une timeline de replay dont le curseur remonte et avance entre ${visual.markers.length} événements enregistrés.`}
    >
      <div className={styles.chBody}>
        <div className={styles.chMosaic}>
          {visual.feeds.map((feed, i) => {
            const Icon = CH_TILE_ICON[feed.kind]
            return (
              <div key={feed.label} className={styles.chTile} data-kind={feed.kind} style={chTileStyle(i, visual.feeds.length)}>
                <ChFeed kind={feed.kind} />
                <span className={styles.chScan} />
                <span className={styles.chTear} />
                <svg className={styles.chTileIcon} width="14" height="14" viewBox="-10 -10 20 20">
                  <Icon />
                </svg>
                <span className={styles.chTileLabel}>{feed.label}</span>
                <span className={styles.chRec}>
                  <span className={styles.pulse} />
                  REC
                </span>
                <span className={styles.chSeek}>
                  <span data-mode="rew">◀◀</span>
                  <span data-mode="ff">▶▶</span>
                </span>
              </div>
            )
          })}
        </div>
        <div className={styles.chTimeline}>
          <div className={styles.chTimeHead}>
            <span className={styles.chMode}>
              <span className={styles.chModeIcon}>
                <span data-mode="play">▶</span>
                <span data-mode="rew">◀◀</span>
                <span data-mode="ff">▶▶</span>
              </span>
              Replay
            </span>
            <span className={styles.chTimecode}>
              <span className={styles.chTc} />
              <span className={styles.chTcTotal}> / {chClock(CH_DURATION)}</span>
            </span>
          </div>
          <div className={styles.chRail}>
            <span className={styles.chPlayed} />
            {visual.markers.map((m) => (
              <span key={m} className={styles.chMarker} style={{ '--at': m } as CSSProperties} />
            ))}
            <span className={styles.chHead} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Timeline, in seconds of an 11s cycle (keep in sync with the rs styles) :
// 0–1.6 the R4 drives in · 1.7 the roof box nose slides forward · each drone
// lifts off at its RS_DRONES launch time, climbs, then flies to its station
// above the fire · 4.4–7.2 the fire perimeter gets mapped · 4.5 the thermal
// feed pops · each drone heads back at its return time and lands in the box
// · 9.6 the box closes · 10.5 everything fades out.
// Stations are in % of the visual's width (x) / height from the bottom (b).
const RS_DRONES = [
  { launch: 2.4, back: 7.6, x: 60, b: 50 },
  { launch: 2.9, back: 7.9, x: 75, b: 57 },
  { launch: 3.4, back: 8.2, x: 89, b: 47 },
]
// Pines along the burning ridge, as [x, height] on the 200×80 fire board,
// and flames as [x, height, flicker period (s)]. The back row is drawn first.
const RS_PINES_BACK: [number, number][] = [
  [8, 26], [22, 34], [38, 30], [54, 38], [72, 32], [90, 40], [108, 34], [126, 42], [144, 34], [162, 38], [180, 30], [194, 26],
]
const RS_PINES_FRONT: [number, number][] = [
  [0, 18], [16, 22], [30, 18], [62, 24], [98, 22], [136, 26], [172, 20], [188, 24], [200, 18],
]
const RS_FLAMES: [number, number, number][] = [
  [48, 22, 0.9], [62, 34, 1.1], [78, 26, 0.8], [94, 42, 1.2], [110, 30, 0.95], [126, 38, 1.05], [142, 28, 0.85], [158, 20, 1],
]
const rsPine = (x: number, h: number) => `M${x - h * 0.28} 80L${x} ${80 - h}L${x + h * 0.28} 80Z`
const rsFlame = (x: number, h: number, w: number) =>
  `M${x - w} 80C${x - w} ${80 - h * 0.45} ${x - w * 0.2} ${80 - h * 0.6} ${x} ${80 - h}C${x + w * 0.2} ${80 - h * 0.6} ${x + w} ${80 - h * 0.45} ${x + w} 80Z`

// Wheel of the R4, centred on the origin so it can spin in place.
function RsWheel({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 83)`}>
      <g className={styles.rsWheel}>
        <circle r="17.3" fill="#10131d" />
        <circle r="12.4" fill="#1f2436" stroke="#e8352d" strokeWidth="2.8" />
        <circle r="5.2" fill="#2b3149" />
        {[0, 90, 180, 270].map((a) => (
          <rect key={a} x="-1" y="-9.6" width="2" height="3" rx="0.6" fill="#e4ff1a" transform={`rotate(${a})`} />
        ))}
      </g>
    </g>
  )
}

// Minimal side view of the Vision 4Rescue R4, facing right, on a 180×100
// board whose bottom edge is the road : short and tall, big wheels with
// tight overhangs, red body with the fluo yellow livery, flared black
// arches, and the drone roof box whose nose slides forward on its rails to
// open the launch bay.
function RsCar({ id }: { id: string }) {
  return (
    <svg className={styles.rsCarSvg} viewBox="0 0 180 100" aria-hidden>
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ec3a2e" />
          <stop offset="1" stopColor="#a8141c" />
        </linearGradient>
        <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff6c8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className={styles.rsBeam} d="M174 63L234 54L234 80Z" fill={`url(#${id}-beam)`} />
      {/* Launch bay rails, uncovered as the nose slides away. */}
      <rect x="85.5" y="12.4" width="30" height="3.4" rx="1" fill="#8b93a8" />
      <rect className={styles.rsPad} x="90" y="9.8" width="16" height="2.6" rx="1.3" />
      <path d="M42 18L37.5 10Q37.5 1 45 1L88.5 0.5V18Z" fill={`url(#${id}-body)`} />
      <path d="M60 9L63 2.4H65.6L62.6 9ZM66 9L69 2.2H71.6L68.6 9ZM72 9L75 2H77.6L74.6 9ZM78 9L81 1.8H83.6L80.6 9Z" fill="#e4ff1a" />
      <g className={styles.rsNose}>
        <path d="M88.5 0.5L100.5 1.5Q112.5 4 116 9.6Q112.5 16.4 102 18H88.5Z" fill="#c41f24" />
        <path d="M109.5 6.2L116 9.6L109.5 13Z" fill="#e4ff1a" />
      </g>
      <rect x="34.5" y="18.2" width="67.5" height="3.8" rx="1.2" fill="#1a1f30" />
      <rect className={styles.rsBeacon} x="64" y="16.4" width="12" height="2.4" rx="1" />
      <path d="M6 88L6.8 40Q7.5 26 13.5 24L97.5 23Q102 23 105 27L120 41Q147 44 160.5 50Q171 53 172.5 58L175.5 66V84Q175.5 88 172.5 88Z" fill={`url(#${id}-body)`} />
      <path d="M39 27L96 26.4Q99.8 26.4 102.8 30L115.5 44H39Z" fill="#17203f" stroke="#e4ff1a" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="48" y="27" width="2.2" height="17" fill="#10162c" />
      <rect x="71.2" y="26.6" width="4" height="17.4" fill="#10162c" />
      {/* "112" hazard block on the rear pillar. */}
      <path d="M23.2 27.4H36L36.8 44H22.5Z" fill="#e4ff1a" />
      <path d="M23.2 40L28.5 27.4H31L25.2 41ZM28.5 44L34.5 32.6L35.2 36.8L31.2 44Z" fill="#141826" />
      <path d="M38.2 46V80M73.5 46V80M117.8 46V72" stroke="#8a1218" strokeWidth="1" />
      <rect x="51" y="51" width="6" height="1.8" rx="0.9" fill="#8a1218" />
      <rect x="85.5" y="51" width="6" height="1.8" rx="0.9" fill="#8a1218" />
      {/* SAPEURS POMPIERS lettering and RESCUE chevrons. */}
      <rect x="55.5" y="62" width="30" height="2.2" rx="1.1" fill="#e4ff1a" />
      <path d="M88.5 80H93L103.5 52H99ZM96 80H99.8L110.2 52H106.5ZM102.8 80H105.8L116.2 52H113.2Z" fill="#e4ff1a" />
      <path d="M109.5 41Q111 36 115.5 38L117 44H111Z" fill="#141826" />
      {/* Hazard chevrons over the headlight. */}
      <path d="M150 48.4L173 57V62.6L150 54Z" fill="#e4ff1a" />
      <path d="M155 50.4L158 56.4L160 57L157 51ZM162 53L165 59L167 59.6L164 53.6ZM168.6 55.6L171 60.4L172.6 61L170.6 56.4Z" fill="#141826" />
      <rect className={styles.rsLamp} x="167" y="62" width="7" height="6" rx="3" />
      <path d="M6 70H12V88H6Z" fill="#1d2133" />
      <path d="M164 68H175.5V84Q175.5 88 172.5 88H164Z" fill="#1d2133" />
      <rect x="162" y="84" width="13.5" height="2.6" rx="1" fill="#e4ff1a" />
      <rect x="10" y="79" width="158" height="9" rx="2" fill="#1d2133" />
      <path d="M7 88A22 22 0 0 1 51 88Z" fill="#1d2133" />
      <path d="M116 88A22 22 0 0 1 160 88Z" fill="#1d2133" />
      <RsWheel x={29} />
      <RsWheel x={138} />
    </svg>
  )
}

// Quadcopter seen from the side, rotors blurred by their spin.
function RsDroneShape() {
  return (
    <svg className={styles.rsDroneSvg} viewBox="0 0 32 14" aria-hidden>
      <ellipse className={styles.rsRotor} cx="5" cy="3" rx="5" ry="1" />
      <ellipse className={styles.rsRotor} cx="27" cy="3" rx="5" ry="1" />
      <path d="M4 3.6V6M28 3.6V6M4 6H28" stroke="#c9d3ea" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="10" y="4.6" width="12" height="5.4" rx="2.4" fill="#1a2036" stroke="#c9d3ea" strokeWidth="0.8" />
      <rect x="12" y="6.4" width="8" height="1.4" rx="0.7" fill="#e4ff1a" />
      <circle cx="16" cy="11.6" r="1.6" fill="#c9d3ea" />
      <circle cx="3" cy="6.4" r="0.9" fill="#ff5a5f" />
      <circle cx="29" cy="6.4" r="0.9" fill="#4ade80" />
    </svg>
  )
}

function ProjectRescueVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'rescue' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  const drones = visual.drones.slice(0, RS_DRONES.length)
  const feedDrone = drones[1] ?? drones[0]
  // Gradient ids must stay unique in the page.
  const id = useId()
  return (
    <div
      className={`${styles.visual} ${styles.rs}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `A Vision 4Rescue Renault 4 drives up to a forest fire and opens its roof box: ${drones.length} drones (${drones.join(', ')}) take off, map the fire front and stream a thermal feed back to the vehicle, then land back in the box.`
          : `Une Renault 4 Vision 4Rescue arrive près d’un feu de forêt et ouvre son coffre de toit : ${drones.length} drones (${drones.join(', ')}) décollent, cartographient le front de feu et renvoient un flux thermique au véhicule, puis se reposent dans le coffre.`
      }
    >
      <svg className={styles.rsHills} viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <path d="M0 168C40 150 80 156 120 146S200 128 250 140 340 126 400 136V200H0Z" fill="#121c40" />
        <path d="M0 178C60 166 110 172 170 162S290 160 400 152V200H0Z" fill="#0f1836" />
      </svg>
      <span className={styles.rsGround} />
      <div className={styles.rsFire}>
        <svg viewBox="0 0 200 80" preserveAspectRatio="xMidYMax meet" aria-hidden>
          <defs>
            <radialGradient id={`${id}-glow`} cx="0.5" cy="1" r="0.6">
              <stop offset="0" stopColor="#ff7a1f" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ff7a1f" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="100" cy="80" rx="110" ry="60" fill={`url(#${id}-glow)`} className={styles.rsGlow} />
          {[48, 86, 120, 152].map((x, i) => (
            <circle key={x} className={styles.rsSmoke} cx={x} cy="40" r="7" style={{ animationDelay: `${(i * 0.7).toFixed(1)}s` }} />
          ))}
          {RS_PINES_BACK.map(([x, h]) => (
            <path key={x} d={rsPine(x, h)} fill="#1a2550" />
          ))}
          {RS_FLAMES.map(([x, h, period], i) => (
            <g key={x} className={styles.rsFlame} style={{ animationDuration: `${period}s`, animationDelay: `${(-i * 0.37).toFixed(2)}s` }}>
              <path d={rsFlame(x, h, h * 0.32)} fill="#ff5a1f" />
              <path d={rsFlame(x, h * 0.6, h * 0.18)} fill="#ffc83d" />
            </g>
          ))}
          {RS_PINES_FRONT.map(([x, h]) => (
            <path key={x} d={rsPine(x, h)} fill="#0c1430" />
          ))}
          <path
            className={styles.rsPerimeter}
            pathLength={100}
            d="M30 80C26 62 42 50 56 50C64 38 80 34 92 36C104 28 122 32 132 38C148 36 168 46 170 60C174 70 172 78 170 80"
          />
        </svg>
      </div>
      <span className={styles.rsZone}>{visual.zone}</span>
      <div className={styles.rsCar}>
        <RsCar id={id} />
      </div>
      {drones.map((drone, i) => {
        const d = RS_DRONES[i]
        return (
          <span
            key={drone}
            className={styles.rsDrone}
            style={{ '--l': d.launch, '--r': d.back, '--tx': `${d.x}cqw`, '--tb': `${d.b}cqh` } as CSSProperties}
          >
            <span className={styles.rsScan} />
            <span className={styles.rsLink}>
              <span className={styles.rsPacket} style={{ animationDelay: `${(i * 0.4).toFixed(1)}s` }} />
              <span className={`${styles.rsPacket} ${styles.rsOrder}`} style={{ animationDelay: `${(1.1 + i * 0.4).toFixed(1)}s` }} />
            </span>
            <span className={styles.rsDroneBody}>
              <RsDroneShape />
            </span>
            <span className={styles.rsDroneLabel}>{drone}</span>
          </span>
        )
      })}
      <span className={styles.rsHud}>
        <span className={styles.pulse} />
        {tr('Liaison active')} · {drones.length}/{drones.length}
      </span>
      <span className={styles.rsFeed}>
        <span className={styles.rsFeedImg} />
        <span className={styles.rsFeedRec}>REC</span>
        <span className={styles.rsFeedLabel}>
          {feedDrone} · {visual.feed}
        </span>
      </span>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the lm styles) :
// a plugin starts drifting in at each LM_ARRIVALS time, lines up in front of
// its socket and snaps in LM_SNAP later (flash, LED) · 4.3 every plugin is
// in : the core boots, a pulse spreads and power flows into the plugins ·
// 7.2 everything fades out.
const LM_ARRIVALS = [0.5, 1.4, 2.3, 3.2]
const LM_SNAP = 0.7
// Core at the centre of a 400×200 board, with a socket on each side ; each
// slot is the docked position of one plugin, whose knob fills the socket it
// faces. dir is where it comes from, drift / r how far off-line it starts.
type LmSide = -1 | 0 | 1
const LM_CORE = { x: 154, y: 54, w: 92, h: 92, sides: [-1, -1, -1, -1] as LmSide[] }
const LM_SLOTS = [
  { x: 74, y: 66, w: 80, h: 68, sides: [0, 1, 0, 0] as LmSide[], dir: [-1, 0], drift: [0, -16], r: -14, joint: [154, 100] },
  { x: 154, y: 14, w: 92, h: 40, sides: [0, 0, 1, 0] as LmSide[], dir: [0, -1], drift: [22, 0], r: 10, joint: [200, 54] },
  { x: 246, y: 66, w: 80, h: 68, sides: [0, 0, 0, 1] as LmSide[], dir: [1, 0], drift: [0, 16], r: 14, joint: [246, 100] },
  { x: 154, y: 146, w: 92, h: 40, sides: [1, 0, 0, 0] as LmSide[], dir: [0, 1], drift: [-22, 0], r: -10, joint: [200, 146] },
]

// Jigsaw outline of an axis-aligned piece, clockwise from its top-left
// corner ; each side (top, right, bottom, left) is flat (0), or carries a
// knob (1) or a socket (-1) in its middle. A knob and the socket it faces
// share the exact same curve, so docked pieces fit flush.
function lmPiece({ x, y, w, h, sides }: { x: number; y: number; w: number; h: number; sides: LmSide[] }) {
  const corners = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]]
  let d = `M${x} ${y}`
  sides.forEach((s, i) => {
    const [x0, y0] = corners[i]
    const [x1, y1] = corners[(i + 1) % 4]
    const len = Math.hypot(x1 - x0, y1 - y0)
    const [dx, dy] = [(x1 - x0) / len, (y1 - y0) / len]
    // Outward normal of a clockwise edge (y down) is (dy, -dx).
    const p = (u: number, v: number) => `${+(x0 + dx * u + dy * v * s).toFixed(2)} ${+(y0 + dy * u - dx * v * s).toFixed(2)}`
    const m = len / 2
    if (s) d += `L${p(m - 5, 0)}C${p(m - 3, 5)} ${p(m - 10, 6)} ${p(m - 10, 11)}C${p(m - 10, 18)} ${p(m + 10, 18)} ${p(m + 10, 11)}C${p(m + 10, 6)} ${p(m + 3, 5)} ${p(m + 5, 0)}`
    d += `L${x1} ${y1}`
  })
  return `${d}Z`
}
const LM_CORE_PATH = lmPiece(LM_CORE)

function ProjectLumaVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'luma' }> }) {
  const locale = useLocale()
  const plugins = visual.plugins.slice(0, LM_SLOTS.length)
  return (
    <div
      className={`${styles.visual} ${styles.lm}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `The ${visual.core} core exposes ${plugins.length} sockets; the plugins ${plugins.join(', ')} snap into them one by one like puzzle pieces, then the core boots.`
          : `Le cœur ${visual.core} expose ${plugins.length} sockets ; les plugins ${plugins.join(', ')} viennent s’y emboîter un à un comme des pièces de puzzle, puis le cœur démarre.`
      }
    >
      <svg className={styles.lmBoard} viewBox="0 0 400 200" aria-hidden>
        {plugins.map((_, i) => (
          <path key={i} className={styles.lmGhost} d={lmPiece(LM_SLOTS[i])} style={{ '--d': LM_ARRIVALS[i] } as CSSProperties} />
        ))}
        <circle className={styles.lmBootPulse} cx="200" cy="100" r="46" />
        <g className={styles.lmCore}>
          <path d={LM_CORE_PATH} />
          <text className={styles.lmCoreLabel} x="200" y="94">
            {visual.core}
          </text>
          {plugins.map((_, i) => (
            <circle key={i} className={styles.lmLed} cx={200 + (i - (plugins.length - 1) / 2) * 9} cy="110" r="2.6" style={{ '--d': LM_ARRIVALS[i] } as CSSProperties} />
          ))}
        </g>
        {plugins.map((plugin, i) => {
          const slot = LM_SLOTS[i]
          return (
            <g
              key={plugin}
              className={styles.lmPlug}
              style={{ '--d': LM_ARRIVALS[i], '--dx': slot.dir[0], '--dy': slot.dir[1], '--px': slot.drift[0], '--py': slot.drift[1], '--r': `${slot.r}deg` } as CSSProperties}
            >
              <g className={styles.lmFlow}>
                <circle className={styles.lmSpark} cx={slot.joint[0]} cy={slot.joint[1]} r="2.2" style={{ animationDelay: `${(i * 0.2).toFixed(1)}s` }} />
              </g>
              <path d={lmPiece(slot)} />
              <text className={styles.lmPlugLabel} x={slot.x + slot.w / 2} y={slot.y + slot.h / 2}>
                {plugin}
              </text>
            </g>
          )
        })}
        {plugins.map((_, i) => (
          <circle key={i} className={styles.lmFlash} cx={LM_SLOTS[i].joint[0]} cy={LM_SLOTS[i].joint[1]} r="10" style={{ '--d': LM_ARRIVALS[i] } as CSSProperties} />
        ))}
      </svg>
    </div>
  )
}

// Timeline, in seconds of a 9s cycle (keep in sync with the cd styles) :
// 0.3 the mesh links up · 0.8 the recon unit sweeps its sensor · 1.7 it
// spots the enemy · from 1.8 the track hops over the mesh, each unit
// flagging it at its CD_UNITS rx time · 3.3 routes are planned · 3.6–5.4
// every unit converges · 5.5 engagement · 5.9 the enemy is neutralised ·
// 8.4 everything fades out.
// Positions are on a 400×200 map ; units go from home to end.
const CD_ENEMY = [318, 100] as const
const CD_UNITS = [
  { home: [222, 58], end: [300, 58], rx: 1.7 },
  { home: [62, 64], end: [268, 104], rx: 2.3 },
  { home: [120, 172], end: [346, 136], rx: 2.9 },
  { home: [160, 112], end: [292, 146], rx: 2.3 },
] as const
// Mesh links [a, b, packet start]. A packet carries the track from a to b
// in 0.5s ; links without one light up once both ends hold the track.
const CD_LINKS: [number, number, number | null][] = [
  [0, 1, 1.8],
  [0, 3, 1.8],
  [3, 2, 2.4],
  [1, 3, null],
  [1, 2, null],
]

// APP-6 land unit icons, drawn inside a 24×16 friendly frame.
function CdIcon({ type }: { type: 'recon' | 'infantry' | 'armour' | 'mechanized' }) {
  const cross = type === 'infantry' || type === 'mechanized'
  return (
    <>
      {cross && <path d="M-12 -8L12 8M-12 8L12 -8" />}
      {type === 'recon' && <path d="M-12 8L12 -8" />}
      {(type === 'armour' || type === 'mechanized') && <rect x="-7" y="-4" width="14" height="8" rx="4" />}
    </>
  )
}

function ProjectTacticalMeshVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'tacticalMesh' }> }) {
  const locale = useLocale()
  const units = visual.units.slice(0, CD_UNITS.length)
  const [ex, ey] = CD_ENEMY
  const [rx0, ry0] = CD_UNITS[0].home
  return (
    <div
      className={`${styles.visual} ${styles.cd}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `Tactical map: ${units.length} allied units (${units.map((u) => u.label).join(', ')}) in APP-6 symbols are linked by a data mesh. ${units[0]?.label} spots an enemy; the track is shared over the mesh in real time, then every unit converges and neutralises the target.`
          : `Carte tactique : ${units.length} unités alliées (${units.map((u) => u.label).join(', ')}) en symboles APP-6 sont reliées par un maillage de données. ${units[0]?.label} repère un ennemi ; la piste est partagée en temps réel sur le maillage, puis toutes les unités convergent et neutralisent la cible.`
      }
    >
      <svg className={styles.cdMap} viewBox="0 0 400 200" aria-hidden>
        <g className={styles.cdTerrain}>
          <path d="M250 20c30-14 80-10 96 12s-8 40-44 40-70-30-52-52z" />
          <path d="M236 14c40-24 112-16 126 18s-22 60-68 58-92-46-58-76z" />
          <path d="M20 120c14-18 48-16 54 4s-14 30-34 26-30-14-20-30z" />
          <path className={styles.cdRoad} d="M-5 140C60 130 120 96 190 92S300 120 405 104" />
        </g>
        <path className={styles.cdCone} d={`M${rx0} ${ry0}L341 70A120 120 0 0 1 312 138Z`} />
        <line className={styles.cdTrack} x1={rx0} y1={ry0} x2={ex} y2={ey} />
        {units.map((_, i) => {
          const u = CD_UNITS[i]
          return <line key={i} className={styles.cdRoute} x1={u.home[0]} y1={u.home[1]} x2={u.end[0]} y2={u.end[1]} />
        })}
        <circle className={styles.cdObjective} cx={ex} cy={ey} r="40" />
        {CD_LINKS.filter(([a, b]) => a < units.length && b < units.length).map(([a, b, d]) => {
          const ua = CD_UNITS[a]
          const ub = CD_UNITS[b]
          const lit = d === null ? Math.max(ua.rx, ub.rx) : d + 0.5
          return (
            <g key={`${a}-${b}`}>
              <line
                className={styles.cdLink}
                x2="1"
                style={
                  {
                    '--ax0': ua.home[0], '--ay0': ua.home[1], '--ax1': ua.end[0], '--ay1': ua.end[1],
                    '--bx0': ub.home[0], '--by0': ub.home[1], '--bx1': ub.end[0], '--by1': ub.end[1],
                    '--lt': lit,
                  } as CSSProperties
                }
              />
              {d !== null && (
                <circle
                  className={styles.cdPacket}
                  r="2.6"
                  style={{ '--d': d, '--ax': ua.home[0], '--ay': ua.home[1], '--bx': ub.home[0], '--by': ub.home[1] } as CSSProperties}
                />
              )}
            </g>
          )
        })}
        {units.map((_, i) => (
          <line key={i} className={styles.cdFire} x1={CD_UNITS[i].end[0]} y1={CD_UNITS[i].end[1]} x2={ex} y2={ey} pathLength={1} style={{ '--d': 5.5 + i * 0.06 } as CSSProperties} />
        ))}
        <g transform={`translate(${ex} ${ey})`}>
          <circle className={styles.cdPing} r="12" />
          <circle className={styles.cdBurst} r="14" />
          <g className={styles.cdEnemy}>
            <g className={styles.cdEnemyMark}>
              <path className={styles.cdHostile} d="M0 -12L12 0L0 12L-12 0Z" />
              <rect className={styles.cdIcon} x="-6" y="-3.5" width="12" height="7" rx="3.5" />
            </g>
            <text className={styles.cdLabel} x="16" y="0" style={{ textAnchor: 'start' }}>
              {visual.enemy}
            </text>
          </g>
          <path className={styles.cdKill} d="M-15 -15L15 15M-15 15L15 -15" pathLength={1} />
        </g>
        {units.map((unit, i) => {
          const u = CD_UNITS[i]
          return (
            <g
              key={unit.label}
              className={styles.cdUnit}
              style={{ '--x0': u.home[0], '--y0': u.home[1], '--x1': u.end[0], '--y1': u.end[1], '--rx': u.rx } as CSSProperties}
            >
              <circle className={styles.cdFlash} r="14" />
              <rect className={styles.cdFriend} x="-12" y="-8" width="24" height="16" />
              <g className={styles.cdIcon}>
                <CdIcon type={unit.type} />
              </g>
              <path className={styles.cdPip} d="M12 -13L15.5 -9.5L12 -6L8.5 -9.5Z" />
              <text className={styles.cdLabel} y="17">
                {unit.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

// Timeline, in seconds of an 8s cycle (keep in sync with the dj styles) :
// 0.4 the request bubble pops in, waiting for the DJ · 1.4 a tip coin drops
// from above, spinning · 2.1 it lands on the bubble and bounces (ring, +tip)
// · 3.4 the DJ queues the song and the equalizer kicks in at full level ·
// 7.2 the bubble fades out. The equalizer and the wave never stop.
// Bars get a fixed, deterministic rhythm so the server and client renders
// match : a bell-shaped envelope (louder in the middle) and staggered tempos.
const DJ_BARS = Array.from({ length: 28 }, (_, i) => {
  const env = 0.35 + 0.65 * Math.sin((Math.PI * (i + 0.5)) / 28)
  const jitter = (Math.sin(i * 12.9898) * 43758.5453) % 1
  return {
    '--hi': (env * (0.75 + 0.25 * Math.abs(jitter))).toFixed(2),
    '--lo': (env * 0.18).toFixed(2),
    animationDuration: `${(0.42 + 0.5 * Math.abs(jitter)).toFixed(2)}s`,
    animationDelay: `${(-i * 0.13).toFixed(2)}s`,
  } as CSSProperties
})
// Two periods of a sine on a 1600×60 strip ; it slides by half its width.
const djWave = (amp: number, phase: number) =>
  Array.from({ length: 161 }, (_, i) => `${i ? 'L' : 'M'}${i * 10} ${(30 + amp * Math.sin((i / 80) * 2 * Math.PI * 2 + phase)).toFixed(1)}`).join('')
const DJ_WAVES = [djWave(18, 0), djWave(10, 1.6)]

function ProjectDjiseVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'djise' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  return (
    <div
      className={`${styles.visual} ${styles.dj}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `During a live DJ set, a fan sends a song request (${visual.song} by ${visual.artist}) with a ${visual.tip} tip; the coin drops onto the request, the DJ adds the song to the queue and the equalizer kicks in.`
          : `Pendant un set en direct, un spectateur envoie une demande musicale (${visual.song} de ${visual.artist}) avec un pourboire de ${visual.tip} ; la pièce tombe sur la demande, le DJ ajoute le morceau à la file et l’égaliseur s’emballe.`
      }
    >
      <svg className={styles.djWave} viewBox="0 0 1600 60" preserveAspectRatio="none" aria-hidden>
        {DJ_WAVES.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </svg>
      <div className={styles.djEq} aria-hidden>
        {DJ_BARS.map((style, i) => (
          <span key={i} className={styles.djBar} style={style} />
        ))}
      </div>
      <span className={styles.djVinyl} aria-hidden>
        <span className={styles.djVinylLabel} />
      </span>
      <div className={styles.djReq} aria-hidden>
        <span className={styles.djReqLabel}>♪ {tr('Demande musicale')}</span>
        <span className={styles.djReqSong}>{visual.song}</span>
        <span className={styles.djReqArtist}>{visual.artist}</span>
        <span className={styles.djReqStatus}>
          <span className={styles.djPending}>
            <span className={styles.typing}>
              <span />
              <span />
              <span />
            </span>
            {tr('En attente du DJ')}
          </span>
          <span className={styles.djAccepted}>✓ {tr('Ajoutée à la file')}</span>
        </span>
        <span className={styles.djRing} />
        <span className={styles.djTipPop}>+{visual.tip}</span>
        <span className={styles.djCoin}>
          <span className={styles.djCoinFace}>{visual.tip}</span>
        </span>
      </div>
    </div>
  )
}

// Timeline, in seconds of a 9s cycle (keep in sync with the at styles) :
// 0.3 the GTA-style minimap opens on an overview of the island, its coastline
// drawing itself · 1 roads, viaduct, health and armour bars fill in · 1.3 the
// blips pop up · 1.5 the waypoint drops and the GPS route lights up · 2.2 the
// minimap zooms in on the player · 2.8 the player drives over the viaduct to
// the waypoint, the street name following along, the route eaten up as it
// goes · on arrival the waypoint clears with a ripple · 8.3 everything fades.
// World : a 400×200 board, rough outline of the Île d'Oléron (north-west tip
// to south-east tip, east coast first) smoothed into a closed Catmull-Rom
// curve, the mainland on the right.
const AT_COAST: [number, number][] = [
  [140, 18], [156, 26], [170, 46], [186, 66], [210, 84], [232, 104], [254, 124], [272, 146], [276, 168], [262, 184],
  [244, 176], [226, 156], [204, 136], [180, 118], [162, 96], [148, 70], [136, 44],
]
const atCurve = (pts: [number, number][]) =>
  pts
    .map((p, i) => {
      const [p0, p2, p3] = [pts[(i - 1 + pts.length) % pts.length], pts[(i + 1) % pts.length], pts[(i + 2) % pts.length]]
      const c1 = [p[0] + (p2[0] - p0[0]) / 6, p[1] + (p2[1] - p0[1]) / 6]
      const c2 = [p2[0] - (p3[0] - p[0]) / 6, p2[1] - (p3[1] - p[1]) / 6]
      return `${i ? '' : `M${p[0]} ${p[1]}`}C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0]} ${p2[1]}`
    })
    .join('') + 'Z'
const AT_ISLAND = atCurve(AT_COAST)
const AT_MAINLAND_COAST = 'M346 -5C334 30 352 58 340 86S356 140 344 205'
const AT_ROADS = [
  'M258 170L236 140L215 112L196 96L176 74L156 44L142 26',
  'M196 96L166 104',
  'M215 112L204 132',
  'M370 -10L352 92L366 210',
]
// The drive : mainland, over the viaduct (P1 → P2), then up the island to the
// waypoint, at a constant speed so the GPS route shrinks in step.
const AT_ROUTE: [number, number][] = [[352, 92], [342, 106], [243, 116], [215, 112], [196, 96], [176, 74]]
const AT_DRIVE = 2.8
const AT_SPEED = 46
const atRamp = (t0: number, d: number) => `clamp(0, (var(--at-t) - ${t0.toFixed(2)}) / ${d.toFixed(2)}, 1)`
const AT_LEGS = (() => {
  let t = AT_DRIVE
  return AT_ROUTE.slice(1).map((p, i) => {
    const [dx, dy] = [p[0] - AT_ROUTE[i][0], p[1] - AT_ROUTE[i][1]]
    const dur = Math.hypot(dx, dy) / AT_SPEED
    const leg = { dx, dy, start: t, dur, hd: (Math.atan2(dx, -dy) * 180) / Math.PI }
    t += dur
    return leg
  })
})()
const AT_ARRIVE = AT_DRIVE + AT_LEGS.reduce((s, l) => s + l.dur, 0)
// Player position (--rx, --ry), heading (--rh, turning over a quarter second
// at each corner) and route progress (--rp), all derived from the clock.
const AT_DRIVE_VARS = {
  '--rx': `calc(${AT_ROUTE[0][0]} + ${AT_LEGS.map((l) => `${l.dx} * ${atRamp(l.start, l.dur)}`).join(' + ')})`,
  '--ry': `calc(${AT_ROUTE[0][1]} + ${AT_LEGS.map((l) => `${l.dy} * ${atRamp(l.start, l.dur)}`).join(' + ')})`,
  '--rh': `calc(${AT_LEGS[0].hd.toFixed(1)}${AT_LEGS.slice(1)
    .map((l, i) => ` + ${(((l.hd - AT_LEGS[i].hd + 540) % 360) - 180).toFixed(1)} * ${atRamp(l.start - 0.12, 0.24)}`)
    .join('')})`,
  '--rp': atRamp(AT_DRIVE, AT_ARRIVE - AT_DRIVE),
  '--arrive': AT_ARRIVE.toFixed(2),
} as CSSProperties
// Street name shown beside the minimap, switching as the player crosses over.
const AT_STREETS = [
  { name: 'Bourcefranc-le-Chapus', zone: 'Charente-Maritime', from: 2.4, to: AT_LEGS[1].start },
  { name: 'Viaduc d’Oléron', zone: 'Charente-Maritime', from: AT_LEGS[1].start, to: AT_LEGS[2].start },
  { name: 'Saint-Pierre-d’Oléron', zone: 'Île d’Oléron', from: AT_LEGS[2].start, to: 9 },
]
const AT_BLIPS = [
  { kind: 'police', x: 222, y: 128, d: 1.3 },
  { kind: 'hospital', x: 205, y: 86, d: 1.42 },
  { kind: 'garage', x: 172, y: 98, d: 1.54 },
  { kind: 'bank', x: 362, y: 140, d: 1.66 },
] as const

function AtBlipGlyph({ kind }: { kind: (typeof AT_BLIPS)[number]['kind'] }) {
  if (kind === 'police') return <path d="M0 -4l1.2 2.5 2.7.3-2 1.9.5 2.7L0 2.1l-2.4 1.3.5-2.7-2-1.9 2.7-.3z" />
  if (kind === 'hospital') return <path d="M-1.2 -4h2.4v2.8h2.8v2.4h-2.8v2.8h-2.4v-2.8h-2.8v-2.4h2.8z" />
  if (kind === 'garage') return <path className={styles.atBlipStroke} d="M-3 3L1 -1M1.2 -3.6a2.2 2.2 0 1 0 2.4 2.4" />
  return <text className={styles.atBlipText}>$</text>
}

function AtPerson() {
  return (
    <>
      <circle cx="0" cy="-3.2" r="3.6" />
      <path d="M-6.5 7.5a6.5 6.2 0 0 1 13 0" />
    </>
  )
}

function ProjectRpMinimapVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'rpMinimap' }> }) {
  const locale = useLocale()
  const clip = useId()
  const n = Math.max(1, Math.min(6, visual.team))
  const [wx, wy] = AT_ROUTE[AT_ROUTE.length - 1]
  const words = visual.server.split(' ')
  return (
    <div
      className={`${styles.visual} ${styles.at}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `GTA-style minimap of the ${visual.server} server (${visual.place}): a waypoint is set, the GPS route lights up and the player drives over the Oléron viaduct to it, next to a HUD showing the ${visual.lead} and a team of ${n} developers.`
          : `Minimap façon GTA du serveur ${visual.server} (${visual.place}) : un waypoint est posé, l’itinéraire GPS s’allume et le joueur traverse le viaduc d’Oléron pour le rejoindre, à côté d’un HUD montrant le ${visual.lead} et une équipe de ${n} développeurs.`
      }
    >
      <svg className={styles.atHud} viewBox="0 0 400 200" style={AT_DRIVE_VARS} aria-hidden>
        <defs>
          <clipPath id={clip}>
            <rect x="18" y="22" width="196" height="134" rx="9" />
          </clipPath>
        </defs>
        <rect className={styles.atFrame} x="18" y="22" width="196" height="134" rx="9" />
        <g clipPath={`url(#${clip})`}>
          <g className={styles.atWorld}>
            <g className={styles.atSea}>
              <path d="M60 150q10-5 20 0t20 0M300 30q10-5 20 0t20 0M90 70q10-5 20 0t20 0M290 180q10-5 20 0t20 0M250 60q10-5 20 0t20 0" />
            </g>
            <path className={styles.atLand} d={`${AT_MAINLAND_COAST}L460 205L460 -5Z`} />
            <path className={styles.atLand} d={AT_ISLAND} />
            <path className={styles.atCoast} d={AT_MAINLAND_COAST} pathLength={1} />
            <path className={styles.atCoast} d={AT_ISLAND} pathLength={1} />
            {AT_ROADS.map((d) => (
              <path key={d} className={styles.atRoad} d={d} />
            ))}
            <path className={`${styles.atRoad} ${styles.atBridge}`} d={`M${AT_ROUTE[1].join(' ')}L${AT_ROUTE[2].join(' ')}`} />
            <path className={styles.atRoute} d={`M${AT_ROUTE.map((p) => p.join(' ')).join('L')}`} pathLength={1} />
            {AT_BLIPS.map((b) => (
              <g key={b.kind} transform={`translate(${b.x} ${b.y})`}>
                <g className={`${styles.atBlip} ${styles[`atBlip_${b.kind}`]}`} style={{ '--d': b.d } as CSSProperties}>
                  <circle r="6" />
                  <AtBlipGlyph kind={b.kind} />
                </g>
              </g>
            ))}
            <g transform={`translate(${wx} ${wy})`}>
              <g className={styles.atUnscale}>
                <ellipse className={styles.atRipple} rx="12" ry="4" />
                <ellipse className={styles.atRipple} rx="12" ry="4" style={{ '--d': AT_ARRIVE } as CSSProperties} />
                <g className={styles.atWaypoint}>
                  <ellipse className={styles.atShadow} rx="4.5" ry="1.5" />
                  <g className={styles.atPin}>
                    <path className={styles.atPinBody} d="M0 0C-3 -5 -8 -8 -8 -13.5a8 8 0 0 1 16 0C8 -8 3 -5 0 0Z" />
                    <circle className={styles.atPinDot} cy="-13.5" r="3" />
                  </g>
                </g>
              </g>
            </g>
            <g className={styles.atPlayer}>
              <path d="M0 -7L5.2 6L0 3.2L-5.2 6Z" />
            </g>
          </g>
        </g>
        <rect className={styles.atRim} x="18" y="22" width="196" height="134" rx="9" />
        <g className={styles.atBar} style={{ '--d': 1 } as CSSProperties}>
          <rect className={styles.atBarBack} x="18" y="162" width="96" height="5" rx="1" />
          <rect className={`${styles.atBarFill} ${styles.atHealth}`} x="18" y="162" width="96" height="5" rx="1" />
        </g>
        <g className={styles.atBar} style={{ '--d': 1.2 } as CSSProperties}>
          <rect className={styles.atBarBack} x="118" y="162" width="96" height="5" rx="1" />
          <rect className={`${styles.atBarFill} ${styles.atArmour}`} x="118" y="162" width="96" height="5" rx="1" />
        </g>

        <text className={`${styles.atText} ${styles.atTitle}`} x="230" y="44" style={{ '--d': 0.4 } as CSSProperties}>
          {words.length > 1 ? (
            <>
              {words.slice(0, -1).join(' ')} <tspan className={styles.atTitleTag}>{words.at(-1)}</tspan>
            </>
          ) : (
            visual.server
          )}
        </text>
        <text className={`${styles.atText} ${styles.atSub}`} x="231" y="59" style={{ '--d': 0.6 } as CSSProperties}>
          FIVEM · GTA V RP
        </text>
        <g transform="translate(240 84)">
          <g className={`${styles.atNode} ${styles.atLead}`} style={{ '--d': 1 } as CSSProperties}>
            <circle className={styles.atBadge} r="10" />
            <g className={styles.atIcon} transform="scale(0.7)">
              <AtPerson />
            </g>
            <path className={styles.atStar} d="M7.5 -11l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z" />
          </g>
        </g>
        <text className={`${styles.atText} ${styles.atLeadLabel}`} x="257" y="84" style={{ '--d': 1.15 } as CSSProperties}>
          {visual.lead}
        </text>
        {Array.from({ length: n }, (_, i) => (
          <g key={i} transform={`translate(${238 + i * 19} 112)`}>
            <g className={styles.atNode} style={{ '--d': 1.3 + i * 0.12 } as CSSProperties}>
              <circle className={styles.atBadge} r="8" />
              <g className={styles.atIcon} transform="scale(0.55)">
                <AtPerson />
              </g>
            </g>
          </g>
        ))}
        <text className={`${styles.atText} ${styles.atTeam}`} x={238 + n * 19 - 5} y="112" style={{ '--d': 1.3 + n * 0.12 } as CSSProperties}>
          {n} devs
        </text>
        {AT_STREETS.map((s) => (
          <g key={s.name} className={styles.atStreet} style={{ '--from': s.from, '--to': s.to } as CSSProperties}>
            <text className={`${styles.atText} ${styles.atStreetName}`} x="230" y="142">
              {s.name}
            </text>
            <text className={`${styles.atText} ${styles.atSub}`} x="231" y="156">
              {s.zone.toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}


// Timeline, in seconds of an 11s cycle (keep in sync with the lp styles) :
// 0.3 the KPI card opens, the curve drawing itself down into a dip · 1.5 the
// agent lands on the dip and reads the data · 2.6 it states its diagnosis ·
// 3.4 it moves over to the code and opens the PR · 4.3 it types the fix ·
// 5.8 it runs the checks, passing one by one · 7.3 a Merge button shows up,
// the agent's cursor clicks it · 8.2 the PR is merged, the curve climbs back
// and the KPI swaps to its new value · 10.2 everything fades.
// Curve : the past (left 65 % of the chart) ends on the dip, the rebound
// (right 35 %) starts from it.
const LP_PAST = 'M0 22C14 18 22 28 36 24S58 16 72 28S100 70 130 74'
const LP_NEXT = 'M0 74C14 74 22 60 34 46S56 20 70 18'

export function ProjectLevelPilotVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'levelPilot' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  // What the agent is doing, shown next to its avatar ; the insight is its
  // diagnosis, said while it still sits on the dip.
  const statuses = [
    { text: tr('Analyse les données'), busy: true },
    { text: visual.insight, busy: false },
    { text: tr('Écrit le correctif'), busy: true },
    { text: tr('Lance les tests'), busy: true },
    { text: tr('Merge la PR'), busy: true },
  ]
  return (
    <div
      className={`${styles.visual} ${styles.lp}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `Illustrative scenario, not measured results. ${visual.kpi} drops to ${visual.before}. The AI agent analyses the data and finds the cause (${visual.insight}), then writes the fix itself in pull request #${visual.pr.id} (${visual.pr.file}), runs the ${visual.checks.join(', ')} checks and, once they pass, merges it: ${visual.kpi} climbs back to ${visual.after} (${visual.delta}).`
          : `Scénario illustratif, sans résultats mesurés. ${visual.kpi} en baisse à ${visual.before}. L’agent IA analyse les données et trouve la cause (${visual.insight}), puis écrit lui-même le correctif dans la pull request #${visual.pr.id} (${visual.pr.file}), lance les vérifications ${visual.checks.join(', ')} et, une fois validées, la merge : ${visual.kpi} remonte à ${visual.after} (${visual.delta}).`
      }
    >
      <div className={styles.lpKpi} aria-hidden>
        <div className={styles.lpKpiHead}>
          <span className={styles.lpKpiLabel}>{visual.kpi}</span>
          <span className={styles.lpKpiValue}>
            <span className={styles.lpBefore}>{visual.before}</span>
            <span className={styles.lpAfter}>{visual.after}</span>
          </span>
          <span className={styles.lpDelta}>↑ {visual.delta}</span>
        </div>
        <div className={styles.lpChart}>
          <svg className={styles.lpPast} viewBox="0 0 130 100" preserveAspectRatio="none">
            <path className={styles.lpArea} d={`${LP_PAST}L130 100L0 100Z`} />
            <path className={styles.lpLine} d={LP_PAST} />
          </svg>
          <svg className={styles.lpNext} viewBox="0 0 70 100" preserveAspectRatio="none">
            <path className={styles.lpArea} d={`${LP_NEXT}L70 100L0 100Z`} />
            <path className={styles.lpLine} d={LP_NEXT} />
          </svg>
          <span className={styles.lpDip} />
        </div>
      </div>
      <div className={styles.lpPr} aria-hidden>
        <div className={styles.lpPrHead}>
          <svg className={styles.lpPrIcon} viewBox="0 0 16 16">
            <circle cx="4" cy="3.5" r="1.8" />
            <circle cx="4" cy="12.5" r="1.8" />
            <circle cx="12" cy="12.5" r="1.8" />
            <path d="M4 5.3v5.4M12 10.7V8a3 3 0 0 0-3-3H6.5" />
          </svg>
          <span className={styles.lpPrId}>PR #{visual.pr.id}</span>
          <span className={styles.lpPrState}>
            <span className={styles.lpReview}>{tr('En revue')}</span>
            <span className={styles.lpMergeBtn}>Merge</span>
            <span className={styles.lpMerged}>{tr('Mergée')}</span>
            <svg className={styles.lpCursor} viewBox="0 0 12 16">
              <path d="M1 1v12.5l3.3-3.1 2.2 4.9 2.2-1-2.2-4.8H11z" />
            </svg>
          </span>
        </div>
        <span className={styles.lpPrTitle}>{visual.fix}</span>
        <span className={styles.lpPrFile}>{visual.pr.file}</span>
        <span className={styles.lpDiff}>
          {visual.pr.diff.map((line, i) => (
            <span key={i} className={i ? styles.lpAdd : styles.lpDel}>
              <span className={styles.lpType} style={{ '--n': line.length, '--i': i } as CSSProperties}>
                {line}
              </span>
            </span>
          ))}
        </span>
        <ul className={styles.lpChecks}>
          {visual.checks.map((check, i) => (
            <li key={check} className={styles.lpCheck} style={{ '--i': i } as CSSProperties}>
              <span className={styles.lpCheckDot} />
              {check}
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.lpAgent} aria-hidden>
        <span className={styles.lpAvatar}>✦</span>
        {statuses.map((status, i) => (
          <span key={i} className={`${styles.lpStatus} ${i < 2 ? styles.lpStatusRight : ''}`} style={{ '--i': i } as CSSProperties}>
            {status.text}
            {status.busy && (
              <span className={styles.typing}>
                <span />
                <span />
                <span />
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

function ProjectChatVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'chatPreview' }> }) {
  const tr = useTranslation()
  return (
    <div className={styles.visual} style={{ borderRadius: 22, background: 'var(--ink)', padding: 22, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
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
        <span className={styles.typing} aria-label={tr('Réponse en cours')}>
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

const STATUS_LABELS: Record<ProjectStatus, string> = {
  live: 'En ligne',
  dev: 'En développement',
  production: 'En production',
  done: 'Terminé',
  archived: 'Archivé',
  abandoned: 'Abandonné',
}

const STATUS_CLASSES: Record<ProjectStatus, string> = {
  live: styles.statusLive,
  dev: styles.statusDev,
  production: styles.statusProduction,
  done: styles.statusDone,
  archived: styles.statusArchived,
  abandoned: styles.statusAbandoned,
}

function ProjectBadges({ project }: { project: Project }) {
  const t = useTranslation()
  return (
    <div className={styles.pcBadges}>
      <span className={`${styles.status} ${STATUS_CLASSES[project.status]}`}>
        <span className={styles.statusDot} aria-hidden="true" />
        {t(STATUS_LABELS[project.status])}
      </span>
      <span className={styles.context}>{project.context}</span>
    </div>
  )
}

const LINK_TEXTS: Record<ProjectLink['kind'], string> = {
  repo: 'GitHub',
  site: 'Voir le site',
  article: 'Lire l’article',
}

const LINK_ICONS: Record<ProjectLink['kind'], ComponentType> = {
  repo: GitHubIcon,
  site: GlobeIcon,
  article: ArticleIcon,
}

function ProjectLinks({ links, title }: { links: ProjectLink[]; title: string }) {
  const t = useTranslation()
  const locale = useLocale()
  return (
    <div className={styles.pcLinks}>
      {links.map((link) => {
        const Icon = LINK_ICONS[link.kind]
        return (
          <a
            key={link.href}
            className={styles.pcLink}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label ?? `${locale === 'en' ? 'Explore' : 'Découvrir'} ${title}`}
          >
            <Icon />
            {t(LINK_TEXTS[link.kind])}
            <DiagonalArrowIcon className={styles.pcLinkArrow} />
          </a>
        )
      })}
    </div>
  )
}

export function ProjectCard({ project, armed, motionEnabled }: ProjectCardProps) {
  const locale = useLocale()
  const caseSlug = project.title === 'Personal RAG' ? 'personal-rag' : project.title === 'LevelPilot' ? 'agents-ia-autonomes' : undefined
  const { onMouseMove, onMouseLeave } = useTilt(motionEnabled)
  const t = useTranslation()

  return (
    <Reveal
      as="article"
      armed={armed}
      className={`${styles.pcard} ${styles.pcardWide} ${styles.tilt}`}
      data-pcard=""
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 32, padding: 'clamp(24px, 3vw, 40px)' }}
    >
      <span className={styles.glare} />
      <div className={styles.pcHead}>
        <ProjectBadges project={project} />
      </div>
      <h3 className={`${styles.disp} ${styles.pcTitle}`} style={{ margin: 0, fontSize: 'clamp(30px, 3.2vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {project.title}
      </h3>
      <div className={styles.pcAside}>
        <div className={styles.pcVisual}>
          {project.visual.kind === 'placeholder' && (
            <div
              className={styles.visual}
              style={{ border: '1px dashed var(--line)', borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}
            >
              {project.visual.label}
            </div>
          )}
          {project.visual.kind === 'flow' && <ProjectFlowVisual steps={project.visual.steps} />}
          {project.visual.kind === 'ragCloud' && <ProjectRagVisual visual={project.visual} />}
          {project.visual.kind === 'chatPreview' && <ProjectChatVisual visual={project.visual} />}
          {project.visual.kind === 'faceOff' && <ProjectFaceOffVisual visual={project.visual} />}
          {project.visual.kind === 'rcLink' && <ProjectRcVisual visual={project.visual} />}
          {project.visual.kind === 'codeSandbox' && <ProjectSandboxVisual visual={project.visual} />}
          {project.visual.kind === 'cohoma' && <ProjectCohomaVisual visual={project.visual} />}
          {project.visual.kind === 'rescue' && <ProjectRescueVisual visual={project.visual} />}
          {project.visual.kind === 'luma' && <ProjectLumaVisual visual={project.visual} />}
          {project.visual.kind === 'tacticalMesh' && <ProjectTacticalMeshVisual visual={project.visual} />}
          {project.visual.kind === 'djise' && <ProjectDjiseVisual visual={project.visual} />}
          {project.visual.kind === 'rpMinimap' && <ProjectRpMinimapVisual visual={project.visual} />}
          {project.visual.kind === 'levelPilot' && <ProjectLevelPilotVisual visual={project.visual} />}
          {['levelPilot', 'faceOff', 'rcLink'].includes(project.visual.kind) && <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--muted)', marginTop: 10 }}>{t('Illustration du fonctionnement. Les valeurs affichées sont des exemples.')}</p>}
        </div>
        <div className={styles.pcChips} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {project.stack.map((tech, i) => (
            <span key={`${tech}-${i}`} className={styles.chip}>
              {tech}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.pcText}>
        {project.description && <p className={styles.pcDesc}>{project.description}</p>}
        {project.bullets && (
          <ul className={styles.bl}>
            {project.bullets.map((bullet, i) => (
              <li key={i}>{bullet}</li>
            ))}
          </ul>
        )}
        {caseSlug && <div className={styles.pcLinks}><Link className={styles.pcLink} href={`/${locale}/${caseSlug}`}>{locale === 'en' ? `Explore ${project.title}: architecture and demo` : `Découvrir ${project.title} : architecture et démo`}<DiagonalArrowIcon className={styles.pcLinkArrow} /></Link></div>}
        {project.links && project.links.length > 0 && <ProjectLinks links={project.links} title={project.title} />}
      </div>
    </Reveal>
  )
}
