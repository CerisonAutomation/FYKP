import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/dnd - get DND status
export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: CURRENT_USER },
      select: {
        dndEnabled: true,
        dndStart: true,
        dndEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/dnd - set DND schedule
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enabled, startTime, endTime } = body;

    if (enabled === undefined) {
      return NextResponse.json({ error: 'enabled boolean is required' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: CURRENT_USER },
      data: {
        dndEnabled: enabled,
        dndStart: startTime || null,
        dndEnd: endTime || null,
      },
      select: {
        dndEnabled: true,
        dndStart: true,
        dndEnd: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
