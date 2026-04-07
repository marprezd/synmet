'use client'

import { IconLayoutSidebar } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
import { SearchForm } from '@/components/app-search'
import { ModeToggle } from '@/components/mode-toggle'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useSidebar } from '@/components/ui/sidebar'
import { Link, usePathname } from '@/i18n/navigation'
import LanguageSelector from './language-selector'

/**
 * Humanizes a URL segment (e.g. "api-keys" → "Api keys") for fallback when no i18n key exists.
 */
const HUMANIZE_SEGMENT_REGEX = /\b\w/g
const HYPHEN_REGEX = /-/g

function humanizeSegment(segment: string): string {
  return segment
    .replace(HYPHEN_REGEX, ' ')
    .replace(HUMANIZE_SEGMENT_REGEX, c => c.toUpperCase())
}

export function AppBreadcrumb() {
  const pathname = usePathname()
  const t = useTranslations('breadcrumb')

  const items = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)

    if (segments.length === 0) {
      return [{ href: '/', label: t('home'), isPage: true }]
    }

    const result: { href: string, label: string, isPage: boolean }[] = []

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]!
      const href = `/${segments.slice(0, i + 1).join('/')}`
      const translated = t(segment)
      const label
        = translated !== segment ? translated : humanizeSegment(segment)
      result.push({
        href,
        label,
        isPage: i === segments.length - 1,
      })
    }

    return result
  }, [pathname, t])

  const isRoot = pathname === '/'

  return (
    <Breadcrumb className="hidden sm:block">
      <BreadcrumbList>
        {isRoot
          ? (
              <BreadcrumbItem>
                <BreadcrumbPage>{t('home')}</BreadcrumbPage>
              </BreadcrumbItem>
            )
          : (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    render={<Link href="/">{t('home')}</Link>}
                  />
                </BreadcrumbItem>
                {items.map(item => (
                  <span key={item.href} className="contents">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {item.isPage
                        ? (
                            <BreadcrumbPage>{item.label}</BreadcrumbPage>
                          )
                        : (
                            <BreadcrumbLink
                              render={(
                                <Link href={item.href as Parameters<typeof Link>[0]['href']}>
                                  {item.label}
                                </Link>
                              )}
                            />
                          )}
                    </BreadcrumbItem>
                  </span>
                ))}
              </>
            )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()

  return (
    <header className="top-0 z-50 sticky flex items-center bg-background/70 backdrop-blur-sm border-b w-full">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="w-8 h-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <IconLayoutSidebar className="size-5" />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-full" />
        <AppBreadcrumb />
        <SearchForm className="sm:ml-auto w-full sm:w-auto" />
        <ModeToggle />
        <LanguageSelector />
      </div>
    </header>
  )
}
