import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/travel - get current travel status
export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { id: CURRENT_USER },
      select: {
        isTraveling: true,
        travelCity: true,
        travelCountry: true,
        travelLat: true,
        travelLng: true,
        travelStart: true,
        travelEnd: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/travel - set travel status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { city, country, lat, lng, startDate, endDate } = body;

    if (!city?.trim()) {
      return NextResponse.json({ error: 'city is required' }, { status: 400 });
    }
    if (lat === undefined || lng === undefined) {
      return NextResponse.json({ error: 'lat and lng are required' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: CURRENT_USER },
      data: {
        isTraveling: true,
        travelCity: city.trim(),
        travelCountry: country?.trim() || null,
        travelLat: parseFloat(lat),
        travelLng: parseFloat(lng),
        travelStart: startDate ? new Date(startDate) : null,
        travelEnd: endDate ? new Date(endDate) : null,
      },
      select: {
        isTraveling: true,
        travelCity: true,
        travelCountry: true,
        travelLat: true,
        travelLng: true,
        travelStart: true,
        travelEnd: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/travel - cancel travel
export async function DELETE() {
  try {
    const user = await db.user.update({
      where: { id: CURRENT_USER },
      data: {
        isTraveling: false,
        travelCity: null,
        travelCountry: null,
        travelLat: null,
        travelLng: null,
        travelStart: null,
        travelEnd: null,
      },
      select: {
        isTraveling: true,
        travelCity: true,
        travelCountry: true,
        travelLat: true,
        travelLng: true,
        travelStart: true,
        travelEnd: true,
      },
    });

    return NextResponse.json({ data: user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
