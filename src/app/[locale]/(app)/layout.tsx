// src/app/[locale]/(app)/layout.tsx
import { hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { SiteHeader } from '@/components/app-header'
import AppSidebar from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { routing } from '@/i18n/routing'

interface SidebarLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function SidebarLayout({
  children,
  params,
}: SidebarLayoutProps) {
  // Ensure that the incoming `locale` is valid
  const locale = (await params).locale

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  // Enable static rendering
  setRequestLocale(locale)

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <main className="flex flex-col flex-1 gap-4 p-4">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
