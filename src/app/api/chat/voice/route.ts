import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface VoiceBody {
  receiverId: string;
  duration: number;
  chatType?: string;
  groupId?: string;
}

// POST /api/chat/voice - simulate voice message creation (stores a placeholder)
export async function POST(request: NextRequest) {
  try {
    const body: VoiceBody = await request.json();
    const { receiverId, duration, chatType, groupId } = body;

    if (!receiverId || !duration) {
      return NextResponse.json(
        { error: 'receiverId and duration are required' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        content: '🎤 Voice message',
        senderId: 'test-user-1',
        receiverId,
        type: 'audio',
        voiceDuration: duration,
        mediaUrl: 'voice-placeholder://' + Date.now(),
        chatType: chatType || 'direct',
        groupId: groupId || null,
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
    console.error('Voice message error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
