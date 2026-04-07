import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimitApiKeyGeneration } from '@/lib/rateLimit'
import { checkApiKeyLimit } from '@/lib/subscription'

export const dynamic = 'force-dynamic'

/**
 * GET /api/api-keys
 * Get all API keys for the authenticated user
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

    const apiKeys = await prisma.apiKey.findMany({
      where: { userId: (session.user as any).id },
      select: {
        id: true,
        name: true,
        key: false, // Never return the full key
        status: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ data: apiKeys })
  }
  catch (error) {
    console.error('[API Keys GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
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

    // Rate limit API key generation
    const rateLimit = await rateLimitApiKeyGeneration((session.user as any).id)
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'Maximum 5 API keys per hour. Please try again later.',
          retryAfter: rateLimit.reset,
        },
        { status: 429, headers: { 'Retry-After': rateLimit.reset.toString() } },
      )
    }

    // Check plan limits
    const planLimit = await checkApiKeyLimit((session.user as any).id)
    if (!planLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Plan Limit Exceeded',
          message: `Your current plan allows maximum ${planLimit.max} API keys. You currently have ${planLimit.current}. Please upgrade your plan or delete an existing key.`,
        },
        { status: 429 },
      )
    }

    const json = await req.json() as any
    const { name, expiresAt } = json

    // Validate input
    if (!name || typeof name !== 'string' || name.length === 0 || name.length > 100) {
      return NextResponse.json(
        { error: 'Invalid input', details: 'Name must be a non-empty string (max 100 chars)' },
        { status: 400 },
      )
    }

    if (expiresAt && !(new Date(expiresAt) instanceof Date)) {
      return NextResponse.json(
        { error: 'Invalid input', details: 'expiresAt must be a valid ISO date' },
        { status: 400 },
      )
    }

    // Create API key
    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        userId: (session.user as any).id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      select: {
        id: true,
        key: true, // Return full key only on creation
        name: true,
        status: true,
        createdAt: true,
        expiresAt: true,
      },
    })

    return NextResponse.json(
      { data: apiKey, message: 'Save this key in a safe place. You won\'t be able to see it again.' },
      { status: 201 },
    )
  }
  catch (error) {
    console.error('[API Keys POST Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
