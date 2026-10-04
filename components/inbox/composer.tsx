'use client'

import { useId, useRef, useState } from 'react'
import { ArrowUp, Paperclip, X } from 'lucide-react'
import type { InboxItem } from '@/lib/data'
import { createItem, detectKind, extractDomain, kindLabel } from '@/lib/detect'
import { cn } from '@/lib/utils'
import { Kbd, KindIcon } from '@/components/primitives'

const MAX_HEIGHT = 280

export function Composer({ onCapture }: { onCapture: (item: InboxItem) => void }) {
  const [text, setText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const hintId = useId()

  const trimmed = text.trim()
  const canSubmit = trimmed.length > 0 || images.length > 0
  const kind = canSubmit ? detectKind(trimmed, images.length > 0) : null
  const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)|^([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i)?.[0]

  function resize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`
  }

  function addFiles(files: FileList | File[]) {
    const urls = Array.from(files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, 6)
      .map((file) => URL.createObjectURL(file))
    if (urls.length) setImages((prev) => [...prev, ...urls].slice(0, 6))
  }

  function submit() {
    if (!canSubmit) return
    onCapture(createItem(trimmed, images))
    setText('')
    setImages([])
    requestAnimationFrame(() => {
      resize()
      textareaRef.current?.focus()
    })
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragging(false)
        addFiles(e.dataTransfer.files)
      }}
      className={cn(
        'group/composer relative rounded-lg border bg-card transition-[border-color,box-shadow] duration-200',
        'border-border shadow-[0_1px_0_oklch(0.2_0.006_70/0.03)]',
        'focus-within:border-border-strong focus-within:shadow-[0_1px_0_oklch(0.2_0.006_70/0.04),0_12px_32px_-20px_oklch(0.2_0.006_70/0.25)]',
        dragging && 'border-cobalt',
      )}
    >
      <label htmlFor="capture" className="sr-only">
        Capture a thought
      </label>
      <textarea
        id="capture"
        ref={textareaRef}
        value={text}
        rows={3}
        onChange={(e) => {
          setText(e.target.value)
          resize()
        }}
        onKeyDown={onKeyDown}
        onPaste={(e) => {
          if (e.clipboardData.files.length) addFiles(e.clipboardData.files)
        }}
        aria-describedby={hintId}
        placeholder="Drop a thought, link, reminder, idea, or anything else…"
        className="block min-h-28 w-full resize-none bg-transparent px-5 pb-2 pt-5 text-[16px] leading-relaxed tracking-[-0.005em] text-foreground outline-none placeholder:text-muted-foreground/60 focus-visible:outline-none md:px-6 md:pt-6 md:text-[17px]"
      />

      {images.length ? (
        <ul className="flex flex-wrap gap-2 px-5 pb-3 md:px-6" aria-label="Attached images">
          {images.map((src) => (
            <li key={src} className="group/img relative animate-in fade-in zoom-in-95 duration-200">
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URLs */}
              <img src={src} alt="Attachment preview" className="size-16 rounded-md border border-border object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((s) => s !== src))}
                aria-label="Remove image"
                className="absolute -right-1.5 -top-1.5 inline-flex size-5 items-center justify-center rounded-full border border-border bg-card text-muted-foreground opacity-0 transition-opacity hover:text-foreground focus-visible:opacity-100 group-hover/img:opacity-100"
              >
                <X className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="flex items-center gap-3 border-t border-border px-3 py-2 md:px-4">
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          tabIndex={-1}
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Paperclip className="size-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span className="hidden sm:inline">Attach</span>
          <span className="sr-only sm:hidden">Attach image</span>
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-1.5 text-[12px] text-muted-foreground" aria-live="polite">
          {kind ? (
            <span key={kind} className="flex min-w-0 animate-in fade-in items-center gap-1 duration-200">
              <KindIcon kind={kind} className="size-4" />
              <span className="text-foreground">{kindLabel[kind]}</span>
              {kind === 'link' && urlMatch ? (
                <span className="truncate font-mono text-[11px]">· {extractDomain(urlMatch)}</span>
              ) : null}
            </span>
          ) : null}
        </div>

        <span id={hintId} className="hidden items-center gap-1.5 text-[12px] text-muted-foreground md:flex">
          <Kbd>⌘</Kbd>
          <Kbd>↵</Kbd>
          <span className="sr-only">to capture</span>
        </span>

        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-foreground px-3 text-[13px] font-medium text-background transition-[opacity,background-color] duration-150 hover:bg-foreground/90 disabled:opacity-25"
        >
          <span className="hidden sm:inline">Capture</span>
          <ArrowUp className="size-3.5 sm:hidden" aria-hidden="true" />
          <span className="sr-only sm:hidden">Capture</span>
        </button>
      </div>
    </form>
  )
}
