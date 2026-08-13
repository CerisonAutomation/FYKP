import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface FavoriteBody {
  messageId: string;
}

// POST /api/chat/favorite-message - toggle favorite on message
export async function POST(request: NextRequest) {
  try {
    const body: FavoriteBody = await request.json();
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

    const newFavoritedState = !message.isFavorited;

    await db.message.update({
      where: { id: messageId },
      data: { isFavorited: newFavoritedState },
    });

    return NextResponse.json({ isFavorited: newFavoritedState });
  } catch (error) {
    console.error('Favorite error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
