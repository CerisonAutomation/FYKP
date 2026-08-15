import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/chat/export?otherUserId=xxx - export messages as text/plain
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const otherUserId = searchParams.get('otherUserId');

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });
    }

    // Fetch both users for the header
    const [me, other] = await Promise.all([
      db.user.findUnique({ where: { id: CURRENT_USER }, select: { displayName: true, username: true } }),
      db.user.findUnique({ where: { id: otherUserId }, select: { displayName: true, username: true } }),
    ]);

    if (!me || !other) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch last 1000 messages between the two users (limit to prevent OOM)
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: CURRENT_USER, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: CURRENT_USER },
        ],
        isDeleted: false,
        chatType: 'direct',
      },
      orderBy: { createdAt: 'desc' },
      take: 1000,
      include: {
        sender: { select: { displayName: true, username: true } },
      },
    });

    // Reverse to get chronological order for export
    messages.reverse();

    // Build text export
    const lines: string[] = [];
    lines.push(`NEXUS Chat Export`);
    lines.push(`Conversation: ${me.displayName} (@${me.username}) ↔ ${other.displayName} (@${other.username})`);
    lines.push(`Exported: ${new Date().toISOString()}`);
    lines.push(`Total messages: ${messages.length}`);
    lines.push('='.repeat(60));
    lines.push('');

    for (const msg of messages) {
      const timestamp = new Date(msg.createdAt).toLocaleString();
      const senderName = msg.sender.displayName;
      let content = msg.content;

      // Handle special message types
      if (msg.type === 'image') {
        content = msg.mediaUrl ? `[Image: ${msg.mediaUrl}]` : '[Image]';
      } else if (msg.type === 'video') {
        content = msg.mediaUrl ? `[Video: ${msg.mediaUrl}]` : '[Video]';
      } else if (msg.type === 'audio') {
        content = msg.mediaUrl ? `[Voice message: ${msg.mediaUrl}]` : '[Voice message]';
      } else if (msg.type === 'gift') {
        content = '[Gift sent]';
      } else if (msg.type === 'system') {
        content = `[System: ${content}]`;
      } else if (msg.type === 'sticker') {
        content = msg.mediaUrl ? `[Sticker: ${msg.mediaUrl}]` : '[Sticker]';
      }

      lines.push(`[${timestamp}] ${senderName}: ${content}`);
    }

    lines.push('');
    lines.push('='.repeat(60));
    lines.push('End of export');

    const text = lines.join('\n');

    return new NextResponse(text, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="chat-${me.username}-${other.username}.txt"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
