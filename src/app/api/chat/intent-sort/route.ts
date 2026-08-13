import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

const INTENTS = ['dating', 'casual', 'friendship', 'networking', 'uncertain'] as const;

const INTENT_SUMMARIES: Record<string, string> = {
  dating: 'Strong romantic connection with emotional depth',
  casual: 'Flirtatious and physically focused banter',
  friendship: 'Platonic bond over shared interests',
  networking: 'Professional discussion and career connections',
  uncertain: 'Mixed signals, still exploring the dynamic',
};

// Mock user pool for realistic demo data
const MOCK_USERS = [
  { id: 'mock-dating-1', displayName: 'Alex', username: 'alex_r', lastMessage: 'I had the most amazing time tonight. Can we do this again soon? 💕', intent: 'dating', messageCount: 87, lastMessageAt: '2025-07-13T22:30:00Z' },
  { id: 'mock-dating-2', displayName: 'Jordan', username: 'jordan_fit', lastMessage: 'My friends already want to meet you. Is Saturday good for that double date?', intent: 'dating', messageCount: 124, lastMessageAt: '2025-07-13T21:15:00Z' },
  { id: 'mock-casual-1', displayName: 'Marcus', username: 'marcus_nyc', lastMessage: 'Your place or mine tonight? 🌙', intent: 'casual', messageCount: 32, lastMessageAt: '2025-07-13T23:45:00Z' },
  { id: 'mock-casual-2', displayName: 'Kai', username: 'kai_vibes', lastMessage: 'That pic was 🔥. Free later?', intent: 'casual', messageCount: 18, lastMessageAt: '2025-07-13T20:00:00Z' },
  { id: 'mock-friend-1', displayName: 'Sam', username: 'sam_cooks', lastMessage: 'OMG you have to try this recipe I found! Sending it now', intent: 'friendship', messageCount: 203, lastMessageAt: '2025-07-13T19:30:00Z' },
  { id: 'mock-friend-2', displayName: 'Riley', username: 'riley_art', lastMessage: 'Are you going to the gallery opening on Thursday? We could go together!', intent: 'friendship', messageCount: 156, lastMessageAt: '2025-07-13T18:00:00Z' },
  { id: 'mock-network-1', displayName: 'Chris', username: 'chris_design', lastMessage: 'I shared your portfolio with my creative director. She loved it!', intent: 'networking', messageCount: 45, lastMessageAt: '2025-07-13T17:00:00Z' },
  { id: 'mock-network-2', displayName: 'Morgan', username: 'morgan_tech', lastMessage: 'The tech meetup next week is going to be great. I put you on the guest list.', intent: 'networking', messageCount: 28, lastMessageAt: '2025-07-13T16:00:00Z' },
  { id: 'mock-uncertain-1', displayName: 'Taylor', username: 'taylor_m', lastMessage: 'Haha that\'s funny. So... what are you up to this weekend?', intent: 'uncertain', messageCount: 12, lastMessageAt: '2025-07-13T14:00:00Z' },
  { id: 'mock-uncertain-2', displayName: 'Drew', username: 'drew_22', lastMessage: 'Yeah for sure! That sounds cool', intent: 'uncertain', messageCount: 7, lastMessageAt: '2025-07-13T12:00:00Z' },
];

// POST /api/chat/intent-sort - return conversations sorted by detected intent
// Body: { intent?: string, userId?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || USER_ID;
    const filterIntent = body.intent;

    // Fetch real conversations from DB
    const realMessages = await db.message.findMany({
      where: { senderId: userId, isDeleted: false },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const realConversations = await Promise.all(
      realMessages.map(async (m) => {
        const [lastMsg, msgCount] = await Promise.all([
          db.message.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: m.receiverId },
                { senderId: m.receiverId, receiverId: userId },
              ],
              isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
          }),
          db.message.count({
            where: {
              OR: [
                { senderId: userId, receiverId: m.receiverId },
                { senderId: m.receiverId, receiverId: userId },
              ],
              isDeleted: false,
            },
          }),
        ]);

        const otherUser = await db.user.findUnique({
          where: { id: m.receiverId },
          select: { id: true, displayName: true, username: true, avatar: true, online: true },
        });

        // Deterministic intent from hash
        let hash = 0;
        const str = [userId, m.receiverId].sort().join('::');
        for (let i = 0; i < str.length; i++) {
          hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
        }
        const detectedIntent = INTENTS[Math.abs(hash) % INTENTS.length];

        return {
          otherUser: otherUser || { id: m.receiverId, displayName: 'Unknown', username: 'unknown', avatar: null, online: false },
          lastMessage: lastMsg?.content || '',
          messageCount: msgCount,
          lastMessageAt: lastMsg?.createdAt?.toISOString() || null,
          detectedIntent,
          intentLabel: INTENT_SUMMARIES[detectedIntent],
        };
      })
    );

    // Combine with mock data
    let allConversations = [
      ...realConversations,
      ...MOCK_USERS.map((m) => ({
        otherUser: { id: m.id, displayName: m.displayName, username: m.username, avatar: null, online: Math.random() > 0.5 },
        lastMessage: m.lastMessage,
        messageCount: m.messageCount,
        lastMessageAt: m.lastMessageAt,
        detectedIntent: m.intent,
        intentLabel: INTENT_SUMMARIES[m.intent],
      })),
    ];

    // Sort by intent order
    const intentOrder: Record<string, number> = { dating: 0, casual: 1, friendship: 2, networking: 3, uncertain: 4 };
    allConversations.sort((a, b) => {
      const orderDiff = intentOrder[a.detectedIntent] - intentOrder[b.detectedIntent];
      if (orderDiff !== 0) return orderDiff;
      return (b.lastMessageAt || '').localeCompare(a.lastMessageAt || '');
    });

    // Filter by intent if specified
    if (filterIntent) {
      allConversations = allConversations.filter(
        (c) => c.detectedIntent === filterIntent
      );
    }

    // Group by intent
    const grouped: Record<string, typeof allConversations> = {};
    for (const conv of allConversations) {
      if (!grouped[conv.detectedIntent]) {
        grouped[conv.detectedIntent] = [];
      }
      grouped[conv.detectedIntent].push(conv);
    }

    return NextResponse.json({
      data: allConversations,
      grouped,
      total: allConversations.length,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
