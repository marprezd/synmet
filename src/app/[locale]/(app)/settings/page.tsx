import { IconCheck } from '@tabler/icons-react'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import CloudImage from '@/components/cloud-image'
import { Separator } from '@/components/ui/separator'
import { Link } from '@/i18n/navigation'
import { auth } from '@/lib/auth'

export const metadata = {
  title: 'Management | Synmet',
  description: 'Manage your integrations for Synmet plugins',
}

export default async function page() {
  const session = await auth()
  const t = await getTranslations('apiKeys')

  if (!session?.user || !(session.user as any).id) {
    redirect('/auth/signin')
  }

  const items = [
    {
      title: t('keyPointsApi.createApi.title'),
    },
    {
      title: t('keyPointsApi.copyApi.title'),
    },
    {
      title: t('keyPointsApi.useApi.title'),
    },
    {
      title: t('keyPointsApi.monitorApi.title'),
    },
    {
      title: t('keyPointsApi.revokeApi.title'),
    },
  ]
  return (
    <div className="flex flex-col space-y-2">
      <div className="md:items-center md:gap-12 xl:gap-32 md:grid md:grid-cols-2">
        <div>
          <CloudImage
            alt="API Key Management Illustration"
            width={2000}
            height={2000}
            sizes="100vw"
            src="synmet/settings_ofeo4e.png"
            style={{
              width: '100%',
              height: 'auto',
            }}
            loading="eager"
            quality="auto"
          />
        </div>
        <div className="mt-5 sm:mt-10 lg:mt-0">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2 md:space-y-4">
              <h2 className="font-bold text-foreground text-3xl lg:text-4xl tracking-tight">
                {t('title')}
              </h2>
              <p className="text-muted-foreground-1">
                {t('description')}
              </p>
            </div>
            <ul className="space-y-2 sm:space-y-2.5">
              {items.map((item, index) => (
                <li key={index} className="flex gap-x-3">
                  <span className="flex justify-center items-center mt-0.5 text-blue-600 dark:text-blue-400 shrink-0">
                    <IconCheck className="size-5 shrink-0" />
                  </span>
                  <div className="grow">
                    <span className="text-muted-foreground text-xs sm:text-sm">{item.title}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Separator className="my-8" />
      <div className="flex justify-center items-center gap-2 md:gap-4 mx-auto max-w-3xl text-sm">
        <div className="flex flex-col gap-1 w-full md:w-[70%]">
          <span className="font-medium">{t('howToUse')}</span>
          <span className="text-muted-foreground text-xs">
            {t('apiKeysDescription')}
          </span>
        </div>
        <Separator orientation="vertical" />
        <div className="flex flex-col gap-1">
          <Link
            href="/settings/api-keys"
            className="inline-flex items-center gap-x-2 bg-sky-100 hover:bg-sky-200 focus:bg-sky-200 dark:bg-sky-800/30 dark:hover:bg-sky-500/20 dark:focus:bg-sky-500/20 disabled:opacity-50 px-4 py-3 border border-transparent rounded-xl focus:outline-hidden font-medium text-sky-800 dark:text-sky-500 text-sm disabled:pointer-events-none"
          >
            {t('manageApiKeys')}
          </Link>
        </div>
      </div>
      <Separator className="my-8" />
    </div>
  )
}
