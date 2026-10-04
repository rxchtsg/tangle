'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Plus } from 'lucide-react'
import { people, projectActivity, projectIdeas, projectReferences } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Favicon, SectionLabel } from '@/components/primitives'

const tabs = ['Overview', 'Tasks', 'Ideas', 'References', 'Activity'] as const
type Tab = (typeof tabs)[number]

export function ProjectView() {
  const [tab, setTab] = useState<Tab>('Overview')
  const { tasks } = useStore()
  const open = tasks.filter((t) => !t.done).length

  return (
    <div className="mx-auto w-full max-w-5xl px-5 pb-28 pt-8 md:px-10 md:pb-20 md:pt-14">
      <nav aria-label="Breadcrumb" className="mb-8 text-[13px] text-muted-foreground">
        <Link href="/projects" className="transition-colors hover:text-foreground">
          Projects
        </Link>
        <span className="mx-2 text-border-strong" aria-hidden="true">
          /
        </span>
        <span className="text-foreground">Vercel side project</span>
      </nav>

      <header>
        <h1 className="text-balance text-[30px] font-semibold leading-tight tracking-[-0.03em] md:text-[38px]">
          Vercel side project
        </h1>
        <p className="mt-2 font-mono text-[12px] text-muted-foreground">
          {tasks.length} tasks · {projectIdeas.length} ideas · {projectReferences.length} references
        </p>
      </header>

      <div role="tablist" aria-label="Project sections" className="mt-8 flex gap-6 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`tab-${t}`}
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={cn(
              'relative h-10 shrink-0 text-[13.5px] font-medium transition-colors duration-150',
              tab === t ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {t}
            {t === 'Tasks' ? <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">{open}</span> : null}
            <span
              aria-hidden="true"
              className={cn(
                'absolute inset-x-0 -bottom-px h-px bg-foreground transition-opacity duration-200',
                tab === t ? 'opacity-100' : 'opacity-0',
              )}
            />
          </button>
        ))}
      </div>

      <div
        key={tab}
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        className="animate-in fade-in pt-10 duration-300"
      >
        {tab === 'Overview' && <Overview onNavigate={setTab} />}
        {tab === 'Tasks' && <TaskList />}
        {tab === 'Ideas' && <IdeaList />}
        {tab === 'References' && <ReferenceList />}
        {tab === 'Activity' && <ActivityList />}
      </div>
    </div>
  )
}

