import type { Metadata } from 'next'
import { SavedView } from '@/components/library/library-views'

export const metadata: Metadata = { title: 'Saved — Context' }

export default function SavedPage() {
  return <SavedView />
}
