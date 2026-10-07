'use client'

import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// One scroll listener drives two things, like the original: the header's
// frosted-glass background once the page scrolls past 24px, and the
// experience timeline's rail-fill / lit dots. Scroll events bubbling up from
// the chat thread's own internal scroll (inside rootRef) are ignored so
// scrolling a conversation doesn't move the timeline or toggle the header.
export function useHeaderScroll(
  rootRef: RefObject<HTMLElement | null>,
  timelineRef: RefObject<HTMLElement | null>,
  tdotOnClass: string,
): boolean {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = (e?: Event) => {
      const target = e?.target as Element | null
      if (target && target.nodeType === 1 && rootRef.current?.contains(target)) return

      const y =
        target && target.nodeType === 1 && typeof (target as HTMLElement).scrollTop === 'number'
          ? (target as HTMLElement).scrollTop
          : window.scrollY || document.scrollingElement?.scrollTop || 0
      setScrolled(y > 24)

      const tl = timelineRef.current
      if (tl) {
        const r = tl.getBoundingClientRect()
        const vh = window.innerHeight || 800
        const p = Math.max(0, Math.min(1, (vh * 0.62 - r.top) / (r.height || 1)))
        tl.style.setProperty('--tl', p.toFixed(4))
        const fillY = 12 + p * ((r.height || 0) - 24)
        tl.querySelectorAll<HTMLElement>('[data-tdot]').forEach((dot) => {
          const parent = dot.parentElement
          const cy = (parent ? parent.offsetTop : 0) + dot.offsetTop + dot.offsetHeight / 2
          dot.classList.toggle(tdotOnClass, fillY >= cy - 2)
        })
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true, capture: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [rootRef, timelineRef, tdotOnClass])

  return scrolled
}
