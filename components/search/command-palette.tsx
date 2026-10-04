'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog } from '@base-ui/react/dialog'
import { ArrowRight, CornerDownLeft, Search, type LucideIcon } from 'lucide-react'
import { CircleCheck, FileText, Layers, Link2, User } from 'lucide-react'
import { people, projects, savedLinks } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/primitives'

type Result = {
  id: string
  group: 'Thoughts' | 'Tasks' | 'Projects' | 'Links' | 'People'
  title: string
  meta?: string
  href: string
}

const groupOrder: Result['group'][] = ['Thoughts', 'Tasks', 'Projects', 'Links', 'People']
const groupIcons: Record<Result['group'], LucideIcon> = {
  Thoughts: FileText,
  Tasks: CircleCheck,
  Projects: Layers,
  Links: Link2,
  People: User,
}

export function CommandPalette() {
  const router = useRouter()
  const { searchOpen, setSearchOpen, items, tasks } = useStore()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const [answer, setAnswer] = useState<{ state: 'thinking' | 'done'; text: string; q: string } | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const index = useMemo<Result[]>(() => {
    const thoughts = items
      .filter((item) => item.kind !== 'link')
      .map((item) => ({
        id: item.id,
        group: 'Thoughts' as const,
        title: item.content,
        meta: item.project ?? item.time,
        href: '/',
      }))
    const taskResults = tasks.map((task) => ({
      id: task.id,
      group: 'Tasks' as const,
      title: task.title,
      meta: task.done ? 'Done' : 'Vercel side project',
      href: '/projects/vercel-side-project',
    }))
    const projectResults = projects.map((project) => ({
      id: project.slug,
      group: 'Projects' as const,
      title: project.name,
      meta: `${project.counts.tasks} tasks`,
      href: project.slug === 'vercel-side-project' ? `/projects/${project.slug}` : '/projects',
    }))
    const linkResults = savedLinks.map((link) => ({
      id: link.domain,
      group: 'Links' as const,
      title: link.title,
      meta: link.domain,
      href: '/saved',
    }))
    const peopleResults = people.map((person) => ({
      id: person.name,
      group: 'People' as const,
      title: person.name,
      meta: person.role,
      href: '/projects/vercel-side-project',
    }))
    return [...thoughts, ...taskResults, ...projectResults, ...linkResults, ...peopleResults]
  }, [items, tasks])

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = q
      ? index.filter((r) => `${r.title} ${r.meta ?? ''}`.toLowerCase().includes(q))
      : index
    return groupOrder
      .map((group) => ({
        group,
        results: matches.filter((r) => r.group === group).slice(0, q ? 5 : 3),
      }))
      .filter((g) => g.results.length > 0)
  }, [index, query])

  const flat = useMemo(() => grouped.flatMap((g) => g.results), [grouped])
  const askIndex = flat.length
  const clampedIndex = Math.min(activeIndex, askIndex)

  function close() {
    setSearchOpen(false)
  }

  function handleOpenChange(open: boolean) {
    setSearchOpen(open)
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      setAnswer(null)
    }
  }

  function ask() {
    const q = query.trim() || 'What should I focus on?'
    setAnswer({ state: 'thinking', text: '', q })
    const related = index.filter((r) =>
      q
        .toLowerCase()
        .split(/\s+/)
        .some((word) => word.length > 3 && r.title.toLowerCase().includes(word)),
    )
    window.setTimeout(() => {
      const text = related.length
        ? `You’ve captured ${related.length} thing${related.length === 1 ? '' : 's'} related to this. The most recent is “${related[0].title}”${related[0].meta ? ` (${related[0].meta})` : ''}. ${related.length > 1 ? `It connects to “${related[1].title}”.` : ''}`
        : 'Your onboarding question is due Thursday and has two captures behind it. After that, the Vercel side project has four open tasks — “Finish interface” is the one blocking the rest.'
      setAnswer({ state: 'done', text, q })
    }, 900)
  }

  function select(i: number) {
    if (i === askIndex) {
      ask()
      return
    }
    const result = flat[i]
    if (!result) return
    router.push(result.href)
    close()
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((i) => (Math.min(i, askIndex) + 1) % (askIndex + 1))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((i) => (Math.min(i, askIndex) - 1 + askIndex + 1) % (askIndex + 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      select(event.metaKey || event.ctrlKey ? askIndex : clampedIndex)
    }
  }

  let runningIndex = -1

  return (
    <Dialog.Root open={searchOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/10 transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="fixed left-1/2 top-[12vh] z-50 flex max-h-[70vh] w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border-strong bg-popover shadow-[0_24px_48px_-24px_oklch(0.2_0.006_70/0.25)] outline-none transition-[opacity,transform] duration-200 data-[ending-style]:scale-[0.98] data-[ending-style]:opacity-0 data-[starting-style]:scale-[0.98] data-[starting-style]:opacity-0">
          <Dialog.Title className="sr-only">Search Context</Dialog.Title>
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
                setAnswer(null)
              }}
              onKeyDown={onKeyDown}
              placeholder="Search thoughts, tasks, projects, links, people…"
              aria-label="Search everything"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-results"
              aria-activedescendant={`palette-option-${clampedIndex}`}
              className="h-12 flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground/70 focus-visible:outline-none"
            />
            <Kbd>esc</Kbd>
          </div>

          <div ref={listRef} id="palette-results" role="listbox" className="flex-1 overflow-y-auto p-2">
            {answer ? (
              <div className="px-3 py-3" aria-live="polite">
                <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                  Context · {answer.q}
                </p>
                {answer.state === 'thinking' ? (
                  <div className="flex flex-col gap-2" aria-label="Thinking">
                    <span className="h-3 w-4/5 animate-pulse rounded-sm bg-muted" />
                    <span className="h-3 w-3/5 animate-pulse rounded-sm bg-muted" />
                  </div>
                ) : (
                  <p className="animate-in fade-in text-pretty text-[14px] leading-relaxed text-foreground duration-300">
                    {answer.text}
                  </p>
                )}
              </div>
            ) : grouped.length === 0 ? (
              <p className="px-3 py-6 text-center text-[13px] text-muted-foreground">
                Nothing matches “{query}”. Try asking Context instead.
              </p>
            ) : (
              grouped.map(({ group, results }) => {
                const Icon = groupIcons[group]
                return (
                  <div key={group} className="pb-1" role="group" aria-label={group}>
                    <p className="px-3 pb-1 pt-2 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
                      {group}
                    </p>
                    {results.map((result) => {
                      runningIndex += 1
                      const i = runningIndex
                      const active = i === clampedIndex
                      return (
                        <div
                          key={`${result.group}-${result.id}`}
                          id={`palette-option-${i}`}
                          role="option"
                          aria-selected={active}
                          onMouseMove={() => setActiveIndex(i)}
                          onClick={() => select(i)}
                          className={cn(
                            'flex h-9 cursor-pointer items-center gap-3 rounded-md px-3 text-[13.5px] transition-colors duration-100',
                            active ? 'bg-accent text-foreground' : 'text-foreground/85',
                          )}
                        >
                          <Icon className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate">{result.title}</span>
                          {result.meta ? (
                            <span className="hidden shrink-0 truncate text-[12px] text-muted-foreground sm:inline">
                              {result.meta}
                            </span>
                          ) : null}
                          <ArrowRight
                            className={cn('size-3.5 shrink-0 text-muted-foreground transition-opacity', active ? 'opacity-100' : 'opacity-0')}
                            aria-hidden="true"
                          />
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>

          <div
            id={`palette-option-${askIndex}`}
            role="option"
            aria-selected={clampedIndex === askIndex}
            onMouseMove={() => setActiveIndex(askIndex)}
            onClick={() => select(askIndex)}
            className={cn(
              'flex h-11 cursor-pointer items-center gap-3 border-t border-border px-5 text-[13px] transition-colors duration-100',
              clampedIndex === askIndex ? 'bg-cobalt-soft' : 'bg-transparent',
            )}
          >
            <span aria-hidden="true" className="relative inline-flex size-3.5 items-center justify-center">
              <span className="absolute inset-0 rounded-[3px] border-[1.5px] border-cobalt" />
              <span className="size-1 rounded-[1px] bg-cobalt" />
            </span>
            <span className="min-w-0 flex-1 truncate">
              <span className="font-medium text-cobalt">Ask Context</span>
              <span className="text-muted-foreground">
                {query.trim() ? ` — “${query.trim()}”` : ' — a question about anything you’ve captured'}
              </span>
            </span>
            <span className="flex items-center gap-0.5">
              <Kbd>⌘</Kbd>
              <Kbd>
                <CornerDownLeft className="size-3" aria-hidden="true" />
                <span className="sr-only">Enter</span>
              </Kbd>
            </span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
