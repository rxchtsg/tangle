import type { Metadata } from 'next'
import { IdeasView } from '@/components/ideas/ideas-view'

export const metadata: Metadata = { title: 'Ideas — Tangle' }

export default function Page() {
  return <IdeasView />
}
