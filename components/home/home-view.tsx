'use client'

import { TangleMark } from '@/components/brand/mark'
import { Eyebrow, Reveal, useScrollProgress } from '@/components/primitives'
import { olderThoughts, threads } from '@/lib/data'
import { CaptureSurface } from './capture-surface'
import { TangleField } from './tangle-field'
import { ThoughtObject } from './thought-object'

function Today() {
  const label = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  return <span suppressHydrationWarning>{label}</span>
}

export function HomeView() {
  return (
    <div className="mx-auto flex w-full max-w-[60rem] flex-col gap-24 lg:gap-32">
      <section className="mx-auto flex w-full max-w-[42rem] flex-col gap-8 pt-6 lg:pt-20">
        <div className="flex flex-col gap-4">
          <Eyebrow className="rise">
            <Today />
          </Eyebrow>
          <h1
            className="rise text-balance text-[clamp(2.2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.04em]"
            style={{ '--d': '100ms' } as React.CSSProperties}
          >
            What&apos;s tangled up in your head?
          </h1>
        </div>
        <div className="rise" style={{ '--d': '220ms' } as React.CSSProperties}>
          <CaptureSurface />
        </div>
      </section>

      <TangleField />
      <Threads />
      <FurtherBack />
      <End />
    </div>
  )
}

function Threads() {
  return (
    <section aria-labelledby="threads" className="mx-auto flex w-full max-w-[44rem] flex-col gap-10">
      <Reveal className="flex flex-col gap-1.5">
        <h2 id="threads" className="eyebrow">
          Threads
        </h2>
        <p className="text-[15px] text-muted-foreground">A few things you keep coming back to.</p>
      </Reveal>
      <ol className="flex flex-col gap-12">
        {threads.map((thread, i) => (
          <Reveal as="li" key={thread.id} delay={i * 80} className="group flex flex-col gap-3">
            <p className="text-balance text-[clamp(1.5rem,3vw,2rem)] font-light leading-[1.15] tracking-[-0.025em]">
              {thread.sentence}
            </p>
            <p className="max-w-[34rem] text-[15px] leading-relaxed text-muted-foreground">{thread.detail}</p>
            <div className="flex flex-wrap items-center gap-2">
              {thread.sources.map((s, si) => (
                <span key={s} className="flex items-center gap-2">
                  {si > 0 ? (
                    <span aria-hidden="true" className="h-px w-5 bg-foreground/15 transition-all duration-500 group-hover:w-8" />
                  ) : null}
                  <span className="rounded-[8px] bg-card/70 px-2.5 py-1 font-mono text-[11px] text-muted-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent)]">
                    {s}
                  </span>
                </span>
              ))}
            </div>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}

const SPEEDS = [-40, 30, -18, 46, -30, 20, -50]

function FurtherBack() {
  const ref = useScrollProgress<HTMLElement>()
  return (
    <section ref={ref} aria-labelledby="further-back" className="flex flex-col gap-12">
      <Reveal className="mx-auto flex w-full max-w-[44rem] flex-col gap-1.5">
        <h2 id="further-back" className="eyebrow">
          Further back
        </h2>
        <p className="text-[15px] text-muted-foreground">The thoughts underneath. Older, quieter, still yours.</p>
      </Reveal>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-10">
        {olderThoughts.map((t, i) => (
          <Reveal key={t.id} delay={i * 70} className="w-full sm:w-[16rem]">
            <div
              className="drift transition-[opacity,filter] duration-500 sm:opacity-80 sm:hover:opacity-100"
              style={{ '--speed': SPEEDS[i % SPEEDS.length] } as React.CSSProperties}
            >
              <ThoughtObject thought={t} interactive={false} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function End() {
  return (
    <Reveal className="flex flex-col items-center gap-4 pb-10 pt-6 text-center">
      <TangleMark className="size-6 text-foreground/40" />
      <p className="text-[17px] font-light tracking-[-0.01em] text-foreground/70">That&apos;s everything. For now.</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
        The rest is still in your head
      </p>
    </Reveal>
  )
}
