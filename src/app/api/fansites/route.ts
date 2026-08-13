import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/fansites - list all fansites with user info, links, products, subscriber count
export async function GET() {
  try {
    const fansites = await db.fansite.findMany({
      where: { status: { in: ['published', 'approved'] } },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
            isVerified: true,
            isPremium: true,
          },
        },
        links: true,
        products: true,
      },
    });

    return NextResponse.json({ data: fansites });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/fansites - create a fansite
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, nick, description, geoName, trailerUrl, trailerImageUrl, isAnonymous, status } = body;

    if (!name || !nick) {
      return NextResponse.json({ error: 'name and nick are required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    // Check if user already has a fansite
    const existing = await db.fansite.findUnique({ where: { userId: me.id } });
    if (existing) {
      return NextResponse.json({ error: 'User already has a fansite' }, { status: 409 });
    }

    // Check if nick is unique
    const existingNick = await db.fansite.findUnique({ where: { nick } });
    if (existingNick) {
      return NextResponse.json({ error: 'Nick already taken' }, { status: 409 });
    }

    const fansite = await db.fansite.create({
      data: {
        name,
        nick,
        description: description || null,
        geoName: geoName || null,
        trailerUrl: trailerUrl || null,
        trailerImageUrl: trailerImageUrl || null,
        isAnonymous: isAnonymous || false,
        status: status || 'draft',
        userId: me.id,
      },
      include: {
        user: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: fansite }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
