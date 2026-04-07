import type { Metadata } from 'next'
import { getMessages } from 'next-intl/server'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/providers'

const jetbrainsSans = localFont({
  src: '../../public/fonts/JetBrainsMono.woff2',
  variable: '--font-jetbrain-sans',
  weight: '100 900',
  display: 'swap',
  preload: true,
})

const jetbrainsMono = localFont({
  src: '../../public/fonts/JetBrainsMono.woff2',
  variable: '--font-jetbrain-mono',
  weight: '100 900',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Synmet | Development Activity Tracking',
  description: 'Self-hosted development activity tracking with privacy first',
  keywords: ['tracking', 'metrics', 'productivity', 'development', 'self-hosted'],
  authors: [{ name: 'Synmet' }],
  creator: 'Synmet',
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://synmet.dev',
    siteName: 'Synmet',
  },
}

export default async function BaseLayout({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode
  locale: string
}>) {
  const messages = await getMessages()
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${jetbrainsSans.variable} ${jetbrainsMono.variable}`}
    >
      <body
        className="antialiased scroll-smooth"
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          messages={messages}
          locale={locale}
        >
          <div className="flex flex-col">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
