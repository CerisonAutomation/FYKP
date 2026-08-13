import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/messages?userId=xxx - get messages for a conversation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = (page - 1) * limit;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const messages = await db.message.findMany({
      where: {
        chatType: 'direct',
        groupId: null,
        AND: [
          {
            OR: [
              { senderId: me.id, receiverId: userId },
              { senderId: userId, receiverId: me.id },
            ],
          },
        ],
        isDeleted: false,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        receiver: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    // Mark received messages as read
    await db.message.updateMany({
      where: {
        senderId: userId,
        receiverId: me.id,
        isRead: false,
      },
      data: { isRead: true },
    });

    return NextResponse.json({
      data: messages,
      pagination: { page, limit },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/messages - send a message
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { receiverId, content, type, mediaUrl, expiresAt } = body;

    if (!receiverId || !content) {
      return NextResponse.json({ error: 'receiverId and content are required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const message = await db.message.create({
      data: {
        content,
        senderId: me.id,
        receiverId,
        type: type || 'text',
        mediaUrl: mediaUrl || null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
        receiver: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/messages?id=xxx - soft delete a message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const messageId = searchParams.get('id');

    if (!messageId) {
      return NextResponse.json({ error: 'Message id is required' }, { status: 400 });
    }

    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    await db.message.update({
      where: { id: messageId },
      data: { isDeleted: true },
    });

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
