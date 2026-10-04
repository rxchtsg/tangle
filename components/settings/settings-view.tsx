'use client'

import { useState } from 'react'
import { Eyebrow, Kbd, PageIntro, Reveal } from '@/components/primitives'
import { cn } from '@/lib/utils'

function Toggle({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
      className={cn(
        'relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-300',
        on ? 'bg-foreground' : 'bg-foreground/15',
      )}
    >
      <span
        className={cn(
          'absolute top-[3px] size-5 rounded-full bg-card shadow-[0_1px_3px_color-mix(in_oklab,var(--foreground)_30%,transparent)] transition-transform duration-300 ease-[var(--ease-spring)]',
          on ? 'translate-x-[21px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}

function Row({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6 border-b border-foreground/[0.06] py-5 last:border-0">
      <div className="flex flex-col gap-0.5">
        <p className="text-[15.5px]">{title}</p>
        <p className="text-[13px] text-muted-foreground">{note}</p>
      </div>
      {children}
    </div>
  )
}

const SHORTCUTS: [string, string[]][] = [
  ['Search everything', ['⌘', 'K']],
  ['Add a thought', ['⌘', '↵']],
  ['Close anything', ['Esc']],
]

export function SettingsView() {
  const [motion, setMotion] = useState(true)
  const [quietHours, setQuietHours] = useState(true)

  const replay = () => {
    try {
      localStorage.removeItem('tangle.welcomed')
    } catch {}
    window.location.href = '/'
  }

  return (
    <div className="mx-auto flex w-full max-w-[40rem] flex-col gap-14">
      <PageIntro eyebrow="Settings" title="Make it yours." />

      <Reveal as="section" className="flex flex-col">
        <Eyebrow className="pb-1">Atmosphere</Eyebrow>
        <Row title="Ambient motion" note="Let the light in the background drift slowly.">
          <Toggle
            on={motion}
            label="Ambient motion"
            onChange={(v) => {
              setMotion(v)
              document.documentElement.toggleAttribute('data-calm', !v)
            }}
          />
        </Row>
        <Row title="Quiet evenings" note="After 9pm, Today stops suggesting things to do.">
          <Toggle on={quietHours} label="Quiet evenings" onChange={setQuietHours} />
        </Row>
        <Row title="Welcome" note="See the first-launch sequence again.">
          <button
            type="button"
            onClick={replay}
            className="h-9 shrink-0 rounded-[10px] px-3.5 text-[13px] text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)] transition-colors hover:bg-card"
          >
            Replay
          </button>
        </Row>
      </Reveal>

      <Reveal as="section" delay={80} className="flex flex-col">
        <Eyebrow className="pb-3">Keyboard</Eyebrow>
        <ul className="flex flex-col">
          {SHORTCUTS.map(([label, keys]) => (
            <li key={label} className="flex items-center justify-between border-b border-foreground/[0.06] py-3.5 last:border-0">
              <span className="text-[15px]">{label}</span>
              <span className="flex gap-1">
                {keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </div>
  )
}
