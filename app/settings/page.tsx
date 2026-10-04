import type { Metadata } from 'next'
import { SettingsView } from '@/components/settings/settings-view'

export const metadata: Metadata = { title: 'Settings — Context' }

export default function SettingsPage() {
  return <SettingsView />
}
