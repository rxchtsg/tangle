'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { Kbd } from '@/components/primitives'
import type { ThoughtKind } from '@/lib/data'
import { createThought, detectKind } from '@/lib/detect'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const KINDS: [ThoughtKind, string][] = [
  ['note', 'thoughts'],
  ['idea', 'ideas'],
  ['reference', 'links'],
  ['task', 'reminders'],
  ['question', 'questions'],
]

export function CaptureSurface() {
  const { addThought, pendingCapture, setPendingCapture } = useStore()
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const ref = useRef<HTMLTextAreaElement>(null)
  const kind = value.trim() ? detectKind(value) : null

  useEffect(() => {
    if (!pendingCapture) return
    setPendingCapture(false)
    const el = ref.current
    if (!el) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    el.focus({ preventScroll: true })
  }, [pendingCapture, setPendingCapture])

  const resize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const submit = () => {
    if (!value.trim()) return
    addThought(createThought(value))
    setValue('')
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.focus()
    }
  }

  return (
    <div className="capture-wrap relative" data-focused={focused || undefined}>
      <div className="capture-glow" aria-hidden="true" />
      <div className="capture">
        <div className="relative">
          <textarea
            ref={ref}
            id="capture"
            rows={2}
            value={value}
            placeholder="Drop a thought, idea, link, reminder, question…"
            aria-label="Capture a thought"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onChange={(e) => {
              setValue(e.target.value)
              resize(e.target)
            }}
            onKeyDown={(e) => {
              if (e.key !== 'Enter' || !(e.metaKey || e.ctrlKey)) return
              if (e.nativeEvent.isComposing || e.keyCode === 229) return
              e.preventDefault()
              submit()
            }}
            className="block max-h-[40vh] min-h-[88px] w-full resize-none bg-transparent px-6 pb-2 pt-5 text-[17px] leading-relaxed text-foreground outline-none placeholder:text-transparent focus-visible:outline-none"
          />
          {!value ? (
            <span
              aria-hidden="true"
              className="capture-placeholder pointer-events-none absolute left-6 right-6 top-5 text-[17px] leading-relaxed text-foreground/35"
            >
              Drop a thought, idea, link, reminder, question…
            </span>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-4 px-6 pb-4 pt-1">
          <p className="font-mono text-[11px] leading-5 text-muted-foreground/80" aria-live="polite">
            {KINDS.map(([k, label], i) => (
              <Fragment key={k}>
                <span
                  className={cn(
                    'transition-colors duration-300',
                    kind === k && 'text-foreground',
                    kind && kind !== k && 'text-muted-foreground/50',
                  )}
                >
                  {label}
                </span>
                {i < KINDS.length - 1 ? <span className="text-muted-foreground/40">{' · '}</span> : null}
              </Fragment>
            ))}
            {kind ? <span className="sr-only">{`Looks like ${kind}`}</span> : null}
          </p>

          <button
            type="button"
            onClick={submit}
            disabled={!value.trim()}
            aria-label="Add to your tangle"
            className="group flex shrink-0 items-center gap-1 rounded-lg transition-opacity disabled:opacity-50"
          >
            <span className="hidden items-center gap-1 sm:flex">
              <Kbd>⌘</Kbd>
              <Kbd>↵</Kbd>
            </span>
            <span className="grid size-8 place-items-center rounded-[10px] bg-primary text-primary-foreground sm:hidden">
              <ArrowUp className="size-4" strokeWidth={1.8} />
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
