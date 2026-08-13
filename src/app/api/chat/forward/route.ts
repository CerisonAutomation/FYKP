import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ForwardBody {
  messageId: string;
  toReceiverId: string;
}

// POST /api/chat/forward - forward a message
export async function POST(request: NextRequest) {
  try {
    const body: ForwardBody = await request.json();
    const { messageId, toReceiverId } = body;

    if (!messageId || !toReceiverId) {
      return NextResponse.json(
        { error: 'messageId and toReceiverId are required' },
        { status: 400 }
      );
    }

    const originalMessage = await db.message.findUnique({
      where: { id: messageId },
    });

    if (!originalMessage) {
      return NextResponse.json(
        { error: 'Original message not found' },
        { status: 404 }
      );
    }

    const forwardedMessage = await db.message.create({
      data: {
        content: originalMessage.content,
        senderId: 'test-user-1',
        receiverId: toReceiverId,
        type: originalMessage.type,
        mediaUrl: originalMessage.mediaUrl,
        chatType: 'direct',
        replyToId: null,
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

    return NextResponse.json({ data: forwardedMessage }, { status: 201 });
  } catch (error) {
    console.error('Forward error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
