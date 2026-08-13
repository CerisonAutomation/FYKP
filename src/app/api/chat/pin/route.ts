import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface PinBody {
  messageId: string;
}

// POST /api/chat/pin - toggle pin on a message
export async function POST(request: NextRequest) {
  try {
    const body: PinBody = await request.json();
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

    const newPinnedState = !message.isPinned;

    await db.message.update({
      where: { id: messageId },
      data: { isPinned: newPinnedState },
    });

    return NextResponse.json({ isPinned: newPinnedState });
  } catch (error) {
    console.error('Pin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
