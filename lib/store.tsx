'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialThoughts, type Thought } from './data'

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
  const [thoughts, setThoughts] = useState<Thought[]>(initialThoughts)
  const [pinned, setPinned] = useState<Set<string>>(() => new Set())
  const [done, setDone] = useState<Set<string>>(() => new Set())
  const [organised, setOrganised] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [pendingCapture, setPendingCapture] = useState(false)

  const addThought = useCallback((t: Thought) => setThoughts((prev) => [t, ...prev]), [])
  const removeThought = useCallback(
    (id: string) => setThoughts((prev) => prev.filter((t) => t.id !== id)),
    [],
  )
  const togglePin = useCallback((id: string) => setPinned((prev) => toggleIn(prev, id)), [])
  const toggleDone = useCallback((id: string) => setDone((prev) => toggleIn(prev, id)), [])

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
