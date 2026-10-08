'use client'

import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

type Options = {
  rootRef: RefObject<HTMLElement | null>
  heroRef: RefObject<HTMLElement | null>
  cursorRef: RefObject<HTMLElement | null>
  bigClass: string
  dragClass: string
  pressClass: string
  atStartClass: string
  atEndClass: string
  cutClass?: string
  flipClass?: string
  enabled: boolean
}

// Ports the pointer-driven effects of the original design in one place, since
// they all share a single rAF loop: the subtle parallax on the hero name
// (--mx/--my), the spotlight that lights up the dot grid under the cursor
// (--px/--py), and the custom cursor, a decorative follower of the native
// pointer (which stays visible), that grows over interactive elements and
// turns into a drag pill over the horizontal project track. The pill squashes
// while grabbed, stretches with the cursor's horizontal speed, and dims the
// arrow pointing at an edge the track has already reached (read from the
// track's data-at-start / data-at-end attributes). Over a [data-pcut] zone it
// becomes a pair of scissors that turns to face the way the pointer moves.
export function usePointerFx({ rootRef, heroRef, cursorRef, bigClass, dragClass, pressClass, atStartClass, atEndClass, cutClass, flipClass, enabled }: Options) {
  const state = useRef({
    mx: 0,
    my: 0,
    tmx: 0,
    tmy: 0,
    cx: -100,
    cy: -100,
    tcx: -100,
    tcy: -100,
    vx: 0,
    stretch: 0,
    seen: false,
    pressed: false,
    lastTarget: null as HTMLElement | null,
    track: null as HTMLElement | null,
    cut: false,
  })

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

    const applyTarget = (target: HTMLElement | null) => {
      const cur = cursorRef.current
      if (!cur) return
      const closestInteractive = target && target.closest ? target.closest('a,button,input') : null
      const closestTrack = target && target.closest ? target.closest('[data-ptrack]') : null
      const dragOverride = !!(closestInteractive && closestInteractive.hasAttribute('data-cursor-drag'))
      const dragOn = !!closestTrack && (!closestInteractive || dragOverride)
      s.cut = !!cutClass && !!target?.closest?.('[data-pcut]')
      s.track = dragOn ? (closestTrack as HTMLElement) : null
      cur.classList.toggle(dragClass, dragOn)
      cur.classList.toggle(bigClass, !!closestInteractive && !dragOn && !s.cut)
      if (cutClass) cur.classList.toggle(cutClass, s.cut)
    }

    const onOver = (e: Event) => {
      s.lastTarget = e.target as HTMLElement | null
      // Keep the grabbed pill while a drag is in flight, even if the pointer
      // wanders off the track; the real target is re-applied on release.
      if (!s.pressed) applyTarget(s.lastTarget)
    }

    const onDown = (e: PointerEvent) => {
      const cur = cursorRef.current
      if (!cur || e.pointerType !== 'mouse' || e.button !== 0 || !(cur.classList.contains(dragClass) || s.cut)) return
      s.pressed = true
      cur.classList.add(pressClass)
    }

    const onUp = () => {
      if (!s.pressed) return
      s.pressed = false
      cursorRef.current?.classList.remove(pressClass)
      applyTarget(s.lastTarget)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, true)
    window.addEventListener('pointerdown', onDown, true)
    window.addEventListener('pointerup', onUp, true)
    window.addEventListener('pointercancel', onUp, true)
    window.addEventListener('blur', onUp)

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
          // The ring and pill trail the native pointer as decoration; the
          // scissors stand in for it, so they track it exactly.
          const px = s.cx
          const k = s.cut ? 1 : 0.2
          s.cx += (s.tcx - s.cx) * k
          s.cy += (s.tcy - s.cy) * k
          cur.style.transform = `translate3d(${s.cx.toFixed(1)}px,${s.cy.toFixed(1)}px,0)`
          cur.style.opacity = '1'

          const track = s.track
          s.vx += (s.cx - px - s.vx) * 0.3
          const raw = track ? Math.min(Math.abs(s.vx) / 60, 0.3) : 0
          const stretch = raw < 0.005 ? 0 : raw
          if (Math.abs(stretch - s.stretch) > 0.002) {
            s.stretch = stretch
            const bg = cur.querySelector<HTMLElement>('[data-cur-bg]')
            if (bg) bg.style.transform = stretch ? `scale(${(1 + stretch).toFixed(3)},${(1 - stretch * 0.5).toFixed(3)})` : ''
          }
          if (flipClass && s.cut && Math.abs(s.vx) > 0.6) cur.classList.toggle(flipClass, s.vx < 0)
          cur.classList.toggle(atStartClass, !!track && track.hasAttribute('data-at-start'))
          cur.classList.toggle(atEndClass, !!track && track.hasAttribute('data-at-end'))
        } else {
          cur.style.opacity = '0'
        }
      }
    })

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver, true)
      window.removeEventListener('pointerdown', onDown, true)
      window.removeEventListener('pointerup', onUp, true)
      window.removeEventListener('pointercancel', onUp, true)
      window.removeEventListener('blur', onUp)
      cancelAnimationFrame(raf)
    }
  }, [rootRef, heroRef, cursorRef, bigClass, dragClass, pressClass, atStartClass, atEndClass, cutClass, flipClass, enabled])
}
