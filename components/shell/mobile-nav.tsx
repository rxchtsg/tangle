'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Settings } from 'lucide-react'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { isActive, navItems } from './nav-items'

export function MobileTopBar() {
  const { setSearchOpen } = useStore()
  return (
    <header className="sticky top-0 z-30 flex h-12 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md md:hidden">
      <Link href="/" className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em]">
        <span aria-hidden="true" className="relative inline-flex size-4 items-center justify-center">
          <span className="absolute inset-0 rounded-[3px] border-[1.5px] border-foreground" />
          <span className="size-1.5 rounded-[1px] bg-cobalt" />
        </span>
        Context
      </Link>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Search"
        >
          <Search className="size-4" strokeWidth={1.75} />
        </button>
        <Link
          href="/settings"
          className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Settings"
        >
          <Settings className="size-4" strokeWidth={1.75} />
        </Link>
      </div>
    </header>
  )
}

export function MobileTabBar() {
  const pathname = usePathname()
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <ul className="grid grid-cols-5">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-14 flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  active ? 'text-foreground' : 'text-muted-foreground',
                )}
              >
                <Icon className="size-[18px]" strokeWidth={active ? 2 : 1.6} aria-hidden="true" />
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
