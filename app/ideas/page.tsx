import type { Metadata } from 'next'
import { IdeasView } from '@/components/library/library-views'

export const metadata: Metadata = { title: 'Ideas — Context' }

export default function IdeasPage() {
  return <IdeasView />
}
