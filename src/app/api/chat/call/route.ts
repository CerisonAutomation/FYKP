import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface CallBody {
  receiverId: string;
  callType: 'voice' | 'video';
}

// POST /api/chat/call - generate a call link
export async function POST(request: NextRequest) {
  try {
    const body: CallBody = await request.json();
    const { receiverId, callType } = body;

    if (!receiverId || !callType) {
      return NextResponse.json(
        { error: 'receiverId and callType are required' },
        { status: 400 }
      );
    }

    if (callType !== 'voice' && callType !== 'video') {
      return NextResponse.json(
        { error: 'callType must be "voice" or "video"' },
        { status: 400 }
      );
    }

    const randomId = crypto.randomUUID().slice(0, 8);
    const callLink = `nexus-call://${randomId}`;

    const callData = JSON.stringify({
      type: callType,
      link: callLink,
      duration: null,
    });

    const icon = callType === 'video' ? '📹' : '📞';
    const label = callType === 'video' ? 'Video call' : 'Voice call';

    const message = await db.message.create({
      data: {
        content: `${icon} ${label}`,
        senderId: 'test-user-1',
        receiverId,
        type: 'call',
        callData,
        chatType: 'direct',
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
    console.error('Call error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
