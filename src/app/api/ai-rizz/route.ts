import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

// Fallback lines used only if the LLM call fails
const FALLBACK_LINES = [
  "Hey, I noticed something interesting about your profile and had to say hi.",
  "I don't usually message first, but you caught my eye.",
  "Your bio made me smile — thought you should know.",
];

// POST /api/ai-rizz - generate AI pickup lines using ZAI SDK
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetBio = '', style = 'sweet' } = body;

    // Sanitize style to prevent prompt injection - allow only letters and spaces, max 50 chars
    const sanitizedStyle = (style || 'friendly').replace(/[^a-zA-Z\s]/g, '').substring(0, 50) || 'friendly';

    const bioContext = targetBio
      ? `The person's bio is: "${targetBio}"`
      : 'The person has no bio.';

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `You are a creative assistant for a gay dating/social app. Generate 3 unique, creative opening messages in a "${sanitizedStyle}" style.

${bioContext}

Requirements:
- Each line must be unique, original, and not a cliché
- Match the requested style: ${sanitizedStyle}
- Keep each line conversational and under 100 characters
- Do NOT use cheesy pickup lines — make them feel genuine and context-aware
- If a bio is provided, reference something specific from it
- Return ONLY a JSON array of exactly 3 strings, no other text

Example format: ["line one", "line two", "line three"]`,
        },
      ],
    });

    const text = result.choices[0].message.content.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let lines: string[] = jsonMatch
      ? JSON.parse(jsonMatch[0])
      : text.split('\n').filter((l) => l.trim().length > 0).slice(0, 3);

    // Ensure we have exactly 3 lines
    while (lines.length < 3) {
      lines.push(FALLBACK_LINES[lines.length % FALLBACK_LINES.length]);
    }
    lines = lines.slice(0, 3);

    const bioSnippet = targetBio
      ? `Based on "${targetBio.slice(0, 80)}${targetBio.length > 80 ? '...' : ''}"`
      : 'Here\'s a great opening line';

    return NextResponse.json({
      data: {
        line: lines[0],
        style: sanitizedStyle,
        context: bioSnippet,
        alternatives: lines.slice(1, 3),
      },
    });
  } catch (error) {
    console.error('AI rizz error:', error);
    // Return fallback on LLM failure
    return NextResponse.json({
      data: {
        line: FALLBACK_LINES[0],
        style: 'sweet',
        context: 'Here\'s a great opening line',
        alternatives: FALLBACK_LINES.slice(1, 3),
      },
    });
  }
}
