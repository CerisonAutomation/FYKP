import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/profile-data/[userId] - fetch all profile fields for a specific user
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const fields = await db.profileField.findMany({
      where: { userId },
      orderBy: { key: 'asc' },
    });

    // Convert array to a key-value record
    const record: Record<string, string> = {};
    for (const f of fields) {
      record[f.key] = f.value;
    }

    return NextResponse.json({ userId, data: record, fields });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
