import { NextResponse } from 'next/server'
import { getTopAITools, getUserAIUsageSummary, recordAIUsage } from '@/lib/ai-usage'
import { auth } from '@/lib/auth'
import { getUserPlanLimits } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

/**
 * GET /api/ai-usage
 * Get user's AI usage summary
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

    // Check if user has premium plan
    const planLimits = await getUserPlanLimits(userId)
    if (!planLimits.aiUsageEnabled) {
      return NextResponse.json(
        { error: 'AI usage is only available for premium plans' },
        { status: 403 },
      )
    }

    const url = new URL(req.url)
    const period = url.searchParams.get('period') || 'month'
    const tool = url.searchParams.get('tool')

    if (!['day', 'week', 'month', 'year'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be one of: day, week, month, year' },
        { status: 400 },
      )
    }

    const summary = await getUserAIUsageSummary(userId, period as any, tool || undefined)

    return NextResponse.json({ data: summary })
  }
  catch (error) {
    console.error('[AI Usage GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/ai-usage
 * Record AI usage event
 */
export async function POST(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userId = (session.user as any).id

    // Check if user has premium plan
    const planLimits = await getUserPlanLimits(userId)
    if (!planLimits.aiUsageEnabled) {
      return NextResponse.json(
        { error: 'AI usage is only available for premium plans' },
        { status: 403 },
      )
    }

    const json = await req.json() as any
    // eslint-disable-next-line unused-imports/no-unused-vars
    const { tool, tokens, cost, metadata } = json

    if (!tool || typeof tool !== 'string') {
      return NextResponse.json(
        { error: 'Tool name is required' },
        { status: 400 },
      )
    }

    if (tokens !== undefined && (typeof tokens !== 'number' || tokens < 0)) {
      return NextResponse.json(
        { error: 'Tokens must be a non-negative number' },
        { status: 400 },
      )
    }

    if (cost !== undefined && (typeof cost !== 'number' || cost < 0)) {
      return NextResponse.json(
        { error: 'Cost must be a non-negative number' },
        { status: 400 },
      )
    }

    const usage = await recordAIUsage({
      userId,
      tool,
      minutesUsed: tokens || 0, // Assuming tokens represent minutes for now
      timestamp: new Date(),
    })

    return NextResponse.json(
      { data: usage, message: 'AI usage recorded successfully' },
      { status: 201 },
    )
  }
  catch (error) {
    console.error('[AI Usage POST Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * GET /api/ai-usage/top-tools
 * Get top AI tools usage (admin endpoint)
 */
export async function GET_TOP_TOOLS(req: Request) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    // TODO: Add admin check here
    // For now, allow any authenticated user

    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get('limit') || '10')
    const period = url.searchParams.get('period') || 'month'

    if (!['day', 'week', 'month', 'year'].includes(period)) {
      return NextResponse.json(
        { error: 'Invalid period. Must be one of: day, week, month, year' },
        { status: 400 },
      )
    }

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 },
      )
    }

    const topTools = await getTopAITools(limit, period as any)

    return NextResponse.json({ data: topTools })
  }
  catch (error) {
    console.error('[AI Usage Top Tools Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
