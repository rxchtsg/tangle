'use client'

import { Fragment, useEffect, useRef } from 'react'
import { Command, CornerDownLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

// The mono font has no ⌘ / ↵ glyphs, so render those keys as icons.
const KEY_ICONS: Record<string, React.ReactNode> = {
  '⌘': <Command className="size-3" aria-label="Command" />,
  '↵': <CornerDownLeft className="size-3" aria-label="Enter" />,
}

function renderKeys(children: React.ReactNode) {
  if (typeof children !== 'string') return children
  return Array.from(children).map((ch, i) => <Fragment key={i}>{KEY_ICONS[ch] ?? ch}</Fragment>)
}

export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[6px] px-1.5 font-mono text-[11px] text-foreground/60',
        'bg-card shadow-[inset_0_-1px_0_color-mix(in_oklab,var(--foreground)_10%,transparent),0_0_0_1px_color-mix(in_oklab,var(--foreground)_8%,transparent)]',
        className,
      )}
    >
      {renderKeys(children)}
    </kbd>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn('eyebrow', className)}>{children}</p>
}

export function PageIntro({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string
  title: React.ReactNode
  lede?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="flex flex-col gap-4 pt-4 lg:pt-14">
      <Eyebrow className="rise">{eyebrow}</Eyebrow>
      <h1
        className="rise text-balance text-[clamp(2.1rem,4.6vw,3.4rem)] font-light leading-[1.04] tracking-[-0.035em]"
        style={{ '--d': '80ms' } as React.CSSProperties}
      >
        {title}
      </h1>
      {lede ? (
        <p
          className="rise max-w-[34rem] text-pretty text-[16px] leading-relaxed text-muted-foreground"
          style={{ '--d': '160ms' } as React.CSSProperties}
        >
          {lede}
        </p>
      ) : null}
      {children}
    </header>
  )
}

/** Fades content in with a soft blur as it scrolls into view. */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}) {
  const ref = useRef<HTMLElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.setAttribute('data-shown', '')
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn('reveal', className)}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </Tag>
  )
}

/** Writes a -1..1 scroll progress to `--p` so children can drift at different depths. */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    const update = () => {
      raf = 0
      const rect = el.getBoundingClientRect()
      const center = rect.top + rect.height / 2
      const p = (center - window.innerHeight / 2) / window.innerHeight
      el.style.setProperty('--p', Math.max(-1.5, Math.min(1.5, p)).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  return ref
}

export function CheckCircle({
  checked,
  onToggle,
  label,
}: {
  checked: boolean
  onToggle: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cn(
        'relative grid size-[18px] shrink-0 place-items-center rounded-full transition-all duration-300',
        checked
          ? 'bg-foreground text-primary-foreground'
          : 'shadow-[inset_0_0_0_1.25px_color-mix(in_oklab,var(--foreground)_28%,transparent)] hover:shadow-[inset_0_0_0_1.25px_var(--foreground)]',
      )}
    >
      <svg viewBox="0 0 12 12" className={cn('size-2.5 transition-opacity', checked ? 'opacity-100' : 'opacity-0')} aria-hidden="true">
        <path d="M2.5 6.2 5 8.5l4.5-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  )
}
