import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/checkins - list user's checkins (latest 20)
export async function GET() {
  try {
    const checkins = await db.checkin.findMany({
      where: { userId: CURRENT_USER },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({ data: checkins });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/checkins - create a new checkin
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { venueName, lat, lng } = body;

    if (!venueName?.trim()) {
      return NextResponse.json({ error: 'venueName is required' }, { status: 400 });
    }
    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    const checkin = await db.checkin.create({
      data: {
        userId: CURRENT_USER,
        venueName: venueName.trim(),
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      },
    });

    return NextResponse.json({ data: checkin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
