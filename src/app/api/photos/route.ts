import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/photos?userId=xxx - get user photos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const albumId = searchParams.get('albumId');

    let targetUserId = userId;
    if (!targetUserId) {
      targetUserId = 'test-user-1';
    }

    const where: Record<string, unknown> = { userId: targetUserId };
    if (albumId) {
      where.albumId = albumId;
    } else {
      where.isPrivate = false;
    }

    const photos = await db.photo.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ data: photos });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/photos - upload photo (save URL)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, thumbnailUrl, width, height, isPrivate, isExpiring, albumId, sortOrder } = body;

    if (!url) {
      return NextResponse.json({ error: 'Photo URL is required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const photo = await db.photo.create({
      data: {
        url,
        thumbnailUrl: thumbnailUrl || null,
        width: width || null,
        height: height || null,
        isPrivate: isPrivate || false,
        isExpiring: isExpiring || false,
        expiresAt: isExpiring ? new Date(Date.now() + 24 * 60 * 60 * 1000) : null,
        albumId: albumId || null,
        sortOrder: sortOrder || 0,
        userId: me.id,
      },
    });

    return NextResponse.json({ data: photo }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
