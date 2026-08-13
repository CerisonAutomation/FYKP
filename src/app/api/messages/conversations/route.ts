import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/messages/conversations - list all conversations with last message, unread count, other user info
export async function GET() {
  try {
    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    // Get all messages involving "me" that are not deleted
    const messages = await db.message.findMany({
      where: {
        chatType: 'direct',
        groupId: null,
        isDeleted: false,
        OR: [
          { senderId: me.id },
          { receiverId: me.id },
        ],
      },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true, lastSeen: true },
        },
        receiver: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true, lastSeen: true },
        },
      },
    });

    // Group by conversation partner and keep the last message
    const conversationsMap = new Map<string, {
      otherUser: typeof messages[0]['sender'];
      lastMessage: typeof messages[0];
      unreadCount: number;
    }>();

    for (const msg of messages) {
      const otherUser = msg.senderId === me.id ? msg.receiver : msg.sender;
      if (!otherUser) continue;

      const otherId = otherUser.id;

      if (!conversationsMap.has(otherId)) {
        conversationsMap.set(otherId, {
          otherUser,
          lastMessage: msg,
          unreadCount: msg.receiverId === me.id && !msg.isRead ? 1 : 0,
        });
      }
    }

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    );

    return NextResponse.json({ data: conversations });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
