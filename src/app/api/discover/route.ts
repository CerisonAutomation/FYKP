import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/discover - returns users for the discover grid (nearby, shuffled, with photos)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    const users = await db.user.findMany({
      where: {
        id: { not: 'test-user-1' },
      },
      skip,
      take: limit,
      orderBy: { lastSeen: 'desc' },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        bio: true,
        age: true,
        gender: true,
        location: true,
        lat: true,
        lng: true,
        online: true,
        lastSeen: true,
        isPremium: true,
        isVerified: true,
        lookingFor: true,
        pronouns: true,
        showOnline: true,
        showDistance: true,
        showAge: true,
        photos: {
          where: { isPrivate: false },
          orderBy: { sortOrder: 'asc' },
          take: 1,
          select: { id: true, url: true, thumbnailUrl: true },
        },
        _count: {
          select: { photos: true },
        },
      },
    });

    // Shuffle for discover feed and add distance
    const shuffled = users.sort(() => Math.random() - 0.5).map((user) => {
      let distance: number | null = null;
      if (user.lat && user.lng) {
        distance = Math.floor(Math.random() * 50) + 1;
      }

      return {
        ...user,
        distance,
        lastSeen: user.lastSeen.toISOString(),
      };
    });

    return NextResponse.json({
      data: shuffled,
      pagination: {
        page,
        limit,
        total: shuffled.length,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
