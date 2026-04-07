import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { cancelSubscription, createOrUpdateSubscription, getUserSubscription } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

/**
 * GET /api/subscription
 * Get current user's subscription details
 */
export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const subscription = await getUserSubscription((session.user as any).id)

    if (!subscription) {
      return NextResponse.json({
        data: {
          plan: 'free',
          status: 'active',
          isTrial: false,
          features: {
            heartbeatsPerMinute: 100,
            apiKeysMax: 3,
            metricsRetentionDays: 30,
            aiUsageEnabled: false,
            teamsEnabled: false,
            exportEnabled: false,
          },
        },
      })
    }

    return NextResponse.json({ data: subscription })
  }
  catch (error) {
    console.error('[Subscription GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/subscription
 * Create or update subscription (for development/testing)
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

    const json = await req.json() as any
    const { plan, trialDays } = json

    if (!plan || !['free', 'pro', 'business'].includes(plan)) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be one of: free, pro, business' },
        { status: 400 },
      )
    }

    const trialEndsAt = trialDays ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000) : undefined

    const subscription = await createOrUpdateSubscription(
      (session.user as any).id,
      plan,
      undefined, // providerCustomerId
      undefined, // providerSubscriptionId
      trialEndsAt,
    )

    return NextResponse.json(
      { data: subscription, message: 'Subscription updated successfully' },
      { status: 201 },
    )
  }
  catch (error) {
    console.error('[Subscription POST Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/subscription
 * Cancel subscription
 */
export async function DELETE() {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const subscription = await cancelSubscription((session.user as any).id)

    return NextResponse.json({
      data: subscription,
      message: 'Subscription cancelled successfully',
    })
  }
  catch (error) {
    console.error('[Subscription DELETE Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
