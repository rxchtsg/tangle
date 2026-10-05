'use client'

import { usePathname } from 'next/navigation'
import { CommandPalette } from '@/components/search/command-palette'
import { Environment } from './environment'
import { FloatingNav, MobileTop } from './floating-nav'
import { MobileDock } from './mobile-dock'
import { Welcome } from './welcome'

const AUTH_PATHS = new Set(['/login', '/signup'])

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (AUTH_PATHS.has(pathname)) {
    return (
      <>
        <Environment />
        <main className="relative min-h-dvh">{children}</main>
      </>
    )
  }

  return (
    <>
      <Environment />
      <Welcome />
      <div className="app-stage relative min-h-dvh">
        <FloatingNav />
        <MobileTop />
        <main className="relative px-5 pb-40 pt-6 lg:pb-32 lg:pl-[236px] lg:pr-10 lg:pt-10">{children}</main>
        <MobileDock />
      </div>
      <CommandPalette />
    </>
  )
}
