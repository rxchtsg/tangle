import { cn } from '@/lib/utils'

type MarkProps = { className?: string; animated?: boolean; twisting?: boolean }

/** Two strands that cross twice — a twist, not a knot. */
export function TangleMark({ className, animated, twisting }: MarkProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn(animated && 'mark-draw', twisting && 'twist', className)}
    >
      <path
        d="M2.5 9C7 9 8.6 15 12 15S17 9 21.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
      />
      <path
        d="M2.5 15C7 15 8.6 9 12 9S17 15 21.5 15"
        stroke="currentColor"
        strokeOpacity="0.38"
        strokeWidth="1.6"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  )
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2 text-foreground', className)}>
      <TangleMark className="size-[18px]" />
      <span className="text-[15px] font-medium tracking-[-0.02em]">Tangle</span>
    </span>
  )
}
