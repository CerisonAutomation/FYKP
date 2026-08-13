import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/auth - return current user (demo: first user)
export async function GET() {
  try {
    const user = await db.user.findUnique({ where: { id: 'test-user-1' } });
    if (!user) throw new Error('test-user-1 not found');

    const { passwordHash, ...safeUser } = user;
    return NextResponse.json({ data: safeUser });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/auth?action=login - login with username/password
// POST /api/auth?action=register - create new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'login') {
      const { username, password } = body;

      if (!username || !password) {
        return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
      }

      const user = await db.user.findUnique({
        where: { username },
      });

      if (!user || user.passwordHash !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
      }

      const { passwordHash, ...safeUser } = user;
      return NextResponse.json({ data: safeUser });
    }

    if (action === 'register') {
      const { username, displayName, email, password, age, gender } = body;

      if (!username || !displayName || !email || !password) {
        return NextResponse.json({ error: 'Username, displayName, email, and password are required' }, { status: 400 });
      }

      const existing = await db.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existing) {
        return NextResponse.json({ error: 'Username or email already exists' }, { status: 409 });
      }

      const user = await db.user.create({
        data: {
          username,
          displayName,
          email,
          passwordHash: password,
          age: age || null,
          gender: gender || 'male',
        },
      });

      const { passwordHash, ...safeUser } = user;
      return NextResponse.json({ data: safeUser }, { status: 201 });
    }

    return NextResponse.json({ error: 'Invalid action. Use "login" or "register"' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
