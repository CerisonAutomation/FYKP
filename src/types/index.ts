// ═══════════════════════════════════════════════════════════════
// ENUMS — from OMOLINK report analysis
// ═══════════════════════════════════════════════════════════════

export const GENDER_OPTIONS = ['male', 'female', 'non-binary', 'transgender', 'other'] as const;
export type Gender = (typeof GENDER_OPTIONS)[number];

export const BODY_TYPE_OPTIONS = ['slim', 'average', 'athletic', 'muscular', 'curvy', 'bbw', 'stocky'] as const;
export type BodyType = (typeof BODY_TYPE_OPTIONS)[number];

export const ETHNICITY_OPTIONS = ['white', 'black', 'latino', 'asian', 'middle-eastern', 'indian', 'mixed', 'other'] as const;
export type Ethnicity = (typeof ETHNICITY_OPTIONS)[number];

export const LOOKING_FOR_OPTIONS = ['relationship', 'casual', 'friends', 'networking', 'not-specified'] as const;
export type LookingFor = (typeof LOOKING_FOR_OPTIONS)[number];

export const RELATIONSHIP_STATUS_OPTIONS = ['single', 'in-a-relationship', 'married', 'divorced', 'widowed', 'open-relationship'] as const;
export type RelationshipStatus = (typeof RELATIONSHIP_STATUS_OPTIONS)[number];

export const POSITION_OPTIONS = ['top', 'bottom', 'versatile', 'side', 'not-specified'] as const;
export type Position = (typeof POSITION_OPTIONS)[number];

export const CHAT_TYPE_OPTIONS = ['direct', 'group'] as const;
export type ChatType = (typeof CHAT_TYPE_OPTIONS)[number];

export const MESSAGE_TYPE_OPTIONS = ['text', 'image', 'video', 'audio', 'gift', 'system', 'sticker'] as const;
export type MessageType = (typeof MESSAGE_TYPE_OPTIONS)[number];

export const SUBSCRIPTION_TIER_OPTIONS = ['free', 'premium', 'vip', 'creator'] as const;
export type SubscriptionTier = (typeof SUBSCRIPTION_TIER_OPTIONS)[number];

export const BOOST_TYPE_OPTIONS = ['standard', 'super', 'spotlight', 'mega'] as const;
export type BoostType = (typeof BOOST_TYPE_OPTIONS)[number];

export const GROUP_ROLE_OPTIONS = ['owner', 'admin', 'moderator', 'member'] as const;
export type GroupRole = (typeof GROUP_ROLE_OPTIONS)[number];

export const RSVP_STATUS_OPTIONS = ['going', 'maybe', 'interested', 'declined'] as const;
export type RSVPStatus = (typeof RSVP_STATUS_OPTIONS)[number];

export const VERIFICATION_STATUS_OPTIONS = ['none', 'pending', 'verified', 'rejected'] as const;
export type VerificationStatus = (typeof VERIFICATION_STATUS_OPTIONS)[number];

export const PROFESSIONAL_STATUS_OPTIONS = ['none', 'pending', 'approved', 'suspended'] as const;
export type ProfessionalStatus = (typeof PROFESSIONAL_STATUS_OPTIONS)[number];

export const SHOUT_TYPE_OPTIONS = ['text', 'image', 'video'] as const;
export type ShoutType = (typeof SHOUT_TYPE_OPTIONS)[number];

export const NOTE_TYPE_OPTIONS = ['private', 'public'] as const;
export type NoteType = (typeof NOTE_TYPE_OPTIONS)[number];

export const DISPLAY_UNITS_OPTIONS = ['metric', 'imperial'] as const;
export type DisplayUnits = (typeof DISPLAY_UNITS_OPTIONS)[number];

export const HIV_STATUS_OPTIONS = ['negative', 'positive', 'undetectable', 'on-prep', 'not-specified', 'prefer-not-to-say'] as const;
export type HIVStatus = (typeof HIV_STATUS_OPTIONS)[number];

export const LANG_OPTIONS = ['en', 'es', 'fr', 'de', 'it', 'pt', 'nl', 'pl', 'ru', 'ar', 'zh', 'ja', 'ko', 'tr', 'el'] as const;
export type Lang = (typeof LANG_OPTIONS)[number];

export const GEO_MODE_OPTIONS = ['auto', 'manual', 'fake', 'hide'] as const;
export type GeoMode = (typeof GEO_MODE_OPTIONS)[number];

