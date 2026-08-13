import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/chat-requests - get pending requests (sent and received)
export async function GET() {
  try {
    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const received = await db.chatRequest.findMany({
      where: { receiverId: me.id },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: { id: true, username: true, displayName: true, avatar: true, online: true },
        },
      },
    });

    // Return flat array so frontend can .filter() on it
    return NextResponse.json({ data: received });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/chat-requests - send, accept, or decline a chat request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, requestId, receiverId, message } = body;

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    if (action === 'send') {
      // Send a new chat request
      if (!receiverId) {
        return NextResponse.json({ error: 'receiverId is required' }, { status: 400 });
      }

      if (me.id === receiverId) {
        return NextResponse.json({ error: 'Cannot send request to yourself' }, { status: 400 });
      }

      // Check if there's already a pending request between these users
      const existing = await db.chatRequest.findFirst({
        where: {
          OR: [
            { senderId: me.id, receiverId, status: 'pending' },
            { senderId: receiverId, receiverId: me.id, status: 'pending' },
          ],
        },
      });

      if (existing) {
        return NextResponse.json({ error: 'A pending request already exists between you two' }, { status: 409 });
      }

      const chatRequest = await db.chatRequest.create({
        data: {
          senderId: me.id,
          receiverId,
          message: message || null,
          status: 'pending',
        },
        include: {
          sender: { select: { id: true, username: true, displayName: true, avatar: true } },
          receiver: { select: { id: true, username: true, displayName: true, avatar: true } },
        },
      });

      return NextResponse.json({ data: chatRequest }, { status: 201 });
    }

    if (action === 'accept') {
      if (!requestId) {
        return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
      }

      const chatRequest = await db.chatRequest.findUnique({ where: { id: requestId } });
      if (!chatRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }

      if (chatRequest.receiverId !== me.id) {
        return NextResponse.json({ error: 'Cannot accept a request not sent to you' }, { status: 403 });
      }

      const updated = await db.chatRequest.update({
        where: { id: requestId },
        data: { status: 'accepted' },
        include: {
          sender: { select: { id: true, username: true, displayName: true, avatar: true } },
          receiver: { select: { id: true, username: true, displayName: true, avatar: true } },
        },
      });

      return NextResponse.json({ data: updated });
    }

    if (action === 'decline') {
      if (!requestId) {
        return NextResponse.json({ error: 'requestId is required' }, { status: 400 });
      }

      const chatRequest = await db.chatRequest.findUnique({ where: { id: requestId } });
      if (!chatRequest) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 });
      }

      if (chatRequest.receiverId !== me.id) {
        return NextResponse.json({ error: 'Cannot decline a request not sent to you' }, { status: 403 });
      }

      const updated = await db.chatRequest.update({
        where: { id: requestId },
        data: { status: 'declined' },
        include: {
          sender: { select: { id: true, username: true, displayName: true, avatar: true } },
          receiver: { select: { id: true, username: true, displayName: true, avatar: true } },
        },
      });

      return NextResponse.json({ data: updated });
    }

    return NextResponse.json({ error: 'Invalid action. Use "send", "accept", or "decline"' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
