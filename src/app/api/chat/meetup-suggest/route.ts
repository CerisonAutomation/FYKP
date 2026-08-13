import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

interface MeetupSuggestBody {
  userLat: number;
  userLng: number;
  otherLat: number;
  otherLng: number;
  context?: string;
}

interface MeetupSuggestion {
  name: string;
  address: string;
  type: string;
  reason: string;
}

// POST /api/chat/meetup-suggest - suggest meetup spots based on both users' locations
export async function POST(request: NextRequest) {
  try {
    const body: MeetupSuggestBody = await request.json();
    const { userLat, userLng, otherLat, otherLng, context } = body;

    if (
      userLat === undefined ||
      userLng === undefined ||
      otherLat === undefined ||
      otherLng === undefined
    ) {
      return NextResponse.json(
        { error: 'userLat, userLng, otherLat, otherLng are required' },
        { status: 400 }
      );
    }

    const midLat = (userLat + otherLat) / 2;
    const midLng = (userLng + otherLng) / 2;

    const contextNote = context
      ? `\nAdditional context about what they're looking for: ${context}`
      : '';

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Suggest 4 good meetup spots near coordinates (${midLat}, ${midLng}). This is for a gay dating app - suggest places that are LGBTQ+ friendly and great for a date.
${contextNote}

Return a JSON array of objects with fields: name, address, type (cafe/bar/restaurant/park/entertainment), reason (why it's good for a date).

Return ONLY the JSON array, nothing else.

Example:
[{"name":"The Velvet Lounge","address":"123 Main St","type":"bar","reason":"Cozy cocktail bar with great ambiance"}]`,
        },
      ],
    });

    const text = result.choices[0].message.content.trim();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    let suggestions: MeetupSuggestion[] = [];

    if (jsonMatch) {
      try {
        suggestions = JSON.parse(jsonMatch[0]);
      } catch {
        suggestions = [
          {
            name: 'Cozy Café',
            address: 'Downtown area',
            type: 'cafe',
            reason: 'Great for a relaxed first date with good coffee vibes',
          },
          {
            name: 'LGBTQ+ Friendly Bar',
            address: 'Near city center',
            type: 'bar',
            reason: 'Fun atmosphere, perfect for breaking the ice',
          },
          {
            name: 'Rooftop Restaurant',
            address: 'Midtown',
            type: 'restaurant',
            reason: 'Great views and a romantic setting',
          },
          {
            name: 'Central Park',
            address: 'City park',
            type: 'park',
            reason: 'Perfect for a walk and getting to know each other',
          },
        ];
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error('Meetup suggest error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
