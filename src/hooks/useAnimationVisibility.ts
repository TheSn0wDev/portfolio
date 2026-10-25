'use client'

import { useEffect, type RefObject } from 'react'

export function useAnimationVisibility(rootRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = rootRef.current
    if (!root || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.toggleAttribute('data-animation-visible', entry.isIntersecting)
      }
    })
    root.setAttribute('data-pause-offscreen', '')
    root.querySelectorAll('[data-pcard]').forEach(card => observer.observe(card))
    return () => {
      observer.disconnect()
      root.removeAttribute('data-pause-offscreen')
    }
  }, [rootRef])
}
