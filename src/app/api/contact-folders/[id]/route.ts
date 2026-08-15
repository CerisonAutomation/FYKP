import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// PUT /api/contact-folders/[id] - rename folder
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const existing = await db.contactFolder.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const folder = await db.contactFolder.update({
      where: { id },
      data: { name: name.trim() },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json({ data: folder });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/contact-folders/[id] - delete folder (or remove member)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('targetUserId');

    // If targetUserId provided, remove member
    if (targetUserId) {
      const folder = await db.contactFolder.findFirst({
        where: { id, userId: CURRENT_USER },
      });

      if (!folder) {
        return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
      }

      await db.contactFolderMember.deleteMany({
        where: { folderId: id, targetUserId },
      });

      return NextResponse.json({ data: { removed: true } });
    }

    // Otherwise delete the whole folder
    const existing = await db.contactFolder.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    await db.contactFolder.delete({ where: { id } });

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/contact-folders/[id] - add member
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: 'targetUserId is required' }, { status: 400 });
    }

    const folder = await db.contactFolder.findFirst({
      where: { id, userId: CURRENT_USER },
    });

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    // Verify target user exists
    const targetUser = await db.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: 'Target user not found' }, { status: 404 });
    }

    const member = await db.contactFolderMember.create({
      data: {
        folderId: id,
        targetUserId,
      },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
      return NextResponse.json({ error: 'User is already in this folder' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
