'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/** The room everything lives in: ambient light that drifts, deepens and cools as you scroll. */
export function Environment() {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      const max = Math.max(1, root.scrollHeight - window.innerHeight)
      root.style.setProperty('--scroll', y.toFixed(0))
      root.style.setProperty('--depth', Math.min(1, y / max).toFixed(3))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  return (
    <>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="env-light env-light-a" />
        <div className="env-light env-light-b" />
        <div className="env-light env-light-c" />
        <div className="env-deep" />
        <div className="env-vignette" />
      </div>
      <div aria-hidden="true" className="env-grain" />
    </>
  )
}
