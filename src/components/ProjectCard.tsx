'use client'

import { useLocale, useTranslation } from '@/i18n/LocaleProvider'
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

function ProjectRagVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'ragCloud' }> }) {
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
      aria-label={locale === 'en' ? `The controller sends radio commands; the vehicle moves with each command. Measured latency: ${Math.min(...visual.latencies)} to ${Math.max(...visual.latencies)} ms.` : `La manette envoie ses commandes par radio ; le véhicule avance à chaque ordre reçu. Latence mesurée : ${Math.min(...visual.latencies)} à ${Math.max(...visual.latencies)} ms.`}
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

// Drone patrols on the radar, as elliptic orbits around the command node :
// start angle (deg), radii in % of the visual's width / height, lap time (s),
// direction, and how long the orbit takes to breathe in and out (s). Laps are
// coprime-ish so the formation never visibly repeats.
const VR_ORBITS = [
  { a: 20, rx: 34, ry: 34, lap: 19, dir: 'normal', breathe: 5.2 },
  { a: 140, rx: 42, ry: 40, lap: 27, dir: 'reverse', breathe: 6.6 },
  { a: 230, rx: 26, ry: 28, lap: 15, dir: 'normal', breathe: 4.4 },
  { a: 310, rx: 38, ry: 42, lap: 23, dir: 'reverse', breathe: 7.4 },
] as const

function ProjectRadarVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'radar' }> }) {
  const locale = useLocale()
  const tr = useTranslation()
  return (
    <div
      className={`${styles.visual} ${styles.vr}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `Tactical map under a radar sweep: ${visual.drones.length} drones (${visual.drones.join(', ')}) patrol the area and stream their data to the ${visual.command} node.`
          : `Carte tactique sous balayage radar : ${visual.drones.length} drones (${visual.drones.join(', ')}) patrouillent la zone et remontent leurs données au nœud ${visual.command}.`
      }
    >
      <svg className={styles.vrMap} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <path className={styles.vrGrid} d="M40 0v200M80 0v200M120 0v200M160 0v200M200 0v200M240 0v200M280 0v200M320 0v200M360 0v200M0 40h400M0 80h400M0 120h400M0 160h400" />
        <g className={styles.vrContour}>
          <path d="M40 150c10-26 52-30 70-12s4 40-24 40-54-8-46-28z" />
          <path d="M26 152c10-40 76-46 100-18s6 58-38 58-78-10-62-40z" />
          <path d="M300 40c8-18 44-20 52-2s-10 30-30 28-28-10-22-26z" />
          <path d="M286 42c10-30 70-32 82-4s-16 46-48 42-46-14-34-38z" />
        </g>
        <path className={styles.vrRiver} d="M-5 70C50 60 90 92 150 84S250 40 300 120s70 70 105 72" />
      </svg>
      <span className={styles.vrRings} />
      <span className={styles.vrSweep} />
      {[0, 1, 2].map((i) => (
        <span key={i} className={styles.vrPulse} style={{ animationDelay: `${i}s` }} />
      ))}
      {visual.drones.map((drone, i) => {
        const o = VR_ORBITS[i % VR_ORBITS.length]
        return (
          <span
            key={drone}
            className={styles.vrDrone}
            style={
              {
                '--a0': `${o.a}deg`,
                '--rx': `${o.rx}cqw`,
                '--ry': `${o.ry}cqh`,
                animationDuration: `${o.lap}s, ${o.breathe}s`,
                animationDirection: `${o.dir}, alternate`,
              } as CSSProperties
            }
          >
            <span className={styles.vrLink}>
              <span className={styles.vrPacket} style={{ animationDelay: `${(i * 0.45).toFixed(2)}s` }} />
              <span className={`${styles.vrPacket} ${styles.vrOrder}`} style={{ animationDelay: `${(1.1 + i * 0.45).toFixed(2)}s` }} />
            </span>
            <span className={styles.vrBlip}>
              <span className={styles.vrBlipLabel}>{drone}</span>
            </span>
          </span>
        )
      })}
      <span className={styles.vrCommand}>
        <span className={styles.vrCommandLabel}>{visual.command}</span>
      </span>
      <span className={styles.vrHud}>
        <span className={styles.pulse} />
        {tr('Liaison active')} · {visual.drones.length}/{visual.drones.length}
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
// 0.3 the island's coastline draws itself · 1.2 the pin drops onto it and
// lands with a ripple · 1.9 the lead pops in above and links down to the pin
// · 2.6 the bus spreads out under the pin, members pop in from the centre
// outwards, each one hooking onto it · 4.6 and 6.2 a packet runs from the
// lead through the pin down to every member · 8.3 everything fades out.
// Rough outline of the Île d'Oléron (north-west tip to south-east tip, east
// coast first), smoothed into a closed Catmull-Rom curve on a 400×200 board.
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
// Org chart : lead, pin (the point it marks), bus, member row.
const AT_LEAD = [200, 32]
const AT_PIN = [200, 104]
const AT_BUS = 130
const AT_ROW = 158
const AT_GAP = 64

function AtPerson() {
  return (
    <>
      <circle cx="0" cy="-3.2" r="3.6" />
      <path d="M-6.5 7.5a6.5 6.2 0 0 1 13 0" />
    </>
  )
}

function ProjectRpTeamVisual({ visual }: { visual: Extract<Project['visual'], { kind: 'rpTeam' }> }) {
  const locale = useLocale()
  const n = Math.max(1, Math.min(6, visual.team))
  const [lx, ly] = AT_LEAD
  const [px, py] = AT_PIN
  const members = Array.from({ length: n }, (_, i) => {
    const off = i - (n - 1) / 2
    // Packets leave at 4.6 and 6.2 (staggered outwards) and take 1.1s to land.
    const lag = Math.abs(off) * 0.08 + 1.1
    return { x: px + off * AT_GAP, d: 3 + Math.abs(off) * 0.22, h1: 4.6 + lag, h2: 6.2 + lag }
  })
  const spread = ((n - 1) / 2) * AT_GAP
  return (
    <div
      className={`${styles.visual} ${styles.at}`}
      role="img"
      aria-label={
        locale === 'en'
          ? `Map centred on ${visual.place}: a pin drops on the island, then a team of ${n} developers gathers around it and links up into an org chart under the ${visual.lead}.`
          : `Carte centrée sur ${visual.place} : un pin se pose sur l’île, puis une équipe de ${n} développeurs se rassemble autour et se connecte en organigramme sous le ${visual.lead}.`
      }
    >
      <svg className={styles.atMap} viewBox="0 0 400 200" aria-hidden>
        <g className={styles.atSea}>
          <path d="M18 150q10-5 20 0t20 0M300 40q10-5 20 0t20 0M52 74q10-5 20 0t20 0M318 176q10-5 20 0t20 0" />
        </g>
        <path className={styles.atMainland} d="M346 -5C334 30 352 58 340 86S356 140 344 205" />
        <path className={styles.atBridge} d="M243 116L342 106" />
        <path className={styles.atIslandFill} d={AT_ISLAND} />
        <path className={styles.atCoast} d={AT_ISLAND} pathLength={1} />
        <path className={styles.atLine} d={`M${lx} ${ly + 15}V${py - 31}`} pathLength={1} style={{ '--d': 2.2 } as CSSProperties} />
        <path className={styles.atLine} d={`M${px} ${py}V${AT_BUS}`} pathLength={1} style={{ '--d': 2.5 } as CSSProperties} />
        {n > 1 && (
          <>
            <path className={styles.atLine} d={`M${px} ${AT_BUS}h${-spread}`} pathLength={1} style={{ '--d': 2.7, '--len': 0.25 + spread / 400 } as CSSProperties} />
            <path className={styles.atLine} d={`M${px} ${AT_BUS}h${spread}`} pathLength={1} style={{ '--d': 2.7, '--len': 0.25 + spread / 400 } as CSSProperties} />
          </>
        )}
        {members.map((m, i) => (
          <path key={i} className={styles.atLine} d={`M${m.x} ${AT_BUS}V${AT_ROW - 13}`} pathLength={1} style={{ '--d': m.d - 0.1, '--len': 0.15 } as CSSProperties} />
        ))}
        {members.map((m, i) =>
          [4.6, 6.2].map((run) => (
            <path
              key={`${i}-${run}`}
              className={styles.atPacket}
              d={`M${lx} ${ly + 15}V${AT_BUS}H${m.x}V${AT_ROW - 13}`}
              pathLength={1}
              style={{ '--d': run + Math.abs(i - (n - 1) / 2) * 0.08 } as CSSProperties}
            />
          )),
        )}
        <g transform={`translate(${px} ${py})`}>
          <ellipse className={styles.atRipple} rx="16" ry="5" />
          <ellipse className={styles.atRipple} rx="16" ry="5" style={{ '--d': 5.1 } as CSSProperties} />
          <ellipse className={styles.atRipple} rx="16" ry="5" style={{ '--d': 6.7 } as CSSProperties} />
          <ellipse className={styles.atShadow} rx="6" ry="2" />
          <g className={styles.atPin}>
            <path className={styles.atPinBody} d="M0 0C-4 -7 -11 -11 -11 -18.5a11 11 0 0 1 22 0C11 -11 4 -7 0 0Z" />
            <circle className={styles.atPinDot} cy="-18.5" r="4.2" />
          </g>
          <text className={styles.atPlace} x="15" y="-19">
            {visual.place}
          </text>
        </g>
        <g transform={`translate(${lx} ${ly})`}>
          <g className={`${styles.atNode} ${styles.atLead}`} style={{ '--d': 1.9 } as CSSProperties}>
            <circle className={styles.atRing} r="22" />
            <circle className={styles.atBadge} r="15" />
            <g className={styles.atIcon}>
              <AtPerson />
            </g>
            <path className={styles.atStar} d="M11 -15l1.6 3.3 3.6.5-2.6 2.5.6 3.6-3.2-1.7-3.2 1.7.6-3.6-2.6-2.5 3.6-.5z" />
          </g>
          <text className={`${styles.atLabel} ${styles.atLeadLabel}`} x="24" y="0" style={{ '--d': 2.1 } as CSSProperties}>
            {visual.lead}
          </text>
        </g>
        {members.map((m, i) => (
          <g key={i} transform={`translate(${m.x} ${AT_ROW})`}>
            <g className={styles.atNode} style={{ '--d': m.d, '--h1': m.h1, '--h2': m.h2 } as CSSProperties}>
              <circle className={styles.atRing} r="18" />
              <circle className={styles.atBadge} r="12" />
              <g className={styles.atIcon}>
                <AtPerson />
              </g>
            </g>
          </g>
        ))}
      </svg>
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

export function ProjectCard({ project, armed, motionEnabled }: ProjectCardProps) {
  const locale = useLocale()
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
        <div className={styles.visual} style={{ borderRadius: 22, background: 'var(--surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', fontSize: 14 }}>
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
      className={`${styles.pcard} ${styles.pcardWide} ${styles.tilt}`}
      data-pcard=""
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 32, padding: 'clamp(24px, 3vw, 40px)' }}
    >
      <span className={styles.glare} />
      <div className={styles.pcHead} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', minHeight: 44 }}>
        <span style={{ fontSize: 12, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--muted)', fontWeight: 600 }}>
          {project.index} · {project.category}
        </span>
        {project.url && (
          <a
            href={project.url}
            aria-label={project.linkLabel ?? `${locale === 'en' ? 'Explore' : 'Découvrir'} ${project.title}`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, borderRadius: '50%', background: 'var(--surface)', color: 'var(--ink)' }}
          >
            <DiagonalArrowIcon />
          </a>
        )}
      </div>
      <h3 className={`${styles.disp} ${styles.pcTitle}`} style={{ margin: 0, fontSize: 'clamp(30px, 3.2vw, 44px)', fontWeight: 900, color: 'var(--ink)', letterSpacing: '-0.02em', lineHeight: 1 }}>
        {project.title}
      </h3>
      <div className={styles.pcAside}>
        <div className={styles.pcVisual}>
          {project.visual.kind === 'flow' && <ProjectFlowVisual steps={project.visual.steps} />}
          {project.visual.kind === 'ragCloud' && <ProjectRagVisual visual={project.visual} />}
          {project.visual.kind === 'chatPreview' && <ProjectChatVisual visual={project.visual} />}
          {project.visual.kind === 'faceOff' && <ProjectFaceOffVisual visual={project.visual} />}
          {project.visual.kind === 'rcLink' && <ProjectRcVisual visual={project.visual} />}
          {project.visual.kind === 'codeSandbox' && <ProjectSandboxVisual visual={project.visual} />}
          {project.visual.kind === 'cohoma' && <ProjectCohomaVisual visual={project.visual} />}
          {project.visual.kind === 'radar' && <ProjectRadarVisual visual={project.visual} />}
          {project.visual.kind === 'luma' && <ProjectLumaVisual visual={project.visual} />}
          {project.visual.kind === 'tacticalMesh' && <ProjectTacticalMeshVisual visual={project.visual} />}
          {project.visual.kind === 'djise' && <ProjectDjiseVisual visual={project.visual} />}
          {project.visual.kind === 'rpTeam' && <ProjectRpTeamVisual visual={project.visual} />}
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
      </div>
    </Reveal>
  )
}
