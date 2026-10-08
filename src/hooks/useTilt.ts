'use client'

import { useCallback } from 'react'
import type { MouseEvent } from 'react'

export function useTilt(enabled: boolean) {
  const onMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!enabled) return
      const el = e.currentTarget
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width
      const y = (e.clientY - r.top) / r.height
      el.style.setProperty('--ry', ((x - 0.5) * 6).toFixed(2) + 'deg')
      el.style.setProperty('--rx', ((0.5 - y) * 5).toFixed(2) + 'deg')
      el.style.setProperty('--gx', (x * 100).toFixed(1) + '%')
      el.style.setProperty('--gy', (y * 100).toFixed(1) + '%')
    },
    [enabled],
  )

  const onMouseLeave = useCallback((e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }, [])

  return { onMouseMove, onMouseLeave }
}
