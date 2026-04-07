import { z } from 'zod'

export const heartbeatSchema = z.object({
  projectId: z.cuid('Invalid project ID'),
  file: z.string().min(1, 'File path is required'),
  language: z.string().optional(),
  lines: z.number().int().optional(),
  branch: z.string().optional(),
  duration: z.number().int().min(0, 'Duration must be positive'),
  isDebugging: z.boolean().optional().default(false),
  isTesting: z.boolean().optional().default(false),
})

export type HeartbeatInput = z.infer<typeof heartbeatSchema>

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  slug: z.string().min(1).max(50).regex(/^[a-z0-9-]+$/, 'Invalid slug format'),
  description: z.string().max(500).optional(),
})

export type ProjectInput = z.infer<typeof projectSchema>

export const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(100),
  expiresAt: z.date().optional(),
})

export type ApiKeyInput = z.infer<typeof apiKeySchema>
