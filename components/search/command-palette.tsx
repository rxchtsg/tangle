'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CornerDownLeft, Search } from 'lucide-react'
import { Kbd } from '@/components/primitives'
import { ideas, kindLabel, olderThoughts, people, projects } from '@/lib/data'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'

type Result = { id: string; group: string; title: string; meta?: string; href: string }

const GROUPS = ['Thoughts', 'Projects', 'Ideas', 'People']

export function CommandPalette() {
  const router = useRouter()
  const { searchOpen, setSearchOpen, thoughts } = useStore()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(!searchOpen)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [searchOpen, setSearchOpen])

  useEffect(() => {
    if (!searchOpen) return
    setQuery('')
    setActive(0)
    const id = requestAnimationFrame(() => inputRef.current?.focus())
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      cancelAnimationFrame(id)
      document.body.style.overflow = prev
    }
  }, [searchOpen])

  const index = useMemo<Result[]>(
    () => [
      ...[...thoughts, ...olderThoughts].map((t) => ({
        id: t.id,
        group: 'Thoughts',
        title: t.content,
        meta: kindLabel[t.kind],
        href: '/inbox',
      })),
      ...projects.map((p) => ({ id: p.slug, group: 'Projects', title: p.name, meta: p.line, href: `/projects/${p.slug}` })),
      ...ideas.map((i) => ({ id: i.title, group: 'Ideas', title: i.title, meta: `Circled ${i.circled}×`, href: '/ideas' })),
      ...people.map((p) => ({ id: p.name, group: 'People', title: p.name, meta: p.note, href: '/inbox' })),
    ],
    [thoughts],
  )

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = q
      ? index.filter((r) => r.title.toLowerCase().includes(q) || r.meta?.toLowerCase().includes(q))
      : index.filter((r) => r.group !== 'Thoughts').concat(index.filter((r) => r.group === 'Thoughts').slice(0, 4))
    return GROUPS.flatMap((g) => list.filter((r) => r.group === g)).slice(0, 12)
  }, [index, query])

  if (!searchOpen) return null

  const go = (r?: Result) => {
    if (!r) return
    setSearchOpen(false)
    router.push(r.href)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
      <button
        type="button"
        aria-label="Close search"
        onClick={() => setSearchOpen(false)}
        className="pop-in absolute inset-0 bg-background/40 backdrop-blur-[6px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="material-glass-strong pop-in relative flex w-full max-w-[36rem] flex-col overflow-hidden rounded-[22px]"
        onKeyDown={(e) => {
          if (e.key === 'Escape') setSearchOpen(false)
          else if (e.key === 'ArrowDown') {
            e.preventDefault()
            setActive((a) => Math.min(results.length - 1, a + 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setActive((a) => Math.max(0, a - 1))
          } else if (e.key === 'Enter') {
            if (e.nativeEvent.isComposing || e.keyCode === 229) return
            e.preventDefault()
            go(results[active])
          }
        }}
      >
        <div className="flex items-center gap-3 border-b border-foreground/[0.06] px-5">
          <Search className="size-4 text-muted-foreground" strokeWidth={1.6} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            placeholder="Search your tangle…"
            aria-label="Search your tangle"
            className="h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-foreground/35 focus-visible:outline-none"
          />
          <Kbd>Esc</Kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2" role="listbox" aria-label="Results">
          {results.length === 0 ? (
            <p className="px-3 py-10 text-center text-[14px] text-muted-foreground">
              Nothing tangled up with that yet.
            </p>
          ) : (
            results.map((r, i) => (
              <div key={`${r.group}-${r.id}`}>
                {i === 0 || results[i - 1].group !== r.group ? (
                  <p className="eyebrow px-3 pb-1.5 pt-3 text-[9.5px]">{r.group}</p>
                ) : null}
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(r)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-[12px] px-3 py-2.5 text-left transition-colors duration-150',
                    i === active ? 'bg-accent/70' : 'hover:bg-foreground/[0.03]',
                  )}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14.5px]">{r.title}</span>
                    {r.meta ? <span className="block truncate text-[12.5px] text-muted-foreground">{r.meta}</span> : null}
                  </span>
                  {i === active ? (
                    <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.6} aria-hidden="true" />
                  ) : null}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
