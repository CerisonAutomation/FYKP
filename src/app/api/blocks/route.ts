import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/blocks - list blocked users
export async function GET() {
  try {
    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const blocks = await db.block.findMany({
      where: { blockerId: me.id },
      orderBy: { createdAt: 'desc' },
      include: {
        blocked: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true },
        },
      },
    });

    return NextResponse.json({ data: blocks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/blocks - block a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { blockedId, reason } = body;

    if (!blockedId) {
      return NextResponse.json({ error: 'blockedId is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    if (me.id === blockedId) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 });
    }

    const existing = await db.block.findUnique({
      where: {
        blockerId_blockedId: { blockerId: me.id, blockedId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'User already blocked' }, { status: 409 });
    }

    const block = await db.block.create({
      data: {
        blockerId: me.id,
        blockedId,
        reason: reason || null,
      },
      include: {
        blocked: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: block }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/blocks?blockedId=xxx - unblock a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const blockedId = searchParams.get('blockedId');

    if (!blockedId) {
      return NextResponse.json({ error: 'blockedId is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    await db.block.deleteMany({
      where: {
        blockerId: me.id,
        blockedId,
      },
    });

    return NextResponse.json({ data: { unblocked: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
