import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/likes?type=received|sent - get likes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'received';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const where = type === 'sent'
      ? { senderId: me.id }
      : { receiverId: me.id };

    const [likes, total] = await Promise.all([
      db.like.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: {
            select: { id: true, username: true, displayName: true, avatar: true, online: true },
          },
          receiver: {
            select: { id: true, username: true, displayName: true, avatar: true, online: true },
          },
        },
      }),
      db.like.count({ where }),
    ]);

    return NextResponse.json({
      data: likes,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/likes - send a like
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiverId } = body;

    if (!receiverId) {
      return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    if (me.id === receiverId) {
      return NextResponse.json({ error: 'Cannot like yourself' }, { status: 400 });
    }

    const existing = await db.like.findUnique({
      where: {
        senderId_receiverId: { senderId: me.id, receiverId },
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already liked this user' }, { status: 409 });
    }

    const like = await db.like.create({
      data: {
        senderId: me.id,
        receiverId,
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        receiver: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: like }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/likes?receiverId=xxx - unlike a user
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const receiverId = searchParams.get('receiverId');

    if (!receiverId) {
      return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    await db.like.deleteMany({
      where: {
        senderId: me.id,
        receiverId,
      },
    });

    return NextResponse.json({ data: { unliked: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
