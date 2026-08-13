import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

const USER_ID = 'test-user-1';

const VALID_INTENTS = ['dating', 'casual', 'friendship', 'networking', 'uncertain'] as const;

const INTENT_SUMMARIES: Record<string, string> = {
  dating: 'Strong romantic connection with emotional depth',
  casual: 'Flirtatious and physically focused banter',
  friendship: 'Platonic bond over shared interests',
  networking: 'Professional discussion and career connections',
  uncertain: 'Mixed signals, still exploring the dynamic',
};

// Keyword-based fallback classification
function classifyByKeywords(messages: string[]): string {
  const combined = messages.join(' ').toLowerCase();

  const datingKeywords = ['date', 'relationship', 'boyfriend', 'love', 'romantic', 'together', 'future', 'feelings', 'miss you', 'caring', 'heart', 'partner', 'exclusive', 'commitment', 'boyfriend'];
  const casualKeywords = ['hookup', 'tonight', 'your place', 'my place', 'nsa', 'discrete', 'fun', 'hot', 'sexy', 'dtf', 'host', 'travel', 'come over', 'sleep over', 'late night', 'chill tonight'];
  const friendshipKeywords = ['friend', 'buddy', 'bro', 'hang out', 'group', 'movie', 'game', 'food', 'restaurant', 'coffee', 'hobby', 'shared', 'event', 'community', 'volunteer', 'activity'];
  const networkingKeywords = ['work', 'project', 'career', 'job', 'business', 'portfolio', 'collaborate', 'industry', 'professional', 'freelance', 'client', 'meeting', 'opportunity', 'design', 'startup', 'tech'];

  const score = (keywords: string[]) => {
    let s = 0;
    for (const kw of keywords) {
      if (combined.includes(kw)) s++;
    }
    return s;
  };

  const scores: Record<string, number> = {
    dating: score(datingKeywords),
    casual: score(casualKeywords),
    friendship: score(friendshipKeywords),
    networking: score(networkingKeywords),
  };

  const maxScore = Math.max(...Object.values(scores));
  if (maxScore === 0) return 'uncertain';

  const topIntent = Object.entries(scores).find(([, v]) => v === maxScore)![0];
  // If multiple intents tie, prefer uncertain
  const tied = Object.values(scores).filter((v) => v === maxScore).length;
  return tied > 1 ? 'uncertain' : topIntent;
}

