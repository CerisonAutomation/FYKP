import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/subscriptions - get user subscriptions (both active and expired)
export async function GET() {
  try {
    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: me.id },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json({ data: subscriptions });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/subscriptions - create a subscription
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fansiteId, tier, paymentMethod, endDate } = body;

    if (!fansiteId) {
      return NextResponse.json({ error: 'fansiteId is required' }, { status: 400 });
    }

    // Demo: use the first user as "me"
    const me = await db.user.findFirst({ orderBy: { createdAt: 'asc' } });
    if (!me) {
      return NextResponse.json({ error: 'No authenticated user' }, { status: 401 });
    }

    // Check if fansite exists
    const fansite = await db.fansite.findUnique({ where: { id: fansiteId } });
    if (!fansite) {
      return NextResponse.json({ error: 'Fansite not found' }, { status: 404 });
    }

    const subscription = await db.subscription.create({
      data: {
        userId: me.id,
        tier: tier || 'free',
        endDate: endDate ? new Date(endDate) : null,
        paymentMethod: paymentMethod || null,
      },
    });

    return NextResponse.json({ data: subscription }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
