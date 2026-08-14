import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

// GET /api/profile-data - fetch all ProfileField records for the current user
export async function GET() {
  try {
    const fields = await db.profileField.findMany({
      where: { userId: USER_ID },
      orderBy: { key: 'asc' },
    });

    // Convert array to a key-value record for convenience
    const record: Record<string, string> = {};
    for (const f of fields) {
      record[f.key] = f.value;
    }

    return NextResponse.json({ data: record, fields });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/profile-data - upsert profile fields in bulk
// Body: { userId?: string, fields: Record<string, string> }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fields } = body;

    if (!fields || typeof fields !== 'object' || Array.isArray(fields)) {
      return NextResponse.json({ error: 'fields must be a non-null object' }, { status: 400 });
    }

    const userId = body.userId || USER_ID;
    const entries = Object.entries(fields);

    if (entries.length === 0) {
      return NextResponse.json({ error: 'fields object must not be empty' }, { status: 400 });
    }

    // Upsert each field individually (SQLite doesn't support createMany with upsert)
    const results = await Promise.all(
      entries.map(([key, value]) =>
        db.profileField.upsert({
          where: { userId_key: { userId, key } },
          update: { value: String(value) },
          create: { userId, key, value: String(value) },
        })
      )
    );

    return NextResponse.json({ data: results, upserted: results.length }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/profile-data - update a single profile field
// Body: { userId?: string, key: string, value: string }
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, value } = body;
    const userId = body.userId || USER_ID;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'key is required and must be a string' }, { status: 400 });
    }

    if (value === undefined || value === null) {
      return NextResponse.json({ error: 'value is required' }, { status: 400 });
    }

    const updated = await db.profileField.upsert({
      where: { userId_key: { userId, key } },
      update: { value: String(value) },
      create: { userId, key, value: String(value) },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/profile-data - delete a single profile field
// Body: { userId?: string, key: string }
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { key } = body;
    const userId = body.userId || USER_ID;

    if (!key || typeof key !== 'string') {
      return NextResponse.json({ error: 'key is required and must be a string' }, { status: 400 });
    }

    await db.profileField.deleteMany({
      where: { userId, key },
    });

    return NextResponse.json({ success: true, deleted: { userId, key } });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
