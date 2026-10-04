'use client'

import { CommandPalette } from '@/components/search/command-palette'
import { Environment } from './environment'
import { FloatingNav, MobileTop } from './floating-nav'
import { MobileDock } from './mobile-dock'
import { Welcome } from './welcome'

export function AppShell({ children }: { children: React.ReactNode }) {
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
