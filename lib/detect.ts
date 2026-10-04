import type { GroupType, InboxItem, ItemKind } from './data'

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i
const URL_IN_TEXT_RE = /(https?:\/\/[^\s]+)/i
const TASK_RE =
  /^(ask|call|email|send|finish|book|buy|pay|review|fix|ship|deploy|write|follow up|remind|schedule)\b|\b(before|by|tomorrow|tonight|today|monday|tuesday|wednesday|thursday|friday|weekend)\b/i
const IDEA_RE = /^(maybe|idea|what if|could|we should|imagine)\b/i
const QUESTION_RE = /\?\s*$|^(how|what|why|when|where|who|should)\b/i

export function extractDomain(url: string) {
  try {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    return new URL(withProtocol).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function detectKind(text: string, hasImages = false): ItemKind {
  const value = text.trim()
  if (!value && hasImages) return 'image'
  if (URL_RE.test(value) || URL_IN_TEXT_RE.test(value)) return 'link'
  if (QUESTION_RE.test(value)) return 'question'
  if (IDEA_RE.test(value)) return 'idea'
  if (TASK_RE.test(value)) return 'task'
  if (hasImages) return 'image'
  return 'note'
}

export const kindLabel: Record<ItemKind, string> = {
  note: 'Thought',
  link: 'Link',
  idea: 'Idea',
  task: 'Reminder',
  question: 'Question',
  image: 'Image',
}

const kindToGroup: Record<ItemKind, GroupType> = {
  note: 'note',
  link: 'reference',
  idea: 'idea',
  task: 'note',
  question: 'question',
  image: 'reference',
}

let counter = 0

export function createItem(text: string, images: string[]): InboxItem {
  const content = text.trim()
  const kind = detectKind(content, images.length > 0)
  const id = `new-${Date.now()}-${counter++}`
  const urlMatch = content.match(URL_IN_TEXT_RE)?.[0] ?? (URL_RE.test(content) ? content : undefined)
  const domain = urlMatch ? extractDomain(urlMatch) : undefined
  const groupType = kindToGroup[kind]

  return {
    id,
    kind,
    content: content || `${images.length} image${images.length === 1 ? '' : 's'}`,
    time: 'Just now',
    images: images.length ? images : undefined,
    link: urlMatch && domain ? { url: urlMatch, domain, title: domain } : undefined,
    route: {
      groupId: id,
      label: groupType === 'note' ? 'Loose thought' : kindLabel[kind],
      type: groupType,
    },
    extract: kind === 'task' ? '1 task' : undefined,
  }
}
