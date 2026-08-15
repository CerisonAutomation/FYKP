import { db } from '../src/lib/db';

const AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=400&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
];

const NAMES = [
  'Alex Rivera', 'Marcus Chen', 'Jordan Hayes', 'Kai Nakamura', 'Liam O\'Brien',
  'Diego Santos', 'Noah Kim', 'Ethan Brooks', 'Oscar Martinez', 'Felix Lindqvist',
  'Ravi Patel', 'Sasha Volkov', 'Marco Bianchi', 'Andre Williams', 'Yuki Tanaka',
  'Lucas Ferreira', 'Miles Johnson', 'Zane Cooper', 'Theo Anderson', 'Colin Murphy',
];

const BIOS = [
  'Looking for genuine connections. Coffee lover and sunset chaser.',
  'Gym rat by day, foodie by night. Let\'s grab a drink.',
  'Traveling the world one city at a time. 30 countries and counting.',
  'Artist and musician. Looking for someone who appreciates the little things.',
  'Tech nerd with a wild side. Dog dad x2.',
  'Professional chef who loves to cook for the right person.',
  'Photographer looking for my next muse.',
  'Yoga instructor, plant dad, and aspiring polyglot.',
  'Moved here recently. Show me your favorite spots?',
  'Bookworm, gamer, and amateur astronomer.',
  'Fitness competitor training for my next show. Discipline is everything.',
  'DJ and music producer. I\'ll make you a playlist.',
  'Surfing, hiking, and everything outdoors. Adventure buddy wanted.',
  'Med student by day, dancer by night.',
  'Architect who sees beauty in structure and chaos.',
  'Film buff. Let\'s debate cinema over wine.',
  'Startup founder. Busy but I make time for the right person.',
  'Motorcycle enthusiast. Born to be wild, looking to settle down.',
  'Bartender who knows all the best spots in town.',
  'Personal trainer. Let\'s work out together sometime.',
];

const LOCATIONS = [
  'Valletta, Malta', 'Sliema, Malta', 'St. Julian\'s, Malta', 'Mdina, Malta', 'Gzira, Malta',
  'London, UK', 'Berlin, Germany', 'Barcelona, Spain', 'Paris, France', 'Milan, Italy',
  'Amsterdam, Netherlands', 'Stockholm, Sweden', 'Lisbon, Portugal', 'Athens, Greece', 'Dublin, Ireland',
  'Tokyo, Japan', 'Sydney, Australia', 'New York, USA', 'Toronto, Canada', 'São Paulo, Brazil',
];

