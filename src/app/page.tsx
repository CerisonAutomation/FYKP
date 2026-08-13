'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io as socketIO, Socket } from 'socket.io-client';
import { formatDistanceToNow, format } from 'date-fns';
import { useAppStore } from '@/store/app';
import type { User, Message, Conversation, Like, Fansite, AppEvent, GroupChat, Photo, Album, ChatRequest, ProfileView as ProfileViewType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  Compass, MessageCircle, Heart, Star, Calendar, User, Search,
  Bell, Settings, X, Send, Paperclip, Check, CheckCheck, Crown,
  Shield, MapPin, ChevronLeft, ChevronRight, Grid3X3, Layers,
  ThumbsUp, ThumbsDown, Eye, Image as ImageIcon, Users, Zap,
  Copy, Sparkles, LogOut, Link2, ExternalLink, Flag, Ban as Block,
  Pencil, Camera, MoreVertical, ArrowLeft, Plus, Clock, Globe,
} from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const RIZZ_STYLES = [
  { value: 'romantic', label: 'Romantic', icon: '💖' },
  { value: 'funny', label: 'Funny', icon: '😂' },
  { value: 'bold', label: 'Bold', icon: '🔥' },
  { value: 'nerdy', label: 'Nerdy', icon: '🤓' },
  { value: 'sweet', label: 'Sweet', icon: '🍯' },
  { value: 'flirty', label: 'Flirty', icon: '😘' },
];

const TAP_TYPES = [
  { emoji: '🔥', label: 'Hot', color: 'from-red-500 to-orange-500' },
  { emoji: '👋', label: 'Friendly', color: 'from-blue-500 to-cyan-500' },
  { emoji: '😍', label: 'Looking', color: 'from-pink-500 to-rose-500' },
  { emoji: '✨', label: 'Fresh Face', color: 'from-emerald-500 to-teal-500' },
];

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face';
const DEFAULT_COVER = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&h=400&fit=crop';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
  } catch {
    return '';
  }
}

function formatEventDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy h:mm a');
  } catch {
    return dateStr;
  }
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

