import type { Metadata } from 'next'
import { Albert_Sans, JetBrains_Mono, Darker_Grotesque } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Agentation } from 'agentation'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const albertSans = Albert_Sans({ subsets: ["latin"], variable: "--font-albert-sans" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" })
const darkerGrotesque = Darker_Grotesque({ subsets: ["latin"], variable: "--font-darker-grotesque" })

export const metadata: Metadata = {
  title: 'Gage Minamoto',
  description: 'Designer building everyday products. Growing Hawai\'i\'s local design community. Building Mizen.',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ colorScheme: "light dark" }}>
      <body className={`${albertSans.variable} ${jetbrainsMono.variable} ${darkerGrotesque.variable} font-sans antialiased`}>
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
          {children}
        </ThemeProvider>
        <Analytics />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}
