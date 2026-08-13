import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

interface ChatMessage {
  content: string;
  senderId: string;
}

interface AutoReplyBody {
  messages: ChatMessage[];
  userId: string;
}

// POST /api/chat/auto-reply - generate 3 context-aware auto-reply suggestions
export async function POST(request: NextRequest) {
  try {
    const body: AutoReplyBody = await request.json();
    const { messages, userId } = body;

    if (!messages || messages.length === 0 || !userId) {
      return NextResponse.json(
        { error: 'messages array and userId are required' },
        { status: 400 }
      );
    }

    const currentUserId = 'test-user-1';
    const conversationHistory = messages
      .map((m) => {
        const role = m.senderId === currentUserId ? 'Me' : 'Them';
        return `${role}: ${m.content}`;
      })
      .join('\n');

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `You are helping a user in a gay dating/social app reply to a conversation. Generate exactly 3 short, natural, context-aware reply suggestions.

Conversation so far:
${conversationHistory}

Generate 3 replies. Be witty, flirty, or genuine depending on the context. Keep each reply under 80 characters. Return ONLY a JSON array of 3 strings, no other text.

Example: ["That sounds amazing! 😊", "I'd love that!", "When are you free?"]`,
        },
      ],
    });

    const text = result.choices[0].message.content.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const replies: string[] = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : [
          text.split('\n')[0],
          text.split('\n')[1] || 'Sounds good!',
          text.split('\n')[2] || 'Tell me more!',
        ];

    return NextResponse.json({ replies: replies.slice(0, 3) });
  } catch (error) {
    console.error('Auto-reply error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
