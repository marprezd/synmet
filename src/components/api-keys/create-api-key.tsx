'use client'

import { CheckIcon, CopyIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

interface NewApiKey {
  id: string
  key: string
  name: string
  status: string
  createdAt: Date
}

interface CreateApiKeyProps {
  onKeyCreated?: (apiKey: NewApiKey) => void
}

export function CreateApiKey({ onKeyCreated }: CreateApiKeyProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const [newKey, setNewKey] = useState<NewApiKey | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const t = useTranslations('apiKeys')

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (!name.trim()) {
        throw new Error(t('nameRequired'))
      }

      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
        }),
      })

      if (!response.ok) {
        const data = await response.json() as any
        throw new Error(data.message || t('createError'))
      }

      const data = await response.json() as any
      setNewKey(data.data)
      setName('')
      setExpiresAt('')
      // Pass the newly created key to the parent callback
      onKeyCreated?.(data.data)
    }
    catch (err) {
      setError(err instanceof Error ? err.message : t('errorCreatingApiKey'))
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newKey!.key)
      setCopied(true)
      setTimeout(setCopied, 2000, false)
    }
    catch {
      setError(t('copyError'))
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={(
        <Button className="gap-1">
          <PlusIcon className="size-4" />
          {t('newApiKey')}
        </Button>
      )}
      />

      <DialogContent className="max-w-md">
        {newKey
          ? (
              <>
                <DialogHeader>
                  <DialogTitle>{t('apiKeyCreated')}</DialogTitle>
                  <DialogDescription>
                    {t('saveThisKeyInSafePlace')}
                  </DialogDescription>
                </DialogHeader>

                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="font-medium text-foreground text-sm">{t('yourApiKey')}</label>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 bg-background px-3 py-2 border rounded-lg overflow-x-auto font-mono text-xs">
                            {newKey.key}
                          </code>
                          <Button
                            variant="outline"
                            size="icon-sm"
                            onClick={handleCopy}
                            title={copied ? t('copied') : t('copy')}
                          >
                            {copied
                              ? (
                                  <CheckIcon className="size-4" />
                                )
                              : (
                                  <CopyIcon className="size-4" />
                                )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <p className="text-muted-foreground">
                          <strong>{t('nameKey')}</strong>
                          {' '}
                          {newKey.name}
                        </p>
                        <p className="text-muted-foreground">
                          <strong>{t('createdKey')}</strong>
                          {' '}
                          {new Date(newKey.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <Button
                        onClick={() => {
                          setNewKey(null)
                          setIsOpen(false)
                        }}
                        className="w-full"
                      >
                        {t('done')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-muted-foreground text-xs">
                  {t('storeKey')}
                </p>
              </>
            )
          : (
              <>
                <DialogHeader>
                  <DialogTitle>{t('createKey')}</DialogTitle>
                  <DialogDescription>
                    {t('generateNewApiKey')}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleCreate} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded-lg text-red-700 dark:text-red-200 text-sm">
                      {error}
                    </div>
                  )}

                  <Field>
                    <FieldLabel htmlFor="key-name">{t('keyName')}</FieldLabel>
                    <FieldDescription>
                      {t('keyNameDescription')}
                    </FieldDescription>
                    <FieldContent>
                      <Input
                        id="key-name"
                        placeholder={t('keyNamePlaceholder')}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        disabled={isLoading}
                        maxLength={100}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="expires-at">{t('expiresAt')}</FieldLabel>
                    <FieldDescription>
                      {t('expiresAtDescription')}
                    </FieldDescription>
                    <FieldContent>
                      <Input
                        id="expires-at"
                        type="datetime-local"
                        value={expiresAt}
                        onChange={e => setExpiresAt(e.target.value)}
                        disabled={isLoading}
                      />
                    </FieldContent>
                  </Field>

                  <div className="flex gap-2 pt-4 border-t">
                    <DialogClose render={(
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        className="flex-1"
                      >
                        {t('cancel')}
                      </Button>
                    )}
                    />
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? t('creating') : t('created')}
                    </Button>
                  </div>
                </form>
              </>
            )}
      </DialogContent>
    </Dialog>
  )
}
