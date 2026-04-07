import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function ProfilePage() {
  const session = await auth()
  const t = await getTranslations('breadcrumb')

  if (!session) {
    redirect('/auth/signin')
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
