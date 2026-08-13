import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

const USER_ID = 'test-user-1';

// Seed events — returns mock events plus any real events from DB
const MOCK_EVENTS = [
  // Pride Events
  {
    id: 'evt-pride-1',
    title: 'Pride Festival 2025',
    description: 'The city\'s biggest annual Pride celebration with main stage performances, community booths, food vendors, and the iconic parade. All ages welcome.',
    location: 'Downtown Civic Center Plaza',
    lat: 40.7128,
    lng: -74.006,
    startDate: '2025-08-15T10:00:00Z',
    endDate: '2025-08-15T23:00:00Z',
    imageUrl: null,
    type: 'social',
    attendeeCount: 4520,
    isPublic: true,
  },
  {
    id: 'evt-pride-2',
    title: 'Pride Beach Party',
    description: 'Sun, sand, and celebration! DJ sets on the beach, cocktail bar, and a sunset drag show. Beachwear encouraged.',
    location: 'Ocean Beach South Pavilion',
    lat: 40.5731,
    lng: -73.9712,
    startDate: '2025-08-16T12:00:00Z',
    endDate: '2025-08-16T21:00:00Z',
    imageUrl: null,
    type: 'party',
    attendeeCount: 890,
    isPublic: true,
  },
  {
    id: 'evt-pride-3',
    title: 'Trans Pride March & Rally',
    description: 'Standing with our trans siblings. March, rally, and community gathering with speakers and live music.',
    location: 'Harvey Milk Park to City Hall',
    lat: 40.7282,
    lng: -73.7949,
    startDate: '2025-08-20T14:00:00Z',
    endDate: '2025-08-20T19:00:00Z',
    imageUrl: null,
    type: 'social',
    attendeeCount: 1250,
    isPublic: true,
  },

  // Club Nights
  {
    id: 'evt-club-1',
    title: 'NEON — Weekly Gay Night',
    description: 'The city\'s longest-running gay club night. Three floors of music: pop anthems on the main floor, house in the basement, and R&B in the lounge.',
    location: 'The Warehouse Club',
    lat: 40.7336,
    lng: -74.0027,
    startDate: '2025-07-18T22:00:00Z',
    endDate: '2025-07-19T04:00:00Z',
    imageUrl: null,
    type: 'party',
    attendeeCount: 420,
    isPublic: true,
  },
  {
    id: 'evt-club-2',
    title: 'BEAR NIGHT — Fur & Fitness',
    description: 'Monthly bear community party with a special fitness theme. Dress code: gym wear, leather, or nothing at all. Go-go dancers all night.',
    location: 'The Eagle',
    lat: 40.7218,
    lng: -73.9882,
    startDate: '2025-07-19T21:00:00Z',
    endDate: '2025-07-20T05:00:00Z',
    imageUrl: null,
    type: 'party',
    attendeeCount: 280,
    isPublic: true,
  },
  {
    id: 'evt-club-3',
    title: 'DIY Queer Disco',
    description: 'Underground disco party with a queer twist. Vintage decor, 70s and 80s classics, and a legendary drag DJ set.',
    location: 'Secret Location (revealed day-of)',
    lat: 40.7489,
    lng: -73.9680,
    startDate: '2025-07-20T23:00:00Z',
    endDate: '2025-07-21T04:00:00Z',
    imageUrl: null,
    type: 'party',
    attendeeCount: 150,
    isPublic: true,
  },
  {
    id: 'evt-club-4',
    title: 'SWEAT — Circuit Party',
    description: 'High-energy circuit party with international DJs, laser shows, and a massive sound system. The ultimate weekend party experience.',
    location: 'Skyline Arena',
    lat: 40.7527,
    lng: -73.9772,
    startDate: '2025-08-02T23:00:00Z',
    endDate: '2025-08-03T08:00:00Z',
    imageUrl: null,
    type: 'party',
    attendeeCount: 1800,
    isPublic: true,
  },

  // Beach / Outdoor
  {
    id: 'evt-beach-1',
    title: 'Queer Volleyball Tournament',
    description: 'Annual LGBTQ+ beach volleyball tournament. Teams of 4-6. All skill levels welcome. Prizes for best team name and spirit!',
    location: 'Jacob Riis Beach',
    lat: 40.5633,
    lng: -73.8348,
    startDate: '2025-07-26T09:00:00Z',
    endDate: '2025-07-26T17:00:00Z',
    imageUrl: null,
    type: 'sports',
    attendeeCount: 200,
    isPublic: true,
  },
  {
    id: 'evt-beach-2',
    title: 'Sunset Beach Social',
    description: 'Casual beach hangout with a bonfire, s\'mores, and an acoustic set. Bring a blanket and your favorite beverage.',
    location: 'Fire Island Pines Beach',
    lat: 40.6483,
    lng: -72.9595,
    startDate: '2025-07-27T17:00:00Z',
    endDate: '2025-07-27T23:00:00Z',
    imageUrl: null,
    type: 'social',
    attendeeCount: 75,
    isPublic: true,
  },

  // Speed Dating
  {
    id: 'evt-dating-1',
    title: 'Speed Dating: 25-35 Age Group',
    description: 'Meet 10-12 guys in one evening. 5-minute dates with a structured break. Complimentary drink included with ticket.',
    location: 'The Quill Lounge',
    lat: 40.7411,
    lng: -73.9897,
    startDate: '2025-07-22T19:00:00Z',
    endDate: '2025-07-22T22:00:00Z',
    imageUrl: null,
    type: 'meetup',
    attendeeCount: 24,
    isPublic: true,
  },
  {
    id: 'evt-dating-2',
    title: 'Speed Dating: Bears & Cubs',
    description: 'Speed dating night for the bear community. 6-minute dates in a cozy, low-pressure environment. Private seating area.',
    location: 'Woody\'s Bar',
    lat: 40.7350,
    lng: -73.9910,
    startDate: '2025-07-29T19:30:00Z',
    endDate: '2025-07-29T22:30:00Z',
    imageUrl: null,
    type: 'meetup',
    attendeeCount: 20,
    isPublic: true,
  },
  {
    id: 'evt-dating-3',
    title: 'Queer Speed Friending',
    description: 'Not looking for romance? Make new queer friends! Rotating small group conversations with fun icebreaker prompts.',
    location: 'Brew & Bond Café',
    lat: 40.7282,
    lng: -73.9902,
    startDate: '2025-08-03T15:00:00Z',
    endDate: '2025-08-03T18:00:00Z',
    imageUrl: null,
    type: 'meetup',
    attendeeCount: 30,
    isPublic: true,
  },

  // Drag Shows
  {
    id: 'evt-drag-1',
    title: 'Drag Bingo Night',
    description: 'Campy drag-hosted bingo with hilarious prizes and shade. Hosted by local legend Monique Heartbreak. $5 cards at the door.',
    location: 'Stonewall Inn',
    lat: 40.7337,
    lng: -74.0005,
    startDate: '2025-07-21T20:00:00Z',
    endDate: '2025-07-21T23:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 120,
    isPublic: true,
  },
  {
    id: 'evt-drag-2',
    title: 'DRAG RACE WATCH PARTY',
    description: 'Watch the latest episode on the big screen with a live drag performance at intermission. Drink specials all night.',
    location: 'Ricky\'s Bar',
    lat: 40.7425,
    lng: -73.9885,
    startDate: '2025-07-24T20:00:00Z',
    endDate: '2025-07-24T23:30:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 85,
    isPublic: true,
  },
  {
    id: 'evt-drag-3',
    title: 'All Kings Drag King Showcase',
    description: 'An evening celebrating drag kings and masculine performance art. Features local and touring performers.',
    location: 'The Slipper Room',
    lat: 40.7213,
    lng: -73.9888,
    startDate: '2025-08-01T20:30:00Z',
    endDate: '2025-08-02T00:30:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 65,
    isPublic: true,
  },

  // Movie Nights
  {
    id: 'evt-movie-1',
    title: 'Queer Film Club: Moonlight',
    description: 'Screening of Barry Jenkins\' masterwork followed by a group discussion. Popcorn and drinks provided.',
    location: 'The Rainbow Cinema',
    lat: 40.7295,
    lng: -73.9935,
    startDate: '2025-07-23T19:00:00Z',
    endDate: '2025-07-23T22:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 40,
    isPublic: true,
  },
  {
    id: 'evt-movie-2',
    title: 'Rooftop Movie Night: Call Me By Your Name',
    description: 'Open-air screening under the stars. Bring a blanket. Italian-themed snacks and wine available for purchase.',
    location: 'Sky Terrace Rooftop',
    lat: 40.7484,
    lng: -73.9857,
    startDate: '2025-08-09T20:00:00Z',
    endDate: '2025-08-09T23:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 55,
    isPublic: true,
  },

  // Group Dinners
  {
    id: 'evt-dinner-1',
    title: 'Queer Supper Club',
    description: 'Monthly community dinner at a different restaurant each time. This month: authentic Thai cuisine. Prix fixe menu $45.',
    location: 'Siam Garden Restaurant',
    lat: 40.7262,
    lng: -73.9975,
    startDate: '2025-07-25T19:00:00Z',
    endDate: '2025-07-25T22:00:00Z',
    imageUrl: null,
    type: 'social',
    attendeeCount: 16,
    isPublic: true,
  },
  {
    id: 'evt-dinner-2',
    title: 'Sunday Brunch Bunch',
    description: 'Weekly casual brunch for queer guys who love food and conversation. Bottomless mimosas optional.',
    location: 'Café Flora',
    lat: 40.7340,
    lng: -73.9910,
    startDate: '2025-07-20T11:00:00Z',
    endDate: '2025-07-20T14:00:00Z',
    imageUrl: null,
    type: 'social',
    attendeeCount: 12,
    isPublic: true,
  },

  // Sports
  {
    id: 'evt-sports-1',
    title: 'Gay Rugby Scrimmage & Social',
    description: 'Open scrimmage followed by drinks at the sponsor bar. All fitness levels welcome. Gear provided.',
    location: 'Riverside Park Field 4',
    lat: 40.8010,
    lng: -73.9690,
    startDate: '2025-07-27T10:00:00Z',
    endDate: '2025-07-27T14:00:00Z',
    imageUrl: null,
    type: 'sports',
    attendeeCount: 35,
    isPublic: true,
  },
  {
    id: 'evt-sports-2',
    title: 'Queer Running Club: 5K Fun Run',
    description: 'Monthly fun run through the park. All paces welcome. Post-run coffee at the finish line.',
    location: 'Prospect Park - Grand Army Plaza',
    lat: 40.6710,
    lng: -73.9690,
    startDate: '2025-08-10T08:00:00Z',
    endDate: '2025-08-10T10:00:00Z',
    imageUrl: null,
    type: 'sports',
    attendeeCount: 60,
    isPublic: true,
  },
  {
    id: 'evt-sports-3',
    title: 'LGBTQ+ Swim Night',
    description: 'Exclusive swim session at the community pool. Water volleyball, lap swimming, and poolside socializing.',
    location: 'Aqua Center Community Pool',
    lat: 40.7450,
    lng: -73.9920,
    startDate: '2025-08-07T19:00:00Z',
    endDate: '2025-08-07T21:30:00Z',
    imageUrl: null,
    type: 'sports',
    attendeeCount: 45,
    isPublic: true,
  },

  // Cultural
  {
    id: 'evt-culture-1',
    title: 'Queer Book Club: Giovanni\'s Room',
    description: 'Discussing James Baldwin\'s classic. New members always welcome. Coffee and pastries provided.',
    location: 'The Literary Loft',
    lat: 40.7300,
    lng: -73.9910,
    startDate: '2025-07-28T18:30:00Z',
    endDate: '2025-07-28T21:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 15,
    isPublic: true,
  },
  {
    id: 'evt-culture-2',
    title: 'LGBTQ+ History Walking Tour',
    description: 'Guided tour of historic LGBTQ+ landmarks including Stonewall, the LGBT Community Center, and Christopher Street.',
    location: 'Christopher Street Station (meetup)',
    lat: 40.7337,
    lng: -74.0005,
    startDate: '2025-08-05T14:00:00Z',
    endDate: '2025-08-05T17:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 25,
    isPublic: true,
  },
  {
    id: 'evt-culture-3',
    title: 'Queer Art Exhibition Opening',
    description: 'Opening night of "Boundless" — a group show featuring 12 queer artists working in mixed media. Wine reception included.',
    location: 'The OUT Gallery',
    lat: 40.7240,
    lng: -73.9950,
    startDate: '2025-08-08T18:00:00Z',
    endDate: '2025-08-08T21:00:00Z',
    imageUrl: null,
    type: 'cultural',
    attendeeCount: 90,
    isPublic: true,
  },
];

