import { create } from 'zustand';
import type { User, TabId, Message, Conversation, ChatRequest, Shout, UserFavorite, UserNote, Blog, Video, Banner } from '@/types';

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
  // New from OMOLINK
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
  // GEO
  geoMode: string;
  setGeoMode: (m: string) => void;
  geoName: string;
  setGeoName: (n: string) => void;
  // Agenda/Events
  agendaView: string;
  setAgendaView: (v: string) => void;
  agendaFilter: string;
  setAgendaFilter: (f: string) => void;
  // Map filters
  mapFilter: string;
  setMapFilter: (f: string) => void;
  mapHidden: boolean;
  setMapHidden: (h: boolean) => void;
  // Active sub-page (for navigating within More tab)
  activeSubPage: string | null;
  setActiveSubPage: (p: string | null) => void;
  // Infer results
  inferResults: any[];
  setInferResults: (r: any[]) => void;
  inferLoading: boolean;
  setInferLoading: (l: boolean) => void;
  // Groups
  groups: any[];
  setGroups: (g: any[]) => void;
  // Albums (full list)
  allAlbums: any[];
  setAllAlbums: (a: any[]) => void;
  // Footprints
  footprints: any[];
  setFootprints: (f: any[]) => void;
  // Boosts (all)
  allBoosts: any[];
  setAllBoosts: (b: any[]) => void;
  // Profile views received
  profileViews: any[];
  setProfileViews: (v: any[]) => void;
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
  // New
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
  // GEO
  geoMode: 'auto',
  setGeoMode: (m) => set({ geoMode: m }),
  geoName: '',
  setGeoName: (n) => set({ geoName: n }),
  // Agenda/Events
  agendaView: 'list',
  setAgendaView: (v) => set({ agendaView: v }),
  agendaFilter: 'all',
  setAgendaFilter: (f) => set({ agendaFilter: f }),
  // Map filters
  mapFilter: 'all',
  setMapFilter: (f) => set({ mapFilter: f }),
  mapHidden: false,
  setMapHidden: (h) => set({ mapHidden: h }),
  // Active sub-page (for navigating within More tab)
  activeSubPage: null,
  setActiveSubPage: (p) => set({ activeSubPage: p }),
  // Infer results
  inferResults: [],
  setInferResults: (r) => set({ inferResults: r }),
  inferLoading: false,
  setInferLoading: (l) => set({ inferLoading: l }),
  // Groups
  groups: [],
  setGroups: (g) => set({ groups: g }),
  // Albums (full list)
  allAlbums: [],
  setAllAlbums: (a) => set({ allAlbums: a }),
  // Footprints
  footprints: [],
  setFootprints: (f) => set({ footprints: f }),
  // Boosts (all)
  allBoosts: [],
  setAllBoosts: (b) => set({ allBoosts: b }),
  // Profile views received
  profileViews: [],
  setProfileViews: (v) => set({ profileViews: v }),
}));
