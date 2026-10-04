'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { TangleMark } from '@/components/brand/mark'

const KEY = 'tangle.welcomed'
const DURATION = 5000

export function Welcome() {
  const [state, setState] = useState<'hidden' | 'playing' | 'leaving'>('hidden')
  const timers = useRef<number[]>([])

  const finish = useCallback(() => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {}
    document.documentElement.setAttribute('data-welcomed', '')
    setState('leaving')
    timers.current.push(window.setTimeout(() => setState('hidden'), 900))
  }, [])

  useEffect(() => {
    if (document.documentElement.hasAttribute('data-welcomed')) return
    setState('playing')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const list = timers.current
    list.push(window.setTimeout(finish, reduced ? 600 : DURATION))
    return () => list.forEach(clearTimeout)
  }, [finish])

  useEffect(() => {
    if (state !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state, finish])

  if (state === 'hidden') return null

  return (
    <div
      className="welcome fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background"
      data-leaving={state === 'leaving' || undefined}
      role="dialog"
      aria-label="Welcome to Tangle"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="env-light env-light-a" />
        <div className="env-light env-light-b" />
        <div className="env-vignette" />
      </div>

      <div className="wl-stack relative flex flex-col items-center gap-6 text-center">
        <div className="wl-word flex flex-col items-center gap-5">
          <TangleMark animated className="size-10 text-foreground" />
          <h1 className="text-[44px] font-normal leading-none tracking-[-0.045em] sm:text-[56px]">Tangle</h1>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="wl-line-1 text-[17px] text-foreground/70">Let your thoughts get tangled.</p>
          <p className="wl-line-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Everything starts somewhere.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={finish}
        className="wl-skip absolute bottom-10 rounded-lg px-3 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
      >
        Skip
      </button>
    </div>
  )
}
