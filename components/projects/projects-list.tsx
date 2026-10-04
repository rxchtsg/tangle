import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { PageIntro, Reveal } from '@/components/primitives'
import { KindDot } from '@/components/home/thought-object'
import { projects } from '@/lib/data'

export function ProjectsList() {
  return (
    <div className="mx-auto flex w-full max-w-[52rem] flex-col gap-16">
      <PageIntro
        eyebrow="Projects"
        title="Contexts, not folders."
        lede="Tangle groups thoughts that belong together. Each of these grew out of something you wrote."
      />

      <ul className="flex flex-col gap-3">
        {projects.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 80}>
            <Link
              href={`/projects/${p.slug}`}
              className="group relative flex flex-col gap-4 rounded-[22px] p-6 transition-all duration-300 hover:bg-card/70 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--foreground)_6%,transparent),0_20px_40px_-24px_color-mix(in_oklab,var(--foreground)_25%,transparent)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[clamp(1.6rem,3.4vw,2.25rem)] font-light leading-tight tracking-[-0.03em]">{p.name}</h2>
                  <p className="max-w-[32rem] text-[15px] leading-relaxed text-muted-foreground">{p.line}</p>
                </div>
                <ArrowRight
                  className="mt-3 size-5 shrink-0 -translate-x-1 text-foreground/40 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <KindDot kind="note" />
                  {`${p.counts.thoughts} thoughts`}
                </span>
                <span className="flex items-center gap-1.5">
                  <KindDot kind="task" />
                  {`${p.counts.tasks} tasks`}
                </span>
                <span className="flex items-center gap-1.5">
                  <KindDot kind="reference" />
                  {`${p.counts.references} references`}
                </span>
                <span className="ml-auto">{`Touched ${p.touched}`}</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </div>
  )
}
