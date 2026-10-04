'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check } from 'lucide-react'
import { organisedGroups, type InboxItem, type OrganisedGroup } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { SectionLabel } from '@/components/primitives'
import { Composer } from './composer'
import { InboxRow } from './inbox-row'
import { OrganiseProgress } from './organise-progress'
import { OrganisedPanel } from './organised-panel'

type Mode = 'idle' | 'processing' | 'organised'

const fileDestination: Record<string, string> = {
  project: 'Vercel side project',
  idea: 'Ideas',
  reference: 'Saved',
  question: 'Onboarding redesign',
  note: 'Notes',
}

function buildGroups(items: InboxItem[]): OrganisedGroup[] {
  const ids = new Set(items.map((i) => i.id))
  const base = organisedGroups
    .map((g) => ({ ...g, sourceIds: g.sourceIds.filter((id) => ids.has(id)) }))
    .filter((g) => g.sourceIds.length > 0)
  const baseIds = new Set(base.map((g) => g.id))
  const extra = items
    .filter((item) => item.route && !baseIds.has(item.route.groupId))
    .map<OrganisedGroup>((item) => ({
      id: item.route!.groupId,
      type: item.route!.type,
      title: item.link?.domain ?? item.content,
      link: item.link ? { domain: item.link.domain, title: item.link.title } : undefined,
      summary: item.kind === 'task' ? 'Kept as a reminder. No project yet.' : 'Captured just now. Nothing related yet.',
      sourceIds: [item.id],
    }))
  return [...extra, ...base]
}

