import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/shouts - fetch shouts (paginated)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 20;
    const skip = (page - 1) * limit;

    const [shouts, total] = await Promise.all([
      db.shout.findMany({
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true, age: true, gender: true, location: true, isVerified: true, isPremium: true, online: true, lastSeen: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.shout.count(),
    ]);

    return NextResponse.json({
      data: shouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/shouts - create a new shout
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { content, type, mediaUrl } = body;

    if (!content) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    const shout = await db.shout.create({
      data: {
        content,
        type: type || 'text',
        mediaUrl: mediaUrl || null,
        userId,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true, age: true, gender: true, location: true, isVerified: true, isPremium: true, online: true, lastSeen: true },
        },
      },
    });

    return NextResponse.json({ data: shout }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
