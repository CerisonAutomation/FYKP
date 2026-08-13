import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/albums?userId=xxx - list albums with photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      // Return all public albums
      const albums = await db.album.findMany({
        where: { isPrivate: false },
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatar: true } },
          photos: { orderBy: { sortOrder: 'asc' }, take: 20 },
          _count: { select: { photos: true } },
        },
      });
      return NextResponse.json({ data: albums });
    }

    // Return user's albums (including private if own)
    const ME_ID = 'test-user-1';
    const albums = await db.album.findMany({
      where: userId === ME_ID ? { userId } : { userId, isPrivate: false },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatar: true } },
        photos: { orderBy: { sortOrder: 'asc' }, take: 50 },
        _count: { select: { photos: true } },
      },
    });

    return NextResponse.json({ data: albums });
  } catch (error) {
    console.error('Albums error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/albums - create album
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, isPrivate } = body;

    if (!name) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const album = await db.album.create({
      data: {
        name,
        isPrivate: isPrivate ?? false,
        userId: 'test-user-1',
      },
      include: {
        photos: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { photos: true } },
      },
    });

    return NextResponse.json({ data: album }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
