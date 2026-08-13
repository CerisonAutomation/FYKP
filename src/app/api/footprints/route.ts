import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/footprints - my footprints (profiles I visited)
// GET /api/footprints?target=1 - who visited me
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get('target');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    if (target === '1' || target === 'true') {
      // Who visited me
      const footprints = await db.footprint.findMany({
        where: { targetId: me.id },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { id: true, username: true, displayName: true, avatar: true, online: true, lastSeen: true },
          },
        },
      });

      return NextResponse.json({ data: footprints, pagination: { page, limit } });
    }

    // My footprints (profiles I visited)
    const footprints = await db.footprint.findMany({
      where: { userId: me.id },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        target: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true, lastSeen: true },
        },
      },
    });

    return NextResponse.json({ data: footprints, pagination: { page, limit } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/footprints - record a footprint (visit a profile)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetId } = body;

    if (!targetId) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    if (me.id === targetId) {
      return NextResponse.json({ error: 'Cannot leave footprint on own profile' }, { status: 400 });
    }

    // Upsert: create or update timestamp
    const footprint = await db.footprint.upsert({
      where: { userId_targetId: { userId: me.id, targetId } },
      create: { userId: me.id, targetId },
      update: { createdAt: new Date() },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatar: true } },
        target: { select: { id: true, username: true, displayName: true, avatar: true } },
      },
    });

    return NextResponse.json({ data: footprint });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
