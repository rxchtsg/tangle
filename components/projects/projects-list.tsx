import Link from 'next/link'
import { projects } from '@/lib/data'
import { PageContainer, SectionLabel } from '@/components/primitives'

export function ProjectsList() {
  return (
    <PageContainer className="md:pt-20">
      <header className="mb-10">
        <h1 className="text-[30px] font-semibold tracking-[-0.03em] md:text-[36px]">Projects</h1>
        <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
          Contexts that grew out of things you captured.
        </p>
      </header>
      <SectionLabel className="mb-2">Active</SectionLabel>
      <ul className="flex flex-col">
        {projects.map((project) => (
          <li key={project.slug} className="border-t border-border first:border-t-0">
            <Link
              href={project.slug === 'vercel-side-project' ? `/projects/${project.slug}` : '/projects'}
              className="group -mx-3 flex flex-col gap-1 rounded-md px-3 py-5 transition-colors duration-150 hover:bg-accent/70 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
            >
              <span className="flex min-w-0 flex-col gap-1">
                <span className="text-[17px] font-medium tracking-[-0.015em]">{project.name}</span>
                <span className="text-pretty text-[14px] leading-relaxed text-muted-foreground">{project.description}</span>
              </span>
              <span className="flex shrink-0 gap-3 font-mono text-[11px] text-muted-foreground">
                <span>
                  {project.counts.tasks} tasks · {project.counts.ideas} ideas
                </span>
                <span>{project.updated}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageContainer>
  )
}
