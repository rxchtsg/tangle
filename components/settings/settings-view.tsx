'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Kbd, PageContainer, SectionLabel } from '@/components/primitives'

const preferences = [
  { id: 'auto', label: 'Suggest where things belong', hint: 'Show a quiet hint on each capture.', initial: true },
  { id: 'brief', label: 'Morning briefing', hint: 'Prepare Today at 8:00 each morning.', initial: true },
  { id: 'links', label: 'Fetch link titles', hint: 'Read the page title when you paste a URL.', initial: false },
]

const shortcuts: [string, string[]][] = [
  ['Search everything', ['⌘', 'K']],
  ['Capture', ['⌘', '↵']],
  ['Go to Inbox … Saved', ['1', '–', '5']],
  ['Quick search', ['/']],
]

export function SettingsView() {
  const [values, setValues] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(preferences.map((p) => [p.id, p.initial])),
  )

  return (
    <PageContainer className="md:pt-20">
      <header className="mb-10">
        <h1 className="text-[30px] font-semibold tracking-[-0.03em] md:text-[36px]">Settings</h1>
      </header>

      <section aria-labelledby="prefs-heading" className="mb-12">
        <SectionLabel className="mb-2">
          <span id="prefs-heading">Preferences</span>
        </SectionLabel>
        <ul className="flex flex-col">
          {preferences.map((pref) => {
            const on = values[pref.id]
            return (
              <li key={pref.id} className="flex items-center justify-between gap-6 border-t border-border py-4 first:border-t-0">
                <span className="flex flex-col">
                  <span id={`pref-${pref.id}`} className="text-[15px] font-medium">
                    {pref.label}
                  </span>
                  <span className="text-[13px] text-muted-foreground">{pref.hint}</span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  aria-labelledby={`pref-${pref.id}`}
                  onClick={() => setValues((v) => ({ ...v, [pref.id]: !v[pref.id] }))}
                  className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border transition-colors duration-200',
                    on ? 'border-cobalt bg-cobalt' : 'border-border-strong bg-muted',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'inline-block size-3.5 rounded-full bg-card shadow-sm transition-transform duration-200',
                      on ? 'translate-x-[17px]' : 'translate-x-[2px]',
                    )}
                  />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section aria-labelledby="keys-heading">
        <SectionLabel className="mb-2">
          <span id="keys-heading">Keyboard</span>
        </SectionLabel>
        <ul className="flex flex-col">
          {shortcuts.map(([label, keys]) => (
            <li key={label} className="flex items-center justify-between border-t border-border py-3 text-[14px] first:border-t-0">
              {label}
              <span className="flex items-center gap-1">
                {keys.map((k, i) => (k === '–' ? <span key={i} className="text-muted-foreground">–</span> : <Kbd key={i}>{k}</Kbd>))}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </PageContainer>
  )
}
