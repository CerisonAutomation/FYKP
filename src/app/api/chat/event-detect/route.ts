import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import ZAI from 'z-ai-web-dev-sdk';
const zai = new ZAI();

interface EventDetectBody {
  messages: string[];
  senderId: string;
  receiverId: string;
  createEvent: boolean;
}

interface DetectedEvent {
  title: string;
  description: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  date: string | null;
}

// POST /api/chat/event-detect - detect events/plans in messages
export async function POST(request: NextRequest) {
  try {
    const body: EventDetectBody = await request.json();
    const { messages, senderId, receiverId, createEvent } = body;

    if (!messages || messages.length === 0 || !senderId || !receiverId) {
      return NextResponse.json(
        { error: 'messages, senderId, and receiverId are required' },
        { status: 400 }
      );
    }

    const conversationText = messages.join('\n');

    const result = await zai.createChatCompletion({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: `Analyze this conversation and determine if the people are planning to meet up or attend an event together.

Conversation:
${conversationText}

If an event/plan is detected, return a JSON object with these fields:
{
  "title": "event title",
  "description": "brief description",
  "location": "location name or null",
  "lat": number or null,
  "lng": number or null,
  "date": "ISO date string or null"
}

If no event is detected, return: {"detected": false}

Return ONLY valid JSON, nothing else.`,
        },
      ],
    });

    const text = result.choices[0].message.content.trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ detected: false, event: null });
    }

    const parsed = JSON.parse(jsonMatch[0]);

    if (parsed.detected === false || !parsed.title) {
      return NextResponse.json({ detected: false, event: null });
    }

    const event: DetectedEvent = {
      title: parsed.title,
      description: parsed.description || '',
      location: parsed.location || null,
      lat: parsed.lat || null,
      lng: parsed.lng || null,
      date: parsed.date || null,
    };

    let eventId: string | undefined;

    // Create the event in the database if requested
    if (createEvent) {
      const createdEvent = await db.event.create({
        data: {
          title: event.title,
          description: event.description,
          location: event.location,
          lat: event.lat,
          lng: event.lng,
          startDate: event.date ? new Date(event.date) : new Date(),
          ownerId: 'test-user-1',
          isPublic: false,
        },
      });

      // Auto-RSVP the creator
      await db.eventRSVP.create({
        data: {
          userId: 'test-user-1',
          eventId: createdEvent.id,
          status: 'going',
        },
      });

      eventId = createdEvent.id;
    }

    return NextResponse.json({
      detected: true,
      event,
      eventId,
    });
  } catch (error) {
    console.error('Event detect error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
