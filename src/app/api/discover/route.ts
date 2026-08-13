import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Haversine distance formula (returns km)
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// GET /api/discover - returns users for the discover grid with real haversine distances
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    const refLat = parseFloat(searchParams.get('lat') || '35.8969');
    const refLng = parseFloat(searchParams.get('lng') || '14.4425');

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

    // Shuffle for discover feed and calculate real haversine distance
    const shuffled = users
      .sort(() => Math.random() - 0.5)
      .map((user) => {
        let distance: number | null = null;
        if (user.lat && user.lng) {
          distance = Math.round(haversine(refLat, refLng, user.lat, user.lng) * 10) / 10;
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
