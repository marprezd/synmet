import { NextResponse } from 'next/server'
import { PLANS } from '@/lib/plan'

export const dynamic = 'force-dynamic'

/**
 * GET /api/plans
 * Get available subscription plans
 */
export async function GET() {
  try {
    return NextResponse.json({
      data: PLANS,
      message: 'Plans retrieved successfully',
    })
  }
  catch (error) {
    console.error('[Plans GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}