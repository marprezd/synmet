import { getTranslations } from 'next-intl/server'
import { ApiKeysContainer } from '@/components/api-keys/api-keys-container'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'API Keys | Synmet',
  description: 'Manage your API keys for Synmet plugins',
}

export default async function IntegrationsPage() {
  const session = await auth()
  const t = await getTranslations('apiKeys')

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: (session.user as any).id },
    select: {
      id: true,
      name: true,
      key: false,
      status: true,
      lastUsedAt: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-bold text-3xl tracking-tight">{t('title')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Create Key Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-xl">{t('yourApiKeys')}</h2>
          <p className="mt-1 text-muted-foreground text-sm">
            {t('key', { count: apiKeys.length })}
          </p>
        </div>
      </div>

      {/* Keys Container (handles create and list) */}
      <ApiKeysContainer
        initialKeys={apiKeys as any[]}
      />
    </div>
  )
}
