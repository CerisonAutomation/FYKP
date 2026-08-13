import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/groups - list groups user is in
export async function GET() {
  try {
    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const memberships = await db.groupMember.findMany({
      where: { userId: me.id },
      include: {
        group: {
          include: {
            owner: {
              select: { id: true, username: true, displayName: true, avatar: true },
            },
            _count: {
              select: { members: true, messages: true },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const groups = memberships.map((m) => ({
      ...m.group,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));

    return NextResponse.json({ data: groups });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/groups - create a group
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, avatar, description, isPublic, maxMembers } = body;

    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const group = await db.groupChat.create({
      data: {
        name,
        avatar: avatar || null,
        description: description || null,
        isPublic: isPublic ?? false,
        maxMembers: maxMembers || 50,
        ownerId: me.id,
        members: {
          create: {
            userId: me.id,
            role: 'admin',
          },
        },
      },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true, online: true },
            },
          },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    return NextResponse.json({ data: group }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
