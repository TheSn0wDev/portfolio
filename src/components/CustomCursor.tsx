import { forwardRef } from 'react'
import styles from './portfolio.module.css'

// Two layers: a thin ring for the default/hover states, and a filled pill that
// takes over above the project track. The pill's background is split from its
// content so the drag stretch (driven per frame by usePointerFx) never
// distorts the label or the arrows. A third layer, the scissors, shows over
// tear lines : two blades pivoting on one screw, snipping in a loop.
export const CustomCursor = forwardRef<HTMLDivElement>(function CustomCursor(_props, ref) {
  return (
    <div ref={ref} className={styles.cur} aria-hidden="true">
      <span className={styles.curR} />
      <span className={styles.curP}>
        <span className={styles.curBg} data-cur-bg="" />
        <span className={styles.curC}>
          <svg className={`${styles.curA} ${styles.curAL}`} viewBox="0 0 7 10" fill="none">
            <path d="M5.5 1.5L2 5l3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.curL}>Glisser</span>
          <svg className={`${styles.curA} ${styles.curAR}`} viewBox="0 0 7 10" fill="none">
            <path d="M1.5 1.5L5 5 1.5 8.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className={styles.curS}>
        <svg viewBox="0 0 40 24" fill="none">
          <g className={styles.curSA}>
            <path d="M15 12.6 Q27 6.6 38.5 10.4 Q28 12.2 17 13.6 Z" fill="currentColor" />
            <path d="M17.5 12.4 L11.2 16.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="7.6" cy="17.6" r="3.9" stroke="currentColor" strokeWidth="2.2" />
          </g>
          <g className={styles.curSB}>
            <path d="M15 11.4 Q27 17.4 38.5 13.6 Q28 11.8 17 10.4 Z" fill="currentColor" />
            <path d="M17.5 11.6 L11.2 7.8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="7.6" cy="6.4" r="3.9" stroke="currentColor" strokeWidth="2.2" />
          </g>
          <circle cx="17" cy="12" r="1.4" fill="var(--ink)" />
        </svg>
      </span>
    </div>
  )
})
