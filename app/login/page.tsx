'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { TangleMark } from '@/components/brand/mark'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-xl bg-background/50 px-4 py-3 text-[15px] text-foreground outline-none ring-1 ring-border placeholder:text-muted-foreground/60 transition-shadow focus:ring-foreground/20'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-[360px]">
        <div className="mb-8 flex flex-col items-center gap-3">
          <TangleMark className="size-8 text-foreground" />
          <div className="text-center">
            <h1 className="text-[22px] font-light tracking-tight">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your Tangle</p>
          </div>
        </div>

        <div className="capture-wrap relative">
          <div className="capture-glow" aria-hidden="true" />
          <div className="capture px-6 py-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                />
              </div>

              {error ? <p className="text-[13px] text-destructive">{error}</p> : null}

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'mt-1 w-full rounded-[14px] bg-primary px-4 py-3 text-[15px] font-medium text-primary-foreground transition-opacity',
                  loading ? 'opacity-50' : 'hover:opacity-90',
                )}
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-5 text-center text-[13px] text-muted-foreground">
          {"Don't have an account? "}
          <Link href="/signup" className="text-foreground underline-offset-4 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
