import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users - list users with pagination and filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const lookingFor = searchParams.get('lookingFor') || '';
    const minAge = parseInt(searchParams.get('minAge') || '0');
    const maxAge = parseInt(searchParams.get('maxAge') || '150');
    const onlineStatus = searchParams.get('online') || '';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { displayName: { contains: search } },
        { username: { contains: search } },
        { bio: { contains: search } },
      ];
    }

    if (lookingFor) {
      where.lookingFor = lookingFor;
    }

    if (minAge > 0 || maxAge < 150) {
      where.age = {};
      if (minAge > 0) (where.age as Record<string, number>).gte = minAge;
      if (maxAge < 150) (where.age as Record<string, number>).lte = maxAge;
    }

    if (onlineStatus === 'true') {
      where.online = true;
    } else if (onlineStatus === 'false') {
      where.online = false;
    }

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
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
          createdAt: true,
          _count: {
            select: { photos: true },
          },
        },
      }),
      db.user.count({ where }),
    ]);

    // Calculate dummy distance for demo (in km)
    const usersWithDistance = users.map((user) => {
      let distance: number | null = null;
      if (user.lat && user.lng) {
        // Simple demo distance calculation
        distance = Math.floor(Math.random() * 50) + 1;
      }
      return {
        ...user,
        distance,
      };
    });

    return NextResponse.json({
      data: usersWithDistance,
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

// POST /api/users - not typically used, reserved for future admin use
export async function POST(request: NextRequest) {
  return NextResponse.json({ error: 'Method not allowed. Use /api/auth?action=register' }, { status: 405 });
}
