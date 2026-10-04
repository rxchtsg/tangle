'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { CommandPalette } from '@/components/search/command-palette'
import { Sidebar } from './sidebar'
import { MobileTabBar, MobileTopBar } from './mobile-nav'
import { navItems } from './nav-items'

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  return target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { searchOpen, setSearchOpen } = useStore()

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const mod = event.metaKey || event.ctrlKey
      if (mod && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(!searchOpen)
        return
      }
      if (isTypingTarget(event.target) || mod || event.altKey) return
      if (event.key === '/') {
        event.preventDefault()
        setSearchOpen(true)
        return
      }
      const nav = navItems.find((item) => item.shortcut === event.key)
      if (nav && !searchOpen) router.push(nav.href)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router, searchOpen, setSearchOpen])

  return (
    <div className="flex min-h-dvh">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1">{children}</main>
      </div>
      <MobileTabBar />
      <CommandPalette />
    </div>
  )
}
