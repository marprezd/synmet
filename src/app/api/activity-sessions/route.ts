import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * GET /api/activity-sessions
 * Get user's activity sessions
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
    const activeOnly = url.searchParams.get('active_only') === 'true'

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

    const where: any = {
      userId,
    }

    if (activeOnly) {
      where.endTime = null
    }

    const sessions = await prisma.activitySession.findMany({
      where,
      orderBy: {
        startTime: 'desc',
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        startTime: true,
        endTime: true,
        project: true,
        language: true,
        editor: true,
        createdAt: true,
      },
    })

    const total = await prisma.activitySession.count({ where })

    return NextResponse.json({
      data: sessions,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    })
  }
  catch (error) {
    console.error('[Activity Sessions GET Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * POST /api/activity-sessions
 * Start a new activity session
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
    const json = await req.json() as any
    const { project, language, editor } = json

    // End any existing active sessions for this user
    await prisma.activitySession.updateMany({
      where: {
        userId,
        endTime: null,
      },
      data: {
        endTime: new Date(),
      },
    })

    // Create new session
    const newSession = await prisma.activitySession.create({
      data: {
        userId,
        startTime: new Date(),
        project,
        language,
        editor,
      },
      select: {
        id: true,
        startTime: true,
        project: true,
        language: true,
        editor: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      { data: newSession, message: 'Activity session started successfully' },
      { status: 201 },
    )
  }
  catch (error) {
    console.error('[Activity Sessions POST Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * PATCH /api/activity-sessions
 * End current activity session
 */
export async function PATCH() {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const userId = (session.user as any).id

    // Find and end the current active session
    const activeSession = await prisma.activitySession.findFirst({
      where: {
        userId,
        endTime: null,
      },
    })

    if (!activeSession) {
      return NextResponse.json(
        { error: 'No active session found' },
        { status: 404 },
      )
    }

    const endTime = new Date()

    const updatedSession = await prisma.activitySession.update({
      where: { id: activeSession.id },
      data: {
        endTime,
      },
      select: {
        id: true,
        startTime: true,
        endTime: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      data: updatedSession,
      message: 'Activity session ended successfully',
    })
  }
  catch (error) {
    console.error('[Activity Sessions PATCH Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
