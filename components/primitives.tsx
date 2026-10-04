import {
  CircleDot,
  CircleHelp,
  Command,
  CornerDownLeft,
  Image as ImageIcon,
  Link2,
  Lightbulb,
  Minus,
  type LucideIcon,
} from 'lucide-react'
import type { ItemKind } from '@/lib/data'
import { kindLabel } from '@/lib/detect'
import { cn } from '@/lib/utils'

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-[4px] border border-border bg-card px-1 font-mono text-[11px] leading-none text-muted-foreground',
        className,
      )}
    >
      {children === '⌘' ? (
        <>
          <Command className="size-3" aria-hidden="true" />
          <span className="sr-only">Command</span>
        </>
      ) : children === '↵' ? (
        <>
          <CornerDownLeft className="size-3" aria-hidden="true" />
          <span className="sr-only">Enter</span>
        </>
      ) : (
        children
      )}
    </kbd>
  )
}

const kindIcons: Record<ItemKind, LucideIcon> = {
  note: Minus,
  link: Link2,
  idea: Lightbulb,
  task: CircleDot,
  question: CircleHelp,
  image: ImageIcon,
}

export function KindIcon({ kind, className }: { kind: ItemKind; className?: string }) {
  const Icon = kindIcons[kind]
  return (
    <span
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center text-muted-foreground',
        className,
      )}
      title={kindLabel[kind]}
    >
      <Icon className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only">{kindLabel[kind]}</span>
    </span>
  )
}

export function SectionLabel({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'p' | 'span'
}) {
  return (
    <Tag
      className={cn(
        'font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </Tag>
  )
}

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('mx-auto w-full max-w-3xl px-5 pb-28 pt-10 md:px-10 md:pb-20 md:pt-16', className)}>
      {children}
    </div>
  )
}

export function Favicon({ domain, className }: { domain: string; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-border bg-card font-mono text-[10px] font-medium uppercase text-foreground',
        className,
      )}
    >
      {domain.charAt(0)}
    </span>
  )
}
