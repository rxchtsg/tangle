import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export const organiseSteps = ['Analyzing', 'Grouping', 'Extracting actions', 'Connecting context'] as const

export function OrganiseProgress({
  phase,
  details,
  durations,
}: {
  phase: number
  details: string[]
  durations: number[]
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2" role="status" aria-live="polite">
      <ol className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-[0.08em] sm:flex">
        {organiseSteps.map((step, i) => {
          const done = i < phase
          const current = i === phase
          return (
            <li key={step} className="flex items-center gap-2">
              <span
                className={cn(
                  'relative flex items-center gap-1.5 pb-1 transition-colors duration-300',
                  done && 'text-muted-foreground',
                  current && 'text-foreground',
                  !done && !current && 'text-muted-foreground/40',
                )}
              >
                {done ? <Check className="size-3" strokeWidth={2.25} aria-hidden="true" /> : null}
                {step}
                {current ? (
                  <span
                    key={phase}
                    aria-hidden="true"
                    className="animate-scan-progress absolute inset-x-0 bottom-0 h-px bg-cobalt"
                    style={{ '--scan-duration': `${durations[i]}ms` } as React.CSSProperties}
                  />
                ) : null}
              </span>
              {i < organiseSteps.length - 1 ? (
                <span aria-hidden="true" className="pb-1 text-muted-foreground/40">
                  →
                </span>
              ) : null}
            </li>
          )
        })}
      </ol>
      <p key={phase} className="animate-in fade-in text-[13px] text-muted-foreground duration-300">
        <span className="font-medium text-foreground sm:hidden">{organiseSteps[phase]} · </span>
        {details[phase]}
      </p>
    </div>
  )
}