function Overview({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
  const { tasks } = useStore()
  const next = tasks.find((t) => !t.done)

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-12">
        <section aria-labelledby="summary-heading">
          <SectionLabel className="mb-3">
            <span id="summary-heading">Where it stands</span>
          </SectionLabel>
          <p className="text-pretty text-[18px] leading-relaxed tracking-[-0.01em] text-foreground md:text-[19px]">
            A small prototype you want to ship this weekend. The interface is mostly there, but the navigation
            still has too many levels. Once that&apos;s settled you can deploy and write a short launch post.{' '}
            <span className="text-muted-foreground">
              The open question is the API — you wanted Max&apos;s take before committing.
            </span>
          </p>
        </section>

        {next ? (
          <section aria-labelledby="next-heading">
            <SectionLabel className="mb-3">
              <span id="next-heading">Next up</span>
            </SectionLabel>
            <button
              type="button"
              onClick={() => onNavigate('Tasks')}
              className="group flex w-full items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4 text-left transition-colors hover:border-border-strong"
            >
              <span className="flex flex-col">
                <span className="text-[16px] font-medium tracking-[-0.01em]">{next.title}</span>
                {next.note ? <span className="text-[13px] text-muted-foreground">{next.note}</span> : null}
              </span>
              <span className="text-[12px] text-muted-foreground transition-colors group-hover:text-foreground">
                All tasks →
              </span>
            </button>
          </section>
        ) : null}

        <section aria-labelledby="recent-heading">
          <SectionLabel className="mb-3">
            <span id="recent-heading">Recently connected</span>
          </SectionLabel>
          <ul className="flex flex-col">
            {projectActivity.slice(0, 3).map((a) => (
              <li key={a.text} className="flex items-baseline justify-between gap-4 border-t border-border py-3 first:border-t-0">
                <span className="text-[14px]">{a.text}</span>
                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="flex flex-col gap-10 lg:border-l lg:border-border lg:pl-10">
        <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-[13px] lg:grid-cols-1">
          {[
            ['Status', 'Active'],
            ['Started', 'Monday'],
            ['Last touched', '12 minutes ago'],
            ['Target', 'This weekend'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col gap-0.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
        <section aria-labelledby="people-heading">
          <SectionLabel className="mb-3">
            <span id="people-heading">People</span>
          </SectionLabel>
          <ul className="flex flex-col gap-3">
            {people.map((p) => (
              <li key={p.name} className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-[11px] font-semibold"
                >
                  {p.name.charAt(0)}
                </span>
                <span className="flex flex-col">
                  <span className="text-[14px] font-medium leading-tight">{p.name}</span>
                  <span className="text-[12px] text-muted-foreground">{p.role}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  )
}

function TaskList() {
  const { tasks, toggleTask, addTask } = useStore()
  const [draft, setDraft] = useState('')

  return (
    <div className="max-w-2xl">
      <ul className="flex flex-col">
        {tasks.map((task) => (
          <li key={task.id} className="border-t border-border first:border-t-0">
            <label className="group flex cursor-pointer items-start gap-3.5 py-3.5">
              <input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)} className="peer sr-only" />
              <span
                aria-hidden="true"
                className={cn(
                  'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors duration-200 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-cobalt',
                  task.done ? 'border-cobalt bg-cobalt' : 'border-border-strong bg-card group-hover:border-foreground/50',
                )}
              >
                <svg
                  viewBox="0 0 12 12"
                  className={cn('size-2.5 text-background transition-opacity', task.done ? 'opacity-100' : 'opacity-0')}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2.5 6.2 5 8.5l4.5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="flex flex-col">
                <span
                  className={cn(
                    'text-[15px] leading-snug transition-colors duration-200',
                    task.done && 'text-muted-foreground line-through decoration-1',
                  )}
                >
                  {task.title}
                </span>
                {task.note ? <span className="text-[13px] text-muted-foreground">{task.note}</span> : null}
              </span>
            </label>
          </li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!draft.trim()) return
          addTask(draft.trim())
          setDraft('')
        }}
        className="mt-2 flex items-center gap-3.5 border-t border-border pt-3.5"
      >
        <Plus className="size-4 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="new-task" className="sr-only">
          Add a task
        </label>
        <input
          id="new-task"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a task…"
          className="h-8 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
        />
      </form>
    </div>
  )
}

function IdeaList() {
  return (
    <ul className="grid gap-x-12 md:grid-cols-2">
      {projectIdeas.map((idea) => (
        <li key={idea.title} className="border-t border-border py-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-pretty text-[16px] font-medium leading-snug tracking-[-0.01em]">{idea.title}</p>
            <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{idea.time}</span>
          </div>
          <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-muted-foreground">{idea.body}</p>
        </li>
      ))}
    </ul>
  )
}

function ReferenceList() {
  return (
    <ul className="flex max-w-2xl flex-col">
      {projectReferences.map((ref) => (
        <li key={ref.domain} className="border-t border-border first:border-t-0">
          <a href={`https://${ref.domain}`} target="_blank" rel="noreferrer" className="group flex items-center gap-4 py-4">
            <Favicon domain={ref.domain} className="size-7 text-[12px]" />
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[15px] font-medium">{ref.title}</span>
              <span className="text-[13px] text-muted-foreground">
                <span className="font-mono text-[12px]">{ref.domain}</span> · {ref.note}
              </span>
            </span>
            <ArrowUpRight
              className="size-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden="true"
            />
          </a>
        </li>
      ))}
    </ul>
  )
}

function ActivityList() {
  return (
    <ol className="relative flex max-w-2xl flex-col gap-6 border-l border-border pl-6">
      {projectActivity.map((a) => (
        <li key={a.text} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[27.5px] top-1.5 size-1.5 rounded-full bg-border-strong ring-4 ring-background"
          />
          <p className="text-[14px]">{a.text}</p>
          <p className="font-mono text-[11px] text-muted-foreground">{a.time}</p>
        </li>
      ))}
    </ol>
  )
}
