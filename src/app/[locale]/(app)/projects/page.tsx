import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'

export default async function ProjectsPage() {
  const session = await auth()
  const t = await getTranslations('breadcrumb')

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <h1 className="font-bold text-3xl">{t('projects')}</h1>
        <div className="mt-8 p-12 border-2 border-border border-dashed rounded-lg text-muted-foreground text-center">
          <h3 className="font-medium text-lg">TODO</h3>
          <p className="mt-2">Projects functionality will be added in future iterations.</p>
        </div>
      </div>
    </div>
  )
}
