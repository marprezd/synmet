// User types
export interface UserProfile {
  id: string
  email?: string
  name?: string
  image?: string
  role: 'admin' | 'user' | 'developer'
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  user?: {
    id: string
    email?: string
    name?: string
    image?: string
  }
  expires: string
}

// Project types
export interface Project {
  id: string
  name: string
  slug: string
  description?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// API Key types
export interface ApiKey {
  id: string
  key: string
  name: string
  status: 'active' | 'revoked' | 'expired'
  userId: string
  lastUsedAt?: Date
  createdAt: Date
  expiresAt?: Date
}

// Heartbeat types
export interface Heartbeat {
  id: string
  userId: string
  projectId: string
  file: string
  language?: string
  lines?: number
  branch?: string
  duration: number // in seconds
  isDebugging: boolean
  isTesting: boolean
  timestamp: Date
}

// Metrics types
export interface DailyMetrics {
  id: string
  userId: string
  projectId?: string
  date: Date
  totalDuration: number // in seconds
  heartbeatCount: number
  languagesUsed: string[]
  filesModified: number
  createdAt: Date
  updatedAt: Date
}

export interface UserStats {
  totalCodingTime: number // in hours
  totalProjects: number
  totalHeartbeats: number
  averageDailyTime: number // in minutes
  topLanguages: Array<{ language: string, percentage: number }>
  currentStreak: number // in days
}

// Locale types
// export const SUPPORTED_LOCALES: Locale[] = ['es', 'en', 'pt']
export type { Locale, TranslationKeys } from './i18n'
export { DEFAULT_LOCALE, localeConfig } from './i18n'
