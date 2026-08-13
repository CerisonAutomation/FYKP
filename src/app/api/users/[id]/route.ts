import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/users/[id] - get single user profile with photos and albums
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const user = await db.user.findUnique({
      where: { id },
      include: {
        photos: {
          where: { isPrivate: false },
          orderBy: { sortOrder: 'asc' },
        },
        albums: {
          include: {
            photos: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy: { createdAt: 'desc' },
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

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/users/[id] - update profile fields
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await db.user.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Only allow updating specific fields
    const allowedFields = [
      'displayName', 'bio', 'age', 'gender', 'location', 'lat', 'lng',
      'online', 'showOnline', 'showDistance', 'showAge', 'lookingFor',
      'aboutMe', 'height', 'weight', 'ethnicity', 'bodyType',
      'relationshipStatus', 'position', 'hivStatus', 'pronouns', 'avatar',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const updated = await db.user.update({
      where: { id },
      data: updateData,
    });

    const { passwordHash, ...safeUser } = updated;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
