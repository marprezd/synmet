'use client'

import { CheckIcon, CopyIcon, Trash2Icon } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface ApiKey {
  id: string
  name: string
  key?: string
  status: 'active' | 'revoked' | 'expired'
  lastUsedAt?: Date | null
  createdAt: Date
  expiresAt?: Date | null
}

interface ApiKeysListProps {
  keys: ApiKey[]
  newlyCreatedKeyId?: string | null
}

export function ApiKeysList({ keys, newlyCreatedKeyId }: ApiKeysListProps) {
  const [displayKeys, setDisplayKeys] = useState<ApiKey[]>(keys)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const t = useTranslations('apiKeys')
  const format = useFormatter()

  // Synchronize keys when they change
  useEffect(() => {
    setDisplayKeys(keys)
  }, [keys])

  const handleDelete = async (id: string) => {
    if (deleteConfirm !== id) {
      setDeleteConfirm(id)
      return
    }

    setDeletingId(id)
    setIsLoading(true)
    try {
      const response = await fetch(`/api/api-keys/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(t('deleteError'))
      }

      setDisplayKeys(displayKeys.filter(key => key.id !== id))
      setDeleteConfirm(null)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : t('deleteError'))
    }
    finally {
      setIsLoading(false)
      setDeletingId(null)
    }
  }

  const handleCopy = async (key: string, id: string) => {
    try {
      await navigator.clipboard.writeText(key)
      setCopiedId(id)
      setTimeout(setCopiedId, 2000, null)
    }
    catch {
      setError(t('copyError'))
    }
  }

  const formatDate = (date: Date | null | undefined) => {
    if (!date)
      return '-'
    return format.dateTime(new Date(date), {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'revoked':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  if (displayKeys.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="py-8 text-center">
            <p className="mb-4 text-muted-foreground">{t('noApiKeys')}</p>
            <p className="mb-6 text-muted-foreground text-sm">
              {t('createFirstKey')}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg text-red-700 dark:text-red-200 text-sm">
          {error}
        </div>
      )}

      <div className="gap-4 grid">
        {displayKeys.map(apiKey => (
          <Card key={apiKey.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{apiKey.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {t('createSuccess')}
                    {' '}
                    {formatDate(apiKey.createdAt)}
                  </CardDescription>
                </div>
                <Badge
                  variant={apiKey.status === 'active' ? 'default' : 'destructive'}
                  className={getStatusColor(apiKey.status)}
                >
                  {t(`statusApi.${apiKey.status}`)}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Key Preview */}
              <div className="space-y-2.5">
                <label className="font-medium text-sm">{t('keyPreview')}</label>
                <div className="flex items-center gap-2 mt-1.5">
                  <code className={`flex-1 px-3 py-2 rounded-lg overflow-x-auto font-mono text-xs ${
                    apiKey.key
                      ? 'bg-amber-50 dark:bg-amber-950 text-amber-900 dark:text-amber-50'
                      : 'bg-muted text-muted-foreground'
                  }`}
                  >
                    {apiKey.key
                      ? (
                          <>
                            {apiKey.key.substring(0, 10)}
                            {'•'.repeat(20)}
                            {apiKey.key.substring(apiKey.key.length - 10)}
                          </>
                        )
                      : (
                          <span>••••••••••••••••••••••••••••••••</span>
                        )}
                  </code>
                  {apiKey.key && (
                    <Button
                      variant="outline"
                      size="icon-sm"
                      onClick={() => handleCopy(apiKey.key!, apiKey.id)}
                      disabled={isLoading}
                      title={copiedId === apiKey.id ? t('copySuccess') : t('copyKey')}
                    >
                      {copiedId === apiKey.id
                        ? (
                            <CheckIcon className="size-4 text-green-600" />
                          )
                        : (
                            <CopyIcon className="size-4" />
                          )}
                    </Button>
                  )}
                </div>
                {newlyCreatedKeyId === apiKey.id && (
                  <p className="text-amber-700 dark:text-amber-300 text-xs">
                    ✓
                    {' '}
                    {t('keyVisibleFor20Seconds')}
                  </p>
                )}
              </div>

              {/* Details */}
              <div className="gap-4 grid grid-cols-2 text-sm">
                <div>
                  <p className="mb-1 text-muted-foreground text-xs">{t('lastUsed')}</p>
                  <p className="font-mono text-xs">{formatDate(apiKey.lastUsedAt)}</p>
                </div>
                {apiKey.expiresAt && (
                  <div>
                    <p className="mb-1 text-muted-foreground text-xs">{t('expires')}</p>
                    <p className="font-mono text-xs">{formatDate(apiKey.expiresAt)}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t">
                {deletingId === apiKey.id
                  ? (
                      <Button
                        disabled
                        size="sm"
                        className="gap-1"
                      >
                        <span className="inline-block mr-1 animate-spin">⏳</span>
                        {t('deleting')}
                      </Button>
                    )
                  : deleteConfirm === apiKey.id
                    ? (
                        <>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(apiKey.id)}
                            disabled={isLoading}
                            className="gap-1"
                          >
                            {t('confirmDelete')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteConfirm(null)}
                            disabled={isLoading}
                          >
                            {t('cancel')}
                          </Button>
                        </>
                      )
                    : (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(apiKey.id)}
                          disabled={isLoading}
                          className="gap-1"
                        >
                          <Trash2Icon className="size-4" />
                          {t('delete')}
                        </Button>
                      )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