export function InboxView() {
  const { items, addItem, removeItem, pinned, togglePin, fileItems } = useStore()
  const [mode, setMode] = useState<Mode>('idle')
  const [phase, setPhase] = useState(0)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const [mobilePane, setMobilePane] = useState<'inbox' | 'organised'>('organised')
  const [notice, setNotice] = useState<string | null>(null)

  const unfiled = useMemo(() => items.filter((item) => !item.project), [items])
  const groups = useMemo(() => buildGroups(unfiled), [unfiled])
  const taskCount = groups.reduce((n, g) => n + (g.tasks?.length ?? 0), 0)

  const durations = useMemo(() => [Math.max(900, unfiled.length * 110 + 400), 950, 850, 750], [unfiled.length])
  const details = [
    `Reading ${unfiled.length} captures`,
    `${groups.length} contexts found`,
    `${taskCount} tasks, 1 follow-up, 1 deadline`,
    'Linking to Vercel side project and Onboarding redesign',
  ]

  useEffect(() => {
    if (mode !== 'processing') return
    const timer = window.setTimeout(() => {
      if (phase < 3) setPhase(phase + 1)
      else setMode('organised')
    }, durations[phase])
    return () => window.clearTimeout(timer)
  }, [mode, phase, durations])

  function startOrganise() {
    setNotice(null)
    setPhase(0)
    setActiveGroup(null)
    setMode('processing')
  }

  function fileAll() {
    const assignments: Record<string, string> = {}
    unfiled.forEach((item) => {
      if (item.route) assignments[item.id] = fileDestination[item.route.type]
    })
    fileItems(assignments)
    setNotice(`Filed ${Object.keys(assignments).length} captures into ${groups.length} places.`)
    setMode('idle')
  }

  if (mode === 'organised') {
    return (
      <div className="mx-auto w-full max-w-6xl animate-in fade-in px-5 pb-28 pt-10 duration-300 md:px-10 md:pb-20 md:pt-16">
        <header className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <button
              type="button"
              onClick={() => setMode('idle')}
              className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Back to inbox
            </button>
            <h1 className="text-balance text-[28px] font-semibold leading-tight tracking-[-0.025em] md:text-[32px]">
              Here&apos;s where everything belongs.
            </h1>
            <p className="mt-2 text-pretty text-[14px] leading-relaxed text-muted-foreground">
              {unfiled.length} captures became {groups.length} contexts. Hover anything to see where it came from.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMode('idle')}
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
            >
              Keep as is
            </button>
            <button
              type="button"
              onClick={fileAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-foreground px-3.5 text-[13px] font-medium text-background transition-colors hover:bg-foreground/90"
            >
              <Check className="size-3.5" aria-hidden="true" />
              File everything
            </button>
          </div>
        </header>

        <div className="mb-6 grid grid-cols-2 rounded-md border border-border p-0.5 lg:hidden" role="tablist" aria-label="View">
          {(['inbox', 'organised'] as const).map((pane) => (
            <button
              key={pane}
              type="button"
              role="tab"
              aria-selected={mobilePane === pane}
              onClick={() => setMobilePane(pane)}
              className={cn(
                'h-8 rounded-[5px] text-[13px] font-medium capitalize transition-colors',
                mobilePane === pane ? 'bg-card text-foreground shadow-[0_0_0_1px_var(--border)]' : 'text-muted-foreground',
              )}
            >
              {pane}
            </button>
          ))}
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-0">
          <section
            aria-labelledby="raw-heading"
            className={cn('lg:block lg:pr-10', mobilePane === 'inbox' ? 'block' : 'hidden')}
          >
            <div className="mb-3 flex items-baseline justify-between">
              <SectionLabel>
                <span id="raw-heading">Inbox</span>
              </SectionLabel>
              <span className="font-mono text-[11px] text-muted-foreground">Raw</span>
            </div>
            <ul className="flex flex-col">
              {unfiled.map((item) => {
                const inActive = activeGroup !== null && item.route?.groupId === activeGroup
                return (
                  <InboxRow
                    key={item.id}
                    item={item}
                    interactive={false}
                    onHover={(h) => setActiveGroup(h ? (item.route?.groupId ?? null) : null)}
                    state={{
                      highlighted: inActive,
                      dimmed: activeGroup !== null && !inActive,
                      compact: true,
                    }}
                  />
                )
              })}
            </ul>
          </section>

          <section
            aria-labelledby="organised-heading"
            className={cn('lg:block lg:border-l lg:border-border lg:pl-10', mobilePane === 'organised' ? 'block' : 'hidden')}
          >
            <div className="mb-6 flex items-baseline justify-between">
              <SectionLabel>
                <span id="organised-heading" className="text-cobalt">
                  Organised
                </span>
              </SectionLabel>
              <span className="font-mono text-[11px] text-muted-foreground">{groups.length} contexts</span>
            </div>
            <OrganisedPanel groups={groups} activeGroup={activeGroup} onHoverGroup={setActiveGroup} />
          </section>
        </div>
      </div>
    )
  }

  const processing = mode === 'processing'

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-28 pt-10 md:px-10 md:pb-20 md:pt-20">
      <header className="mb-8">
        <p className="animate-in fade-in text-[14px] text-muted-foreground duration-500">Good evening, Rachel.</p>
        <h1 className="mt-1.5 animate-in fade-in slide-in-from-bottom-1 fill-mode-both text-balance text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-foreground duration-500 [animation-delay:80ms] md:text-[36px]">
          What&apos;s on your mind?
        </h1>
      </header>

      <div className="animate-in fade-in slide-in-from-bottom-1 fill-mode-both duration-500 [animation-delay:160ms]">
        <Composer
          onCapture={(item) => {
            addItem(item)
            setNotice(null)
          }}
        />
      </div>

      <section aria-labelledby="recent-heading" className="mt-14 animate-in fade-in fill-mode-both duration-500 [animation-delay:240ms]">
        <div className="mb-3 flex min-h-12 items-end justify-between gap-4 border-b border-border pb-3">
          {processing ? (
            <OrganiseProgress phase={phase} details={details} durations={durations} />
          ) : (
            <div className="flex items-baseline gap-3">
              <SectionLabel>
                <span id="recent-heading">Recent</span>
              </SectionLabel>
              <span className="font-mono text-[11px] tabular-nums text-muted-foreground">
                {unfiled.length > 0 ? `${unfiled.length} unsorted` : 'All sorted'}
              </span>
            </div>
          )}

          {!processing ? (
            <button
              type="button"
              onClick={startOrganise}
              disabled={unfiled.length === 0}
              className="group/org inline-flex h-8 shrink-0 items-center gap-2 rounded-md border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-[border-color,color,background-color] duration-150 hover:border-cobalt hover:text-cobalt disabled:pointer-events-none disabled:opacity-40"
            >
              <span aria-hidden="true" className="grid grid-cols-2 gap-[2px]">
                <span className="size-[5px] rounded-[1px] bg-current opacity-40 transition-opacity group-hover/org:opacity-100" />
                <span className="size-[5px] rounded-[1px] bg-current" />
                <span className="size-[5px] rounded-[1px] bg-current" />
                <span className="size-[5px] rounded-[1px] bg-current opacity-40 transition-opacity group-hover/org:opacity-100" />
              </span>
              Organise
            </button>
          ) : null}
        </div>

        {notice ? (
          <p className="mb-3 flex animate-in fade-in items-center gap-2 text-[13px] text-muted-foreground duration-300" role="status">
            <Check className="size-3.5 text-cobalt" aria-hidden="true" />
            {notice}
          </p>
        ) : null}

        {items.length === 0 ? (
          <p className="py-10 text-center text-[14px] text-muted-foreground">
            Nothing here yet. Whatever&apos;s on your mind, put it above.
          </p>
        ) : (
          <ul className="flex flex-col">
            {(processing ? unfiled : items).map((item, i) => (
              <InboxRow
                key={item.id}
                item={item}
                pinned={pinned.has(item.id)}
                onTogglePin={() => togglePin(item.id)}
                onArchive={() => removeItem(item.id)}
                interactive={!processing}
                state={
                  processing
                    ? {
                        scanning: phase === 0,
                        scanDelay: phase === 0 ? i * 110 : i * 60,
                        showRoute: phase >= 1,
                        showExtract: phase >= 2,
                        highlighted: phase === 3 && item.route?.type === 'project',
                      }
                    : undefined
                }
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
