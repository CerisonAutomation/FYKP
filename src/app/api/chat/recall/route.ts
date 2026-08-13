import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface RecallBody {
  messageId: string;
}

// POST /api/chat/recall - recall/unsend a message
export async function POST(request: NextRequest) {
  try {
    const body: RecallBody = await request.json();
    const { messageId } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: 'messageId is required' },
        { status: 400 }
      );
    }

    const message = await db.message.findUnique({ where: { id: messageId } });
    if (!message) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    // Only allow the sender to recall
    if (message.senderId !== 'test-user-1') {
      return NextResponse.json(
        { error: 'Cannot recall messages sent by others' },
        { status: 403 }
      );
    }

    await db.message.update({
      where: { id: messageId },
      data: {
        isRecalled: true,
        content: 'Message recalled',
      },
    });

    return NextResponse.json({ data: { recalled: true } });
  } catch (error) {
    console.error('Recall error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
