import { create } from 'zustand';
import type { User, TabId, Message, Conversation, ChatRequest, Shout, UserFavorite, UserNote, Blog, Video, Banner, ProfileField, ChatSortMode, ChatAIAnalysis } from '@/types';

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  selectedUserId: string | null;
  setSelectedUserId: (id: string | null) => void;
  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;
  showProfileDrawer: boolean;
  setShowProfileDrawer: (show: boolean) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  showRizzModal: boolean;
  setShowRizzModal: (show: boolean) => void;
  rizzTargetBio: string;
  setRizzTargetBio: (bio: string) => void;
  conversations: Conversation[];
  setConversations: (convos: Conversation[]) => void;
  activeConversation: Conversation | null;
  setActiveConversation: (convo: Conversation | null) => void;
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;
  refreshDiscover: number;
  triggerRefreshDiscover: () => void;
  discoverView: 'grid' | 'cascade';
  setDiscoverView: (view: 'grid' | 'cascade') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  chatRequests: ChatRequest[];
  setChatRequests: (reqs: ChatRequest[]) => void;
  pendingRequestCount: number;
  setPendingRequestCount: (n: number) => void;
  shouts: Shout[];
  setShouts: (s: Shout[]) => void;
  addShout: (s: Shout) => void;
  favorites: UserFavorite[];
  setFavorites: (f: UserFavorite[]) => void;
  notes: UserNote[];
  setNotes: (n: UserNote[]) => void;
  blogs: Blog[];
  setBlogs: (b: Blog[]) => void;
  videos: Video[];
  setVideos: (v: Video[]) => void;
  banners: Banner[];
  setBanners: (b: Banner[]) => void;
  userLat: number | null;
  setUserLat: (l: number | null) => void;
  userLng: number | null;
  setUserLng: (l: number | null) => void;
  geoMode: string;
  setGeoMode: (m: string) => void;
  geoName: string;
  setGeoName: (n: string) => void;
  agendaView: string;
  setAgendaView: (v: string) => void;
  agendaFilter: string;
  setAgendaFilter: (f: string) => void;
  mapFilter: string;
  setMapFilter: (f: string) => void;
  mapHidden: boolean;
  setMapHidden: (h: boolean) => void;
  activeSubPage: string | null;
  setActiveSubPage: (p: string | null) => void;
  inferResults: any[];
  setInferResults: (r: any[]) => void;
  inferLoading: boolean;
  setInferLoading: (l: boolean) => void;
  groups: any[];
  setGroups: (g: any[]) => void;
  allAlbums: any[];
  setAllAlbums: (a: any[]) => void;
  footprints: any[];
  setFootprints: (f: any[]) => void;
  allBoosts: any[];
  setAllBoosts: (b: any[]) => void;
  profileViews: any[];
  setProfileViews: (v: any[]) => void;
  // Chat features
  chatTheme: string;
  setChatTheme: (t: string) => void;
  nsfwFilter: boolean;
  setNsfwFilter: (f: boolean) => void;
  typingUsers: Record<string, boolean>;
  setTypingUsers: (t: Record<string, boolean>) => void;
  chatSearchQuery: string;
  setChatSearchQuery: (q: string) => void;
  showChatMediaGallery: boolean;
  setShowChatMediaGallery: (s: boolean) => void;
  showChatSearch: boolean;
  setShowChatSearch: (s: boolean) => void;
  replyingTo: Message | null;
  setReplyingTo: (m: Message | null) => void;
  showDisappearingTimer: string | null;
  setShowDisappearingTimer: (t: string | null) => void;
  showScheduleModal: boolean;
  setShowScheduleModal: (s: boolean) => void;
  showForwardModal: boolean;
  setShowForwardModal: (s: boolean) => void;
  forwardMessage: Message | null;
  setForwardMessage: (m: Message | null) => void;
  showCreatePollModal: boolean;
  setShowCreatePollModal: (s: boolean) => void;
  showAlbumPicker: boolean;
  setShowAlbumPicker: (s: boolean) => void;
  showLocationPicker: boolean;
  setShowLocationPicker: (s: boolean) => void;
  showCallModal: boolean;
  setShowCallModal: (s: boolean) => void;
  callType: 'voice' | 'video';
  setCallType: (t: 'voice' | 'video') => void;
  showAiSummary: boolean;
  setShowAiSummary: (s: boolean) => void;
  aiSummary: string;
  setAiSummary: (s: string) => void;
  showAutoReplies: boolean;
  setShowAutoReplies: (s: boolean) => void;
  autoReplies: string[];
  setAutoReplies: (r: string[]) => void;
  showMeetupSuggestions: boolean;
  setShowMeetupSuggestions: (s: boolean) => void;
  meetupSuggestions: any[];
  setMeetupSuggestions: (s: any[]) => void;
  showSafeWord: boolean;
  setShowSafeWord: (s: boolean) => void;
  isRecording: boolean;
  setIsRecording: (r: boolean) => void;
  recordingDuration: number;
  setRecordingDuration: (d: number) => void;
  messageContextAction: string | null;
  setMessageContextAction: (a: string | null) => void;
  contextMessageId: string | null;
  setContextMessageId: (id: string | null) => void;
  // Profile fields (kinks/sexual/interests)
  profileFields: Record<string, string>;
  setProfileFields: (f: Record<string, string>) => void;
  updateProfileField: (key: string, value: string) => void;
  // Chat sort mode
  chatSortMode: ChatSortMode;
  setChatSortMode: (m: ChatSortMode) => void;
  // AI analyses per conversation
  chatAnalyses: Record<string, ChatAIAnalysis>;
  setChatAnalyses: (a: Record<string, ChatAIAnalysis>) => void;
  // Kinks view tab
  kinksViewTab: string;
  setKinksViewTab: (t: string) => void;
  // Intent filter for discover/chat
  intentFilter: string;
  setIntentFilter: (f: string) => void;
  // PWA install prompt
  pwaInstallPrompt: any;
  setPwaInstallPrompt: (p: any) => void;
  isPwaInstalled: boolean;
  setIsPwaInstalled: (i: boolean) => void;
  // Online status
  isOnline: boolean;
  setIsOnline: (o: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  activeTab: 'discover',
  setActiveTab: (tab) => set({ activeTab: tab, showSettings: false }),
  selectedUserId: null,
  setSelectedUserId: (id) => set({ selectedUserId: id, showProfileDrawer: id !== null }),
  selectedGroupId: null,
  setSelectedGroupId: (id) => set({ selectedGroupId: id }),
  showProfileDrawer: false,
  setShowProfileDrawer: (show) => set({ showProfileDrawer: show, selectedUserId: show ? undefined : null } as any),
  showSettings: false,
  setShowSettings: (show) => set({ showSettings: show }),
  showRizzModal: false,
  setShowRizzModal: (show) => set({ showRizzModal: show }),
  rizzTargetBio: '',
  setRizzTargetBio: (bio) => set({ rizzTargetBio: bio }),
  conversations: [],
  setConversations: (convos) => set({ conversations: convos }),
  activeConversation: null,
  setActiveConversation: (convo) => set({ activeConversation: convo }),
  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  refreshDiscover: 0,
  triggerRefreshDiscover: () => set((s) => ({ refreshDiscover: s.refreshDiscover + 1 })),
  discoverView: 'grid',
  setDiscoverView: (view) => set({ discoverView: view }),
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  chatRequests: [],
  setChatRequests: (reqs) => set({ chatRequests: reqs }),
  pendingRequestCount: 0,
  setPendingRequestCount: (n) => set({ pendingRequestCount: n }),
  shouts: [],
  setShouts: (s) => set({ shouts: s }),
  addShout: (s) => set((st) => ({ shouts: [s, ...st.shouts] })),
  favorites: [],
  setFavorites: (f) => set({ favorites: f }),
  notes: [],
  setNotes: (n) => set({ notes: n }),
  blogs: [],
  setBlogs: (b) => set({ blogs: b }),
  videos: [],
  setVideos: (v) => set({ videos: v }),
  banners: [],
  setBanners: (b) => set({ banners: b }),
  userLat: null,
  setUserLat: (l) => set({ userLat: l }),
  userLng: null,
  setUserLng: (l) => set({ userLng: l }),
  geoMode: 'auto',
  setGeoMode: (m) => set({ geoMode: m }),
  geoName: '',
  setGeoName: (n) => set({ geoName: n }),
  agendaView: 'list',
  setAgendaView: (v) => set({ agendaView: v }),
  agendaFilter: 'all',
  setAgendaFilter: (f) => set({ agendaFilter: f }),
  mapFilter: 'all',
  setMapFilter: (f) => set({ mapFilter: f }),
  mapHidden: false,
  setMapHidden: (h) => set({ mapHidden: h }),
  activeSubPage: null,
  setActiveSubPage: (p) => set({ activeSubPage: p }),
  inferResults: [],
  setInferResults: (r) => set({ inferResults: r }),
  inferLoading: false,
  setInferLoading: (l) => set({ inferLoading: l }),
  groups: [],
  setGroups: (g) => set({ groups: g }),
  allAlbums: [],
  setAllAlbums: (a) => set({ allAlbums: a }),
  footprints: [],
  setFootprints: (f) => set({ footprints: f }),
  allBoosts: [],
  setAllBoosts: (b) => set({ allBoosts: b }),
  profileViews: [],
  setProfileViews: (v) => set({ profileViews: v }),
  chatTheme: 'default',
  setChatTheme: (t) => set({ chatTheme: t }),
  nsfwFilter: false,
  setNsfwFilter: (f) => set({ nsfwFilter: f }),
  typingUsers: {},
  setTypingUsers: (t) => set({ typingUsers: t }),
  chatSearchQuery: '',
  setChatSearchQuery: (q) => set({ chatSearchQuery: q }),
  showChatMediaGallery: false,
  setShowChatMediaGallery: (s) => set({ showChatMediaGallery: s }),
  showChatSearch: false,
  setShowChatSearch: (s) => set({ showChatSearch: s }),
  replyingTo: null,
  setReplyingTo: (m) => set({ replyingTo: m }),
  showDisappearingTimer: null,
  setShowDisappearingTimer: (t) => set({ showDisappearingTimer: t }),
  showScheduleModal: false,
  setShowScheduleModal: (s) => set({ showScheduleModal: s }),
  showForwardModal: false,
  setShowForwardModal: (s) => set({ showForwardModal: s }),
  forwardMessage: null,
  setForwardMessage: (m) => set({ forwardMessage: m }),
  showCreatePollModal: false,
  setShowCreatePollModal: (s) => set({ showCreatePollModal: s }),
  showAlbumPicker: false,
  setShowAlbumPicker: (s) => set({ showAlbumPicker: s }),
  showLocationPicker: false,
  setShowLocationPicker: (s) => set({ showLocationPicker: s }),
  showCallModal: false,
  setShowCallModal: (s) => set({ showCallModal: s }),
  callType: 'voice',
  setCallType: (t) => set({ callType: t }),
  showAiSummary: false,
  setShowAiSummary: (s) => set({ showAiSummary: s }),
  aiSummary: '',
  setAiSummary: (s) => set({ aiSummary: s }),
  showAutoReplies: false,
  setShowAutoReplies: (s) => set({ showAutoReplies: s }),
  autoReplies: [],
  setAutoReplies: (r) => set({ autoReplies: r }),
  showMeetupSuggestions: false,
  setShowMeetupSuggestions: (s) => set({ showMeetupSuggestions: s }),
  meetupSuggestions: [],
  setMeetupSuggestions: (s) => set({ meetupSuggestions: s }),
  showSafeWord: false,
  setShowSafeWord: (s) => set({ showSafeWord: s }),
  isRecording: false,
  setIsRecording: (r) => set({ isRecording: r }),
  recordingDuration: 0,
  setRecordingDuration: (d) => set({ recordingDuration: d }),
  messageContextAction: null,
  setMessageContextAction: (a) => set({ messageContextAction: a }),
  contextMessageId: null,
  setContextMessageId: (id) => set({ contextMessageId: id }),
  // Profile fields
  profileFields: {},
  setProfileFields: (f) => set({ profileFields: f }),
  updateProfileField: (key, value) => set((s) => ({ profileFields: { ...s.profileFields, [key]: value } })),
  // Chat sort
  chatSortMode: 'recent',
  setChatSortMode: (m) => set({ chatSortMode: m }),
  // AI analyses
  chatAnalyses: {},
  setChatAnalyses: (a) => set({ chatAnalyses: a }),
  // Kinks view
  kinksViewTab: 'bedroom',
  setKinksViewTab: (t) => set({ kinksViewTab: t }),
  // Intent filter
  intentFilter: 'all',
  setIntentFilter: (f) => set({ intentFilter: f }),
  // PWA
  pwaInstallPrompt: null,
  setPwaInstallPrompt: (p) => set({ pwaInstallPrompt: p }),
  isPwaInstalled: false,
  setIsPwaInstalled: (i) => set({ isPwaInstalled: i }),
  // Online
  isOnline: true,
  setIsOnline: (o) => set({ isOnline: o }),
}));
