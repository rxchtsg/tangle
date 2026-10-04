'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Undo2 } from 'lucide-react'
import { TangleMark } from '@/components/brand/mark'
import { CheckCircle, Eyebrow } from '@/components/primitives'
import { groupLabel, groupOrder, organisedGroups, type GroupType, type Thought } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { KindDot, ThoughtObject } from './thought-object'

type Phase = 'loose' | 'finding' | 'connecting' | 'sense' | 'organised'
type Line = { id: string; d: string }

const OFFSETS = [
  { r: -1.4, y: 6 },
  { r: 0.9, y: -8 },
  { r: -0.5, y: 14 },
  { r: 1.3, y: -2 },
  { r: -1, y: -12 },
  { r: 0.6, y: 8 },
  { r: -1.6, y: 0 },
  { r: 1.1, y: 10 },
]
const WANDER = [
  [5, -4],
  [-4, 5],
  [3, 6],
  [-6, -3],
  [4, 4],
  [-3, -6],
  [6, 2],
  [-5, 4],
]

const STATUS: Partial<Record<Phase, string>> = {
  finding: 'Finding the threads…',
  connecting: 'Connecting ideas…',
  sense: 'Making sense of it…',
}

const groupForId = new Map<string, GroupType>()
organisedGroups.forEach((g) => g.sourceIds.forEach((id) => groupForId.set(id, g.type)))

function curve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2
  const my = (a.y + b.y) / 2
  const dx = b.x - a.x
  const dy = b.y - a.y
  const bend = 0.2
  return `M${a.x},${a.y} Q${mx - dy * bend},${my + dx * bend} ${b.x},${b.y}`
}

