import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/sessions?userId=xxx - list user sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const sessions = await db.userSession.findMany({
      where: { userId },
      orderBy: { lastSeen: 'desc' },
    });

    return NextResponse.json({ data: sessions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/sessions?userId=xxx - create session
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { device, platform, ip, token } = body;

    const session = await db.userSession.create({
      data: {
        userId,
        device,
        platform,
        ip,
        token,
      },
    });

    return NextResponse.json({ data: session }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/sessions?userId=xxx&sessionId=yyy - deactivate session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId || !sessionId) {
      return NextResponse.json({ error: 'userId and sessionId are required' }, { status: 400 });
    }

    const session = await db.userSession.update({
      where: { id: sessionId, userId },
      data: { isActive: false },
    });

    return NextResponse.json({ data: session });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
