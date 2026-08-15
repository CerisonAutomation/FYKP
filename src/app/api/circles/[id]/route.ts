import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/circles/[id] - get circle with members
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const circle = await db.circle.findFirst({
      where: { id, userId: CURRENT_USER },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true, online: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    return NextResponse.json({ data: circle });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/circles/[id] - update circle name/color/icon
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, color, icon } = body;

    const existing = await db.circle.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    const updateData: Record<string, string> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (color !== undefined) updateData.color = color;
    if (icon !== undefined) updateData.icon = icon;

    const circle = await db.circle.update({
      where: { id },
      data: updateData,
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json({ data: circle });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/circles/[id] - delete circle (cascades to members)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    // If targetUserId is provided, remove a member instead of deleting the circle
    if (targetUserId) {
      const circle = await db.circle.findFirst({
        where: { id, userId: CURRENT_USER },
      });

      if (!circle) {
        return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
      }

      await db.circleMember.deleteMany({
        where: { circleId: id, targetUserId },
      });

      return NextResponse.json({ data: { removed: true } });
    }

    // Otherwise delete the whole circle
    const existing = await db.circle.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    await db.circle.delete({ where: { id } });

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/circles/[id] - add member
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    const circle = await db.circle.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!circle) {
      return NextResponse.json({ error: 'Circle not found' }, { status: 404 });
    }

    // Verify target user exists
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const member = await db.circleMember.create({
      data: {
        circleId: id,
        targetUserId,
        userId: CURRENT_USER,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error: unknown) {
    // Handle unique constraint violation
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'User is already a member of this circle' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
