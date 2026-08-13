import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

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

interface QualityMetrics {
  avgResponseTimeMs: number;
  avgMessageLength: number;
  balance: number;        // ratio closer to 1.0 = better
  engagement: number;     // based on message count and frequency
  reciprocity: number;    // percentage of messages that get replied to
}

function calculateMetrics(messages: { senderId: string; content: string; createdAt: Date }[], userId: string): QualityMetrics {
  if (messages.length === 0) {
    return { avgResponseTimeMs: Infinity, avgMessageLength: 0, balance: 1, engagement: 0, reciprocity: 0 };
  }

  const myMessages = messages.filter((m) => m.senderId === userId);
  const theirMessages = messages.filter((m) => m.senderId !== userId);

  // --- Response time: average time between consecutive message pairs ---
  const sorted = [...messages].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  let responseTimeSum = 0;
  let responseTimeCount = 0;

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].senderId !== sorted[i - 1].senderId) {
      const diff = new Date(sorted[i].createdAt).getTime() - new Date(sorted[i - 1].createdAt).getTime();
      if (diff > 0 && diff < 24 * 60 * 60 * 1000) { // Ignore gaps > 24h (sleep, offline)
        responseTimeSum += diff;
        responseTimeCount++;
      }
    }
  }
  const avgResponseTimeMs = responseTimeCount > 0 ? responseTimeSum / responseTimeCount : Infinity;

  // --- Average message length ---
  const totalLength = messages.reduce((sum, m) => sum + (m.content?.length || 0), 0);
  const avgMessageLength = messages.length > 0 ? totalLength / messages.length : 0;

  // --- Balance: ratio of messages sent vs received (closer to 1.0 = better) ---
  const myCount = myMessages.length;
  const theirCount = theirMessages.length;
  const total = myCount + theirCount;
  const balance = total > 0 ? Math.min(myCount, theirCount) / Math.max(myCount, theirCount) : 1;

  // --- Engagement: based on message count and frequency ---
  const timeSpanMs = sorted.length >= 2
    ? new Date(sorted[sorted.length - 1].createdAt).getTime() - new Date(sorted[0].createdAt).getTime()
    : 0;
  const daysActive = Math.max(timeSpanMs / (1000 * 60 * 60 * 24), 1);
  const messagesPerDay = messages.length / daysActive;
  // Engagement score 0-100 based on messages per day and total count
  const frequencyScore = Math.min(messagesPerDay / 10, 1) * 50; // 10 msgs/day = full 50 pts
  const volumeScore = Math.min(messages.length / 50, 1) * 50;   // 50+ msgs = full 50 pts
  const engagement = frequencyScore + volumeScore;

  // --- Reciprocity: percentage of messages that get a reply ---
  // Check how many messages from each side get at least one reply from the other
  let repliedFromMe = 0;
  let repliedFromThem = 0;

  for (let i = 0; i < sorted.length; i++) {
    const sender = sorted[i].senderId;
    const other = sender === userId ? theirMessages : myMessages;
    const msgTime = new Date(sorted[i].createdAt).getTime();

    // Look ahead for a reply from the other person within 24h
    const hasReply = other.some((m) => {
      const replyTime = new Date(m.createdAt).getTime();
      return replyTime > msgTime && (replyTime - msgTime) < 24 * 60 * 60 * 1000;
    });

    if (hasReply) {
      if (sender === userId) repliedFromMe++;
      else repliedFromThem++;
    }
  }

  const myReplyRate = myCount > 0 ? repliedFromMe / myCount : 1;
  const theirReplyRate = theirCount > 0 ? repliedFromThem / theirCount : 1;
  const reciprocity = ((myReplyRate + theirReplyRate) / 2) * 100;

  return { avgResponseTimeMs, avgMessageLength, balance, engagement, reciprocity };
}

function computeQualityScore(metrics: QualityMetrics, messageCount: number): number {
  if (messageCount === 0) return 0;
  if (messageCount < 3) return Math.min(messageCount * 10, 20); // Very early conversations score low

  // Response time score (0-25): faster = better
  let responseScore = 0;
  if (metrics.avgResponseTimeMs !== Infinity) {
    const avgMinutes = metrics.avgResponseTimeMs / (1000 * 60);
    if (avgMinutes <= 1) responseScore = 25;
    else if (avgMinutes <= 5) responseScore = 22;
    else if (avgMinutes <= 15) responseScore = 18;
    else if (avgMinutes <= 60) responseScore = 14;
    else if (avgMinutes <= 240) responseScore = 8;
    else responseScore = 3;
  } else {
    responseScore = 5; // No alternating messages to measure
  }

  // Message length score (0-20): longer, more thoughtful messages
  const lengthScore = Math.min(metrics.avgMessageLength / 60, 1) * 20;

  // Balance score (0-20): closer to 1.0 = better
  const balanceScore = metrics.balance * 20;

  // Engagement score (0-20): already 0-100, scale to 0-20
  const engagementScore = (metrics.engagement / 100) * 20;

  // Reciprocity score (0-15): percentage of messages replied to
  const reciprocityScore = (metrics.reciprocity / 100) * 15;

  const total = Math.round(responseScore + lengthScore + balanceScore + engagementScore + reciprocityScore);
  return Math.max(0, Math.min(100, total));
}

