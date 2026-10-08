import { forwardRef } from 'react'
import styles from './portfolio.module.css'

// Two layers: a thin ring for the default/hover states, and a filled pill that
// takes over above the project track. The pill's background is split from its
// content so the drag stretch (driven per frame by usePointerFx) never
// distorts the label or the arrows.
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
    </div>
  )
})
