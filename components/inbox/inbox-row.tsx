'use client'

import { useState } from 'react'
import { Archive, ArrowUpRight, Pin } from 'lucide-react'
import type { InboxItem } from '@/lib/data'
import { kindLabel } from '@/lib/detect'
import { cn } from '@/lib/utils'
import { Favicon, KindIcon } from '@/components/primitives'

export type RowState = {
  scanning?: boolean
  scanDelay?: number
  showRoute?: boolean
  showExtract?: boolean
  highlighted?: boolean
  dimmed?: boolean
  compact?: boolean
}

export function InboxRow({
  item,
  pinned,
  onTogglePin,
  onArchive,
  onHover,
  state = {},
  interactive = true,
}: {
  item: InboxItem
  pinned?: boolean
  onTogglePin?: () => void
  onArchive?: () => void
  onHover?: (hovering: boolean) => void
  state?: RowState
  interactive?: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const isLink = item.kind === 'link' && item.link
  const panelId = `row-panel-${item.id}`

  return (
    <li
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      className={cn(
        'group/row relative -mx-3 rounded-md transition-[background-color,opacity] duration-200',
        state.scanning && 'animate-row-scan',
        state.highlighted && 'bg-cobalt-soft',
        state.dimmed && 'opacity-35',
        interactive && !state.highlighted && 'hover:bg-accent/70',
      )}
      style={state.scanning ? { animationDelay: `${state.scanDelay ?? 0}ms` } : undefined}
    >
      <div className="flex min-h-11 items-center gap-3 px-3 py-2">
        <KindIcon
          kind={item.kind}
          className={cn('transition-colors duration-200', state.highlighted && 'text-cobalt')}
        />

        <button
          type="button"
          disabled={!interactive}
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={interactive ? expanded : undefined}
          aria-controls={interactive ? panelId : undefined}
          className="flex min-w-0 flex-1 items-baseline gap-2 text-left outline-none focus-visible:underline focus-visible:decoration-cobalt focus-visible:underline-offset-4 disabled:cursor-default"
        >
          {isLink ? (
            <span className="min-w-0 truncate text-[14px] text-foreground">
              <span className="font-medium">{item.link!.domain}</span>
              <span className="text-muted-foreground"> — {item.link!.title.replace(/^.*— /, '')}</span>
            </span>
          ) : (
            <span className={cn('min-w-0 text-[14px] leading-snug text-foreground', !expanded && 'truncate')}>
              {item.content}
            </span>
          )}
          {pinned ? <Pin className="size-3 shrink-0 self-center fill-current text-cobalt" aria-label="Pinned" /> : null}
        </button>

        {state.showRoute && item.route ? (
          <span className="animate-in fade-in slide-in-from-left-1 fill-mode-both hidden shrink-0 items-center gap-1.5 text-[12px] text-cobalt duration-300 sm:inline-flex"
            style={{ animationDelay: `${state.scanDelay ?? 0}ms` }}
          >
            <span aria-hidden="true">→</span>
            <span className="font-medium">{item.route.label}</span>
            {state.showExtract && item.extract ? (
              <span className="animate-in fade-in text-muted-foreground duration-300">· {item.extract}</span>
            ) : null}
          </span>
        ) : (
          <div className="relative flex shrink-0 items-center gap-3">
            <div
              className={cn(
                'flex items-center gap-3 transition-opacity duration-150',
                interactive && 'group-hover/row:opacity-0 group-focus-within/row:opacity-0',
              )}
            >
              {item.project && !state.compact ? (
                <span className="hidden max-w-40 truncate rounded-[4px] border border-border px-1.5 py-0.5 text-[11px] text-muted-foreground sm:inline">
                  {item.project}
                </span>
              ) : null}
              <time className="w-16 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                {item.time}
              </time>
            </div>
            {interactive ? (
              <div className="absolute right-0 flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover/row:opacity-100 group-focus-within/row:opacity-100">
                <RowAction label={pinned ? 'Unpin' : 'Pin'} onClick={onTogglePin}>
                  <Pin className={cn('size-3.5', pinned && 'fill-current')} strokeWidth={1.75} />
                </RowAction>
                {isLink ? (
                  <a
                    href={item.link!.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Open link"
                    title="Open link"
                    className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  >
                    <ArrowUpRight className="size-3.5" strokeWidth={1.75} />
                  </a>
                ) : null}
                <RowAction label="Archive" onClick={onArchive}>
                  <Archive className="size-3.5" strokeWidth={1.75} />
                </RowAction>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {interactive ? (
        <div
          id={panelId}
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-200 ease-out',
            expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 pb-3 pl-11 pr-3">
              {isLink ? (
                <a
                  href={item.link!.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex max-w-md items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors hover:border-border-strong"
                >
                  <Favicon domain={item.link!.domain} />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-[13px] font-medium">{item.link!.title}</span>
                    <span className="truncate font-mono text-[11px] text-muted-foreground">{item.link!.url}</span>
                  </span>
                </a>
              ) : null}
              {item.images?.length ? (
                <div className="flex flex-wrap gap-2">
                  {item.images.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URLs
                    <img key={src} src={src} alt="Attached capture" className="h-20 w-auto rounded-md border border-border object-cover" />
                  ))}
                </div>
              ) : null}
              <dl className="flex flex-wrap gap-x-5 gap-y-1 text-[12px] text-muted-foreground">
                <div className="flex gap-1.5">
                  <dt>Type</dt>
                  <dd className="text-foreground">{kindLabel[item.kind]}</dd>
                </div>
                <div className="flex gap-1.5">
                  <dt>Captured</dt>
                  <dd className="text-foreground">{item.time}</dd>
                </div>
                {item.person ? (
                  <div className="flex gap-1.5">
                    <dt>Person</dt>
                    <dd className="text-foreground">{item.person}</dd>
                  </div>
                ) : null}
                {item.route && !item.project ? (
                  <div className="flex gap-1.5">
                    <dt>Likely belongs in</dt>
                    <dd className="text-cobalt">{item.route.label}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  )
}

function RowAction({
  label,
  onClick,
  children,
}: {
  label: string
  onClick?: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  )
}
