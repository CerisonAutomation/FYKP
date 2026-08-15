import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/liked-photos - list user's liked photos with photo details
export async function GET() {
  try {
    const likedPhotos = await db.likedPhoto.findMany({
      where: { userId: CURRENT_USER },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    // Fetch the actual photo details for each liked photo
    const photoIds = likedPhotos.map((lp) => lp.photoId);
    const photos = photoIds.length > 0
      ? await db.photo.findMany({
          where: { id: { in: photoIds } },
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true },
            },
          },
        })
      : [];

    // Merge liked photo data with full photo details
    const enriched = likedPhotos.map((lp) => {
      const photo = photos.find((p) => p.id === lp.photoId);
      return {
        ...lp,
        photo: photo || null,
      };
    });

    return NextResponse.json({ data: enriched });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/liked-photos - like a photo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json({ error: 'photoId is required' }, { status: 400 });
    }

    // Verify photo exists
    const photo = await db.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    const likedPhoto = await db.likedPhoto.create({
      data: {
        userId: CURRENT_USER,
        photoId,
      },
    });

    return NextResponse.json({ data: likedPhoto }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'Photo already liked' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/liked-photos?photoId=xxx - unlike a photo
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const photoId = searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json({ error: 'photoId is required' }, { status: 400 });
    }

    await db.likedPhoto.deleteMany({
      where: {
        userId: CURRENT_USER,
        photoId,
      },
    });

    return NextResponse.json({ data: { unliked: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
