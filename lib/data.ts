export type ThoughtKind = 'note' | 'idea' | 'reference' | 'task' | 'question'

export type Thought = {
  id: string
  kind: ThoughtKind
  content: string
  time: string
  project?: string
  domain?: string
  person?: string
  related?: string[]
}

export const kindLabel: Record<ThoughtKind, string> = {
  note: 'Note',
  idea: 'Idea',
  reference: 'Reference',
  task: 'Task',
  question: 'Question',
}

export const kindGlow: Record<ThoughtKind, string> = {
  note: 'var(--ambient-blue)',
  idea: 'var(--ambient-lavender)',
  reference: 'var(--ambient-blue)',
  task: 'var(--ambient-mint)',
  question: 'var(--ambient-peach)',
}

/** The six-ish messy thoughts currently loose in the tangle. */
export const initialThoughts: Thought[] = [
  {
    id: 't1',
    kind: 'note',
    content: 'finish the interface for the side project — nav still feels off, too many levels',
    time: '12m',
    related: ['t5', 't6', 't2'],
  },
  {
    id: 't2',
    kind: 'reference',
    content: 'how linear handles navigation density',
    domain: 'linear.app',
    time: '38m',
    related: ['t1'],
  },
  {
    id: 't3',
    kind: 'idea',
    content: 'maybe an AI research assistant for companies? paste a name, get a briefing',
    time: '1h',
  },
  {
    id: 't4',
    kind: 'question',
    content: 'how should onboarding actually work? progressive, or everything upfront',
    time: '2h',
    related: ['t7'],
  },
  {
    id: 't5',
    kind: 'note',
    content: 'Ask Max about the API architecture',
    person: 'Max',
    time: '3h',
    related: ['t1'],
  },
  {
    id: 't6',
    kind: 'task',
    content: 'deploy the prototype this weekend + write a short launch post',
    time: 'Yesterday',
    related: ['t1'],
  },
  {
    id: 't7',
    kind: 'note',
    content: 'onboarding — before thursday!!',
    time: 'Yesterday',
    related: ['t4'],
  },
]

export type GroupType = 'project' | 'idea' | 'question' | 'reference' | 'loose'

export type OrganisedGroup = {
  id: string
  type: GroupType
  title: string
  summary: string
  tasks?: { id: string; title: string }[]
  due?: string
  href?: string
  sourceIds: string[]
}

export const groupLabel: Record<GroupType, string> = {
  project: 'Project',
  idea: 'Idea',
  question: 'Question',
  reference: 'Reference',
  loose: 'Still loose',
}

export const organisedGroups: OrganisedGroup[] = [
  {
    id: 'g-project',
    type: 'project',
    title: 'Vercel side project',
    summary: 'Three scattered notes were all about the same build.',
    tasks: [
      { id: 'pt1', title: 'Finish interface' },
      { id: 'pt2', title: 'Deploy prototype' },
      { id: 'pt3', title: 'Write launch post' },
      { id: 'pt4', title: 'Ask Max about the API architecture' },
    ],
    href: '/projects/vercel-side-project',
    sourceIds: ['t1', 't6', 't5'],
  },
  {
    id: 'g-question',
    type: 'question',
    title: 'How should onboarding work?',
    summary: 'Asked twice. Wants an answer by Thursday.',
    due: 'Thursday',
    href: '/projects/onboarding',
    sourceIds: ['t4', 't7'],
  },
  {
    id: 'g-idea',
    type: 'idea',
    title: 'AI company research assistant',
    summary: 'A fresh thread. Not connected to anything yet.',
    href: '/ideas',
    sourceIds: ['t3'],
  },
  {
    id: 'g-reference',
    type: 'reference',
    title: 'linear.app',
    summary: 'Kept as a reference for the side project’s navigation.',
    sourceIds: ['t2'],
  },
]

export const groupOrder: GroupType[] = ['project', 'question', 'idea', 'reference', 'loose']

/** Things Tangle noticed across many captures. */
export const threads = [
  {
    id: 'th1',
    sentence: 'Onboarding keeps coming back.',
    detail: 'Four mentions since Monday, two of them with a deadline attached.',
    sources: ['how should onboarding actually work?', 'onboarding — before thursday!!'],
  },
  {
    id: 'th2',
    sentence: 'The side project’s real problem is navigation.',
    detail: 'Three different notes circle it, and one saved link is a reference for it.',
    sources: ['nav still feels off, too many levels', 'linear.app'],
  },
  {
    id: 'th3',
    sentence: 'You think about research tools when you’re tired.',
    detail: 'The last three ideas like this arrived after 11pm.',
    sources: ['AI research assistant for companies', 'a reading list that reads you back'],
  },
]