export const TAG_CATEGORY_OPTIONS = ['interests', 'lifestyle', 'appearance', 'kinks', 'fetishes', 'social', 'meet-now'] as const;
export type TagCategory = (typeof TAG_CATEGORY_OPTIONS)[number];

export const AGENDA_VIEW_OPTIONS = ['list', 'calendar', 'map'] as const;
export type AgendaView = (typeof AGENDA_VIEW_OPTIONS)[number];

export const AGENDA_FILTER_OPTIONS = ['all', 'today', 'this-week', 'this-month', 'nearby', 'my-events', 'friends-events'] as const;
export type AgendaFilter = (typeof AGENDA_FILTER_OPTIONS)[number];

export const MAP_FILTER_OPTIONS = ['all', 'online', 'recent', 'nearby', 'new', 'verified', 'premium'] as const;
export type MapFilter = (typeof MAP_FILTER_OPTIONS)[number];

export const BANNER_POSITION_OPTIONS = ['home-top', 'home-middle', 'discover-top', 'profile-sidebar', 'chat-header'] as const;
export type BannerPosition = (typeof BANNER_POSITION_OPTIONS)[number];

export const VERIFICATION_TYPE_OPTIONS = ['age', 'photo', 'id', 'face', 'social'] as const;
export type VerificationType = (typeof VERIFICATION_TYPE_OPTIONS)[number];

export const MEET_NOW_TAG_OPTIONS = ['coffee', 'drinks', 'dinner', 'movie', 'walk', 'gym', 'club', 'travel', 'chill', 'video-call', 'phone-call', 'date', 'hookup'] as const;
export type MeetNowTag = (typeof MEET_NOW_TAG_OPTIONS)[number];

export const CANNED_SHOUT_OPTIONS = ['looking-now', 'bored', 'wanna-chat', 'new-in-town', 'party-tonight', 'netflix-chill', 'gym-buddy', 'travel-companion', 'coffee-date', 'video-call'] as const;
export type CannedShout = (typeof CANNED_SHOUT_OPTIONS)[number];

export const PROFILE_TAG_CATEGORY_OPTIONS = ['interests', 'lifestyle', 'kinks', 'social', 'meet-now'] as const;
export type ProfileTagCategory = (typeof PROFILE_TAG_CATEGORY_OPTIONS)[number];

export const INFER_CATEGORY_OPTIONS = ['compatibility', 'icebreakers', 'conversation-starters', 'profile-tips', 'red-flags', 'green-flags', 'date-ideas', 'personality-analysis'] as const;
export type InferCategory = (typeof INFER_CATEGORY_OPTIONS)[number];

// ═══════════════════════════════════════════════════════════════
// ENUMS — from ROMEO/Grindr analysis
// ═══════════════════════════════════════════════════════════════

// Tribes (from Grindr)
export const TRIBE_OPTIONS = ['bear', 'clean-cut', 'daddy', 'discreet', 'geek', 'jock', 'leather', 'otter', 'rugged', 'sober', 'trans', 'twink', 'pup', 'muscle-cub', 'chub', 'chaser'] as const;
export type Tribe = (typeof TRIBE_OPTIONS)[number];

// Fetish Clothing (from ROMEO - the gold standard)
export const FETISH_CLOTHING_OPTIONS = ['leather', 'rubber', 'lycra-sports', 'skins', 'boots', 'sneakers', 'jeans', 'underwear', 'uniform', 'worker', 'formal', 'sports', 'techno', 'skater', 'drag', 'crossdressing'] as const;
export type FetishClothing = (typeof FETISH_CLOTHING_OPTIONS)[number];

// SM Level (from ROMEO)
export const SM_LEVEL_OPTIONS = ['sm-yes', 'sm-soft', 'sm-no', 'not-specified'] as const;
export type SMLevel = (typeof SM_LEVEL_OPTIONS)[number];

// FF Role (from ROMEO - fisting)
export const FF_ROLE_OPTIONS = ['ff-active', 'ff-passive', 'ff-versatile', 'ff-no', 'not-specified'] as const;
export type FFRole = (typeof FF_ROLE_OPTIONS)[number];

// Safer Sex (from ROMEO)
export const SAFER_SEX_OPTIONS = ['always-safe', 'condom', 'prep', 'prep-and-condom', 'tasp', 'lets-talk', 'needs-discussion', 'not-specified'] as const;
export type SaferSex = (typeof SAFER_SEX_OPTIONS)[number];

// Dick Size (from ROMEO)
export const DICK_SIZE_OPTIONS = ['s', 'm', 'l', 'xl', 'xxl', 'not-specified'] as const;
export type DickSize = (typeof DICK_SIZE_OPTIONS)[number];

