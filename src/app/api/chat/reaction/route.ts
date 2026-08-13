import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ReactionBody {
  messageId: string;
  emoji: string;
}

// Toggle a reaction on a message
async function toggleReaction(messageId: string, emoji: string) {
  const message = await db.message.findUnique({ where: { id: messageId } });
  if (!message) {
    return null;
  }

  const currentUserId = 'test-user-1';
  let reactions: Record<string, string[]> = {};

  if (message.reactions) {
    try {
      reactions = JSON.parse(message.reactions);
    } catch {
      reactions = {};
    }
  }

  // Toggle: remove if already exists, add if not
  if (reactions[emoji] && reactions[emoji].includes(currentUserId)) {
    reactions[emoji] = reactions[emoji].filter((uid: string) => uid !== currentUserId);
    if (reactions[emoji].length === 0) {
      delete reactions[emoji];
    }
  } else {
    if (!reactions[emoji]) {
      reactions[emoji] = [];
    }
    reactions[emoji].push(currentUserId);
  }

  const reactionsStr = Object.keys(reactions).length > 0
    ? JSON.stringify(reactions)
    : null;

  await db.message.update({
    where: { id: messageId },
    data: { reactions: reactionsStr },
  });

  return reactionsStr;
}

// POST /api/chat/reaction - add/remove reaction
export async function POST(request: NextRequest) {
  try {
    const body: ReactionBody = await request.json();
    const { messageId, emoji } = body;

    if (!messageId || !emoji) {
      return NextResponse.json(
        { error: 'messageId and emoji are required' },
        { status: 400 }
      );
    }

    const result = await toggleReaction(messageId, emoji);
    if (result === null) {
      return NextResponse.json(
        { error: 'Message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ reactions: result });
  } catch (error) {
    console.error('Reaction error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/chat/reaction - add/remove reaction (same as POST)
export async function PUT(request: NextRequest) {
  return POST(request);
}
