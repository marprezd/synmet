import { z } from 'zod'

export const heartbeatSchema = z.object({
  entity: z.string(),
  type: z.string(),
  category: z.string().optional(),
  project: z.string().optional(),
  branch: z.string().optional(),
  language: z.string().optional(),
  isWrite: z.boolean().optional(),
  lineno: z.number().optional(),
  cursorpos: z.number().optional(),
  time: z.number(),
})

export type HeartbeatInput = z.infer<typeof heartbeatSchema>