// GET /api/events/upcoming - return events sorted by startDate with optional type filter
// Query params: ?type=social|party|meetup|sports|cultural
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const typeFilter = searchParams.get('type');

    // Fetch real events from DB
    const whereClause: Record<string, unknown> = { isPublic: true };
    if (typeFilter) {
      whereClause.type = typeFilter;
    }

    const dbEvents = await db.event.findMany({
      where: whereClause,
      orderBy: { startDate: 'asc' },
    });

    // Map DB events to consistent format
    const formattedDbEvents = dbEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      location: e.location,
      lat: e.lat,
      lng: e.lng,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString() || null,
      imageUrl: e.imageUrl,
      type: e.type,
      attendeeCount: e.attendeeCount,
      isPublic: e.isPublic,
    }));

    // Combine with mock events
    let allEvents = [...MOCK_EVENTS, ...formattedDbEvents];

    // Apply type filter to mock events too
    if (typeFilter) {
      allEvents = allEvents.filter((e) => e.type === typeFilter);
    }

    // Sort by startDate ascending
    allEvents.sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    // Build type counts
    const typeCounts: Record<string, number> = {};
    for (const e of [...MOCK_EVENTS, ...formattedDbEvents]) {
      typeCounts[e.type] = (typeCounts[e.type] || 0) + 1;
    }

    return NextResponse.json({
      data: allEvents,
      total: allEvents.length,
      typeCounts,
      filter: typeFilter || null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
