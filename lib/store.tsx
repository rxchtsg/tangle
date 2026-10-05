'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { type Thought, type ThoughtKind } from './data'
import { formatRelativeTime } from './time'

type ThoughtRow = {
  id: string
  content: string
  kind: ThoughtKind
  created_at: string
  pinned: boolean
  completed: boolean
}

function rowToThought(row: ThoughtRow): Thought {
  return {
    id: row.id,
    kind: row.kind,
    content: row.content,
    time: formatRelativeTime(row.created_at),
  }
}

type Store = {
  thoughts: Thought[]
  addThought: (thought: Thought) => void
  removeThought: (id: string) => void
  pinned: Set<string>
  togglePin: (id: string) => void
  done: Set<string>
  toggleDone: (id: string) => void
  organised: boolean
  setOrganised: (value: boolean) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  pendingCapture: boolean
  setPendingCapture: (value: boolean) => void
}

const StoreContext = createContext<Store | null>(null)

function toggleIn(set: Set<string>, id: string) {
  const next = new Set(set)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  return next
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [pinned, setPinned] = useState<Set<string>>(() => new Set())
  const [done, setDone] = useState<Set<string>>(() => new Set())
  const [organised, setOrganised] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [pendingCapture, setPendingCapture] = useState(false)

  useEffect(() => {
    fetch('/api/thoughts')
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: ThoughtRow[]) => {
        setThoughts(rows.map(rowToThought))
        setPinned(new Set(rows.filter((r) => r.pinned).map((r) => r.id)))
        setDone(new Set(rows.filter((r) => r.completed).map((r) => r.id)))
      })
      .catch(() => {})
  }, [])

  const addThought = useCallback((t: Thought) => {
    setThoughts((prev) => [t, ...prev])
    fetch('/api/thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: t.id, content: t.content, kind: t.kind }),
    })
      .then((r) => {
        if (!r.ok) setThoughts((prev) => prev.filter((x) => x.id !== t.id))
      })
      .catch(() => setThoughts((prev) => prev.filter((x) => x.id !== t.id)))
  }, [])

  const removeThought = useCallback((id: string) => {
    setThoughts((prev) => prev.filter((t) => t.id !== id))
    fetch(`/api/thoughts/${id}`, { method: 'DELETE' }).catch(() => {})
  }, [])

  const togglePin = useCallback((id: string) => {
    setPinned((prev) => {
      const next = toggleIn(prev, id)
      fetch(`/api/thoughts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinned: next.has(id) }),
      }).catch(() => {})
      return next
    })
  }, [])

  const toggleDone = useCallback((id: string) => {
    setDone((prev) => {
      const next = toggleIn(prev, id)
      fetch(`/api/thoughts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: next.has(id) }),
      }).catch(() => {})
      return next
    })
  }, [])

  const value = useMemo(
    () => ({
      thoughts,
      addThought,
      removeThought,
      pinned,
      togglePin,
      done,
      toggleDone,
      organised,
      setOrganised,
      searchOpen,
      setSearchOpen,
      pendingCapture,
      setPendingCapture,
    }),
    [thoughts, addThought, removeThought, pinned, togglePin, done, toggleDone, organised, searchOpen, pendingCapture],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
