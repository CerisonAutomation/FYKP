import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface VoiceBody {
  receiverId: string;
  audioData: string;
  duration: number;
  chatType?: string;
  groupId?: string;
}

// POST /api/chat/voice - create a voice message with real audio data
export async function POST(request: NextRequest) {
  try {
    const body: VoiceBody = await request.json();
    const { receiverId, audioData, duration, chatType, groupId } = body;

    if (!receiverId || !audioData || !duration) {
      return NextResponse.json(
        { error: 'receiverId, audioData, and duration are required' },
        { status: 400 }
      );
    }

    const mediaUrl = audioData.startsWith('data:')
      ? audioData
      : `data:audio/webm;base64,${audioData}`;

    const message = await db.message.create({
      data: {
        content: `Voice message (${duration}s)`,
        senderId: 'test-user-1',
        receiverId,
        type: 'audio',
        voiceDuration: duration,
        mediaUrl,
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
