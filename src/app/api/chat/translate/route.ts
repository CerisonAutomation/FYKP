import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

interface TranslateBody {
  text: string;
  targetLang: string;
}

// POST /api/chat/translate - translate message content using LLM
export async function POST(request: NextRequest) {
  try {
    const body: TranslateBody = await request.json();
    const { text, targetLang } = body;

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'text and targetLang are required' },
        { status: 400 }
      );
    }

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Translate the following text to ${targetLang}. Return ONLY the translated text, nothing else:\n\n${text}`,
        },
      ],
    });

    const translatedText = result.choices[0].message.content.trim();

    return NextResponse.json({ translatedText, targetLang });
  } catch (error) {
    console.error('Translate error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
