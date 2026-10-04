'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Settings2 } from 'lucide-react'
import { Wordmark } from '@/components/brand/mark'
import { Kbd } from '@/components/primitives'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { isActive, navItems } from './nav-items'

const itemClass =
  'group/item relative flex h-9 items-center gap-2.5 rounded-[10px] px-2.5 text-[13.5px] transition-[background,color,box-shadow] duration-200'

export function FloatingNav() {
  const pathname = usePathname()
  const { thoughts, organised, setSearchOpen } = useStore()
  const loose = organised ? 0 : thoughts.length

  return (
    <nav
      aria-label="Main"
      className="material-glass fixed left-5 top-5 z-40 hidden w-[184px] flex-col gap-1 rounded-[18px] p-2 lg:flex"
    >
      <Link href="/" className="flex h-10 items-center rounded-[10px] px-2.5" aria-label="Tangle home">
        <Wordmark />
      </Link>

      <ul className="flex flex-col gap-0.5">
        {navItems.slice(1).map((item) => {
          const active = isActive(pathname, item.href)
          const Icon = item.icon === 'mark' ? null : item.icon
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  itemClass,
                  active
                    ? 'bg-card text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent),0_1px_2px_color-mix(in_oklab,var(--foreground)_6%,transparent)]'
                    : 'text-foreground/55 hover:bg-card/50 hover:text-foreground',
                )}
              >
                {Icon ? <Icon className="size-[15px]" strokeWidth={1.6} aria-hidden="true" /> : null}
                {item.label}
                {item.href === '/inbox' && loose > 0 ? (
                  <span className="ml-auto font-mono text-[10.5px] text-muted-foreground">{loose}</span>
                ) : null}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mx-2.5 my-1 h-px bg-foreground/[0.06]" />

      <button
        type="button"
        onClick={() => setSearchOpen(true)}
        className={cn(itemClass, 'text-foreground/55 hover:bg-card/50 hover:text-foreground')}
      >
        <Search className="size-[15px]" strokeWidth={1.6} aria-hidden="true" />
        Search
        <Kbd className="ml-auto h-5 min-w-5 text-[10px]">⌘K</Kbd>
      </button>
      <Link
        href="/settings"
        aria-current={isActive(pathname, '/settings') ? 'page' : undefined}
        className={cn(
          itemClass,
          isActive(pathname, '/settings') ? 'bg-card text-foreground' : 'text-foreground/55 hover:bg-card/50 hover:text-foreground',
        )}
      >
        <Settings2 className="size-[15px]" strokeWidth={1.6} aria-hidden="true" />
        Settings
      </Link>
    </nav>
  )
}

export function MobileTop() {
  const { setSearchOpen } = useStore()
  return (
    <div className="flex items-center justify-between px-5 pt-5 lg:hidden">
      <Link href="/" aria-label="Tangle home" className="flex h-10 items-center">
        <Wordmark />
      </Link>
      <div className="flex items-center gap-1">
        <Link
          href="/inbox"
          className="flex h-10 items-center rounded-full px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/60 hover:text-foreground"
        >
          Inbox
        </Link>
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="grid size-10 place-items-center rounded-full text-foreground/60 hover:text-foreground"
          aria-label="Search"
        >
          <Search className="size-[18px]" strokeWidth={1.6} />
        </button>
      </div>
    </div>
  )
}
