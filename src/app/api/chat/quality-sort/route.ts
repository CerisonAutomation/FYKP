import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

function pairHash(a: string, b: string): number {
  const sorted = [a, b].sort();
  let hash = 0;
  const str = sorted.join('::');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const QUALITY_LABELS: string[] = [
  'Needs Work',
  'Below Average',
  'Average',
  'Good',
  'Great',
  'Excellent',
];

function getQualityLabel(score: number): string {
  if (score >= 85) return QUALITY_LABELS[5];
  if (score >= 70) return QUALITY_LABELS[4];
  if (score >= 55) return QUALITY_LABELS[3];
  if (score >= 40) return QUALITY_LABELS[2];
  if (score >= 20) return QUALITY_LABELS[1];
  return QUALITY_LABELS[0];
}

const QUALITY_FACTORS = [
  'Strong mutual engagement',
  'Good response time consistency',
  'Deep and meaningful topics',
  'Balanced conversation flow',
  'Shared humor and playfulness',
  'Emotional vulnerability from both sides',
  'Consistent daily interaction',
  'Active listening and follow-up questions',
];

const WEAKNESS_FACTORS = [
  'One-sided messaging pattern',
  'Slow response times',
  'Surface-level conversations only',
  'Frequent topic changes',
  'Low response rate',
  'Short or one-word replies',
  'Long gaps between messages',
];

// Mock conversations for demo
const MOCK_CONVERSATIONS = [
  { id: 'mock-q-1', displayName: 'Alex', username: 'alex_r', lastMessage: 'I can\'t believe we\'ve been talking for 3 weeks already. Time flies when you\'re with someone amazing.', messageCount: 245, quality: 94, lastMessageAt: '2025-07-13T22:30:00Z' },
  { id: 'mock-q-2', displayName: 'Jordan', username: 'jordan_fit', lastMessage: 'That\'s a really thoughtful perspective. I hadn\'t thought about it that way before.', messageCount: 178, quality: 87, lastMessageAt: '2025-07-13T21:15:00Z' },
  { id: 'mock-q-3', displayName: 'Sam', username: 'sam_cooks', lastMessage: 'Here\'s the recipe! Let me know how it turns out. I\'m curious what you think of the spice level 😄', messageCount: 203, quality: 82, lastMessageAt: '2025-07-13T19:30:00Z' },
  { id: 'mock-q-4', displayName: 'Chris', username: 'chris_design', lastMessage: 'I\'ll send over the design files by EOD. Thanks for the feedback!', messageCount: 89, quality: 76, lastMessageAt: '2025-07-13T17:00:00Z' },
  { id: 'mock-q-5', displayName: 'Riley', username: 'riley_art', lastMessage: 'The gallery was incredible! Thanks for recommending it.', messageCount: 67, quality: 68, lastMessageAt: '2025-07-13T15:00:00Z' },
  { id: 'mock-q-6', displayName: 'Marcus', username: 'marcus_nyc', lastMessage: 'cool', messageCount: 32, quality: 35, lastMessageAt: '2025-07-13T23:45:00Z' },
  { id: 'mock-q-7', displayName: 'Kai', username: 'kai_vibes', lastMessage: 'yo', messageCount: 11, quality: 18, lastMessageAt: '2025-07-13T20:00:00Z' },
  { id: 'mock-q-8', displayName: 'Taylor', username: 'taylor_m', lastMessage: 'haha yeah', messageCount: 5, quality: 12, lastMessageAt: '2025-07-13T14:00:00Z' },
];

// POST /api/chat/quality-sort - return conversations sorted by quality score
// Body: { minQuality?: number, userId?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || USER_ID;
    const minQuality = body.minQuality !== undefined ? Number(body.minQuality) : 0;

    // Fetch real conversations
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

        const hash = pairHash(userId, m.receiverId);
        const quality = msgCount === 0 ? 0 : 30 + (hash % 71);
        const strengths: string[] = [];
        const weaknesses: string[] = [];

        if (quality >= 70) {
          strengths.push(QUALITY_FACTORS[hash % QUALITY_FACTORS.length]);
          strengths.push(QUALITY_FACTORS[(hash + 2) % QUALITY_FACTORS.length]);
        }
        if (quality < 50) {
          weaknesses.push(WEAKNESS_FACTORS[hash % WEAKNESS_FACTORS.length]);
          weaknesses.push(WEAKNESS_FACTORS[(hash + 3) % WEAKNESS_FACTORS.length]);
        }

        return {
          otherUser: otherUser || { id: m.receiverId, displayName: 'Unknown', username: 'unknown', avatar: null, online: false },
          lastMessage: lastMsg?.content || '',
          messageCount: msgCount,
          lastMessageAt: lastMsg?.createdAt?.toISOString() || null,
          quality,
          qualityLabel: getQualityLabel(quality),
          strengths,
          weaknesses,
        };
      })
    );

    // Build mock conversations with full quality data
    const mockConversations = MOCK_CONVERSATIONS.map((m) => {
      const hash = pairHash(userId, m.id);
      const strengths: string[] = [];
      const weaknesses: string[] = [];

      if (m.quality >= 70) {
        strengths.push(QUALITY_FACTORS[hash % QUALITY_FACTORS.length]);
        strengths.push(QUALITY_FACTORS[(hash + 1) % QUALITY_FACTORS.length]);
        if (m.quality >= 85) {
          strengths.push(QUALITY_FACTORS[(hash + 4) % QUALITY_FACTORS.length]);
        }
      }
      if (m.quality < 50) {
        weaknesses.push(WEAKNESS_FACTORS[hash % WEAKNESS_FACTORS.length]);
        weaknesses.push(WEAKNESS_FACTORS[(hash + 2) % WEAKNESS_FACTORS.length]);
      }

      return {
        otherUser: { id: m.id, displayName: m.displayName, username: m.username, avatar: null, online: Math.random() > 0.4 },
        lastMessage: m.lastMessage,
        messageCount: m.messageCount,
        lastMessageAt: m.lastMessageAt,
        quality: m.quality,
        qualityLabel: getQualityLabel(m.quality),
        strengths,
        weaknesses,
      };
    });

    let allConversations = [...realConversations, ...mockConversations];

    // Sort by quality descending
    allConversations.sort((a, b) => b.quality - a.quality);

    // Apply minQuality filter
    if (minQuality > 0) {
      allConversations = allConversations.filter((c) => c.quality >= minQuality);
    }

    // Stats
    const qualities = allConversations.map((c) => c.quality);
    const stats = {
      total: allConversations.length,
      averageQuality: qualities.length > 0
        ? Math.round(qualities.reduce((s, q) => s + q, 0) / qualities.length)
        : 0,
      highestQuality: qualities.length > 0 ? Math.max(...qualities) : 0,
      lowestQuality: qualities.length > 0 ? Math.min(...qualities) : 0,
    };

    return NextResponse.json({
      data: allConversations,
      stats,
      filtered: minQuality > 0,
      minQualityApplied: minQuality,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
