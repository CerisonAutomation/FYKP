import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface ScheduleBody {
  receiverId: string;
  content: string;
  scheduledAt: string;
  chatType?: string;
  groupId?: string;
}

// POST /api/chat/schedule - schedule a message
export async function POST(request: NextRequest) {
  try {
    const body: ScheduleBody = await request.json();
    const { receiverId, content, scheduledAt, chatType, groupId } = body;

    if (!receiverId || !content || !scheduledAt) {
      return NextResponse.json(
        { error: 'receiverId, content, and scheduledAt are required' },
        { status: 400 }
      );
    }

    const scheduledDate = new Date(scheduledAt);
    if (isNaN(scheduledDate.getTime())) {
      return NextResponse.json(
        { error: 'scheduledAt must be a valid ISO date string' },
        { status: 400 }
      );
    }

    const message = await db.message.create({
      data: {
        content,
        senderId: 'test-user-1',
        receiverId,
        type: 'text',
        chatType: chatType || 'direct',
        groupId: groupId || null,
        scheduledAt: scheduledDate,
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
    console.error('Schedule error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
