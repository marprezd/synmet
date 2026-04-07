import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/payments
 * Get user's payment history
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

    const url = new URL(req.url)
    const limit = Number.parseInt(url.searchParams.get('limit') || '20')
    const offset = Number.parseInt(url.searchParams.get('offset') || '0')

    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 },
      )
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be non-negative' },
        { status: 400 },
      )
    }

    const payments = await prisma.payment.findMany({
      where: {
        subscription: {
          userId,
        },
      },
      orderBy: {
        paidAt: 'desc',
      },
      take: limit,
      skip: offset,
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    const total = await prisma.payment.count({
      where: {
        subscription: {
          userId,
        },
      },
    })

    return NextResponse.json({
      data: payments,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  }
  catch (error) {
    console.error('[Payments GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/payments
 * Create a new payment record (webhook handler)
 */
export async function POST(req: Request) {
  try {
    // TODO: Add webhook signature verification for production
    // For now, accept any authenticated request

    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const json = await req.json() as any
    const {
      amount,
      currency,
      status,
      provider,
      providerPaymentId,
      // eslint-disable-next-line unused-imports/no-unused-vars
      description,
      subscriptionId,
    } = json

    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 },
      )
    }

    if (!currency || typeof currency !== 'string') {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 },
      )
    }

    if (!status || !['pending', 'completed', 'failed', 'refunded'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid status is required (pending, completed, failed, refunded)' },
        { status: 400 },
      )
    }

    if (!provider || typeof provider !== 'string') {
      return NextResponse.json(
        { error: 'Provider is required' },
        { status: 400 },
      )
    }

    const payment = await prisma.payment.create({
      data: {
        subscriptionId,
        amount,
        currency,
        providerPaymentId,
        status,
      },
      include: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    })

    return NextResponse.json(
      { data: payment, message: 'Payment recorded successfully' },
      { status: 201 },
    )
  }
  catch (error) {
    console.error('[Payments POST Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
