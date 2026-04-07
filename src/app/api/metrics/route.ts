import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getUserPlanLimits } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

/**
 * GET /api/metrics
 * Get aggregated metrics for dashboard
 */
export async function GET(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userId = (session.user as any).id

    // Check plan limits for metrics retention
    const planLimits = await getUserPlanLimits(userId)

    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'daily'
    const limit = Number.parseInt(url.searchParams.get('limit') || '30')

    if (!['daily', 'weekly', 'monthly'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be one of: daily, weekly, monthly' },
        { status: 400 },
      )
    }

    if (limit < 1 || limit > 365) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 365' },
        { status: 400 },
      )
    }

    // Build where clause based on user access
    const where: any = {
      userId,
      period,
    }

    // Apply retention limits based on plan
    const retentionDays = planLimits.metricsRetentionDays
    if (retentionDays > 0) {
      where.createdAt = {
        gte: new Date(Date.now() - retentionDays * 24 * 60 * 60 * 1000),
      }
    }

    const metrics = await prisma.metricAggregate.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      select: {
        id: true,
        period: true,
        interval: true,
        codingMinutes: true,
        topLanguage: true,
        topProject: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({ data: metrics })
  }
  catch (error) {
    console.error('[Metrics GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
