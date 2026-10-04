import type { Metadata } from 'next'
import { TodayView } from '@/components/today/today-view'

export const metadata: Metadata = { title: 'Today — Tangle' }

export default function Page() {
  return <TodayView />
}
