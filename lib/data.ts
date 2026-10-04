export type ItemKind = 'note' | 'link' | 'idea' | 'task' | 'question' | 'image'

export type GroupType = 'project' | 'idea' | 'reference' | 'question' | 'note'

export type InboxItem = {
  id: string
  kind: ItemKind
  content: string
  time: string
  project?: string
  link?: { url: string; domain: string; title: string }
  images?: string[]
  person?: string
  due?: string
  /** Where Organise will place this item. */
  route?: { groupId: string; label: string; type: GroupType }
  /** Short description of what Organise pulls out of the item. */
  extract?: string
}

export const initialItems: InboxItem[] = [
  {
    id: 'i1',
    kind: 'task',
    content: 'Need to revisit the onboarding flow before Thursday',
    time: '12m',
    due: 'Thu',
    route: { groupId: 'g-question', label: 'Onboarding question', type: 'question' },
    extract: 'Deadline · Thursday',
  },
  {
    id: 'i2',
    kind: 'link',
    content: 'https://linear.app',
    time: '38m',
    link: {
      url: 'https://linear.app',
      domain: 'linear.app',
      title: 'Linear — Plan and build products',
    },
    route: { groupId: 'g-reference', label: 'Reference', type: 'reference' },
    extract: 'Navigation reference',
  },
  {
    id: 'i3',
    kind: 'idea',
    content: 'Maybe build an AI company research assistant',
    time: '1h',
    route: { groupId: 'g-idea', label: 'Ideas', type: 'idea' },
    extract: 'New idea',
  },
  {
    id: 'i4',
    kind: 'task',
    content: 'Ask Max about the API architecture',
    time: '2h',
    person: 'Max',
    route: { groupId: 'g-project', label: 'Vercel side project', type: 'project' },
    extract: 'Follow-up · Max',
  },
  {
    id: 'i5',
    kind: 'note',
    content: 'finish the interface for the side project — nav still feels off, too many levels',
    time: '3h',
    route: { groupId: 'g-project', label: 'Vercel side project', type: 'project' },
    extract: '2 tasks',
  },
  {
    id: 'i6',
    kind: 'note',
    content: 'deploy the prototype this weekend + write a short launch post',
    time: 'Yesterday',
    route: { groupId: 'g-project', label: 'Vercel side project', type: 'project' },
    extract: '2 tasks',
  },
  {
    id: 'i7',
    kind: 'question',
    content: 'how should onboarding actually work? progressive, or everything upfront?',
    time: 'Yesterday',
    route: { groupId: 'g-question', label: 'Onboarding question', type: 'question' },
    extract: 'Open question',
  },
]

export type OrganisedGroup = {
  id: string
  type: GroupType
  title: string
  summary?: string
  tasks?: string[]
  followUp?: { person: string; topic: string }
  link?: { domain: string; title: string }
  due?: string
  sourceIds: string[]
}

export const organisedGroups: OrganisedGroup[] = [
  {
    id: 'g-project',
    type: 'project',
    title: 'Vercel side project',
    summary: 'Three notes about the same build, merged into one project.',
    tasks: ['Finish interface', 'Refine navigation', 'Deploy prototype', 'Write launch post'],
    followUp: { person: 'Max', topic: 'API architecture' },
    sourceIds: ['i5', 'i6', 'i4'],
  },
  {
    id: 'g-idea',
    type: 'idea',
    title: 'AI company research assistant',
    summary: 'Filed under Ideas. Related to nothing yet — a fresh thread.',
    sourceIds: ['i3'],
  },
  {
    id: 'g-reference',
    type: 'reference',
    title: 'Linear',
    link: { domain: 'linear.app', title: 'Plan and build products' },
    summary: 'Saved as a reference for the side project’s navigation.',
    sourceIds: ['i2'],
  },
  {
    id: 'g-question',
    type: 'question',
    title: 'How should the onboarding flow work?',
    summary: 'Two captures asking the same thing. Needs an answer by Thursday.',
    due: 'Thursday',
    sourceIds: ['i1', 'i7'],
  },
]

