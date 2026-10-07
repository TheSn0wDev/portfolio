'use client'

import { useSyncExternalStore } from 'react'

function subscribe() {
  return () => {}
}

// Mirrors the original: reveal-on-scroll is only "armed" (i.e. elements start
// hidden and fade in) when motion is enabled, the viewport is short enough that
// most content needs scrolling to reveal, and IntersectionObserver is available.
// Otherwise everything is visible immediately ; no point animating a page that's
// already fully in view. Read as a snapshot of the browser environment so it
// resolves correctly on the client without a server/client mismatch.
export function useRevealArmed(motionEnabled: boolean): boolean {
  return useSyncExternalStore(
    subscribe,
    () => motionEnabled && window.innerHeight < 1600 && 'IntersectionObserver' in window,
    () => false,
  )
}
