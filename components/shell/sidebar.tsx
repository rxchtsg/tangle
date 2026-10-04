'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Settings } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { Kbd } from '@/components/primitives'
import { isActive, navItems } from './nav-items'

const itemClass =
  'group flex h-8 items-center gap-2.5 rounded-md px-2 text-[13px] font-medium transition-colors duration-150'

export function Sidebar() {
  const pathname = usePathname()
  const { items, setSearchOpen } = useStore()
  const unfiled = items.filter((item) => !item.project).length

  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r border-border bg-sidebar px-3 py-5 md:flex">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 px-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground"
      >
        <span aria-hidden="true" className="relative inline-flex size-4 items-center justify-center">
          <span className="absolute inset-0 rounded-[3px] border-[1.5px] border-foreground" />
          <span className="size-1.5 rounded-[1px] bg-cobalt" />
        </span>
        Context
      </Link>

      <nav aria-label="Primary" className="flex flex-col gap-px">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                itemClass,
                active
                  ? 'bg-sidebar-accent text-foreground'
                  : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
              )}
            >
              <Icon
                className={cn('size-4 transition-colors', active ? 'text-foreground' : 'text-muted-foreground/80')}
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="flex-1">{item.label}</span>
              {item.href === '/' && unfiled > 0 ? (
                <span className="font-mono text-[11px] tabular-nums text-muted-foreground">{unfiled}</span>
              ) : null}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto flex flex-col gap-px">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className={cn(itemClass, 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground')}
        >
          <Search className="size-4 text-muted-foreground/80" strokeWidth={1.75} aria-hidden="true" />
          <span className="flex-1 text-left">Search</span>
          <span className="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
        </button>
        <Link
          href="/settings"
          aria-current={pathname === '/settings' ? 'page' : undefined}
          className={cn(
            itemClass,
            pathname === '/settings'
              ? 'bg-sidebar-accent text-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground',
          )}
        >
          <Settings className="size-4 text-muted-foreground/80" strokeWidth={1.75} aria-hidden="true" />
          Settings
        </Link>
        <div className="mt-4 flex items-center gap-2.5 border-t border-border px-2 pt-4">
          <span
            aria-hidden="true"
            className="inline-flex size-6 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background"
          >
            R
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[13px] font-medium leading-tight">Rachel Tsang</span>
            <span className="truncate text-[11px] leading-tight text-muted-foreground">Personal</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