// Circumcision
export const CIRCUMCISION_OPTIONS = ['cut', 'uncut', 'not-specified'] as const;
export type Circumcision = (typeof CIRCUMCISION_OPTIONS)[number];

// Hair Color (from ROMEO)
export const HAIR_COLOR_OPTIONS = ['black', 'blond', 'brown', 'red', 'grey', 'light-brown', 'other', 'shaved'] as const;
export type HairColor = (typeof HAIR_COLOR_OPTIONS)[number];

// Hair Length
export const HAIR_LENGTH_OPTIONS = ['short', 'average', 'long', 'punk', 'shaved'] as const;
export type HairLength = (typeof HAIR_LENGTH_OPTIONS)[number];

// Eye Color
export const EYE_COLOR_OPTIONS = ['blue', 'brown', 'green', 'grey', 'hazel', 'other'] as const;
export type EyeColor = (typeof EYE_COLOR_OPTIONS)[number];

// Beard Style
export const BEARD_OPTIONS = ['none', 'goatee', 'designer-stubble', 'moustache', 'full-beard', 'long-beard'] as const;
export type Beard = (typeof BEARD_OPTIONS)[number];

// Piercings Level
export const PIERCING_OPTIONS = ['none', 'few', 'a-lot'] as const;
export type Piercing = (typeof PIERCING_OPTIONS)[number];

// Tattoo Level
export const TATTOO_OPTIONS = ['none', 'few', 'a-lot'] as const;
export type Tattoo = (typeof TATTOO_OPTIONS)[number];

// Smoker
export const SMOKER_OPTIONS = ['no', 'socially', 'yes'] as const;
export type Smoker = (typeof SMOKER_OPTIONS)[number];

// Going Out interests (from ROMEO)
export const GOING_OUT_OPTIONS = ['arts', 'bar', 'cinema', 'club', 'concert', 'exhibition', 'private-parties', 'sports', 'theater', 'other'] as const;
export type GoingOut = (typeof GOING_OUT_OPTIONS)[number];

// Music Genres (from ROMEO - 20 genres)
export const MUSIC_GENRE_OPTIONS = ['alternative', 'classical', 'country', 'dance-electronic', 'ethno', 'folk', 'gothic', 'hits', 'house-techno', 'jazz-blues', 'metal', 'musical', 'oldies', 'pop', 'punk', 'rap-hiphop', 'reggae-ska', 'rnb-soul', 'rock'] as const;
export type MusicGenre = (typeof MUSIC_GENRE_OPTIONS)[number];

// Sports (from ROMEO - 30+)
export const SPORT_OPTIONS = ['badminton', 'baseball', 'basketball', 'biking', 'climbing', 'diving', 'football', 'golf', 'gym', 'handball', 'hiking', 'ice-hockey', 'jogging', 'martial-arts', 'motor-racing', 'rowing', 'rugby', 'sailing', 'skating', 'snooker', 'surfing', 'swimming', 'tennis', 'us-football', 'volleyball', 'winter-sports', 'wrestling', 'yoga'] as const;
export type Sport = (typeof SPORT_OPTIONS)[number];

// Food Preferences (from ROMEO)
export const FOOD_OPTIONS = ['arab', 'asian', 'everything', 'fast-food', 'french', 'german', 'greek', 'indian', 'italian', 'local', 'mediterranean', 'mexican', 'sushi', 'tapas', 'turkish', 'vegan', 'vegetarian'] as const;
export type Food = (typeof FOOD_OPTIONS)[number];

// Travel Style
export const TRAVEL_STYLE_OPTIONS = ['adventure', 'alpine', 'city-breaks', 'cruise', 'individual', 'sun', 'wellness', 'winter'] as const;
export type TravelStyle = (typeof TRAVEL_STYLE_OPTIONS)[number];

// Profession (from ROMEO)
export const PROFESSION_OPTIONS = ['army', 'apprentice', 'civil-servant', 'employee', 'freelancer', 'hedonist', 'other', 'retired', 'scholar', 'student', 'worker', 'artist', 'chef', 'engineer', 'medical', 'legal', 'finance', 'education', 'tech', 'creative'] as const;
export type Profession = (typeof PROFESSION_OPTIONS)[number];

// Event Type (from Grindr + practical)
export const EVENT_TYPE_OPTIONS = ['social', 'party', 'meetup', 'sports', 'cultural', 'live', 'exclusive', 'sale', 'upcoming'] as const;
export type EventType = (typeof EVENT_TYPE_OPTIONS)[number];