export function TangleField() {
  const { thoughts, organised, setOrganised } = useStore()
  const [phase, setPhase] = useState<Phase>(organised ? 'organised' : 'loose')
  const [hovered, setHovered] = useState<string | null>(null)
  const [lines, setLines] = useState<Line[]>([])
  const fieldRef = useRef<HTMLDivElement>(null)
  const snapshot = useRef<Map<string, DOMRect> | null>(null)
  const timers = useRef<number[]>([])
  const seen = useRef<Set<string> | null>(null)
  if (seen.current === null) seen.current = new Set(thoughts.map((t) => t.id))

  useEffect(() => {
    thoughts.forEach((t) => seen.current?.add(t.id))
  })

  const adjacency = useMemo(() => {
    const ids = new Set(thoughts.map((t) => t.id))
    const map = new Map<string, Set<string>>()
    const link = (a: string, b: string) => {
      if (!map.has(a)) map.set(a, new Set())
      map.get(a)!.add(b)
    }
    thoughts.forEach((t) =>
      t.related?.forEach((r) => {
        if (!ids.has(r)) return
        link(t.id, r)
        link(r, t.id)
      }),
    )
    return map
  }, [thoughts])

  const ordered = useMemo(() => {
    if (phase !== 'sense') return thoughts
    const rank = (t: Thought) => groupOrder.indexOf(groupForId.get(t.id) ?? 'loose')
    return [...thoughts].sort((a, b) => rank(a) - rank(b))
  }, [phase, thoughts])

  const takeSnapshot = useCallback(() => {
    const map = new Map<string, DOMRect>()
    fieldRef.current
      ?.querySelectorAll<HTMLElement>('[data-flip]')
      .forEach((el) => map.set(el.dataset.flip!, el.getBoundingClientRect()))
    snapshot.current = map
  }, [])

  // FLIP: every thought travels from where it was to where it now belongs.
  useLayoutEffect(() => {
    const prev = snapshot.current
    if (!prev) return
    snapshot.current = null
    const els = fieldRef.current?.querySelectorAll<HTMLElement>('[data-flip]')
    els?.forEach((el, i) => {
      const from = prev.get(el.dataset.flip!)
      if (!from) return
      const to = el.getBoundingClientRect()
      const dx = from.left - to.left
      const dy = from.top - to.top
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return
      el.animate(
        [
          { transform: `translate(${dx}px, ${dy}px)`, opacity: 0.7 },
          { transform: 'none', opacity: 1 },
        ],
        {
          duration: phase === 'organised' ? 950 : 780,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
          delay: i * 38,
          fill: 'backwards',
        },
      )
    })
  }, [phase])

  // Threads: drawn between related thoughts on hover, and all at once while connecting.
  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    let pairs: [string, string][] = []
    if (phase === 'connecting') {
      const done = new Set<string>()
      adjacency.forEach((others, a) =>
        others.forEach((b) => {
          const key = [a, b].sort().join('|')
          if (done.has(key)) return
          done.add(key)
          pairs.push([a, b])
        }),
      )
    } else if (phase === 'loose' && hovered) {
      pairs = [...(adjacency.get(hovered) ?? [])].map((b) => [hovered, b])
    }
    if (!pairs.length) {
      setLines([])
      return
    }
    const base = field.getBoundingClientRect()
    const center = (id: string) => {
      const el = field.querySelector<HTMLElement>(`[data-flip="${id}"]`)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.left - base.left + r.width / 2, y: r.top - base.top + r.height / 2 }
    }
    const next: Line[] = []
    pairs.forEach(([a, b]) => {
      const pa = center(a)
      const pb = center(b)
      if (pa && pb) next.push({ id: `${a}-${b}`, d: curve(pa, pb) })
    })
    setLines(next)
  }, [phase, hovered, adjacency])

  useEffect(() => {
    const list = timers.current
    return () => {
      list.forEach(clearTimeout)
      document.documentElement.removeAttribute('data-organising')
    }
  }, [])

  const organise = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setHovered(null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      takeSnapshot()
      setPhase('organised')
      setOrganised(true)
      return
    }
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    document.documentElement.setAttribute('data-organising', '')
    setPhase('finding')
    at(1300, () => setPhase('connecting'))
    at(2900, () => {
      takeSnapshot()
      setPhase('sense')
    })
    at(3950, () => {
      takeSnapshot()
      setPhase('organised')
      setOrganised(true)
      document.documentElement.removeAttribute('data-organising')
    })
  }

  const untangle = () => {
    takeSnapshot()
    setPhase('loose')
    setOrganised(false)
  }

  const busy = phase === 'finding' || phase === 'connecting' || phase === 'sense'
  const relatedToHovered = hovered ? adjacency.get(hovered) : undefined

  return (
    <section aria-labelledby="your-tangle" className="flex flex-col gap-8">
      <div className="rise flex flex-wrap items-end justify-between gap-4" style={{ '--d': '360ms' } as React.CSSProperties}>
        <div className="flex flex-col gap-1.5">
          <h2 id="your-tangle" className="eyebrow">
            Your tangle
          </h2>
          <p className="text-[15px] text-muted-foreground">
            {phase === 'organised' ? 'Same thoughts. Now with threads.' : 'Everything you’ve been thinking about lately.'}
          </p>
        </div>

        <div className="flex h-10 items-center" aria-live="polite">
          {busy ? (
            <div className="material-glass flex h-10 items-center gap-2.5 rounded-[12px] px-4">
              <TangleMark twisting className="size-4 text-foreground" />
              <span key={phase} className="status-text text-[13px] text-foreground">
                {STATUS[phase]}
              </span>
            </div>
          ) : phase === 'organised' ? (
            <button
              type="button"
              onClick={untangle}
              className="pop-in flex h-10 items-center gap-2 rounded-[12px] px-3.5 text-[13px] text-muted-foreground transition-colors hover:bg-card/60 hover:text-foreground"
            >
              <Undo2 className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
              Tangle it back up
            </button>
          ) : thoughts.length > 1 ? (
            <button
              type="button"
              onClick={organise}
              className="group pop-in flex h-10 items-center gap-2.5 rounded-[12px] bg-primary pl-3.5 pr-4 text-primary-foreground shadow-[0_10px_24px_-12px_color-mix(in_oklab,var(--foreground)_70%,transparent)] transition-transform duration-300 hover:-translate-y-px active:translate-y-0 active:scale-[0.98]"
            >
              <TangleMark className="size-4 transition-transform duration-700 ease-[var(--ease-spring)] group-hover:-scale-y-100" />
              <span className="font-mono text-[11.5px] uppercase tracking-[0.16em]">Organise</span>
            </button>
          ) : null}
        </div>
      </div>

      <div ref={fieldRef} className="field relative" data-phase={phase}>
        <div className="field-light" aria-hidden="true" />
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full overflow-visible">
          {lines.map((line, i) => (
            <path
              key={line.id}
              d={line.d}
              pathLength={1}
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity={phase === 'connecting' ? 0.28 : 0.22}
              strokeWidth={1}
              strokeLinecap="round"
              className="thread-path"
              style={{ '--d': `${i * 140}ms` } as React.CSSProperties}
            />
          ))}
        </svg>

        {thoughts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <TangleMark className="size-6 text-foreground/40" />
            <p className="text-[15px] text-muted-foreground">Nothing tangled yet. Everything starts somewhere.</p>
          </div>
        ) : phase === 'organised' ? (
          <OrganisedLayout thoughts={thoughts} />
        ) : (
          <div className="relative flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-7">
            {ordered.map((t, i) => {
              const o = OFFSETS[i % OFFSETS.length]
              const w = WANDER[i % WANDER.length]
              const isNew = !seen.current?.has(t.id)
              return (
                <div
                  key={t.id}
                  data-flip={t.id}
                  className={cn('w-full sm:w-[17.5rem]', isNew ? 'enter' : 'rise')}
                  style={{ '--d': `${440 + i * 70}ms` } as React.CSSProperties}
                >
                  <div
                    className="loose-inner"
                    style={
                      {
                        '--r': `${o.r}deg`,
                        '--y': `${o.y}px`,
                        '--wx': `${w[0]}px`,
                        '--wy': `${w[1]}px`,
                        '--wd': `${(i % 4) * -0.3}s`,
                      } as React.CSSProperties
                    }
                  >
                    <ThoughtObject
                      thought={t}
                      onHover={busy ? undefined : setHovered}
                      dimmed={!!hovered && hovered !== t.id && !relatedToHovered?.has(t.id)}
                      related={relatedToHovered?.has(t.id)}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function SourceChip({ thought }: { thought: Thought }) {
  return (
    <div
      data-flip={thought.id}
      className="flex items-start gap-2 rounded-[10px] bg-card/75 px-2.5 py-2 text-[13px] leading-snug text-muted-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent)]"
    >
      <KindDot kind={thought.kind} className="mt-[5px]" />
      <span className="line-clamp-2">{thought.content}</span>
    </div>
  )
}

function OrganisedLayout({ thoughts }: { thoughts: Thought[] }) {
  const { done, toggleDone } = useStore()
  const byId = new Map(thoughts.map((t) => [t.id, t]))
  const grouped = new Set<string>()
  const groups = organisedGroups
    .map((g) => {
      const sources = g.sourceIds.map((id) => byId.get(id)).filter((t): t is Thought => !!t)
      sources.forEach((s) => grouped.add(s.id))
      return { ...g, sources }
    })
    .filter((g) => g.sources.length > 0)
  const loose = thoughts.filter((t) => !grouped.has(t.id))
  const [project, ...rest] = groups[0]?.type === 'project' ? groups : [undefined, ...groups]

  return (
    <div className="relative flex flex-col gap-12">
      {project ? (
        <article className="rise material-glass rounded-[24px] p-6 sm:p-8" style={{ '--d': '120ms' } as React.CSSProperties}>
          <div className="flex items-center justify-between gap-4">
            <Eyebrow>{groupLabel.project}</Eyebrow>
            {project.href ? (
              <Link
                href={project.href}
                className="flex items-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                Open
                <ArrowUpRight className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <h3 className="mt-3 text-balance text-[clamp(1.6rem,3vw,2.1rem)] font-light leading-tight tracking-[-0.03em]">
            {project.title}
          </h3>
          <p className="mt-1.5 text-[15px] text-muted-foreground">{project.summary}</p>

          <div className="mt-7 grid gap-8 md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-3">
              <Eyebrow>Tasks</Eyebrow>
              <ul className="flex flex-col">
                {project.tasks?.map((task, i) => (
                  <li
                    key={task.id}
                    className="rise flex items-center gap-3 border-b border-foreground/[0.05] py-2.5 last:border-0"
                    style={{ '--d': `${520 + i * 90}ms` } as React.CSSProperties}
                  >
                    <CheckCircle checked={done.has(task.id)} onToggle={() => toggleDone(task.id)} label={task.title} />
                    <span
                      className={cn(
                        'text-[15px] transition-colors duration-300',
                        done.has(task.id) && 'text-muted-foreground line-through decoration-foreground/20',
                      )}
                    >
                      {task.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <Eyebrow>Found in</Eyebrow>
              <div className="flex flex-col gap-2">
                {project.sources.map((s) => (
                  <SourceChip key={s.id} thought={s} />
                ))}
              </div>
            </div>
          </div>
        </article>
      ) : null}

      {rest.length > 0 ? (
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
          {rest.map((g, gi) =>
            g ? (
              <article key={g.id} className="rise flex flex-col gap-3" style={{ '--d': `${300 + gi * 120}ms` } as React.CSSProperties}>
                <div className="flex items-center gap-2">
                  <KindDot kind={g.type === 'reference' ? 'reference' : g.type === 'idea' ? 'idea' : 'question'} />
                  <Eyebrow>{groupLabel[g.type]}</Eyebrow>
                  {g.due ? (
                    <span className="ml-auto font-mono text-[10.5px] text-foreground/70">{`by ${g.due}`}</span>
                  ) : null}
                </div>
                <h3 className="text-pretty text-[19px] font-normal leading-snug tracking-[-0.015em]">
                  {g.href ? (
                    <Link href={g.href} className="transition-opacity hover:opacity-70">
                      {g.title}
                    </Link>
                  ) : (
                    g.title
                  )}
                </h3>
                <p className="text-[14px] leading-relaxed text-muted-foreground">{g.summary}</p>
                <div className="mt-1 flex flex-col gap-2">
                  {g.sources.map((s) => (
                    <SourceChip key={s.id} thought={s} />
                  ))}
                </div>
              </article>
            ) : null,
          )}
        </div>
      ) : null}

      {loose.length > 0 ? (
        <article className="rise flex flex-col gap-3" style={{ '--d': '640ms' } as React.CSSProperties}>
          <Eyebrow>{groupLabel.loose}</Eyebrow>
          <p className="text-[14px] text-muted-foreground">Tangle left these alone. They might connect to something later.</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {loose.map((s) => (
              <SourceChip key={s.id} thought={s} />
            ))}
          </div>
        </article>
      ) : null}
    </div>
  )
}
