import type { Metadata } from 'next'
import { TodayView } from '@/components/today/today-view'

export const metadata: Metadata = { title: 'Today — Context' }

export default function TodayPage() {
  return <TodayView />
}
