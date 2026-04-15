'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const t = useTranslations('dashboard')
  const router = useRouter()
  const params = useParams()
  const locale = (params?.locale as string) ?? 'en'

  useEffect(() => {
    // Redirect immediately if unauthenticated, don't render anything
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/signin`)
    }
  }, [locale, router, status])

  // Only render content if authenticated
  if (status !== 'authenticated') {
    return <div />
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <h1 className="font-bold text-3xl">{t('title')}</h1>
        <p>
          {t('welcomeMessage', { name: session?.user?.name || session?.user?.email || 'User' })}
        </p>
      </div>
    </div>
  )
}
