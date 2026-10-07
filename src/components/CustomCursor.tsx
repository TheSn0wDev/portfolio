import { forwardRef } from 'react'
import styles from './portfolio.module.css'

export const CustomCursor = forwardRef<HTMLDivElement>(function CustomCursor(_props, ref) {
  return (
    <div ref={ref} className={styles.cur} aria-hidden="true">
      <span className={styles.curL}>Glisser</span>
    </div>
  )
})
