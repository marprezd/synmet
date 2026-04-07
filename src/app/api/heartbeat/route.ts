import { Buffer } from 'node:buffer'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimitHeartbeat } from '@/lib/rateLimit'
import { checkHeartbeatLimit } from '@/lib/subscription'
import { heartbeatSchema } from '@/lib/validations/heartbeat'

export const dynamic = 'force-dynamic'

// Module-level regex patterns (compiled once)
const SLUG_REGEX = /[^a-z0-9]+/g

/**
 * GET /api/heartbeat
 * Health check endpoint - no authentication required
 */
export async function GET() {
  try {
    // Simple health check - just verify the server is responding
    return NextResponse.json({
      status: 'ok',
      message: 'Synmet heartbeat service is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    })
  }
  catch (error) {
    console.error('[Heartbeat Health Check Error]', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Service temporarily unavailable',
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    )
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate via API Key
    const authHeader = req.headers.get('authorization')
    let apiKeyValue: string | undefined

    if (authHeader?.startsWith('Basic ')) {
      // Decode Base64 (Synmet plugins send Basic base64(api_key))
      const token = authHeader.split(' ')[1]
      const decoded = Buffer.from(token, 'base64').toString('utf-8')
      apiKeyValue = decoded.split(':')[0] || decoded
    }
    else if (authHeader?.startsWith('Bearer ')) {
      apiKeyValue = authHeader.split(' ')[1]
    }
    else {
      // Allow custom header X-Api-Key
      apiKeyValue = req.headers.get('x-api-key') || undefined
    }

    if (!apiKeyValue) {
      return new NextResponse('Unauthorized: No API Key provided', { status: 401 })
    }

    // Find API key record and get associated user
    const apiKey = await prisma.apiKey.findUnique({
      where: { key: apiKeyValue },
      include: { user: true },
    })

    if (!apiKey || !apiKey.user || apiKey.status !== 'active') {
      return new NextResponse('Unauthorized: Invalid or inactive API Key', { status: 401 })
    }

    const user = apiKey.user

    // 2. Check Rate Limit
    const rateLimit = await rateLimitHeartbeat(apiKey.id)
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too Many Requests',
          message: 'API rate limit exceeded. Maximum 100 requests per minute.',
          retryAfter: rateLimit.reset,
        },
        { status: 429, headers: { 'Retry-After': rateLimit.reset.toString() } },
      )
    }

    // 3. Check Subscription Limits
    const planLimit = await checkHeartbeatLimit(user.id, apiKey.id)
    if (!planLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Plan Limit Exceeded',
          message: 'Your current plan does not allow more heartbeats at this time. Please upgrade your plan.',
        },
        { status: 429 },
      )
    }

    // 4. Parse and validate body
    const json = await req.json()
    const body = heartbeatSchema.safeParse(json)

    if (!body.success) {
      return NextResponse.json(

        { error: 'Validation failed', details: body.error.issues },
        { status: 400 },
      )
    }

    const data = body.data

    // 5. Get or create project if provided
    let projectId: string

    if (data.project) {
      let project = await prisma.project.findFirst({
        where: {
          userId: user.id,
          slug: data.project.toLowerCase().replace(SLUG_REGEX, '-'),
        },
      })

      // Create project if it doesn't exist
      if (!project) {
        project = await prisma.project.create({
          data: {
            name: data.project,
            slug: data.project.toLowerCase().replace(SLUG_REGEX, '-'),
            userId: user.id,
          },
        })
      }

      projectId = project.id
    }
    else {
      // Create or use a default "Unsorted" project
      let defaultProject = await prisma.project.findFirst({
        where: {
          userId: user.id,
          slug: 'unsorted',
        },
      })

      if (!defaultProject) {
        defaultProject = await prisma.project.create({
          data: {
            name: 'Unsorted',
            slug: 'unsorted',
            userId: user.id,
          },
        })
      }

      projectId = defaultProject.id
    }

    // 6. Create heartbeat record
    const heartbeat = await prisma.heartbeat.create({
      data: {
        userId: user.id,
        projectId,
        file: data.entity,
        language: data.language || null,
        branch: data.branch || null,
        duration: Math.max(Math.round(data.time || 1), 1), // Ensure minimum 1 second
        isDebugging: data.type?.toLowerCase().includes('debug') || false,
        isTesting: data.category?.toLowerCase().includes('test') || false,
        timestamp: new Date(data.time * 1000), // Convert Unix seconds to JS Date
      },
    })

    // Update API key last used timestamp
    await prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    })

    return NextResponse.json({ data: heartbeat }, { status: 201 })
  }
  catch (error) {
    console.error('[Heartbeat API Error]', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      )
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
