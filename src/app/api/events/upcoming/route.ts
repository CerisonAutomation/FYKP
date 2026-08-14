import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/events/upcoming - return real events from DB sorted by startDate with optional type filter
// Query params: ?type=social|party|meetup|sports|cultural
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get('type');

    // Fetch real events from DB
    const whereClause: Record<string, unknown> = { isPublic: true };
    if (typeFilter) {
      whereClause.type = typeFilter;
    }

    const dbEvents = await db.event.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' },
    });

    // Map DB events to consistent format
    const formattedEvents = dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      lat: e.lat,
      lng: e.lng,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() || null,
      imageUrl: e.imageUrl,
      type: e.type,
      attendeeCount: e.attendeeCount,
      isPublic: e.isPublic,
    }));

    // Build type counts from DB events
    const typeCounts: Record<string, number> = {};
    for (const e of dbEvents) {
      if (e.type) {
        typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
      }
    }

    return NextResponse.json({
      data: formattedEvents,
      total: formattedEvents.length,
      typeCounts,
      filter: typeFilter || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
