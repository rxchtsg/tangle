'use client'

import { Pin, X } from 'lucide-react'
import { kindGlow, kindLabel, type Thought } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function KindDot({ kind, className }: { kind: Thought['kind']; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-block size-[7px] shrink-0 rounded-full shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--foreground)_18%,transparent)]',
        className,
      )}
      style={{ background: kindGlow[kind] }}
    />
  )
}

type Props = {
  thought: Thought
  dimmed?: boolean
  related?: boolean
  interactive?: boolean
  onHover?: (id: string | null) => void
  className?: string
}

export function ThoughtObject({ thought, dimmed, related, interactive = true, onHover, className }: Props) {
  const { pinned, togglePin, removeThought } = useStore()
  const isPinned = pinned.has(thought.id)
  const links = thought.related?.length ?? 0

  return (
    <div
      className={cn('thought-item', className)}
      data-dim={dimmed || undefined}
      data-related={related || undefined}
      onMouseEnter={() => onHover?.(thought.id)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(thought.id)}
      onBlur={() => onHover?.(null)}
    >
      <article
        tabIndex={interactive ? 0 : -1}
        data-kind={thought.kind}
        className="thought px-4 pb-3 pt-3.5 outline-none"
        style={{ '--glow': kindGlow[thought.kind] } as React.CSSProperties}
        aria-label={`${kindLabel[thought.kind]}: ${thought.content}`}
      >
        <div className="thought-glow" aria-hidden="true" />
        <div className="flex items-center gap-2">
          {thought.kind === 'task' ? (
            <span
              aria-hidden="true"
              className="size-[11px] rounded-full shadow-[inset_0_0_0_1.25px_color-mix(in_oklab,var(--foreground)_35%,transparent)]"
            />
          ) : (
            <KindDot kind={thought.kind} />
          )}
          <span className="eyebrow text-[10px]">{kindLabel[thought.kind]}</span>
          {isPinned ? <Pin className="size-3 text-foreground/50" strokeWidth={1.8} aria-label="Pinned" /> : null}
          <span className="thought-meta ml-auto font-mono text-[10.5px] text-muted-foreground">{thought.time}</span>
        </div>

        <p className="mt-2 text-pretty text-[15px] leading-[1.45] text-foreground">{thought.content}</p>

        {thought.domain ? (
          <p className="mt-2 flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
            <span className="grid size-4 place-items-center rounded-[4px] bg-foreground/[0.06] text-[9px] uppercase text-foreground/60">
              {thought.domain[0]}
            </span>
            {thought.domain}
          </p>
        ) : null}

        {interactive ? (
          <div className="thought-meta mt-2.5 flex items-center gap-3 border-t border-foreground/[0.05] pt-2">
            <span className="font-mono text-[10.5px] text-muted-foreground">
              {links > 0 ? `${links} related` : thought.person ? `with ${thought.person}` : 'Unconnected'}
            </span>
            <span className="ml-auto flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => togglePin(thought.id)}
                aria-label={isPinned ? 'Unpin' : 'Pin'}
                className="grid size-6 place-items-center rounded-md text-foreground/45 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              >
                <Pin className="size-3.5" strokeWidth={1.6} />
              </button>
              <button
                type="button"
                onClick={() => removeThought(thought.id)}
                aria-label="Let it go"
                className="grid size-6 place-items-center rounded-md text-foreground/45 transition-colors hover:bg-foreground/[0.05] hover:text-foreground"
              >
                <X className="size-3.5" strokeWidth={1.6} />
              </button>
            </span>
          </div>
        ) : null}
      </article>
    </div>
  )
}
