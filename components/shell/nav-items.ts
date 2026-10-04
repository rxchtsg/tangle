import { Bookmark, Inbox, Layers, Lightbulb, Sun, type LucideIcon } from 'lucide-react'

export type NavItem = { href: string; label: string; icon: LucideIcon; shortcut: string }

export const navItems: NavItem[] = [
  { href: '/', label: 'Inbox', icon: Inbox, shortcut: '1' },
  { href: '/today', label: 'Today', icon: Sun, shortcut: '2' },
  { href: '/projects', label: 'Projects', icon: Layers, shortcut: '3' },
  { href: '/ideas', label: 'Ideas', icon: Lightbulb, shortcut: '4' },
  { href: '/saved', label: 'Saved', icon: Bookmark, shortcut: '5' },
]

export function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}
