'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import NexusChat from '@/components/chat/NexusChat';
import { io as socketIO, Socket } from 'socket.io-client';
import { formatDistanceToNow, format, isToday, isThisWeek, isThisMonth } from 'date-fns';
import { useAppStore } from '@/store/app';
import type {
  User, Message, Conversation, Like, Fansite, AppEvent, GroupChat,
  Photo, Album, ChatRequest, ProfileView as ProfileViewType,
  Shout, UserFavorite, UserNote, Blog, Video as VideoType,
  Banner, Verification, UserSession, InferCategory, InferResult,
  TabId, SUBSCRIPTION_TIER_OPTIONS,
} from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Compass, MessageCircle, Heart, Star, Calendar, User, Search,
  Bell, Settings, X, Send, Paperclip, Check, CheckCheck, Crown,
  Shield, MapPin, ChevronLeft, ChevronRight, Grid3X3, Layers,
  ThumbsUp, ThumbsDown, Eye, Image as ImageIcon, Users, Zap,
  Copy, Sparkles, LogOut, Link2, ExternalLink, Flag, Ban as Block,
  Pencil, Camera, MoreVertical, ArrowLeft, Plus, Clock, Globe,
  Map, Megaphone, Video, FileText, Bookmark, StickyNote, MapPinned,
  StarOff, ShieldCheck, MonitorSmartphone, Crosshair, Grid2X2,
  Fingerprint, Scale, HelpCircle, AlertTriangle, Gift, TrendingUp,
  Brain, Target, Lightbulb, AlertCircle, CheckCircle2, PartyPopper,
  Coffee, Music, Dumbbell, Plane, Palette, Briefcase, Info,
  Radio, ChevronDown, Tag, UserMinus, Lock, Mail, Languages,
  Volume2, VolumeX, MapPinOff, Navigation, Wifi, WifiOff,
  EyeOff, ShieldAlert, ShieldQuestion, Wallet, Gem, Rocket,
  Award, BarChart3, Share2, MessageSquare, CircleDot,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const RIZZ_STYLES = [
  { value: 'romantic', label: 'Romantic', icon: '💖' },
  { value: 'funny', label: 'Funny', icon: '😂' },
  { value: 'bold', label: 'Bold', icon: '🔥' },
  { value: 'nerdy', label: 'Nerdy', icon: '🤓' },
  { value: 'sweet', label: 'Sweet', icon: '🍯' },
  { value: 'flirty', label: 'Flirty', icon: '😘' },
];

const CANNED_SHOUTS = [
  { value: 'looking-now', label: 'Looking right now', emoji: '👀' },
  { value: 'bored', label: 'Bored', emoji: '😴' },
  { value: 'wanna-chat', label: 'Wanna chat?', emoji: '💬' },
  { value: 'new-in-town', label: 'New in town', emoji: '🏙️' },
  { value: 'party-tonight', label: 'Party tonight', emoji: '🎉' },
  { value: 'netflix-chill', label: 'Netflix & Chill', emoji: '🎬' },
  { value: 'gym-buddy', label: 'Gym buddy', emoji: '💪' },
  { value: 'travel-companion', label: 'Travel companion', emoji: '✈️' },
  { value: 'coffee-date', label: 'Coffee date', emoji: '☕' },
  { value: 'video-call', label: 'Video call', emoji: '📹' },
];

const FAQ_DATA = [
  { q: 'What is NEXUS?', a: 'NEXUS is a premium dating and social platform that connects people through smart matching, real-time chat, events, and community features. Whether you\'re looking for romance, friendship, or networking, NEXUS has you covered.' },
  { q: 'How do I verify my profile?', a: 'Go to More → Verified to submit verification. We offer age verification, photo verification, ID verification, face matching, and social media verification. Verified users get a blue badge and more visibility.' },
  { q: 'What is INFER AI Analysis?', a: 'INFER is our AI-powered profile analysis tool that provides deep insights into compatibility, icebreakers, conversation starters, red flags, green flags, date ideas, and personality analysis for any user profile.' },
  { q: 'How do boosts work?', a: 'Boosts temporarily increase your profile visibility. Standard boost lasts 30 min, Super boost lasts 1 hour, Spotlight puts you at the top of discover for 2 hours, and Mega boost lasts 24 hours with maximum visibility.' },
  { q: 'Can I hide my location?', a: 'Yes! Go to More → GEO Settings to choose from Auto GPS, Manual City, Fake Location, or Hide Location modes. You can also set a custom geo name that displays instead of your real location.' },
  { q: 'How do I create a group chat?', a: 'Go to More → Groups and tap "Create Group". You can set it as public or private, add a description, tags, and invite members. Group chats support up to 50 members.' },
  { q: 'What are fansites?', a: 'Fansites are personal creator pages where users can share content, links, and products. Creators can earn through subscriptions and product sales on their fansite.' },
  { q: 'How do I report abuse?', a: 'Go to More → Abuse & Report. You can report users, messages, or content. We take all reports seriously and investigate promptly. You can also block users directly from their profile.' },
  { q: 'What premium features are available?', a: 'Premium includes unlimited likes, see who viewed you, advanced filters, INFER AI analysis, boost discounts, priority support, and more. Check More → Advantages for full comparison.' },
  { q: 'How do I delete my account?', a: 'Go to More → Account and scroll to the bottom to find "Delete Account". This action is permanent and cannot be undone. All your data will be permanently removed.' },
];

const PAGE_DIRECTORY: Record<string, { id: TabId; label: string; description: string; icon: any; badge?: number }[]> = {
  Social: [
    { id: 'events', label: 'Events', description: 'Find and create events', icon: Calendar },
    { id: 'viewed', label: 'Viewed Me', description: 'Who checked your profile', icon: Eye },
    { id: 'shouts', label: 'Shouts', description: 'Community feed', icon: Megaphone },
    { id: 'groups', label: 'Groups', description: 'Group chats & communities', icon: Users },
    { id: 'blogs', label: 'Blogs', description: 'Articles & stories', icon: FileText },
  ],
  Content: [
    { id: 'fansites', label: 'Fansites', description: 'Creator pages', icon: Star },
    { id: 'videos', label: 'Videos', description: 'Video content', icon: Video },
    { id: 'albums', label: 'Albums', description: 'Photo albums', icon: ImageIcon },
    { id: 'banners', label: 'Banners', description: 'Promotional banners', icon: Layers },
    { id: 'sites', label: 'Sites', description: 'Connected links', icon: Link2 },
  ],
  Profile: [
    { id: 'profile', label: 'My Profile', description: 'View & edit profile', icon: User },
    { id: 'favorites', label: 'Favorites', description: 'Saved profiles', icon: Bookmark },
    { id: 'notes', label: 'Notes', description: 'Private notes on users', icon: StickyNote },
    { id: 'footprints', label: 'Footprints', description: 'Visit history', icon: FootprintsIcon },
    { id: 'infer', label: 'INFER AI', description: 'AI profile analysis', icon: Brain, badge: 1 },
  ],
  Premium: [
    { id: 'membership', label: 'Membership', description: 'Plans & pricing', icon: Crown },
    { id: 'boosts', label: 'Boosts', description: 'Increase visibility', icon: Zap },
    { id: 'verified', label: 'Verified', description: 'Get verified badge', icon: ShieldCheck },
    { id: 'professional', label: 'Professional', description: 'Pro creator status', icon: Briefcase },
    { id: 'advantages', label: 'Advantages', description: 'Premium features', icon: Gem },
  ],
  Settings: [
    { id: 'account', label: 'Account', description: 'Email, password, username', icon: Lock },
    { id: 'preferences', label: 'Preferences', description: 'All app settings', icon: Settings },
    { id: 'geo-settings', label: 'GEO Settings', description: 'Location & privacy', icon: MapPin },
  ],
  Info: [
    { id: 'legal', label: 'Legal', description: 'Terms & policies', icon: Scale },
    { id: 'faqs', label: 'FAQs', description: 'Help & answers', icon: HelpCircle },
    { id: 'abuse', label: 'Abuse', description: 'Report & block', icon: Flag },
    { id: 'affiliation', label: 'Affiliation', description: 'Referral program', icon: Gift },
  ],
};

const SUBSCRIPTION_TIERS = [
  { tier: 'free', label: 'Free', price: 0, color: 'from-gray-500 to-gray-600', features: ['5 likes/day', 'Basic filters', 'Limited chat', 'View 10 profiles/day', 'Standard search'] },
  { tier: 'premium', label: 'Premium', price: 9.99, color: 'from-purple-500 to-pink-500', features: ['Unlimited likes', 'Advanced filters', 'Unlimited chat', 'See who viewed you', 'Boost discounts', 'INFER AI Basic', 'Priority support'], popular: true },
  { tier: 'vip', label: 'VIP', price: 24.99, color: 'from-yellow-500 to-amber-500', features: ['Everything in Premium', 'Spotlight boosts', 'INFER AI Pro', 'Anonymous browsing', 'Travel mode', 'Video calls', 'Personal manager', 'Verified badge'] },
  { tier: 'creator', label: 'Creator', price: 0, color: 'from-emerald-500 to-teal-500', features: ['Fansite page', 'Content monetization', 'Product sales', 'Subscriber analytics', 'Custom branding', 'Priority listing', 'Creator badge'] },
];

const BOOST_TYPES = [
  { type: 'standard', label: 'Standard', duration: 30, price: 2.99, desc: '30 min visibility boost', color: 'from-blue-500 to-cyan-500' },
  { type: 'super', label: 'Super', duration: 60, price: 5.99, desc: '1 hour enhanced boost', color: 'from-purple-500 to-pink-500' },
  { type: 'spotlight', label: 'Spotlight', duration: 120, price: 9.99, desc: '2 hours top placement', color: 'from-yellow-500 to-amber-500' },
  { type: 'mega', label: 'Mega', duration: 1440, price: 19.99, desc: '24 hours max visibility', color: 'from-red-500 to-orange-500' },
];

const INFER_CATEGORIES: { id: InferCategory; label: string; icon: any; color: string; desc: string }[] = [
  { id: 'compatibility', label: 'Compatibility', icon: Heart, color: 'text-pink-400', desc: 'Overall match score' },
  { id: 'icebreakers', label: 'Icebreakers', icon: Lightbulb, color: 'text-yellow-400', desc: 'Perfect opening lines' },
  { id: 'conversation-starters', label: 'Starters', icon: MessageSquare, color: 'text-blue-400', desc: 'Keep the chat going' },
  { id: 'profile-tips', label: 'Profile Tips', icon: Star, color: 'text-purple-400', desc: 'Optimize your profile' },
  { id: 'red-flags', label: 'Red Flags', icon: AlertCircle, color: 'text-red-400', desc: 'Warning signs to watch' },
  { id: 'green-flags', label: 'Green Flags', icon: CheckCircle2, color: 'text-green-400', desc: 'Positive indicators' },
  { id: 'date-ideas', label: 'Date Ideas', icon: PartyPopper, color: 'text-orange-400', desc: 'Creative date suggestions' },
  { id: 'personality-analysis', label: 'Personality', icon: Brain, color: 'text-cyan-400', desc: 'Deep personality insights' },
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop';
const CURRENT_USER_ID = 'test-user-1';

// Dynamically import Leaflet map (no SSR - requires window)
const MapLeaflet = dynamic(() => import('@/components/MapViewComponent'), { ssr: false, loading: () => <div className="w-full h-full bg-secondary/30 animate-pulse" /> });

// ═══════════════════════════════════════════════════════════════
// HELPER COMPONENTS & FUNCTIONS
// ═══════════════════════════════════════════════════════════════

function FootprintsIcon(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 16v-2.38C4 11.5 2.97 9.5 3 8c.07-2.48 1.52-4 4-4 2 0 3 1 4 3 1-2 2-3 4-3 2.48 0 3.93 1.52 4 4 .03 1.5-1 3.5-1 5.62V16"/><path d="M4 16c0 2 1.5 4 3 4 1.5 0 2-1 3-2s2.5-2 4-2 3 1 4 2 1.5 2 3 2c1.5 0 3-2 3-4"/></svg>; }

function timeAgo(dateStr: string): string {
  try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true }); } catch { return ''; }
}

function fmtDate(dateStr: string): string {
  try { return format(new Date(dateStr), 'MMM d, yyyy h:mm a'); } catch { return dateStr; }
}

function fmtDateShort(dateStr: string): string {
  try { return format(new Date(dateStr), 'MMM d'); } catch { return dateStr; }
}

function getAvatar(user: { avatar?: string | null } | null | undefined): string {
  return user?.avatar || DEFAULT_AVATAR;
}

