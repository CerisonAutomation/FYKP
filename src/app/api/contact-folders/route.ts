import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/contact-folders - list folders with member count
export async function GET() {
  try {
    const folders = await db.contactFolder.findMany({
      where: { userId: CURRENT_USER },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            folder: { select: { id: true, name: true } },
          },
        },
      },
    });

    // Enrich members with user details
    const enrichedFolders = await Promise.all(
      folders.map(async (folder) => {
        const memberIds = folder.members.map((m) => m.targetUserId);
        const users = memberIds.length > 0
          ? await db.user.findMany({
              where: { id: { in: memberIds } },
              select: { id: true, username: true, displayName: true, avatar: true, online: true },
            })
          : [];

        return {
          ...folder,
          memberUsers: users,
        };
      })
    );

    return NextResponse.json({ data: enrichedFolders });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/contact-folders - create a new folder
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const folder = await db.contactFolder.create({
      data: {
        userId: CURRENT_USER,
        name: name.trim(),
      },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json({ data: folder }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
