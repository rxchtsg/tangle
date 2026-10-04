'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ideas, savedLinks } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Favicon, SectionLabel } from '@/components/primitives'

const focusItems = [
  {
    id: 'f1',
    title: 'Decide how onboarding should work',
    context: 'Onboarding redesign',
    why: 'Due Thursday. Two captures are waiting on this answer.',
  },
  {
    id: 'f2',
    title: 'Finish the interface',
    context: 'Vercel side project',
    why: 'Blocking deploy and the launch post.',
  },
  {
    id: 'f3',
    title: 'Ask Max about the API architecture',
    context: 'Vercel side project',
    why: 'Captured 2 hours ago. Max is online until 7pm.',
  },
]

const looseEnds = [
  { text: 'Reply to Priya about Friday’s design review', age: 'Open 3 days' },
  { text: 'Cancel the unused Figma seat', age: 'Open 6 days' },
  { text: 'Book dentist — mentioned twice', age: 'Open 2 weeks' },
]

function TodayDate() {
  const label = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date())
  return <span suppressHydrationWarning>{label}</span>
}

export function TodayView() {
  const [done, setDone] = useState<Set<string>>(() => new Set())

  function toggle(id: string) {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-28 pt-10 md:px-10 md:pb-20 md:pt-20">
      <header className="mb-12 border-b border-border pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
          <TodayDate />
        </p>
        <h1 className="mt-3 text-[34px] font-semibold leading-none tracking-[-0.035em] md:text-[44px]">Today</h1>
        <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground">
          Here&apos;s what deserves your attention.
        </p>
      </header>

      <div className="grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-0">
        <div className="flex flex-col gap-14 lg:pr-12">
          <section aria-labelledby="focus-heading">
            <div className="mb-5 flex items-baseline justify-between">
              <SectionLabel>
                <span id="focus-heading">Focus</span>
              </SectionLabel>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {done.size} of {focusItems.length} done
              </span>
            </div>
            <ol className="flex flex-col">
              {focusItems.map((item, i) => {
                const isDone = done.has(item.id)
                return (
                  <li
                    key={item.id}
                    className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both border-t border-border py-5 duration-500 first:border-t-0 first:pt-0"
                    style={{ animationDelay: `${i * 90}ms` }}
                  >
                    <label className="group flex cursor-pointer items-start gap-4">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggle(item.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          'mt-1.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt',
                          isDone ? 'border-cobalt bg-cobalt' : 'border-border-strong group-hover:border-foreground/50',
                        )}
                      >
                        <span className={cn('size-1.5 rounded-full bg-background transition-opacity', isDone ? 'opacity-100' : 'opacity-0')} />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span
                          className={cn(
                            'text-pretty text-[20px] font-medium leading-snug tracking-[-0.02em] transition-colors duration-200 md:text-[22px]',
                            isDone ? 'text-muted-foreground line-through decoration-1' : 'text-foreground',
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="text-pretty text-[14px] leading-relaxed text-muted-foreground">
                          {item.why}
                        </span>
                        <span className="text-[12px] text-muted-foreground">
                          in{' '}
                          <Link
                            href={item.context === 'Vercel side project' ? '/projects/vercel-side-project' : '/projects'}
                            className="text-foreground underline decoration-border-strong underline-offset-4 transition-colors hover:decoration-foreground"
                          >
                            {item.context}
                          </Link>
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ol>
          </section>

          <section aria-labelledby="loose-heading">
            <SectionLabel className="mb-4">
              <span id="loose-heading">Loose ends</span>
            </SectionLabel>
            <ul className="flex flex-col">
              {looseEnds.map((item) => (
                <li
                  key={item.text}
                  className="flex items-baseline justify-between gap-4 border-t border-border py-3 first:border-t-0"
                >
                  <span className="text-pretty text-[15px] leading-relaxed">{item.text}</span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{item.age}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="flex flex-col gap-14 lg:border-l lg:border-border lg:pl-12">
          <section aria-labelledby="ideas-heading">
            <div className="mb-4 flex items-baseline justify-between">
              <SectionLabel>
                <span id="ideas-heading">Ideas</span>
              </SectionLabel>
              <Link href="/ideas" className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                All ideas
              </Link>
            </div>
            <ul className="flex flex-col gap-5">
              {ideas.slice(0, 3).map((idea) => (
                <li key={idea.title}>
                  <p className="text-pretty text-[15px] font-medium leading-snug tracking-[-0.01em]">{idea.title}</p>
                  <p className="mt-1 text-pretty text-[13.5px] leading-relaxed text-muted-foreground">{idea.body}</p>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="saved-heading">
            <div className="mb-4 flex items-baseline justify-between">
              <SectionLabel>
                <span id="saved-heading">Saved</span>
              </SectionLabel>
              <Link href="/saved" className="text-[12px] text-muted-foreground transition-colors hover:text-foreground">
                All saved
              </Link>
            </div>
            <ul className="flex flex-col">
              {savedLinks.slice(0, 3).map((link) => (
                <li key={link.domain} className="border-t border-border first:border-t-0">
                  <a
                    href={`https://${link.domain}`}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-3 py-3"
                  >
                    <Favicon domain={link.domain} className="mt-0.5" />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[14px] font-medium group-hover:underline group-hover:decoration-border-strong group-hover:underline-offset-4">
                        {link.title}
                      </span>
                      <span className="text-[12px] text-muted-foreground">{link.note}</span>
                    </span>
                    <ArrowUpRight
                      className="mt-1 size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
