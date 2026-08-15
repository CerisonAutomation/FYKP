import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// POST /api/chat/archive - toggle archive for a conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otherUserId } = body;

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });
    }

    // Verify the other user exists
    const otherUser = await db.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    // Find existing participant to toggle
    const existing = await db.conversationParticipant.findUnique({
      where: {
        userId_otherUserId: {
          userId: CURRENT_USER,
          otherUserId,
        },
      },
    });

    const newArchived = existing ? !existing.isArchived : true;

    const participant = await db.conversationParticipant.upsert({
      where: {
        userId_otherUserId: {
          userId: CURRENT_USER,
          otherUserId,
        },
      },
      create: {
        userId: CURRENT_USER,
        otherUserId,
        isArchived: newArchived,
      },
      update: {
        isArchived: newArchived,
      },
    });

    return NextResponse.json({ data: participant });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
