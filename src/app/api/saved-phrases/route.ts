import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/saved-phrases - list user's phrases ordered by sortOrder
export async function GET() {
  try {
    const phrases = await db.savedPhrase.findMany({
      where: { userId: CURRENT_USER },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return NextResponse.json({ data: phrases });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/saved-phrases - create a new saved phrase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    if (!content?.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 });
    }

    // Get max sortOrder to append at end
    const maxSort = await db.savedPhrase.findFirst({
      where: { userId: CURRENT_USER },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const phrase = await db.savedPhrase.create({
      data: {
        userId: CURRENT_USER,
        title: title.trim(),
        content: content.trim(),
        sortOrder: (maxSort?.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json({ data: phrase }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
