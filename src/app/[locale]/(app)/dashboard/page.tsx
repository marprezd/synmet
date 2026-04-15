'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'

export default function WorkspacePage() {
  const { data: session, status } = useSession()
  const t = useTranslations('dashboard')

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <h1 className="font-bold text-3xl">{t('title')}</h1>
        <p>
          {t('welcomeMessage', { name: session.user?.name || session.user?.email || 'User' })}
        </p>
      </div>
    </div>
  )
}
