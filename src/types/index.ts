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
  online: boolean;
  lastSeen: string;
  isPremium: boolean;
  isVerified: boolean;
  showOnline: boolean;
  showDistance: boolean;
  showAge: boolean;
  lookingFor: string;
  aboutMe: string | null;
  height: number | null;
  weight: number | null;
  ethnicity: string | null;
  bodyType: string | null;
  relationshipStatus: string | null;
  position: string | null;
  pronouns: string | null;
  _count?: {
    photos: number;
    sentMessages?: number;
    receivedMessages?: number;
    receivedLikes?: number;
    receivedViews?: number;
  };
  photos?: Photo[];
  albums?: Album[];
  fansite?: Fansite | null;
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
  createdAt: string;
  sender?: User;
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
  ownerId: string;
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
}

export type TabId = 'discover' | 'chat' | 'likes' | 'fansites' | 'events' | 'profile';
