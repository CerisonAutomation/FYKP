import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/favorites?userId=xxx - list user's favorites
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const favorites = await db.userFavorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        target: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            online: true,
            _count: { select: { superFavoritesAdded: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: favorites });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/favorites?userId=xxx - add favorite
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { targetId, isSuper } = body;

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    const favorite = await db.userFavorite.upsert({
      where: { userId_targetId: { userId, targetId } },
      update: { isSuper: isSuper ?? false },
      create: { userId, targetId, isSuper: isSuper ?? false },
      include: {
        target: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            online: true,
            _count: { select: { superFavoritesAdded: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: favorite }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