/** Older thoughts that sit deeper in the tangle. */
export const olderThoughts: Thought[] = [
  { id: 'o1', kind: 'idea', content: 'a reading list that reads you back', time: 'Last week' },
  { id: 'o2', kind: 'reference', content: 'Calm technology principles', domain: 'calmtech.com', time: 'Last week' },
  { id: 'o3', kind: 'note', content: 'Priya said design review moves to Friday', person: 'Priya', time: '9 days ago' },
  { id: 'o4', kind: 'question', content: 'is a weekly digest just a worse email?', time: '2 weeks ago' },
  { id: 'o5', kind: 'idea', content: 'the inbox should be the home screen, not a modal', time: '2 weeks ago' },
  { id: 'o6', kind: 'reference', content: 'The shape of a good inbox', domain: 'craigmod.com', time: '3 weeks ago' },
  { id: 'o7', kind: 'note', content: 'maybe thoughts should fade if you never touch them again', time: 'A month ago' },
]

/* ───────────────────────────── Today ───────────────────────────── */

export const todayFocus = [
  {
    id: 'pt1',
    title: 'Finish the interface',
    why: 'You’ve mentioned it every day this week. It’s blocking the deploy.',
    project: 'Vercel side project',
  },
  {
    id: 'f2',
    title: 'Decide how onboarding works',
    why: 'Due Thursday. You keep asking the question but haven’t picked an answer.',
    project: 'Onboarding',
  },
  {
    id: 'pt4',
    title: 'Ask Max about the API',
    why: 'A two-minute message that unblocks two other things.',
    project: 'Vercel side project',
  },
]

export const looseEnds = [
  { text: 'You said you’d reply to Priya about Friday’s review.', time: '9 days ago' },
  { text: 'The launch post has a title but no first sentence.', time: '2 days ago' },
  { text: 'A link to calmtech.com, saved without a note.', time: 'Last week' },
]

export const circling = [
  { title: 'An AI research assistant for companies', count: 4, since: 'Since last Tuesday' },
  { title: 'The inbox as the home screen', count: 3, since: 'Two weeks' },
]

export const revisit = {
  title: 'The shape of a good inbox',
  domain: 'craigmod.com',
  saved: '3 weeks ago',
  reason:
    'You saved this before you started the side project. It’s about exactly the navigation problem you wrote about this morning.',
}

/* ───────────────────────────── Projects ───────────────────────────── */

export type ChainStep = { kind: ThoughtKind; text: string }

export type ProjectDetail = {
  slug: string
  name: string
  line: string
  touched: string
  counts: { thoughts: number; tasks: number; references: number }
  overview: string
  chains: ChainStep[][]
  tasks: { id: string; title: string; note?: string }[]
  ideas: { title: string; body: string; time: string }[]
  references: { title: string; domain: string; note: string }[]
  activity: { time: string; text: string }[]
}

