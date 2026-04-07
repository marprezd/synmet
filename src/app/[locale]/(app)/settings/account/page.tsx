import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function AccountPage() {
  const session = await auth()
  const t = await getTranslations('breadcrumb')

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
