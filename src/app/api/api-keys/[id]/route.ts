import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * PATCH /api/api-keys/[id]
 * Update API key (name, status)
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id } = await params
    const json = await req.json() as any
    const { name, status } = json

    // Verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    })

    if (!apiKey || apiKey.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 },
      )
    }

    // Validate updates
    const updateData: any = {}

    if (name !== undefined) {
      if (typeof name !== 'string' || name.length === 0 || name.length > 100) {
        return NextResponse.json(
          { error: 'Invalid input', details: 'Name must be a non-empty string (max 100 chars)' },
          { status: 400 },
        )
      }
      updateData.name = name
    }

    if (status !== undefined) {
      if (!['active', 'revoked', 'expired'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid input', details: 'Status must be one of: active, revoked, expired' },
          { status: 400 },
        )
      }
      updateData.status = status
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No updates provided' },
        { status: 400 },
      )
    }

    const updated = await prisma.apiKey.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        status: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
    })

    return NextResponse.json({ data: updated })
  }
  catch (error) {
    console.error('[API Keys PATCH Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/api-keys/[id]
 * Delete API key (revoke)
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()

    if (!session?.user || !(session.user as any).id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 },
      )
    }

    const { id } = await params

    // Verify ownership
    const apiKey = await prisma.apiKey.findUnique({
      where: { id },
    })

    if (!apiKey || apiKey.userId !== (session.user as any).id) {
      return NextResponse.json(
        { error: 'Not Found' },
        { status: 404 },
      )
    }

    // Delete the key
    await prisma.apiKey.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'API key deleted successfully' },
      { status: 200 },
    )
  }
  catch (error) {
    console.error('[API Keys DELETE Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }
}
