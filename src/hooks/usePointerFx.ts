'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

type Options = {
  rootRef: RefObject<HTMLElement | null>
  heroRef: RefObject<HTMLElement | null>
  cursorRef: RefObject<HTMLElement | null>
  bigClass: string
  dragClass: string
  enabled: boolean
}

// Ports the pointer-driven effects of the original design in one place, since
// they all share a single rAF loop: the subtle parallax on the hero name
// (--mx/--my), the spotlight that lights up the dot grid under the cursor
// (--px/--py), and the custom cursor that grows over interactive elements and
// turns into a drag pill over the horizontal project track.
export function usePointerFx({ rootRef, heroRef, cursorRef, bigClass, dragClass, enabled }: Options) {
  const state = useRef({ mx: 0, my: 0, tmx: 0, tmy: 0, cx: -100, cy: -100, tcx: -100, tcy: -100, seen: false })

  useEffect(() => {
    const s = state.current

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      s.tmx = (e.clientX / w) * 2 - 1
      s.tmy = Math.max(-1, Math.min(1, (e.clientY / Math.min(h, 1000)) * 2 - 1))
      s.tcx = e.clientX
      s.tcy = e.clientY
      s.seen = true
      const hero = heroRef.current
      if (hero) {
        const r = hero.getBoundingClientRect()
        hero.style.setProperty('--px', (e.clientX - r.left).toFixed(0) + 'px')
        hero.style.setProperty('--py', (e.clientY - r.top).toFixed(0) + 'px')
      }
    }

    const onOver = (e: Event) => {
      const cur = cursorRef.current
      if (!cur) return
      const target = e.target as HTMLElement | null
      const closestInteractive = target && target.closest ? target.closest('a,button,input') : null
      const closestTrack = target && target.closest ? target.closest('[data-ptrack]') : null
      const dragOverride = !!(closestInteractive && closestInteractive.hasAttribute('data-cursor-drag'))
      const dragOn = !!closestTrack && (!closestInteractive || dragOverride)
      cur.classList.toggle(dragClass, dragOn)
      cur.classList.toggle(bigClass, !!closestInteractive && !dragOn)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, true)

    let raf = requestAnimationFrame(function loop() {
      raf = requestAnimationFrame(loop)
      s.mx += (s.tmx - s.mx) * 0.06
      s.my += (s.tmy - s.my) * 0.06
      const root = rootRef.current
      if (root && enabled) {
        root.style.setProperty('--mx', s.mx.toFixed(3))
        root.style.setProperty('--my', s.my.toFixed(3))
      }
      const cur = cursorRef.current
      if (cur) {
        if (enabled && s.seen) {
          s.cx += (s.tcx - s.cx) * 0.2
          s.cy += (s.tcy - s.cy) * 0.2
          cur.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`
          cur.style.opacity = '1'
        } else {
          cur.style.opacity = '0'
        }
      }
    })

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver, true)
      cancelAnimationFrame(raf)
    }
  }, [rootRef, heroRef, cursorRef, bigClass, dragClass, enabled])
}
