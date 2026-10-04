'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Layers, Lightbulb, Plus, Sunrise } from 'lucide-react'
import { TangleMark } from '@/components/brand/mark'
import { useStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { isActive } from './nav-items'

const left = [
  { href: '/', label: 'Tangle', icon: null },
  { href: '/today', label: 'Today', icon: Sunrise },
]
const right = [
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
  { href: '/projects', label: 'Projects', icon: Layers },
]

function DockLink({ href, label, icon: Icon }: { href: string; label: string; icon: typeof Sunrise | null }) {
  const pathname = usePathname()
  const active = isActive(pathname, href)
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'relative grid size-12 place-items-center rounded-[16px] transition-colors duration-200',
        active ? 'bg-card text-foreground' : 'text-foreground/50',
      )}
    >
      {Icon ? <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" /> : <TangleMark className="size-5" />}
    </Link>
  )
}

export function MobileDock() {
  const pathname = usePathname()
  const router = useRouter()
  const { setPendingCapture } = useStore()

  const capture = () => {
    setPendingCapture(true)
    if (pathname !== '/') router.push('/')
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <nav aria-label="Main" className="material-glass flex items-center gap-1 rounded-[22px] p-1.5">
        {left.map((item) => (
          <DockLink key={item.href} {...item} />
        ))}
        <button
          type="button"
          onClick={capture}
          aria-label="Capture a thought"
          className="mx-1 grid size-12 place-items-center rounded-[16px] bg-primary text-primary-foreground shadow-[0_8px_18px_-8px_color-mix(in_oklab,var(--foreground)_60%,transparent)] transition-transform active:scale-95"
        >
          <Plus className="size-5" strokeWidth={1.8} />
        </button>
        {right.map((item) => (
          <DockLink key={item.href} {...item} />
        ))}
      </nav>
    </div>
  )
}
