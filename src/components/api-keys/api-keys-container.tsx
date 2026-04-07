'use client'

import { useState } from 'react'
import { ApiKeysList } from './api-keys-list'
import { CreateApiKey } from './create-api-key'

interface ApiKey {
  id: string
  name: string
  key?: string
  status: 'active' | 'revoked' | 'expired'
  lastUsedAt?: Date | null
  createdAt: Date
  expiresAt?: Date | null
}

interface ApiKeysContainerProps {
  initialKeys: ApiKey[]
}

export function ApiKeysContainer({ initialKeys }: ApiKeysContainerProps) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
  const [newlyCreatedKeyId, setNewlyCreatedKeyId] = useState<string | null>(null)

  const handleKeyCreated = (apiKey: any) => {
    // Convert to ApiKey type (add correct status type)
    const newApiKey: ApiKey = {
      ...apiKey,
      status: (apiKey.status || 'active') as 'active' | 'revoked' | 'expired',
    }

    // Add the key with the full `key` field to the beginning of the list
    setKeys(prev => [newApiKey, ...prev])
    setNewlyCreatedKeyId(apiKey.id)

    // Clear the `key` field after 20 seconds
    const timer = setTimeout(() => {
      setKeys(prev =>
        prev.map(k =>
          k.id === apiKey.id ? { ...k, key: undefined } : k,
        ),
      )
      setNewlyCreatedKeyId(null)
    }, 20000)

    return () => clearTimeout(timer)
  }

  return (
    <>
      <CreateApiKey onKeyCreated={handleKeyCreated} />
      <ApiKeysList
        keys={keys}
        newlyCreatedKeyId={newlyCreatedKeyId}
      />
    </>
  )
}
