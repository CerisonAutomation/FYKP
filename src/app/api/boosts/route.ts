import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/boosts - get active boosts for current user
export async function GET() {
  try {
    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const boosts = await db.boost.findMany({
      where: {
        userId: me.id,
        isActive: true,
      },
      orderBy: { startedAt: 'desc' },
    });

    return NextResponse.json({ data: boosts });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/boosts - activate a boost
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, duration } = body;

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const boostType = type || 'standard';
    const boostDuration = duration || 30;
    const endsAt = new Date(Date.now() + boostDuration * 60 * 1000);

    // Deactivate any existing active boosts
    await db.boost.updateMany({
      where: { userId: me.id, isActive: true },
      data: { isActive: false },
    });

    const boost = await db.boost.create({
      data: {
        userId: me.id,
        type: boostType,
        duration: boostDuration,
        startedAt: new Date(),
        endsAt,
        isActive: true,
      },
    });

    return NextResponse.json({ data: boost }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
