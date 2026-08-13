import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// DELETE /api/favorites/[id]?userId=xxx - remove favorite
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const favorite = await db.userFavorite.deleteMany({
      where: { id, userId },
    });

    if (favorite.count === 0) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    return NextResponse.json({ data: { deleted: true } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/favorites/[id]?userId=xxx - toggle super favorite
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { isSuper } = body;

    if (typeof isSuper !== 'boolean') {
      return NextResponse.json({ error: 'isSuper (boolean) is required' }, { status: 400 });
    }

    const existing = await db.userFavorite.findUnique({
      where: { id },
    });

    if (!existing || existing.userId !== userId) {
      return NextResponse.json({ error: 'Favorite not found' }, { status: 404 });
    }

    const favorite = await db.userFavorite.update({
      where: { id },
      data: { isSuper },
      include: {
        target: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            online: true,
            _count: { select: { SuperFavBy: true } },
          },
        },
      },
    });

    return NextResponse.json({ data: favorite });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