const GENDERS = ['male', 'male', 'male', 'male', 'non-binary', 'non-binary'];
const LOOKING_FOR = ['relationship', 'casual', 'friends', 'networking', 'not-specified', 'relationship'];
const BODY_TYPES = ['athletic', 'average', 'slim', 'muscular', 'curvy', 'stocky'];
const POSITIONS = ['top', 'bottom', 'versatile', 'side', 'not-specified'];
const RELATIONSHIP_STATUSES = ['single', 'single', 'single', 'open-relationship', 'divorced'];
const ETHNICITIES = ['white', 'asian', 'latino', 'black', 'mixed', 'middle-eastern', 'indian', 'other'];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Seeding database...');

  // ═══ PRODUCTION TEST USER (test-user-1) ═══
  const testUser = await db.user.create({
    data: {
      id: 'test-user-1',
      username: 'nexus_test',
      displayName: 'NEXUS Test',
      email: 'test@nexus.app',
      passwordHash: 'hashed_test',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop&crop=face',
      bio: 'Production test account. Full access to all features. DM me!',
      age: 28,
      gender: 'male',
      location: 'Valletta, Malta',
      lat: 35.8989,
      lng: 14.5146,
      geoCity: 'Valletta',
      geoRegion: 'Central Region',
      geoCountry: 'Malta',
      geoAccuracy: 15.0,
      online: true,
      lastSeen: new Date(),
      isPremium: true,
      premiumExpiry: new Date(Date.now() + 86400000 * 365),
      isVerified: true,
      verificationStatus: 'verified',
      showOnline: true,
      showDistance: true,
      showAge: true,
      showActivity: true,
      hidePicsOffline: false,
      lookingFor: 'relationship',
      aboutMe: 'Full-stack developer and fitness enthusiast. Love exploring new cities, trying new cuisines, and deep conversations at 2am. Currently based in Malta, originally from the US. Looking for something real — no games, no drama.',
      height: 182,
      weight: 78,
      ethnicity: 'white',
      bodyType: 'athletic',
      relationshipStatus: 'single',
      position: 'versatile',
      hivStatus: 'negative',
      pronouns: 'he/him',
      displayUnits: 'metric',
      lang: 'en',
      isProfessional: false,
      professionalStatus: 'none',
      // Travel Mode
      isTraveling: true,
      travelCity: 'Berlin',
      travelCountry: 'Germany',
      travelLat: 52.5200,
      travelLng: 13.4050,
      travelStart: new Date(Date.now() - 86400000 * 2),
      travelEnd: new Date(Date.now() + 86400000 * 5),
      // DND Schedule
      dndEnabled: true,
      dndStart: '22:00',
      dndEnd: '08:00',
      // Hashtags
      hashtags: 'travel,gym,malta,coffee-lover,developer',
    },
  });
  console.log('Created test user:', testUser.id);

  // Test user photos
  for (let j = 0; j < 5; j++) {
    await db.photo.create({
      data: { url: AVATARS[j], userId: testUser.id, sortOrder: j, isPrivate: j >= 4 },
    });
  }

  // Test user albums
  const album1 = await db.album.create({ data: { name: 'Travel Photos', isPrivate: false, userId: testUser.id } });
  const album2 = await db.album.create({ data: { name: 'Private Collection', isPrivate: true, userId: testUser.id } });
  await db.photo.create({ data: { url: AVATARS[6], userId: testUser.id, albumId: album1.id, sortOrder: 0 } });
  await db.photo.create({ data: { url: AVATARS[7], userId: testUser.id, albumId: album1.id, sortOrder: 1 } });
  await db.photo.create({ data: { url: AVATARS[8], userId: testUser.id, albumId: album2.id, sortOrder: 0, isPrivate: true } });

  // Test user verification
  await db.verification.create({
    data: { userId: testUser.id, type: 'age', status: 'verified', submittedAt: new Date(Date.now() - 86400000 * 30), reviewedAt: new Date(Date.now() - 86400000 * 28) },
  });

  // Test user subscription
  await db.subscription.create({
    data: { userId: testUser.id, tier: 'premium', startDate: new Date(Date.now() - 86400000 * 180), endDate: new Date(Date.now() + 86400000 * 185), isActive: true, paymentMethod: 'stripe' },
  });

  // Test user session
  await db.userSession.create({
    data: { userId: testUser.id, device: 'Chrome', platform: 'Web', ip: '192.168.1.1', isActive: true, lastSeen: new Date() },
  });

  // ═══ 20 DEMO USERS ═══
  const userIds: string[] = [testUser.id];
  for (let i = 0; i < 20; i++) {
    const user = await db.user.create({
      data: {
        username: `user_${i + 1}`,
        displayName: NAMES[i],
        email: `user${i + 1}@nexus.app`,
        passwordHash: 'hashed_' + i,
        avatar: AVATARS[i],
        bio: BIOS[i],
        age: randInt(21, 42),
        gender: rand(GENDERS),
        location: LOCATIONS[i],
        lat: 35.8989 + (Math.random() - 0.5) * 0.2,
        lng: 14.5146 + (Math.random() - 0.5) * 0.2,
        geoCity: LOCATIONS[i].split(', ')[0],
        geoCountry: LOCATIONS[i].split(', ')[1] || 'Malta',
        online: Math.random() > 0.4,
        lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7),
        isPremium: Math.random() > 0.7,
        isVerified: Math.random() > 0.5,
        lookingFor: rand(LOOKING_FOR),
        aboutMe: BIOS[i],
        height: randInt(165, 195),
        weight: randInt(60, 100),
        ethnicity: rand(ETHNICITIES),
        bodyType: rand(BODY_TYPES),
        relationshipStatus: rand(RELATIONSHIP_STATUSES),
        position: rand(POSITIONS),
        pronouns: rand(['he/him', 'he/they', 'they/them', 'she/her']),
        verificationStatus: Math.random() > 0.5 ? 'verified' : 'none',
        hashtags: i % 3 === 0 ? ['fitness,travel,music', 'gym,foodie,nightlife', 'art,photography,nature', 'tech,gaming,coffee', 'dance,yoga,wellness', 'surfing,hiking,outdoors'][i % 6] : null,
      },
    });
    userIds.push(user.id);

    const photoCount = randInt(2, 5);
    for (let j = 0; j < photoCount; j++) {
      await db.photo.create({
        data: { url: AVATARS[(i + j) % AVATARS.length], userId: user.id, sortOrder: j, isPrivate: j === photoCount - 1 && Math.random() > 0.6 },
      });
    }
  }

  const otherUsers = userIds.slice(1);

  // Messages (with test user involved)
  for (let i = 0; i < 80; i++) {
    const s = i < 30 ? testUser.id : rand(otherUsers);
    let r = rand(otherUsers);
    while (r === s) r = rand(otherUsers);
    await db.message.create({
      data: {
        content: ['Hey! How are you?', 'Nice profile! Love your vibe.', 'Want to grab coffee sometime?', 'Just moved to the area, any recommendations?', 'Your photos are stunning!', 'Love the bio! We should talk.', 'What are you up to this weekend?', 'Great taste in music!', 'That sunset photo is amazing', 'Running partner?', 'Working out later? Join me!', 'I love your style', 'What\'s your favorite restaurant around here?', 'We have so much in common!', 'Let\'s meet up this weekend?', 'Your travel photos are incredible', 'Do you come here often? 😄', 'I\'m new to the app, say hi!', 'Cute dog! What breed?', 'Morning workout crew?'][randInt(0, 19)],
        senderId: s, receiverId: r,
        isRead: Math.random() > 0.5,
        type: Math.random() > 0.85 ? 'image' : 'text',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 14),
      },
    });
  }

  // Likes (many sent TO test user)
  for (let i = 0; i < 60; i++) {
    const s = i < 20 ? rand(otherUsers) : rand(userIds);
    let r = i < 20 ? testUser.id : rand(otherUsers);
    while (r === s) r = rand(otherUsers);
    try { await db.like.create({ data: { senderId: s, receiverId: r } }); } catch {}
  }

  // Profile views (many ON test user)
  for (let i = 0; i < 80; i++) {
    const v = i < 40 ? rand(otherUsers) : rand(userIds);
    let t = i < 40 ? testUser.id : rand(otherUsers);
    while (t === v) t = rand(otherUsers);
    await db.profileView.create({ data: { viewerId: v, viewedId: t, createdAt: new Date(Date.now() - Math.random() * 86400000 * 7) } });
  }

  // Blocks
  for (let i = 0; i < 3; i++) {
    const b = rand(userIds); let d = rand(otherUsers); while (d === b) d = rand(otherUsers);
    try { await db.block.create({ data: { blockerId: b, blockedId: d, reason: 'Inappropriate behavior' } }); } catch {}
  }

  // Chat requests TO test user
  for (let i = 0; i < 5; i++) {
    try {
      await db.chatRequest.create({
        data: { senderId: otherUsers[i], receiverId: testUser.id, status: 'pending', message: 'Hey, would love to chat!', createdAt: new Date(Date.now() - Math.random() * 86400000 * 3) },
      });
    } catch {}
  }

  // Group chats
  const group1 = await db.groupChat.create({ data: { name: 'Malta Social', description: 'Meet new people in Malta', ownerId: testUser.id, isPublic: true, address: 'Valletta Waterfront', lat: 35.8989, lng: 14.5146, geoName: 'Valletta, Malta' } });
  await db.groupMember.createMany({ data: [testUser.id, ...otherUsers.slice(0, 7)].map((uid, idx) => ({ userId: uid, groupId: group1.id, role: idx === 0 ? 'owner' : idx < 3 ? 'admin' : 'member' })) });

  const group2 = await db.groupChat.create({ data: { name: 'Fitness Buddies', description: 'Gym partners and fitness motivation', ownerId: otherUsers[3], isPublic: true, tags: 'fitness,gym,health' } });
  await db.groupMember.createMany({ data: otherUsers.slice(3, 12).map((uid, idx) => ({ userId: uid, groupId: group2.id, role: idx === 0 ? 'owner' : 'member' })) });

  const group3 = await db.groupChat.create({ data: { name: 'Nightlife Crew', description: 'Weekend plans and party connections', ownerId: otherUsers[7], isPublic: false, tags: 'party,nightlife,social' } });
  await db.groupMember.createMany({ data: [otherUsers[7], otherUsers[2], otherUsers[5], otherUsers[11], otherUsers[15]].map((uid, idx) => ({ userId: uid, groupId: group3.id, role: idx === 0 ? 'owner' : 'member' })) });

  // Events (15 diverse events with types and attendee counts)
  const eventsData = [
    { title: 'Beach Party @ Golden Bay', description: 'Sun, sand, and good vibes. Bring your own drinks and sunscreen!', location: 'Golden Bay, Malta', lat: 35.9167, lng: 14.3333, startDate: new Date(Date.now() + 86400000 * 3), endDate: new Date(Date.now() + 86400000 * 3 + 36000000), ownerId: testUser.id, imageUrl: AVATARS[0], type: 'party', attendeeCount: 85, isPublic: true },
    { title: 'Pride Walk Valletta', description: 'Annual Pride march through the streets of Valletta. Everyone welcome! Meet at Freedom Square.', location: 'Valletta, Malta', lat: 35.8989, lng: 14.5146, startDate: new Date(Date.now() + 86400000 * 7), endDate: new Date(Date.now() + 86400000 * 7 + 14400000), ownerId: otherUsers[2], imageUrl: AVATARS[5], type: 'social', attendeeCount: 320, isPublic: true },
    { title: 'Speed Dating: 25-35', description: 'Meet 10-12 guys in one evening. 5-minute dates with a complimentary drink included.', location: "St. Julian's, Malta", lat: 35.9133, lng: 14.4967, startDate: new Date(Date.now() + 86400000 * 2), endDate: new Date(Date.now() + 86400000 * 2 + 10800000), ownerId: otherUsers[5], imageUrl: AVATARS[3], type: 'meetup', attendeeCount: 24, isPublic: true },
    { title: 'Drag Show @ The Alley', description: 'Weekly drag extravaganza featuring local and international queens. Doors at 10pm, show at 11pm.', location: 'Sliema, Malta', lat: 35.9117, lng: 14.4983, startDate: new Date(Date.now() + 86400000 * 1), endDate: new Date(Date.now() + 86400000 * 1 + 14400000), ownerId: otherUsers[8], imageUrl: AVATARS[8], type: 'cultural', attendeeCount: 65, isPublic: true },
    { title: 'Morning Yoga in the Park', description: 'Sunrise yoga session for all levels. Mats and water provided. Donation-based.', location: 'Floriana, Malta', lat: 35.8925, lng: 14.5083, startDate: new Date(Date.now() + 86400000 * 5), endDate: new Date(Date.now() + 86400000 * 5 + 3600000), ownerId: otherUsers[12], imageUrl: AVATARS[12], type: 'sports', attendeeCount: 18, isPublic: true },
    { title: 'Queer Tech Meetup', description: 'Networking for LGBTQ+ developers, designers, and tech professionals. Pizza provided!', location: 'Gzira, Malta', lat: 35.9067, lng: 14.4933, startDate: new Date(Date.now() + 86400000 * 10), endDate: new Date(Date.now() + 86400000 * 10 + 7200000), ownerId: testUser.id, imageUrl: AVATARS[16], type: 'meetup', attendeeCount: 35, isPublic: true },
    { title: 'Bear Night @ The Eagle', description: 'Monthly bear community party. Dress code: leather, gear, or nothing. Go-go dancers all night.', location: 'Paceville, Malta', lat: 35.9217, lng: 14.4833, startDate: new Date(Date.now() + 86400000 * 4), endDate: new Date(Date.now() + 86400000 * 5 + 21600000), ownerId: otherUsers[1], imageUrl: AVATARS[1], type: 'party', attendeeCount: 140, isPublic: true },
    { title: 'Queer Volleyball Tournament', description: 'Beach volleyball tournament. Teams of 4-6, all skill levels. Prizes for best team name!', location: 'St. George\'s Bay, Malta', lat: 35.9150, lng: 14.4850, startDate: new Date(Date.now() + 86400000 * 12), endDate: new Date(Date.now() + 86400000 * 12 + 28800000), ownerId: otherUsers[4], imageUrl: AVATARS[4], type: 'sports', attendeeCount: 48, isPublic: true },
    { title: 'Drag Bingo Night', description: 'Campy drag-hosted bingo with hilarious prizes. Hosted by local legend. $5 cards at the door.', location: 'Valletta, Malta', lat: 35.8975, lng: 14.5120, startDate: new Date(Date.now() + 86400000 * 6), endDate: new Date(Date.now() + 86400000 * 6 + 10800000), ownerId: otherUsers[9], imageUrl: AVATARS[9], type: 'cultural', attendeeCount: 55, isPublic: true },
    { title: 'Queer Book Club: Giovanni\'s Room', description: 'Discussing James Baldwin\'s classic. New members welcome. Coffee and pastries provided.', location: 'Mdina, Malta', lat: 35.8867, lng: 14.4050, startDate: new Date(Date.now() + 86400000 * 8), endDate: new Date(Date.now() + 86400000 * 8 + 7200000), ownerId: otherUsers[11], imageUrl: AVATARS[11], type: 'cultural', attendeeCount: 12, isPublic: true },
    { title: 'Sunset Beach Social', description: 'Casual beach hangout with a bonfire, snacks, and acoustic music. Bring a blanket and drinks.', location: 'Blue Lagoon, Comino', lat: 35.9700, lng: 14.3600, startDate: new Date(Date.now() + 86400000 * 9), endDate: new Date(Date.now() + 86400000 * 9 + 21600000), ownerId: otherUsers[14], imageUrl: AVATARS[14], type: 'social', attendeeCount: 30, isPublic: true },
    { title: 'LGBTQ+ Swim Night', description: 'Exclusive swim session at the community pool. Water volleyball, lap swimming, and poolside socializing.', location: 'Marsascala, Malta', lat: 35.8550, lng: 14.5400, startDate: new Date(Date.now() + 86400000 * 11), endDate: new Date(Date.now() + 86400000 * 11 + 9000000), ownerId: otherUsers[6], imageUrl: AVATARS[6], type: 'sports', attendeeCount: 40, isPublic: true },
    { title: 'Queer Supper Club', description: 'Monthly community dinner. This month: authentic Maltese cuisine at a hidden gem restaurant. Prix fixe €35.', location: 'Birgu, Malta', lat: 35.8930, lng: 14.5190, startDate: new Date(Date.now() + 86400000 * 14), endDate: new Date(Date.now() + 86400000 * 14 + 10800000), ownerId: otherUsers[15], imageUrl: AVATARS[15], type: 'social', attendeeCount: 16, isPublic: true },
    { title: 'Circuit Party: NEON', description: 'High-energy circuit party with international DJs, laser shows, and massive sound system. Dress to impress.', location: 'Paceville, Malta', lat: 35.9220, lng: 14.4810, startDate: new Date(Date.now() + 86400000 * 15), endDate: new Date(Date.now() + 86400000 * 16 + 28800000), ownerId: otherUsers[7], imageUrl: AVATARS[7], type: 'party', attendeeCount: 250, isPublic: true },
    { title: 'Queer Running Club: 5K', description: 'Monthly fun run through Valletta. All paces welcome. Post-run coffee at the finish line.', location: 'Valletta, Malta', lat: 35.8990, lng: 14.5150, startDate: new Date(Date.now() + 86400000 * 13), endDate: new Date(Date.now() + 86400000 * 13 + 5400000), ownerId: otherUsers[18], imageUrl: AVATARS[18], type: 'sports', attendeeCount: 22, isPublic: true },
  ];

  // Create events one by one to capture IDs
  const createdEventIds: string[] = [];
  for (const ev of eventsData) {
    const event = await db.event.create({ data: ev });
    createdEventIds.push(event.id);
  }
  console.log(`Created ${createdEventIds.length} events`);

  // RSVPs for test user (using actual event IDs)
  for (let i = 0; i < Math.min(6, createdEventIds.length); i++) {
    try {
      await db.eventRSVP.create({
        data: {
          userId: testUser.id,
          eventId: createdEventIds[i],
          status: i < 2 ? 'going' : i < 4 ? 'maybe' : 'interested',
        },
      });
    } catch {}
  }
  // RSVPs from other users
  for (let i = 0; i < Math.min(4, createdEventIds.length); i++) {
    for (let j = 0; j < 5; j++) {
      try {
        await db.eventRSVP.create({
          data: { userId: otherUsers[j], eventId: createdEventIds[i], status: j < 3 ? 'going' : 'interested' },
        });
      } catch {}
    }
  }

  // Fansites
  await db.fansite.create({
    data: {
      name: 'Marcus Fitness', nick: 'marcusfit', description: 'Exclusive fitness content, workout routines, and lifestyle photos. Join for weekly updates!', geoName: 'Malta', status: 'approved', userId: otherUsers[1],
      links: { create: [{ type: 'onlyfans', url: 'https://onlyfans.com/marcusfit', label: 'OnlyFans', value: '@marcusfit' }, { type: 'instagram', url: 'https://instagram.com/marcusfit', label: 'Instagram', value: '@marcusfit' }] },
      products: { create: [{ period: '1_month', price: 9.99, url: '/subscribe/1' }, { period: '3_months', price: 24.99, priceOld: 29.97, url: '/subscribe/3' }, { period: '12_months', price: 79.99, priceOld: 119.88, url: '/subscribe/12' }] },
    },
  });
  await db.fansite.create({
    data: {
      name: 'Kai\'s World', nick: 'kaiworld', description: 'Photography, travel vlogs, and behind-the-scenes content.', geoName: 'Tokyo, Japan', status: 'approved', userId: otherUsers[3],
      links: { create: [{ type: 'patreon', url: 'https://patreon.com/kaiworld', label: 'Patreon', value: 'kaiworld' }, { type: 'instagram', url: 'https://instagram.com/kaiworld', label: 'Instagram', value: '@kaiworld' }] },
      products: { create: [{ period: '1_month', price: 7.99, url: '/subscribe/1' }, { period: '6_months', price: 39.99, priceOld: 47.94, url: '/subscribe/6' }] },
    },
  });

  // Footprints (test user visiting others)
  for (let i = 0; i < 30; i++) {
    const u = i < 15 ? testUser.id : rand(otherUsers);
    let t = rand(otherUsers); while (t === u) t = rand(otherUsers);
    try { await db.footprint.create({ data: { userId: u, targetId: t } }); } catch {}
  }

  // Boosts (test user has active boost)
  await db.boost.create({ data: { userId: testUser.id, type: 'super', duration: 60, endsAt: new Date(Date.now() + 3600000), isActive: true } });
  await db.boost.create({ data: { userId: otherUsers[5], type: 'standard', duration: 30, endsAt: new Date(Date.now() + 1800000), isActive: true } });
  await db.boost.create({ data: { userId: otherUsers[0], type: 'spotlight', duration: 120, endsAt: new Date(Date.now() + 7200000), isActive: true } });

  // Shouts
  const shoutContents = [
    'Anyone up for drinks tonight? 🍸', 'New to Malta — show me the best spots!', 'Beach day anyone? ☀️', 'Looking for a gym buddy in Valletta', 'Netflix and chill? 🎬', 'Who wants to grab sushi? 🍣', 'Late night conversation? Hit me up', 'Weekend plans? Let me know!', 'Coffee date? ☕', 'Running at 6am tomorrow — who\'s in?',
  ];
  for (let i = 0; i < 10; i++) {
    await db.shout.create({
      data: { content: shoutContents[i], type: 'text', userId: i < 3 ? testUser.id : otherUsers[i - 3], createdAt: new Date(Date.now() - Math.random() * 86400000 * 2) },
    });
  }

  // Favorites (test user favorited others)
  for (let i = 0; i < 8; i++) {
    try { await db.userFavorite.create({ data: { userId: testUser.id, targetId: otherUsers[i], isSuper: i < 3 } }); } catch {}
  }
  // Others favorited test user
  for (let i = 0; i < 5; i++) {
    try { await db.userFavorite.create({ data: { userId: otherUsers[i + 8], targetId: testUser.id, isSuper: false } }); } catch {}
  }

  // Notes (test user wrote notes on others)
  const noteContents = ['Really nice guy, met at the beach event', 'Has a cute dog!', 'Great conversation about travel', 'Potential date — follow up', 'Funny, good energy', 'Not my type but cool person', 'We have similar music taste', 'Remind me to ask about their trip to Japan'];
  for (let i = 0; i < 8; i++) {
    try { await db.userNote.create({ data: { content: noteContents[i], type: 'private', writerId: testUser.id, targetId: otherUsers[i] } }); } catch {}
  }

  // Blogs
  const blogData = [
    { title: '5 First Date Ideas in Malta', content: 'Malta is full of amazing date spots. From the historic streets of Valletta to the stunning Blue Lagoon, here are our top picks for a memorable first date...', slug: '5-first-date-ideas-malta', userId: testUser.id, imageUrl: AVATARS[0] },
    { title: 'How to Create the Perfect Dating Profile', content: 'Your dating profile is your first impression. Here are expert tips on choosing the right photos, writing a compelling bio, and standing out from the crowd...', slug: 'perfect-dating-profile', userId: otherUsers[1], imageUrl: AVATARS[5] },
    { title: 'Safe Dating: A Complete Guide', content: 'Safety should always come first. Learn about meeting in public, sharing your location with friends, and recognizing red flags...', slug: 'safe-dating-guide', userId: otherUsers[4], imageUrl: AVATARS[8] },
    { title: 'The Rise of Niche Dating Apps', content: 'From fitness-focused to book lover platforms, niche dating apps are changing how we connect. Here\'s what you need to know...', slug: 'niche-dating-apps', userId: otherUsers[7], imageUrl: AVATARS[12] },
  ];
  for (const b of blogData) {
    await db.blog.create({ data: { ...b, isPublished: true } });
  }

  // Videos
  const videoData = [
    { title: 'Morning Routine in Malta', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnailUrl: AVATARS[2], duration: 180, userId: otherUsers[0] },
    { title: 'Gym Workout Tips', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnailUrl: AVATARS[6], duration: 300, userId: otherUsers[1] },
    { title: 'Cooking Italian Pasta', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnailUrl: AVATARS[9], duration: 240, userId: otherUsers[4] },
    { title: 'Travel Vlog: Gozo', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnailUrl: AVATARS[13], duration: 600, userId: otherUsers[7] },
  { title: 'Sunset Timelapse', url: 'https://www.w3schools.com/html/mov_bbb.mp4', thumbnailUrl: AVATARS[16], duration: 120, userId: testUser.id },
  ];
  for (const v of videoData) {
    await db.video.create({ data: v });
  }

  // Banners
  await db.banner.createMany({
    data: [
      { title: 'Summer Sale: 50% Off Premium', imageUrl: AVATARS[0], linkUrl: '/membership', position: 0, isActive: true, userId: testUser.id },
      { title: 'New: AI Profile Analysis', imageUrl: AVATARS[5], linkUrl: '/infer', position: 1, isActive: true, userId: testUser.id },
      { title: 'Pride Month Events', imageUrl: AVATARS[8], linkUrl: '/events', position: 2, isActive: true, userId: otherUsers[2] },
    ],
  });

  // Test user albums for others too
  for (let i = 0; i < 5; i++) {
    await db.album.create({ data: { name: ['My Photos', 'Travel Pics', 'Gym Progress', 'Night Out', 'Nature'][i], isPrivate: Math.random() > 0.6, userId: otherUsers[i] } });
  }

  // ═══ NEW FEATURES SEED DATA ═══

  // --- Circles (3 circles for test-user-1 with members) ---
  const hotGuysCircle = await db.circle.create({
    data: { name: 'Hot Guys', color: '#ef4444', icon: 'flame', userId: testUser.id },
  });
  const friendsCircle = await db.circle.create({
    data: { name: 'Friends', color: '#22c55e', icon: 'users', userId: testUser.id },
  });
  const maybeLaterCircle = await db.circle.create({
    data: { name: 'Maybe Later', color: '#f59e0b', icon: 'clock', userId: testUser.id },
  });

  // Add members to circles
  await db.circleMember.createMany({
    data: [
      { circleId: hotGuysCircle.id, targetUserId: otherUsers[0], userId: testUser.id },
      { circleId: hotGuysCircle.id, targetUserId: otherUsers[3], userId: testUser.id },
      { circleId: hotGuysCircle.id, targetUserId: otherUsers[7], userId: testUser.id },
      { circleId: friendsCircle.id, targetUserId: otherUsers[1], userId: testUser.id },
      { circleId: friendsCircle.id, targetUserId: otherUsers[4], userId: testUser.id },
      { circleId: friendsCircle.id, targetUserId: otherUsers[9], userId: testUser.id },
      { circleId: friendsCircle.id, targetUserId: otherUsers[12], userId: testUser.id },
      { circleId: maybeLaterCircle.id, targetUserId: otherUsers[2], userId: testUser.id },
      { circleId: maybeLaterCircle.id, targetUserId: otherUsers[5], userId: testUser.id },
      { circleId: maybeLaterCircle.id, targetUserId: otherUsers[8], userId: testUser.id },
    ],
  });

  // --- Check-ins (5 for test-user-1) ---
  const checkinData = [
    { userId: testUser.id, venueName: 'The Alley Bar', lat: 35.8995, lng: 14.5130 },
    { userId: testUser.id, venueName: 'Valletta Waterfront', lat: 35.8980, lng: 14.5180 },
    { userId: testUser.id, venueName: 'Café Cordina', lat: 35.8988, lng: 14.5148 },
    { userId: testUser.id, venueName: 'St. George\'s Beach', lat: 35.9150, lng: 14.4850 },
    { userId: testUser.id, venueName: 'Manoel Theatre', lat: 35.8995, lng: 14.5155 },
  ];
  for (const c of checkinData) {
    await db.checkin.create({ data: { ...c, createdAt: new Date(Date.now() - Math.random() * 86400000 * 7) } });
  }

  // --- Wallet (balance 100 for test-user-1) ---
  const testWallet = await db.wallet.create({
    data: { userId: testUser.id, balance: 100 },
  });

  // --- Transactions (3 for test-user-1) ---
  await db.transaction.createMany({
    data: [
      { walletId: testWallet.id, type: 'purchase', amount: 50, description: 'Purchased 50 credits', referenceId: 'txn_001' },
      { walletId: testWallet.id, type: 'boost', amount: -10, description: 'Super Boost - 60 min', referenceId: 'boost_001' },
      { walletId: testWallet.id, type: 'gift', amount: -5, description: 'Sent virtual gift to Marcus Chen', referenceId: 'gift_001' },
    ],
  });

  // --- Saved Phrases (5 for test-user-1) ---
  await db.savedPhrase.createMany({
    data: [
      { userId: testUser.id, title: 'Greeting', content: 'Hey! Love your profile. How\'s your day going?', sortOrder: 0 },
      { userId: testUser.id, title: 'Coffee Invite', content: 'Would you be down for a coffee this week? I know a great spot.', sortOrder: 1 },
      { userId: testUser.id, title: 'Busy Response', content: 'Hey, sorry for the late reply! I\'ve been swamped. How are you?', sortOrder: 2 },
      { userId: testUser.id, title: 'Flirty', content: 'Just saw your new photos... you look amazing! 😏', sortOrder: 3 },
      { userId: testUser.id, title: 'Travel Question', content: 'I see you\'re into traveling! What\'s your next destination?', sortOrder: 4 },
    ],
  });

  // --- Contact Folders (3 for test-user-1) ---
  const folderBuddies = await db.contactFolder.create({ data: { name: 'Gym Buddies', userId: testUser.id } });
  const folderDates = await db.contactFolder.create({ data: { name: 'Potential Dates', userId: testUser.id } });
  const folderTravel = await db.contactFolder.create({ data: { name: 'Travel Friends', userId: testUser.id } });

  await db.contactFolderMember.createMany({
    data: [
      { folderId: folderBuddies.id, targetUserId: otherUsers[3] },
      { folderId: folderBuddies.id, targetUserId: otherUsers[8] },
      { folderId: folderBuddies.id, targetUserId: otherUsers[15] },
      { folderId: folderDates.id, targetUserId: otherUsers[0] },
      { folderId: folderDates.id, targetUserId: otherUsers[5] },
      { folderId: folderDates.id, targetUserId: otherUsers[11] },
      { folderId: folderTravel.id, targetUserId: otherUsers[2] },
      { folderId: folderTravel.id, targetUserId: otherUsers[9] },
      { folderId: folderTravel.id, targetUserId: otherUsers[18] },
    ],
  });

  // --- Conversation Participants (mute settings) ---
  await db.conversationParticipant.createMany({
    data: [
      { userId: testUser.id, otherUserId: otherUsers[0], isMuted: false, isArchived: false, isPinned: true, lastReadAt: new Date() },
      { userId: testUser.id, otherUserId: otherUsers[1], isMuted: true, isArchived: false, isPinned: false, mutedUntil: new Date(Date.now() + 86400000 * 3) },
      { userId: testUser.id, otherUserId: otherUsers[2], isMuted: false, isArchived: true, isPinned: false, lastReadAt: new Date(Date.now() - 86400000) },
      { userId: testUser.id, otherUserId: otherUsers[3], isMuted: false, isArchived: false, isPinned: false, lastReadAt: new Date(Date.now() - 3600000) },
      { userId: testUser.id, otherUserId: otherUsers[5], isMuted: true, isArchived: false, isPinned: false },
    ],
  });

  // --- Liked Photos ---
  // Get some photos to like
  const photosToLike = await db.photo.findMany({
    where: { userId: { in: otherUsers.slice(0, 10) } },
    take: 12,
  });
  for (let i = 0; i < photosToLike.length; i++) {
    try {
      await db.likedPhoto.create({
        data: {
          userId: i < 6 ? testUser.id : otherUsers[i % 10],
          photoId: photosToLike[i].id,
        },
      });
    } catch {}
  }

  console.log('Seed completed! 1 test user + 20 demo users with full data.');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
