import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// PUT /api/saved-phrases/[id] - update a saved phrase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, content, sortOrder } = body;

    const existing = await db.savedPhrase.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (sortOrder !== undefined) updateData.sortOrder = parseInt(sortOrder, 10);

    const phrase = await db.savedPhrase.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ data: phrase });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/saved-phrases/[id] - delete a saved phrase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.savedPhrase.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Phrase not found' }, { status: 404 });
    }

    await db.savedPhrase.delete({ where: { id } });

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
