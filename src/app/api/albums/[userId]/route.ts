import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/albums/[userId] - fetch albums with photos and photo count for a user
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const albums = await db.album.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: {
          orderBy: { sortOrder: 'asc' },
          select: {
            id: true,
            url: true,
            thumbnailUrl: true,
            width: true,
            height: true,
            isPrivate: true,
            isExpiring: true,
            expiresAt: true,
            sortOrder: true,
            createdAt: true,
          },
        },
      },
    });

    // Add photo count per album for convenience
    const data = albums.map((album) => ({
      id: album.id,
      name: album.name,
      isPrivate: album.isPrivate,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      photoCount: album.photos.length,
      photos: album.photos,
    }));

    // Summary stats
    const totalPhotos = data.reduce((sum, a) => sum + a.photoCount, 0);

    return NextResponse.json({
      userId,
      data,
      totalAlbums: data.length,
      totalPhotos,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
