import { NextResponse } from 'next/server'
import { getTopAITools } from '@/lib/ai-usage'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

/**
 * GET /api/ai-usage/top-tools
 * Get top AI tools usage (admin endpoint)
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
