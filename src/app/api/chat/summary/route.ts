import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

interface SummaryMessage {
  content: string;
  senderId: string;
  createdAt: string;
}

interface SummaryBody {
  messages: SummaryMessage[];
}

// POST /api/chat/summary - generate AI conversation summary
export async function POST(request: NextRequest) {
  try {
    const body: SummaryBody = await request.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'messages array is required' },
        { status: 400 }
      );
    }

    const currentUserId = 'test-user-1';
    const conversationText = messages
      .map((m) => {
        const role = m.senderId === currentUserId ? 'Me' : 'Them';
        const time = m.createdAt ? ` [${m.createdAt}]` : '';
        return `${role}${time}: ${m.content}`;
      })
      .join('\n');

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Summarize this conversation in a friendly, concise way (2-3 sentences max). Highlight key topics, plans, or feelings expressed.

Conversation:
${conversationText}

Return ONLY the summary text, nothing else.`,
        },
      ],
    });

    const summary = result.choices[0].message.content.trim();

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Summary error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
