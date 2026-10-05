export function formatRelativeTime(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diffMs = now - then

  const minutes = Math.floor(diffMs / 60_000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m`

  const hours = Math.floor(diffMs / 3_600_000)
  if (hours < 24) return `${hours}h`

  const days = Math.floor(diffMs / 86_400_000)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`

  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
