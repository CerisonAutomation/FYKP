import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/circles - list user's circles with member count
export async function GET() {
  try {
    const circles = await db.circle.findMany({
      where: { userId: CURRENT_USER },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { members: true } },
        members: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, avatar: true },
            },
          },
        },
      },
    });

    return NextResponse.json({ data: circles });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/circles - create a new circle
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color, icon } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 });
    }

    const circle = await db.circle.create({
      data: {
        userId: CURRENT_USER,
        name: name.trim(),
        color: color || '#6366f1',
        icon: icon || 'circle',
      },
      include: { _count: { select: { members: true } } },
    });

    return NextResponse.json({ data: circle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
