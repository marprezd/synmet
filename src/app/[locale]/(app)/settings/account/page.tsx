'use client'

import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import { redirect } from 'next/navigation'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const t = useTranslations('breadcrumb')

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="space-y-4">
        <h2 className="font-bold text-foreground text-3xl tracking-tight">
          {t('account')}
        </h2>
        <p className="text-muted-foreground-1">
          Manage your account settings and preferences.
        </p>
      </div>
      <div className="mt-8 p-12 border-2 border-border border-dashed rounded-lg text-muted-foreground text-center">
        <h3 className="font-medium text-lg">TODO</h3>
        <p className="mt-2">Account functionality will be added in future iterations.</p>
      </div>
    </div>
  )
}
