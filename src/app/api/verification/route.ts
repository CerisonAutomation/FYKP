import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/verification?userId=xxx - get user verification record
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const verification = await db.verification.findUnique({
      where: { userId },
    });

    return NextResponse.json({ data: verification });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/verification?userId=xxx - upsert verification (submit)
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { type, documentUrl, phone, phonePrefix } = body;

    const verification = await db.verification.upsert({
      where: { userId },
      update: {
        ...(type != null && { type }),
        ...(documentUrl != null && { documentUrl }),
        ...(phone != null && { phone }),
        ...(phonePrefix != null && { phonePrefix }),
        submittedAt: new Date(),
        status: 'pending',
      },
      create: {
        userId,
        type: type || 'age',
        documentUrl,
        phone,
        phonePrefix,
        submittedAt: new Date(),
        status: 'pending',
      },
    });

    await db.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        verificationStatus: 'pending',
      },
    });

    return NextResponse.json({ data: verification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/verification?userId=xxx - review verification
export async function PATCH(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const body = await request.json();
    const { status, notes } = body;

    if (!status) {
      return NextResponse.json({ error: 'status is required' }, { status: 400 });
    }

    const verification = await db.verification.update({
      where: { userId },
      data: {
        status,
        ...(notes != null && { notes }),
        reviewedAt: new Date(),
      },
    });

    if (status === 'verified') {
      await db.user.update({
        where: { id: userId },
        data: {
          isVerified: true,
          verificationStatus: 'verified',
        },
      });
    }

    return NextResponse.json({ data: verification });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
