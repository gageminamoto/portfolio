import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Agentation } from 'agentation'
import { DialRoot } from 'dialkit'
import 'dialkit/styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { GradientWordProvider } from '@/components/gradient-word-context'
import { GradientOverlay } from '@/components/gradient-overlay'
import { CommandKProvider } from '@/contexts/CommandKContext'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })

export const metadata: Metadata = {
  title: 'Gage Minamoto',
  description: 'Designer building everyday products. Growing Hawai\'i\'s local design community. Building Mizen.',
  icons: {
    icon: [
      { url: '/favicon-light.svg?v=3', media: '(prefers-color-scheme: light)', type: 'image/svg+xml' },
      { url: '/favicon-dark.svg?v=3', media: '(prefers-color-scheme: dark)', type: 'image/svg+xml' },
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png?v=3', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png?v=3',
    other: [
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#252525" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: "light dark" }}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} relative font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background focus:outline-none"
        >
          Skip to content
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GradientWordProvider>
            <CommandKProvider>
              <GradientOverlay />
              <div
                className="pointer-events-none fixed inset-x-0 top-0 z-20 h-16 bg-gradient-to-b from-background via-background/35 to-transparent md:hidden"
                aria-hidden="true"
              />
              {children}
            </CommandKProvider>
          </GradientWordProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "development" && (
          <Agentation endpoint="http://localhost:4747" />
        )}
        {process.env.NODE_ENV === "development" && <DialRoot />}
      </body>
    </html>
  )
}
