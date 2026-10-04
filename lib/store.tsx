'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { initialItems, projectTasks, type InboxItem, type Task } from './data'

type Store = {
  items: InboxItem[]
  addItem: (item: InboxItem) => void
  removeItem: (id: string) => void
  fileItems: (assignments: Record<string, string>) => void
  pinned: Set<string>
  togglePin: (id: string) => void
  tasks: Task[]
  toggleTask: (id: string) => void
  addTask: (title: string) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
}

const StoreContext = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InboxItem[]>(initialItems)
  const [pinned, setPinned] = useState<Set<string>>(() => new Set())
  const [tasks, setTasks] = useState<Task[]>(projectTasks)
  const [searchOpen, setSearchOpen] = useState(false)

  const addItem = useCallback((item: InboxItem) => setItems((prev) => [item, ...prev]), [])
  const removeItem = useCallback(
    (id: string) => setItems((prev) => prev.filter((item) => item.id !== id)),
    [],
  )
  const fileItems = useCallback(
    (assignments: Record<string, string>) =>
      setItems((prev) =>
        prev.map((item) =>
          assignments[item.id] ? { ...item, project: assignments[item.id] } : item,
        ),
      ),
    [],
  )
  const togglePin = useCallback(
    (id: string) =>
      setPinned((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      }),
    [],
  )
  const toggleTask = useCallback(
    (id: string) =>
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))),
    [],
  )
  const addTask = useCallback(
    (title: string) =>
      setTasks((prev) => [...prev, { id: `t-${Date.now()}`, title, done: false }]),
    [],
  )

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      fileItems,
      pinned,
      togglePin,
      tasks,
      toggleTask,
      addTask,
      searchOpen,
      setSearchOpen,
    }),
    [items, addItem, removeItem, fileItems, pinned, togglePin, tasks, toggleTask, addTask, searchOpen],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
