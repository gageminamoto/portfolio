import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import 'dialkit/styles.css'
import { ThemeProvider } from '@/components/theme-provider'
import { AppearanceControl } from '@/components/appearance-control'
import { DevPanels } from '@/components/dev-panels'
import { GradientWordProvider } from '@/components/gradient-word-context'
import { GradientOverlay } from '@/components/gradient-overlay'
import { CommandKProvider } from '@/contexts/CommandKContext'
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, TWITTER_HANDLE } from '@/lib/site'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })
const enableAgentation = process.env.NEXT_PUBLIC_ENABLE_AGENTATION !== "false"

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'en_US',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: TWITTER_HANDLE,
  },
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
  // Let the page draw under the status bar on notched phones; layouts pad
  // themselves with env(safe-area-inset-*) so content stays clear of it.
  viewportFit: "cover",
  themeColor: [
    // On phones, match the browser chrome to the page background so the top
    // edge reads as one surface. Desktop keeps the original colors below.
    { media: "(max-width: 767px) and (prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(max-width: 767px) and (prefers-color-scheme: dark)", color: "#0a0a0a" },
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
          data-no-markdown
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
              {children}
              <AppearanceControl />
              <script src="https://inflight.co/widget.js" data-org="yykr0g17" async></script>
            </CommandKProvider>
          </GradientWordProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        {process.env.NODE_ENV === "development" && (
          <DevPanels agentation={enableAgentation} />
        )}
      </body>
    </html>
  )
}
