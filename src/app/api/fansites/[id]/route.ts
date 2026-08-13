import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/fansites/[id] - single fansite with full details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const fansite = await db.fansite.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            bio: true,
            isVerified: true,
            isPremium: true,
            location: true,
            pronouns: true,
            createdAt: true,
          },
        },
        links: {
          orderBy: { type: 'asc' },
        },
        products: {
          orderBy: { price: 'asc' },
        },
        _count: {
          select: {
            subscriptions: true,
          },
        },
      },
    });

    if (!fansite) {
      return NextResponse.json({ error: 'Fansite not found' }, { status: 404 });
    }

    return NextResponse.json({ data: fansite });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