// Chat Sort Mode
export const CHAT_SORT_OPTIONS = ['recent', 'intent', 'quality', 'unread', 'online'] as const;
export type ChatSortMode = (typeof CHAT_SORT_OPTIONS)[number];

// Dirty Sex
export const DIRTY_SEX_OPTIONS = ['yes', 'ws-only', 'no', 'not-specified'] as const;
export type DirtySex = (typeof DIRTY_SEX_OPTIONS)[number];

// Meet At (hosting)
export const MEET_AT_OPTIONS = ['my-place', 'your-place', 'neutral', 'not-specified'] as const;
export type MeetAt = (typeof MEET_AT_OPTIONS)[number];

// ═══════════════════════════════════════════════════════════════
// MODELS
// ═══════════════════════════════════════════════════════════════

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  age: number | null;
  gender: string;
  location: string | null;
  lat: number | null;
  lng: number | null;
  geoCity: string | null;
  geoRegion: string | null;
  geoCountry: string | null;
  online: boolean;
  lastSeen: string;
  isPremium: boolean;
  isVerified: boolean;
  showOnline: boolean;
  showDistance: boolean;
  showAge: boolean;
  showActivity: boolean;
  hidePicsOffline: boolean;
  lookingFor: string;
  aboutMe: string | null;
  height: number | null;
  weight: number | null;
  ethnicity: string | null;
  bodyType: string | null;
  relationshipStatus: string | null;
  position: string | null;
  pronouns: string | null;
  displayUnits: string;
  lang: string;
  soundOff: boolean;
  notifPushOff: boolean;
  notifEmailOff: boolean;
  notifTelegramOff: boolean;
  mailingInternal: boolean;
  mailingPartner: boolean;
  profileOff: boolean;
  privateAuto: boolean;
  noPros: boolean;
  noPub: boolean;
  isProfessional: boolean;
  professionalStatus: string;
  verificationStatus: string;
  voucher: string | null;
  detectedIntent?: string | null;
  chatQualityScore?: number | null;
  profileFields?: ProfileField[];
  _count?: {
    photos: number;
    sentMessages?: number;
    receivedMessages?: number;
    receivedLikes?: number;
    receivedViews?: number;
    shouts?: number;
    favorites?: number;
    notesWritten?: number;
    blogs?: number;
    videos?: number;
  };
  photos?: Photo[];
  albums?: Album[];
  fansite?: Fansite | null;
  verification?: Verification | null;
}

export interface Photo {
  id: string;
  url: string;
  thumbnailUrl?: string;
  isPrivate: boolean;
  isExpiring: boolean;
  sortOrder: number;
  albumId?: string;
  userId: string;
}

export interface Album {
  id: string;
  name: string;
  isPrivate: boolean;
  photos?: Photo[];
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  chatType: string;
  isRead: boolean;
  type: string;
  mediaUrl?: string;
  // Chat features
  replyToId?: string;
  reactions?: string;
  isPinned?: boolean;
  isFavorited?: boolean;
  expiresAt?: string;
  isRecalled?: boolean;
  translation?: string;
  translatedLang?: string;
  scheduledAt?: string;
  albumId?: string;
  locationData?: string;
  eventId?: string;
  voiceDuration?: number;
  pollData?: string;
  callData?: string;
  createdAt: string;
  updatedAt?: string;
  sender?: User;
  replyTo?: Message;
  replies?: Message[];
}

export interface Conversation {
  otherUser: User;
  lastMessage: Message;
  unreadCount: number;
}

export interface Like {
  id: string;
  senderId: string;
  receiverId: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface ProfileView {
  id: string;
  viewerId: string;
  viewedId: string;
  createdAt: string;
  viewer?: User;
}

export interface Fansite {
  id: string;
  name: string;
  nick: string;
  description?: string;
  geoName?: string;
  trailerUrl?: string;
  trailerImageUrl?: string;
  status: string;
  isAnonymous: boolean;
  user: User;
  links: FansiteLink[];
  products: FansiteProduct[];
}

export interface FansiteLink {
  id: string;
  type: string;
  url: string;
  label?: string;
  value?: string;
  icon?: string;
}

export interface FansiteProduct {
  id: string;
  period: string;
  price: number;
  priceOld?: number;
  until?: string;
  url: string;
}

export interface GroupChat {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
  ownerId: string;
  isPublic: boolean;
  address?: string;
  lat?: number;
  lng?: number;
  geoName?: string;
  tags?: string;
  hidden: boolean;
  eventStart?: string;
  eventEnd?: string;
  duration?: number;
  owner?: User;
  _count?: { members: number };
  members?: GroupMember[];
}

export interface GroupMember {
  userId: string;
  groupId: string;
  role: string;
  user?: User;
}

export interface AppEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  lat?: number;
  lng?: number;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  type: string;
  attendeeCount: number;
  ownerId: string;
  isPublic: boolean;
  owner?: User;
}

