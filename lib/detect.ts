import type { Thought, ThoughtKind } from './data'

const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i
const URL_IN_TEXT_RE = /(https?:\/\/[^\s]+|\b[\w-]+\.(?:com|app|net|org|io|dev|co)\b\S*)/i
const TASK_RE =
  /^(ask|call|email|send|finish|book|buy|pay|review|fix|ship|deploy|write|follow up|remind|schedule)\b|\b(before|by|tomorrow|tonight|today|monday|tuesday|wednesday|thursday|friday|weekend|remind me)\b/i
const IDEA_RE = /^(maybe|idea|what if|could|we should|imagine)\b/i
const QUESTION_RE = /\?\s*$|^(how|what|why|when|where|who|should|is|are|can)\b/i

export function extractDomain(url: string) {
  try {
    const withProtocol = url.startsWith('http') ? url : `https://${url}`
    return new URL(withProtocol).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function detectKind(text: string): ThoughtKind {
  const value = text.trim()
  if (URL_RE.test(value) || URL_IN_TEXT_RE.test(value)) return 'reference'
  if (QUESTION_RE.test(value)) return 'question'
  if (IDEA_RE.test(value)) return 'idea'
  if (TASK_RE.test(value)) return 'task'
  return 'note'
}

let counter = 0

export function createThought(text: string): Thought {
  const content = text.trim()
  const kind = detectKind(content)
  const url = content.match(URL_IN_TEXT_RE)?.[0]
  return {
    id: `n-${Date.now()}-${counter++}`,
    kind,
    content,
    time: 'Just now',
    domain: url ? extractDomain(url) : undefined,
  }
}