// ─── Main Component ──────────────────────────────────────────────────────────
export default function NexusApp() {
  const store = useAppStore();
  const {
    currentUser, setCurrentUser, activeTab, setActiveTab,
    selectedUserId, setSelectedUserId, selectedGroupId, setSelectedGroupId,
    showProfileDrawer, setShowProfileDrawer, showSettings, setShowSettings,
    showRizzModal, setShowRizzModal, rizzTargetBio, setRizzTargetBio,
    conversations, setConversations, activeConversation, setActiveConversation,
    messages, setMessages, addMessage, refreshDiscover, triggerRefreshDiscover,
    discoverView, setDiscoverView, sidebarOpen, setSidebarOpen,
    chatRequests, setChatRequests, pendingRequestCount, setPendingRequestCount,
  } = store;

  // ── Auth state ──
  const [authed, setAuthed] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  // ── Discover state ──
  const [discoverUsers, setDiscoverUsers] = useState<(User & { distance?: number | null })[]>([]);
  const [discoverLoading, setDiscoverLoading] = useState(true);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [ageRange, setAgeRange] = useState([18, 60]);
  const [lookingFor, setLookingFor] = useState('all');
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
  const [typing, setTyping] = useState(false);

  // ── Likes state ──
  const [likesTab, setLikesTab] = useState<'received' | 'sent'>('received');
  const [receivedLikes, setReceivedLikes] = useState<Like[]>([]);
  const [sentLikes, setSentLikes] = useState<Like[]>([]);
  const [likesLoading, setLikesLoading] = useState(true);

  // ── Viewed Me state ──
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
  const [notifications] = useState(3);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [totalUnread, setTotalUnread] = useState(0);

  // ─── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/auth')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(res => {
        setCurrentUser(res.data);
        setAuthed(true);
      })
      .catch(() => setAuthLoading(false))
      .finally(() => setAuthLoading(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', ...loginForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.data);
        setAuthed(true);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch {
      setLoginError('Network error');
    }
  }

  // ─── Socket.io ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || !currentUser) return;
    const socket = socketIO('/?XTransformPort=3001', { transports: ['websocket'], autoConnect: false });
    socket.connect();
    socket.on('connect', () => {
      socket.emit('join', { userId: currentUser.id });
    });
    socket.on('new-message', (msg: Message) => {
      addMessage(msg);
    });
    socket.on('typing', () => setTyping(true));
    socketRef.current = socket;
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [authed, currentUser?.id]);

  // ─── Fetch Discover ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed) return;
    setDiscoverLoading(true);
    fetch('/api/discover')
      .then(r => r.json())
      .then(res => {
        const users = res.data || [];
        setDiscoverUsers(users);
        setCascadeIndex(0);
      })
      .catch(() => {})
      .finally(() => setDiscoverLoading(false));
  }, [authed, refreshDiscover]);

  // ─── Fetch Conversations ────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || activeTab !== 'chat') return;
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

  // ─── Fetch Likes ────────────────────────────────────────────────────────────
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

  // ─── Fetch Profile Views (Viewed Me) ────────────────────────────────────────
  useEffect(() => {
    if (!authed || activeTab !== 'viewed') return;
    setViewsLoading(true);
    fetch('/api/profile-views')
      .then(r => r.json())
      .then(res => {
        setProfileViews(res.data || []);
      })
      .catch(() => {})
      .finally(() => setViewsLoading(false));
  }, [authed, activeTab]);

  // ─── Fetch Fansites ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || activeTab !== 'fansites') return;
    setFansiteLoading(true);
    fetch('/api/fansites').then(r => r.json()).then(res => {
      setFansites(res.data || []);
    }).catch(() => {}).finally(() => setFansiteLoading(false));
  }, [authed, activeTab]);

  // ─── Fetch Events ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || activeTab !== 'events') return;
    setEventsLoading(true);
    fetch('/api/events').then(r => r.json()).then(res => {
      setEvents(res.data || []);
    }).catch(() => {}).finally(() => setEventsLoading(false));
  }, [authed, activeTab]);

  // ─── Fetch Profile ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!selectedUserId) return;
    setProfileLoading(true);
    Promise.all([
      fetch(`/api/users/${selectedUserId}`).then(r => r.json()),
      fetch('/api/profile-views', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ viewedId: selectedUserId }),
      }).catch(() => null),
    ]).then(([res]) => {
      const u = res.data;
      setProfileUser(u);
      setProfilePhotos(u.photos || []);
      setProfileAlbums(u.albums || []);
      setRizzTargetBio(u.bio || '');
    }).catch(() => {}).finally(() => setProfileLoading(false));
  }, [selectedUserId]);

  // ─── Load my profile data ───────────────────────────────────────────────────
  useEffect(() => {
    if (!authed || !currentUser || activeTab !== 'profile') return;
    Promise.all([
      fetch(`/api/users/${currentUser.id}`).then(r => r.json()),
      fetch('/api/subscriptions').then(r => r.json()),
      fetch('/api/boosts').then(r => r.json()),
      fetch('/api/blocks').then(r => r.json()),
    ]).then(([userRes, subRes, boostRes, blockRes]) => {
      const u = userRes.data;
      setCurrentUser(u);
      setMySubscriptions(subRes.data || []);
      setMyBoosts((boostRes.data || []).filter((b: any) => b.isActive));
      setBlockedUsers(blockRes.data || []);
      setSettingsPrivacy({ showOnline: u.showOnline ?? true, showDistance: u.showDistance ?? true, showAge: u.showAge ?? true });
    }).catch(() => {});
  }, [authed, activeTab]);

  // ─── Scroll to bottom of messages ───────────────────────────────────────────
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, groupMessages]);

  // ─── Handlers ──────────────────────────────────────────────────────────────
  const openProfile = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, [setSelectedUserId]);

  const closeProfile = useCallback(() => {
    setShowProfileDrawer(false);
    setSelectedUserId(null);
    setProfileUser(null);
  }, [setShowProfileDrawer, setSelectedUserId]);

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
      fetch(`/api/messages?userId=${otherUser.id}`).then(r => r.json()).then(res => {
        setMessages(res.data || []);
      }).catch(() => {});
    }
  }, [currentUser, setActiveConversation, setMessages]);

  const sendMessage = useCallback(() => {
    if (!msgInput.trim() || !activeConversation || !currentUser) return;
    const content = msgInput.trim();
    setMsgInput('');
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUser.id,
      receiverId: activeConversation.otherUser.id,
      chatType: 'direct',
      isRead: false,
      type: 'text',
      createdAt: new Date().toISOString(),
    };
    addMessage(optimisticMsg);
    fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: activeConversation.otherUser.id, content, type: 'text' }),
    }).then(r => r.json()).then(res => {
      if (res.data) {
        setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? res.data : m));
        socketRef.current?.emit('message', res.data);
      }
    }).catch(() => {});
  }, [msgInput, activeConversation, currentUser, addMessage, setMessages]);

  const sendGroupMessage = useCallback(() => {
    if (!msgInput.trim() || !activeGroup || !currentUser) return;
    const content = msgInput.trim();
    setMsgInput('');
    const optimisticMsg: Message = {
      id: `temp-${Date.now()}`,
      content,
      senderId: currentUser.id,
      receiverId: '',
      chatType: 'group',
      isRead: false,
      type: 'text',
      createdAt: new Date().toISOString(),
      sender: currentUser,
    };
    setGroupMessages(prev => [...prev, optimisticMsg]);
    fetch(`/api/groups/${activeGroup.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'message', content }),
    }).then(r => r.json()).catch(() => {});
  }, [msgInput, activeGroup, currentUser]);

  const handleLike = useCallback(async (receiverId: string) => {
    try {
      await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId }),
      });
      triggerRefreshDiscover();
    } catch {}
  }, [triggerRefreshDiscover]);

  const handleUnlike = useCallback(async (receiverId: string) => {
    try {
      await fetch(`/api/likes?receiverId=${receiverId}`, { method: 'DELETE' });
      triggerRefreshDiscover();
    } catch {}
  }, [triggerRefreshDiscover]);

  const handleBlock = useCallback(async (userId: string) => {
    try {
      await fetch('/api/blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedId: userId }),
      });
      setShowBlockAlert(false);
      closeProfile();
    } catch {}
  }, [closeProfile]);

  const handleRizz = useCallback(async () => {
    setRizzLoading(true);
    setRizzResult(null);
    try {
      const res = await fetch('/api/ai-rizz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBio: rizzTargetBio, style: rizzStyle }),
      });
      const data = await res.json();
      setRizzResult(data.data);
    } catch {
      setRizzResult({ line: 'Failed to generate a line. Try again!', style: rizzStyle });
    } finally {
      setRizzLoading(false);
    }
  }, [rizzTargetBio, rizzStyle]);

  const handleSendRizz = useCallback(() => {
    if (!rizzResult || !activeConversation && !profileUser) return;
    if (activeConversation) {
      setMsgInput(rizzResult.line);
      setShowRizzModal(false);
    } else if (profileUser) {
      openChat(profileUser);
      setTimeout(() => {
        setMsgInput(rizzResult.line);
        setShowRizzModal(false);
      }, 300);
    }
  }, [rizzResult, activeConversation, profileUser, openChat]);

  const copyRizz = useCallback(() => {
    if (rizzResult?.line) {
      navigator.clipboard.writeText(rizzResult.line);
    }
  }, [rizzResult]);

  const handleRsvp = useCallback(async (eventId: string, status: string) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'rsvp', eventId, status }),
      });
      setUserRsvps(prev => ({ ...prev, [eventId]: status }));
    } catch {}
  }, []);

  const handleCreateEvent = useCallback(async () => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventForm),
      });
      if (res.ok) {
        const data = await res.json();
        setEvents(prev => [data.data, ...prev]);
        setShowCreateEvent(false);
        setEventForm({ title: '', description: '', location: '', startDate: '', imageUrl: '' });
      }
    } catch {}
  }, [eventForm]);

  const handleSaveProfile = useCallback(async () => {
    if (!currentUser) return;
    try {
      const payload: any = {};
      for (const [k, v] of Object.entries(editForm)) {
        if (v !== '' && v !== undefined) {
          if (k === 'height' || k === 'weight') payload[k] = parseInt(v);
          else payload[k] = v;
        }
      }
      const res = await fetch(`/api/users/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.data);
        setEditingProfile(false);
      }
    } catch {}
  }, [currentUser, editForm, setCurrentUser]);

  const handleSaveSettings = useCallback(async () => {
    if (!currentUser) return;
    try {
      await fetch(`/api/users/${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsPrivacy),
      });
      setCurrentUser({ ...currentUser, ...settingsPrivacy });
    } catch {}
  }, [currentUser, settingsPrivacy, setCurrentUser]);

  const handleChatRequest = useCallback(async (requestId: string, action: 'accept' | 'decline') => {
    try {
      await fetch('/api/chat-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      setChatRequests(prev => prev.filter(r => r.id !== requestId));
      setPendingRequestCount(prev => Math.max(0, prev - 1));
    } catch {}
  }, [setChatRequests, setPendingRequestCount]);

  // ─── Filtered discover users ───────────────────────────────────────────────
  const filteredDiscover = discoverUsers.filter(u => {
    if (onlineOnly && !u.online) return false;
    if (u.age && (u.age < ageRange[0] || u.age > ageRange[1])) return false;
    if (lookingFor !== 'all' && u.lookingFor !== lookingFor) return false;
    return true;
  });

  // ─── Login Screen ──────────────────────────────────────────────────────────
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
        <Card className="w-full max-w-sm bg-card border-border">
          <CardContent className="p-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Username</Label>
                <Input
                  placeholder="Enter username"
                  value={loginForm.username}
                  onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                  className="bg-secondary border-border h-11"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={loginForm.password}
                  onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                  className="bg-secondary border-border h-11"
                />
              </div>
              {loginError && <p className="text-destructive text-xs">{loginError}</p>}
              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── Cascade card swipe ────────────────────────────────────────────────────
  const cascadeUser = filteredDiscover[cascadeIndex];

  // ─── RENDER ────────────────────────────────────────────────────────────────
  return (
    <TooltipProvider>
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">

      {/* ═══ HEADER BAR ═══ */}
      <header className="h-14 flex items-center justify-between px-4 bg-card/80 backdrop-blur-lg border-b border-border shrink-0 z-50">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold gradient-text tracking-wider">NEXUS</span>
          {showSettings && (
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-secondary rounded-lg transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          {activeTab === 'chat' && activeConversation && !showSettings && (
            <button onClick={() => { setActiveConversation(null); setActiveGroup(null); setChatMobileView('list'); }} className="md:hidden p-1 hover:bg-secondary rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        {showSettings ? (
          <span className="text-sm font-medium">Settings</span>
        ) : (
          <div className="flex items-center gap-1">
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground"><Search className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Search</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground relative">
              <Bell className="w-4 h-4" />
              {notifications > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />}
            </Button></TooltipTrigger><TooltipContent>Notifications</TooltipContent></Tooltip>
            <Tooltip><TooltipTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground" onClick={() => setShowSettings(true)}><Settings className="w-4 h-4" /></Button></TooltipTrigger><TooltipContent>Settings</TooltipContent></Tooltip>
            <button onClick={() => { if (currentUser) openProfile(currentUser.id); }} className="ml-1">
              <Avatar className="h-8 w-8 border-2 border-primary/50">
                <AvatarImage src={getAvatar(currentUser)} alt={currentUser?.displayName || ''} />
                <AvatarFallback className="text-xs">{currentUser?.displayName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
            </button>
          </div>
        )}
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 overflow-hidden relative">

        {/* ─── Settings Panel ─── */}
        {showSettings && <SettingsPanel />}

        {/* ─── Discover Tab ─── */}
        {!showSettings && activeTab === 'discover' && <DiscoverView />}

        {/* ─── Chat Tab ─── */}
        {!showSettings && activeTab === 'chat' && <ChatView />}

        {/* ─── Likes Tab ─── */}
        {!showSettings && activeTab === 'likes' && <LikesView />}

        {/* ─── Viewed Me Tab ─── */}
        {!showSettings && activeTab === 'viewed' && <ViewedMeView />}

        {/* ─── Fansites Tab ─── */}
        {!showSettings && activeTab === 'fansites' && <FansitesView />}

        {/* ─── Events Tab ─── */}
        {!showSettings && activeTab === 'events' && <EventsView />}

        {/* ─── Profile Tab ─── */}
        {!showSettings && activeTab === 'profile' && <ProfileView />}
      </main>

      {/* ═══ BOTTOM NAV ═══ */}
      <nav className="h-14 flex items-center justify-around bg-card border-t border-border shrink-0 z-50 px-0.5">
        {([
          { tab: 'discover' as const, icon: Compass, label: 'Discover', badge: 0 },
          { tab: 'chat' as const, icon: MessageCircle, label: 'Chat', badge: totalUnread + pendingRequestCount },
          { tab: 'likes' as const, icon: Heart, label: 'Likes', badge: receivedLikes.length },
          { tab: 'viewed' as const, icon: Eye, label: 'Viewed', badge: 0 },
          { tab: 'fansites' as const, icon: Star, label: 'Fansites', badge: 0 },
          { tab: 'events' as const, icon: Calendar, label: 'Events', badge: 0 },
          { tab: 'profile' as const, icon: User, label: 'Profile', badge: 0 },
        ]).map(({ tab, icon: Icon, label, badge }) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setShowSettings(false); if (tab === 'chat') { setChatMobileView('list'); setActiveConversation(null); setActiveGroup(null); } }}
            className={`h-12 flex flex-col items-center justify-center gap-0.5 relative transition-colors px-1 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[9px] leading-none">{label}</span>
            {activeTab === tab && <span className="absolute bottom-0 w-4 h-0.5 bg-primary rounded-full" />}
            {badge > 0 && (
              <span className="absolute -top-0.5 right-1/2 translate-x-4 min-w-[14px] h-3.5 flex items-center justify-center text-[8px] font-bold bg-primary text-primary-foreground rounded-full px-0.5">
                {badge > 99 ? '99+' : badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* ═══ PROFILE DRAWER ═══ */}
      <Sheet open={showProfileDrawer} onOpenChange={(open) => { if (!open) closeProfile(); }}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-card border-border p-0 overflow-y-auto">
          {profileLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          ) : profileUser ? (
            <ProfileDrawerContent />
          ) : null}
        </SheetContent>
      </Sheet>

      {/* ═══ FANSITE DETAIL SHEET ═══ */}
      <Sheet open={showFansiteSheet} onOpenChange={setShowFansiteSheet}>
        <SheetContent side="bottom" className="max-h-[85vh] bg-card border-border rounded-t-2xl">
          {selectedFansite && <FansiteDetail />}
        </SheetContent>
      </Sheet>

      {/* ═══ RIZZ MODAL ═══ */}
      <Dialog open={showRizzModal} onOpenChange={setShowRizzModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> AI Rizz Generator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex flex-wrap gap-2">
              {RIZZ_STYLES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setRizzStyle(s.value)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${rizzStyle === s.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-secondary-foreground border-border hover:border-primary/50'}`}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
            <Button onClick={handleRizz} disabled={rizzLoading} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {rizzLoading ? <><Skeleton className="h-4 w-32" /> <span className="ml-2">Generating...</span></> : <>Generate Pickup Line</>}
            </Button>
            {rizzResult && (
              <div className="p-4 rounded-xl bg-secondary border border-border space-y-3">
                <p className="text-sm leading-relaxed">{rizzResult.line}</p>
                {rizzResult.context && <p className="text-[11px] text-muted-foreground">{rizzResult.context}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyRizz} className="text-xs border-border hover:bg-secondary">
                    <Copy className="w-3 h-3 mr-1" /> Copy
                  </Button>
                  <Button size="sm" onClick={handleSendRizz} className="text-xs bg-primary text-primary-foreground">
                    <Send className="w-3 h-3 mr-1" /> Send as Message
                  </Button>
                </div>
                {rizzResult.alternatives?.length > 0 && (
                  <div className="space-y-1 pt-2 border-t border-border">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Alternatives</p>
                    {rizzResult.alternatives.map((alt: string, i: number) => (
                      <p key={i} className="text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => setRizzResult({ ...rizzResult, line: alt })}>{alt}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ═══ BLOCK ALERT ═══ */}
      <AlertDialog open={showBlockAlert} onOpenChange={setShowBlockAlert}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Block this user?</AlertDialogTitle>
            <AlertDialogDescription>This user won't be able to see your profile or message you. You can unblock them later in Settings.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-secondary border-border">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => profileUser && handleBlock(profileUser.id)} className="bg-destructive text-white hover:bg-destructive/90">Block</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ═══ CREATE EVENT DIALOG ═══ */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Title</Label><Input value={eventForm.title} onChange={e => setEventForm(p => ({ ...p, title: e.target.value }))} placeholder="Event name" className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Description</Label><Textarea value={eventForm.description} onChange={e => setEventForm(p => ({ ...p, description: e.target.value }))} placeholder="What's this event about?" className="bg-secondary border-border" rows={3} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Location</Label><Input value={eventForm.location} onChange={e => setEventForm(p => ({ ...p, location: e.target.value }))} placeholder="Venue / Address" className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Date & Time</Label><Input type="datetime-local" value={eventForm.startDate} onChange={e => setEventForm(p => ({ ...p, startDate: e.target.value }))} className="bg-secondary border-border" /></div>
            <div className="space-y-1.5"><Label className="text-xs text-muted-foreground">Image URL (optional)</Label><Input value={eventForm.imageUrl} onChange={e => setEventForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." className="bg-secondary border-border" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateEvent(false)} className="border-border">Cancel</Button>
            <Button onClick={handleCreateEvent} className="bg-primary text-primary-foreground" disabled={!eventForm.title || !eventForm.startDate}>Create Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
    </TooltipProvider>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // SUB-VIEWS (defined as functions within the component for shared state access)
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Discover View ─────────────────────────────────────────────────────────
  function DiscoverView() {
    return (
      <div className="h-full flex flex-col">
        {/* Filter bar */}
        <div className="px-3 py-2 flex items-center gap-3 border-b border-border shrink-0 overflow-x-auto">
          <button
            onClick={() => setOnlineOnly(!onlineOnly)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-medium border shrink-0 transition-all ${onlineOnly ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary text-muted-foreground border-border'}`}
          >
            🟢 Online Only
          </button>
          <Popover>
            <PopoverTrigger asChild>
              <button className="px-3 py-1.5 rounded-full text-[11px] font-medium border bg-secondary text-muted-foreground border-border shrink-0 hover:border-primary/50 transition-all">
                {ageRange[0]}–{ageRange[1]} yrs
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 bg-card border-border p-3">
              <Slider value={ageRange} onValueChange={setAgeRange} min={18} max={80} step={1} className="mt-2" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1"><span>{ageRange[0]}</span><span>{ageRange[1]}</span></div>
            </PopoverContent>
          </Popover>
          <Select value={lookingFor} onValueChange={setLookingFor}>
            <SelectTrigger className="w-28 h-8 text-[11px] bg-secondary border-border shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="relationship">Relationship</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="friends">Friends</SelectItem>
              <SelectItem value="networking">Networking</SelectItem>
            </SelectContent>
          </Select>
          <div className="ml-auto flex gap-1 shrink-0">
            <button onClick={() => setDiscoverView('grid')} className={`p-1.5 rounded-lg transition-all ${discoverView === 'grid' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}><Grid3X3 className="w-4 h-4" /></button>
            <button onClick={() => setDiscoverView('cascade')} className={`p-1.5 rounded-lg transition-all ${discoverView === 'cascade' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}><Layers className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {discoverLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2"><Skeleton className="aspect-square w-full rounded-xl" /><Skeleton className="h-4 w-24" /><Skeleton className="h-3 w-16" /></div>
              ))}
            </div>
          ) : discoverView === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredDiscover.map(user => (
                <DiscoverGridCard key={user.id} user={user} />
              ))}
              {filteredDiscover.length === 0 && <p className="col-span-full text-center text-muted-foreground text-sm py-12">No profiles found</p>}
            </div>
          ) : (
            <div className="max-w-md mx-auto h-full flex items-center justify-center">
              {cascadeUser ? (
                <CascadeCard key={cascadeUser.id} user={cascadeUser} />
              ) : (
                <div className="text-center space-y-3">
                  <Heart className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground text-sm">No more profiles to discover</p>
                  <Button variant="outline" size="sm" onClick={triggerRefreshDiscover} className="border-border">Refresh</Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  function DiscoverGridCard({ user }: { user: User & { distance?: number | null } }) {
    const photo = user.photos?.[0];
    return (
      <div className="relative">
        <button onClick={() => openProfile(user.id)} className="profile-card text-left w-full rounded-xl overflow-hidden bg-card border border-border">
          <div className="relative aspect-square bg-secondary">
            {photo ? (
              <img src={photo.url} alt={user.displayName} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User className="w-8 h-8" /></div>
            )}
            {user.online && user.showOnline && <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-green-500 rounded-full online-pulse" />}
            {user.isPremium && <Crown className="absolute top-2 left-2 w-4 h-4 text-yellow-400" />}
            {user.isVerified && <Shield className="absolute top-2 left-2 w-4 h-4 text-blue-400" style={{ left: user.isPremium ? 24 : 8 }} />}
          </div>
          <div className="p-2.5 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[14px] font-semibold truncate">{user.displayName}</span>
              {user.age !== null && user.age !== undefined && user.showAge !== false && <span className="text-[12px] text-muted-foreground">{user.age}</span>}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              {user.distance != null && user.showDistance !== false && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{user.distance} km</span>}
              <span>{timeAgo(user.lastSeen)}</span>
            </div>
          </div>
        </button>
        {/* Quick like overlay */}
        <button
          onClick={(e) => { e.stopPropagation(); handleLike(user.id); }}
          className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-card transition-all z-10"
        >
          <Heart className="w-4 h-4" />
        </button>
      </div>
    );
  }

  function CascadeCard({ user }: { user: User & { distance?: number | null } }) {
    const photo = user.photos?.[0];
    return (
      <div className="cascade-animate w-full max-w-sm rounded-2xl overflow-hidden bg-card border border-border relative">
        <div className="relative aspect-[3/4] bg-secondary">
          {photo ? (
            <img src={photo.url} alt={user.displayName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground"><User className="w-16 h-16" /></div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-white">{user.displayName}{user.age != null ? `, ${user.age}` : ''}</h3>
              {user.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
              {user.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
            </div>
            {user.pronouns && <p className="text-xs text-white/70">{user.pronouns}</p>}
            {user.lookingFor && (
              <Badge className="bg-primary/30 text-primary-foreground text-[10px] border-primary/40 w-fit">Looking for: {user.lookingFor}</Badge>
            )}
            <div className="flex items-center gap-3 text-xs text-white/60">
              {user.distance != null && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{user.distance} km</span>}
              {user.online ? <span className="flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full" />Online</span> : <span>{timeAgo(user.lastSeen)}</span>}
            </div>
            {user.bio && <p className="text-xs text-white/80 line-clamp-2">{truncate(user.bio, 100)}</p>}
          </div>
          {/* Action buttons - skip and view at top right */}
          <div className="absolute top-3 right-3 flex gap-1.5">
            <button onClick={() => { setCascadeIndex(i => i + 1); }} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all">
              <X className="w-4 h-4" />
            </button>
            <button onClick={() => openProfile(user.id)} className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 transition-all">
              <Eye className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Tap system buttons below the card */}
        <div className="flex items-center justify-center gap-2 p-3">
          {TAP_TYPES.map(tap => (
            <button
              key={tap.label}
              onClick={() => { handleLike(user.id); setCascadeIndex(i => i + 1); }}
              className={`flex items-center gap-1 px-3 py-2 rounded-full text-[11px] font-medium bg-gradient-to-r ${tap.color} text-white hover:scale-105 active:scale-95 transition-all shadow-lg`}
            >
              <span>{tap.emoji}</span>
              <span className="hidden sm:inline">{tap.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ─── Chat View ─────────────────────────────────────────────────────────────
  function ChatView() {
    const showChatPanel = activeConversation || activeGroup;

    return (
      <div className="h-full flex">
        {/* Conversation List - hidden on mobile when chat is open */}
        <div className={`${showChatPanel ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-border shrink-0`}>
          <div className="p-3 border-b border-border shrink-0">
            <h2 className="text-sm font-semibold">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chatLoading ? (
              <div className="p-3 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-3"><Skeleton className="h-10 w-10 rounded-full" /><div className="space-y-1 flex-1"><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-20" /></div></div>)}</div>
            ) : (
              <>
                {/* Chat Requests Section */}
                {chatRequests.length > 0 && (
                  <>
                    <div className="px-3 py-2 border-b border-border bg-secondary/30">
                      <span className="text-[10px] text-primary uppercase tracking-wider font-semibold">Chat Requests ({chatRequests.length})</span>
                    </div>
                    {chatRequests.map((req: ChatRequest) => (
                      <div key={req.id} className="p-3 border-b border-border hover:bg-secondary/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <Avatar className="h-11 w-11">
                              <AvatarImage src={getAvatar(req.sender)} />
                              <AvatarFallback>{req.sender?.displayName?.[0] || '?'}</AvatarFallback>
                            </Avatar>
                            {req.sender?.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-semibold truncate">{req.sender?.displayName || 'User'}</span>
                              <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(req.createdAt)}</span>
                            </div>
                            {req.message && <p className="text-[12px] text-muted-foreground truncate mt-0.5">{req.message}</p>}
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="flex-1 h-7 bg-primary text-primary-foreground text-[11px]" onClick={() => handleChatRequest(req.id, 'accept')}>
                            <Check className="w-3 h-3 mr-1" /> Accept
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 h-7 border-border text-[11px] text-muted-foreground hover:text-destructive" onClick={() => handleChatRequest(req.id, 'decline')}>
                            <X className="w-3 h-3 mr-1" /> Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                {conversations.map((convo: Conversation) => (
                  <button
                    key={convo.otherUser.id}
                    onClick={() => openChat(convo.otherUser)}
                    className={`w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left ${activeConversation?.otherUser.id === convo.otherUser.id ? 'bg-secondary' : ''}`}
                  >
                    <div className="relative shrink-0">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={getAvatar(convo.otherUser)} />
                        <AvatarFallback>{convo.otherUser.displayName?.[0]}</AvatarFallback>
                      </Avatar>
                      {convo.otherUser.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold truncate">{convo.otherUser.displayName}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{timeAgo(convo.lastMessage.createdAt)}</span>
                      </div>
                      <p className="text-[12px] text-muted-foreground truncate">{convo.lastMessage.content}</p>
                    </div>
                    {convo.unreadCount > 0 && (
                      <span className="min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold bg-primary text-primary-foreground rounded-full px-1">{convo.unreadCount}</span>
                    )}
                  </button>
                ))}

                {/* Group Chats Section */}
                {groups.length > 0 && (
                  <>
                    <div className="px-3 py-2 border-t border-border">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">Group Chats</span>
                    </div>
                    {groups.map((group: any) => (
                      <button
                        key={group.id}
                        onClick={() => {
                          setActiveGroup(group);
                          setActiveConversation(null);
                          setChatMobileView('chat');
                          setGroupMessages([]);
                          fetch(`/api/groups/${group.id}`).then(r => r.json()).then(res => {
                            setGroupMessages(res.data?.messages || []);
                          }).catch(() => {});
                        }}
                        className={`w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left ${activeGroup?.id === group.id ? 'bg-secondary' : ''}`}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="h-11 w-11">
                            <AvatarImage src={group.avatar || undefined} />
                            <AvatarFallback><Users className="w-5 h-5" /></AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-[13px] font-semibold truncate">{group.name}</span>
                            <span className="text-[10px] text-muted-foreground">{group._count?.members || 0} members</span>
                          </div>
                          <p className="text-[12px] text-muted-foreground truncate">{group.description || 'No description'}</p>
                        </div>
                      </button>
                    ))}
                  </>
                )}
                {conversations.length === 0 && groups.length === 0 && chatRequests.length === 0 && (
                  <p className="text-center text-muted-foreground text-sm py-12">No conversations yet</p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat Panel - full screen on mobile, side panel on desktop */}
        <div className={`${!showChatPanel ? 'hidden md:flex' : 'flex'} flex-1 flex-col`}
        >
          {activeConversation ? (
            <>
              {/* Chat header */}
              <div className="h-12 flex items-center gap-3 px-4 border-b border-border shrink-0">
                <Avatar className="h-8 w-8"><AvatarImage src={getAvatar(activeConversation.otherUser)} /><AvatarFallback>{activeConversation.otherUser.displayName?.[0]}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{activeConversation.otherUser.displayName}</p>
                  <p className="text-[10px] text-muted-foreground">{activeConversation.otherUser.online ? 'Online' : 'Offline'}</p>
                </div>
                <button onClick={() => openProfile(activeConversation.otherUser.id)} className="p-1.5 hover:bg-secondary rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${msg.senderId === currentUser?.id ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-foreground rounded-bl-md'}`}>
                      {msg.content}
                      <div className={`flex items-center gap-1 mt-1 ${msg.senderId === currentUser?.id ? 'justify-end' : ''}`}>
                        <span className={`text-[10px] ${msg.senderId === currentUser?.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{timeAgo(msg.createdAt)}</span>
                        {msg.senderId === currentUser?.id && <CheckCheck className="w-3 h-3 text-primary-foreground/60" />}
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && <p className="text-center text-muted-foreground text-xs py-8">Start a conversation</p>}
                <div ref={msgEndRef} />
              </div>
              {/* Input */}
              <div className="p-3 border-t border-border flex items-center gap-2 shrink-0">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors"><Paperclip className="w-5 h-5" /></button>
                <Input
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-secondary border-border h-10 text-[13px]"
                />
                <Button onClick={sendMessage} size="icon" className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0" disabled={!msgInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : activeGroup ? (
            <>
              {/* Group chat header */}
              <div className="h-12 flex items-center gap-3 px-4 border-b border-border shrink-0">
                <Avatar className="h-8 w-8"><AvatarImage src={activeGroup.avatar || undefined} /><AvatarFallback><Users className="w-4 h-4" /></AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold truncate">{activeGroup.name}</p>
                  <p className="text-[10px] text-muted-foreground">{activeGroup._count?.members || 0} members</p>
                </div>
              </div>
              {/* Group messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {groupMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%]`}>
                      {msg.senderId !== currentUser?.id && msg.sender && (
                        <p className="text-[10px] text-primary font-medium mb-0.5 ml-1">{msg.sender.displayName}</p>
                      )}
                      <div className={`px-3.5 py-2 rounded-2xl text-[13px] leading-relaxed ${msg.senderId === currentUser?.id ? 'bg-primary text-primary-foreground rounded-br-md' : 'bg-secondary text-foreground rounded-bl-md'}`}>
                        {msg.content}
                        <div className={`flex items-center gap-1 mt-1 ${msg.senderId === currentUser?.id ? 'justify-end' : ''}`}>
                          <span className={`text-[10px] ${msg.senderId === currentUser?.id ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>{timeAgo(msg.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {groupMessages.length === 0 && <p className="text-center text-muted-foreground text-xs py-8">No messages yet</p>}
                <div ref={msgEndRef} />
              </div>
              {/* Group input */}
              <div className="p-3 border-t border-border flex items-center gap-2 shrink-0">
                <Input
                  value={msgInput}
                  onChange={e => setMsgInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendGroupMessage()}
                  placeholder={`Message ${activeGroup.name}...`}
                  className="flex-1 bg-secondary border-border h-10 text-[13px]"
                />
                <Button onClick={sendGroupMessage} size="icon" className="h-10 w-10 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0" disabled={!msgInput.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center">
              <div className="text-center space-y-2">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground text-sm">Select a conversation to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Likes View ────────────────────────────────────────────────────────────
  function LikesView() {
    const likesList = likesTab === 'received' ? receivedLikes : sentLikes;
    // Build a set of sender IDs we've sent likes to for match detection
    const sentLikeIds = new Set(sentLikes.map((l: Like) => l.receiverId));
    const receivedSenderIds = new Set(receivedLikes.map((l: Like) => l.senderId));

    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <Tabs value={likesTab} onValueChange={(v: any) => setLikesTab(v)}>
            <TabsList className="bg-secondary w-full h-9">
              <TabsTrigger value="received" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Received{receivedLikes.length > 0 && ` (${receivedLikes.length})`}</TabsTrigger>
              <TabsTrigger value="sent" className="text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Sent</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex-1 overflow-y-auto">
          {likesLoading ? (
            <div className="p-3 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-3 p-2"><Skeleton className="h-12 w-12 rounded-full" /><div className="space-y-1 flex-1"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-16" /></div></div>)}</div>
          ) : likesList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Heart className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No {likesTab} likes yet</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {likesList.map((like: Like) => {
                const otherUser = likesTab === 'received' ? like.sender : like.receiver;
                if (!otherUser) return null;
                // Check for mutual match
                const isMatch = likesTab === 'received' && sentLikeIds.has(otherUser.id) && receivedSenderIds.has(otherUser.id);
                return (
                  <div key={like.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className="relative">
                      <button onClick={() => openProfile(otherUser.id)}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatar(otherUser)} />
                          <AvatarFallback>{otherUser.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                      </button>
                      {otherUser.online && otherUser.showOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openProfile(otherUser.id)} className="text-[14px] font-semibold hover:text-primary transition-colors">{otherUser.displayName}</button>
                        {isMatch && (
                          <Badge className="gradient-text text-[9px] bg-primary/20 border-primary/40 px-1.5 py-0">MATCH</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        <span>{timeAgo(like.createdAt)}</span>
                        {!otherUser.online && otherUser.lastSeen && <span>· {getLastSeenText(otherUser)}</span>}
                        {otherUser.location && <span>· <MapPin className="w-3 h-3 inline" /> {otherUser.location}</span>}
                      </div>
                    </div>
                    {likesTab === 'received' && (
                      <div className="flex gap-1.5 shrink-0">
                        <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-xs" onClick={() => { handleLike(otherUser.id); }}>
                          <Heart className="w-3 h-3 mr-1" /> Like Back
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-xs text-muted-foreground hover:text-foreground" onClick={() => {}}>
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Viewed Me View ────────────────────────────────────────────────────────
  function ViewedMeView() {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold">Viewed Me</h2>
          <p className="text-[11px] text-muted-foreground">People who visited your profile</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {viewsLoading ? (
            <div className="p-3 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex items-center gap-3 p-2"><Skeleton className="h-12 w-12 rounded-full" /><div className="space-y-1 flex-1"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-16" /></div></div>)}</div>
          ) : profileViews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Eye className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No profile views yet</p>
            </div>
          ) : (
            <div className="p-3 space-y-1">
              {profileViews.map((view: ProfileViewType) => {
                const viewer = view.viewer;
                if (!viewer) return null;
                return (
                  <div key={view.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors">
                    <div className="relative">
                      <button onClick={() => openProfile(viewer.id)}>
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={getAvatar(viewer)} />
                          <AvatarFallback>{viewer.displayName?.[0]}</AvatarFallback>
                        </Avatar>
                      </button>
                      {viewer.online && viewer.showOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card online-pulse" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <button onClick={() => openProfile(viewer.id)} className="text-[14px] font-semibold hover:text-primary transition-colors">
                        {viewer.displayName}{viewer.age != null && viewer.showAge !== false ? `, ${viewer.age}` : ''}
                      </button>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                        {viewer.location && <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" />{viewer.location}</span>}
                        <span>{timeAgo(view.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" className="h-8 bg-primary text-primary-foreground hover:bg-primary/90 text-[11px]" onClick={() => { if (viewer) openChat(viewer); }}>
                        <MessageCircle className="w-3 h-3 mr-1" /> Msg
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 border-border text-[11px]" onClick={() => handleLike(viewer.id)}>
                        <Heart className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Fansites View ─────────────────────────────────────────────────────────
  function FansitesView() {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0">
          <h2 className="text-sm font-semibold">Fansites</h2>
          <p className="text-[11px] text-muted-foreground">Discover creators and subscribe</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {fansiteLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="space-y-2"><Skeleton className="h-40 w-full rounded-xl" /><Skeleton className="h-4 w-32" /><Skeleton className="h-3 w-24" /></div>)}</div>
          ) : fansites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Star className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No fansites yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fansites.map(fs => (
                <button
                  key={fs.id}
                  onClick={() => { setSelectedFansite(fs); setShowFansiteSheet(true); }}
                  className="profile-card text-left rounded-xl overflow-hidden bg-card border border-border"
                >
                  <div className="relative h-40 bg-secondary">
                    {fs.trailerImageUrl ? (
                      <img src={fs.trailerImageUrl} alt={fs.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary"><Star className="w-10 h-10 text-primary/50" /></div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-3 right-3 flex items-end justify-between">
                      <div>
                        <p className="text-white font-semibold text-sm">{fs.name}</p>
                        <p className="text-white/60 text-[11px]">@{fs.nick}</p>
                      </div>
                      {fs.user.online && <span className="w-2.5 h-2.5 bg-green-500 rounded-full online-pulse" />}
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <p className="text-[12px] text-muted-foreground line-clamp-2">{truncate(fs.description, 80)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {fs.geoName && <span className="text-[11px] text-muted-foreground flex items-center gap-0.5"><MapPin className="w-3 h-3" />{fs.geoName}</span>}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{fs.links.length} links</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Fansite Detail ────────────────────────────────────────────────────────
  function FansiteDetail() {
    if (!selectedFansite) return null;
    const fs = selectedFansite;
    return (
      <div className="space-y-4">
        <div className="relative h-48 bg-secondary rounded-xl overflow-hidden">
          {fs.trailerImageUrl ? <img src={fs.trailerImageUrl} alt={fs.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary"><Star className="w-16 h-16 text-primary/50" /></div>}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-xl font-bold">{fs.name}</h2>
            <p className="text-sm text-muted-foreground">@{fs.nick}</p>
            {fs.geoName && <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{fs.geoName}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10"><AvatarImage src={getAvatar(fs.user)} /><AvatarFallback>{fs.user.displayName?.[0]}</AvatarFallback></Avatar>
          <div>
            <p className="text-sm font-semibold">{fs.user.displayName}</p>
            <p className="text-[11px] text-muted-foreground">{fs.user.online ? '🟢 Online' : 'Offline'}</p>
          </div>
        </div>
        {fs.description && <p className="text-sm text-muted-foreground leading-relaxed">{fs.description}</p>}
        {fs.links.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Links</h3>
            {fs.links.map(link => (
              <div key={link.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-secondary border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{link.type?.[0] || '?'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{link.label || link.type}</p>
                  {link.value && <p className="text-[11px] text-muted-foreground truncate">{link.value}</p>}
                </div>
                {link.url && <ExternalLink className="w-4 h-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        )}
        {fs.products.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Subscribe</h3>
            {fs.products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
                <div>
                  <p className="text-sm font-medium capitalize">{product.period}</p>
                  {product.priceOld && <p className="text-[11px] text-muted-foreground line-through">${product.priceOld}</p>}
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold gradient-text">${product.price}</p>
                  <Button size="sm" className="h-7 text-[10px] bg-primary text-primary-foreground mt-1">Subscribe</Button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { if (fs.user) openChat(fs.user); setShowFansiteSheet(false); }}>
            <MessageCircle className="w-4 h-4 mr-2" /> Contact
          </Button>
          <Button variant="outline" className="border-border hover:bg-secondary" onClick={() => {}}>
            <Flag className="w-4 h-4 mr-2" /> Report
          </Button>
        </div>
      </div>
    );
  }

  // ─── Events View ───────────────────────────────────────────────────────────
  function EventsView() {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b border-border shrink-0 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Events</h2>
            <p className="text-[11px] text-muted-foreground">Upcoming near you</p>
          </div>
          <Button size="sm" className="h-8 bg-primary text-primary-foreground text-xs" onClick={() => setShowCreateEvent(true)}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Create
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {eventsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3 p-3 rounded-xl bg-card border border-border"><Skeleton className="h-20 w-20 rounded-lg" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-40" /><Skeleton className="h-3 w-24" /><Skeleton className="h-3 w-32" /></div></div>
            ))
          ) : events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-3">
              <Calendar className="w-12 h-12 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No upcoming events</p>
            </div>
          ) : (
            events.map((event: any) => {
              const myRsvp = userRsvps[event.id];
              return (
                <div key={event.id} className="profile-card rounded-xl bg-card border border-border overflow-hidden">
                  <div className="flex gap-3 p-3">
                    <div className="w-20 h-20 rounded-lg bg-secondary shrink-0 overflow-hidden">
                      {event.imageUrl ? <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Calendar className="w-8 h-8 text-muted-foreground" /></div>}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="text-[14px] font-semibold truncate">{event.title}</h3>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{formatEventDate(event.startDate)}</p>
                      {event.location && <p className="text-[11px] text-muted-foreground flex items-center gap-1"><MapPin className="w-3 h-3" />{event.location}</p>}
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Users className="w-3 h-3" />{event._count?.rsvps || 0} attending</p>
                    </div>
                  </div>
                  {event.description && <p className="px-3 pb-2 text-[12px] text-muted-foreground line-clamp-2">{event.description}</p>}
                  <div className="px-3 pb-3 flex gap-2">
                    {(['going', 'interested', 'not_going'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleRsvp(event.id, status)}
                        className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-all ${
                          myRsvp === status
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-secondary text-muted-foreground border-border hover:border-primary/50'
                        }`}
                      >
                        {status === 'going' ? '✅ Going' : status === 'interested' ? '👀 Interested' : '❌ Not Going'}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

  // ─── Profile View (My Profile) ─────────────────────────────────────────────
  function ProfileView() {
    if (!currentUser) return null;
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto space-y-0">
          {/* Banner area */}
          <div className="relative h-32 bg-gradient-to-br from-primary/30 via-secondary to-card overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card" />
          </div>

          {/* Avatar overlapping banner */}
          <div className="px-4 -mt-12 relative z-10">
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-card shadow-xl">
                  <AvatarImage src={getAvatar(currentUser)} />
                  <AvatarFallback className="text-2xl">{currentUser.displayName?.[0]}</AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg"><Camera className="w-4 h-4" /></button>
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{currentUser.displayName}</h2>
                  {currentUser.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
                  {currentUser.isPremium && <Crown className="w-4 h-4 text-yellow-400" />}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>@{currentUser.username}</span>
                  {currentUser.pronouns && <span>· {currentUser.pronouns}</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 pt-3 space-y-5 pb-6">
            {/* Bio */}
            {currentUser.bio && <p className="text-sm text-foreground/80 leading-relaxed">{currentUser.bio}</p>}
            {currentUser.aboutMe && (
              <div className="space-y-1">
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">About Me</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{currentUser.aboutMe}</p>
              </div>
            )}

            {/* Quick stats row */}
            <div className="grid grid-cols-4 gap-2">
              <div className="text-center p-2.5 rounded-xl bg-secondary border border-border">
                <p className="text-base font-bold gradient-text">{currentUser._count?.photos || 0}</p>
                <p className="text-[9px] text-muted-foreground">Photos</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-secondary border border-border">
                <p className="text-base font-bold">{currentUser._count?.receivedViews || 0}</p>
                <p className="text-[9px] text-muted-foreground">Views</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-secondary border border-border">
                <p className="text-base font-bold gradient-text">{currentUser._count?.receivedLikes || 0}</p>
                <p className="text-[9px] text-muted-foreground">Likes</p>
              </div>
              <div className="text-center p-2.5 rounded-xl bg-secondary border border-border">
                <p className="text-base font-bold">{(currentUser._count?.sentMessages || 0) + (currentUser._count?.receivedMessages || 0)}</p>
                <p className="text-[9px] text-muted-foreground">Messages</p>
              </div>
            </div>

            {/* Looking for */}
            {currentUser.lookingFor && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Looking for: <span className="capitalize text-primary">{currentUser.lookingFor}</span></span>
              </div>
            )}

            {/* Full Details grid */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Details</h3>
                <Button variant="ghost" size="sm" className="text-[11px] text-primary hover:text-primary" onClick={() => {
                  setEditingProfile(true);
                  setEditForm({
                    displayName: currentUser.displayName || '',
                    bio: currentUser.bio || '',
                    lookingFor: currentUser.lookingFor || '',
                    aboutMe: currentUser.aboutMe || '',
                    height: currentUser.height?.toString() || '',
                    weight: currentUser.weight?.toString() || '',
                    ethnicity: currentUser.ethnicity || '',
                    bodyType: currentUser.bodyType || '',
                    relationshipStatus: currentUser.relationshipStatus || '',
                    position: currentUser.position || '',
                    pronouns: currentUser.pronouns || '',
                    location: currentUser.location || '',
                  });
                }}>
                  <Pencil className="w-3 h-3 mr-1" /> Edit
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentUser.lookingFor && <DetailCell label="Looking for" value={currentUser.lookingFor} />}
                {currentUser.height && <DetailCell label="Height" value={`${currentUser.height} cm`} />}
                {currentUser.weight && <DetailCell label="Weight" value={`${currentUser.weight} kg`} />}
                {currentUser.bodyType && <DetailCell label="Body Type" value={currentUser.bodyType} />}
                {currentUser.ethnicity && <DetailCell label="Ethnicity" value={currentUser.ethnicity} />}
                {currentUser.position && <DetailCell label="Position" value={currentUser.position} />}
                {currentUser.relationshipStatus && <DetailCell label="Relationship" value={currentUser.relationshipStatus} />}
                {currentUser.location && <DetailCell label="Location" value={currentUser.location} />}
                {currentUser.pronouns && <DetailCell label="Pronouns" value={currentUser.pronouns} />}
                <DetailCell label="Gender" value={currentUser.gender} />
              </div>
            </div>

            {/* Photo Gallery */}
            {currentUser.photos && currentUser.photos.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {currentUser.photos.map(photo => (
                    <div key={photo.id} className="aspect-square rounded-xl overflow-hidden bg-secondary relative group">
                      <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Edit Profile Form */}
            {editingProfile && (
              <Card className="bg-secondary border-border p-4 space-y-3">
                <h3 className="text-sm font-semibold">Edit Profile</h3>
                {[
                  { key: 'displayName', label: 'Display Name' },
                  { key: 'bio', label: 'Bio' },
                  { key: 'aboutMe', label: 'About Me' },
                  { key: 'location', label: 'Location' },
                  { key: 'pronouns', label: 'Pronouns' },
                  { key: 'lookingFor', label: 'Looking For' },
                  { key: 'ethnicity', label: 'Ethnicity' },
                  { key: 'bodyType', label: 'Body Type' },
                  { key: 'relationshipStatus', label: 'Relationship Status' },
                  { key: 'position', label: 'Position' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">{label}</Label>
                    {(key === 'bio' || key === 'aboutMe') ? (
                      <Textarea value={(editForm as any)[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} className="bg-card border-border text-sm" rows={2} />
                    ) : (
                      <Input value={(editForm as any)[key]} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))} className="bg-card border-border text-sm h-9" />
                    )}
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><Label className="text-[11px] text-muted-foreground">Height (cm)</Label><Input type="number" value={editForm.height} onChange={e => setEditForm(p => ({ ...p, height: e.target.value }))} className="bg-card border-border text-sm h-9" /></div>
                  <div className="space-y-1"><Label className="text-[11px] text-muted-foreground">Weight (kg)</Label><Input type="number" value={editForm.weight} onChange={e => setEditForm(p => ({ ...p, weight: e.target.value }))} className="bg-card border-border text-sm h-9" /></div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 bg-primary text-primary-foreground" onClick={handleSaveProfile}>Save</Button>
                  <Button size="sm" variant="outline" className="border-border" onClick={() => setEditingProfile(false)}>Cancel</Button>
                </div>
              </Card>
            )}

            {/* Albums */}
            {currentUser.albums && currentUser.albums.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Albums</h3>
                <div className="space-y-2">
                  {currentUser.albums.map(album => (
                    <div key={album.id} className="p-3 rounded-xl bg-secondary border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium">{album.name}</p>
                        {album.isPrivate && <Badge variant="secondary" className="text-[10px] bg-muted">Private</Badge>}
                      </div>
                      {album.photos && album.photos.length > 0 && (
                        <div className="grid grid-cols-4 gap-1">
                          {album.photos.slice(0, 8).map(p => (
                            <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-card">
                              <img src={p.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* My Fansite */}
            {currentUser.fansite && (
              <div className="p-4 rounded-xl bg-secondary border border-border space-y-2">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2"><Star className="w-4 h-4" /> My Fansite</h3>
                <p className="text-sm font-medium">{currentUser.fansite.name} <span className="text-muted-foreground">@{currentUser.fansite.nick}</span></p>
                {currentUser.fansite.description && <p className="text-[12px] text-muted-foreground">{truncate(currentUser.fansite.description, 100)}</p>}
                {currentUser.fansite.status === 'active' && <Badge className="bg-primary/20 text-primary text-[10px]">Active</Badge>}
              </div>
            )}

            {/* My Subscriptions */}
            <div className="space-y-2">
              <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2"><Crown className="w-4 h-4" /> My Subscriptions</h3>
              {mySubscriptions.length > 0 ? mySubscriptions.map((sub: any) => (
                <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary border border-border">
                  <div>
                    <p className="text-sm font-medium capitalize">{sub.tier}</p>
                    <p className="text-[11px] text-muted-foreground">Since {format(new Date(sub.startDate), 'MMM d, yyyy')}</p>
                  </div>
                  {sub.isActive ? <Badge className="bg-primary/20 text-primary text-[10px]">Active</Badge> : <Badge variant="secondary" className="text-[10px]">Expired</Badge>}
                </div>
              )) : <p className="text-xs text-muted-foreground">No active subscriptions</p>}
            </div>

            {/* My Boosts */}
            {myBoosts.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-2"><Zap className="w-4 h-4" /> Active Boosts</h3>
                {myBoosts.map((boost: any) => (
                  <div key={boost.id} className="p-3 rounded-xl bg-secondary border border-border boost-glow">
                    <p className="text-sm font-medium capitalize">{boost.type} Boost</p>
                    <p className="text-[11px] text-muted-foreground">Ends {timeAgo(boost.endsAt)}</p>
                    <Progress value={50} className="mt-2 h-1.5" />
                  </div>
                ))}
              </div>
            )}

            {/* Settings shortcut */}
            <Button variant="outline" className="w-full border-border text-muted-foreground hover:text-foreground" onClick={() => setShowSettings(true)}>
              <Settings className="w-4 h-4 mr-2" /> Settings & Privacy
            </Button>

            <div className="h-4" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Detail Cell helper ────────────────────────────────────────────────────
  function DetailCell({ label, value }: { label: string; value: string }) {
    return (
      <div className="p-2.5 rounded-lg bg-secondary/50 border border-border">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-[13px] font-medium capitalize mt-0.5">{value}</p>
      </div>
    );
  }

  // ─── Profile Drawer Content ────────────────────────────────────────────────
  function ProfileDrawerContent() {
    if (!profileUser) return null;
    const u = profileUser;
    const isMe = currentUser?.id === u.id;
    const currentPhoto = profilePhotos[profileGalleryIndex];
    return (
      <div className="space-y-0">
        {/* Photo gallery */}
        <div className="relative bg-secondary">
          <div className="aspect-square max-h-[55vh] relative">
            {currentPhoto ? (
              <img src={currentPhoto.url} alt={u.displayName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><User className="w-20 h-20 text-muted-foreground" /></div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-card via-card/50 to-transparent" />
          </div>
          {/* Gallery nav dots */}
          {profilePhotos.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
              {profilePhotos.map((_, i) => (
                <button key={i} onClick={() => setProfileGalleryIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === profileGalleryIndex ? 'bg-primary w-4' : 'bg-white/40'}`} />
              ))}
            </div>
          )}
          {/* Gallery arrows */}
          {profilePhotos.length > 1 && (
            <>
              <button onClick={() => setProfileGalleryIndex(i => (i - 1 + profilePhotos.length) % profilePhotos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={() => setProfileGalleryIndex(i => (i + 1) % profilePhotos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all"><ChevronRight className="w-5 h-5" /></button>
            </>
          )}
          {/* Close button */}
          <button onClick={closeProfile} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/50 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 -mt-8 relative z-10 space-y-4">
          {/* Name + badges + online status */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold">{u.displayName}{u.showAge !== false && u.age ? `, ${u.age}` : ''}</h2>
                {u.isVerified && <Shield className="w-4 h-4 text-blue-400" />}
                {u.isPremium && <Badge className="bg-yellow-500/20 text-yellow-400 text-[10px] border-yellow-500/30"><Crown className="w-3 h-3 mr-0.5" /> Premium</Badge>}
              </div>
              <div className="flex items-center gap-3 text-[12px] text-muted-foreground mt-1">
                <span className="flex items-center gap-1">@{u.username}</span>
                {u.pronouns && <span>{u.pronouns}</span>}
              </div>
            </div>
            <div className="shrink-0">
              <div className={`flex items-center gap-1.5 text-[11px] ${u.online ? 'text-green-400' : 'text-muted-foreground'}`}>
                {u.online ? <span className="w-2 h-2 bg-green-400 rounded-full online-pulse" /> : null}
                {getLastSeenText(u)}
              </div>
            </div>
          </div>

          {/* Quick stats row - horizontal scrollable */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
            <div className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[72px]">
              <p className="text-sm font-bold gradient-text">{u._count?.photos || 0}</p>
              <p className="text-[9px] text-muted-foreground">Photos</p>
            </div>
            <div className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[72px]">
              <p className="text-sm font-bold">{u._count?.receivedViews || 0}</p>
              <p className="text-[9px] text-muted-foreground">Views</p>
            </div>
            <div className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[72px]">
              <p className="text-sm font-bold gradient-text">{u._count?.receivedLikes || 0}</p>
              <p className="text-[9px] text-muted-foreground">Likes</p>
            </div>
            {(u as any).distance != null && u.showDistance !== false && (
              <div className="shrink-0 text-center p-2.5 rounded-xl bg-secondary border border-border min-w-[72px]">
                <p className="text-sm font-bold">{(u as any).distance} km</p>
                <p className="text-[9px] text-muted-foreground">Away</p>
              </div>
            )}
          </div>

          {/* Looking for badge */}
          {u.lookingFor && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-primary/10 border border-primary/20">
              <Heart className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Looking for: <span className="capitalize text-primary">{u.lookingFor}</span></span>
            </div>
          )}

          {/* Full details grid */}
          <div className="space-y-1.5">
            <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {u.lookingFor && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Looking for</span><span className="capitalize text-[13px] font-medium">{u.lookingFor}</span></div>}
              {u.height && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Height</span><span className="text-[13px] font-medium">{u.height} cm</span></div>}
              {u.weight && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Weight</span><span className="text-[13px] font-medium">{u.weight} kg</span></div>}
              {u.bodyType && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Body type</span><span className="capitalize text-[13px] font-medium">{u.bodyType}</span></div>}
              {u.ethnicity && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Ethnicity</span><span className="capitalize text-[13px] font-medium">{u.ethnicity}</span></div>}
              {u.position && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Position</span><span className="capitalize text-[13px] font-medium">{u.position}</span></div>}
              {u.relationshipStatus && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Relationship</span><span className="capitalize text-[13px] font-medium">{u.relationshipStatus}</span></div>}
              {u.location && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Location</span><span className="text-[13px] font-medium">{u.location}</span></div>}
              {u.pronouns && <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Pronouns</span><span className="text-[13px] font-medium">{u.pronouns}</span></div>}
              <div className="flex justify-between p-2 rounded-lg bg-secondary/50"><span className="text-muted-foreground text-[12px]">Gender</span><span className="capitalize text-[13px] font-medium">{u.gender}</span></div>
            </div>
          </div>

          {/* About Me section */}
          {u.aboutMe && (
            <div className="space-y-1">
              <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">About Me</h4>
              <p className="text-sm leading-relaxed">{u.aboutMe}</p>
            </div>
          )}

          {/* Photo thumbnails */}
          {profilePhotos.length > 1 && (
            <div className="space-y-2">
              <h4 className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">Photos</h4>
              <div className="grid grid-cols-4 gap-1.5">
                {profilePhotos.map((p, i) => (
                  <button key={p.id} onClick={() => setProfileGalleryIndex(i)} className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${i === profileGalleryIndex ? 'border-primary' : 'border-transparent'}`}>
                    <img src={p.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!isMe && (
            <div className="flex gap-2 pt-2 pb-6">
              <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => { openChat(u); closeProfile(); }}>
                <MessageCircle className="w-4 h-4 mr-2" /> Message
              </Button>
              <Button variant="outline" className="border-border hover:bg-secondary" onClick={() => handleLike(u.id)}>
                <Heart className="w-4 h-4 mr-1" /> Like
              </Button>
              <Button variant="outline" className="border-border hover:bg-secondary" onClick={() => { setRizzTargetBio(u.bio || ''); setShowRizzModal(true); }}>
                <Sparkles className="w-4 h-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="border-border hover:bg-secondary h-9 w-9"><MoreVertical className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-card border-border" align="end">
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setShowBlockAlert(true)}><Block className="w-4 h-4 mr-2" /> Block</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => {}}><Flag className="w-4 h-4 mr-2" /> Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Settings Panel ────────────────────────────────────────────────────────
  function SettingsPanel() {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-lg mx-auto p-4 space-y-6">
          {/* Account */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><User className="w-4 h-4" /> Account</h3>
            <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div><p className="text-sm">Email</p><p className="text-[11px] text-muted-foreground">{currentUser?.email}</p></div>
                <Badge variant="outline" className="text-[10px] border-border">Verified</Badge>
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <p className="text-sm">Password</p>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">Change</Button>
              </div>
            </CardContent></Card>
          </div>

          {/* Privacy */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Shield className="w-4 h-4" /> Privacy</h3>
            <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div><p className="text-sm">Show Online Status</p><p className="text-[11px] text-muted-foreground">Let others see when you're online</p></div>
                <Switch checked={settingsPrivacy.showOnline} onCheckedChange={v => setSettingsPrivacy(p => ({ ...p, showOnline: v }))} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div><p className="text-sm">Show Distance</p><p className="text-[11px] text-muted-foreground">Display your distance to others</p></div>
                <Switch checked={settingsPrivacy.showDistance} onCheckedChange={v => setSettingsPrivacy(p => ({ ...p, showDistance: v }))} />
              </div>
              <Separator className="bg-border" />
              <div className="flex items-center justify-between">
                <div><p className="text-sm">Show Age</p><p className="text-[11px] text-muted-foreground">Display your age on your profile</p></div>
                <Switch checked={settingsPrivacy.showAge} onCheckedChange={v => setSettingsPrivacy(p => ({ ...p, showAge: v }))} />
              </div>
              <Button size="sm" className="bg-primary text-primary-foreground" onClick={handleSaveSettings}>Save Privacy</Button>
            </CardContent></Card>
          </div>

          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
            <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-4">
              {([['push', 'Push Notifications', 'Receive push notifications on your device'], ['chat', 'Chat Messages', 'Get notified for new messages'], ['likes', 'Likes', 'Get notified when someone likes you'], ['views', 'Profile Views', 'Get notified when someone views your profile']] as const).map(([key, label, desc]) => (
                <React.Fragment key={key}>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm">{label}</p><p className="text-[11px] text-muted-foreground">{desc}</p></div>
                    <Switch checked={(settingsNotifs as any)[key]} onCheckedChange={v => setSettingsNotifs(p => ({ ...p, [key]: v }))} />
                  </div>
                  {key !== 'views' && <Separator className="bg-border" />}
                </React.Fragment>
              ))}
            </CardContent></Card>
          </div>

          {/* Premium */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Crown className="w-4 h-4 text-yellow-400" /> Premium</h3>
            <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-3">
              {currentUser?.isPremium ? (
                <div className="flex items-center justify-between">
                  <div><p className="text-sm gradient-text font-semibold">Premium Active</p><p className="text-[11px] text-muted-foreground">Enjoy all premium features</p></div>
                  <Crown className="w-6 h-6 text-yellow-400" />
                </div>
              ) : (
                <div>
                  <p className="text-sm font-medium">Upgrade to Premium</p>
                  <p className="text-[11px] text-muted-foreground mt-1">Get unlimited likes, see who viewed you, and more</p>
                  <Button className="mt-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-black hover:from-yellow-400 hover:to-amber-400 text-xs">
                    <Crown className="w-4 h-4 mr-2" /> Go Premium
                  </Button>
                </div>
              )}
            </CardContent></Card>
          </div>

          {/* Blocked Users */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Block className="w-4 h-4" /> Blocked Users ({blockedUsers.length})</h3>
            {blockedUsers.length > 0 ? (
              <Card className="bg-secondary border-border"><CardContent className="p-3 space-y-2">
                {blockedUsers.map((b: any) => (
                  <div key={b.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-card transition-colors">
                    <Avatar className="h-8 w-8"><AvatarImage src={getAvatar(b.blocked)} /><AvatarFallback className="text-xs">{(b.blocked as any)?.displayName?.[0] || '?'}</AvatarFallback></Avatar>
                    <span className="text-sm flex-1">{(b.blocked as any)?.displayName || 'User'}</span>
                    <Button size="sm" variant="ghost" className="text-xs text-destructive hover:text-destructive" onClick={async () => {
                      try {
                        await fetch(`/api/blocks?blockedId=${(b.blocked as any)?.id}`, { method: 'DELETE' });
                        setBlockedUsers(prev => prev.filter((x: any) => x.id !== b.id));
                      } catch {}
                    }}>Unblock</Button>
                  </div>
                ))}
              </CardContent></Card>
            ) : <p className="text-xs text-muted-foreground">No blocked users</p>}
          </div>

          {/* About */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Globe className="w-4 h-4" /> About NEXUS</h3>
            <Card className="bg-secondary border-border"><CardContent className="p-4 space-y-2">
              <p className="text-sm">NEXUS v1.0.0</p>
              <p className="text-[11px] text-muted-foreground">A unified dating & social platform</p>
              <Separator className="bg-border" />
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Terms of Service</p>
                <p>Privacy Policy</p>
                <p>Open Source Licenses</p>
              </div>
            </CardContent></Card>
          </div>

          {/* Logout */}
          <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => { setCurrentUser(null); setAuthed(false); setShowSettings(false); }}>
            <LogOut className="w-4 h-4 mr-2" /> Log Out
          </Button>

          <div className="h-4" />
        </div>
      </div>
    );
  }
}