import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

// Deterministic hash for consistent mock data per user pair
function pairHash(a: string, b: string): number {
  const sorted = [a, b].sort();
  let hash = 0;
  const str = sorted.join('::');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

const INTENTS = ['dating', 'casual', 'friendship', 'networking', 'uncertain'] as const;
const INTENT_LABELS: Record<string, string> = {
  dating: 'Romantic / Dating',
  casual: 'Casual Hookup',
  friendship: 'Friendship',
  networking: 'Networking',
  uncertain: 'Uncertain',
};

const SUMMARY_TEMPLATES: Record<string, string[]> = {
  dating: [
    'The conversation shows strong romantic interest from both sides. Topics frequently revolve around shared values, future plans, and emotional connection. Both users have exchanged personal stories and show genuine curiosity about each other\'s lives.',
    'There\'s a clear dating vibe here — frequent compliments, questions about relationship preferences, and playful flirting. They\'ve discussed favorite date spots and shared music tastes, suggesting good chemistry.',
    'This conversation has a warm, romantic tone with both participants sharing deeply personal thoughts. They\'ve moved past small talk into meaningful discussions about life goals and what they\'re looking for in a partner.',
  ],
  casual: [
    'The conversation has a casual, flirtatious energy. Topics are light and fun with occasional suggestive comments. Both users seem comfortable with a no-strings-attached dynamic and keep things playful.',
    'Lots of teasing and innuendo in this chat. The vibe is relaxed and physical — they\'ve talked about late-night plans and hanging out. Neither has brought up commitment or deep emotional topics.',
    'Very casual and direct communication style. They\'re both being upfront about what they want and the conversation moves quickly from introductions to making plans to meet up.',
  ],
  friendship: [
    'A genuinely friendly conversation where both users bonded over shared hobbies and interests. The tone is supportive and platonic, with lots of laughter and mutual encouragement.',
    'These two hit it off as friends — they\'ve exchanged recommendations for restaurants, shows, and local spots. The conversation feels natural and easygoing without romantic pressure.',
    'Great friend potential here. They share similar social circles and have been discussing group activities and community events. The vibe is wholesome and community-oriented.',
  ],
  networking: [
    'The conversation is professionally oriented with both users discussing career goals, industry connections, and potential collaborations. They share similar professional backgrounds and interests.',
    'Networking vibes — they\'ve exchanged LinkedIn-style info, discussed industry events, and explored mutual professional contacts. The tone is respectful and business-casual.',
    'This conversation leans professional with discussions about creative projects, portfolio work, and industry opportunities. Both seem interested in how they might help each other\'s careers.',
  ],
  uncertain: [
    'Mixed signals in this conversation. The tone shifts between friendly and flirtatious, making it hard to determine the primary intent. Both users seem to be feeling each other out.',
    'The conversation is still in early stages with a lot of small talk. Neither user has clearly indicated their intentions yet, though there are hints of friendliness and mild interest.',
    'Hard to read — the conversation jumps between casual banter, deeper questions, and periods of silence. The intent could go either way depending on how things develop.',
  ],
};

const REPLY_TEMPLATES: Record<string, string[]> = {
  dating: [
    'I\'d love to hear more about that — you seem really passionate about it. Maybe we could grab coffee this weekend and continue the conversation?',
    'That\'s so interesting! I feel like we have a lot in common. What\'s your ideal Friday night look like?',
    'Haha, I love that. You know, I\'ve been wanting to check out that new place downtown — would you want to go together sometime?',
    'You\'re easy to talk to. I don\'t usually open up this quickly, but something about this feels right. Tell me more about yourself.',
    'That\'s really sweet of you to say. I\'ve been looking for someone who actually listens. What are you up to later?',
  ],
  casual: [
    'Sounds fun! I\'m free later tonight if you\'re around 🙃',
    'You\'re trouble, I can tell already 😏 When are you free to hang out?',
    'Love the confidence. What\'s your schedule looking like this week?',
    'Hmm, I might need to see that in person to believe it 😄',
    'You\'re pretty straightforward, I appreciate that. Let\'s make a plan.',
  ],
  friendship: [
    'Oh nice! We should totally go together. Have you been to the one on 5th Ave?',
    'Dude, that\'s awesome! I\'ve been wanting to try that too. We should make a group outing out of it.',
    'Haha, same! We definitely need to hang out. Are you going to that event next weekend?',
    'That\'s so cool. I actually know someone who does that — I should introduce you guys!',
    'Love that energy! We should start a group chat and plan something fun.',
  ],
  networking: [
    'That\'s a great connection to have. Would you mind if I asked for an introduction?',
    'I\'d love to collaborate on that. Let\'s set up a call this week to discuss the details.',
    'Your portfolio is really impressive. I think there\'s a lot of potential for us to work together.',
    'Thanks for sharing that resource! I\'ll check it out. Do you have any other recommendations?',
    'That\'s exactly the kind of project I\'ve been looking for. Let\'s exchange emails and keep in touch.',
  ],
  uncertain: [
    'That\'s cool! Tell me more about what you\'re into these days.',
    'Haha, nice. So what brings you to the app — just checking things out?',
    'I\'m enjoying our chat! What do you usually do for fun around here?',
    'Interesting! I feel like we\'re just getting to know each other. What\'s your story?',
    'That\'s a good point. So what are you looking for on here, if you don\'t mind me asking?',
  ],
};

const MEETUP_TEMPLATES: Record<string, string[]> = {
  dating: [
    'Sunset picnic at the park with wine and a playlist you both curate together',
    'Rooftop cocktail bar followed by a moonlit walk along the waterfront',
    'Cooking dinner together — one of you picks the recipe, the other brings the ingredients',
    'Visit a local art gallery or museum, then grab dessert at a nearby café',
    'Weekend farmer\'s market date followed by cooking whatever looks fresh together',
  ],
  casual: [
    'Late-night drinks at a speakeasy bar with dim lighting and great music',
    'Meet up for a casual drink and see where the night takes you',
    'Happy hour at that new spot downtown, then maybe hit a club after',
    'Grab a drink at a laid-back lounge — keep it low-key and no pressure',
    'Check out a live DJ set at a local venue and see if the vibe is right',
  ],
  friendship: [
    'Check out a local drag show or comedy night together',
    'Group trivia night at a queer-friendly bar with friends',
    'Weekend hike or outdoor activity followed by brunch',
    'Volunteer together at a local LGBTQ+ community event',
    'Explore a new neighborhood — pop into shops, grab street food, people-watch',
  ],
  networking: [
    'Grab coffee at a quiet café and exchange ideas about your projects',
    'Attend a local industry meetup or networking event together',
    'Co-working session at a shared workspace followed by lunch',
    'Professional lunch at a nice restaurant to discuss potential collaborations',
    'Attend a conference or workshop together in your shared field',
  ],
  uncertain: [
    'Casual coffee meet-up — no pressure, just see if you click in person',
    'Check out a local event or exhibition that you both find interesting',
    'Dog park hangout if either of you has a pup — instant icebreaker',
    'Try a new restaurant or food spot that neither of you has been to',
    'Go for a walk in a scenic area and chat — the simplest first meet',
  ],
};

// POST /api/chat/ai-analyze - analyze a conversation with mock AI
// Body: { userId?: string, otherUserId: string }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otherUserId } = body;
    const userId = body.userId || USER_ID;

    if (!otherUserId) {
      return NextResponse.json({ error: 'otherUserId is required' }, { status: 400 });
    }

    // Fetch messages between the two users for context
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

    // Generate deterministic mock data based on user pair
    const hash = pairHash(userId, otherUserId);
    const intentIndex = hash % INTENTS.length;
    const intent = INTENTS[intentIndex];
    const quality = 40 + (hash % 61); // 40-100
    const messageCount = messages.length;

    // Pick templates deterministically
    const summaryIdx = hash % 3;
    const replyBase = (hash % 5);
    const meetupBase = (hash % 5);

    const summary = SUMMARY_TEMPLATES[intent][summaryIdx];
    const suggestedReplies = [
      REPLY_TEMPLATES[intent][(replyBase) % REPLY_TEMPLATES[intent].length],
      REPLY_TEMPLATES[intent][(replyBase + 1) % REPLY_TEMPLATES[intent].length],
      REPLY_TEMPLATES[intent][(replyBase + 2) % REPLY_TEMPLATES[intent].length],
    ];
    const meetupIdeas = [
      MEETUP_TEMPLATES[intent][(meetupBase) % MEETUP_TEMPLATES[intent].length],
      MEETUP_TEMPLATES[intent][(meetupBase + 1) % MEETUP_TEMPLATES[intent].length],
      MEETUP_TEMPLATES[intent][(meetupBase + 2) % MEETUP_TEMPLATES[intent].length],
    ];

    // Adjust quality based on actual message count
    const adjustedQuality = messageCount === 0
      ? 0
      : messageCount < 5
        ? Math.min(quality, 30 + (messageCount * 8))
        : quality;

    return NextResponse.json({
      data: {
        userId,
        otherUserId,
        intent,
        intentLabel: INTENT_LABELS[intent],
        quality: adjustedQuality,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
