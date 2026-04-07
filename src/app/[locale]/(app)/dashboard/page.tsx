import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function WorkspacePage() {
  const session = await auth()
  const t = await getTranslations('dashboard')

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
