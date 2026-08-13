import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/profile-views - who viewed me (list of profile viewers)
export async function GET() {
  try {
    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

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
            age: true,
            location: true,
            isPremium: true,
            isVerified: true,
            pronouns: true,
            showOnline: true,
            showAge: true,
            _count: {
              select: {
                photos: true,
                receivedLikes: true,
              },
            },
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

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

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
