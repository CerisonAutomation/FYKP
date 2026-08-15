import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const CURRENT_USER = 'test-user-1';

// GET /api/wallet - get user's wallet with balance and recent transactions
export async function GET() {
  try {
    let wallet = await db.wallet.findUnique({
      where: { userId: CURRENT_USER },
    });

    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      wallet = await db.wallet.create({
        data: { userId: CURRENT_USER, balance: 0 },
      });
    }

    const transactions = await db.transaction.findMany({
      where: { walletId: wallet.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json({
      data: {
        ...wallet,
        transactions,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
