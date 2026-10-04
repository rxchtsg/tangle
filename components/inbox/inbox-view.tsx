'use client'

import { Pin, X } from 'lucide-react'
import { PageIntro, Reveal } from '@/components/primitives'
import { KindDot } from '@/components/home/thought-object'
import { kindLabel, olderThoughts, type Thought } from '@/lib/data'
import { useStore } from '@/lib/store'

function bucket(time: string) {
  if (/now|m$|h$/.test(time)) return 'Today'
  if (time === 'Yesterday') return 'Yesterday'
  return 'Earlier'
}

export function InboxView() {
  const { thoughts, pinned, togglePin, removeThought } = useStore()
  const all = [...thoughts, ...olderThoughts]
  const groups = ['Today', 'Yesterday', 'Earlier']
    .map((label) => ({ label, items: all.filter((t) => bucket(t.time) === label) }))
    .filter((g) => g.items.length)

  return (
    <div className="mx-auto flex w-full max-w-[44rem] flex-col gap-14">
      <PageIntro
        eyebrow="Inbox"
        title="Everything, in the order it arrived."
        lede="No sorting needed. This is just the raw stream — Tangle does the rest."
      />

      {groups.map((g, gi) => (
        <Reveal as="section" key={g.label} delay={gi * 60} className="flex flex-col gap-2">
          <h2 className="eyebrow pb-2">{g.label}</h2>
          <ul className="flex flex-col">
            {g.items.map((t: Thought) => {
              const live = thoughts.some((x) => x.id === t.id)
              return (
                <li
                  key={t.id}
                  className="group -mx-3 flex items-start gap-3 rounded-[12px] px-3 py-3 transition-colors duration-200 hover:bg-card/60"
                >
                  <KindDot kind={t.kind} className="mt-[8px]" />
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <p className="text-pretty text-[15.5px] leading-relaxed">{t.content}</p>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground/80">
                      {kindLabel[t.kind]}
                      {t.domain ? ` · ${t.domain}` : ''}
                    </p>
                  </div>
                  <span className="pt-1 font-mono text-[11px] text-muted-foreground group-hover:hidden">{t.time}</span>
                  {live ? (
                    <span className="hidden items-center gap-0.5 group-hover:flex">
                      <button
                        type="button"
                        onClick={() => togglePin(t.id)}
                        aria-label={pinned.has(t.id) ? 'Unpin' : 'Pin'}
                        className="grid size-7 place-items-center rounded-md text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground"
                      >
                        <Pin className="size-3.5" strokeWidth={1.6} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeThought(t.id)}
                        aria-label="Let it go"
                        className="grid size-7 place-items-center rounded-md text-foreground/50 hover:bg-foreground/[0.05] hover:text-foreground"
                      >
                        <X className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </span>
                  ) : (
                    <span className="hidden pt-1 font-mono text-[11px] text-muted-foreground group-hover:inline">{t.time}</span>
                  )}
                </li>
              )
            })}
          </ul>
        </Reveal>
      ))}
    </div>
  )
}
