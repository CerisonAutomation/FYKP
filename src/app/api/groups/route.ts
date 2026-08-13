import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/groups - list groups (my groups first, then public discoverable groups)
export async function GET() {
  try {
    const ME_ID = 'test-user-1';

    // Get groups user is a member of
    const memberships = await db.groupMember.findMany({
      where: { userId: ME_ID },
      include: {
        group: {
          include: {
            owner: { select: { id: true, username: true, displayName: true, avatar: true } },
            _count: { select: { members: true, messages: true } },
            messages: { orderBy: { createdAt: 'desc' }, take: 1 },
          },
        },
      },
      orderBy: { joinedAt: 'desc' },
    });

    const myGroups = memberships.map((m) => ({
      ...m.group,
      myRole: m.role,
      joinedAt: m.joinedAt,
    }));

    // Get public groups not yet joined
    const memberGroupIds = memberships.map((m) => m.groupId);
    const discoverGroups = await db.groupChat.findMany({
      where: {
        isPublic: true,
        hidden: false,
        ...(memberGroupIds.length > 0 ? { id: { notIn: memberGroupIds } } : {}),
      },
      include: {
        owner: { select: { id: true, username: true, displayName: true, avatar: true } },
        _count: { select: { members: true, messages: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: [...myGroups, ...discoverGroups] });
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

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

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
