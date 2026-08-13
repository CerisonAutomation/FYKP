import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/notes?userId=xxx&targetId=xxx - get notes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('writerId');
    const targetId = searchParams.get('targetId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const where: Record<string, unknown> = { writerId: userId };
    if (targetId) {
      where.targetId = targetId;
    }

    const notes = await db.userNote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        target: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: notes });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/notes?userId=xxx - create or update a note
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || searchParams.get('writerId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { targetId, content, type } = body;

    if (!targetId || content === undefined) {
      return NextResponse.json(
        { error: 'targetId and content are required' },
        { status: 400 },
      );
    }

    const note = await db.userNote.upsert({
      where: {
        writerId_targetId: { writerId: userId, targetId },
      },
      update: { content, type },
      create: {
        writerId: userId,
        targetId,
        content,
        type: type || 'private',
      },
      include: {
        target: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: note }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/notes?userId=xxx&targetId=xxx - delete a note
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const targetId = searchParams.get('targetId');

    if (!userId || !targetId) {
      return NextResponse.json(
        { error: 'userId and targetId are required' },
        { status: 400 },
      );
    }

    const { count } = await db.userNote.deleteMany({
      where: {
        writerId: userId,
        targetId,
      },
    });

    return NextResponse.json({ data: { deleted: true, count } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