export const projects: ProjectDetail[] = [
  {
    slug: 'vercel-side-project',
    name: 'Vercel side project',
    line: 'A small, opinionated prototype — interface, navigation, and a launch.',
    touched: '12 minutes ago',
    counts: { thoughts: 4, tasks: 3, references: 2 },
    overview:
      'Most of what you’ve written here is about one thing: the navigation has too many levels. Fix that and the interface is close to done — then it’s a deploy and a short post.',
    chains: [
      [
        { kind: 'note', text: 'nav still feels off, too many levels' },
        { kind: 'idea', text: 'Flatten to five destinations' },
        { kind: 'task', text: 'Finish interface' },
        { kind: 'reference', text: 'linear.app' },
      ],
      [
        { kind: 'note', text: 'deploy this weekend' },
        { kind: 'task', text: 'Deploy prototype' },
        { kind: 'task', text: 'Write launch post' },
      ],
      [
        { kind: 'note', text: 'Ask Max about the API' },
        { kind: 'question', text: 'Edge or serverless for capture?' },
      ],
    ],
    tasks: [
      { id: 'pt1', title: 'Finish interface', note: 'Capture surface and thought objects first' },
      { id: 'pt2', title: 'Deploy prototype', note: 'This weekend' },
      { id: 'pt3', title: 'Write launch post' },
      { id: 'pt4', title: 'Ask Max about the API architecture' },
    ],
    ideas: [
      { title: 'Flatten navigation to five destinations', body: 'Tangle, Inbox, Today, Projects, Ideas. Nothing else.', time: '3h' },
      { title: 'Show where things came from', body: 'When something gets organised, keep a thread back to the original thought.', time: 'Yesterday' },
      { title: 'A Today that reads like a briefing', body: 'Less dashboard, more morning letter.', time: '2d' },
    ],
    references: [
      { title: 'Linear', domain: 'linear.app', note: 'Navigation density' },
      { title: 'Raycast', domain: 'raycast.com', note: 'Command palette' },
    ],
    activity: [
      { time: '12m', text: 'Organise pulled three loose notes into this project' },
      { time: '38m', text: 'A saved link became a reference — linear.app' },
      { time: '3h', text: 'You wrote about the navigation again' },
      { time: 'Yesterday', text: 'Two tasks were found inside one note' },
      { time: 'Monday', text: 'This project grew out of a single thought' },
    ],
  },
  {
    slug: 'onboarding',
    name: 'Onboarding',
    line: 'Progressive, or everything upfront. A decision by Thursday.',
    touched: '2 hours ago',
    counts: { thoughts: 6, tasks: 2, references: 3 },
    overview:
      'You’ve asked the same question four ways. Your notes lean progressive — reveal the product slowly — but you haven’t written that down as a decision yet.',
    chains: [
      [
        { kind: 'question', text: 'progressive, or everything upfront?' },
        { kind: 'idea', text: 'Let the product reveal itself' },
        { kind: 'task', text: 'Write the decision down' },
      ],
      [
        { kind: 'reference', text: 'Things 3 first launch' },
        { kind: 'idea', text: 'Welcome that only plays once' },
      ],
    ],
    tasks: [
      { id: 'ob1', title: 'Write the decision down', note: 'Before Thursday' },
      { id: 'ob2', title: 'Sketch the first sixty seconds' },
    ],
    ideas: [
      { title: 'Let the product reveal itself', body: 'Show one surface first. Everything else appears when it’s needed.', time: '2h' },
      { title: 'A welcome that only plays once', body: 'Quiet, short, skippable. Never again after that.', time: '2d' },
    ],
    references: [
      { title: 'Things', domain: 'culturedcode.com', note: 'First launch' },
      { title: 'Arc', domain: 'arc.net', note: 'Progressive disclosure' },
      { title: 'On calm technology', domain: 'calmtech.com', note: 'Principles' },
    ],
    activity: [
      { time: '2h', text: 'You asked how onboarding should work' },
      { time: 'Yesterday', text: 'A deadline was found — Thursday' },
      { time: 'Last week', text: 'This project grew out of a question' },
    ],
  },
  {
    slug: 'reading-notes',
    name: 'Reading notes',
    line: 'Highlights and loose quotes from books in progress.',
    touched: '3 days ago',
    counts: { thoughts: 14, tasks: 0, references: 11 },
    overview:
      'A quieter context. Mostly quotes, a few half-thoughts about them, and a recurring interest in how tools shape attention.',
    chains: [
      [
        { kind: 'reference', text: 'Four Thousand Weeks' },
        { kind: 'note', text: 'finitude as a design constraint' },
        { kind: 'idea', text: 'Thoughts that fade if untouched' },
      ],
    ],
    tasks: [],
    ideas: [{ title: 'Thoughts that fade if untouched', body: 'Let the tangle forget things, gently.', time: '3d' }],
    references: [
      { title: 'Four Thousand Weeks', domain: 'oliverburkeman.com', note: 'Book' },
      { title: 'The shape of a good inbox', domain: 'craigmod.com', note: 'Essay' },
    ],
    activity: [{ time: '3d', text: 'You added a quote and a thought about it' }],
  },
]

/* ───────────────────────────── Ideas ───────────────────────────── */

export const ideas = [
  {
    title: 'An AI research assistant for companies',
    body: 'Paste a company name, get a briefing worth reading. Not a report — a page.',
    circled: 4,
    first: 'Last Tuesday',
    project: undefined as string | undefined,
  },
  {
    title: 'The inbox should be the home screen',
    body: 'Capture is the first thing you see. Everything else is somewhere you go.',
    circled: 3,
    first: 'Two weeks ago',
    project: 'Vercel side project',
  },
  {
    title: 'Thoughts that fade if you never touch them',
    body: 'A tangle that gently forgets. Things you care about stay sharp.',
    circled: 2,
    first: 'A month ago',
    project: 'Reading notes',
  },
  {
    title: 'A reading list that reads you back',
    body: 'It notices which saved things you actually return to.',
    circled: 2,
    first: 'Last week',
    project: undefined,
  },
  {
    title: 'A welcome that only plays once',
    body: 'Quiet, short, skippable. Never again after that.',
    circled: 1,
    first: '2 days ago',
    project: 'Onboarding',
  },
]

export const people = [
  { name: 'Max', note: 'API architecture' },
  { name: 'Priya', note: 'Design review on Friday' },
]