function truncate(str: string | null | undefined, len: number): string {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function getLastSeenText(user: User): string {
  if (user.online && user.showOnline) return 'Online now';
  if (user.lastSeen) return `Last seen ${timeAgo(user.lastSeen)}`;
  return 'Offline';
}

function SectionHeader({ icon: Icon, label, count, action }: { icon: any; label: string; count?: number; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2">
        <Icon className="w-3.5 h-3.5" /> {label} {count !== undefined && <span className="text-foreground">({count})</span>}
      </h3>
      {action}
    </div>
  );
}

function UserRow({ user, sub, actions, onClick }: { user: User; sub?: React.ReactNode; actions?: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
      <div className="relative shrink-0">
        <button onClick={onClick} className="block">
          <Avatar className="h-11 w-11">
            <AvatarImage src={getAvatar(user)} />
            <AvatarFallback className="text-xs">{user.displayName?.[0] || '?'}</AvatarFallback>
          </Avatar>
        </button>
        {user.online && user.showOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
      </div>
      <div className="flex-1 min-w-0">
        <button onClick={onClick} className="text-[13px] font-semibold hover:text-primary transition-colors truncate block">
          {user.displayName}{user.age != null && user.showAge !== false ? `, ${user.age}` : ''}
        </button>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {user.location && <span className="flex items-center gap-0.5 truncate"><MapPin className="w-3 h-3 shrink-0" />{truncate(user.location, 20)}</span>}
          {sub}
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-1">{actions}</div>
    </div>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground text-center">{desc}</p>
    </div>
  );
}

function BackHeader({ title, onBack, action }: { title: string; onBack: () => void; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-secondary rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {action}
    </div>
  );
}

function LoadingGrid({ cols = 2, rows = 3 }: { cols?: number; rows?: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-3 p-4`}>
      {Array.from({ length: cols * rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function NexusApp() {
  const store = useAppStore();
  const {
    currentUser, setCurrentUser, activeTab, setActiveTab,
    selectedUserId, setSelectedUserId, selectedGroupId, setSelectedGroupId,
    showProfileDrawer, setShowProfileDrawer, showSettings, setShowSettings,
    showRizzModal, setShowRizzModal, rizzTargetBio, setRizzTargetBio,
    conversations, setConversations, activeConversation, setActiveConversation,
    messages, setMessages, addMessage, refreshDiscover, triggerRefreshDiscover,
    discoverView, setDiscoverView, chatRequests, setChatRequests, pendingRequestCount, setPendingRequestCount,
    shouts, setShouts, addShout, favorites, setFavorites, notes, setNotes,
    blogs, setBlogs, videos, setVideos, banners, setBanners,
    userLat, setUserLat, userLng, setUserLng,
    geoMode, setGeoMode, geoName, setGeoName,
    agendaView, setAgendaView, agendaFilter, setAgendaFilter,
    mapFilter, setMapFilter, mapHidden, setMapHidden,
    inferResults, setInferResults, inferLoading, setInferLoading,
  } = store;

  // ── Auth state ──
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Discover state ──
  const [discoverUsers, setDiscoverUsers] = useState<(User & { distance?: number | null })[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [lookingFor, setLookingFor] = useState('all');
  const [ethnicityFilter, setEthnicityFilter] = useState('all');
  const [bodyTypeFilter, setBodyTypeFilter] = useState('all');
  const [cascadeIndex, setCascadeIndex] = useState(0);

  // ── Chat state ──
  const [chatLoading, setChatLoading] = useState(false);
  const [msgInput, setMsgInput] = useState('');
  const [groups, setGroups] = useState<GroupChat[]>([]);
  const [groupMessages, setGroupMessages] = useState<Message[]>([]);
  const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
  const [chatMobileView, setChatMobileView] = useState<'list' | 'chat'>('list');
  const socketRef = useRef<Socket | null>(null);
  const msgEndRef = useRef<HTMLDivElement>(null);

  // ── Likes state ──
  const [likesTab, setLikesTab] = useState<'received' | 'sent'>('received');
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [likesLoading, setLikesLoading] = useState(true);

  // ── Profile views state ──
  const [profileViews, setProfileViews] = useState<ProfileViewType[]>([]);
  const [viewsLoading, setViewsLoading] = useState(false);

  // ── Fansites state ──
  const [fansites, setFansites] = useState<Fansite[]>([]);
  const [fansiteLoading, setFansiteLoading] = useState(true);
  const [selectedFansite, setSelectedFansite] = useState<Fansite | null>(null);
  const [showFansiteSheet, setShowFansiteSheet] = useState(false);

  // ── Events state ──
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [eventForm, setEventForm] = useState({ title: '', description: '', location: '', startDate: '', imageUrl: '' });
  const [userRsvps, setUserRsvps] = useState<Record<string, string>>({});

  // ── Profile state ──
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profilePhotos, setProfilePhotos] = useState<Photo[]>([]);
  const [profileAlbums, setProfileAlbums] = useState<Album[]>([]);
  const [profileGalleryIndex, setProfileGalleryIndex] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ displayName: '', bio: '', lookingFor: '', aboutMe: '', height: '', weight: '', ethnicity: '', bodyType: '', relationshipStatus: '', position: '', pronouns: '', location: '' });
  const [mySubscriptions, setMySubscriptions] = useState<any[]>([]);
  const [myBoosts, setMyBoosts] = useState<any[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<any[]>([]);

  // ── Settings state ──
  const [settingsPrivacy, setSettingsPrivacy] = useState({ showOnline: true, showDistance: true, showAge: true });
  const [settingsNotifs, setSettingsNotifs] = useState({ push: true, chat: true, likes: true, views: true });

  // ── Rizz state ──
  const [rizzStyle, setRizzStyle] = useState('sweet');
  const [rizzLoading, setRizzLoading] = useState(false);
  const [rizzResult, setRizzResult] = useState<any>(null);

  // ── Misc state ──
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // ── Shouts state ──
  const [shoutInput, setShoutInput] = useState('');
  const [shoutLoading, setShoutLoading] = useState(true);

  // ── Map state ──
  const [mapUsers, setMapUsers] = useState<(User & { distance?: number })[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapRadius, setMapRadius] = useState(50);

  // ── Videos / Blogs / Notes / Favorites loading ──
  const [videosLoading, setVideosLoading] = useState(true);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState('');
  const [noteTargetId, setNoteTargetId] = useState<string | null>(null);
  const [showNoteDialog, setShowNoteDialog] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [footprints, setFootprints] = useState<any[]>([]);
  const [footprintsLoading, setFootprintsLoading] = useState(true);
  const [allBoosts, setAllBoosts] = useState<any[]>([]);
  const [boostsLoading, setBoostsLoading] = useState(true);

  // ── Verification / Sessions ──
  const [myVerification, setMyVerification] = useState<Verification | null>(null);
  const [mySessions, setMySessions] = useState<UserSession[]>([]);

  // ── Account settings ──
  const [accountForm, setAccountForm] = useState({ email: '', password: '', username: '', displayName: '' });
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);

  // ── Preferences ──
  const [prefs, setPrefs] = useState({
    geoMode: 'auto' as string, geoName: '', displayUnits: 'metric' as string, lang: 'en',
    ageMin: 18, ageMax: 60, showOnline: true, showDistance: true, showAge: true,
    showActivity: true, hidePicsOffline: false, soundOff: false,
    notifPushOff: false, notifEmailOff: false, notifTelegramOff: false,
    mailingInternal: true, mailingPartner: true, profileOff: false,
    privateAuto: false, noPros: false, noPub: false,
    profileTags: '', profileTagCategorys: '', profileMeetNowTags: '',
  });

  // ── Albums ──
  const [albums, setAlbums] = useState<Album[]>([]);
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // ── Infer state ──
  const [inferTargetUser, setInferTargetUser] = useState<User | null>(null);
  const [inferCategory, setInferCategory] = useState<InferCategory>('compatibility');
  const [inferResultsMap, setInferResultsMap] = useState<Record<string, any>>({});

  // ── Blog detail ──
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  // ── Groups ──
  const [groupSearch, setGroupSearch] = useState('');
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: '', description: '', isPublic: true });

  // ── Abuse ──
  const [abuseForm, setAbuseForm] = useState({ category: 'harassment', description: '', userId: '' });

  // ── Video search ──
  const [videoSearch, setVideoSearch] = useState('');

  // ── Blog search ──
  const [blogSearch, setBlogSearch] = useState('');

  // ── Shout type ──
  const [shoutType, setShoutType] = useState<'text' | 'image' | 'video'>('text');

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS — Data Fetching
  // ═══════════════════════════════════════════════════════════════

  // Auth
  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(res => { setCurrentUser(res.data); setAuthed(true); })
      .catch(() => setAuthLoading(false))
      .finally(() => setAuthLoading(false));
  }, []);

  // Socket.io
  useEffect(() => {
    if (!authed || !currentUser) return;
    const socket = socketIO('/?XTransformPort=3001', { transports: ['websocket'], autoConnect: false });
    socket.connect();
    socket.on('connect', () => socket.emit('join', { userId: currentUser.id }));
    socket.on('new-message', (msg: Message) => addMessage(msg));
    socketRef.current = socket;
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [authed, currentUser?.id]);

  // Discover
  useEffect(() => {
    if (!authed) return;
    setDiscoverLoading(true);
    fetch('/api/discover')
      .then(r => r.json())
      .then(res => { setDiscoverUsers(res.data || []); setCascadeIndex(0); })
      .catch(() => {}).finally(() => setDiscoverLoading(false));
  }, [authed, refreshDiscover]);

  // Conversations + Groups + Chat Requests
  useEffect(() => {
    if (!authed || (activeTab !== 'chat' && activeTab !== 'more')) return;
    setChatLoading(true);
    Promise.all([
      fetch('/api/messages/conversations').then(r => r.json()),
      fetch('/api/groups').then(r => r.json()),
      fetch('/api/chat-requests').then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([convRes, groupRes, reqRes]) => {
      const convos = convRes.data || [];
      setConversations(convos);
      setGroups(groupRes.data || []);
      setTotalUnread(convos.reduce((sum: number, c: any) => sum + (c.unreadCount || 0), 0));
      const reqs = reqRes.data || [];
      const pending = reqs.filter((r: ChatRequest) => r.status === 'pending');
      setChatRequests(pending);
      setPendingRequestCount(pending.length);
    }).catch(() => {}).finally(() => setChatLoading(false));
  }, [authed, activeTab]);

  // Likes
  useEffect(() => {
    if (!authed || activeTab !== 'likes') return;
    setLikesLoading(true);
    Promise.all([
      fetch('/api/likes?type=received').then(r => r.json()),
      fetch('/api/likes?type=sent').then(r => r.json()),
    ]).then(([recRes, sentRes]) => {
      setReceivedLikes(recRes.data || []);
      setSentLikes(sentRes.data || []);
    }).catch(() => {}).finally(() => setLikesLoading(false));
  }, [authed, activeTab]);

  // Profile Views
  useEffect(() => {
    if (!authed || activeTab !== 'viewed') return;
    setViewsLoading(true);
    fetch('/api/profile-views').then(r => r.json()).then(res => setProfileViews(res.data || [])).catch(() => {}).finally(() => setViewsLoading(false));
  }, [authed, activeTab]);

  // Fansites
  useEffect(() => {
    if (!authed || activeTab !== 'fansites') return;
    setFansiteLoading(true);
    fetch('/api/fansites').then(r => r.json()).then(res => setFansites(res.data || [])).catch(() => {}).finally(() => setFansiteLoading(false));
  }, [authed, activeTab]);

  // Events
  useEffect(() => {
    if (!authed || activeTab !== 'events') return;
    setEventsLoading(true);
    fetch('/api/events').then(r => r.json()).then(res => setEvents(res.data || [])).catch(() => {}).finally(() => setEventsLoading(false));
  }, [authed, activeTab]);

  // Shouts
  useEffect(() => {
    if (!authed || activeTab !== 'shouts') return;
    setShoutLoading(true);
    fetch('/api/shouts').then(r => r.json()).then(res => setShouts(res.data || [])).catch(() => {}).finally(() => setShoutLoading(false));
  }, [authed, activeTab]);

  // Map
  useEffect(() => {
    if (!authed || activeTab !== 'map') return;
    handleFetchMap();
  }, [authed, activeTab, mapRadius]);

  // Videos
  useEffect(() => {
    if (!authed || activeTab !== 'videos') return;
    setVideosLoading(true);
    fetch('/api/videos').then(r => r.json()).then(res => setVideos(res.videos || [])).catch(() => {}).finally(() => setVideosLoading(false));
  }, [authed, activeTab]);

  // Blogs
  useEffect(() => {
    if (!authed || activeTab !== 'blogs') return;
    setBlogsLoading(true);
    fetch('/api/blogs').then(r => r.json()).then(res => setBlogs(res.blogs || [])).catch(() => {}).finally(() => setBlogsLoading(false));
  }, [authed, activeTab]);

  // Banners
  useEffect(() => {
    fetch('/api/banners').then(r => r.json()).then(res => setBanners(res.data || [])).catch(() => {});
  }, [authed]);

  // Profile drawer
  useEffect(() => {
    if (!selectedUserId) return;
    setProfileLoading(true);
    fetch(`/api/users/${selectedUserId}`).then(r => r.json()).then(res => {
      const u = res.data;
      setProfileUser(u);
      setProfilePhotos(u.photos || []);
      setProfileAlbums(u.albums || []);
      setRizzTargetBio(u.bio || '');
    }).catch(() => {}).finally(() => setProfileLoading(false));
  }, [selectedUserId]);

  // My profile data
  useEffect(() => {
    if (!authed || !currentUser || activeTab !== 'profile') return;
    Promise.all([
      fetch(`/api/users/${currentUser.id}`).then(r => r.json()),
      fetch('/api/subscriptions').then(r => r.json()),
      fetch('/api/boosts').then(r => r.json()),
      fetch('/api/blocks').then(r => r.json()),
      fetch('/api/verification?userId=' + currentUser.id).then(r => r.json()).catch(() => ({ data: null })),
      fetch('/api/sessions?userId=' + currentUser.id).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/favorites?userId=' + currentUser.id).then(r => r.json()).catch(() => ({ data: [] })),
      fetch('/api/notes?writerId=' + currentUser.id).then(r => r.json()).catch(() => ({ data: [] })),
    ]).then(([userRes, subRes, boostRes, blockRes, verRes, sessRes, favRes, noteRes]) => {
      const u = userRes.data;
      setCurrentUser(u);
      setMySubscriptions(subRes.data || []);
      setMyBoosts((boostRes.data || []).filter((b: any) => b.isActive));
      setBlockedUsers(blockRes.data || []);
      setSettingsPrivacy({ showOnline: u.showOnline ?? true, showDistance: u.showDistance ?? true, showAge: u.showAge ?? true });
      setMyVerification(verRes.data || null);
      setMySessions(sessRes.data || []);
      setFavorites(favRes.data || []);
      setNotes(noteRes.data || []);
    }).catch(() => {});
  }, [authed, activeTab]);

  // Footprints
  useEffect(() => {
    if (!authed || activeTab !== 'footprints') return;
    setFootprintsLoading(true);
    fetch('/api/footprints?userId=' + CURRENT_USER_ID).then(r => r.json()).then(res => setFootprints(res.data || [])).catch(() => {}).finally(() => setFootprintsLoading(false));
  }, [authed, activeTab]);

  // Favorites
  useEffect(() => {
    if (!authed || activeTab !== 'favorites') return;
    setFavoritesLoading(true);
    fetch('/api/favorites?userId=' + CURRENT_USER_ID).then(r => r.json()).then(res => setFavorites(res.data || [])).catch(() => {}).finally(() => setFavoritesLoading(false));
  }, [authed, activeTab]);

  // Notes
  useEffect(() => {
    if (!authed || activeTab !== 'notes') return;
    fetch('/api/notes?writerId=' + CURRENT_USER_ID).then(r => r.json()).then(res => setNotes(res.data || [])).catch(() => {});
  }, [authed, activeTab]);

  // Boosts
  useEffect(() => {
    if (!authed || activeTab !== 'boosts') return;
    setBoostsLoading(true);
    fetch('/api/boosts?userId=' + CURRENT_USER_ID).then(r => r.json()).then(res => setAllBoosts(res.data || [])).catch(() => {}).finally(() => setBoostsLoading(false));
  }, [authed, activeTab]);

  // Albums
  useEffect(() => {
    if (!authed || activeTab !== 'albums') return;
    setAlbumsLoading(true);
    fetch('/api/albums?userId=' + CURRENT_USER_ID).then(r => r.json()).then(res => setAlbums(res.data || [])).catch(() => {}).finally(() => setAlbumsLoading(false));
  }, [authed, activeTab]);

  // Groups
  useEffect(() => {
    if (!authed || activeTab !== 'groups') return;
    fetch('/api/groups').then(r => r.json()).then(res => setGroups(res.data || [])).catch(() => {});
  }, [authed, activeTab]);

  // Messages scroll
  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, groupMessages]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const openProfile = useCallback((userId: string) => setSelectedUserId(userId), []);
  const closeProfile = useCallback(() => { setShowProfileDrawer(false); setSelectedUserId(null); setProfileUser(null); }, []);

  const openChat = useCallback(async (otherUser: User) => {
    const convo: Conversation = {
      otherUser,
      lastMessage: { id: '', content: '', senderId: '', receiverId: '', chatType: 'direct', isRead: true, type: 'text', createdAt: new Date().toISOString() },
      unreadCount: 0,
    };
    setActiveConversation(convo);
    setMessages([]);
    setChatMobileView('chat');
    if (currentUser) {
      fetch(`/api/messages?userId=${otherUser.id}`).then(r => r.json()).then(res => setMessages(res.data || [])).catch(() => {});
    }
  }, [currentUser]);

  const sendMessage = useCallback(() => {
    if (!msgInput.trim() || !activeConversation || !currentUser) return;
    const content = msgInput.trim();
    setMsgInput('');
    const optimisticMsg: Message = { id: `temp-${Date.now()}`, content, senderId: currentUser.id, receiverId: activeConversation.otherUser.id, chatType: 'direct', isRead: false, type: 'text', createdAt: new Date().toISOString() };
    addMessage(optimisticMsg);
    fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiverId: activeConversation.otherUser.id, content, type: 'text' }) })
      .then(r => r.json()).then(res => { if (res.data) { setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? res.data : m)); socketRef.current?.emit('message', res.data); } }).catch(() => {});
  }, [msgInput, activeConversation, currentUser]);

  const sendGroupMessage = useCallback(() => {
    if (!msgInput.trim() || !activeGroup || !currentUser) return;
    const content = msgInput.trim();
    setMsgInput('');
    const optimisticMsg: Message = { id: `temp-${Date.now()}`, content, senderId: currentUser.id, receiverId: '', chatType: 'group', isRead: false, type: 'text', createdAt: new Date().toISOString(), sender: currentUser };
    setGroupMessages(prev => [...prev, optimisticMsg]);
    fetch(`/api/groups/${activeGroup.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'message', content }) }).catch(() => {});
  }, [msgInput, activeGroup, currentUser]);

  const handleLike = useCallback(async (receiverId: string) => {
    try { await fetch('/api/likes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiverId }) }); triggerRefreshDiscover(); } catch {}
  }, []);

  const handleUnlike = useCallback(async (receiverId: string) => {
    try { await fetch(`/api/likes?receiverId=${receiverId}`, { method: 'DELETE' }); triggerRefreshDiscover(); } catch {}
  }, []);

  const handleBlock = useCallback(async (userId: string) => {
    try { await fetch('/api/blocks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blockedId: userId }) }); setShowBlockAlert(false); closeProfile(); } catch {}
  }, [closeProfile]);

  const handleRizz = useCallback(async () => {
    setRizzLoading(true); setRizzResult(null);
    try {
      const res = await fetch('/api/ai-rizz', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetBio: rizzTargetBio, style: rizzStyle }) });
      const data = await res.json();
      setRizzResult(data.data);
    } catch { setRizzResult({ line: 'Failed to generate. Try again!', style: rizzStyle }); } finally { setRizzLoading(false); }
  }, [rizzTargetBio, rizzStyle]);

  const copyRizz = useCallback(() => { if (rizzResult?.line) navigator.clipboard.writeText(rizzResult.line); }, [rizzResult]);

  const handleSendRizz = useCallback(() => {
    if (!rizzResult || !activeConversation && !profileUser) return;
    if (activeConversation) { setMsgInput(rizzResult.line); setShowRizzModal(false); }
    else if (profileUser) { openChat(profileUser); setTimeout(() => { setMsgInput(rizzResult.line); setShowRizzModal(false); }, 300); }
  }, [rizzResult, activeConversation, profileUser, openChat]);

  const handleRsvp = useCallback(async (eventId: string, status: string) => {
    try { await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'rsvp', eventId, status }) }); setUserRsvps(prev => ({ ...prev, [eventId]: status })); } catch {}
  }, []);

  const handleCreateEvent = useCallback(async () => {
    try {
      const res = await fetch('/api/events', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(eventForm) });
      if (res.ok) { const data = await res.json(); setEvents(prev => [data.data, ...prev]); setShowCreateEvent(false); setEventForm({ title: '', description: '', location: '', startDate: '', imageUrl: '' }); }
    } catch {}
  }, [eventForm]);

  const handleSaveProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const payload: any = {};
      for (const [k, v] of Object.entries(editForm)) { if (v !== '' && v !== undefined) { if (k === 'height' || k === 'weight') payload[k] = parseInt(v); else payload[k] = v; } }
      const res = await fetch(`/api/users/${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) { const data = await res.json(); setCurrentUser(data.data); setEditingProfile(false); }
    } catch {}
  }, [currentUser, editForm]);

  const handleSaveSettings = useCallback(async () => {
    if (!currentUser) return;
    try { await fetch(`/api/users/${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settingsPrivacy) }); setCurrentUser({ ...currentUser, ...settingsPrivacy }); } catch {}
  }, [currentUser, settingsPrivacy]);

  const handleChatRequest = useCallback(async (requestId: string, action: 'accept' | 'decline') => {
    try { await fetch('/api/chat-requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ requestId, action }) }); setChatRequests(prev => prev.filter(r => r.id !== requestId)); setPendingRequestCount(prev => Math.max(0, prev - 1)); } catch {}
  }, []);

  const handleShout = useCallback(async () => {
    if (!shoutInput.trim() || !currentUser) return;
    try {
      const res = await fetch(`/api/shouts?userId=${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: shoutInput.trim(), type: shoutType }) });
      if (res.ok) { const data = await res.json(); if (data.data) addShout(data.data); setShoutInput(''); }
    } catch {}
  }, [shoutInput, currentUser, shoutType]);

  const handleFetchMap = useCallback(async () => {
    const lat = userLat || currentUser?.lat || 35.69;
    const lng = userLng || currentUser?.lng || 14.42;
    setMapLoading(true);
    try {
      const res = await fetch(`/api/user-map?lat=${lat}&lng=${lng}&radius=${mapRadius}&userId=${CURRENT_USER_ID}`);
      const data = await res.json();
      setMapUsers(data.users || []);
    } catch {} finally { setMapLoading(false); }
  }, [currentUser, userLat, userLng, mapRadius]);

  const handleFavorite = useCallback(async (targetId: string, isSuper: boolean = false) => {
    if (!currentUser) return;
    try { await fetch(`/api/favorites?userId=${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId, isSuper }) }); } catch {}
  }, [currentUser]);

  const handleSaveNote = useCallback(async () => {
    if (!currentUser || !noteTargetId || !noteContent.trim()) return;
    try { await fetch(`/api/notes?writerId=${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId: noteTargetId, content: noteContent.trim() }) }); setShowNoteDialog(false); setNoteContent(''); setNoteTargetId(null); } catch {}
  }, [currentUser, noteTargetId, noteContent]);

  const handleDeleteNote = useCallback(async (noteId: string) => {
    try { await fetch(`/api/notes/${noteId}`, { method: 'DELETE' }); setNotes(prev => prev.filter((n: any) => n.id !== noteId)); } catch {}
  }, []);

  const handleInfer = useCallback(async (category?: InferCategory) => {
    if (!inferTargetUser) return;
    const cats = category ? [category] : INFER_CATEGORIES.map(c => c.id);
    setInferLoading(true);
    const newResults: Record<string, any> = {};
    for (const cat of cats) {
      try {
        const res = await fetch('/api/ai-rizz', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetBio: inferTargetUser.bio || '', style: cat, fullProfile: inferTargetUser, inferCategory: cat }),
        });
        const data = await res.json();
        newResults[cat] = { category: cat, confidence: Math.floor(Math.random() * 30 + 70), title: data.data?.line || 'Analysis complete', content: data.data?.context || `Detailed ${cat} analysis for ${inferTargetUser.displayName}`, bulletPoints: ['Based on profile analysis', 'AI-generated insights', 'Personalized recommendations'], color: cat === 'red-flags' ? 'red' : cat === 'green-flags' ? 'green' : 'blue' };
      } catch { newResults[cat] = { category: cat, confidence: 50, title: 'Analysis unavailable', content: 'Could not generate analysis', bulletPoints: [], color: 'gray' }; }
    }
    setInferResultsMap(newResults);
    setInferLoading(false);
  }, [inferTargetUser]);

  const handleCreateGroup = useCallback(async () => {
    if (!currentUser || !groupForm.name.trim()) return;
    try {
      const res = await fetch('/api/groups', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(groupForm) });
      if (res.ok) { const data = await res.json(); setGroups(prev => [data.data, ...prev]); setShowCreateGroup(false); setGroupForm({ name: '', description: '', isPublic: true }); }
    } catch {}
  }, [currentUser, groupForm]);

  const handleCreateBanner = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await fetch('/api/banners', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: 'My Banner', imageUrl: DEFAULT_COVER, position: 0 }) });
      if (res.ok) { const data = await res.json(); setBanners(prev => [...prev, data.data]); }
    } catch {}
  }, [currentUser]);

  // Filtered discover users
  const filteredDiscover = discoverUsers.filter(u => {
    if (onlineOnly && !u.online) return false;
    if (u.age && (u.age < ageRange[0] || u.age > ageRange[1])) return false;
    if (lookingFor !== 'all' && u.lookingFor !== lookingFor) return false;
    if (ethnicityFilter !== 'all' && u.ethnicity !== ethnicityFilter) return false;
    if (bodyTypeFilter !== 'all' && u.bodyType !== bodyTypeFilter) return false;
    return true;
  });

  const cascadeUser = filteredDiscover[cascadeIndex];

  // ═══════════════════════════════════════════════════════════════
  // LOGIN SCREEN
  // ═══════════════════════════════════════════════════════════════
  if (authLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background gap-4">
        <div className="text-2xl font-bold gradient-text">NEXUS</div>
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background px-6">
        <div className="text-4xl font-bold gradient-text mb-2">NEXUS</div>
        <p className="text-muted-foreground text-sm mb-8">Connect. Discover. Thrive.</p>
        <Card className="w-full max-w-sm bg-card border-border"><CardContent className="p-6">
          <button onClick={() => { setCurrentUser({ id: CURRENT_USER_ID, username: 'testuser', displayName: 'Test User', email: 'test@nexus.app', avatar: DEFAULT_AVATAR, bio: 'Love adventures and good coffee ☕', age: 28, gender: 'male', location: 'Valletta, Malta', lat: 35.8989, lng: 14.5146, geoCity: 'Valletta', geoRegion: 'Central Region', geoCountry: 'Malta', online: true, lastSeen: new Date().toISOString(), isPremium: true, isVerified: true, showOnline: true, showDistance: true, showAge: true, showActivity: true, hidePicsOffline: false, lookingFor: 'relationship', aboutMe: 'Adventurous soul looking for meaningful connections. I love hiking, photography, and trying new cuisines. Always up for a good conversation over coffee or wine.', height: 180, weight: 75, ethnicity: 'white', bodyType: 'athletic', relationshipStatus: 'single', position: 'versatile', pronouns: 'he/him', displayUnits: 'metric', lang: 'en', soundOff: false, notifPushOff: false, notifEmailOff: false, notifTelegramOff: false, mailingInternal: true, mailingPartner: true, profileOff: false, privateAuto: false, noPros: false, noPub: false, isProfessional: false, professionalStatus: 'none', verificationStatus: 'verified', voucher: null, _count: { photos: 12, receivedLikes: 47, receivedViews: 234, shouts: 5, favorites: 18, blogs: 2, videos: 1, sentMessages: 89, receivedMessages: 76, notesWritten: 8 } } as any); setAuthed(true); }} className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium">
            Quick Login as Test User
          </button>
        </CardContent></Card>
      </div>
    );
  }


  // ═══════════════════════════════════════════════════════════════
  // MAIN NAV CONSTANTS
  // ═══════════════════════════════════════════════════════════════
  const MAIN_TABS = [
    { tab: 'discover' as const, icon: Compass, label: 'Discover', badge: 0 },
    { tab: 'map' as const, icon: MapPinned, label: 'Map', badge: 0 },
    { tab: 'chat' as const, icon: MessageCircle, label: 'Chat', badge: totalUnread + pendingRequestCount },
    { tab: 'likes' as const, icon: Heart, label: 'Likes', badge: receivedLikes.length },
    { tab: 'more' as const, icon: Grid2X2, label: 'More', badge: 0 },
  ];

  const isMainTab = (t: string) => ['discover', 'map', 'chat', 'likes', 'more'].includes(t);

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      events: 'Events & Agenda', viewed: 'Viewed Me', shouts: 'Shouts',
      fansites: 'Fansites', videos: 'Videos', blogs: 'Blogs', groups: 'Groups',
      albums: 'Albums', membership: 'Membership', verified: 'Verified',
      professional: 'Professional', footprints: 'Footprints', notes: 'Notes',
      boosts: 'Boosts', favorites: 'Favorites', account: 'Account',
      preferences: 'Preferences', 'geo-settings': 'GEO Settings',
      banners: 'Banners', sites: 'Sites', legal: 'Legal', faqs: 'FAQs',
      abuse: 'Report & Block', advantages: 'Advantages', affiliation: 'Affiliation',
      profile: 'My Profile', infer: 'INFER AI Analysis', more: 'More',
    };
    return titles[activeTab] || 'NEXUS';
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <TooltipProvider>
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">

      {/* ═══ HEADER ═══ */}
      <header className="h-14 flex items-center justify-between px-4 bg-card/80 backdrop-blur-lg border-b border-border shrink-0 z-50">
        <div className="flex items-center gap-3">
          {isMainTab(activeTab) ? (
            <span className="text-lg font-bold gradient-text tracking-wider">NEXUS</span>
          ) : (
            <button onClick={() => setActiveTab('more')} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {activeTab === 'chat' && activeConversation && (
            <button onClick={() => { setActiveConversation(null); setActiveGroup(null); setChatMobileView('list'); }} className="md:hidden p-1 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {!isMainTab(activeTab) && <span className="text-sm font-medium">{getPageTitle()}</span>}
        </div>
        <div className="flex items-center gap-1">
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><Search className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Search</TooltipContent></Tooltip>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={() => setShowSettings(true)}><Settings className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Settings</TooltipContent></Tooltip>
          <button onClick={() => currentUser && openProfile(currentUser.id)} className="ml-1">
            <Avatar className="h-8 w-8 border-2 border-primary/50">
              <AvatarImage src={getAvatar(currentUser)} alt={currentUser?.displayName || ''} />
              <AvatarFallback className="text-xs">{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
          </button>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 overflow-hidden relative">
        {showSettings ? <SettingsPanel /> : activeTab === 'discover' ? <DiscoverView /> : activeTab === 'map' ? <MapView /> : activeTab === 'chat' ? <ChatView /> : activeTab === 'likes' ? <LikesView /> : activeTab === 'more' ? <MoreView /> : activeTab === 'events' ? <EventsView /> : activeTab === 'viewed' ? <ViewedMeView /> : activeTab === 'shouts' ? <ShoutsView /> : activeTab === 'fansites' ? <FansitesView /> : activeTab === 'videos' ? <VideosView /> : activeTab === 'blogs' ? <BlogsView /> : activeTab === 'groups' ? <GroupsView /> : activeTab === 'albums' ? <AlbumsView /> : activeTab === 'membership' ? <MembershipView /> : activeTab === 'verified' ? <VerifiedView /> : activeTab === 'professional' ? <ProfessionalView /> : activeTab === 'footprints' ? <FootprintsView /> : activeTab === 'notes' ? <NotesView /> : activeTab === 'boosts' ? <BoostsView /> : activeTab === 'favorites' ? <FavoritesView /> : activeTab === 'account' ? <AccountView /> : activeTab === 'preferences' ? <PreferencesView /> : activeTab === 'geo-settings' ? <GeoSettingsView /> : activeTab === 'banners' ? <BannersView /> : activeTab === 'sites' ? <SitesView /> : activeTab === 'legal' ? <LegalView /> : activeTab === 'faqs' ? <FaqsView /> : activeTab === 'abuse' ? <AbuseView /> : activeTab === 'advantages' ? <AdvantagesView /> : activeTab === 'affiliation' ? <AffiliationView /> : activeTab === 'profile' ? <ProfileView /> : activeTab === 'infer' ? <InferView /> : <MoreView />}
      </main>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className="h-14 flex items-center justify-around bg-card border-t border-border shrink-0 z-50 px-0.5">
        {MAIN_TABS.map(({ tab, icon: Icon, label, badge }) => (
          <button key={tab} onClick={() => { setActiveTab(tab); setShowSettings(false); if (tab === 'chat') { setChatMobileView('list'); setActiveConversation(null); setActiveGroup(null); } }}
            className={`h-12 flex flex-col items-center justify-center gap-0.5 relative transition-colors px-1 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
            <Icon className="w-4 h-4" />
            <span className="text-[9px] leading-none">{label}</span>
            {activeTab === tab && <span className="absolute bottom-0 w-4 h-0.5 bg-primary rounded-full" />}
            {badge > 0 && <span className="absolute -top-0.5 right-1/2 translate-x-4 min-w-[14px] h-3.5 flex items-center justify-center text-[8px] font-bold bg-primary text-primary-foreground rounded-full px-0.5">{badge > 99 ? '99+' : badge}</span>}
          </button>
        ))}
      </nav>

      {/* ═══ PROFILE DRAWER ═══ */}
      <Sheet open={showProfileDrawer} onOpenChange={(open) => { if (!open) closeProfile(); }}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-card border-border p-0 overflow-y-auto">
          {profileLoading ? <div className="p-6 space-y-4"><Skeleton className="h-64 w-full rounded-xl" /><Skeleton className="h-6 w-48" /><Skeleton className="h-4 w-32" /></div>
            : profileUser ? <ProfileDrawerContent /> : null}
        </SheetContent>
      </Sheet>

      {/* ═══ FANSITE DETAIL SHEET ═══ */}
      <Sheet open={showFansiteSheet} onOpenChange={setShowFansiteSheet}>
        <SheetContent side="bottom" className="max-h-[85vh] bg-card border-border rounded-t-2xl">
          {selectedFansite && <FansiteDetail />}
        </SheetContent>
      </Sheet>

      {/* ═══ ALBUM DETAIL SHEET ═══ */}
      <Sheet open={!!selectedAlbum} onOpenChange={(open) => { if (!open) setSelectedAlbum(null); }}>
        <SheetContent side="bottom" className="max-h-[85vh] bg-card border-border rounded-t-2xl">
          {selectedAlbum && <AlbumDetail />}
        </SheetContent>
      </Sheet>

      {/* ═══ BLOG DETAIL SHEET ═══ */}
      <Sheet open={!!selectedBlog} onOpenChange={(open) => { if (!open) setSelectedBlog(null); }}>
        <SheetContent side="bottom" className="max-h-[85vh] bg-card border-border rounded-t-2xl">
          {selectedBlog && <BlogDetail />}
        </SheetContent>
      </Sheet>

      {/* ═══ RIZZ MODAL ═══ */}
      <Dialog open={showRizzModal} onOpenChange={setShowRizzModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Rizz Generator</DialogTitle></DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-wrap gap-2">
              {RIZZ_STYLES.map(s => (
                <button key={s.value} onClick={() => setRizzStyle(s.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${rizzStyle === s.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'}`}>
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <Button onClick={handleRizz} disabled={rizzLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {rizzLoading ? 'Generating...' : 'Generate Pickup Line'}
            </Button>
            {rizzResult && (
              <div className="p-4 rounded-xl bg-secondary border border-border space-y-3">
                <p className="text-sm leading-relaxed">{rizzResult.line}</p>
                {rizzResult.context && <p className="text-[11px] text-muted-foreground">{rizzResult.context}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyRizz} className="text-xs border-border"><Copy className="w-3 h-3 mr-1" /> Copy</Button>
                  <Button size="sm" onClick={handleSendRizz} className="text-xs bg-primary text-primary-foreground"><Send className="w-3 h-3 mr-1" /> Send</Button>
                </div>
                {rizzResult.alternatives?.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alternatives</p>
                    {rizzResult.alternatives.map((alt: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground" onClick={() => setRizzResult({ ...rizzResult, line: alt })}>{alt}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ NOTE DIALOG ═══ */}
      <Dialog open={showNoteDialog} onOpenChange={setShowNoteDialog}>
        <DialogContent className="bg-card border-border sm:max-w-sm">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><StickyNote className="w-5 h-5 text-primary" /> Add Note</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <Textarea value={noteContent} onChange={e => setNoteContent(e.target.value)} placeholder="Write a private note..." className="bg-secondary border-border text-sm" rows={3} />
            <div className="flex gap-2">
              <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveNote} disabled={!noteContent.trim()}>Save</Button>
              <Button size="sm" variant="outline" className="border-border" onClick={() => { setShowNoteDialog(false); setNoteContent(''); }}>Cancel</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ BLOCK ALERT ═══ */}
      <AlertDialog open={showBlockAlert} onOpenChange={setShowBlockAlert}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>This user won't be able to see your profile or message you.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => profileUser && handleBlock(profileUser.id)} className="bg-destructive text-white">Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ═══ CREATE EVENT DIALOG ═══ */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle>Create Event</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Title</Label><Input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="Event name" className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Description</Label><Textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} placeholder="What's this about?" className="bg-secondary border-border" rows={3} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Location</Label><Input value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} placeholder="Venue" className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Date & Time</Label><Input type="datetime-local" value={eventForm.startDate} onChange={e => setEventForm(p => ({ ...p, startDate: e.target.value }))} className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Image URL</Label><Input value={eventForm.imageUrl} onChange={e => setEventForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="bg-secondary border-border" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateEvent(false)} className="border-border">Cancel</Button>
            <Button onClick={handleCreateEvent} className="bg-primary text-primary-foreground" disabled={!eventForm.title || !eventForm.startDate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ CREATE GROUP DIALOG ═══ */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader><DialogTitle>Create Group</DialogTitle></DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Group Name</Label><Input value={groupForm.name} onChange={e => setGroupForm(p => ({ ...p, name: e.target.value }))} placeholder="Group name" className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Description</Label><Textarea value={groupForm.description} onChange={e => setGroupForm(p => ({ ...p, description: e.target.value }))} placeholder="About this group" className="bg-secondary border-border" rows={2} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGroup(false)} className="border-border">Cancel</Button>
            <Button onClick={handleCreateGroup} className="bg-primary text-primary-foreground" disabled={!groupForm.name.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══ DELETE ACCOUNT ALERT ═══ */}
      <AlertDialog open={showDeleteAccount} onOpenChange={setShowDeleteAccount}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader><AlertDialogTitle>Delete Account?</AlertDialogTitle><AlertDialogDescription>This is permanent and cannot be undone. All your data will be removed.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white" onClick={() => { setCurrentUser(null); setAuthed(false); setShowDeleteAccount(false); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
    </TooltipProvider>
  );

  // ═══════════════════════════════════════════════════════════════
  // VIEW FUNCTIONS (hoisted — available throughout component)
  // ═══════════════════════════════════════════════════════════════

  // ─── DISCOVER ────────────────────────────────────────────────
  function DiscoverView() {
    if (discoverLoading) return <LoadingGrid />;
    if (discoverUsers.length === 0) return <EmptyState icon={Compass} title="No profiles found" desc="Check back later for new people nearby" />;
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-border shrink-0 overflow-x-auto">
          <button onClick={() => setOnlineOnly(!onlineOnly)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${onlineOnly ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>🟢 Online</button>
          <Popover><PopoverTrigger asChild><button className="px-3 py-1.5 rounded-full text-[11px] font-medium border bg-secondary text-muted-foreground border-border shrink-0">{ageRange[0]}–{ageRange[1]}</button></PopoverTrigger>
            <PopoverContent className="w-64 bg-card border-border p-3"><Label className="text-xs text-muted-foreground">Age Range</Label><Slider value={ageRange} onValueChange={setAgeRange} min={18} max={80} step={1} className="mt-2" /><div className="flex justify-between text-[11px] text-muted-foreground mt-1"><span>{ageRange[0]}</span><span>{ageRange[1]}</span></div></PopoverContent>
          </Popover>
          <Select value={lookingFor} onValueChange={setLookingFor}><SelectTrigger className="h-7 text-[11px] bg-secondary border-border w-auto"><SelectValue /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="all">All</SelectItem><SelectItem value="relationship">Relationship</SelectItem><SelectItem value="casual">Casual</SelectItem><SelectItem value="friends">Friends</SelectItem><SelectItem value="networking">Networking</SelectItem></SelectContent></Select>
          <Select value={ethnicityFilter} onValueChange={setEthnicityFilter}><SelectTrigger className="h-7 text-[11px] bg-secondary border-border w-auto"><SelectValue placeholder="Ethnicity" /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="all">Any Ethnicity</SelectItem><SelectItem value="white">White</SelectItem><SelectItem value="black">Black</SelectItem><SelectItem value="latino">Latino</SelectItem><SelectItem value="asian">Asian</SelectItem><SelectItem value="middle-eastern">Middle Eastern</SelectItem><SelectItem value="indian">Indian</SelectItem><SelectItem value="mixed">Mixed</SelectItem></SelectContent></Select>
          <Select value={bodyTypeFilter} onValueChange={setBodyTypeFilter}><SelectTrigger className="h-7 text-[11px] bg-secondary border-border w-auto"><SelectValue placeholder="Body" /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="all">Any Body Type</SelectItem><SelectItem value="slim">Slim</SelectItem><SelectItem value="average">Average</SelectItem><SelectItem value="athletic">Athletic</SelectItem><SelectItem value="muscular">Muscular</SelectItem><SelectItem value="curvy">Curvy</SelectItem></SelectContent></Select>
          <div className="ml-auto flex gap-1 shrink-0">
            <button onClick={() => setDiscoverView('grid')} className={`p-1.5 rounded-lg ${discoverView === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setDiscoverView('cascade')} className={`p-1.5 rounded-lg ${discoverView === 'cascade' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}><Layers className="w-4 h-4" /></button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          {discoverView === 'cascade' ? (
            <div className="flex items-center justify-center p-6 h-full">
              {cascadeUser ? (
                <div key={cascadeUser.id} className="w-full max-w-sm cascade-animate">
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
                    {(cascadeUser.photos && cascadeUser.photos[0]) ? <img src={cascadeUser.photos[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-20 h-20 text-muted-foreground" /></div>}
                    <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/60 to-transparent" />
                    {cascadeUser.isPremium && <div className="absolute top-3 right-3"><Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] border-yellow-500/30"><Crown className="w-3 h-3 mr-0.5" /> Premium</Badge></div>}
                    {cascadeUser.isVerified && <div className="absolute top-3 left-3"><Badge className="bg-blue-500/20 text-blue-400 text-[10px] border-blue-500/30"><ShieldCheck className="w-3 h-3" /></Badge></div>}
                    {cascadeUser.online && cascadeUser.showOnline && <div className="absolute top-3 left-1/2 -translate-x-1/2"><span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] text-green-400"><span className="w-1.5 h-1.5 bg-green-400 rounded-full online-pulse" /> Online</span></div>}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-xl font-bold">{cascadeUser.displayName}{cascadeUser.age ? `, ${cascadeUser.age}` : ''}</h3>
                      {cascadeUser.location && <p className="text-sm text-muted-foreground flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{cascadeUser.location}</p>}
                      {cascadeUser.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{truncate(cascadeUser.bio, 100)}</p>}
                      {cascadeUser.lookingFor && <Badge className="mt-2 bg-primary/20 text-primary text-[10px] border-primary/30 capitalize">{cascadeUser.lookingFor}</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-4 justify-center">
                    <button onClick={() => setCascadeIndex(i => i + 1)} className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
                    <button onClick={() => handleLike(cascadeUser.id)} className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary"><Heart className="w-5 h-5" /></button>
                    <button onClick={() => openChat(cascadeUser)} className="w-12 h-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary"><MessageCircle className="w-5 h-5" /></button>
                    <button onClick={() => openProfile(cascadeUser.id)} className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"><Star className="w-5 h-5" /></button>
                    <button onClick={() => { setRizzTargetBio(cascadeUser.bio || ''); setShowRizzModal(true); }} className="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"><Sparkles className="w-5 h-5" /></button>
                  </div>
                </div>
              ) : <EmptyState icon={Compass} title="No more profiles" desc="Adjust your filters or check back later" />}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 p-4">
              {filteredDiscover.map(user => (
                <button key={user.id} onClick={() => openProfile(user.id)} className="profile-card rounded-xl overflow-hidden bg-secondary border border-border text-left">
                  <div className="aspect-[3/4] relative">
                    {(user.photos && user.photos[0]) ? <img src={user.photos[0].url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-secondary"><User className="w-12 h-12 text-muted-foreground" /></div>}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-secondary via-secondary/50 to-transparent" />
                    {user.online && user.showOnline && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-secondary online-pulse" />}
                    {user.isPremium && <Crown className="absolute top-2 left-2 w-3.5 h-3.5 text-yellow-400" />}
                  </div>
                  <div className="p-2.5 -mt-6 relative">
                    <p className="text-[13px] font-semibold truncate">{user.displayName}{user.age ? `, ${user.age}` : ''}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{user.location || ''}</p>
                    {user.distance != null && <p className="text-[10px] text-primary">{user.distance} km away</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }


  // ─── MAP VIEW ───────────────────────────────────────────────
  function MapView() {
    const mapCenterLat = userLat || currentUser?.lat || 35.8989;
    const mapCenterLng = userLng || currentUser?.lng || 14.5146;
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-border shrink-0 overflow-x-auto">
          <Select value={mapFilter} onValueChange={setMapFilter}><SelectTrigger className="h-7 text-[11px] bg-secondary border-border w-auto"><SelectValue /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="all">All Users</SelectItem><SelectItem value="online">Online</SelectItem><SelectItem value="recent">Recent</SelectItem><SelectItem value="nearby">Nearby</SelectItem><SelectItem value="new">New</SelectItem><SelectItem value="verified">Verified</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent></Select>
          <Popover><PopoverTrigger asChild><button className="px-3 py-1.5 rounded-full text-[11px] font-medium border bg-secondary text-muted-foreground border-border shrink-0">{mapRadius} km</button></PopoverTrigger>
            <PopoverContent className="w-64 bg-card border-border p-3"><Label className="text-xs text-muted-foreground">Radius</Label><Slider value={[mapRadius]} onValueChange={([v]) => setMapRadius(v)} min={1} max={200} step={1} className="mt-2" /><p className="text-[11px] text-muted-foreground mt-1">{mapRadius} km</p></PopoverContent>
          </Popover>
          <button onClick={() => setMapHidden(!mapHidden)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium border shrink-0 ${mapHidden ? 'bg-destructive/20 text-destructive border-destructive/30' : 'bg-secondary text-muted-foreground border-border'}`}>{mapHidden ? '👁 Hidden' : '👁 Visible'}</button>
          <span className="ml-auto text-[11px] text-muted-foreground">{mapUsers.length} users</span>
        </div>
        <div className="flex-1 relative">
          {mapLoading ? <div className="absolute inset-0 flex items-center justify-center"><Skeleton className="w-full h-full" /></div> : mapHidden ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/20 gap-3">
              <MapPinOff className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Map hidden</p>
              <p className="text-xs text-muted-foreground">Your location is not visible to others</p>
            </div>
          ) : (
            <MapLeaflet users={mapUsers} centerLat={mapCenterLat} centerLng={mapCenterLng} radius={mapRadius} onUserClick={openProfile} />
          )}
        </div>
      </div>
    );
  }

  // ─── CHAT VIEW ─────────────────────────────────────────────
  function ChatView() {
    if (chatLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
    return (
      <div className="h-full flex flex-col">
        {chatMobileView === 'chat' && (activeConversation || activeGroup) ? (
          <NexusChat
            msgInput={msgInput}
            setMsgInput={setMsgInput}
            sendMessage={sendMessage}
            sendGroupMessage={sendGroupMessage}
            activeConversation={activeConversation}
            activeGroup={activeGroup}
            messages={messages}
            groupMessages={groupMessages}
            setGroupMessages={setGroupMessages}
            getAvatar={getAvatar}
            openProfile={openProfile}
            setActiveConversation={setActiveConversation}
            setActiveGroup={setActiveGroup}
            setChatMobileView={setChatMobileView}
            msgEndRef={msgEndRef}
            socket={socketRef.current}
          />
        ) : (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Chat Requests */}
              {chatRequests.length > 0 && (
                <div className="space-y-2">
                  <SectionHeader icon={Bell} label="Chat Requests" count={chatRequests.length} />
                  {chatRequests.map(req => (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                      <button onClick={() => openProfile(req.sender?.id || '')}><Avatar className="h-10 w-10"><AvatarImage src={getAvatar(req.sender)} /><AvatarFallback className="text-xs">{req.sender?.displayName?.[0]}</AvatarFallback></Avatar></button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold">{req.sender?.displayName}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{req.message || 'Wants to chat with you'}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground px-2" onClick={() => handleChatRequest(req.id, 'accept')}>Accept</Button>
                        <Button size="sm" variant="outline" className="h-7 text-[10px] border-border px-2" onClick={() => handleChatRequest(req.id, 'decline')}>Decline</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Conversations */}
              <Tabs defaultValue="direct">
                <TabsList className="bg-secondary border border-border w-full h-9 p-0.5">
                  <TabsTrigger value="direct" className="text-[11px] flex-1 h-7">Messages</TabsTrigger>
                  <TabsTrigger value="groups" className="text-[11px] flex-1 h-7">Groups</TabsTrigger>
                </TabsList>
                <TabsContent value="direct" className="mt-3 space-y-1">
                  {conversations.length === 0 ? <EmptyState icon={MessageCircle} title="No messages yet" desc="Start a conversation from someone's profile" />
                    : conversations.map(convo => (
                      <button key={convo.otherUser.id} onClick={() => { setActiveConversation(convo); setChatMobileView('chat'); fetch(`/api/messages?userId=${convo.otherUser.id}`).then(r => r.json()).then(res => setMessages(res.data || [])).catch(() => {}); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                        <div className="relative shrink-0">
                          <Avatar className="h-11 w-11"><AvatarImage src={getAvatar(convo.otherUser)} /><AvatarFallback className="text-xs">{convo.otherUser.displayName?.[0]}</AvatarFallback></Avatar>
                          {convo.otherUser.online && convo.otherUser.showOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-[13px] font-semibold truncate">{convo.otherUser.displayName}</p>
                            <span className="text-[10px] text-muted-foreground shrink-0">{timeAgo(convo.lastMessage.createdAt)}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{convo.lastMessage.content || '...'}</p>
                        </div>
                        {convo.unreadCount > 0 && <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full">{convo.unreadCount}</span>}
                      </button>
                    ))}
                </TabsContent>
                <TabsContent value="groups" className="mt-3 space-y-1">
                  {groups.length === 0 ? <EmptyState icon={Users} title="No groups yet" desc="Create or join a group to get started" />
                    : groups.filter((g: any) => !g.hidden).map(group => (
                      <button key={group.id} onClick={() => { setActiveGroup(group); setGroupMessages([]); setChatMobileView('chat'); }}
                        className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                        <Avatar className="h-11 w-11"><AvatarImage src={group.avatar} /><AvatarFallback className="text-xs">{group.name?.[0]}</AvatarFallback></Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate">{group.name}</p>
                          <p className="text-[11px] text-muted-foreground">{group._count?.members || 0} members {group.geoName ? `· ${group.geoName}` : ''}</p>
                        </div>
                      </button>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        )}
      </div>
    );
  }

  function ActiveChatView() {
    const chatUser = activeConversation?.otherUser;
    const groupInfo = activeGroup;
    const isGroup = !!groupInfo;
    const chatMessages = isGroup ? groupMessages : messages;
    return (
      <div className="h-full flex flex-col">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-2 border-b border-border shrink-0">
          <button onClick={() => { setActiveConversation(null); setActiveGroup(null); setChatMobileView('list'); }} className="md:hidden p-1 hover:bg-secondary rounded-lg"><ChevronLeft className="w-5 h-5" /></button>
          <button onClick={() => chatUser && openProfile(chatUser.id)}>
            <Avatar className="h-9 w-9"><AvatarImage src={getAvatar(isGroup ? undefined : chatUser)} /><AvatarFallback className="text-xs">{(isGroup ? groupInfo?.name : chatUser?.displayName)?.[0]}</AvatarFallback></Avatar>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold truncate">{isGroup ? groupInfo?.name : chatUser?.displayName}</p>
            <p className="text-[10px] text-muted-foreground">{isGroup ? `${groupInfo?._count?.members || 0} members` : chatUser?.online ? 'Online' : 'Offline'}</p>
          </div>
          <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => { setRizzTargetBio(chatUser?.bio || ''); setShowRizzModal(true); }}><Sparkles className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>AI Rizz</TooltipContent></Tooltip>
        </div>
        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 py-4">
            {chatMessages.length === 0 && <p className="text-center text-xs text-muted-foreground py-8">No messages yet. Say hello!</p>}
            {chatMessages.map(msg => {
              const isMine = msg.senderId === currentUser?.id;
              return (
                <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] px-3 py-2 rounded-2xl ${isMine ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary border border-border rounded-bl-md'}`}>
                    {!isMine && !isGroup && <p className="text-[10px] font-medium opacity-70">{msg.sender?.displayName}</p>}
                    {isGroup && !isMine && <p className="text-[10px] font-medium opacity-70">{msg.sender?.displayName}</p>}
                    <p className="text-[13px]">{msg.content}</p>
                    <p className={`text-[9px] mt-1 ${isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{timeAgo(msg.createdAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={msgEndRef} />
          </div>
        </ScrollArea>
        {/* Input */}
        <div className="px-4 py-3 border-t border-border shrink-0 flex gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 text-muted-foreground"><Paperclip className="w-4 h-4" /></Button>
          <Input value={msgInput} onChange={e => setMsgInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && isGroup ? sendGroupMessage() : e.key === 'Enter' && sendMessage()} placeholder="Type a message..." className="bg-secondary border-border h-9 text-[13px]" />
          <Button size="icon" className="h-9 w-9 shrink-0 bg-primary text-primary-foreground" onClick={isGroup ? sendGroupMessage : sendMessage}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    );
  }

  // ─── LIKES VIEW ─────────────────────────────────────────────
  function LikesView() {
    if (likesLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
    return (
      <div className="h-full flex flex-col">
        <Tabs value={likesTab} onValueChange={(v) => setLikesTab(v as 'received' | 'sent')} className="flex flex-col h-full">
          <div className="px-4 pt-3 shrink-0">
            <TabsList className="bg-secondary border border-border w-full h-9 p-0.5">
              <TabsTrigger value="received" className="text-[11px] flex-1 h-7">Received ({receivedLikes.length})</TabsTrigger>
              <TabsTrigger value="sent" className="text-[11px] flex-1 h-7">Sent ({sentLikes.length})</TabsTrigger>
            </TabsList>
          </div>
          <ScrollArea className="flex-1">
            <TabsContent value="received" className="mt-3 px-4">
              {receivedLikes.length === 0 ? <EmptyState icon={Heart} title="No likes received" desc="When someone likes you, they'll appear here" />
                : receivedLikes.map(like => like.sender && (
                  <div key={like.id} className="mb-2">
                    <UserRow user={like.sender} sub={<span>{timeAgo(like.createdAt)}</span>}
                      onClick={() => openProfile(like.sender.id)}
                      actions={
                        <>
                          <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground px-2" onClick={() => openChat(like.sender)}>Accept</Button>
                          <Button size="sm" variant="ghost" className="h-7 text-[10px] text-muted-foreground px-2" onClick={() => handleUnlike(like.sender.id)}><X className="w-3 h-3" /></Button>
                        </>
                      } />
                  </div>
                ))}
            </TabsContent>
            <TabsContent value="sent" className="mt-3 px-4">
              {sentLikes.length === 0 ? <EmptyState icon={Heart} title="No likes sent" desc="Like someone and they'll appear here" />
                : sentLikes.map(like => like.receiver && (
                  <div key={like.id} className="mb-2">
                    <UserRow user={like.receiver} sub={<span>{timeAgo(like.createdAt)}</span>} onClick={() => openProfile(like.receiver.id)}
                      actions={<Button size="sm" variant="ghost" className="h-7 text-[10px] text-destructive px-2" onClick={() => handleUnlike(like.receiver.id)}><X className="w-3 h-3" /></Button>} />
                  </div>
                ))}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    );
  }

  // ─── MORE VIEW (Page Directory) ───────────────────────────
  function MoreView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <p className="text-xs text-muted-foreground">Explore all features of NEXUS</p>
          {Object.entries(PAGE_DIRECTORY).map(([category, pages]) => (
            <div key={category}>
              <h3 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-3">{category}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {pages.map(page => {
                  const Icon = page.icon;
                  return (
                    <button key={page.id} onClick={() => setActiveTab(page.id)}
                      className="flex flex-col items-start gap-2 p-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-all text-left group">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate">{page.label}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{page.description}</p>
                      </div>
                      {page.badge && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="h-4" />
        </div>
      </ScrollArea>
    );
  }

  // ─── EVENTS VIEW ───────────────────────────────────────────
  function EventsView() {
    if (eventsLoading) return <LoadingGrid cols={1} rows={4} />;
    const filteredEvents = events.filter((e: any) => {
      if (agendaFilter === 'today') return isToday(new Date(e.startDate));
      if (agendaFilter === 'this-week') return isThisWeek(new Date(e.startDate));
      if (agendaFilter === 'this-month') return isThisMonth(new Date(e.startDate));
      return true;
    });
    return (
      <div className="h-full flex flex-col">
        <div className="px-3 py-2 flex items-center gap-2 border-b border-border shrink-0 overflow-x-auto">
          {(['all', 'today', 'this-week', 'this-month', 'nearby', 'my-events'] as const).map(f => (
            <button key={f} onClick={() => setAgendaFilter(f)} className={`px-3 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${agendaFilter === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
              {f.replace('-', ' ')}
            </button>
          ))}
          <div className="ml-auto flex gap-1 shrink-0">
            <button onClick={() => setAgendaView('list')} className={`p-1.5 rounded-lg ${agendaView === 'list' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}><FileText className="w-4 h-4" /></button>
            <button onClick={() => setAgendaView('calendar')} className={`p-1.5 rounded-lg ${agendaView === 'calendar' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}><Calendar className="w-4 h-4" /></button>
            <button onClick={() => setAgendaView('map')} className={`p-1.5 rounded-lg ${agendaView === 'map' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}><MapPinned className="w-4 h-4" /></button>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            <Button className="w-full bg-primary text-primary-foreground h-9 text-xs" onClick={() => setShowCreateEvent(true)}><Plus className="w-3.5 h-3.5 mr-1.5" /> Create Event</Button>
            {filteredEvents.length === 0 ? <EmptyState icon={Calendar} title="No events found" desc="Create one or adjust filters" />
              : filteredEvents.map((event: any) => (
                <Card key={event.id} className="bg-secondary border-border overflow-hidden">
                  {event.imageUrl && <img src={event.imageUrl} alt="" className="w-full h-32 object-cover" />}
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold">{event.title}</h3>
                        {event.description && <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2">{event.description}</p>}
                        <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-2">
                          <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{fmtDate(event.startDate)}</span>
                          {event.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{truncate(event.location, 20)}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 mt-3">
                      {(['going', 'maybe', 'interested', 'declined'] as const).map(status => (
                        <button key={status} onClick={() => handleRsvp(event.id, status)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-medium border transition-all ${userRsvps[event.id] === status ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}>
                          {status}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // ─── VIEWED ME VIEW ────────────────────────────────────────
  function ViewedMeView() {
    if (viewsLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-1">
          {profileViews.length === 0 ? <EmptyState icon={Eye} title="No profile views" desc="When someone views your profile, they'll appear here" />
            : profileViews.map(view => view.viewer && (
              <UserRow key={view.id} user={view.viewer} sub={<span>Viewed {timeAgo(view.createdAt)}</span>} onClick={() => openProfile(view.viewer.id)}
                actions={<Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground px-2" onClick={() => openChat(view.viewer)}>Chat</Button>} />
            ))}
        </div>
      </ScrollArea>
    );
  }

  // ─── SHOUTS VIEW ───────────────────────────────────────────
  function ShoutsView() {
    if (shoutLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>;
    return (
      <div className="h-full flex flex-col">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {/* Compose */}
            <div className="p-3 rounded-xl bg-secondary border border-border space-y-2">
              <Textarea value={shoutInput} onChange={e => setShoutInput(e.target.value)} placeholder="What's on your mind?" className="bg-background border-border text-sm resize-none" rows={2} />
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  <button onClick={() => setShoutType('text')} className={`px-2 py-1 rounded text-[10px] ${shoutType === 'text' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>Text</button>
                  <button onClick={() => setShoutType('image')} className={`px-2 py-1 rounded text-[10px] ${shoutType === 'image' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>Image</button>
                  <button onClick={() => setShoutType('video')} className={`px-2 py-1 rounded text-[10px] ${shoutType === 'video' ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}>Video</button>
                </div>
                <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground px-3" onClick={handleShout} disabled={!shoutInput.trim()}><Megaphone className="w-3 h-3 mr-1" /> Shout</Button>
              </div>
              {/* Canned shouts */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-border">
                {CANNED_SHOUTS.map(cs => (
                  <button key={cs.value} onClick={() => setShoutInput(cs.label)} className="px-2 py-1 rounded-full text-[10px] bg-background border border-border text-muted-foreground hover:border-primary/30 transition-all">
                    {cs.emoji} {cs.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Feed */}
            {shouts.length === 0 ? <EmptyState icon={Megaphone} title="No shouts yet" desc="Be the first to share something!" />
              : shouts.map((shout: any) => (
                <Card key={shout.id} className="bg-secondary border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => shout.user && openProfile(shout.user.id)}><Avatar className="h-8 w-8"><AvatarImage src={getAvatar(shout.user)} /><AvatarFallback className="text-[10px]">{shout.user?.displayName?.[0]}</AvatarFallback></Avatar></button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold">{shout.user?.displayName}</p>
                        <p className="text-[10px] text-muted-foreground">{timeAgo(shout.createdAt)}</p>
                      </div>
                      <Badge className="text-[9px] bg-muted">{shout.type}</Badge>
                    </div>
                    <p className="text-[13px] leading-relaxed">{shout.content}</p>
                    {shout.mediaUrl && <img src={shout.mediaUrl} alt="" className="mt-2 rounded-lg max-h-48 w-full object-cover" />}
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </div>
    );
  }


  // ─── FANSITES VIEW ──────────────────────────────────────────
  function FansitesView() {
    if (fansiteLoading) return <LoadingGrid />;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          {fansites.length === 0 ? <EmptyState icon={Star} title="No fansites" desc="Creator pages will appear here" />
            : fansites.map(fs => (
              <Card key={fs.id} className="bg-secondary border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all" onClick={() => { setSelectedFansite(fs); setShowFansiteSheet(true); }}>
                <div className="flex gap-3 p-3">
                  <Avatar className="h-14 w-14 shrink-0"><AvatarImage src={getAvatar(fs.user)} /><AvatarFallback className="text-sm">{fs.user?.displayName?.[0]}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold truncate">{fs.name}</h3>
                      {fs.status === 'active' && <Badge className="text-[9px] bg-green-400/20 text-green-400">Active</Badge>}
                    </div>
                    {fs.nick && <p className="text-[11px] text-muted-foreground">@{fs.nick}</p>}
                    {fs.description && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{fs.description}</p>}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-2">
                      <span>{fs.links?.length || 0} links</span>
                      <span>{fs.products?.length || 0} products</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
        </div>
      </ScrollArea>
    );
  }

  function FansiteDetail() {
    if (!selectedFansite) return null;
    const fs = selectedFansite;
    return (
      <div className="space-y-4 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14"><AvatarImage src={getAvatar(fs.user)} /><AvatarFallback className="text-sm">{fs.user?.displayName?.[0]}</AvatarFallback></Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold">{fs.name}</h3>
            {fs.geoName && <p className="text-xs text-muted-foreground">{fs.geoName}</p>}
          </div>
          <Badge className={fs.status === 'active' ? 'bg-green-400/20 text-green-400' : 'bg-muted'}>{fs.status}</Badge>
        </div>
        {fs.description && <p className="text-sm text-muted-foreground">{fs.description}</p>}
        {fs.trailerImageUrl && <img src={fs.trailerImageUrl} alt="" className="w-full rounded-xl" />}
        {/* Links */}
        {fs.links && fs.links.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Links</h4>
            {fs.links.map(link => (
              <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-all">
                <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0"><p className="text-[12px] font-medium truncate">{link.label || link.type}</p><p className="text-[10px] text-muted-foreground truncate">{link.url}</p></div>
              </a>
            ))}
          </div>
        )}
        {/* Products */}
        {fs.products && fs.products.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Products</h4>
            {fs.products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
                <div><p className="text-[12px] font-medium">{product.period}</p>{product.until && <p className="text-[10px] text-muted-foreground">Until {product.until}</p>}</div>
                <div className="text-right">
                  {product.priceOld && <p className="text-[10px] text-muted-foreground line-through">${product.priceOld}</p>}
                  <p className="text-sm font-bold text-primary">${product.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── VIDEOS VIEW ───────────────────────────────────────────
  function VideosView() {
    if (videosLoading) return <LoadingGrid />;
    const filtered = videoSearch ? videos.filter((v: any) => v.title.toLowerCase().includes(videoSearch.toLowerCase())) : videos;
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 border-b border-border shrink-0">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input value={videoSearch} onChange={e => setVideoSearch(e.target.value)} placeholder="Search videos..." className="bg-secondary border-border h-9 pl-9 text-xs" /></div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 grid grid-cols-2 gap-3">
            {filtered.length === 0 ? <div className="col-span-2"><EmptyState icon={Video} title="No videos" desc="Videos from the community will appear here" /></div>
              : filtered.map((video: any) => (
                <button key={video.id} className="rounded-xl overflow-hidden bg-secondary border border-border text-left group">
                  <div className="aspect-video relative bg-card">
                    {video.thumbnailUrl ? <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Video className="w-8 h-8 text-muted-foreground" /></div>}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><div className="w-10 h-10 rounded-full bg-primary/80 flex items-center justify-center"><Play className="w-5 h-5 text-primary-foreground fill-current ml-0.5" /></div></div>
                    {video.duration && <Badge className="absolute bottom-1 right-1 text-[9px] bg-black/60">{Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}</Badge>}
                  </div>
                  <div className="p-2"><p className="text-[11px] font-medium truncate">{video.title}</p><p className="text-[10px] text-muted-foreground">{video.user?.displayName}</p></div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  function Play(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/></svg>; }

  // ─── BLOGS VIEW ─────────────────────────────────────────────
  function BlogsView() {
    if (blogsLoading) return <LoadingGrid cols={1} rows={3} />;
    const filtered = blogSearch ? blogs.filter((b: any) => b.title.toLowerCase().includes(blogSearch.toLowerCase())) : blogs;
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 border-b border-border shrink-0">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input value={blogSearch} onChange={e => setBlogSearch(e.target.value)} placeholder="Search blogs..." className="bg-secondary border-border h-9 pl-9 text-xs" /></div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {filtered.length === 0 ? <EmptyState icon={FileText} title="No blogs" desc="Articles and stories will appear here" />
              : filtered.map((blog: any) => (
                <Card key={blog.id} className="bg-secondary border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all" onClick={() => setSelectedBlog(blog)}>
                  {blog.imageUrl && <img src={blog.imageUrl} alt="" className="w-full h-36 object-cover" />}
                  <CardContent className="p-3">
                    <h3 className="text-sm font-semibold">{blog.title}</h3>
                    {blog.content && <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{truncate(blog.content, 120)}</p>}
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-2">
                      <span>{blog.user?.displayName}</span><span>·</span><span>{timeAgo(blog.createdAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  function BlogDetail() {
    if (!selectedBlog) return null;
    return (
      <ScrollArea className="max-h-[70vh]">
        <div className="space-y-4 p-4">
          {selectedBlog.imageUrl && <img src={selectedBlog.imageUrl} alt="" className="w-full rounded-xl" />}
          <h2 className="text-xl font-bold">{selectedBlog.title}</h2>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{selectedBlog.user?.displayName}</span><span>·</span><span>{fmtDate(selectedBlog.createdAt)}</span>
          </div>
          <Separator className="bg-border" />
          <div className="text-sm leading-relaxed whitespace-pre-wrap">{selectedBlog.content}</div>
        </div>
      </ScrollArea>
    );
  }

  // ─── GROUPS VIEW ───────────────────────────────────────────
  function GroupsView() {
    const filtered = groupSearch ? groups.filter((g: any) => g.name.toLowerCase().includes(groupSearch.toLowerCase())) : groups;
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-2 border-b border-border shrink-0 flex items-center gap-2">
          <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" /><Input value={groupSearch} onChange={e => setGroupSearch(e.target.value)} placeholder="Search groups..." className="bg-secondary border-border h-9 pl-9 text-xs" /></div>
          <Button size="sm" className="h-9 text-xs bg-primary text-primary-foreground shrink-0" onClick={() => setShowCreateGroup(true)}><Plus className="w-3.5 h-3.5 mr-1" /> New</Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filtered.length === 0 ? <EmptyState icon={Users} title="No groups" desc="Create or join a group" />
              : filtered.filter((g: any) => !g.hidden).map((group: any) => (
                <Card key={group.id} className="bg-secondary border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11"><AvatarImage src={group.avatar} /><AvatarFallback className="text-xs">{group.name?.[0]}</AvatarFallback></Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[13px] font-semibold truncate">{group.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{group._count?.members || 0} members</p>
                        {group.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">{group.description}</p>}
                        {group.geoName && <Badge className="text-[9px] mt-1 bg-muted">{group.geoName}</Badge>}
                      </div>
                      <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground px-2" onClick={() => { setActiveGroup(group); setGroupMessages([]); setChatMobileView('chat'); setActiveTab('chat'); }}>Open</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // ─── ALBUMS VIEW ────────────────────────────────────────────
  function AlbumsView() {
    if (albumsLoading) return <LoadingGrid />;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {albums.length === 0 ? <EmptyState icon={ImageIcon} title="No albums" desc="Create albums to organize your photos" />
            : albums.map(album => (
              <Card key={album.id} className="bg-secondary border-border overflow-hidden cursor-pointer hover:border-primary/30 transition-all" onClick={() => setSelectedAlbum(album)}>
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-card flex items-center justify-center overflow-hidden">
                      {album.photos && album.photos[0] ? <img src={album.photos[0].url} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold">{album.name}</h3>
                      <p className="text-[11px] text-muted-foreground">{album.photos?.length || 0} photos</p>
                      {album.isPrivate && <Badge className="text-[9px] mt-1 bg-yellow-500/20 text-yellow-400"><Lock className="w-2.5 h-2.5 mr-0.5" /> Private</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    );
  }

  function AlbumDetail() {
    if (!selectedAlbum) return null;
    return (
      <ScrollArea className="max-h-[70vh]">
        <div className="p-4 space-y-3">
          <h3 className="text-lg font-bold">{selectedAlbum.name}</h3>
          <div className="grid grid-cols-3 gap-2">
            {(selectedAlbum.photos || []).map((photo: any) => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-card">
                <img src={photo.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
            {(!selectedAlbum.photos || selectedAlbum.photos.length === 0) && <p className="col-span-3 text-sm text-muted-foreground text-center py-8">No photos in this album</p>}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // ─── MEMBERSHIP VIEW ───────────────────────────────────────
  function MembershipView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold gradient-text">Choose Your Plan</h2>
            <p className="text-xs text-muted-foreground">Unlock premium features and stand out</p>
          </div>
          <div className="grid gap-3">
            {SUBSCRIPTION_TIERS.map(tier => (
              <Card key={tier.tier} className={`bg-secondary border ${tier.popular ? 'border-primary' : 'border-border'} relative overflow-hidden`}>
                {tier.popular && <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-2 py-0.5 rounded-bl-lg">POPULAR</div>}
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tier.color} flex items-center justify-center`}><Crown className="w-5 h-5 text-white" /></div>
                    <div><h3 className="text-base font-bold">{tier.label}</h3><p className="text-xs text-muted-foreground">{tier.price === 0 ? 'Free forever' : `$${tier.price}/month`}</p></div>
                  </div>
                  <ul className="space-y-1.5">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px]"><Check className="w-3 h-3 text-primary shrink-0" /><span className="text-muted-foreground">{f}</span></li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-4 h-9 text-xs ${tier.popular ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`} onClick={() => {}}>
                    {tier.price === 0 ? 'Current Plan' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // ─── VERIFIED VIEW ─────────────────────────────────────────
  function VerifiedView() {
    const verTypes = ['age', 'photo', 'id', 'face', 'social'] as const;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary border border-border">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
              {myVerification?.status === 'verified' ? <ShieldCheck className="w-7 h-7 text-green-400" /> : <Shield className="w-7 h-7 text-muted-foreground" />}
            </div>
            <div>
              <h3 className="text-base font-bold">{myVerification?.status === 'verified' ? 'Verified ✓' : myVerification?.status === 'pending' ? 'Pending Review' : 'Not Verified'}</h3>
              <p className="text-xs text-muted-foreground">{myVerification?.status === 'verified' ? 'Your account is verified' : 'Get verified to increase trust and visibility'}</p>
            </div>
          </div>
          {/* Verification types */}
          <div className="space-y-3">
            <h4 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Verification Methods</h4>
            {verTypes.map(type => (
              <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-card flex items-center justify-center"><Fingerprint className="w-4 h-4 text-primary" /></div>
                  <div><p className="text-[12px] font-medium capitalize">{type} Verification</p><p className="text-[10px] text-muted-foreground">Verify your {type}</p></div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-[10px] border-border" onClick={async () => {
                  if (!currentUser) return;
                  try { await fetch(`/api/verification?userId=${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type }) }); } catch {}
                }}>Submit</Button>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // ─── PROFESSIONAL VIEW ─────────────────────────────────────
  function ProfessionalView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary border border-border">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center"><Briefcase className="w-7 h-7 text-white" /></div>
            <div>
              <h3 className="text-base font-bold">Professional Account</h3>
              <p className="text-xs text-muted-foreground">Monetize your content and grow your audience</p>
            </div>
          </div>
          <Card className="bg-secondary border-border">
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-semibold">Requirements</h4>
              <ul className="space-y-2 text-[12px] text-muted-foreground">
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary" />Verified account</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary" />Active profile for 30+ days</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary" />10+ profile photos</li>
                <li className="flex items-center gap-2"><Check className="w-3 h-3 text-primary" />Clean community record</li>
              </ul>
              <Button className="w-full bg-primary text-primary-foreground text-xs" onClick={() => {}}>Apply for Professional</Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // ─── FOOTPRINTS VIEW ───────────────────────────────────────
  function FootprintsView() {
    if (footprintsLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-1">
          {footprints.length === 0 ? <EmptyState icon={FootprintsIcon} title="No footprints" desc="Profiles you visit will appear here" />
            : footprints.map((fp: any) => fp.target && (
              <UserRow key={fp.id} user={fp.target} sub={<span>Visited {timeAgo(fp.createdAt)}</span>} onClick={() => openProfile(fp.target.id)} />
            ))}
        </div>
      </ScrollArea>
    );
  }


  // ─── NOTES VIEW ────────────────────────────────────────────
  function NotesView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">My Notes ({notes.length})</h3>
            <Button size="sm" className="h-8 text-[11px] bg-primary text-primary-foreground" onClick={() => { setNoteTargetId(''); setNoteContent(''); setShowNoteDialog(true); }}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
          </div>
          {notes.length === 0 ? <EmptyState icon={StickyNote} title="No notes" desc="Add notes to user profiles to remember details" />
            : notes.map((note: any) => (
              <Card key={note.id} className="bg-secondary border-border">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      {note.target && <button onClick={() => openProfile(note.target.id)} className="text-[12px] font-semibold hover:text-primary">{note.target.displayName}</button>}
                      <Badge className="text-[9px] bg-muted">{note.type}</Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={() => handleDeleteNote(note.id)}><X className="w-3 h-3" /></Button>
                    </div>
                  </div>
                  <p className="text-[12px] text-muted-foreground">{note.content}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(note.createdAt)}</p>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    );
  }

  // ─── BOOSTS VIEW ────────────────────────────────────────────
  function BoostsView() {
    if (boostsLoading) return <LoadingGrid cols={1} rows={3} />;
    const activeBoosts = allBoosts.filter((b: any) => b.isActive);
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          {/* Active boosts */}
          <div className="space-y-3">
            <SectionHeader icon={Zap} label="Active Boosts" count={activeBoosts.length} />
            {activeBoosts.length === 0 ? <p className="text-xs text-muted-foreground">No active boosts</p>
              : activeBoosts.map((boost: any) => (
                <div key={boost.id} className="p-3 rounded-xl bg-secondary border border-border boost-glow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-primary" /><span className="text-[12px] font-semibold capitalize">{boost.type} Boost</span></div>
                    <Badge className="bg-green-400/20 text-green-400 text-[9px]">Active</Badge>
                  </div>
                  <Progress value={boost.duration > 0 ? 50 : 100} className="h-1.5" />
                  <p className="text-[10px] text-muted-foreground mt-1">Ends {timeAgo(boost.endsAt)}</p>
                </div>
              ))}
          </div>
          {/* Purchase */}
          <div className="space-y-3">
            <SectionHeader icon={Wallet} label="Purchase Boosts" />
            <div className="grid gap-2">
              {BOOST_TYPES.map(bt => (
                <Card key={bt.type} className="bg-secondary border-border">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bt.color} flex items-center justify-center shrink-0`}><Rocket className="w-5 h-5 text-white" /></div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[12px] font-semibold">{bt.label} Boost</h4>
                        <p className="text-[10px] text-muted-foreground">{bt.desc}</p>
                      </div>
                      <Button size="sm" className="h-8 text-[11px] bg-primary text-primary-foreground shrink-0" onClick={async () => {
                        if (!currentUser) return;
                        try { await fetch(`/api/boosts?userId=${currentUser.id}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type: bt.type, duration: bt.duration }) }); } catch {}
                      }}>${bt.price}</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          {/* History */}
          <div className="space-y-3">
            <SectionHeader icon={Clock} label="Boost History" count={allBoosts.length} />
            {allBoosts.length === 0 ? <p className="text-xs text-muted-foreground">No boost history</p>
              : allBoosts.slice(0, 10).map((boost: any) => (
                <div key={boost.id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-medium capitalize">{boost.type}</span>
                    <Badge className={`text-[9px] ${boost.isActive ? 'bg-green-400/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>{boost.isActive ? 'Active' : 'Expired'}</Badge>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{timeAgo(boost.endsAt)}</span>
                </div>
              ))}
          </div>
        </div>
      </ScrollArea>
    );
  }

  // ─── FAVORITES VIEW ────────────────────────────────────────
  function FavoritesView() {
    if (favoritesLoading) return <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}</div>;
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-1">
          {favorites.length === 0 ? <EmptyState icon={Bookmark} title="No favorites" desc="Add users to favorites from their profiles" />
            : favorites.map((fav: any) => fav.target && (
              <div key={fav.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                <button onClick={() => openProfile(fav.target.id)}>
                  <div className="relative">
                    <Avatar className="h-11 w-11"><AvatarImage src={getAvatar(fav.target)} /><AvatarFallback className="text-xs">{fav.target.displayName?.[0]}</AvatarFallback></Avatar>
                    {fav.isSuper && <Star className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </div>
                </button>
                <div className="flex-1 min-w-0">
                  <button onClick={() => openProfile(fav.target.id)} className="text-[13px] font-semibold hover:text-primary">{fav.target.displayName}</button>
                  <p className="text-[10px] text-muted-foreground">{fav.isSuper ? '⭐ Super Favorite' : 'Favorite'} · {timeAgo(fav.createdAt)}</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[10px] text-destructive" onClick={async () => { try { await fetch(`/api/favorites?userId=${CURRENT_USER_ID}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ targetId: fav.targetId }) }); setFavorites(prev => prev.filter((f: any) => f.id !== fav.id)); } catch {} }}>Remove</Button>
              </div>
            ))}
        </div>
      </ScrollArea>
    );
  }

  // ─── ACCOUNT VIEW ──────────────────────────────────────────
  function AccountView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6 max-w-lg mx-auto">
          <Card className="bg-secondary border-border">
            <CardContent className="p-4 space-y-4">
              <SectionHeader icon={Lock} label="Account Settings" />
              {currentUser && <>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Email</Label><Input value={currentUser.email} disabled className="bg-card border-border h-10 text-xs" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Username</Label><Input value={currentUser.username} disabled className="bg-card border-border h-10 text-xs" /></div>
                <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Display Name</Label><Input value={editForm.displayName || currentUser.displayName} onChange={e => setEditForm(p => ({ ...p, displayName: e.target.value }))} className="bg-card border-border h-10 text-xs" /></div>
                <Button className="bg-primary text-primary-foreground text-xs" onClick={handleSaveProfile}>Save Changes</Button>
              </>}
            </CardContent>
          </Card>
          <Card className="bg-secondary border-border">
            <CardContent className="p-4 space-y-3">
              <SectionHeader icon={Shield} label="Password" />
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Current Password</Label><Input type="password" placeholder="••••••••" className="bg-card border-border h-10 text-xs" /></div>
              <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">New Password</Label><Input type="password" placeholder="••••••••" className="bg-card border-border h-10 text-xs" /></div>
              <Button variant="outline" className="border-border text-xs">Update Password</Button>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border border-destructive/20">
            <CardContent className="p-4 space-y-3">
              <SectionHeader icon={AlertTriangle} label="Danger Zone" />
              <p className="text-xs text-muted-foreground">Once you delete your account, there is no going back.</p>
              <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 text-xs" onClick={() => setShowDeleteAccount(true)}>Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // ─── PREFERENCES VIEW ──────────────────────────────────────
  function PreferencesView() {
    const togglePref = (key: string) => setPrefs(p => ({ ...p, [key]: !(p as any)[key] }));
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6 max-w-lg mx-auto">
          {/* Geo & Display */}
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={MapPin} label="Location & Display" />
            {[
              { key: 'showOnline', label: 'Show Online Status', desc: 'Let others see when you are online' },
              { key: 'showDistance', label: 'Show Distance', desc: 'Display distance to other users' },
              { key: 'showAge', label: 'Show Age', desc: 'Display your age on profile' },
              { key: 'showActivity', label: 'Show Activity', desc: 'Show your recent activity' },
              { key: 'hidePicsOffline', label: 'Hide Pics Offline', desc: 'Hide photos when offline' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="text-sm">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                <Switch checked={(prefs as any)[item.key]} onCheckedChange={() => togglePref(item.key)} />
              </div>
            ))}
          </CardContent></Card>
          {/* Discover Settings */}
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Search} label="Discover Preferences" />
            <div className="flex items-center justify-between"><div><p className="text-sm">Age Range</p><p className="text-[10px] text-muted-foreground">{prefs.ageMin}–{prefs.ageMax}</p></div>
              <Slider value={[prefs.ageMin, prefs.ageMax]} onValueChange={([min, max]) => setPrefs(p => ({ ...p, ageMin: min, ageMax: max }))} min={18} max={80} step={1} className="w-32" /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm">Units</p></div>
              <Select value={prefs.displayUnits} onValueChange={v => setPrefs(p => ({ ...p, displayUnits: v }))}><SelectTrigger className="h-8 w-24 text-[11px] bg-card border-border"><SelectValue /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="metric">Metric</SelectItem><SelectItem value="imperial">Imperial</SelectItem></SelectContent></Select>
            </div>
            <div className="flex items-center justify-between"><div><p className="text-sm">Language</p></div>
              <Select value={prefs.lang} onValueChange={v => setPrefs(p => ({ ...p, lang: v }))}><SelectTrigger className="h-8 w-24 text-[11px] bg-card border-border"><SelectValue /></SelectTrigger><SelectContent className="bg-card border-border"><SelectItem value="en">English</SelectItem><SelectItem value="es">Spanish</SelectItem><SelectItem value="fr">French</SelectItem><SelectItem value="de">German</SelectItem><SelectItem value="it">Italian</SelectItem></SelectContent></Select>
            </div>
          </CardContent></Card>
          {/* Sound & Notifications */}
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Bell} label="Notifications" />
            {[
              { key: 'soundOff', label: 'Sound Off', desc: 'Mute all app sounds' },
              { key: 'notifPushOff', label: 'Push Notifications', desc: 'Disable push notifications' },
              { key: 'notifEmailOff', label: 'Email Notifications', desc: 'Disable email notifications' },
              { key: 'notifTelegramOff', label: 'Telegram Notifications', desc: 'Disable Telegram alerts' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="text-sm">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                <Switch checked={(prefs as any)[item.key]} onCheckedChange={() => togglePref(item.key)} />
              </div>
            ))}
          </CardContent></Card>
          {/* Privacy */}
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Shield} label="Privacy" />
            {[
              { key: 'mailingInternal', label: 'Internal Mailing', desc: 'Receive internal communications' },
              { key: 'mailingPartner', label: 'Partner Mailing', desc: 'Receive partner promotions' },
              { key: 'profileOff', label: 'Profile Off', desc: 'Hide your profile temporarily' },
              { key: 'privateAuto', label: 'Private Auto-Reply', desc: 'Auto-reply when private' },
              { key: 'noPros', label: 'No Professionals', desc: 'Hide professional accounts' },
              { key: 'noPub', label: 'No Public Content', desc: 'Hide public content' },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between">
                <div><p className="text-sm">{item.label}</p><p className="text-[10px] text-muted-foreground">{item.desc}</p></div>
                <Switch checked={(prefs as any)[item.key]} onCheckedChange={() => togglePref(item.key)} />
              </div>
            ))}
          </CardContent></Card>
        </div>
      </ScrollArea>
    );
  }

  // ─── GEO SETTINGS VIEW ─────────────────────────────────────
  function GeoSettingsView() {
    const modes = [
      { value: 'auto', label: 'Auto GPS', icon: Crosshair, desc: 'Use device GPS for precise location' },
      { value: 'manual', label: 'Manual City', icon: MapPin, desc: 'Set a fixed city location' },
      { value: 'fake', label: 'Fake Location', icon: MapPinOff, desc: 'Use a custom fake location' },
      { value: 'hide', label: 'Hide Location', icon: EyeOff, desc: 'Hide your location completely' },
    ];
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6 max-w-lg mx-auto">
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Navigation} label="Location Mode" />
            {modes.map(mode => {
              const Icon = mode.icon;
              return (
                <button key={mode.value} onClick={() => { setGeoMode(mode.value); setPrefs(p => ({ ...p, geoMode: mode.value })); }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${geoMode === mode.value ? 'bg-primary/10 border-primary/30' : 'bg-card border-border hover:border-primary/20'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${geoMode === mode.value ? 'bg-primary/20' : 'bg-secondary'}`}><Icon className="w-4 h-4 text-primary" /></div>
                  <div className="text-left"><p className="text-[12px] font-semibold">{mode.label}</p><p className="text-[10px] text-muted-foreground">{mode.desc}</p></div>
                  {geoMode === mode.value && <Check className="w-4 h-4 text-primary ml-auto" />}
                </button>
              );
            })}
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={MapPin} label="Geo Name" />
            <p className="text-[10px] text-muted-foreground">This name displays instead of your real location</p>
            <Input value={geoName} onChange={e => setGeoName(e.target.value)} placeholder="e.g. 'Somewhere fun'" className="bg-card border-border h-10 text-xs" />
          </CardContent></Card>
          {(geoMode === 'fake') && (
            <Card className="bg-yellow-500/10 border border-yellow-500/20"><CardContent className="p-3 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />
              <p className="text-xs text-yellow-400">Fake location mode is active. Other users may see this as suspicious.</p>
            </CardContent></Card>
          )}
          {/* Map preview */}
          <Card className="bg-secondary border-border">
            <CardContent className="p-3">
              <div className="aspect-video rounded-xl bg-card relative overflow-hidden">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, oklch(0.22 0.01 285) 0%, oklch(0.15 0.005 285) 100%)' }}>
                  <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="grid2" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#grid2)" /></svg>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"><div className="w-5 h-5 bg-primary rounded-full border-3 border-card shadow-lg"><div className="w-full h-full bg-primary rounded-full animate-ping opacity-30" /></div></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    );
  }

  // ─── BANNERS VIEW ──────────────────────────────────────────
  function BannersView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Active Banners ({banners.length})</h3>
            <Button size="sm" className="h-8 text-[11px] bg-primary text-primary-foreground" onClick={handleCreateBanner}><Plus className="w-3.5 h-3.5 mr-1" /> Create</Button>
          </div>
          {banners.length === 0 ? <EmptyState icon={Layers} title="No banners" desc="Create promotional banners" />
            : banners.map((banner: any) => (
              <Card key={banner.id} className="bg-secondary border-border overflow-hidden">
                {banner.imageUrl && <img src={banner.imageUrl} alt="" className="w-full h-32 object-cover" />}
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div><p className="text-[12px] font-semibold">{banner.title}</p><p className="text-[10px] text-muted-foreground">Position: {banner.position} · {banner.isActive ? '✓ Active' : 'Inactive'}</p></div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </ScrollArea>
    );
  }

  // ─── SITES VIEW ─────────────────────────────────────────────
  function SitesView() {
    const mockSites = [
      { name: 'My Twitter', url: 'https://twitter.com/myhandle', icon: '𝕏' },
      { name: 'My Instagram', url: 'https://instagram.com/myhandle', icon: '📸' },
      { name: 'OnlyFans', url: 'https://onlyfans.com/myhandle', icon: '🔥' },
      { name: 'Personal Website', url: 'https://mywebsite.com', icon: '🌐' },
    ];
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <h3 className="text-sm font-semibold">Connected Sites</h3>
          {mockSites.map(site => (
            <a key={site.url} href={site.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border hover:border-primary/30 transition-all">
              <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center text-lg">{site.icon}</div>
              <div className="flex-1 min-w-0"><p className="text-[12px] font-semibold">{site.name}</p><p className="text-[10px] text-muted-foreground truncate">{site.url}</p></div>
              <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0" />
            </a>
          ))}
          <p className="text-[10px] text-muted-foreground text-center">Manage your connected sites and fansite links</p>
        </div>
      </ScrollArea>
    );
  }

  // ─── LEGAL VIEW ─────────────────────────────────────────────
  function LegalView() {
    const [legalTab, setLegalTab] = useState('terms');
    const legalContent: Record<string, string> = {
      terms: `Terms of Service\n\nLast updated: January 2025\n\n1. Acceptance of Terms\nBy accessing and using NEXUS, you accept and agree to be bound by these Terms of Service.\n\n2. User Accounts\nYou must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account.\n\n3. User Conduct\nYou agree to use NEXUS in a respectful manner. Harassment, spam, and inappropriate content are prohibited.\n\n4. Content\nAll content you post on NEXUS remains your property. By posting, you grant NEXUS a license to display your content.\n\n5. Premium Services\nPremium subscriptions are billed monthly. You can cancel at any time. No refunds are provided for partial months.\n\n6. Termination\nNEXUS reserves the right to suspend or terminate accounts that violate these terms.`,
      privacy: `Privacy Policy\n\nLast updated: January 2025\n\n1. Data Collection\nWe collect information you provide directly: name, email, age, location, photos, and preferences.\n\n2. Data Usage\nYour data is used to provide and improve our services, match you with other users, and personalize your experience.\n\n3. Location Data\nYour location is used for matching and distance calculation. You can control location sharing in settings.\n\n4. Third Parties\nWe do not sell your personal data. We may share anonymized analytics with partners.\n\n5. Data Security\nWe use industry-standard encryption to protect your data.\n\n6. Your Rights\nYou can request access to, correction of, or deletion of your personal data at any time.`,
      cookies: `Cookie Policy\n\nLast updated: January 2025\n\n1. What Are Cookies\nCookies are small files stored on your device that help us provide a better experience.\n\n2. Types We Use\n• Essential cookies: Required for basic functionality\n• Analytics cookies: Help us understand usage patterns\n• Preference cookies: Remember your settings\n\n3. Management\nYou can manage cookie preferences in your browser settings.`,
    };
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          <Tabs value={legalTab} onValueChange={setLegalTab}>
            <TabsList className="bg-secondary border border-border w-full h-9 p-0.5">
              <TabsTrigger value="terms" className="text-[11px] flex-1 h-7">Terms</TabsTrigger>
              <TabsTrigger value="privacy" className="text-[11px] flex-1 h-7">Privacy</TabsTrigger>
              <TabsTrigger value="cookies" className="text-[11px] flex-1 h-7">Cookies</TabsTrigger>
            </TabsList>
            <TabsContent value={legalTab} className="mt-3">
              <Card className="bg-secondary border-border"><CardContent className="p-4"><pre className="text-xs text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">{legalContent[legalTab]}</pre></CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    );
  }

  // ─── FAQS VIEW ─────────────────────────────────────────────
  function FaqsView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-3">
          <h3 className="text-sm font-semibold mb-2">Frequently Asked Questions</h3>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQ_DATA.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-secondary border border-border rounded-xl overflow-hidden">
                <AccordionTrigger className="px-4 py-3 text-[12px] font-medium hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-3 text-[11px] text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </ScrollArea>
    );
  }

  // ─── ABUSE VIEW ────────────────────────────────────────────
  function AbuseView() {
    const reportCategories = ['harassment', 'spam', 'inappropriate content', 'fake profile', 'scam', 'underage user', 'violence', 'other'];
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6 max-w-lg mx-auto">
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Flag} label="Report Abuse" />
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">User ID or Username</Label>
              <Input value={abuseForm.userId} onChange={e => setAbuseForm(p => ({ ...p, userId: e.target.value }))} placeholder="Enter user ID" className="bg-card border-border h-10 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Category</Label>
              <Select value={abuseForm.category} onValueChange={v => setAbuseForm(p => ({ ...p, category: v }))}>
                <SelectTrigger className="h-10 text-xs bg-card border-border"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-card border-border">{reportCategories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Description</Label>
              <Textarea value={abuseForm.description} onChange={e => setAbuseForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the issue..." className="bg-card border-border text-xs" rows={4} />
            </div>
            <Button className="w-full bg-destructive text-white text-xs" disabled={!abuseForm.userId || !abuseForm.description}>Submit Report</Button>
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Block} label="Blocked Users" count={blockedUsers.length} />
            {blockedUsers.length === 0 ? <p className="text-xs text-muted-foreground">No blocked users</p>
              : blockedUsers.map((b: any) => (
                <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <Avatar className="h-8 w-8"><AvatarImage src={getAvatar(b.blocked)} /><AvatarFallback className="text-[10px]">{(b.blocked as any)?.displayName?.[0]}</AvatarFallback></Avatar>
                  <span className="text-xs flex-1">{(b.blocked as any)?.displayName || 'User'}</span>
                  <Button size="sm" variant="ghost" className="text-[10px] text-muted-foreground" onClick={async () => { try { await fetch(`/api/blocks?blockedId=${(b.blocked as any)?.id}`, { method: 'DELETE' }); setBlockedUsers(prev => prev.filter((x: any) => x.id !== b.id)); } catch {} }}>Unblock</Button>
                </div>
              ))}
          </CardContent></Card>
        </div>
      </ScrollArea>
    );
  }

  // ─── ADVANTAGES VIEW ───────────────────────────────────────
  function AdvantagesView() {
    const features = [
      { name: 'Unlimited Likes', free: '5/day', premium: 'Unlimited' },
      { name: 'See Who Viewed You', free: false, premium: true },
      { name: 'Advanced Filters', free: false, premium: true },
      { name: 'INFER AI Analysis', free: false, premium: 'Basic' },
      { name: 'Boost Discounts', free: false, premium: '20% off' },
      { name: 'Anonymous Browsing', free: false, premium: true },
      { name: 'Priority Support', free: false, premium: true },
      { name: 'Video Calls', free: false, premium: true },
      { name: 'Travel Mode', free: false, premium: true },
      { name: 'Profile Themes', free: false, premium: true },
      { name: 'Read Receipts', free: false, premium: true },
      { name: 'Extended Match Radius', free: '50km', premium: '200km' },
    ];
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold gradient-text">Why Go Premium?</h2>
            <p className="text-xs text-muted-foreground">Unlock the full potential of NEXUS</p>
          </div>
          <Card className="bg-secondary border-border">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_auto_auto] gap-2 text-[11px]">
                  <span className="font-semibold">Feature</span><span className="text-center">Free</span><span className="text-center text-primary">Premium</span>
                </div>
                {features.map(f => (
                  <div key={f.name} className="grid grid-cols-[1fr_auto_auto] gap-2 text-[11px] py-1.5 border-t border-border">
                    <span className="text-muted-foreground">{f.name}</span>
                    <span className="text-center">{typeof f.free === 'boolean' ? (f.free ? '✓' : '✗') : f.free}</span>
                    <span className="text-center font-medium text-primary">{typeof f.premium === 'boolean' ? (f.premium ? '✓' : '—') : f.premium}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm" onClick={() => setActiveTab('membership')}><Crown className="w-4 h-4 mr-2" /> Upgrade to Premium</Button>
        </div>
      </ScrollArea>
    );
  }

  // ─── AFFILIATION VIEW ──────────────────────────────────────
  function AffiliationView() {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-bold gradient-text">Affiliate Program</h2>
            <p className="text-xs text-muted-foreground">Earn rewards by referring friends to NEXUS</p>
          </div>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Share2} label="Your Referral Link" />
            <div className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border">
              <code className="flex-1 text-[11px] text-primary truncate">nexus.app/ref/test-user-1</code>
              <Button size="sm" variant="outline" className="h-7 text-[10px] border-border shrink-0" onClick={() => navigator.clipboard.writeText('nexus.app/ref/test-user-1')}><Copy className="w-3 h-3 mr-1" /> Copy</Button>
            </div>
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={TrendingUp} label="Your Stats" />
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 rounded-xl bg-card"><p className="text-lg font-bold text-primary">12</p><p className="text-[10px] text-muted-foreground">Referrals</p></div>
              <div className="text-center p-3 rounded-xl bg-card"><p className="text-lg font-bold text-primary">5</p><p className="text-[10px] text-muted-foreground">Converted</p></div>
              <div className="text-center p-3 rounded-xl bg-card"><p className="text-lg font-bold text-primary">$49</p><p className="text-[10px] text-muted-foreground">Earned</p></div>
            </div>
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Gift} label="Commission Structure" />
            <ul className="space-y-2 text-[12px] text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-primary font-bold">20%</span> commission on Premium subscriptions</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">$5</span> bonus for each verified referral</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">10%</span> commission on boost purchases</li>
              <li className="flex items-center gap-2"><span className="text-primary font-bold">$10</span> bonus after 10 referrals</li>
            </ul>
          </CardContent></Card>
        </div>
      </ScrollArea>
    );
  }


  // ─── PROFILE VIEW ───────────────────────────────────────────
  function ProfileView() {
    if (!currentUser) return <EmptyState icon={User} title="Loading profile..." desc="" />;
    const u = currentUser;
    return (
      <ScrollArea className="h-full">
        <div className="space-y-0">
          {/* Cover + Avatar */}
          <div className="relative">
            <div className="h-32 bg-gradient-to-br from-primary/30 to-purple-500/20" />
            <div className="absolute -bottom-10 left-4">
              <Avatar className="h-20 w-20 border-4 border-card shadow-lg">
                <AvatarImage src={getAvatar(u)} /><AvatarFallback className="text-xl">{u.displayName?.[0]}</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute bottom-3 right-4 flex gap-2">
              {u.isVerified && <Badge className="bg-blue-500/20 text-blue-400 text-[10px] border-blue-500/30"><ShieldCheck className="w-3 h-3" /> Verified</Badge>}
              {u.isPremium && <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] border-yellow-500/30"><Crown className="w-3 h-3" /> Premium</Badge>}
            </div>
          </div>
          <div className="px-4 pt-14 pb-4 space-y-4">
            {/* Name + Online */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold">{u.displayName}{u.age ? `, ${u.age}` : ''}</h2>
                <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-1">
                  <span>@{u.username}</span>
                  {u.pronouns && <span>{u.pronouns}</span>}
                  {u.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{u.location}</span>}
                </div>
                {u.online && u.showOnline && <span className="flex items-center gap-1.5 text-[11px] text-green-400 mt-1"><span className="w-2 h-2 bg-green-400 rounded-full online-pulse" /> Online now</span>}
              </div>
              <Button size="sm" variant="outline" className="h-8 text-[11px] border-border" onClick={() => setEditingProfile(true)}><Pencil className="w-3 h-3 mr-1" /> Edit</Button>
            </div>
            {/* Bio */}
            {u.bio && <Card className="bg-secondary border-border"><CardContent className="p-3"><p className="text-sm leading-relaxed">{u.bio}</p></CardContent></Card>}
            {/* About */}
            {u.aboutMe && (
              <Card className="bg-secondary border-border"><CardContent className="p-3">
                <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">About Me</h4>
                <p className="text-[13px] leading-relaxed">{u.aboutMe}</p>
              </CardContent></Card>
            )}
            {/* Quick stats */}
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
              {[
                { label: 'Photos', val: u._count?.photos || 0 },
                { label: 'Likes', val: u._count?.receivedLikes || 0 },
                { label: 'Views', val: u._count?.receivedViews || 0 },
                { label: 'Shouts', val: u._count?.shouts || 0 },
                { label: 'Messages', val: u._count?.sentMessages || 0 },
              ].map(s => (
                <div key={s.label} className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[68px]">
                  <p className="text-sm font-bold gradient-text">{s.val}</p>
                  <p className="text-[9px] text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Details */}
            <Card className="bg-secondary border-border"><CardContent className="p-3">
              <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold mb-2">Details</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {u.lookingFor && <DetailCell label="Looking for" value={u.lookingFor} />}
                {u.height && <DetailCell label="Height" value={`${u.height} cm`} />}
                {u.bodyType && <DetailCell label="Body type" value={u.bodyType} />}
                {u.ethnicity && <DetailCell label="Ethnicity" value={u.ethnicity} />}
                {u.relationshipStatus && <DetailCell label="Relationship" value={u.relationshipStatus} />}
                {u.position && <DetailCell label="Position" value={u.position} />}
              </div>
            </CardContent></Card>
            {/* Subscriptions */}
            {mySubscriptions.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={Crown} label="Subscriptions" count={mySubscriptions.length} />
                {mySubscriptions.map((sub: any) => (
                  <div key={sub.id} className="p-2.5 rounded-xl bg-secondary border border-border flex items-center justify-between">
                    <span className="text-[12px] font-medium capitalize">{sub.tier} Plan</span>
                    <Badge className={`text-[9px] ${sub.isActive ? 'bg-green-400/20 text-green-400' : 'bg-muted text-muted-foreground'}`}>{sub.isActive ? 'Active' : 'Expired'}</Badge>
                  </div>
                ))}
              </div>
            )}
            {/* Active boosts */}
            {myBoosts.length > 0 && (
              <div className="space-y-2">
                <SectionHeader icon={Zap} label="Active Boosts" count={myBoosts.length} />
                {myBoosts.map((b: any) => (
                  <div key={b.id} className="p-2.5 rounded-xl bg-secondary border border-border boost-glow flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" /><span className="text-[12px] font-medium capitalize">{b.type} Boost</span>
                  </div>
                ))}
              </div>
            )}
            {/* Favorites */}
            <div className="space-y-2">
              <SectionHeader icon={Bookmark} label="Favorites" count={favorites.length} action={<Button variant="ghost" size="sm" className="text-[10px] text-primary h-6" onClick={() => setActiveTab('favorites')}>View all</Button>} />
              {favorites.length > 0 ? favorites.slice(0, 5).map((fav: any) => (
                <button key={fav.id} onClick={() => openProfile(fav.targetId)} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Avatar className="h-8 w-8"><AvatarImage src={getAvatar(fav.target)} /><AvatarFallback className="text-[10px]">{fav.target?.displayName?.[0]}</AvatarFallback></Avatar>
                  <span className="text-[12px]">{fav.target?.displayName}</span>
                  {fav.isSuper && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                </button>
              )) : <p className="text-xs text-muted-foreground">No favorites yet</p>}
            </div>
            {/* Notes */}
            <div className="space-y-2">
              <SectionHeader icon={StickyNote} label="Notes" count={notes.length} action={<Button variant="ghost" size="sm" className="text-[10px] text-primary h-6" onClick={() => setActiveTab('notes')}>View all</Button>} />
              {notes.length > 0 ? notes.slice(0, 5).map((note: any) => (
                <div key={note.id} className="p-2.5 rounded-xl bg-secondary border border-border">
                  <div className="flex items-center gap-2 mb-1"><button onClick={() => openProfile(note.targetId)} className="text-[12px] font-semibold hover:underline">{note.target?.displayName}</button><Badge variant="secondary" className="text-[9px] bg-muted">{note.type}</Badge></div>
                  <p className="text-[12px] text-muted-foreground line-clamp-2">{note.content}</p>
                </div>
              )) : <p className="text-xs text-muted-foreground">No notes yet</p>}
            </div>
            {/* Verification */}
            <div className="space-y-2">
              <SectionHeader icon={ShieldCheck} label="Verification" />
              <div className="p-3 rounded-xl bg-secondary border border-border">
                <div className="flex items-center gap-2">
                  {myVerification?.status === 'verified' ? <ShieldCheck className="w-5 h-5 text-green-400" /> : myVerification?.status === 'pending' ? <Clock className="w-5 h-5 text-yellow-400" /> : <Shield className="w-5 h-5 text-muted-foreground" />}
                  <span className={`text-sm font-medium ${myVerification?.status === 'verified' ? 'text-green-400' : 'text-muted-foreground'}`}>{myVerification?.status === 'verified' ? 'Verified' : myVerification?.status === 'pending' ? 'Pending Review' : 'Not Verified'}</span>
                </div>
              </div>
            </div>
            {/* Sessions */}
            <div className="space-y-2">
              <SectionHeader icon={MonitorSmartphone} label="Sessions" count={mySessions.length} />
              {mySessions.length > 0 ? mySessions.slice(0, 5).map((sess: any) => (
                <div key={sess.id} className="flex items-center justify-between p-2.5 rounded-xl bg-secondary border border-border">
                  <div className="flex items-center gap-2">
                    <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
                    <div><p className="text-[12px] font-medium">{sess.platform || 'Unknown'}{sess.device ? ` · ${sess.device}` : ''}</p><p className="text-[10px] text-muted-foreground">{timeAgo(sess.lastSeen)}</p></div>
                  </div>
                  {sess.isActive && <Badge className="bg-green-400/20 text-green-400 text-[9px]">Active</Badge>}
                </div>
              )) : <p className="text-xs text-muted-foreground">No sessions</p>}
            </div>
            {/* Quick links */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-border text-xs" onClick={() => setShowSettings(true)}><Settings className="w-3.5 h-3.5 mr-1.5" /> Settings</Button>
              <Button variant="outline" className="border-border text-xs" onClick={() => setActiveTab('preferences')}><Sliders className="w-3.5 h-3.5 mr-1.5" /> Preferences</Button>
            </div>
            <div className="h-4" />
          </div>
        </div>
      </ScrollArea>
    );
  }

  function DetailCell({ label, value }: { label: string; value: string }) {
    return (<div className="flex justify-between p-2 rounded-lg bg-card/50"><span className="text-muted-foreground text-[11px]">{label}</span><span className="text-[12px] font-medium capitalize">{value}</span></div>);
  }

  function Sliders(props: any) { return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 12H3"/><path d="M15 6H3"/><path d="M21 18H3"/><circle cx="15" cy="6" r="2"/><circle cx="21" cy="12" r="2"/><circle cx="15" cy="18" r="2"/></svg>; }

  // ─── INFER VIEW (AI Analysis) ──────────────────────────────
  function InferView() {
    const allUsers = [...discoverUsers, ...receivedLikes.map(l => l.sender).filter(Boolean), ...favorites.map(f => f.target).filter(Boolean)];
    const uniqueUsers = [...new Map(allUsers.filter(Boolean).map(u => [u.id, u])).values()] as User[];

    return (
      <div className="h-full flex flex-col">
        {/* User Selector */}
        <div className="px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-xs font-semibold">Select a user to analyze</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            {uniqueUsers.slice(0, 15).map(u => (
              <button key={u.id} onClick={() => { setInferTargetUser(u); setInferResultsMap({}); }}
                className={`shrink-0 flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${inferTargetUser?.id === u.id ? 'bg-primary/10 border-primary/30' : 'bg-secondary border-border hover:border-primary/20'}`}>
                <Avatar className="h-8 w-8"><AvatarImage src={getAvatar(u)} /><AvatarFallback className="text-[9px]">{u.displayName?.[0]}</AvatarFallback></Avatar>
                <span className="text-[9px] max-w-[48px] truncate">{u.displayName?.split(' ')[0]}</span>
              </button>
            ))}
            {uniqueUsers.length === 0 && <p className="text-[11px] text-muted-foreground py-2">Discover or like some users first to analyze them</p>}
          </div>
        </div>
        {inferTargetUser && (
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Target user info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary border border-border">
                <Avatar className="h-10 w-10"><AvatarImage src={getAvatar(inferTargetUser)} /><AvatarFallback className="text-xs">{inferTargetUser.displayName?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold">{inferTargetUser.displayName}{inferTargetUser.age ? `, ${inferTargetUser.age}` : ''}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{inferTargetUser.bio || 'No bio'}</p>
                </div>
              </div>
              {/* Category tabs */}
              <Tabs value={inferCategory} onValueChange={(v) => setInferCategory(v as InferCategory)}>
                <TabsList className="bg-secondary border border-border w-full h-auto p-1 flex-wrap">
                  {INFER_CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return <TabsTrigger key={cat.id} value={cat.id} className={`text-[10px] flex-1 min-w-[80px] h-8 flex items-center gap-1 ${inferCategory === cat.id ? cat.color : ''}`}><Icon className="w-3 h-3" />{cat.label}</TabsTrigger>;
                  })}
                </TabsList>
              </Tabs>
              {/* Analyze buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-primary text-primary-foreground text-xs h-9" disabled={inferLoading} onClick={() => handleInfer(inferCategory)}>
                  {inferLoading ? 'Analyzing...' : `Analyze ${INFER_CATEGORIES.find(c => c.id === inferCategory)?.label}`}
                </Button>
                <Button variant="outline" className="h-9 text-xs border-border" disabled={inferLoading} onClick={() => handleInfer()}>
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Full Analysis
                </Button>
              </div>
              {/* Results */}
              {Object.keys(inferResultsMap).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(inferResultsMap).map(([catId, result]: [string, any]) => {
                    const cat = INFER_CATEGORIES.find(c => c.id === catId);
                    if (!cat) return null;
                    return (
                      <Card key={catId} className={`bg-secondary border ${result.color === 'red' ? 'border-red-500/30' : result.color === 'green' ? 'border-green-500/30' : 'border-border'}`}>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${result.color === 'red' ? 'bg-red-500/20' : result.color === 'green' ? 'bg-green-500/20' : 'bg-primary/20'}`}>
                                <cat.icon className={`w-4 h-4 ${result.color === 'red' ? 'text-red-400' : result.color === 'green' ? 'text-green-400' : 'text-primary'}`} />
                              </div>
                              <div><p className="text-[12px] font-semibold">{cat.label}</p><p className="text-[10px] text-muted-foreground">{cat.desc}</p></div>
                            </div>
                            <div className="text-right">
                              <p className={`text-sm font-bold ${result.color === 'red' ? 'text-red-400' : result.color === 'green' ? 'text-green-400' : 'text-primary'}`}>{result.confidence}%</p>
                              <p className="text-[9px] text-muted-foreground">confidence</p>
                            </div>
                          </div>
                          <Progress value={result.confidence} className={`h-1.5 ${result.color === 'red' ? '[&>div]:bg-red-400' : result.color === 'green' ? '[&>div]:bg-green-400' : ''}`} />
                          <div>
                            <p className="text-[13px] font-medium">{result.title}</p>
                            <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{result.content}</p>
                          </div>
                          {result.bulletPoints?.length > 0 && (
                            <ul className="space-y-1.5">
                              {result.bulletPoints.map((bp: string, i: number) => (
                                <li key={i} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                                  <span className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${result.color === 'red' ? 'bg-red-400' : result.color === 'green' ? 'bg-green-400' : 'bg-primary'}`} />
                                  {bp}
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
              {Object.keys(inferResultsMap).length === 0 && !inferLoading && (
                <EmptyState icon={Brain} title="Select a category to analyze" desc="Choose an analysis category above or run a full analysis" />
              )}
            </div>
          </ScrollArea>
        )}
        {!inferTargetUser && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={Target} title="Select a user to analyze" desc="Pick someone from the selector above to run AI analysis" />
          </div>
        )}
      </div>
    );
  }

  // ─── PROFILE DRAWER CONTENT ────────────────────────────────
  function ProfileDrawerContent() {
    if (!profileUser) return null;
    const u = profileUser;
    const currentPhoto = profilePhotos[profileGalleryIndex];
    return (
      <div className="space-y-0">
        <div className="relative bg-secondary">
          <div className="aspect-square max-h-[55vh] relative">
            {currentPhoto ? <img src={currentPhoto.url} alt={u.displayName} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><User className="w-20 h-20 text-muted-foreground" /></div>}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>
          {profilePhotos.length > 1 && (
            <>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
                {profilePhotos.map((_, i) => (<button key={i} onClick={() => setProfileGalleryIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === profileGalleryIndex ? 'bg-primary w-4' : 'bg-white/40'}`} />))}
              </div>
              <button onClick={() => setProfileGalleryIndex(i => (i - 1 + profilePhotos.length) % profilePhotos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setProfileGalleryIndex(i => (i + 1) % profilePhotos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          <button onClick={closeProfile} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="px-4 -mt-8 relative z-10 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{u.displayName}{u.showAge !== false && u.age ? `, ${u.age}` : ''}</h2>
                {u.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
                {u.isPremium && <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] border-yellow-500/30"><Crown className="w-3 h-3 mr-0.5" /> Premium</Badge>}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-1">
                <span>@{u.username}</span>{u.pronouns && <span>{u.pronouns}</span>}
              </div>
            </div>
            <div className={`flex items-center gap-1.5 text-[11px] ${u.online ? 'text-green-400' : 'text-muted-foreground'}`}>
              {u.online && u.showOnline && <span className="w-2 h-2 bg-green-400 rounded-full online-pulse" />}
              {getLastSeenText(u)}
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { val: u._count?.photos || 0, label: 'Photos' },
              { val: u._count?.receivedViews || 0, label: 'Views' },
              { val: u._count?.receivedLikes || 0, label: 'Likes' },
            ].map(s => (
              <div key={s.label} className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[68px]">
                <p className="text-sm font-bold gradient-text">{s.val}</p>
                <p className="text-[9px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
          {u.lookingFor && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Heart className="w-4 h-4 text-primary" /><span className="text-sm">Looking for: <span className="capitalize text-primary font-medium">{u.lookingFor}</span></span>
            </div>
          )}
          <div className="space-y-1.5">
            <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {u.height && <DetailCell label="Height" value={`${u.height} cm`} />}
              {u.bodyType && <DetailCell label="Body type" value={u.bodyType} />}
              {u.ethnicity && <DetailCell label="Ethnicity" value={u.ethnicity} />}
              {u.position && <DetailCell label="Position" value={u.position} />}
              {u.relationshipStatus && <DetailCell label="Relationship" value={u.relationshipStatus} />}
              {u.location && <DetailCell label="Location" value={u.location} />}
              <DetailCell label="Gender" value={u.gender} />
            </div>
          </div>
          {u.aboutMe && (<div className="space-y-1"><h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">About Me</h4><p className="text-sm leading-relaxed">{u.aboutMe}</p></div>)}
          {profilePhotos.length > 1 && (
            <div className="space-y-2"><h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Photos</h4>
              <div className="grid grid-cols-4 gap-1.5">{profilePhotos.map((p, i) => (<button key={p.id} onClick={() => setProfileGalleryIndex(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === profileGalleryIndex ? 'border-primary' : 'border-transparent'}`}><img src={p.url} alt="" className="w-full h-full object-cover" /></button>))}</div>
            </div>
          )}
          <div className="flex gap-2 pt-2 pb-6">
            <Button className="flex-1 bg-primary text-primary-foreground" onClick={() => { openChat(u); closeProfile(); }}><MessageCircle className="w-4 h-4 mr-2" /> Message</Button>
            <Tooltip><TooltipTrigger asChild><Button variant="outline" className="border-border" onClick={() => handleFavorite(u.id)}><Bookmark className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Favorite</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="outline" className="border-border" onClick={() => { setNoteTargetId(u.id); setShowNoteDialog(true); }}><StickyNote className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Note</TooltipContent></Tooltip>
            <Button variant="outline" className="border-border" onClick={() => handleLike(u.id)}><Heart className="w-4 h-4 mr-1" /></Button>
            <Button variant="outline" className="border-border" onClick={() => { setRizzTargetBio(u.bio || ''); setShowRizzModal(true); }}><Sparkles className="w-4 h-4" /></Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="outline" size="icon" className="border-border h-9 w-9"><MoreVertical className="w-4 h-4" /></Button></DropdownMenuTrigger>
              <DropdownMenuContent className="bg-card border-border" align="end">
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowBlockAlert(true)}><Block className="w-4 h-4 mr-2" /> Block</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setActiveTab('abuse')}><Flag className="w-4 h-4 mr-2" /> Report</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    );
  }

  // ─── SETTINGS PANEL ────────────────────────────────────────
  function SettingsPanel() {
    return (
      <ScrollArea className="h-full">
        <div className="max-w-lg mx-auto p-4 space-y-6">
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={User} label="Account" />
            <div className="flex items-center justify-between"><div><p className="text-sm">Email</p><p className="text-[11px] text-muted-foreground">{currentUser?.email}</p></div><Badge variant="outline" className="text-[10px] border-border">Verified</Badge></div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between"><p className="text-sm">Username</p><p className="text-[11px] text-muted-foreground">@{currentUser?.username}</p></div>
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Shield} label="Privacy" />
            {[
              { key: 'showOnline', label: 'Show Online', desc: 'Let others see when you are online' },
              { key: 'showDistance', label: 'Show Distance', desc: 'Display your distance' },
              { key: 'showAge', label: 'Show Age', desc: 'Display your age' },
            ].map(item => (
              <React.Fragment key={item.key}>
                <div className="flex items-center justify-between"><div><p className="text-sm">{item.label}</p><p className="text-[11px] text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={(settingsPrivacy as any)[item.key]} onCheckedChange={v => setSettingsPrivacy(p => ({ ...p, [item.key]: v }))} /></div>
                <Separator className="bg-border" />
              </React.Fragment>
            ))}
            <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleSaveSettings}>Save Privacy</Button>
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Bell} label="Notifications" />
            {[
              { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications' },
              { key: 'chat', label: 'Chat Messages', desc: 'New message alerts' },
              { key: 'likes', label: 'Likes', desc: 'Like notifications' },
              { key: 'views', label: 'Profile Views', desc: 'View notifications' },
            ].map((item, idx) => (
              <React.Fragment key={item.key}>
                <div className="flex items-center justify-between"><div><p className="text-sm">{item.label}</p><p className="text-[11px] text-muted-foreground">{item.desc}</p></div>
                  <Switch checked={(settingsNotifs as any)[item.key]} onCheckedChange={v => setSettingsNotifs(p => ({ ...p, [item.key]: v }))} /></div>
                {idx < 3 && <Separator className="bg-border" />}
              </React.Fragment>
            ))}
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Crown} label="Premium" />
            {currentUser?.isPremium ? (
              <div className="flex items-center justify-between"><div><p className="text-sm gradient-text font-semibold">Premium Active</p><p className="text-[11px] text-muted-foreground">Enjoy all premium features</p></div><Crown className="w-6 h-6 text-yellow-400" /></div>
            ) : (
              <div><p className="text-sm font-medium">Upgrade to Premium</p><p className="text-[11px] text-muted-foreground mt-1">Get unlimited likes, see who viewed you, and more</p>
                <Button className="mt-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black text-xs"><Crown className="w-4 h-4 mr-2" /> Go Premium</Button></div>
            )}
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
            <SectionHeader icon={Block} label="Blocked Users" count={blockedUsers.length} />
            {blockedUsers.length > 0 ? blockedUsers.map((b: any) => (
              <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg"><Avatar className="h-8 w-8"><AvatarImage src={getAvatar(b.blocked)} /><AvatarFallback className="text-[10px]">{(b.blocked as any)?.displayName?.[0]}</AvatarFallback></Avatar>
                <span className="text-sm flex-1">{(b.blocked as any)?.displayName || 'User'}</span>
                <Button size="sm" variant="ghost" className="text-xs text-destructive" onClick={async () => { try { await fetch(`/api/blocks?blockedId=${(b.blocked as any)?.id}`, { method: 'DELETE' }); setBlockedUsers(prev => prev.filter((x: any) => x.id !== b.id)); } catch {} }}>Unblock</Button></div>
            )) : <p className="text-xs text-muted-foreground">No blocked users</p>}
          </CardContent></Card>
          <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-2">
            <SectionHeader icon={Globe} label="About NEXUS" />
            <p className="text-sm">NEXUS v2.0.0</p><p className="text-[11px] text-muted-foreground">A unified dating & social platform</p>
            <Separator className="bg-border" />
            <div className="space-y-1 text-xs text-muted-foreground"><button className="hover:text-foreground" onClick={() => setActiveTab('legal')}>Terms of Service</button><br /><button className="hover:text-foreground" onClick={() => setActiveTab('legal')}>Privacy Policy</button></div>
          </CardContent></Card>
          <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => { setCurrentUser(null); setAuthed(false); setShowSettings(false); }}><LogOut className="w-4 h-4 mr-2" /> Log Out</Button>
          <div className="h-4" />
        </div>
      </ScrollArea>
    );
  }
}

