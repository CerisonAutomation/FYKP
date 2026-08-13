import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/groups/[id] - group details with members
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const group = await db.groupChat.findUnique({
      where: { id },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true },
        },
        members: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true, online: true, lastSeen: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        messages: {
          where: { isDeleted: false },
          orderBy: { createdAt: 'desc' },
          take: 50,
          include: {
            sender: {
              select: { id: true, username: true, displayName: true, avatar: true },
            },
          },
        },
        _count: {
          select: { members: true, messages: true },
        },
      },
    });

    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ data: group });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/groups/[id] - send a group message
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, type, mediaUrl } = body;

    if (!content) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    // Check if user is a member
    const membership = await db.groupMember.findUnique({
      where: { userId_groupId: { userId: me.id, groupId: id } },
    });

    if (!membership) {
      return NextResponse.json({ error: 'Not a member of this group' }, { status: 403 });
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: me.id,
        receiverId: me.id, // self for group messages
        chatType: 'group',
        groupId: id,
        type: type || 'text',
        mediaUrl: mediaUrl || null,
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/groups/[id] - leave group
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const group = await db.groupChat.findUnique({ where: { id } });
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    if (group.ownerId === me.id) {
      return NextResponse.json({ error: 'Owner cannot leave. Transfer ownership first.' }, { status: 400 });
    }

    await db.groupMember.deleteMany({
      where: { userId: me.id, groupId: id },
    });

    return NextResponse.json({ data: { left: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
