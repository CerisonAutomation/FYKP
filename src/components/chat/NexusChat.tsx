'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Socket } from 'socket.io-client';
import { formatDistanceToNow } from 'date-fns';
import { useAppStore } from '@/store/app';
import type { User, Message, Conversation, GroupChat } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem, ContextMenuSeparator } from '@/components/ui/context-menu';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, ChevronLeft, Sparkles, Pin, PinOff, Star, StarOff,
  Search, Mic, MicOff, MapPin, Image as ImageIcon, Video, Phone, Clock, Calendar,
  Shield, AlertTriangle, FileText, BarChart3, Languages, Heart,
  ThumbsUp, Laugh, Flame, Surprised, Eye, EyeOff, X, Check, CheckCheck,
  Copy, Share2, Bookmark, MoreVertical, MessageSquare, Reply,
  Timer, Palette, Radio, Vote, Hash, Flag, Trash2, Forward,
  PartyPopper, Coffee, Wine, Dumbbell, Film, Music, Navigation,
  Volume2, Pause, Play, Globe, Zap, Bot, ArrowUpRight, ChevronDown,
  ScanSearch, Loader2, CircleDot, BookmarkCheck, ShieldAlert, Plus,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// PROPS INTERFACE
// ═══════════════════════════════════════════════════════════════
interface NexusChatProps {
  msgInput: string;
  setMsgInput: (v: string) => void;
  sendMessage: () => void;
  sendGroupMessage: () => void;
  activeConversation: Conversation | null;
  activeGroup: GroupChat | null;
  messages: Message[];
  groupMessages: Message[];
  setGroupMessages: (msgs: Message[]) => void;
  getAvatar: (u?: User | null) => string;
  openProfile: (userId: string) => void;
  setActiveConversation: (c: Conversation | null) => void;
  setActiveGroup: (g: any) => void;
  setChatMobileView: (v: 'list' | 'chat') => void;
  msgEndRef: React.RefObject<HTMLDivElement>;
  socket: Socket | null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════
const REACTION_EMOJIS = ['\u2764\uFE0F', '\uD83D\uDE02', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDE2E', '\uD83D\uDE31'];
const REACTION_DISPLAY = ['\u2764\uFE0F', '\uD83D\uDE02', '\uD83D\uDD25', '\uD83D\uDC4D', '\uD83D\uDE2E', '\uD83D\uDE31'];

const DISAPPEAR_OPTIONS = [
  { label: '5s', value: '5s' },
  { label: '30s', value: '30s' },
  { label: '1m', value: '1m' },
  { label: '5m', value: '5m' },
  { label: '1h', value: '1h' },
];

const CHAT_THEMES = [
  { id: 'default', label: 'Default', ownBg: 'bg-primary', ownText: 'text-primary-foreground', otherBg: 'bg-secondary', otherBorder: 'border-border' },
  { id: 'midnight', label: 'Midnight', ownBg: 'bg-violet-600', ownText: 'text-white', otherBg: 'bg-zinc-800', otherBorder: 'border-zinc-700' },
  { id: 'ocean', label: 'Ocean', ownBg: 'bg-teal-600', ownText: 'text-white', otherBg: 'bg-cyan-950', otherBorder: 'border-cyan-900' },
  { id: 'sunset', label: 'Sunset', ownBg: 'bg-orange-600', ownText: 'text-white', otherBg: 'bg-amber-950', otherBorder: 'border-amber-900' },
  { id: 'forest', label: 'Forest', ownBg: 'bg-emerald-600', ownText: 'text-white', otherBg: 'bg-green-950', otherBorder: 'border-green-900' },
  { id: 'rose', label: 'Rose', ownBg: 'bg-pink-600', ownText: 'text-white', otherBg: 'bg-rose-950', otherBorder: 'border-rose-900' },
];

const MEET_NOW_ICONS: Record<string, { icon: any; label: string; color: string }> = {
  coffee: { icon: Coffee, label: 'Coffee', color: 'bg-amber-600' },
  drinks: { icon: Wine, label: 'Drinks', color: 'bg-violet-600' },
  gym: { icon: Dumbbell, label: 'Gym', color: 'bg-emerald-600' },
  movie: { icon: Film, label: 'Movie', color: 'bg-blue-600' },
  club: { icon: Music, label: 'Club', color: 'bg-pink-600' },
  video: { icon: Video, label: 'Video Call', color: 'bg-cyan-600' },
};

const HIV_BADGE_COLORS: Record<string, string> = {
  negative: 'bg-emerald-600',
  positive: 'bg-red-600',
  undetectable: 'bg-emerald-500',
  'on-prep': 'bg-blue-600',
};

// ═══════════════════════════════════════════════════════════════
// WAVEFORM BARS (for voice messages)
// ═══════════════════════════════════════════════════════════════
function WaveformBars({ playing, duration }: { playing: boolean; duration: number }) {
  const bars = 24;
  return (
    <div className="flex items-center gap-[2px] h-8">
      {Array.from({ length: bars }).map((_, i) => {
        const h = 20 + Math.sin(i * 0.8) * 30 + Math.abs(Math.sin(i * 1.7 + duration * 0.1)) * 20;
        return (
          <motion.div
            key={i}
            className={`w-[3px] rounded-full ${playing ? 'bg-primary-foreground' : 'bg-foreground/60'}`}
            animate={playing ? { scaleY: [1, 1.4, 0.8, 1.2, 1] } : {}}
            transition={{ duration: 0.8 + i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
            style={{ height: `${h}%`, transformOrigin: 'bottom' }}
          />
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function NexusChat(props: NexusChatProps) {
  const {
    msgInput, setMsgInput, sendMessage, sendGroupMessage,
    activeConversation, activeGroup, messages, groupMessages,
    setGroupMessages, getAvatar, openProfile,
    setActiveConversation, setActiveGroup, setChatMobileView,
    msgEndRef, socket,
  } = props;

  // ═══ Store ═══
  const currentUser = useAppStore((s) => s.currentUser);
  const chatTheme = useAppStore((s) => s.chatTheme);
  const setChatTheme = useAppStore((s) => s.setChatTheme);
  const nsfwFilter = useAppStore((s) => s.nsfwFilter);
  const setNsfwFilter = useAppStore((s) => s.setNsfwFilter);
  const typingUsers = useAppStore((s) => s.typingUsers);
  const setTypingUsers = useAppStore((s) => s.setTypingUsers);
  const showChatSearch = useAppStore((s) => s.showChatSearch);
  const setShowChatSearch = useAppStore((s) => s.setShowChatSearch);
  const chatSearchQuery = useAppStore((s) => s.chatSearchQuery);
  const setChatSearchQuery = useAppStore((s) => s.setChatSearchQuery);
  const replyingTo = useAppStore((s) => s.replyingTo);
  const setReplyingTo = useAppStore((s) => s.setReplyingTo);
  const showDisappearingTimer = useAppStore((s) => s.showDisappearingTimer);
  const setShowDisappearingTimer = useAppStore((s) => s.setShowDisappearingTimer);
  const showScheduleModal = useAppStore((s) => s.showScheduleModal);
  const setShowScheduleModal = useAppStore((s) => s.setShowScheduleModal);
  const showForwardModal = useAppStore((s) => s.showForwardModal);
  const setShowForwardModal = useAppStore((s) => s.setShowForwardModal);
  const forwardMessage = useAppStore((s) => s.forwardMessage);
  const setForwardMessage = useAppStore((s) => s.setForwardMessage);
  const showCreatePollModal = useAppStore((s) => s.showCreatePollModal);
  const setShowCreatePollModal = useAppStore((s) => s.setShowCreatePollModal);
  const showAlbumPicker = useAppStore((s) => s.showAlbumPicker);
  const setShowAlbumPicker = useAppStore((s) => s.setShowAlbumPicker);
  const showLocationPicker = useAppStore((s) => s.showLocationPicker);
  const setShowLocationPicker = useAppStore((s) => s.setShowLocationPicker);
  const showCallModal = useAppStore((s) => s.showCallModal);
  const setShowCallModal = useAppStore((s) => s.setShowCallModal);
  const callType = useAppStore((s) => s.callType);
  const setCallType = useAppStore((s) => s.setCallType);
  const showAiSummary = useAppStore((s) => s.showAiSummary);
  const setShowAiSummary = useAppStore((s) => s.setShowAiSummary);
  const aiSummary = useAppStore((s) => s.aiSummary);
  const setAiSummary = useAppStore((s) => s.setAiSummary);
  const showAutoReplies = useAppStore((s) => s.showAutoReplies);
  const setShowAutoReplies = useAppStore((s) => s.setShowAutoReplies);
  const autoReplies = useAppStore((s) => s.autoReplies);
  const setAutoReplies = useAppStore((s) => s.setAutoReplies);
  const showMeetupSuggestions = useAppStore((s) => s.showMeetupSuggestions);
  const setShowMeetupSuggestions = useAppStore((s) => s.setShowMeetupSuggestions);
  const meetupSuggestions = useAppStore((s) => s.meetupSuggestions);
  const setMeetupSuggestions = useAppStore((s) => s.setMeetupSuggestions);
  const showSafeWord = useAppStore((s) => s.showSafeWord);
  const setShowSafeWord = useAppStore((s) => s.setShowSafeWord);
  const isRecording = useAppStore((s) => s.isRecording);
  const setIsRecording = useAppStore((s) => s.setIsRecording);
  const recordingDuration = useAppStore((s) => s.recordingDuration);
  const setRecordingDuration = useAppStore((s) => s.setRecordingDuration);
  const showChatMediaGallery = useAppStore((s) => s.showChatMediaGallery);
  const setShowChatMediaGallery = useAppStore((s) => s.setShowChatMediaGallery);

  // ═══ Derived state ═══
  const isGroup = !!activeGroup;
  const chatUser = activeConversation?.otherUser;
  const chatMessages = (isGroup ? groupMessages : messages) || [];
  const otherUserId = isGroup ? activeGroup?.id : activeConversation?.otherUser?.id || '';

  // Extend User type for hivStatus and meetNowTags
  const chatUserData = chatUser as (User & { hivStatus?: string; meetNowTags?: string }) | null;
  const meetNowTags = chatUserData?.meetNowTags ? chatUserData.meetNowTags.split(',').filter(Boolean) : [];

  const theme = CHAT_THEMES.find((t) => t.id === chatTheme) || CHAT_THEMES[0];

  // ═══ Local state ═══
  const [contextMenuMsg, setContextMenuMsg] = useState<Message | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
  const [eventDetection, setEventDetection] = useState<{ detected: boolean; description: string; eventId?: string } | null>(null);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [showToolbar, setShowToolbar] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showDisappearingPicker, setShowDisappearingPicker] = useState(false);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [favoritedFilter, setFavoritedFilter] = useState(false);
  const [revealedImages, setRevealedImages] = useState<Record<string, boolean>>({});
  const [voicePlaying, setVoicePlaying] = useState<string | null>(null);
  const [pollVotes, setPollVotes] = useState<Record<string, number>>({});
  const [quickContextCard, setQuickContextCard] = useState<{ x: number; y: number; user: User } | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [locationName, setLocationName] = useState('');
  const [forwardTarget, setForwardTarget] = useState('');
  const [conversationsForForward, setConversationsForForward] = useState<Conversation[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<any>(null);
  const [autoReplyLoading, setAutoReplyLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [meetupLoading, setMeetupLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [callLoading, setCallLoading] = useState(false);
  const [mediaGalleryItems, setMediaGalleryItems] = useState<Message[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const disappearingTimersRef = useRef<Record<string, NodeJS.Timeout>>({});
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // ═══ Typing indicator from socket ═══
  useEffect(() => {
    if (!socket) return;
    const handleTyping = (data: { userId: string; chatId: string }) => {
      if (data.chatId === otherUserId) {
        setTypingUsers({ [data.userId]: true });
        setTimeout(() => setTypingUsers((prev: Record<string, boolean>) => {
          const next = { ...prev };
          delete next[data.userId];
          return next;
        }), 3000);
      }
    };
    socket.on('typing', handleTyping);
    return () => { socket.off('typing', handleTyping); };
  }, [socket, otherUserId, setTypingUsers]);

  // ═══ Emit typing when user types ═══
  useEffect(() => {
    if (!socket || !msgInput || !otherUserId) return;
    const timer = setTimeout(() => {
      socket.emit('typing', { chatId: otherUserId });
    }, 300);
    return () => clearTimeout(timer);
  }, [msgInput, socket, otherUserId]);

  // ═══ Disappearing message countdown ═══
  useEffect(() => {
    chatMessages.forEach((msg) => {
      if (msg.expiresAt && !disappearingTimersRef.current[msg.id]) {
        const expires = new Date(msg.expiresAt).getTime();
        const now = Date.now();
        if (expires > now) {
          disappearingTimersRef.current[msg.id] = setTimeout(() => {
            setGroupMessages(chatMessages.filter((m) => m.id !== msg.id));
            delete disappearingTimersRef.current[msg.id];
          }, expires - now);
        }
      }
    });
  }, [chatMessages]);

  // ═══ Cleanup timers ═══
  useEffect(() => {
    return () => {
      Object.values(disappearingTimersRef.current).forEach(clearTimeout);
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // ═══ Filtered messages ═══
  const displayMessages = (chatMessages || []).filter((msg) => {
    if (favoritedFilter && !msg.isFavorited) return false;
    if (showChatSearch && chatSearchQuery) {
      return (msg.content || '').toLowerCase().includes(chatSearchQuery.toLowerCase());
    }
    return true;
  });

  const pinnedMessages = (chatMessages || []).filter((m) => m.isPinned);

  // ═══ HANDLERS ═══

  // #1 AI Auto-Reply
  const fetchAutoReplies = useCallback(async () => {
    if (chatMessages.length === 0) return;
    setAutoReplyLoading(true);
    try {
      const recent = chatMessages.slice(-10);
      const res = await fetch('/api/chat/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recent.map((m) => ({ content: m.content, senderId: m.senderId })), userId: otherUserId }),
      });
      const data = await res.json();
      if (data.replies) {
        setAutoReplies(data.replies);
        setShowAutoReplies(true);
      }
    } catch {
      setAutoReplies([]);
    } finally {
      setAutoReplyLoading(false);
    }
  }, [chatMessages, otherUserId, setAutoReplies, setShowAutoReplies]);

  // After sending a message, fetch auto-replies
  const handleSendAndSuggest = () => {
    try {
      if (isGroup) { sendGroupMessage(); } else { sendMessage(); }
      setTimeout(() => fetchAutoReplies(), 500);
    } catch (e) {
      console.error('Send error:', e);
    }
  };

  // Parse disappearing timer value (e.g. '5s', '30s', '1m', '5m', '1h') to seconds
  const parseDisappearingToSeconds = (val: string): number => {
    const num = parseInt(val);
    if (val.endsWith('h')) return num * 3600;
    if (val.endsWith('m')) return num * 60;
    return num; // seconds
  };

  // Send handler that supports disappearing messages
  const handleSend = async () => {
    if (!msgInput.trim()) return;
    if (showDisappearingTimer) {
      const seconds = parseDisappearingToSeconds(showDisappearingTimer);
      const expiresAt = new Date(Date.now() + seconds * 1000).toISOString();
      try {
        const endpoint = isGroup ? `/api/groups/${otherUserId}` : '/api/messages';
        await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: otherUserId,
            content: msgInput.trim(),
            type: 'text',
            expiresAt,
          }),
        });
        setMsgInput('');
        setShowDisappearingTimer(null);
        setTimeout(() => fetchAutoReplies(), 500);
      } catch (e) {
        console.error('Disappearing send error:', e);
      }
    } else {
      handleSendAndSuggest();
    }
  };

  // #2 Real-Time Translation
  const translateMessage = async (msg: Message) => {
    if (translations[msg.id]) return;
    setLoadingAction(`translate-${msg.id}`);
    try {
      const res = await fetch('/api/chat/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: msg.content, targetLang: 'en' }),
      });
      const data = await res.json();
      if (data.translatedText) {
        setTranslations((prev) => ({ ...prev, [msg.id]: data.translatedText }));
      }
    } catch { /* silent */ } finally {
      setLoadingAction(null);
    }
  };

  // #3 Event Detection
  const detectEvent = async () => {
    if (chatMessages.length < 2) return;
    setEventLoading(true);
    try {
      const recent = chatMessages.slice(-8);
      const res = await fetch('/api/chat/event-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recent, userId: otherUserId, createEvent: false }),
      });
      const data = await res.json();
      if (data.detected) {
        setEventDetection({ detected: true, description: data.description || 'Plan detected!' });
      }
    } catch { /* silent */ } finally {
      setEventLoading(false);
    }
  };

  const createEventFromDetection = async () => {
    if (!eventDetection) return;
    setLoadingAction('create-event');
    try {
      const recent = chatMessages.slice(-8);
      await fetch('/api/chat/event-detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: recent, userId: otherUserId, createEvent: true }),
      });
      setEventDetection((prev) => prev ? { ...prev, eventId: 'created' } : null);
    } catch { /* silent */ } finally {
      setLoadingAction(null);
    }
  };

  // Run event detection when messages change (direct conversations only, every 5th message)
  useEffect(() => {
    if (activeConversation && chatMessages.length >= 2 && chatMessages.length % 5 === 0) {
      detectEvent();
    }
  }, [chatMessages.length, activeConversation]);

  // #5 Voice Message Recording
  const startRecording = () => {
    setIsRecording(true);
    setRecordingDuration(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration((prev: number) => prev + 1);
    }, 1000);
  };

  const stopRecording = async () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    if (recordingDuration > 0) {
      try {
        await fetch('/api/chat/voice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct', duration: recordingDuration }),
        });
      } catch { /* silent */ }
    }
    setRecordingDuration(0);
  };

  // #7 Message Reactions
  const toggleReaction = async (msgId: string, emoji: string) => {
    try {
      await fetch('/api/chat/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msgId, emoji }),
      });
    } catch { /* silent */ }
    setShowReactionPicker(null);
  };

  // #8 Reply Threading
  const handleReply = (msg: Message) => {
    setReplyingTo(msg);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  // #9 Message Pinning
  const togglePin = async (msg: Message) => {
    setLoadingAction(`pin-${msg.id}`);
    try {
      await fetch('/api/chat/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
    }
  };

  // #12 Message Recall
  const recallMessage = async (msg: Message) => {
    setLoadingAction(`recall-${msg.id}`);
    try {
      await fetch('/api/chat/recall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
    }
  };

  // #13 Favorite/Bookmark
  const toggleFavorite = async (msg: Message) => {
    setLoadingAction(`fav-${msg.id}`);
    try {
      await fetch('/api/chat/favorite-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msg.id }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
    }
  };

  // #14 AI Summary
  const fetchAiSummary = async () => {
    setSummaryLoading(true);
    setShowAiSummary(true);
    try {
      const res = await fetch('/api/chat/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatMessages, userId: otherUserId }),
      });
      const data = await res.json();
      setAiSummary(data.summary || 'No summary available.');
    } catch {
      setAiSummary('Failed to generate summary.');
    } finally {
      setSummaryLoading(false);
    }
  };

  // #17 Media Gallery
  const openMediaGallery = () => {
    const mediaMsgs = chatMessages.filter((m) => m.type === 'image' || m.type === 'video');
    setMediaGalleryItems(mediaMsgs);
    setShowChatMediaGallery(true);
  };

  // #18 Message Forwarding
  const openForwardModal = async (msg: Message) => {
    setForwardMessage(msg);
    try {
      const res = await fetch('/api/messages/conversations');
      const data = await res.json();
      setConversationsForForward(Array.isArray(data) ? data : []);
    } catch {
      setConversationsForForward([]);
    }
    setShowForwardModal(true);
  };

  const forwardMessageAction = async () => {
    if (!forwardMessage || !forwardTarget) return;
    setLoadingAction('forward');
    try {
      await fetch('/api/chat/forward', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: forwardMessage.id, toReceiverId: forwardTarget }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
      setShowForwardModal(false);
      setForwardMessage(null);
      setForwardTarget('');
    }
  };

  // #21 Poll Creation
  const createPoll = async () => {
    if (!pollQuestion || pollOptions.filter(Boolean).length < 2) return;
    setLoadingAction('poll');
    try {
      await fetch('/api/chat/poll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct',
          question: pollQuestion, options: pollOptions.filter(Boolean),
        }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
      setShowCreatePollModal(false);
      setPollQuestion('');
      setPollOptions(['', '']);
    }
  };

  const votePoll = async (msgId: string, optionIndex: number) => {
    try {
      await fetch('/api/chat/poll', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: msgId, optionIndex }),
      });
      setPollVotes((prev) => ({ ...prev, [`${msgId}-${optionIndex}`]: optionIndex }));
    } catch { /* silent */ }
  };

  // #22 Call Link
  const createCallLink = async (type: 'voice' | 'video') => {
    setCallLoading(true);
    setCallType(type);
    try {
      await fetch('/api/chat/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct', callType: type }),
      });
    } catch { /* silent */ } finally {
      setCallLoading(false);
      setShowCallModal(false);
    }
  };

  // #23 AI Suggest Meetup
  const fetchMeetupSuggestions = async () => {
    setMeetupLoading(true);
    setShowMeetupSuggestions(true);
    try {
      const otherUser = isGroup ? null : chatUser;
      const res = await fetch('/api/chat/meetup-suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLat: currentUser?.lat || 35.8969,
          userLng: currentUser?.lng || 14.4425,
          otherLat: otherUser?.lat || 35.9,
          otherLng: otherUser?.lng || 14.45,
        }),
      });
      const data = await res.json();
      setMeetupSuggestions(data.suggestions || data.venues || []);
    } catch {
      setMeetupSuggestions([]);
    } finally {
      setMeetupLoading(false);
    }
  };

  // #26 NSFW Filter toggle
  const toggleNsfwFilter = () => {
    setNsfwFilter(!nsfwFilter);
  };

  const revealImage = (msgId: string) => {
    setRevealedImages((prev) => ({ ...prev, [msgId]: true }));
  };

  // #28 Scheduled Message
  const sendScheduledMessage = async () => {
    if (!msgInput || !scheduleDate || !scheduleTime) return;
    setLoadingAction('schedule');
    try {
      await fetch('/api/chat/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct',
          content: msgInput, scheduledAt: `${scheduleDate}T${scheduleTime}:00`,
        }),
      });
    } catch { /* silent */ } finally {
      setLoadingAction(null);
      setShowScheduleModal(false);
      setMsgInput('');
      setScheduleDate('');
      setScheduleTime('');
    }
  };

  // #30 Safe Word
  const activateSafeWord = () => {
    setShowSafeWord(true);
    setTimeout(() => {
      setShowSafeWord(false);
      setActiveConversation(null);
      setActiveGroup(null);
      setChatMobileView('list');
    }, 2500);
  };

  // #30 Message Stats
  const getStats = () => {
    const mine = chatMessages.filter((m) => m.senderId === currentUser?.id);
    const theirs = chatMessages.filter((m) => m.senderId !== currentUser?.id);
    const totalChars = chatMessages.reduce((sum, m) => sum + m.content.length, 0);
    let avgRespTime = 'N/A';
    if (chatMessages.length >= 2) {
      const gaps: number[] = [];
      for (let i = 1; i < chatMessages.length; i++) {
        if (chatMessages[i].senderId !== chatMessages[i - 1].senderId) {
          const t1 = new Date(chatMessages[i - 1].createdAt).getTime();
          const t2 = new Date(chatMessages[i].createdAt).getTime();
          if (t2 > t1) gaps.push(t2 - t1);
        }
      }
      if (gaps.length > 0) {
        const avgMs = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        const totalSec = Math.floor(avgMs / 1000);
        const m = Math.floor(totalSec / 60);
        const s = totalSec % 60;
        avgRespTime = `${m}m ${s}s`;
      }
    }
    return { total: chatMessages.length, mine: mine.length, theirs: theirs.length, totalChars, avgRespTime };
  };

  // Long press for context menu
  const handleLongPressStart = (msg: Message, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    longPressTimerRef.current = setTimeout(() => {
      setContextMenuMsg(msg);
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Format recording duration
  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Get time ago
  const timeAgo = (dateStr: string) => {
    try { return formatDistanceToNow(new Date(dateStr), { addSuffix: true }); }
    catch { return ''; }
  };

  // Parse poll data
  const parsePollData = (pollDataStr?: string) => {
    if (!pollDataStr) return null;
    try { return JSON.parse(pollDataStr); }
    catch { return null; }
  };

  // Parse location data
  const parseLocationData = (locStr?: string) => {
    if (!locStr) return null;
    try { return JSON.parse(locStr); }
    catch { return null; }
  };

  // Parse call data
  const parseCallData = (callStr?: string) => {
    if (!callStr) return null;
    try { return JSON.parse(callStr); }
    catch { return null; }
  };

  // Parse reactions
  const parseReactions = (reactionsStr?: string): string[] => {
    if (!reactionsStr) return [];
    try { return JSON.parse(reactionsStr); }
    catch { return []; }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════

  // Message type badge
  const MessageTypeBadge = ({ msg }: { msg: Message }) => {
    if (msg.type === 'location' && parseLocationData(msg.locationData)) {
      return <Badge variant="outline" className="text-[10px] gap-1 border-amber-500/50 text-amber-400"><MapPin className="w-3 h-3" /> Location</Badge>;
    }
    if (msg.type === 'audio' || msg.voiceDuration) {
      return <Badge variant="outline" className="text-[10px] gap-1 border-cyan-500/50 text-cyan-400"><Volume2 className="w-3 h-3" /> Voice {msg.voiceDuration ? `(${formatDuration(msg.voiceDuration)})` : ''}</Badge>;
    }
    if (msg.pollData) {
      return <Badge variant="outline" className="text-[10px] gap-1 border-violet-500/50 text-violet-400"><Vote className="w-3 h-3" /> Poll</Badge>;
    }
    if (msg.callData) {
      const cd = parseCallData(msg.callData);
      return <Badge variant="outline" className="text-[10px] gap-1 border-emerald-500/50 text-emerald-400">{cd?.callType === 'video' ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />} {cd?.callType === 'video' ? 'Video' : 'Voice'} Call</Badge>;
    }
    if (msg.albumId) {
      return <Badge variant="outline" className="text-[10px] gap-1 border-pink-500/50 text-pink-400"><ImageIcon className="w-3 h-3" aria-hidden="true" /> Album</Badge>;
    }
    if (msg.scheduledAt) {
      return <Badge variant="outline" className="text-[10px] gap-1 border-orange-500/50 text-orange-400"><Timer className="w-3 h-3" /> Scheduled</Badge>;
    }
    return null;
  };

  // Reactions chips
  const ReactionChips = ({ msgId, reactionsStr }: { msgId: string; reactionsStr?: string }) => {
    const reactions = parseReactions(reactionsStr);
    if (reactions.length === 0) return null;
    const counts: Record<string, number> = {};
    reactions.forEach((r: string) => { counts[r] = (counts[r] || 0) + 1; });
    return (
      <div className="flex gap-1 mt-1 flex-wrap">
        {Object.entries(counts).map(([emoji, count]) => (
          <span key={emoji} className="inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-full bg-background/20 border border-border/50 cursor-pointer hover:bg-background/40 transition-colors">
            {emoji} {count > 1 && <span className="text-[9px] opacity-70">{count}</span>}
          </span>
        ))}
      </div>
    );
  };

  // Reply quote
  const ReplyQuote = ({ msg }: { msg: Message }) => {
    if (!msg) return null;
    return (
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-2 px-3 py-2 border-l-2 border-primary bg-secondary/50"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-primary truncate">{msg.sender?.displayName || 'Unknown'}</p>
          <p className="text-[11px] text-muted-foreground truncate">{msg.content}</p>
        </div>
        <button onClick={cancelReply} className="p-1 hover:bg-secondary rounded-full">
          <X className="w-3 h-3 text-muted-foreground" />
        </button>
      </motion.div>
    );
  };

  // Location card
  const LocationCard = ({ msg }: { msg: Message }) => {
    const loc = parseLocationData(msg.locationData);
    if (!loc) return null;
    return (
      <div className="mt-2 p-2 rounded-lg bg-background/10 border border-border/50">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-red-400" />
          <span className="text-[12px] font-medium">{loc.name || 'Shared Location'}</span>
        </div>
        <div className="h-24 rounded-md bg-secondary/50 flex items-center justify-center border border-border/30">
          <Navigation className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    );
  };

  // Voice message player
  const VoicePlayer = ({ msg }: { msg: Message }) => {
    const playing = voicePlaying === msg.id;
    return (
      <div className="flex items-center gap-3 mt-1 min-w-[200px]">
        <button onClick={() => setVoicePlaying(playing ? null : msg.id)} className="p-1.5 rounded-full bg-background/20 hover:bg-background/30 transition-colors">
          {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <div className="flex-1">
          <WaveformBars playing={playing} duration={msg.voiceDuration || 0} />
        </div>
        <span className="text-[10px] opacity-60">{formatDuration(msg.voiceDuration || 0)}</span>
      </div>
    );
  };

  // Poll card
  const PollCard = ({ msg }: { msg: Message }) => {
    const poll = parsePollData(msg.pollData);
    if (!poll) return null;
    const totalVotes = (poll.votes || []).reduce((a: number, b: number) => a + b, 0);
    const userVote = pollVotes[`${msg.id}-0`] ?? poll.userVote ?? -1;
    return (
      <div className="mt-2 space-y-2">
        <p className="text-[12px] font-semibold">{poll.question}</p>
        {(poll.options || []).map((opt: string, i: number) => {
          const votes = (poll.votes || [])[i] || 0;
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isVoted = userVote === i;
          return (
            <button
              key={i}
              onClick={() => votePoll(msg.id, i)}
              className={`w-full text-left relative rounded-lg border px-3 py-2 text-[12px] transition-all overflow-hidden ${isVoted ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
            >
              <div className="absolute inset-0 bg-primary/5" style={{ width: `${pct}%` }} />
              <div className="relative flex items-center justify-between">
                <span>{opt}</span>
                <span className="text-[10px] opacity-60">{pct}%</span>
              </div>
            </button>
          );
        })}
        <p className="text-[10px] text-muted-foreground">{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</p>
      </div>
    );
  };

  // Call card
  const CallCard = ({ msg }: { msg: Message }) => {
    const cd = parseCallData(msg.callData);
    if (!cd) return null;
    const isVideo = cd.callType === 'video';
    return (
      <div className="mt-2 p-3 rounded-lg bg-background/10 border border-border/50 flex items-center gap-3">
        <div className={`p-2 rounded-full ${isVideo ? 'bg-violet-600/20' : 'bg-emerald-600/20'}`}>
          {isVideo ? <Video className="w-5 h-5 text-violet-400" /> : <Phone className="w-5 h-5 text-emerald-400" />}
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-medium">{isVideo ? 'Video' : 'Voice'} Call</p>
          <p className="text-[10px] text-muted-foreground">{cd.link ? 'Tap to join' : 'Missed call'}</p>
        </div>
      </div>
    );
  };

  // Quick context card for group chat
  const QuickContextCardComp = () => {
    if (!quickContextCard) return null;
    const u = quickContextCard.user;
    const uExt = u as (User & { hivStatus?: string; meetNowTags?: string });
    const tags = uExt.meetNowTags ? uExt.meetNowTags.split(',').filter(Boolean) : [];
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -5 }}
          className="fixed z-[100] bg-card border border-border rounded-xl p-3 shadow-xl w-64"
          style={{ top: quickContextCard.y, left: Math.min(quickContextCard.x, window.innerWidth - 280) }}
        >
          <button onClick={() => setQuickContextCard(null)} className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-full">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={getAvatar(u)} />
              <AvatarFallback className="text-xs">{u.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold truncate" onClick={() => { openProfile(u.id); setQuickContextCard(null); }}>{u.displayName}</p>
              <p className="text-[10px] text-muted-foreground">{u.online ? <span className="text-emerald-400">Online</span> : 'Offline'}</p>
            </div>
          </div>
          {u.bio && <p className="text-[11px] text-muted-foreground mb-2 line-clamp-2">{u.bio}</p>}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {tags.map((tag: string) => {
                const mt = MEET_NOW_ICONS[tag.trim()];
                return mt ? (
                  <Badge key={tag} variant="outline" className={`text-[9px] gap-1 ${mt.color} text-white border-0`}>
                    <mt.icon className="w-3 h-3" /> {mt.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // MESSAGE BUBBLE
  // ═══════════════════════════════════════════════════════════════
  const MessageBubble = ({ msg }: { msg: Message }) => {
    const isMine = msg.senderId === currentUser?.id;
    const replyMsg = msg.replyToId ? chatMessages.find((m) => m.id === msg.replyToId) : null;
    const isRecalled = msg.isRecalled;
    const isImage = msg.type === 'image' && msg.mediaUrl;
    const isVideo = msg.type === 'video' && msg.mediaUrl;
    const blurred = nsfwFilter && isImage && !revealedImages[msg.id];
    const loc = parseLocationData(msg.locationData);
    const isLocationType = msg.type === 'location' || loc;
    const isVoice = msg.type === 'audio' || msg.voiceDuration;
    const isPoll = !!msg.pollData;
    const isCall = !!msg.callData;
    const isScheduled = !!msg.scheduledAt;
    const isAlbum = !!msg.albumId;
    const translation = translations[msg.id];
    const typing = loadingAction === `translate-${msg.id}`;

    return (
      <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} group`}> 
        <ContextMenu>
          <ContextMenuTrigger>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`relative max-w-[80%] md:max-w-[70%] ${isMine ? theme.ownBg + ' ' + theme.ownText + ' rounded-2xl rounded-br-md' : theme.otherBg + ' border ' + theme.otherBorder + ' rounded-2xl rounded-bl-md text-foreground'}`}
              onMouseDown={(e) => handleLongPressStart(msg, e)}
              onMouseUp={handleLongPressEnd}
              onMouseLeave={handleLongPressEnd}
              onTouchStart={(e) => handleLongPressStart(msg, e)}
              onTouchEnd={handleLongPressEnd}
            >
              {/* Pin indicator */}
              {msg.isPinned && (
                <div className="absolute -top-1 left-2 bg-amber-500 text-white rounded-full p-0.5">
                  <Pin className="w-2.5 h-2.5" />
                </div>
              )}

              <div className="px-3 py-2">
                {/* Group sender name - clickable for context card */}
                {isGroup && !isMine && msg.sender && (
                  <button
                    className="text-[10px] font-semibold opacity-70 hover:opacity-100 transition-opacity mb-0.5"
                    onClick={(e) => {
                      if (msg.sender) {
                        setQuickContextCard({ x: e.clientX, y: e.clientY, user: msg.sender! });
                      }
                    }}
                  >
                    {msg.sender.displayName}
                  </button>
                )}

                {/* Reply quote inside bubble */}
                {replyMsg && (
                  <div className="mb-1.5 pl-2 border-l-2 border-current/30 py-0.5">
                    <p className="text-[9px] font-semibold opacity-60">{replyMsg.sender?.displayName}</p>
                    <p className="text-[10px] opacity-50 truncate max-w-[180px]">{replyMsg.content}</p>
                  </div>
                )}

                {/* Type badge */}
                <MessageTypeBadge msg={msg} />

                {/* Message content */}
                {isRecalled ? (
                  <p className="text-[12px] italic opacity-50">Message recalled</p>
                ) : isImage ? (
                  <div className="relative rounded-lg overflow-hidden">
                    <div className={`w-full h-48 bg-secondary/50 flex items-center justify-center ${blurred ? 'blur-xl' : ''}`}>
                      <ImageIcon className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
                    </div>
                    {blurred && (
                      <button
                        onClick={() => revealImage(msg.id)}
                        className="absolute inset-0 flex items-center justify-center bg-secondary/60"
                      >
                        <div className="flex items-center gap-2 bg-card/90 px-3 py-2 rounded-lg border border-border">
                          <Eye className="w-4 h-4" />
                          <span className="text-[12px]">Tap to reveal</span>
                        </div>
                      </button>
                    )}
                  </div>
                ) : isVideo ? (
                  <div className="w-full h-48 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Video className="w-8 h-8 text-muted-foreground" />
                  </div>
                ) : isLocationType ? (
                  <LocationCard msg={msg} />
                ) : isVoice ? (
                  <VoicePlayer msg={msg} />
                ) : isPoll ? (
                  <PollCard msg={msg} />
                ) : isCall ? (
                  <CallCard msg={msg} />
                ) : isAlbum ? (
                  <div className="flex items-center gap-2 mt-1">
                    <ImageIcon className="w-4 h-4 opacity-60" aria-hidden="true" />
                    <span className="text-[12px]">Shared an album</span>
                  </div>
                ) : isScheduled ? (
                  <div className="space-y-1">
                    <p className="text-[12px]">{msg.content}</p>
                    <div className="flex items-center gap-1 text-[10px] opacity-60">
                      <Timer className="w-3 h-3" />
                      Scheduled for {msg.scheduledAt ? new Date(msg.scheduledAt).toLocaleString() : 'N/A'}
                    </div>
                  </div>
                ) : (
                  <p className="text-[13px] break-words whitespace-pre-wrap">{msg.content}</p>
                )}

                {/* Translation */}
                {translation && (
                  <div className="mt-1.5 pt-1.5 border-t border-current/10">
                    <div className="flex items-center gap-1 text-[9px] opacity-50 mb-0.5">
                      <Languages className="w-3 h-3" /> Translated
                    </div>
                    <p className="text-[11px] opacity-80">{translation}</p>
                  </div>
                )}
                {typing && (
                  <div className="flex items-center gap-1 mt-1 text-[10px] opacity-50">
                    <Loader2 className="w-3 h-3 animate-spin" /> Translating...
                  </div>
                )}

                {/* Reactions */}
                <ReactionChips msgId={msg.id} reactionsStr={msg.reactions} />

                {/* Timestamp + Read Receipt */}
                <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-primary-foreground/50' : 'text-muted-foreground'}`}>
                  {msg.isFavorited && <Star className="w-3 h-3 text-amber-400" />}
                  <span className="text-[9px]">{timeAgo(msg.createdAt)}</span>
                  {isMine && (
                    msg.isRead ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />
                  )}
                </div>
              </div>

              {/* Disappearing countdown */}
              {msg.expiresAt && (
                <div className="px-3 pb-1.5">
                  <div className="flex items-center gap-1 text-[9px] opacity-50">
                    <Timer className="w-3 h-3" />
                    <span>Expires {timeAgo(msg.expiresAt)}</span>
                  </div>
                </div>
              )}

              {/* Hover action buttons */}
              {!isRecalled && (
                <div className="absolute -top-2 right-2 hidden group-hover:flex items-center bg-card border border-border rounded-full shadow-lg p-0.5 gap-0.5 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowReactionPicker(msg.id); }}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <Heart className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReply(msg); }}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <Reply className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); translateMessage(msg); }}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <Languages className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); openForwardModal(msg); }}
                    className="p-1 hover:bg-secondary rounded-full transition-colors"
                  >
                    <Forward className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}

              {/* Reaction picker popup */}
              <AnimatePresence>
                {showReactionPicker === msg.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 5 }}
                    className={`absolute ${isMine ? 'bottom-full right-0' : 'bottom-full left-0'} mb-2 bg-card border border-border rounded-full px-2 py-1 flex gap-1 shadow-xl z-20`}
                  >
                    {REACTION_DISPLAY.map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => toggleReaction(msg.id, REACTION_EMOJIS[i])}
                        className="w-8 h-8 flex items-center justify-center hover:bg-secondary rounded-full transition-transform hover:scale-125 text-lg"
                      >
                        {emoji}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </ContextMenuTrigger>
          <ContextMenuContent className="bg-card border-border">
            {!isMine && (
              <ContextMenuItem onClick={() => handleReply(msg)} className="gap-2 text-foreground">
                <Reply className="w-4 h-4" /> Reply
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={() => translateMessage(msg)} className="gap-2 text-foreground">
              <Languages className="w-4 h-4" /> Translate
            </ContextMenuItem>
            <ContextMenuItem onClick={() => togglePin(msg)} className="gap-2 text-foreground">
              {msg.isPinned ? <><PinOff className="w-4 h-4" /> Unpin</> : <><Pin className="w-4 h-4" /> Pin</>}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => toggleFavorite(msg)} className="gap-2 text-foreground">
              {msg.isFavorited ? <><StarOff className="w-4 h-4" /> Unfavorite</> : <><Star className="w-4 h-4" /> Favorite</>}
            </ContextMenuItem>
            <ContextMenuItem onClick={() => openForwardModal(msg)} className="gap-2 text-foreground">
              <Forward className="w-4 h-4" /> Forward
            </ContextMenuItem>
            {isMine && (
              <ContextMenuItem onClick={() => recallMessage(msg)} className="gap-2 text-red-400">
                <Trash2 className="w-4 h-4" /> Unsend
              </ContextMenuItem>
            )}
          </ContextMenuContent>
        </ContextMenu>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // CHAT HEADER
  // ═══════════════════════════════════════════════════════════════
  const ChatHeader = () => {
    const hivStatus = (chatUserData as any)?.hivStatus;
    return (
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border shrink-0 bg-card">
        <button
          onClick={() => { setActiveConversation(null); setActiveGroup(null); setChatMobileView('list'); }}
          className="md:hidden p-1.5 hover:bg-secondary rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <button onClick={() => chatUser && openProfile(chatUser.id)} className="relative">
          <Avatar className="h-9 w-9">
            <AvatarImage src={getAvatar(isGroup ? undefined : chatUser)} />
            <AvatarFallback className="text-xs">
              {(isGroup ? activeGroup?.name : chatUser?.displayName)?.[0] || '?'}
            </AvatarFallback>
          </Avatar>
          {chatUser?.online && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-[13px] font-semibold truncate">
              {isGroup ? activeGroup?.name : chatUser?.displayName}
            </p>
            {/* #24 HIV Badge */}
            {hivStatus && hivStatus !== 'not-specified' && hivStatus !== 'prefer-not-to-say' && (
              <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 ${HIV_BADGE_COLORS[hivStatus] || 'bg-gray-600'} text-white border-0 gap-0.5`}>
                <Shield className="w-2.5 h-2.5" />
                {hivStatus === 'on-prep' ? 'PrEP' : hivStatus === 'undetectable' ? 'U=U' : hivStatus}
              </Badge>
            )}
            {/* #25 Meet Now Tags */}
            {meetNowTags.map((tag: string) => {
              const mt = MEET_NOW_ICONS[tag.trim()];
              return mt ? (
                <Badge key={tag} variant="outline" className={`text-[8px] px-1 py-0 h-4 ${mt.color} text-white border-0 gap-0.5`}>
                  <mt.icon className="w-2.5 h-2.5" />
                </Badge>
              ) : null;
            })}
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isGroup
              ? `${activeGroup?._count?.members || 0} members`
              : chatUser?.online
                ? 'Online'
                : `Last seen ${chatUser?.lastSeen ? timeAgo(chatUser.lastSeen) : 'unknown'}`}
          </p>
        </div>

        {/* Header actions */}
        <div className="flex items-center gap-0.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => createCallLink('voice')}>
                  <Phone className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Voice Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => createCallLink('video')}>
                  <Video className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Video Call</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border w-52">
              <DropdownMenuItem onClick={() => setShowChatSearch(!showChatSearch)} className="gap-2 text-foreground cursor-pointer">
                <Search className="w-4 h-4" /> Search Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openMediaGallery} className="gap-2 text-foreground cursor-pointer">
                <ImageIcon className="w-4 h-4" aria-hidden="true" /> Media Gallery
              </DropdownMenuItem>
              <DropdownMenuItem onClick={fetchAiSummary} className="gap-2 text-foreground cursor-pointer">
                <Sparkles className="w-4 h-4" /> AI Summary
              </DropdownMenuItem>
              <DropdownMenuItem onClick={fetchMeetupSuggestions} className="gap-2 text-foreground cursor-pointer">
                <MapPin className="w-4 h-4" /> Suggest Meetup
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowThemeModal(true)} className="gap-2 text-foreground cursor-pointer">
                <Palette className="w-4 h-4" /> Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { const userId = activeConversation?.otherUser?.id; if (!userId) return; fetch(`/api/chat/export?otherUserId=${userId}`).then(r => r.blob()).then(blob => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `chat-${userId}-${Date.now()}.txt`; a.click(); URL.revokeObjectURL(url); }).catch(() => {}); }} className="gap-2 text-foreground cursor-pointer">
                <FileText className="w-4 h-4" /> Export Chat
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={toggleNsfwFilter} className="gap-2 text-foreground cursor-pointer">
                <EyeOff className="w-4 h-4" /> {nsfwFilter ? 'Show Explicit' : 'Filter Explicit'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFavoritedFilter(!favoritedFilter)} className="gap-2 text-foreground cursor-pointer">
                <BookmarkCheck className="w-4 h-4" /> {favoritedFilter ? 'Show All' : 'Favorites Only'}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <DropdownMenuItem onClick={activateSafeWord} className="gap-2 text-red-500 cursor-pointer">
                <ShieldAlert className="w-4 h-4" /> Safe Mode (SOS)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // PINNED MESSAGES BAR
  // ═══════════════════════════════════════════════════════════════
  const PinnedMessagesBar = () => {
    if (pinnedMessages.length === 0) return null;
    return (
      <div className="border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2 px-3 py-1.5">
          <Pin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="text-[10px] text-muted-foreground font-medium">Pinned</span>
        </div>
        <ScrollArea className="max-w-full" type="scroll">
          <div className="flex gap-2 px-3 pb-2 overflow-x-auto">
            {pinnedMessages.map((pm) => (
              <div key={pm.id} className="shrink-0 max-w-[200px] px-3 py-1.5 rounded-lg bg-card border border-border">
                <p className="text-[11px] font-medium truncate">{pm.isRecalled ? 'Message recalled' : pm.content}</p>
                <p className="text-[9px] text-muted-foreground">{pm.sender?.displayName}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // TYPING INDICATOR
  // ═══════════════════════════════════════════════════════════════
  const TypingIndicator = () => {
    const isTyping = Object.keys(typingUsers).length > 0;
    if (!isTyping) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 5 }}
        className="flex justify-start mb-2"
      >
        <div className={`${theme.otherBg} border ${theme.otherBorder} rounded-2xl rounded-bl-md px-4 py-3`}
        >
          <div className="flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // EVENT DETECTION BANNER
  // ═══════════════════════════════════════════════════════════════
  const EventDetectionBanner = () => {
    if (!eventDetection?.detected || eventDetection.eventId) return null;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="mx-3 mb-2 p-2.5 rounded-xl bg-violet-600/10 border border-violet-500/30"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
          <p className="text-[11px] text-violet-300 flex-1">Detected: {eventDetection.description} Create Event →</p>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 px-2 text-[10px] text-violet-400 hover:text-violet-300 hover:bg-violet-600/20"
            onClick={createEventFromDetection}
            disabled={!!loadingAction === true}
          >
            {loadingAction === 'create-event' ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Create'}
          </Button>
          <button onClick={() => setEventDetection(null)}>
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        </div>
      </motion.div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // AI AUTO-REPLY SUGGESTIONS
  // ═══════════════════════════════════════════════════════════════
  const AutoReplySuggestions = () => {
    if (!showAutoReplies || autoReplies.length === 0) return null;
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="mx-3 mb-2"
        >
          <div className="flex items-center gap-1 mb-1">
            <Bot className="w-3 h-3 text-violet-400" />
            <span className="text-[10px] text-muted-foreground">AI Suggested Replies</span>
            <button onClick={() => setShowAutoReplies(false)} className="ml-auto">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
          <div className="flex flex-col gap-1">
            {autoReplies.map((reply, i) => (
              <button
                key={i}
                onClick={() => {
                  setMsgInput(reply);
                  setShowAutoReplies(false);
                }}
                className="text-left px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 hover:border-violet-500/50 hover:bg-violet-600/10 transition-all text-[12px] text-foreground"
              >
                <Sparkles className="w-3 h-3 text-violet-400 inline mr-1.5" />
                {reply}
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // CHAT TOOLBAR (plus button actions)
  // ═══════════════════════════════════════════════════════════════
  const ChatToolbar = () => {
    const toolbarActions = [
      { icon: Image, label: 'Album', color: 'text-pink-400', onClick: async () => { try { const res = await fetch('/api/albums'); const data = await res.json(); setAlbums(Array.isArray(data) ? data : []); } catch { setAlbums([]); } setShowAlbumPicker(true); }},
      { icon: MapPin, label: 'Location', color: 'text-amber-400', onClick: () => setShowLocationPicker(true) },
      { icon: Mic, label: 'Voice', color: 'text-cyan-400', onClick: startRecording },
      { icon: Vote, label: 'Poll', color: 'text-violet-400', onClick: () => setShowCreatePollModal(true) },
      { icon: Timer, label: 'Schedule', color: 'text-orange-400', onClick: () => setShowScheduleModal(true) },
      { icon: Phone, label: 'Call', color: 'text-emerald-400', onClick: () => setShowCallModal(true) },
    ];
    return (
      <AnimatePresence>
        {showToolbar && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-card overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-2 p-3">
              {toolbarActions.map((action, i) => (
                <button
                  key={i}
                  onClick={() => { action.onClick(); setShowToolbar(false); }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-secondary transition-colors"
                >
                  <div className={`p-2 rounded-full bg-secondary ${action.color}`}>
                    <action.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">{action.label}</span>
                </button>
              ))}
            </div>
            {/* Disappearing messages picker */}
            <div className="px-3 pb-3">
              <div className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-[10px] text-muted-foreground">Disappearing:</span>
                <div className="flex gap-1">
                  {DISAPPEAR_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setShowDisappearingTimer(showDisappearingTimer === opt.value ? null : opt.value)}
                      className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${showDisappearingTimer === opt.value ? 'bg-orange-600 text-white border-orange-600' : 'border-border text-muted-foreground hover:border-orange-500/50'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // CHAT INPUT
  // ═══════════════════════════════════════════════════════════════
  const ChatInput = () => {
    return (
      <div className="border-t border-border shrink-0 bg-card">
        {/* Recording UI */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 border-b border-border bg-red-950/30 flex items-center gap-3"
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[12px] text-red-400">Recording</span>
              <span className="text-[14px] font-mono text-foreground">{formatDuration(recordingDuration)}</span>
              <div className="flex-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={stopRecording}>
                <MicOff className="w-4 h-4 text-red-400" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reply bar */}
        <AnimatePresence>
          {replyingTo && <ReplyQuote msg={replyingTo} />}
        </AnimatePresence>

        {/* Disappearing timer badge */}
        {showDisappearingTimer && (
          <div className="px-4 py-1 bg-orange-950/30 flex items-center gap-2">
            <Timer className="w-3 h-3 text-orange-400" />
            <span className="text-[10px] text-orange-400">Disappearing: {showDisappearingTimer}</span>
            <button onClick={() => setShowDisappearingTimer(null)} className="ml-auto">
              <X className="w-3 h-3 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Search bar */}
        <AnimatePresence>
          {showChatSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-2 border-b border-border flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="h-8 text-[12px] bg-transparent border-0 focus-visible:ring-0 px-0"
                autoFocus
              />
              {chatSearchQuery && (
                <span className="text-[10px] text-muted-foreground shrink-0">{displayMessages.length} found</span>
              )}
              <button onClick={() => { setShowChatSearch(false); setChatSearchQuery(''); }}>
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main input row */}
        <div className="px-3 py-2 flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 shrink-0 text-muted-foreground transition-colors ${showToolbar ? 'bg-secondary text-foreground' : ''}`}
                  onClick={() => setShowToolbar(!showToolbar)}
                >
                  <Plus className={`w-5 h-5 transition-transform ${showToolbar ? 'rotate-45' : ''}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>More</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Input
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isRecording ? '' : 'Type a message...'}
            className="flex-1 h-9 text-[13px] bg-secondary border-border"
            disabled={isRecording}
          />

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-9 w-9 shrink-0 ${isRecording ? 'bg-red-600 text-white hover:bg-red-700' : 'text-muted-foreground'}`}
                  onMouseDown={startRecording}
                  onMouseUp={stopRecording}
                  onTouchStart={startRecording}
                  onTouchEnd={stopRecording}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isRecording ? 'Release to send' : 'Hold to record'}</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            size="icon"
            className="h-9 w-9 shrink-0 bg-primary text-primary-foreground"
            onClick={handleSend}
            disabled={!msgInput.trim() && !isRecording}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // MODALS
  // ═══════════════════════════════════════════════════════════════

  // Album Picker Modal
  const AlbumPickerModal = () => (
    <Dialog open={showAlbumPicker} onOpenChange={setShowAlbumPicker}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share Album</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-64 overflow-y-auto">
          <div className="space-y-2">
            {albums.map((album: any) => (
              <button
                key={album.id}
                onClick={async () => {
                  setSelectedAlbum(album);
                  try {
                    await fetch('/api/chat/album-share', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct', albumId: album.id }),
                    });
                  } catch { /* silent */ }
                  setShowAlbumPicker(false);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${selectedAlbum?.id === album.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
              >
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-[12px] font-medium text-foreground">{album.name}</p>
                  <p className="text-[10px] text-muted-foreground">{album._count?.photos || 0} photos</p>
                </div>
              </button>
            ))}
            {albums.length === 0 && <p className="text-center text-[12px] text-muted-foreground py-4">No albums found</p>}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  // Location Picker Modal
  const LocationPickerModal = () => (
    <Dialog open={showLocationPicker} onOpenChange={setShowLocationPicker}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Share Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="h-40 rounded-lg bg-secondary border border-border flex items-center justify-center relative overflow-hidden">
            <Navigation className="w-8 h-8 text-muted-foreground" />
            <div className="absolute bottom-2 left-2 right-2">
              <Input
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Location name (e.g. Central Park)"
                className="h-8 text-[12px] bg-card/90 border-border"
              />
            </div>
          </div>
          <Button
            onClick={async () => {
              try {
                await fetch('/api/chat/location', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ receiverId: otherUserId, chatType: isGroup ? 'group' : 'direct', lat: 40.758, lng: -73.985, name: locationName || 'My Location' }),
                });
              } catch { /* silent */ }
              setShowLocationPicker(false);
              setLocationName('');
            }}
            className="w-full"
            disabled={loadingAction === 'location'}
          >
            {loadingAction === 'location' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MapPin className="w-4 h-4 mr-2" />}
            Share Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Poll Create Modal
  const PollCreateModal = () => (
    <Dialog open={showCreatePollModal} onOpenChange={setShowCreatePollModal}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create Poll</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="text-[13px] bg-secondary border-border"
          />
          <div className="space-y-2">
            {pollOptions.map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollOptions];
                    next[i] = e.target.value;
                    setPollOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="text-[12px] bg-secondary border-border"
                />
                {pollOptions.length > 2 && (
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => setPollOptions(pollOptions.filter((_, j) => j !== i))}>
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            ))}
            {pollOptions.length < 5 && (
              <Button variant="ghost" size="sm" className="text-[11px] text-muted-foreground" onClick={() => setPollOptions([...pollOptions, ''])}>
                + Add Option
              </Button>
            )}
          </div>
          <Button onClick={createPoll} className="w-full" disabled={!pollQuestion || pollOptions.filter(Boolean).length < 2 || !!loadingAction}>
            {loadingAction === 'poll' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Vote className="w-4 h-4 mr-2" />}
            Create Poll
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Schedule Message Modal
  const ScheduleMessageModal = () => (
    <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Schedule Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Textarea
            value={msgInput}
            onChange={(e) => setMsgInput(e.target.value)}
            placeholder="Message content..."
            className="text-[13px] bg-secondary border-border min-h-[80px]"
          />
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1 block">Date</Label>
              <Input
                type="date"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                className="text-[12px] bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground mb-1 block">Time</Label>
              <Input
                type="time"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
                className="text-[12px] bg-secondary border-border"
              />
            </div>
          </div>
          <Button onClick={sendScheduledMessage} className="w-full" disabled={!msgInput || !scheduleDate || !scheduleTime || !!loadingAction}>
            {loadingAction === 'schedule' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Timer className="w-4 h-4 mr-2" />}
            Schedule
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Forward Message Modal
  const ForwardMessageModal = () => (
    <Dialog open={showForwardModal} onOpenChange={(open) => { if (!open) { setShowForwardModal(false); setForwardMessage(null); setForwardTarget(''); } }}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Forward Message</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {forwardMessage && (
            <div className="p-2 rounded-lg bg-secondary border border-border">
              <p className="text-[11px] text-muted-foreground mb-0.5">From: {forwardMessage.sender?.displayName}</p>
              <p className="text-[12px] text-foreground line-clamp-2">{forwardMessage.content}</p>
            </div>
          )}
          <ScrollArea className="max-h-48 overflow-y-auto">
            <div className="space-y-1">
              {conversationsForForward.map((convo: Conversation) => (
                <button
                  key={convo.otherUser.id}
                  onClick={() => setForwardTarget(convo.otherUser.id)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors ${forwardTarget === convo.otherUser.id ? 'bg-primary/10 border border-primary/50' : 'hover:bg-secondary'}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getAvatar(convo.otherUser)} />
                    <AvatarFallback className="text-[10px]">{convo.otherUser.displayName?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-[12px] text-foreground">{convo.otherUser.displayName}</span>
                </button>
              ))}
              {conversationsForForward.length === 0 && <p className="text-center text-[12px] text-muted-foreground py-4">No conversations</p>}
            </div>
          </ScrollArea>
          <Button onClick={forwardMessageAction} className="w-full" disabled={!forwardTarget || !!loadingAction}>
            {loadingAction === 'forward' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Forward className="w-4 h-4 mr-2" />}
            Forward
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Call Modal
  const CallModal = () => (
    <Dialog open={showCallModal} onOpenChange={setShowCallModal}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground">Start Call</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => createCallLink('voice')}
            className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border hover:border-emerald-500/50 hover:bg-emerald-600/5 transition-all"
          >
            <div className="p-3 rounded-full bg-emerald-600/20">
              <Phone className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-[12px] font-medium text-foreground">Voice Call</span>
          </button>
          <button
            onClick={() => createCallLink('video')}
            className="flex flex-col items-center gap-2 p-6 rounded-xl border border-border hover:border-violet-500/50 hover:bg-violet-600/5 transition-all"
          >
            <div className="p-3 rounded-full bg-violet-600/20">
              <Video className="w-6 h-6 text-violet-400" />
            </div>
            <span className="text-[12px] font-medium text-foreground">Video Call</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );

  // AI Summary Modal
  const AiSummaryModal = () => (
    <Dialog open={showAiSummary} onOpenChange={setShowAiSummary}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" /> AI Conversation Summary
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-[80px]">
          {summaryLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
            </div>
          ) : (
            <p className="text-[13px] text-foreground leading-relaxed">{aiSummary}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Meetup Suggestions Modal
  const MeetupSuggestionsModal = () => (
    <Dialog open={showMeetupSuggestions} onOpenChange={setShowMeetupSuggestions}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" /> Suggested Meetup Spots
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-72 overflow-y-auto">
          {meetupLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            </div>
          ) : meetupSuggestions.length > 0 ? (
            <div className="space-y-2">
              {meetupSuggestions.map((venue: any, i: number) => (
                <div key={i} className="p-3 rounded-xl border border-border hover:border-amber-500/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground">{venue.name}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{venue.description}</p>
                      {venue.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-400" />
                          <span className="text-[10px] text-muted-foreground">{venue.rating}</span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] shrink-0 border-amber-500/50 text-amber-400 hover:bg-amber-600/10">
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[12px] text-muted-foreground py-8">No suggestions available</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  // Media Gallery Modal
  const MediaGalleryModal = () => (
    <Dialog open={showChatMediaGallery} onOpenChange={setShowChatMediaGallery}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-foreground">Shared Media</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96 overflow-y-auto">
          {mediaGalleryItems.length > 0 ? (
            <div className="grid grid-cols-3 gap-1">
              {mediaGalleryItems.map((msg) => (
                <div key={msg.id} className={`aspect-square rounded-lg bg-secondary ${nsfwFilter ? 'blur-sm hover:blur-none transition-all cursor-pointer' : ''} flex items-center justify-center`}
                  onClick={() => nsfwFilter && revealImage(msg.id)}
                >
                  <div className="text-center">
                    {msg.type === 'video' ? <Video className="w-6 h-6 text-muted-foreground mx-auto" aria-hidden="true" /> : <ImageIcon className="w-6 h-6 text-muted-foreground mx-auto" aria-hidden="true" />}
                    <p className="text-[8px] text-muted-foreground mt-1 px-1 truncate">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-[12px] text-muted-foreground py-8">No shared media</p>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );

  // Chat Theme Modal
  const ChatThemeModal = () => (
    <Dialog open={showThemeModal} onOpenChange={setShowThemeModal}>
      <DialogContent className="bg-card border-border max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <Palette className="w-4 h-4 text-violet-400" /> Chat Theme
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {CHAT_THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setChatTheme(t.id); setShowThemeModal(false); }}
              className={`p-3 rounded-xl border-2 transition-all ${chatTheme === t.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}
            >
              <div className="flex gap-2 mb-2">
                <div className={`w-6 h-4 rounded ${t.ownBg}`} />
                <div className={`w-6 h-4 rounded ${t.otherBg} border ${t.otherBorder}`} />
              </div>
              <p className="text-[11px] text-foreground font-medium">{t.label}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Message Stats Modal
  const MessageStatsModal = () => {
    const stats = getStats();
    return (
      <Dialog open={showStatsModal} onOpenChange={setShowStatsModal}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" /> Message Stats
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-secondary border border-border text-center">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-[10px] text-muted-foreground">Total Messages</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border text-center">
                <p className="text-2xl font-bold text-foreground">{stats.totalChars}</p>
                <p className="text-[10px] text-muted-foreground">Characters</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border text-center">
                <p className="text-2xl font-bold text-primary">{stats.mine}</p>
                <p className="text-[10px] text-muted-foreground">Your Messages</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary border border-border text-center">
                <p className="text-2xl font-bold text-amber-400">{stats.theirs}</p>
                <p className="text-[10px] text-muted-foreground">Their Messages</p>
              </div>
            </div>
            <Separator className="bg-border" />
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">Avg Response Time</span>
              <span className="text-[12px] font-medium text-foreground">{stats.avgRespTime}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  // Safe Mode Overlay (#29)
  const SafeModeOverlay = () => (
    <AnimatePresence>
      {showSafeWord && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-red-900 flex flex-col items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="text-center"
          >
            <ShieldAlert className="w-20 h-20 text-red-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">SAFE MODE</h1>
            <h2 className="text-xl text-red-200 mb-6">ACTIVATED</h2>
            <p className="text-sm text-red-300">Clearing chat and returning to list...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <TooltipProvider>
      <div className="h-full flex flex-col relative" onContextMenu={(e) => {
        // Only show stats on long press in empty area (not on a message)
        if ((e.target as HTMLElement).closest('[data-message]')) return;
      }}>
        {/* Chat Header */}
        <ChatHeader />

        {/* Pinned Messages Bar */}
        <PinnedMessagesBar />

        {/* Message List */}
        <ScrollArea className="flex-1" ref={scrollContainerRef}>
          <div className="px-3 py-4 space-y-2">
            {displayMessages.length === 0 && !showChatSearch && (
              <div className="flex flex-col items-center justify-center py-12">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-[13px] text-muted-foreground">
                  {showChatSearch ? 'No messages found' : 'No messages yet. Say hello!'}
                </p>
              </div>
            )}

            {displayMessages.map((msg) => (
              <div key={msg.id} data-message="true">
                <MessageBubble msg={msg} />
              </div>
            ))}

            {/* Typing indicator */}
            <TypingIndicator />

            <div ref={msgEndRef} />
          </div>
        </ScrollArea>

        {/* Event Detection Banner */}
        <EventDetectionBanner />

        {/* AI Auto-Reply Suggestions */}
        <AutoReplySuggestions />

        {/* Chat Toolbar */}
        <ChatToolbar />

        {/* Chat Input */}
        <ChatInput />

        {/* Quick Context Card (group chat) */}
        <QuickContextCardComp />

        {/* Safe Mode Overlay */}
        <SafeModeOverlay />

        {/* ═══ ALL MODALS ═══ */}
        <AlbumPickerModal />
        <LocationPickerModal />
        <PollCreateModal />
        <ScheduleMessageModal />
        <ForwardMessageModal />
        <CallModal />
        <AiSummaryModal />
        <MeetupSuggestionsModal />
        <MediaGalleryModal />
        <ChatThemeModal />
        <MessageStatsModal />

        {/* Long-press empty area → stats (mobile) */}
        <div
          className="hidden"
          onContextMenu={(e) => { e.preventDefault(); setShowStatsModal(true); }}
          onTouchStart={() => { /* handled by empty area long press */ }}
        />
      </div>
    </TooltipProvider>
  );
}
