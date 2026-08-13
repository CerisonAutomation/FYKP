import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

interface LocationBody {
  receiverId: string;
  lat: number;
  lng: number;
  name: string;
  chatType?: string;
  groupId?: string;
}

// POST /api/chat/location - share location in chat
export async function POST(request: NextRequest) {
  try {
    const body: LocationBody = await request.json();
    const { receiverId, lat, lng, name, chatType, groupId } = body;

    if (!receiverId || lat === undefined || lng === undefined || !name) {
      return NextResponse.json(
        { error: 'receiverId, lat, lng, and name are required' },
        { status: 400 }
      );
    }

    const locationData = JSON.stringify({ lat, lng, name });

    const message = await db.message.create({
      data: {
        content: `📍 ${name}`,
        senderId: 'test-user-1',
        receiverId,
        type: 'location',
        locationData,
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
    console.error('Location share error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
