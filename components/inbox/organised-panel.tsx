'use client'

import Link from 'next/link'
import { ArrowUpRight, CornerDownRight } from 'lucide-react'
import { groupTypeLabel, type OrganisedGroup } from '@/lib/data'
import { cn } from '@/lib/utils'
import { Favicon } from '@/components/primitives'

export function OrganisedPanel({
  groups,
  activeGroup,
  onHoverGroup,
}: {
  groups: OrganisedGroup[]
  activeGroup: string | null
  onHoverGroup: (id: string | null) => void
}) {
  return (
    <ol className="flex flex-col">
      {groups.map((group, i) => {
        const active = activeGroup === group.id
        const dimmed = activeGroup !== null && !active
        return (
          <li
            key={group.id}
            onMouseEnter={() => onHoverGroup(group.id)}
            onMouseLeave={() => onHoverGroup(null)}
            onFocus={() => onHoverGroup(group.id)}
            onBlur={() => onHoverGroup(null)}
            tabIndex={0}
            aria-label={`${groupTypeLabel[group.type]}: ${group.title}`}
            className={cn(
              'animate-in fade-in slide-in-from-bottom-1 fill-mode-both border-t border-border py-6 outline-none [animation-duration:500ms] first:border-t-0 first:pt-0',
              'transition-opacity duration-200 focus-visible:bg-cobalt-soft',
              dimmed && 'opacity-45',
            )}
            style={{ animationDelay: `${120 + i * 140}ms` }}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span
                className={cn(
                  'font-mono text-[11px] font-medium uppercase tracking-[0.08em] transition-colors duration-200',
                  active ? 'text-cobalt' : 'text-muted-foreground',
                )}
              >
                {groupTypeLabel[group.type]}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                <CornerDownRight className="size-3" aria-hidden="true" />
                {group.sourceIds.length === 1 ? 'from 1 capture' : `from ${group.sourceIds.length} captures`}
              </span>
            </div>

            <h3 className="text-balance text-[18px] font-semibold leading-snug tracking-[-0.015em] text-foreground">
              {group.type === 'project' ? (
                <Link
                  href="/projects/vercel-side-project"
                  className="decoration-border-strong underline-offset-4 hover:underline"
                >
                  {group.title}
                </Link>
              ) : (
                group.title
              )}
            </h3>

            {group.link ? (
              <a
                href={`https://${group.link.domain}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Favicon domain={group.link.domain} />
                <span className="font-mono text-[12px]">{group.link.domain}</span>
                <ArrowUpRight className="size-3" aria-hidden="true" />
              </a>
            ) : null}

            {group.summary ? (
              <p className="mt-1.5 text-pretty text-[13.5px] leading-relaxed text-muted-foreground">{group.summary}</p>
            ) : null}

            {group.tasks?.length ? (
              <div className="mt-4">
                <p className="mb-1.5 text-[12px] font-medium text-foreground">Tasks</p>
                <ul className="flex flex-col">
                  {group.tasks.map((task, t) => (
                    <li
                      key={task}
                      className="animate-in fade-in slide-in-from-left-1 fill-mode-both flex h-8 items-center gap-2.5 text-[14px] duration-300"
                      style={{ animationDelay: `${320 + i * 140 + t * 70}ms` }}
                    >
                      <span aria-hidden="true" className="size-3.5 shrink-0 rounded-[3px] border border-border-strong bg-card" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {group.followUp ? (
              <p className="mt-3 flex items-center gap-2 text-[13px] text-muted-foreground">
                <span
                  aria-hidden="true"
                  className="inline-flex size-5 items-center justify-center rounded-full border border-border bg-card text-[10px] font-semibold text-foreground"
                >
                  {group.followUp.person.charAt(0)}
                </span>
                Follow up with <span className="text-foreground">{group.followUp.person}</span> on{' '}
                {group.followUp.topic}
              </p>
            ) : null}

            {group.due ? (
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-[4px] border border-border px-1.5 py-0.5 text-[12px] text-foreground">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-cobalt" />
                Decide by {group.due}
              </p>
            ) : null}
          </li>
        )
      })}
    </ol>
  )
}
