'use client'

import { useEffect, useRef, useState } from 'react'
import type { ElementType, ReactNode } from 'react'
import styles from './portfolio.module.css'

type RevealProps = {
  as?: ElementType
  armed: boolean
  className?: string
  children?: ReactNode
  [key: string]: unknown
}

// Wraps a section element so it fades/slides in once scrolled into view ;
// mirrors the original's `.rv` / `.rv.in` behavior, but scoped as an
// IntersectionObserver per element instead of one global observer.
export function Reveal({ as: Tag = 'div', armed, className, children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [hasIntersected, setHasIntersected] = useState(false)
  const ioSupported = typeof window !== 'undefined' && 'IntersectionObserver' in window

  // Not armed (motion disabled, tall viewport, or still resolving on mount) or no
  // IntersectionObserver support: stay visible rather than hiding content nothing
  // will ever reveal.
  const inView = !armed || !ioSupported || hasIntersected

  useEffect(() => {
    if (!armed || !ioSupported) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasIntersected(true)
            io.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [armed, ioSupported])

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={[styles.rv, inView ? styles.rvIn : '', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </Tag>
  )
}
