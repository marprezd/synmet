'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProfilePage() {
  // eslint-disable-next-line unused-imports/no-unused-vars
  const { data: session, status } = useSession()
  const t = useTranslations('breadcrumb')
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
    <div className="flex flex-col space-y-2">
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-3xl tracking-tight">
          {t('profile')}
        </h2>
        <p className="text-muted-foreground-1">
          Manage your public profile and visibility.
        </p>
      </div>
      <div className="mt-8 p-12 border-2 border-border border-dashed rounded-lg text-muted-foreground text-center">
        <h3 className="font-medium text-lg">TODO</h3>
        <p className="mt-2">Profile functionality will be added in future iterations.</p>
      </div>
    </div>
  )
}
