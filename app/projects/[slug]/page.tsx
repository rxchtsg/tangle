import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProjectView } from '@/components/project/project-view'

export const metadata: Metadata = { title: 'Vercel side project — Context' }

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (slug !== 'vercel-side-project') notFound()
  return <ProjectView />
}
