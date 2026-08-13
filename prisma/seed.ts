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
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face',
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
const LOOKING_FOR = ['relationship', 'casual', 'friendship', 'networking', 'dates', 'relationship'];
const BODY_TYPES = ['athletic', 'average', 'slim', 'muscular', 'stocky', 'defined'];
const POSITIONS = ['top', 'bottom', 'versatile', 'side'];
const RELATIONSHIP_STATUSES = ['single', 'single', 'single', 'open relationship', 'it\'s complicated'];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log('Seeding database...');

  // Create 20 users
  const userIds: string[] = [];
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
        online: Math.random() > 0.4,
        lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7),
        isPremium: Math.random() > 0.7,
        isVerified: Math.random() > 0.5,
        lookingFor: rand(LOOKING_FOR),
        aboutMe: BIOS[i],
        height: randInt(165, 195),
        weight: randInt(60, 100),
        ethnicity: rand(['White', 'Asian', 'Latino', 'Black', 'Mixed', 'Middle Eastern']),
        bodyType: rand(BODY_TYPES),
        relationshipStatus: rand(RELATIONSHIP_STATUSES),
        position: rand(POSITIONS),
        pronouns: rand(['he/him', 'he/they', 'they/them']),
      },
    });
    userIds.push(user.id);

    // Add photos for each user (2-5 photos)
    const photoCount = randInt(2, 5);
    for (let j = 0; j < photoCount; j++) {
      await db.photo.create({
        data: {
          url: AVATARS[(i + j) % AVATARS.length],
          userId: user.id,
          sortOrder: j,
          isPrivate: j === photoCount - 1 && Math.random() > 0.6,
        },
      });
    }
  }

  // Create messages between users
  for (let i = 0; i < 50; i++) {
    const s = rand(userIds);
    let r = rand(userIds);
    while (r === s) r = rand(userIds);
    await db.message.create({
      data: {
        content: [
          'Hey! How are you?', 'Nice profile! Love your vibe.', 'Want to grab coffee sometime?',
          'Just moved to the area, any recommendations?', 'Your photos are stunning!',
          'Love the bio! We should talk.', 'What are you up to this weekend?',
          'Great taste in music!', 'That sunset photo is amazing', 'Running partner?',
          'Netflix and chill? 😏', 'Working out later? Join me!', 'I love your style',
          'What\'s your favorite restaurant around here?', 'We have so much in common!',
        ][randInt(0, 14)],
        senderId: s,
        receiverId: r,
        isRead: Math.random() > 0.5,
        type: Math.random() > 0.8 ? 'image' : 'text',
        createdAt: new Date(Date.now() - Math.random() * 86400000 * 14),
      },
    });
  }

  // Create likes
  for (let i = 0; i < 40; i++) {
    const s = rand(userIds);
    let r = rand(userIds);
    while (r === s) r = rand(userIds);
    try {
      await db.like.create({ data: { senderId: s, receiverId: r } });
    } catch { /* unique constraint */ }
  }

  // Create profile views
  for (let i = 0; i < 60; i++) {
    const v = rand(userIds);
    let t = rand(userIds);
    while (t === v) t = rand(userIds);
    await db.profileView.create({
      data: { viewerId: v, viewedId: t, createdAt: new Date(Date.now() - Math.random() * 86400000 * 7) },
    });
  }

  // Create blocks
  for (let i = 0; i < 3; i++) {
    const b = rand(userIds);
    let d = rand(userIds);
    while (d === b) d = rand(userIds);
    try {
      await db.block.create({ data: { blockerId: b, blockedId: d, reason: 'Inappropriate behavior' } });
    } catch { /* unique */ }
  }

  // Create group chats
  const group1 = await db.groupChat.create({
    data: { name: 'Malta Social', description: 'Meet new people in Malta', ownerId: userIds[0], isPublic: true },
  });
  await db.groupMember.createMany({
    data: userIds.slice(0, 8).map((uid, idx) => ({
      userId: uid,
      groupId: group1.id,
      role: idx === 0 ? 'admin' : 'member',
    })),
  });

  const group2 = await db.groupChat.create({
    data: { name: 'Fitness Buddies', description: 'Gym partners and fitness motivation', ownerId: userIds[3], isPublic: true },
  });
  await db.groupMember.createMany({
    data: userIds.slice(3, 12).map((uid, idx) => ({
      userId: uid,
      groupId: group2.id,
      role: idx === 0 ? 'admin' : 'member',
    })),
  });

  const group3 = await db.groupChat.create({
    data: { name: 'Nightlife Crew', description: 'Weekend plans and party connections', ownerId: userIds[7], isPublic: false },
  });
  await db.groupMember.createMany({
    data: [userIds[7], userIds[2], userIds[5], userIds[11], userIds[15]].map((uid, idx) => ({
      userId: uid,
      groupId: group3.id,
      role: idx === 0 ? 'admin' : 'member',
    })),
  });

  // Create events
  await db.event.createMany({
    data: [
      { title: 'Beach Party @ Golden Bay', description: 'Sun, sand, and good vibes. Bring your own drinks!', location: 'Golden Bay, Malta', lat: 35.9167, lng: 14.3333, startDate: new Date(Date.now() + 86400000 * 3), ownerId: userIds[0], imageUrl: AVATARS[0] },
      { title: 'Pride Walk Valletta', description: 'Annual Pride march through the streets of Valletta. Everyone welcome!', location: 'Valletta, Malta', lat: 35.8989, lng: 14.5146, startDate: new Date(Date.now() + 86400000 * 7), ownerId: userIds[2], imageUrl: AVATARS[5] },
      { title: 'Speed Dating Night', description: 'Meet 10+ singles in one night. Drinks included!', location: 'St. Julian\'s, Malta', lat: 35.9133, lng: 14.4967, startDate: new Date(Date.now() + 86400000 * 2), ownerId: userIds[5], imageUrl: AVATARS[3] },
      { title: 'Drag Show @ The Alley', description: 'Weekly drag extravaganza. Doors at 10pm.', location: 'Sliema, Malta', lat: 35.9117, lng: 14.4983, startDate: new Date(Date.now() + 86400000 * 1), ownerId: userIds[8], imageUrl: AVATARS[8] },
      { title: 'Yoga in the Park', description: 'Morning yoga session for all levels. Mats provided.', location: 'Floriana, Malta', lat: 35.8925, lng: 14.5083, startDate: new Date(Date.now() + 86400000 * 5), ownerId: userIds[12], imageUrl: AVATARS[12] },
    ],
  });

  // Create fansites
  await db.fansite.create({
    data: {
      name: 'Marcus Fitness',
      nick: 'marcusfit',
      description: 'Exclusive fitness content, workout routines, and lifestyle photos. Join for weekly updates and personalized training tips!',
      geoName: 'Malta',
      status: 'approved',
      userId: userIds[1],
      links: {
        create: [
          { type: 'onlyfans', url: 'https://onlyfans.com/marcusfit', label: 'OnlyFans', value: '@marcusfit' },
          { type: 'instagram', url: 'https://instagram.com/marcusfit', label: 'Instagram', value: '@marcusfit' },
          { type: 'twitter', url: 'https://twitter.com/marcusfit', label: 'X/Twitter', value: '@marcusfit' },
        ],
      },
      products: {
        create: [
          { period: '1_month', price: 9.99, url: '/subscribe/1' },
          { period: '3_months', price: 24.99, priceOld: 29.97, url: '/subscribe/3' },
          { period: '12_months', price: 79.99, priceOld: 119.88, url: '/subscribe/12' },
        ],
      },
    },
  });

  await db.fansite.create({
    data: {
      name: 'Kai\'s World',
      nick: 'kaiworld',
      description: 'Photography, travel vlogs, and behind-the-scenes content. Supporting creative expression and art.',
      geoName: 'Tokyo, Japan',
      status: 'approved',
      userId: userIds[3],
      links: {
        create: [
          { type: 'patreon', url: 'https://patreon.com/kaiworld', label: 'Patreon', value: 'kaiworld' },
          { type: 'instagram', url: 'https://instagram.com/kaiworld', label: 'Instagram', value: '@kaiworld' },
        ],
      },
      products: {
        create: [
          { period: '1_month', price: 7.99, url: '/subscribe/1' },
          { period: '6_months', price: 39.99, priceOld: 47.94, url: '/subscribe/6' },
        ],
      },
    },
  });

  // Create footprints
  for (let i = 0; i < 30; i++) {
    const u = rand(userIds);
    let t = rand(userIds);
    while (t === u) t = rand(userIds);
    try {
      await db.footprint.create({ data: { userId: u, targetId: t } });
    } catch { /* unique */ }
  }

  // Create boosts
  await db.boost.createMany({
    data: [
      { userId: userIds[0], type: 'standard', duration: 30, endsAt: new Date(Date.now() + 1800000), isActive: true },
      { userId: userIds[5], type: 'super', duration: 60, endsAt: new Date(Date.now() + 3600000), isActive: true },
    ],
  });

  console.log('Seed completed! Created 20 users with full data.');
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
