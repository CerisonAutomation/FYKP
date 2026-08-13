import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/events - list events with optional RSVP filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rsvpStatus = searchParams.get('rsvp') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const events = await db.event.findMany({
      where: { isPublic: true },
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatar: true, isVerified: true },
        },
        _count: {
          select: { rsvps: true },
        },
        rsvps: rsvpStatus
          ? {
              where: { status: rsvpStatus },
              select: {
                user: { select: { id: true, username: true, displayName: true, avatar: true } },
              },
            }
          : false,
      },
    });

    return NextResponse.json({
      data: events,
      pagination: { page, limit },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/events - create event or RSVP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'rsvp') {
      // RSVP to an event
      const { eventId, status } = body;

      if (!eventId || !status) {
        return NextResponse.json({ error: 'eventId and status are required' }, { status: 400 });
      }

      const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

      const rsvp = await db.eventRSVP.upsert({
        where: { userId_eventId: { userId: me.id, eventId } },
        create: { userId: me.id, eventId, status },
        update: { status },
        include: {
          user: { select: { id: true, username: true, displayName: true, avatar: true } },
          event: { select: { id: true, title: true } },
        },
      });

      return NextResponse.json({ data: rsvp });
    }

    // Create event
    const { title, description, location, lat, lng, startDate, endDate, imageUrl, isPublic } = body;

    if (!title || !startDate) {
      return NextResponse.json({ error: 'title and startDate are required' }, { status: 400 });
    }

    const me = (await db.user.findUnique({ where: { id: 'test-user-1' } }))!;

    const event = await db.event.create({
      data: {
        title,
        description: description || null,
        location: location || null,
        lat: lat || null,
        lng: lng || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        imageUrl: imageUrl || null,
        isPublic: isPublic ?? true,
        ownerId: me.id,
      },
      include: {
        owner: {
          select: { id: true, username: true, displayName: true, avatar: true },
        },
      },
    });

    return NextResponse.json({ data: event }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
