import { Inbox, Layers, Lightbulb, Sunrise, type LucideIcon } from 'lucide-react'

export type NavItem = { href: string; label: string; icon: LucideIcon | 'mark' }

export const navItems: NavItem[] = [
  { href: '/', label: 'Tangle', icon: 'mark' },
  { href: '/inbox', label: 'Inbox', icon: Inbox },
  { href: '/today', label: 'Today', icon: Sunrise },
  { href: '/projects', label: 'Projects', icon: Layers },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb },
]

export function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}
