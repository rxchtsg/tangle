'use client'

import { ArrowUpRight } from 'lucide-react'
import { ideas, savedLinks } from '@/lib/data'
import { useStore } from '@/lib/store'
import { Favicon, PageContainer } from '@/components/primitives'

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-10">
      <h1 className="text-[30px] font-semibold tracking-[-0.03em] md:text-[36px]">{title}</h1>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{subtitle}</p>
    </header>
  )
}

export function IdeasView() {
  const { items } = useStore()
  const captured = items
    .filter((item) => item.kind === 'idea' && !ideas.some((idea) => idea.title.includes(item.content.replace(/^maybe /i, ''))))
    .map((item) => ({ title: item.content, body: 'Captured from your inbox.', time: item.time, project: item.project }))
  const all = [...captured, ...ideas]

  return (
    <PageContainer className="md:pt-20">
      <PageHeader title="Ideas" subtitle="Half-formed things worth keeping. Some of them will become projects." />
      <ul className="grid gap-x-12 md:grid-cols-2">
        {all.map((idea) => (
          <li key={idea.title} className="border-t border-border py-5">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-pretty text-[16px] font-medium leading-snug tracking-[-0.01em]">{idea.title}</p>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{idea.time}</span>
            </div>
            <p className="mt-1.5 text-pretty text-[14px] leading-relaxed text-muted-foreground">{idea.body}</p>
            {idea.project ? <p className="mt-2 text-[12px] text-muted-foreground">in {idea.project}</p> : null}
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}

export function SavedView() {
  const { items } = useStore()
  const captured = items
    .filter((item) => item.link && !savedLinks.some((l) => l.domain === item.link!.domain))
    .map((item) => ({ title: item.link!.title, domain: item.link!.domain, note: 'From your inbox', time: item.time }))
  const all = [...captured, ...savedLinks]

  return (
    <PageContainer className="md:pt-20">
      <PageHeader title="Saved" subtitle="Links and references worth coming back to." />
      <ul className="flex flex-col">
        {all.map((link) => (
          <li key={link.domain} className="border-t border-border first:border-t-0">
            <a
              href={`https://${link.domain}`}
              target="_blank"
              rel="noreferrer"
              className="group -mx-3 flex items-center gap-4 rounded-md px-3 py-4 transition-colors duration-150 hover:bg-accent/70"
            >
              <Favicon domain={link.domain} className="size-7 text-[12px]" />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[15px] font-medium">{link.title}</span>
                <span className="truncate text-[13px] text-muted-foreground">
                  <span className="font-mono text-[12px]">{link.domain}</span> · {link.note}
                </span>
              </span>
              <span className="hidden shrink-0 font-mono text-[11px] text-muted-foreground sm:inline">{link.time}</span>
              <ArrowUpRight
                className="size-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              />
            </a>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
