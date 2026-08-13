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

// GET /api/user-map?lat=35.0&lng=12.0&radius=50&userId=xxx
// Returns nearby users on a map with their geo coordinates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '');
    const lng = parseFloat(searchParams.get('lng') || '');
    const radius = parseFloat(searchParams.get('radius') || '50');
    const userId = searchParams.get('userId');

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    // Bounding box pre-filter (approximate for SQLite)
    // 1 degree of latitude ≈ 111 km
    const latDelta = radius / 111;
    const latRad = lat * Math.PI / 180;
    const lngDelta = radius / (111 * Math.cos(latRad));

    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLng = lng - lngDelta;
    const maxLng = lng + lngDelta;

    // Find blocked user ids (both directions) if userId is provided
    let blockedIds: string[] = [];
    if (userId) {
      const blocks = await db.block.findMany({
        where: {
          OR: [{ blockerId: userId }, { blockedId: userId }],
        },
        select: { blockerId: true, blockedId: true },
      });
      blockedIds = blocks.map((b) =>
        b.blockerId === userId ? b.blockedId : b.blockerId
      );
    }

    // Fetch users within bounding box who have lat/lng set
    const users = await db.user.findMany({
      where: {
        lat: { not: null, gte: minLat, lte: maxLat },
        lng: { not: null, gte: minLng, lte: maxLng },
        ...(userId ? { id: { not: userId } } : {}),
        ...(blockedIds.length > 0 ? { id: { notIn: blockedIds } } : {}),
      },
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
        geoCity: true,
        geoRegion: true,
        geoCountry: true,
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
          select: {
            photos: true,
            receivedLikes: true,
            receivedViews: true,
          },
        },
      },
    });

    // Calculate actual haversine distance and filter by radius
    const nearbyUsers = users
      .map((user) => {
        const distance = haversine(lat, lng, user.lat!, user.lng!);
        return {
          ...user,
          distance,
          lastSeen: user.lastSeen.toISOString(),
        };
      })
      .filter((user) => user.distance <= radius);

    return NextResponse.json({ users: nearbyUsers });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/user-map?userId=xxx
// Update user's geo location
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { lat, lng, location, geoCity, geoRegion, geoCountry } = body;

    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        lat,
        lng,
        ...(location !== undefined && { location }),
        ...(geoCity !== undefined && { geoCity }),
        ...(geoRegion !== undefined && { geoRegion }),
        ...(geoCountry !== undefined && { geoCountry }),
        lastSeen: new Date(),
      },
    });

    return NextResponse.json({ data: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
