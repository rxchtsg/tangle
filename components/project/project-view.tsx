'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { CheckCircle, Eyebrow } from '@/components/primitives'
import { KindDot } from '@/components/home/thought-object'
import { kindLabel, type ProjectDetail } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const TABS = ['Overview', 'Tasks', 'Ideas', 'References', 'Activity'] as const
type Tab = (typeof TABS)[number]

export function ProjectView({ project }: { project: ProjectDetail }) {
  const [tab, setTab] = useState<Tab>('Overview')

  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-12">
      <header className="flex flex-col gap-5 pt-4 lg:pt-14">
        <Link
          href="/projects"
          className="rise flex w-fit items-center gap-1.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" strokeWidth={1.6} aria-hidden="true" />
          Projects
        </Link>
        <Eyebrow className="rise">Project</Eyebrow>
        <h1
          className="rise text-balance text-[clamp(2.2rem,5vw,3.5rem)] font-light leading-[1.02] tracking-[-0.04em]"
          style={{ '--d': '80ms' } as React.CSSProperties}
        >
          {project.name}
        </h1>
        <p className="rise flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11.5px] text-muted-foreground" style={{ '--d': '140ms' } as React.CSSProperties}>
          <span>{`${project.counts.thoughts} thoughts`}</span>
          <span>{`${project.counts.tasks} tasks`}</span>
          <span>{`${project.counts.references} references`}</span>
        </p>
      </header>

      <div
        role="tablist"
        aria-label="Project sections"
        className="rise material-glass -mx-1 flex w-fit max-w-full gap-0.5 overflow-x-auto rounded-[14px] p-1"
        style={{ '--d': '200ms' } as React.CSSProperties}
      >
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              'h-8 shrink-0 rounded-[10px] px-3.5 text-[13px] transition-all duration-200',
              tab === t
                ? 'bg-card text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent),0_1px_2px_color-mix(in_oklab,var(--foreground)_8%,transparent)]'
                : 'text-foreground/55 hover:text-foreground',
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div key={tab} role="tabpanel" aria-label={tab} className="pop-in">
        {tab === 'Overview' && <Overview project={project} />}
        {tab === 'Tasks' && <Tasks project={project} />}
        {tab === 'Ideas' && (
          <ul className="flex flex-col gap-8">
            {project.ideas.map((idea) => (
              <li key={idea.title} className="flex flex-col gap-1.5">
                <p className="text-[22px] font-light tracking-[-0.02em]">{idea.title}</p>
                <p className="text-[15px] leading-relaxed text-muted-foreground">{idea.body}</p>
                <p className="font-mono text-[11px] text-muted-foreground/70">{idea.time}</p>
              </li>
            ))}
          </ul>
        )}
        {tab === 'References' && (
          <ul className="grid gap-3 sm:grid-cols-2">
            {project.references.map((r) => (
              <li key={r.domain}>
                <a
                  href={`https://${r.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  className="thought group flex flex-col gap-2 p-5"
                  data-kind="reference"
                >
                  <span className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
                    {r.domain}
                    <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                  <span className="text-[17px]">{r.title}</span>
                  <span className="text-[13px] text-muted-foreground">{r.note}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
        {tab === 'Activity' && (
          <ol className="relative flex flex-col gap-6 border-l border-foreground/[0.08] pl-6">
            {project.activity.map((a) => (
              <li key={a.text} className="relative flex flex-col gap-0.5">
                <span aria-hidden="true" className="absolute -left-[28.5px] top-[7px] size-[8px] rounded-full bg-background shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--foreground)_30%,transparent)]" />
                <span className="text-[15px]">{a.text}</span>
                <span className="font-mono text-[11px] text-muted-foreground">{a.time}</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}

function Overview({ project }: { project: ProjectDetail }) {
  return (
    <div className="flex flex-col gap-14">
      <p className="max-w-[40rem] text-pretty text-[clamp(1.25rem,2.4vw,1.5rem)] font-light leading-[1.45] tracking-[-0.015em]">
        {project.overview}
      </p>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <Eyebrow>How it fits together</Eyebrow>
          <p className="text-[13px] text-muted-foreground">Each line started as a single thought.</p>
        </div>
        <ul className="flex flex-col gap-4">
          {project.chains.map((chain, ci) => (
            <li
              key={ci}
              className="rise group flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-0"
              style={{ '--d': `${ci * 90}ms` } as React.CSSProperties}
            >
              {chain.map((step, si) => (
                <div key={step.text} className="flex items-center sm:contents">
                  {si > 0 ? (
                    <span
                      aria-hidden="true"
                      className="ml-4 h-3 w-px bg-foreground/15 sm:ml-0 sm:h-px sm:w-6 sm:transition-all sm:duration-500 sm:group-hover:w-9"
                    />
                  ) : null}
                  <div
                    className="thought flex min-w-0 flex-col gap-1 px-3.5 py-2.5 sm:max-w-[13rem]"
                    data-kind={step.kind}
                  >
                    <span className="flex items-center gap-1.5">
                      <KindDot kind={step.kind} />
                      <span className="eyebrow text-[9.5px]">{kindLabel[step.kind]}</span>
                    </span>
                    <span className="truncate text-[13.5px]">{step.text}</span>
                  </div>
                </div>
              ))}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function Tasks({ project }: { project: ProjectDetail }) {
  const { done, toggleDone } = useStore()
  if (!project.tasks.length) {
    return <p className="text-[15px] text-muted-foreground">Nothing to do here. Just thinking.</p>
  }
  return (
    <ul className="flex flex-col">
      {project.tasks.map((t) => (
        <li key={t.id} className="flex items-start gap-4 border-b border-foreground/[0.06] py-4 last:border-0">
          <span className="pt-1">
            <CheckCircle checked={done.has(t.id)} onToggle={() => toggleDone(t.id)} label={t.title} />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className={cn('text-[17px] transition-colors', done.has(t.id) && 'text-muted-foreground line-through decoration-foreground/20')}>
              {t.title}
            </span>
            {t.note ? <span className="text-[13px] text-muted-foreground">{t.note}</span> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
