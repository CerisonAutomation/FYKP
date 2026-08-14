import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

const USER_ID = 'test-user-1';

const INTENT_LABELS: Record<string, string> = {
  dating: 'Romantic / Dating',
  casual: 'Casual Hookup',
  friendship: 'Friendship',
  networking: 'Networking',
  uncertain: 'Uncertain',
};

// POST /api/chat/ai-analyze - analyze a conversation using real LLM
// Body: { userId?: string, otherUserId: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otherUserId } = body;
    const userId = body.userId || USER_ID;

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });
    }

    // Fetch messages between the two users
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
        isDeleted: false,
      },
      orderBy: { createdAt: 'asc' },
      take: 100,
      select: { id: true, content: true, senderId: true, createdAt: true, type: true },
    });

    // Fetch both users for personalized analysis
    const users = await db.user.findMany({
      where: { id: { in: [userId, otherUserId] } },
      select: { id: true, displayName: true, username: true, bio: true },
    });
    const me = users.find((u) => u.id === userId);
    const them = users.find((u) => u.id === otherUserId);

    const messageCount = messages.length;

    // If no messages, return a minimal response
    if (messageCount === 0) {
      return NextResponse.json({
        data: {
          userId,
          otherUserId,
          intent: 'uncertain',
          intentLabel: INTENT_LABELS['uncertain'],
          quality: 0,
          summary: 'No messages yet. Start the conversation to get an AI analysis.',
          suggestedReplies: [
            'Hey! Nice to connect 👋',
            'What brings you here?',
            'I like your profile — tell me more about yourself!',
          ],
          meetupIdeas: [
            'Casual coffee meet-up — no pressure, just see if you click in person',
            'Check out a local event or exhibition that you both find interesting',
            'Try a new restaurant or food spot that neither of you has been to',
          ],
          analyzedAt: new Date().toISOString(),
          messageCountAnalyzed: 0,
          participants: {
            me: me ? { id: me.id, displayName: me.displayName } : null,
            them: them ? { id: them.id, displayName: them.displayName } : null,
          },
        },
      });
    }

    // Build conversation text for the LLM
    const meName = me?.displayName || 'User A';
    const themName = them?.displayName || 'User B';
    const conversationText = messages
      .filter((m) => m.type === 'text' || !m.type)
      .map((m) => {
        const sender = m.senderId === userId ? meName : themName;
        return `${sender}: ${m.content}`;
      })
      .join('\n');

    // Build bios context
    const biosContext = [
      me?.bio ? `${meName}'s bio: ${me.bio}` : '',
      them?.bio ? `${themName}'s bio: ${them.bio}` : '',
    ].filter(Boolean).join('\n');

    const llmPrompt = `You are analyzing a conversation between two users on a gay social/dating app called NEXUS. 

${biosContext ? `User bios for context:\n${biosContext}\n\n` : ''}Conversation (${messageCount} messages):
${conversationText}

Analyze this conversation and return a JSON object with EXACTLY these fields:
- "intent": one of "dating", "casual", "friendship", "networking", "uncertain"
- "quality": a number from 0 to 100 representing conversation quality
- "summary": 2-3 sentences summarizing the conversation dynamic and chemistry
- "suggestedReplies": an array of exactly 3 short, natural reply suggestions for ${meName} to send next
- "meetupIdeas": an array of exactly 3 creative meetup/activity ideas appropriate for this conversation's vibe

Return ONLY valid JSON, no other text.`;

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: llmPrompt },
      ],
    });

    const text = result.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    let parsed: {
      intent: string;
      quality: number;
      summary: string;
      suggestedReplies: string[];
      meetupIdeas: string[];
    };

    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error('Failed to parse LLM response as JSON');
    }

    // Validate and sanitize
    const validIntents = ['dating', 'casual', 'friendship', 'networking', 'uncertain'];
    const intent = validIntents.includes(parsed.intent) ? parsed.intent : 'uncertain';
    const quality = typeof parsed.quality === 'number'
      ? Math.max(0, Math.min(100, Math.round(parsed.quality)))
      : 50;
    const summary = typeof parsed.summary === 'string' ? parsed.summary : 'Analysis unavailable.';
    const suggestedReplies = Array.isArray(parsed.suggestedReplies)
      ? parsed.suggestedReplies.filter((r: unknown) => typeof r === 'string').slice(0, 3)
      : ['Interesting! Tell me more.', 'Sounds good! 😊', 'I appreciate you sharing that.'];
    const meetupIdeas = Array.isArray(parsed.meetupIdeas)
      ? parsed.meetupIdeas.filter((m: unknown) => typeof m === 'string').slice(0, 3)
      : [
          'Casual coffee meet-up to see if you click in person',
          'Check out a local event or exhibition together',
          'Go for a walk in a scenic area and chat',
        ];

    return NextResponse.json({
      data: {
        userId,
        otherUserId,
        intent,
        intentLabel: INTENT_LABELS[intent],
        quality,
        summary,
        suggestedReplies,
        meetupIdeas,
        analyzedAt: new Date().toISOString(),
        messageCountAnalyzed: messageCount,
        participants: {
          me: me ? { id: me.id, displayName: me.displayName } : null,
          them: them ? { id: them.id, displayName: them.displayName } : null,
        },
      },
    });
  } catch (error) {
    console.error('AI analyze error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
