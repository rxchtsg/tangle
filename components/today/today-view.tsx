'use client'

import { ArrowUpRight } from 'lucide-react'
import { CheckCircle, Eyebrow, PageIntro, Reveal } from '@/components/primitives'
import { circling, looseEnds, revisit, todayFocus } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

function Greeting() {
  const h = new Date().getHours()
  const part = h < 12 ? 'morning' : h < 18 ? 'afternoon' : 'evening'
  return <span suppressHydrationWarning>{`Good ${part}, Rachel.`}</span>
}

function Section({
  label,
  note,
  children,
  delay = 0,
}: {
  label: string
  note: string
  children: React.ReactNode
  delay?: number
}) {
  return (
    <Reveal as="section" delay={delay} className="grid gap-5 md:grid-cols-[11rem_1fr] md:gap-10">
      <div className="flex flex-col gap-1.5 md:pt-1.5">
        <Eyebrow>{label}</Eyebrow>
        <p className="text-[13px] leading-relaxed text-muted-foreground">{note}</p>
      </div>
      <div>{children}</div>
    </Reveal>
  )
}

export function TodayView() {
  const { done, toggleDone } = useStore()

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-20">
      <PageIntro
        eyebrow="Today"
        title={<Greeting />}
        lede="Here’s what your brain seems to care about today."
      />

      <div className="flex flex-col gap-16">
        <Section label="Focus" note="The three things that deserve your attention.">
          <ul className="flex flex-col gap-6">
            {todayFocus.map((f) => {
              const isDone = done.has(f.id)
              return (
                <li key={f.id} className="group flex items-start gap-4">
                  <span className="pt-[7px]">
                    <CheckCircle checked={isDone} onToggle={() => toggleDone(f.id)} label={f.title} />
                  </span>
                  <div className="flex flex-col gap-1">
                    <p
                      className={cn(
                        'text-[clamp(1.35rem,2.6vw,1.75rem)] font-light leading-snug tracking-[-0.025em] transition-colors duration-300',
                        isDone && 'text-muted-foreground line-through decoration-foreground/20 decoration-1',
                      )}
                    >
                      {f.title}
                    </p>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">{f.why}</p>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {f.project}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>

        <Section label="Loose ends" note="Things you mentioned but never closed." delay={60}>
          <ul className="flex flex-col">
            {looseEnds.map((l) => (
              <li
                key={l.text}
                className="flex items-baseline justify-between gap-6 border-b border-foreground/[0.06] py-3.5 first:pt-0 last:border-0"
              >
                <p className="text-[16px] leading-relaxed">{l.text}</p>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{l.time}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Ideas" note="Things you’ve been circling." delay={60}>
          <ul className="flex flex-col gap-5">
            {circling.map((c) => (
              <li key={c.title} className="flex flex-col gap-1.5">
                <p className="text-[19px] font-normal tracking-[-0.015em]">{c.title}</p>
                <p className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="flex gap-1" aria-hidden="true">
                    {Array.from({ length: c.count }).map((_, i) => (
                      <span key={i} className="size-[5px] rounded-full bg-foreground/30" />
                    ))}
                  </span>
                  {`Came up ${c.count} times · ${c.since}`}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section label="Revisit" note="Something Tangle thinks matters again." delay={60}>
          <a
            href={`https://${revisit.domain}`}
            target="_blank"
            rel="noreferrer"
            className="material-glass group flex flex-col gap-3 rounded-[20px] p-6 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="font-mono text-[11px] text-muted-foreground">{`${revisit.domain} · saved ${revisit.saved}`}</span>
              <ArrowUpRight
                className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                strokeWidth={1.6}
                aria-hidden="true"
              />
            </div>
            <p className="text-[22px] font-light tracking-[-0.02em]">{revisit.title}</p>
            <p className="max-w-[32rem] text-[15px] leading-relaxed text-muted-foreground">{revisit.reason}</p>
          </a>
        </Section>
      </div>
    </div>
  )
}
