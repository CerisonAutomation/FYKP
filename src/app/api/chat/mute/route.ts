import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// POST /api/chat/mute - toggle mute for a conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otherUserId, mute, hours } = body;

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });
    }
    if (mute === undefined) {
      return NextResponse.json({ error: 'mute boolean is required' }, { status: 400 });
    }

    // Verify the other user exists
    const otherUser = await db.user.findUnique({
      where: { id: otherUserId },
    });

    if (!otherUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const mutedUntil = mute && hours
      ? new Date(Date.now() + hours * 60 * 60 * 1000)
      : null;

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
        isMuted: mute,
        mutedUntil,
      },
      update: {
        isMuted: mute,
        mutedUntil: mute ? mutedUntil : null,
      },
    });

    return NextResponse.json({ data: participant });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
