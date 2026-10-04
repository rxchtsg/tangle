import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Instrument_Sans } from 'next/font/google'
import Script from 'next/script'
import { StoreProvider } from '@/lib/store'
import { AppShell } from '@/components/shell/app-shell'
import './globals.css'

const instrument = Instrument_Sans({ subsets: ['latin'], variable: '--font-instrument' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'Tangle — Let your thoughts get tangled.',
  description:
    'Tangle is a personal thinking space for associative, idea-heavy minds. Drop anything in — Tangle finds the thread later.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f4f3ef',
  width: 'device-width',
  initialScale: 1,
}

const welcomedScript = `try{if(localStorage.getItem('tangle.welcomed'))document.documentElement.setAttribute('data-welcomed','')}catch(e){document.documentElement.setAttribute('data-welcomed','')}`

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${instrument.variable} ${geistMono.variable} bg-background`}
    >
      <body className="antialiased">
        <Script id="tangle-welcomed" strategy="beforeInteractive">
          {welcomedScript}
        </Script>
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
