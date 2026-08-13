import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const banners = await db.banner.findMany({
      where: { isActive: true },
      orderBy: { position: 'asc' },
      include: {
        user: { select: { id: true, username: true, displayName: true, avatar: true } },
      },
    });

    return NextResponse.json({ data: banners });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, imageUrl, linkUrl, position } = body;

    if (!title || !imageUrl) {
      return NextResponse.json({ error: 'title and imageUrl are required' }, { status: 400 });
    }

    const banner = await db.banner.create({
      data: {
        title,
        imageUrl,
        linkUrl: linkUrl || null,
        position: position || 0,
        userId: 'test-user-1',
      },
    });

    return NextResponse.json({ data: banner }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