export interface Footprint {
  id: string;
  userId: string;
  targetId: string;
  createdAt: string;
  target?: User;
  user?: User;
}

export interface Boost {
  id: string;
  userId: string;
  type: string;
  duration: number;
  endsAt: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  tier: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  paymentMethod?: string;
}

export interface ChatRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  message?: string;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

// ═══════════════════════════════════════════════════════════════
// NEW MODELS FROM OMOLINK REPORT
// ═══════════════════════════════════════════════════════════════

export interface Shout {
  id: string;
  content: string;
  type: string;
  mediaUrl?: string;
  userId: string;
  createdAt: string;
  user?: User;
}

export interface UserNote {
  id: string;
  content: string;
  type: string;
  writerId: string;
  targetId: string;
  createdAt: string;
  writer?: User;
  target?: User;
}

export interface UserFavorite {
  id: string;
  userId: string;
  targetId: string;
  isSuper: boolean;
  createdAt: string;
  target?: User;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  slug: string;
  userId: string;
  isPublished: boolean;
  createdAt: string;
  user?: User;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl?: string;
  duration?: number;
  userId: string;
  isPrivate: boolean;
  createdAt: string;
  user?: User;
}

export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string;
  position: number;
  isActive: boolean;
  userId: string;
  createdAt: string;
}

export interface Verification {
  id: string;
  userId: string;
  type: string;
  status: string;
  documentUrl?: string;
  phone?: string;
  phonePrefix?: string;
  submittedAt?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface UserSession {
  id: string;
  userId: string;
  device?: string;
  platform?: string;
  ip?: string;
  isActive: boolean;
  createdAt: string;
  lastSeen: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  city: string;
  region: string;
  country: string;
  accuracy: number;
}

export interface InferResult {
  category: InferCategory;
  title: string;
  content: string;
  confidence: number;
  details?: Record<string, string>;
}

export interface PageDirectory {
  id: string;
  label: string;
  description: string;
  icon: string;
  tabId: TabId;
  badge?: number;
  isNew?: boolean;
  isPremium?: boolean;
}

export interface AccountSettings {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface PreferencesSettings {
  geoMode: GeoMode;
  geoName: string;
  displayUnits: DisplayUnits;
  lang: Lang;
  ageMin: number;
  ageMax: number;
  showOnline: boolean;
  showDistance: boolean;
  showAge: boolean;
  showActivity: boolean;
  hidePicsOffline: boolean;
  soundOff: boolean;
  notifPushOff: boolean;
  notifEmailOff: boolean;
  notifTelegramOff: boolean;
  mailingInternal: boolean;
  mailingPartner: boolean;
  profileOff: boolean;
  privateAuto: boolean;
  noPros: boolean;
  noPub: boolean;
  profileTags: string;
  profileTagCategorys: string;
  profileMeetNowTags: string;
}

// ═══════════════════════════════════════════════════════════════
// NEW MODELS FROM ROMEO/Grindr ANALYSIS
// ═══════════════════════════════════════════════════════════════

// ProfileField - flexible key-value for kinks/sexual/interest data
export interface ProfileField {
  id: string;
  userId: string;
  key: string;
  value: string;
}

// Chat AI Analysis result
export interface ChatAIAnalysis {
  intent: string;
  quality: number;
  summary: string;
  suggestedReplies: string[];
  meetupIdeas: string[];
}

// ═══════════════════════════════════════════════════════════════
// TABS — expanded from OMOLINK report
// ═══════════════════════════════════════════════════════════════

export type TabId = 'discover' | 'map' | 'chat' | 'likes' | 'more' | 'events' | 'viewed' | 'shouts' | 'fansites' | 'videos' | 'blogs' | 'groups' | 'albums' | 'membership' | 'verified' | 'professional' | 'footprints' | 'notes' | 'boosts' | 'favorites' | 'account' | 'preferences' | 'geo-settings' | 'banners' | 'sites' | 'legal' | 'faqs' | 'abuse' | 'advantages' | 'affiliation' | 'profile' | 'infer' | 'kinks';
