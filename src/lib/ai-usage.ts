import { prisma } from '@/lib/prisma'
import { canUserPerformAction } from './subscription'

export interface AIUsageRecord {
  userId: string
  language?: string
  tool: string
  minutesUsed: number
  project?: string
  timestamp?: Date
}

export async function recordAIUsage(record: AIUsageRecord): Promise<boolean> {
  try {
    // Check if user has AI usage enabled in their plan
    const hasAccess = await canUserPerformAction(record.userId, 'aiUsageEnabled')
    if (!hasAccess) {
      return false
    }

    await prisma.aIUsage.create({
      data: {
        userId: record.userId,
        language: record.language,
        tool: record.tool,
        minutesUsed: record.minutesUsed,
        project: record.project,
        timestamp: record.timestamp || new Date(),
      },
    })

    return true
  }
  catch (error) {
    console.error('Failed to record AI usage:', error)
    return false
  }
}

export async function getUserAIUsage(
  userId?: string,
  startDate?: Date,
  endDate?: Date,
  tool?: string,
) {
  const where: any = {}

  if (userId) {
    where.userId = userId
  }

  if (startDate || endDate) {
    where.timestamp = {}
    if (startDate)
      where.timestamp.gte = startDate
    if (endDate)
      where.timestamp.lte = endDate
  }

  if (tool) {
    where.tool = tool
  }

  return prisma.aIUsage.findMany({
    where,
    orderBy: { timestamp: 'desc' },
  })
}

export async function getUserAIUsageSummary(
  userId: string,
  period: 'day' | 'week' | 'month' | 'year' = 'month',
  tool?: string,
) {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const usages = await getUserAIUsage(userId, startDate, now, tool)

  const summary = {
    totalMinutes: 0,
    byTool: {} as Record<string, number>,
    byLanguage: {} as Record<string, number>,
    byProject: {} as Record<string, number>,
    period,
    tool: tool || null,
  }

  for (const usage of usages) {
    summary.totalMinutes += usage.minutesUsed

    // By tool
    summary.byTool[usage.tool] = (summary.byTool[usage.tool] || 0) + usage.minutesUsed

    // By language
    if (usage.language) {
      summary.byLanguage[usage.language] = (summary.byLanguage[usage.language] || 0) + usage.minutesUsed
    }

    // By project
    if (usage.project) {
      summary.byProject[usage.project] = (summary.byProject[usage.project] || 0) + usage.minutesUsed
    }
  }

  return summary
}

export async function getTopAITools(
  limit = 5,
  period: 'day' | 'week' | 'month' | 'year' = 'month',
): Promise<Array<{ tool: string, minutes: number }>> {
  const now = new Date()
  let startDate: Date

  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      break
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      break
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      break
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      break
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  }

  const usages = await getUserAIUsage(undefined, startDate, now)

  const toolMinutes = usages.reduce((acc, usage) => {
    acc[usage.tool] = (acc[usage.tool] || 0) + usage.minutesUsed
    return acc
  }, {} as Record<string, number>)

  return Object.entries(toolMinutes)
    .map(([tool, minutes]) => ({ tool, minutes }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, limit)
}

export async function getAIUsageByPeriod(
  userId: string,
  period: 'daily' | 'weekly' | 'monthly' = 'daily',
  limit = 30,
) {
  const now = new Date()
  const periods = []

  for (let i = 0; i < limit; i++) {
    const startDate = new Date(now)
    const endDate = new Date(now)

    switch (period) {
      case 'daily':
        startDate.setDate(now.getDate() - i)
        endDate.setDate(now.getDate() - i + 1)
        break
      case 'weekly':
        startDate.setDate(now.getDate() - (i * 7))
        endDate.setDate(now.getDate() - ((i - 1) * 7))
        break
      case 'monthly':
        startDate.setMonth(now.getMonth() - i, 1)
        endDate.setMonth(now.getMonth() - i + 1, 1)
        break
    }

    periods.push({ startDate, endDate })
  }

  const results = await Promise.all(
    periods.map(async ({ startDate, endDate }) => {
      const usages = await getUserAIUsage(userId, startDate, endDate)
      const totalMinutes = usages.reduce((sum, usage) => sum + usage.minutesUsed, 0)
      return {
        period: startDate.toISOString().split('T')[0],
        minutes: totalMinutes,
        sessions: usages.length,
      }
    }),
  )

  return results.reverse()
}