function deriveStrengths(metrics: QualityMetrics, messageCount: number): string[] {
  const strengths: string[] = [];

  if (metrics.avgResponseTimeMs !== Infinity) {
    const avgMinutes = metrics.avgResponseTimeMs / (1000 * 60);
    if (avgMinutes <= 5) strengths.push('Quick responses');
    else if (avgMinutes <= 15) strengths.push('Good response time');
  }

  if (metrics.balance >= 0.85) strengths.push('Balanced conversation flow');
  if (metrics.balance >= 0.7 && metrics.balance < 0.85) strengths.push('Mostly balanced messaging');

  if (metrics.avgMessageLength >= 40) strengths.push('Thoughtful, detailed messages');
  else if (metrics.avgMessageLength >= 20) strengths.push('Good message length');

  if (messageCount >= 50) strengths.push('Strong mutual engagement');
  else if (messageCount >= 20) strengths.push('Active conversation');

  if (metrics.reciprocity >= 80) strengths.push('High reply rate');
  else if (metrics.reciprocity >= 60) strengths.push('Good reciprocity');

  if (metrics.engagement >= 70) strengths.push('Frequent interaction');

  return strengths.slice(0, 4);
}

function deriveWeaknesses(metrics: QualityMetrics, messageCount: number): string[] {
  const weaknesses: string[] = [];

  if (metrics.avgResponseTimeMs !== Infinity) {
    const avgMinutes = metrics.avgResponseTimeMs / (1000 * 60);
    if (avgMinutes > 240) weaknesses.push('Very slow response times');
    else if (avgMinutes > 60) weaknesses.push('Slow response times');
  } else if (messageCount > 1) {
    weaknesses.push('No alternating replies measured');
  }

  if (metrics.balance < 0.4) weaknesses.push('One-sided messaging pattern');
  else if (metrics.balance < 0.6) weaknesses.push('Somewhat unbalanced messaging');

  if (metrics.avgMessageLength < 10 && messageCount > 3) weaknesses.push('Short or one-word replies');

  if (messageCount < 10) weaknesses.push('Low message volume');

  if (metrics.reciprocity < 40) weaknesses.push('Low response rate');

  if (metrics.engagement < 20 && messageCount > 5) weaknesses.push('Infrequent interaction');

  return weaknesses.slice(0, 4);
}

// POST /api/chat/quality-sort - return conversations sorted by real quality score
// Body: { minQuality?: number, userId?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || USER_ID;
    const minQuality = body.minQuality !== undefined ? Number(body.minQuality) : 0;

    // Fetch all conversation partners from DB
    const sentTo = await db.message.findMany({
      where: { senderId: userId, isDeleted: false },
      select: { receiverId: true },
      distinct: ['receiverId'],
    });

    const receivedFrom = await db.message.findMany({
      where: { receiverId: userId, isDeleted: false },
      select: { senderId: true },
      distinct: ['senderId'],
    });

    const partnerIds = new Set<string>([
      ...sentTo.map((m) => m.receiverId),
      ...receivedFrom.map((m) => m.senderId),
    ]);

    // Fetch messages, user info, and compute quality for each conversation
    const allConversations = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        const messages = await db.message.findMany({
          where: {
            OR: [
              { senderId: userId, receiverId: partnerId },
              { senderId: partnerId, receiverId: userId },
            ],
            isDeleted: false,
          },
          orderBy: { createdAt: 'asc' },
          select: { content: true, senderId: true, createdAt: true },
        });

        const lastMsg = messages[messages.length - 1] || null;

        const otherUser = await db.user.findUnique({
          where: { id: partnerId },
          select: { id: true, displayName: true, username: true, avatar: true, online: true },
        });

        // Calculate real metrics from actual message data
        const metrics = calculateMetrics(messages, userId);
        const quality = computeQualityScore(metrics, messages.length);
        const strengths = deriveStrengths(metrics, messages.length);
        const weaknesses = deriveWeaknesses(metrics, messages.length);

        return {
          otherUser: otherUser || { id: partnerId, displayName: 'Unknown', username: 'unknown', avatar: null, online: false },
          lastMessage: lastMsg?.content || '',
          messageCount: messages.length,
          lastMessageAt: lastMsg?.createdAt?.toISOString() || null,
          quality,
          qualityLabel: getQualityLabel(quality),
          strengths,
          weaknesses,
        };
      })
    );

    // Sort by quality descending
    allConversations.sort((a, b) => b.quality - a.quality);

    // Apply minQuality filter
    let filtered = allConversations;
    if (minQuality > 0) {
      filtered = allConversations.filter((c) => c.quality >= minQuality);
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
      data: filtered,
      stats,
      filtered: minQuality > 0,
      minQualityApplied: minQuality,
    });
  } catch (error) {
    console.error('Quality sort error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