// POST /api/chat/intent-sort - return conversations sorted by detected intent
// Body: { intent?: string, userId?: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userId = body.userId || USER_ID;
    const filterIntent = body.intent;

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

    // Deduplicate partner IDs
    const partnerIds = new Set<string>([
      ...sentTo.map((m) => m.receiverId),
      ...receivedFrom.map((m) => m.senderId),
    ]);

    // Fetch last 10 messages per conversation + user info + counts
    const conversationData = await Promise.all(
      Array.from(partnerIds).map(async (partnerId) => {
        const [lastMessages, lastMsg, msgCount] = await Promise.all([
          db.message.findMany({
            where: {
              OR: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId },
              ],
              isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
            select: { content: true, senderId: true, createdAt: true },
          }),
          db.message.findFirst({
            where: {
              OR: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId },
              ],
              isDeleted: false,
            },
            orderBy: { createdAt: 'desc' },
          }),
          db.message.count({
            where: {
              OR: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId },
              ],
              isDeleted: false,
            },
          }),
        ]);

        const otherUser = await db.user.findUnique({
          where: { id: partnerId },
          select: { id: true, displayName: true, username: true, avatar: true, online: true },
        });

        return {
          partnerId,
          otherUser: otherUser || { id: partnerId, displayName: 'Unknown', username: 'unknown', avatar: null, online: false },
          lastMessages: lastMessages.map((m) => m.content).reverse(), // chronological
          lastMessage: lastMsg?.content || '',
          messageCount: msgCount,
          lastMessageAt: lastMsg?.createdAt?.toISOString() || null,
        };
      })
    );

    // --- LLM batch classification ---
    // Send up to 20 conversations in one LLM call
    const BATCH_SIZE = 20;
    const intentMap = new Map<string, string>(); // partnerId -> intent

    for (let i = 0; i < conversationData.length; i += BATCH_SIZE) {
      const batch = conversationData.slice(i, i + BATCH_SIZE);
      const conversationsForLLM = batch
        .map((c, idx) => {
          const globalIdx = i + idx;
          const msgs = c.lastMessages
            .map((m, mi) => `[${mi + 1}] ${m}`)
            .join('\n');
          return `--- Conversation ${globalIdx} (ID: ${c.partnerId}, ${c.messageCount} total msgs) ---\n${msgs || '(no text messages)'}`;
        })
        .join('\n\n');

      try {
        const result = await zai.createChatCompletion({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'user',
              content: `You are classifying conversations on a gay social/dating app. For each conversation below, classify its PRIMARY intent as one of: dating, casual, friendship, networking, uncertain.

Valid intents:
- dating: romantic interest, emotional connection, relationship talk, future plans together
- casual: flirtatious, physically focused, hookup-oriented, direct sexual interest
- friendship: platonic, shared hobbies/interests, group activities, casual hangout vibes
- networking: professional topics, career, projects, collaborations, industry talk
- uncertain: too few messages to tell, mixed signals, generic small talk

Here are the conversations (showing the last 10 messages of each):

${conversationsForLLM}

Return ONLY a JSON object mapping each conversation ID (the string after "ID:") to its classified intent.
Example: {"user-abc": "dating", "user-def": "friendship"}

Return ONLY valid JSON, no other text.`,
            },
          ],
        });

        const text = result.choices[0].message.content.trim();
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]) as Record<string, string>;
          for (const [id, intent] of Object.entries(parsed)) {
            if (VALID_INTENTS.includes(intent as typeof VALID_INTENTS[number])) {
              intentMap.set(id, intent);
            } else {
              intentMap.set(id, 'uncertain');
            }
          }
        } else {
          throw new Error('No JSON found in LLM response');
        }
      } catch (llmError) {
        console.error('LLM intent classification failed, falling back to keywords:', llmError);
        // Fallback to keyword-based classification for this batch
        for (const conv of batch) {
          if (!intentMap.has(conv.partnerId)) {
            const keywordIntent = classifyByKeywords(conv.lastMessages);
            intentMap.set(conv.partnerId, keywordIntent);
          }
        }
      }
    }

    // Fill any missing intents (shouldn't happen, but safety net)
    for (const conv of conversationData) {
      if (!intentMap.has(conv.partnerId)) {
        intentMap.set(conv.partnerId, classifyByKeywords(conv.lastMessages));
      }
    }

    // Build final conversation list with classified intents
    const allConversations = conversationData.map((c) => {
      const detectedIntent = intentMap.get(c.partnerId) || 'uncertain';
      return {
        otherUser: c.otherUser,
        lastMessage: c.lastMessage,
        messageCount: c.messageCount,
        lastMessageAt: c.lastMessageAt,
        detectedIntent,
        intentLabel: INTENT_SUMMARIES[detectedIntent],
      };
    });

    // Sort by intent order
    const intentOrder: Record<string, number> = { dating: 0, casual: 1, friendship: 2, networking: 3, uncertain: 4 };
    allConversations.sort((a, b) => {
      const orderDiff = intentOrder[a.detectedIntent] - intentOrder[b.detectedIntent];
      if (orderDiff !== 0) return orderDiff;
      return (b.lastMessageAt || '').localeCompare(a.lastMessageAt || '');
    });

    // Filter by intent if specified
    let filtered = allConversations;
    if (filterIntent) {
      filtered = allConversations.filter((c) => c.detectedIntent === filterIntent);
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
      data: filtered,
      grouped,
      total: allConversations.length,
    });
  } catch (error) {
    console.error('Intent sort error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
