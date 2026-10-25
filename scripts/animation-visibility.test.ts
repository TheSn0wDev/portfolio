import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { act, create } from 'react-test-renderer'
import { useAnimationVisibility } from '../src/hooks/useAnimationVisibility'
import { usePointerFx } from '../src/hooks/usePointerFx'

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })

test('carousel animations follow visibility and observer is cleaned up', async () => {
  const originalWindow = globalThis.window
  const originalObserver = globalThis.IntersectionObserver
  const attributes = new Set<string>()
  const card = { toggleAttribute(name: string, visible: boolean) { if (visible) attributes.add(name); else attributes.delete(name) } }
  let callback: IntersectionObserverCallback
  let disconnected = false
  const root = {
    setAttribute(name: string) { attributes.add(name) },
    removeAttribute(name: string) { attributes.delete(name) },
    querySelectorAll() { return [card] },
  }
  const ref = { current: root as unknown as HTMLElement }
  class Observer {
    constructor(cb: IntersectionObserverCallback) { callback = cb }
    observe(target: unknown) { assert.equal(target, card) }
    disconnect() { disconnected = true }
  }
  Object.assign(globalThis, { window: { IntersectionObserver: Observer }, IntersectionObserver: Observer })
  function Harness() { useAnimationVisibility(ref); return null }
  try {
    let renderer: ReturnType<typeof create>
    await act(async () => { renderer = create(createElement(Harness)) })
    assert.ok(attributes.has('data-pause-offscreen'))
    const notify = (isIntersecting: boolean) => callback([{ target: card, isIntersecting } as unknown as IntersectionObserverEntry], {} as IntersectionObserver)
    notify(true)
    assert.ok(attributes.has('data-animation-visible'))
    notify(false)
    assert.ok(!attributes.has('data-animation-visible'))
    await act(async () => renderer.unmount())
    assert.ok(disconnected)
    assert.ok(!attributes.has('data-pause-offscreen'))
  } finally {
    Object.assign(globalThis, { window: originalWindow, IntersectionObserver: originalObserver })
  }
})

test('touch devices and reduced motion do not start pointer effects', async () => {
  const originalWindow = globalThis.window
  Object.assign(globalThis, { window: { matchMedia: () => ({ matches: false }) } })
  const ref = { current: null }
  function Harness({ enabled }: { enabled: boolean }) {
    usePointerFx({ rootRef: ref, heroRef: ref, cursorRef: ref, bigClass: '', dragClass: '', pressClass: '', atStartClass: '', atEndClass: '', enabled })
    return null
  }
  try {
    for (const enabled of [true, false]) {
      let renderer: ReturnType<typeof create>
      await act(async () => { renderer = create(createElement(Harness, { enabled })) })
      await act(async () => renderer.unmount())
    }
  } finally {
    Object.assign(globalThis, { window: originalWindow })
  }
})
