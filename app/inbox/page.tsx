import type { Metadata } from 'next'
import { InboxView } from '@/components/inbox/inbox-view'

export const metadata: Metadata = { title: 'Inbox — Tangle' }

export default function Page() {
  return <InboxView />
}