export const groupTypeLabel: Record<GroupType, string> = {
  project: 'Project',
  idea: 'Idea',
  reference: 'Reference',
  question: 'Question',
  note: 'Note',
}

export type Project = {
  slug: string
  name: string
  description: string
  updated: string
  counts: { tasks: number; ideas: number; references: number }
}

export const projects: Project[] = [
  {
    slug: 'vercel-side-project',
    name: 'Vercel side project',
    description: 'A small, opinionated prototype — interface, navigation, and a launch.',
    updated: '12m ago',
    counts: { tasks: 4, ideas: 3, references: 2 },
  },
  {
    slug: 'onboarding-redesign',
    name: 'Onboarding redesign',
    description: 'Progressive vs. upfront. Decision due Thursday.',
    updated: '2h ago',
    counts: { tasks: 3, ideas: 1, references: 4 },
  },
  {
    slug: 'reading-notes',
    name: 'Reading notes',
    description: 'Highlights and loose quotes from books in progress.',
    updated: '3d ago',
    counts: { tasks: 0, ideas: 6, references: 11 },
  },
]

export type Task = { id: string; title: string; done: boolean; note?: string }

export const projectTasks: Task[] = [
  { id: 't1', title: 'Finish interface', done: false, note: 'Composer and inbox rows first' },
  { id: 't2', title: 'Refine navigation', done: false, note: 'Too many levels — flatten to five' },
  { id: 't3', title: 'Deploy prototype', done: false, note: 'This weekend' },
  { id: 't4', title: 'Write launch post', done: false },
]

export const projectIdeas = [
  {
    title: 'Treat the inbox as the home screen',
    body: 'Capture should be the first thing you see, not a modal.',
    time: '3h',
  },
  {
    title: 'Show where things came from',
    body: 'When something is organised, keep a thread back to the original capture.',
    time: 'Yesterday',
  },
  {
    title: 'A Today view that reads like a briefing',
    body: 'Less dashboard, more morning paper.',
    time: '2d',
  },
]

export const projectReferences = [
  { title: 'Linear — Plan and build products', domain: 'linear.app', note: 'Navigation density' },
  { title: 'Raycast — Your shortcut to everything', domain: 'raycast.com', note: 'Command palette' },
]

export const projectActivity = [
  { time: '12m', text: 'Organise merged 3 captures into this project' },
  { time: '38m', text: 'Linked a reference — linear.app' },
  { time: '3h', text: 'You added a note about navigation' },
  { time: 'Yesterday', text: 'Extracted 2 tasks from a capture' },
  { time: 'Mon', text: 'Project created from an inbox thought' },
]

export const people = [
  { name: 'Max', role: 'Backend · API architecture' },
  { name: 'Priya', role: 'Design review on Friday' },
]

export const savedLinks = [
  { title: 'Linear — Plan and build products', domain: 'linear.app', note: 'Navigation reference', time: '38m' },
  { title: 'The shape of a good inbox', domain: 'craigmod.com', note: 'Essay · 9 min read', time: 'Yesterday' },
  { title: 'Raycast — Your shortcut to everything', domain: 'raycast.com', note: 'Command palette patterns', time: '2d' },
  { title: 'On calm technology', domain: 'calmtech.com', note: 'Principles', time: 'Last week' },
]

export const ideas = [
  { title: 'AI company research assistant', body: 'Paste a company name, get a briefing worth reading.', time: '1h', project: undefined },
  { title: 'Treat the inbox as the home screen', body: 'Capture should be the first thing you see.', time: '3h', project: 'Vercel side project' },
  { title: 'Weekly “what changed” digest', body: 'A Sunday email of everything that moved.', time: '2d', project: undefined },
  { title: 'A Today view that reads like a briefing', body: 'Less dashboard, more morning paper.', time: '2d', project: 'Vercel side project' },
]
