import { PageIntro, Reveal } from '@/components/primitives'
import { ideas } from '@/lib/data'

export function IdeasView() {
  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-16">
      <PageIntro
        eyebrow="Ideas"
        title="Things you’ve been circling."
        lede="Tangle notices when an idea keeps coming back. The more often it returns, the sharper it gets."
      />

      <ul className="flex flex-col">
        {ideas.map((idea, i) => (
          <Reveal
            as="li"
            key={idea.title}
            delay={i * 60}
            className="group grid gap-3 border-b border-foreground/[0.06] py-8 first:pt-0 last:border-0 md:grid-cols-[1fr_12rem] md:gap-10"
          >
            <div className="flex flex-col gap-2">
              <p
                className="text-balance font-light leading-[1.15] tracking-[-0.025em] transition-colors duration-300"
                style={{ fontSize: `clamp(1.35rem, ${1.6 + idea.circled * 0.2}vw, ${1.5 + idea.circled * 0.22}rem)` }}
              >
                {idea.title}
              </p>
              <p className="max-w-[32rem] text-[15px] leading-relaxed text-muted-foreground">{idea.body}</p>
            </div>
            <div className="flex flex-col gap-2 md:items-end md:pt-2 md:text-right">
              <span className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, d) => (
                  <span
                    key={d}
                    className={d < idea.circled ? 'size-[5px] rounded-full bg-foreground/40' : 'size-[5px] rounded-full bg-foreground/10'}
                  />
                ))}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">{`Circled ${idea.circled}× · since ${idea.first.toLowerCase()}`}</span>
              <span className="font-mono text-[11px] text-muted-foreground/70 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                {idea.project ?? 'Not part of anything yet'}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
