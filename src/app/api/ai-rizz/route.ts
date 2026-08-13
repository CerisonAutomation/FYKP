import { NextRequest, NextResponse } from 'next/server';

// Mock pickup lines organized by style
const pickupLines: Record<string, string[]> = {
  romantic: [
    "Are you a magician? Because every time I look at you, everyone else disappears.",
    "If I could rearrange the alphabet, I'd put U and I together.",
    "Do you have a map? I keep getting lost in your eyes.",
    "I must be a snowflake, because I've fallen for you.",
    "If you were a flower, you'd be a damnnn-delion.",
  ],
  funny: [
    "Are you French? Because Eiffel for you.",
    "Do you have a Band-Aid? Because I just scraped my knee falling for you.",
    "I'm not a photographer, but I can definitely picture us together.",
    "Are you an airport security? Because you're making my heart race.",
    "I'd tell you a chemistry joke, but we'd have good chemistry anyway.",
  ],
  bold: [
    "I usually go for 8s, but I guess I'll settle for a 10 tonight.",
    "You look like someone who appreciates the finer things. Let's skip the small talk.",
    "I wasn't planning on talking to anyone tonight, but you changed that in 0.2 seconds.",
    "Your profile caught my eye, and now I can't look away.",
    "Life's too short for boring conversations. Let's make this interesting.",
  ],
  nerdy: [
    "Are you a keyboard? Because you're my type.",
    "You must be made of copper and tellurium, because you're CuTe.",
    "I'd like to integrate our functions—if you know what I mean.",
    "You're the CSS to my HTML—without you, I'm just plain.",
    "If beauty were a bug, you'd be a zero-day exploit I'd never patch.",
  ],
  sweet: [
    "I noticed your smile from across the grid, and I had to say hi.",
    "There's something about your energy that just draws me in.",
    "I don't usually message first, but you're worth the risk.",
    "Your bio made me smile, and I thought you should know.",
    "I came here hoping to find someone genuine, and then I found you.",
  ],
  flirty: [
    "I was going to play it cool, but your photos said otherwise.",
    "If we were at a coffee shop, I'd already be asking about your weekend plans.",
    "On a scale of 1 to 10, you're an 11 and I'm not even exaggerating.",
    "Something tells me our conversation would be even better in person.",
    "I usually swipe left on most people, but you made me stop scrolling.",
  ],
};

// POST /api/ai-rizz - generate AI pickup line
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { targetBio = '', style = 'sweet' } = body;

    // Select lines for the requested style, fallback to sweet
    const lines = pickupLines[style] || pickupLines['sweet'];

    // Pick a random line
    const randomLine = lines[Math.floor(Math.random() * lines.length)];

    // Build a personalized context message
    const bioSnippet = targetBio
      ? `Based on "${targetBio.slice(0, 80)}${targetBio.length > 80 ? '...' : ''}"`
      : 'Here\'s a great opening line';

    return NextResponse.json({
      data: {
        line: randomLine,
        style,
        context: bioSnippet,
        alternatives: lines.filter((l) => l !== randomLine).slice(0, 2),
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
