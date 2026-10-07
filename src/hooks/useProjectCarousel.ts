'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent, MouseEvent, PointerEvent } from 'react'

type DragSession = {
  x: number
  startScrollLeft: number
  moved: boolean
  samples: { x: number; t: number }[]
}

type TrackMode = 'snap' | 'free' | 'dragging'

// Horizontal scroll-snap carousel with pointer drag + flick inertia, matching
// the original's hand-tuned easing. "free" temporarily disables CSS scroll-snap
// while an inertia animation or drag is in flight, so the track can glide past
// the snap points instead of fighting them.
export function useProjectCarousel(motionEnabled: boolean) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const pbarRef = useRef<HTMLDivElement | null>(null)
  const [mode, setMode] = useState<TrackMode>('snap')
  const [progress, setProgress] = useState({ index: 0, total: 0, atStart: true, atEnd: false })

  const dragMovedRef = useRef(false)
  const dragRef = useRef<DragSession | null>(null)
  const snapRafRef = useRef<number | null>(null)
  const snapTargetRef = useRef<number | null>(null)
  const motionRef = useRef(motionEnabled)

  useEffect(() => {
    motionRef.current = motionEnabled
  }, [motionEnabled])

  const stepW = useCallback(() => {
    const t = trackRef.current
    if (!t) return 1
    const cards = t.querySelectorAll<HTMLElement>('[data-pcard]')
    return cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : t.clientWidth
  }, [])

  const clampPos = useCallback((x: number) => {
    const t = trackRef.current
    if (!t) return 0
    return Math.max(0, Math.min(t.scrollWidth - t.clientWidth, x))
  }, [])

  const updateTrack = useCallback(() => {
    const t = trackRef.current
    if (!t) return
    const max = t.scrollWidth - t.clientWidth
    const p = max > 0 ? t.scrollLeft / max : 0
    pbarRef.current?.style.setProperty('--pp', p.toFixed(4))
    const n = t.querySelectorAll('[data-pcard]').length
    const atStart = t.scrollLeft < 4
    const atEnd = t.scrollLeft > max - 4
    const idx = atEnd ? n - 1 : Math.min(n - 1, Math.round(t.scrollLeft / stepW()))
    setProgress((prev) =>
      prev.index === idx && prev.atStart === atStart && prev.atEnd === atEnd && prev.total === n
        ? prev
        : { index: idx, atStart, atEnd, total: n },
    )
  }, [stepW])

  const animateTo = useCallback(
    (target: number, v: number) => {
      const t = trackRef.current
      if (!t) return
      if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current)
      snapRafRef.current = null
      const from = t.scrollLeft
      const dist = target - from
      snapTargetRef.current = target
      if (Math.abs(dist) < 1 || !motionRef.current) {
        t.scrollLeft = target
        setMode('snap')
        updateTrack()
        return
      }
      setMode('free')
      const dur = Math.max(480, Math.min(1000, 420 + Math.abs(dist) * 0.55))
      const v0 = (-(v || 0) * dur) / (dist || 1)
      const t0 = performance.now()
      const ease = (k: number) => {
        const e = 1 - Math.pow(1 - k, 4)
        const s0 = Math.max(0, Math.min(1.5, v0))
        return e + s0 * k * Math.pow(1 - k, 3) * 0.6
      }
      const step = (now: number) => {
        const k = Math.min(1, (now - t0) / dur)
        t.scrollLeft = from + dist * ease(k)
        if (k < 1) {
          snapRafRef.current = requestAnimationFrame(step)
        } else {
          snapRafRef.current = null
          t.scrollLeft = target
          setMode('snap')
          updateTrack()
        }
      }
      snapRafRef.current = requestAnimationFrame(step)
    },
    [updateTrack],
  )

  const nudge = useCallback(
    (dir: number) => {
      const t = trackRef.current
      if (!t) return
      const st = stepW()
      const cur =
        snapTargetRef.current != null && snapRafRef.current ? Math.round(snapTargetRef.current / st) : Math.round(t.scrollLeft / st)
      animateTo(clampPos((cur + dir) * st), 0)
    },
    [stepW, clampPos, animateTo],
  )

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    const t = trackRef.current
    if (!t || e.pointerType !== 'mouse' || e.button !== 0) return
    dragMovedRef.current = false
    if (snapRafRef.current) cancelAnimationFrame(snapRafRef.current)
    snapRafRef.current = null
    dragRef.current = {
      x: e.clientX,
      startScrollLeft: t.scrollLeft,
      moved: false,
      samples: [{ x: e.clientX, t: performance.now() }],
    }
    setMode('dragging')

    const onMove = (ev: globalThis.PointerEvent) => {
      const d = dragRef.current
      if (!t || !d) return
      const dx = ev.clientX - d.x
      if (Math.abs(dx) > 5) d.moved = true
      t.scrollLeft = d.startScrollLeft - dx
      const now = performance.now()
      d.samples.push({ x: ev.clientX, t: now })
      while (d.samples.length > 2 && now - d.samples[0].t > 100) d.samples.shift()
    }

    const onUp = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      const d = dragRef.current
      dragRef.current = null
      if (!t || !d) return
      dragMovedRef.current = d.moved
      const now = performance.now()
      const a = d.samples[0]
      const b = d.samples[d.samples.length - 1]
      let v = 0
      if (a && b && b.t > a.t && now - b.t < 80) v = (b.x - a.x) / (b.t - a.t)
      v = Math.max(-3, Math.min(3, v))
      const st = stepW()
      const base = Math.round(t.scrollLeft / st)
      let idx = Math.round((t.scrollLeft - v * 260) / st)
      if (idx === base && Math.abs(v) > 0.3) idx = base + (v < 0 ? 1 : -1)
      animateTo(clampPos(idx * st), v)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
  }, [stepW, clampPos, animateTo])

  const onScroll = useCallback(() => updateTrack(), [updateTrack])

  const onDragStart = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }, [])

  const onClickCapture = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (dragMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
      dragMovedRef.current = false
    }
  }, [])

  useEffect(() => {
    updateTrack()
    const onResize = () => updateTrack()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [updateTrack])

  return {
    trackRef,
    pbarRef,
    mode,
    index: progress.index,
    total: progress.total,
    atStart: progress.atStart,
    atEnd: progress.atEnd,
    prev: () => nudge(-1),
    next: () => nudge(1),
    trackHandlers: { onPointerDown, onScroll, onDragStart, onClickCapture },
  }
}
