import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/profile-views - who viewed me (list of profile viewers)
export async function GET() {
  try {
    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const views = await db.profileView.findMany({
      where: { viewedId: me.id },
      orderBy: { createdAt: 'desc' },
      include: {
        viewer: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            online: true,
            lastSeen: true,
          },
        },
      },
    });

    return NextResponse.json({ data: views });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/profile-views - record a profile view
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { viewedId } = body;

    if (!viewedId) {
      return NextResponse.json({ error: 'viewedId is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    if (me.id === viewedId) {
      return NextResponse.json({ error: 'Cannot view your own profile' }, { status: 400 });
    }

    const view = await db.profileView.create({
      data: {
        viewerId: me.id,
        viewedId,
      },
      include: {
        viewer: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        viewed: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: view }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
