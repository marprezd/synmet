'use client'

import type { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'
import { NextIntlClientProvider } from 'next-intl'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ThemeProvider({
  children,
  messages,
  locale,
  ...props
}: React.ComponentProps<typeof NextThemesProvider> & {
  children: ReactNode
  messages: Record<string, any>
  locale: string
}) {
  const timeZone = 'America/Bogota'

  return (
    <SessionProvider>
      <NextThemesProvider {...props}>
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone={timeZone}
        >
          {children}
        </NextIntlClientProvider>
      </NextThemesProvider>
    </SessionProvider>
  )
}
