# ReverseAPK Comprehensive Analysis — 4 Dating APKs

> Generated: 2026-08-13 via ReverseAPK v1.2 (macOS port)
> APKs: Omolink, Grindr, Romeo, Rizz

---

## 1. OMOLINK v6.11.510

### Package: `com.rheanet.dating.kedoya`
### Type: **Capacitor Hybrid App** (Ionic Angular frontend)
### Java Files: 5,173

### Firebase Config
| Key | Value |
|-----|-------|
| project_id | `omolink-8278d` |
| gcm_sender_id | `755864679348` |
| google_api_key | `AIzaSyBy2IW-s_racoAW8fDm3Z51nPkM8SJHtIw` |
| google_app_id | `1:755864679348:android:14ee106f52b16cbdc9b8e1` |
| google_storage_bucket | `omolink-8278d.appspot.com` |

### Capacitor Plugins (16)
- `@capacitor-community/privacy-screen` — app screenshot protection
- `@capacitor/app` — lifecycle
- `@capacitor/app-launcher`
- `@capacitor/browser` — external links
- `@capacitor/camera` — photo capture
- `@capacitor/clipboard`
- `@capacitor/device`
- `@capacitor/geolocation` — GPS
- `@capacitor/haptics` — vibration feedback
- `@capacitor/keyboard`
- `@capacitor/local-notifications`
- `@capacitor/network` — connectivity
- `@capacitor/push-notifications` — FCM
- `@capacitor/share`
- `@capacitor/status-bar`
- `capacitor-check-ismock-location` — anti-spoofing

### API Methods (70+)
```
app, banner_search, banner_storage, banner_update, blog_listing, blog_load,
checkin, debuglog, DELETE, email, fansite_load, fansite_search,
fansite_update, faq_listing, faq_load, fcm, GET, group_message_delete,
group_message, group_messages, group_search, group_unreads_load,
group_update, group_user_role, group_user, group_users, home, login,
logout, meetnow2, message_emoji, message_ephemeral, message_recall,
message_search, message_send, message_translate, message_update,
myagenda, nick, password, PATCH, pinned, POST, profesional,
profiles_views, PUT, rating_app, register, remind, sessions,
shout_load, shout_search, shout_update, sideload, sites, slabs,
storage, subscriptions, thread_delete, thread_images, thread_search,
tools, unreads_load, unregister, update, user_block, user_favorite,
user_hidden, user_hotpics_query, user_hotpics_response, user_known,
user_load, user_map, user_notes, user_private, user_request,
user_search, user_superfav, user_tap, user_unvisit, verify,
video_search, wallet, welcome
```

### Key Features Found
- **Fansite integration** — hornyfans.com redirect system with tracking
- **Social feed** — shouts with likes/comments
- **Group chat** — group messaging with roles
- **Video search** — video content section
- **Blog** — blog system with listings
- **Shop** — merchandise (Mochila oficial MachoBB)
- **LocationIQ** — map search via LocationIQ API
- **OpenStreetMap** — map tiles (no Google Maps)
- **Leaflet** — interactive maps
- **MeetNow** — instant meet feature
- **Multi-site** — supports multiple dating sites on one platform
- **i18n** — full internationalization system
- **Doodle** — promotional banners/prompts
- **Wallet** — virtual currency
- **Subscriptions** — membership tiers
- **Sessions** — session management

### Social Links
- hornyfans.com, instagram.com, tiktok.com, twitter.com, t.me (Telegram), wa.me (WhatsApp)

### Backend Architecture
- Custom PHP API (not REST, uses `method` parameter)
- Session-based auth (`sid` parameter)
- Auth tokens (`auth_token`)
- Image transforms via backend

---

## 2. GRINDR 7.5.0

### Package: `com.grindrapp.android`
### Type: **Native Android** (Kotlin)
### Java Files: 11,721

### Firebase Config
| Key | Value |
|-----|-------|
| project_id | `api-project-1036042917246` |
| gcm_sender_id | `1036042917246` |
| google_api_key | `AIzaSyDD5Ceh8j-a6Xw2R_seA7d5FZ5W09PcGkI` |
| google_app_id | `1:1036042917246:android:93d3725a6ad2a74d` |
| firebase_database_url | `https://api-project-1036042917246.firebaseio.com` |
| google_storage_bucket | `api-project-1036042917246.appspot.com` |

### Architecture
- **XMPP** (Smack library) — real-time chat via `XMPPTCPConnection`
- **WebSocket** — presence/status via `/session/websocket`
- **Room Database** — local SQLite with `GrindrRoomListAdapter`
- **Retrofit** — REST API client
- **OkHttp** — HTTP stack
- **Dagger** — dependency injection
- **Kotlin Coroutines** — async operations

### Key Activities (100+)
| Category | Activities |
|----------|-----------|
| Auth | LoginActivity, LandingActivity, LandingPhoneActivity, LandingEmailActivity, LandingForgotPwdActivity, LandingSMSVerifyActivity, CreateAccountEmailActivity, SMSVerifyActivity, ForgotPasswordActivity, ResetPasswordPhoneActivity, AccountVerifyActivity, ThirdPartyLoginProfileActivity |
| Profile | EditProfileActivity, RegisterProfileActivity, BaseCruiseActivityV2, ExploreCruiseActivityV2, StandaloneCruiseActivityV2, LocalCruiseActivity, PickProfileActivity |
| Chat | ChatActivityV2, ShareToChatActivity, ShareChatMessageActivity, ChatCreateGroupActivity, GroupChatDetailsActivity, BlockedMembersActivity, InviteMembersActivity |
| Media | FullScreenExpiringImageActivity, FullScreenImageActivity, ChatRoomPhotosActivity, CropImageActivity, PhotoDecorationActivity, EditPhotosActivity, PrivateVideoCaptureActivity, PrivateVideoPlayerActivity |
| Video | VideoCallActivity, VideoCallForegroundService, VideoMatchActivity, VideoRouletteActivity, VideoRouletteGuideActivity, VideoCallDialogActivity |
| Settings | SettingsActivity, SettingsDeleteProfileActivity, SettingsDeactivateActivity, NotificationSettingsActivity, DoNotDisturbSettingsActivity, PrivacySettingsActivity, PinSettingsActivity, SetPinActivity, PinLockActivity |
| Subscription | SubscriptionManagementActivity, PurchaseDirectlyActivity, UpgradeConfirmationActivity, BoostBuyActivity, BoostBundleBuyActivity, BoostUseActivity, BoostReportActivity |
| Social | CircleCreateActivity, CircleInviteActivity, EventCalendarActivity, SpotifyActivity |
| Explore | ExploreMapActivity, ExploreCascadeActivity |
| Block/Report | ReportProfileActivity, IndividualUnblockActivity |
| Other | BackupActivity, RestoreActivity, RequestDataActivity, WebViewActivity, DebugToolsActivity |

### Key Business Features
- **Taps** — Grindr's "like" system
- **Favorites** — bookmark profiles
- **Albums** — photo galleries
- **Explore/Cascade** — grid browsing
- **Explore Map** — proximity map
- **Boost** — profile visibility boost (purchasable)
- **XTRA** — premium subscription tier
- **Unlimited** — highest tier
- **Circles** — custom groups of profiles
- **Groups** — group chat
- **Video Call** — 1:1 video calls
- **Video Roulette** — random video chat
- **Spotify** — music integration (song on profile)
- **Fansites** — external link showcase
- **Viewed Me** — who viewed your profile
- **PIN Lock** — app PIN protection
- **Chat Backup** — message export/import
- **Event Calendar** — community events
- **Notes** — private notes on profiles
- **ToDo** — task list
- **Calculator** — (hidden feature)
- **Instagram** — IG connection (debug tool)
- **Do Not Disturb** — silent hours
- **Profile Verification** — photo verification

### Ad Networks (6)
- MoPub, Vungle, Smaato, Fyber/Inneractive, PubNative, Braze/Appboy

### Other Integrations
- **Zendesk** — support center
- **Facebook** — login + tracking
- **Google Sign-In** — OAuth
- **Spotify SDK** — music auth
- **OneTrust** — GDPR consent
- **SafetyNet** — anti-cheat
- **Play Billing v2** — subscriptions

### Chat System
- **XMPP** for real-time messaging
- Individual + Group chat
- Photo sharing in chat
- Audio call messages
- Video call messages
- Expiring/disappearing images
- Message recall/delete
- Chat backup/restore

---

## 3. ROMEO 3.42.0

### Package: `com.planetromeo.android.app`
### Type: **Native Android** (Kotlin + Jetpack Compose)
### Java Files: 15,484

### Firebase Config
| Key | Value |
|-----|-------|
| project_id | `api-project-4760212605` |
| gcm_sender_id | `4760212605` |
| google_api_key | `AIzaSyABrPsJbooKA4JSBdbFwpMi6Etb2uQCFXA` |
| google_app_id | `1:4760212605:android:3c1ae4b2e018f333` |
| firebase_database_url | `https://api-project-4760212605.firebaseio.com` |
| google_storage_bucket | `api-project-4760212605.appspot.com` |

### Architecture
- **Jetpack Compose** — modern UI toolkit
- **gRPC-OkHttp** — protocol buffers communication
- **OkHttp** — HTTP client
- **Room** — local database
- **Firebase Cloud Messaging** — push notifications

### Key Activities (30+)
| Category | Activities |
|----------|-----------|
| Auth | LoginActivity, ActivitySignup, ForgotPasswordActivity, AccountListActivity |
| Profile | ViewProfileActivity, EditProfileActivity, PickProfileActivity, StatsInterviewActivity, ChangeEmailActivity |
| Location | UserLocationActivity, PickLocationActivity, ShowLocationActivity |
| Media | AlbumListActivity, DisplayAlbumActivity, AlbumSelectionActivity, SelectSectionedAlbumActivity, UploadPictureService |
| Billing | BillingActivity, PaymentHistoryActivity, PaymentOrderActivity |
| Social | FootprintsActivity, FriendRequestsActivity, EditContactActivity |
| Travel | SpartacusWebViewActivity (travel/escort feature) |
| Other | DeepLinkActivity, ExitInterviewActivity, TestBedActivity, EditRadarSettingsActivity |

### Key Features
- **Radar** — proximity-based browsing (like Grindr's cascade)
- **Footprints** — visit tracking (who viewed you)
- **Albums** — photo management with sections
- **Friend Requests** — social connections
- **Travel** — travel mode (Spartacus feature)
- **Contacts** — contact management
- **Payment History** — billing transparency
- **Exit Interview** — churn feedback
- **Deep Linking** — URL handling
- **gRPC** — binary protocol for API (not REST)
- **Sectioned Albums** — organized photo galleries

### Chat System
- WebSocket-based (via OkHttp WebSocket)
- Firebase Cloud Messaging for offline delivery
- gRPC for API communication

---

## 4. RIZZ 1.1.8 (com.clovers.rizz)

### Package: `com.clovers.rizz`
### Type: **Expo/React Native** (NOT Capacitor!)
### Java Files: 15,458

### Firebase Config
| Key | Value |
|-----|-------|
| project_id | `rizz-79dde` |
| gcm_sender_id | `181863646776` |
| google_api_key | `AIzaSyD4NG9rJUROlq5fEjZGTTyeRokmgxelbJg` |
| google_app_id | `1:181863646776:android:d8488039db8970ab1b88cd` |
| google_storage_bucket | `rizz-79dde.firebasestorage.app` |

### Architecture (CRITICAL FINDING)
- **Expo/React Native** — NOT Capacitor! This validates Expo as a production framework
- **RevenueCat** — subscription management (not raw Google Play Billing)
- **OkHttp** — HTTP client
- **WebSocket** — real-time chat via OkHttp WebSocket
- **Firebase Cloud Messaging** — push notifications
- **LocationManager** — GPS (Android native)
- **CropImage** — photo editing (canhub/cropper)
- **Expo ImagePicker** — photo selection
- **Expo WebBrowser** — in-app browser

### Key Activities
- `MainActivity` — single activity (React Native pattern)
- `CropImageActivity` — photo cropping
- `ExpoCropImageActivity` — Expo image picker
- `BrowserProxyActivity` — in-app browser
- `ProxyBillingActivity` — Google Play Billing
- `ProxyAmazonBillingActivity` — Amazon IAP (also supports Amazon Appstore!)
- `SimulatedStoreErrorDialogActivity` — testing
- `LicenseActivity` — Pairip license check (DRM)

### Key Findings
- **Expo is production-proven** for dating apps at scale (Rizz 1.1.8 with 15K+ Java files)
- **RevenueCat** simplifies subscription management across platforms
- **Amazon IAP support** — dual store distribution (Google Play + Amazon)
- **Pairip DRM** — license verification
- **WebSocket** for chat (not XMPP, not polling)
- **EXIF data handling** — GPS coordinates stripped/managed from photos
- **Geocoding** — reverse geocoding via Android Geocoder

### Permissions
- INTERNET, ACCESS_NETWORK_STATE, ACCESS_WIFI_STATE
- ACCESS_COARSE_LOCATION (no fine location!)
- CAMERA (implied via image picker)
- READ/WRITE_EXTERNAL_STORAGE
- VIBRATE, WAKE_LOCK
- USE_BIOMETRIC, USE_FINGERPRINT
- SYSTEM_ALERT_WINDOW (overlay)
- ACCESS_ADSERVICES_ATTRIBUTION, ACCESS_ADSERVICES_AD_ID (Privacy Sandbox)

---

## CROSS-APK FEATURE MATRIX

| Feature | Omolink | Grindr | Romeo | Rizz |
|---------|---------|--------|-------|------|
| **Framework** | Capacitor (Ionic Angular) | Native Kotlin | Native Kotlin + Compose | **Expo/React Native** |
| **Chat Protocol** | Custom API polling | XMPP (Smack) | WebSocket + gRPC | **WebSocket** |
| **Real-time** | API polling | XMPP + WebSocket | WebSocket | **WebSocket** |
| **Maps** | OpenStreetMap + Leaflet | Google Maps | Custom radar | **Android Geocoder** |
| **Video Call** | ❌ | ✅ (1:1 + Roulette) | ❌ | ❌ |
| **Group Chat** | ✅ | ✅ (Circles) | ❌ | ❌ |
| **Stories/Feed** | Shouts | ❌ | Footprints | ❌ |
| **Boost** | ❌ | ✅ (purchasable) | ❌ | ❌ |
| **Subscriptions** | ✅ | ✅ (XTRA/Unlimited) | ✅ | ✅ (RevenueCat) |
| **Virtual Currency** | Wallet | ❌ | ❌ | ❌ |
| **Fansites** | ✅ (hornyfans) | ✅ (external links) | ❌ | ❌ |
| **Blog** | ✅ | ❌ | ❌ | ❌ |
| **Events** | ✅ | ✅ (calendar) | ❌ | ❌ |
| **Shop** | ✅ (merch) | ❌ | ❌ | ❌ |
| **Photo Verification** | ❌ | ✅ | ❌ | ❌ |
| **Spotify** | ❌ | ✅ | ❌ | ❌ |
| **PIN Lock** | ❌ | ✅ | ❌ | ✅ (Biometric) |
| **Chat Backup** | ❌ | ✅ | ❌ | ❌ |
| **GDPR/Consent** | ❌ | OneTrust | ❌ | ❌ |
| **Multi-site** | ✅ | ❌ | ❌ | ❌ |
| **i18n** | ✅ (full) | Partial | Partial | ❌ |
| **Ad Networks** | ❌ | 6 networks | ❌ | ❌ (Privacy Sandbox) |
| **Dual Store** | ❌ | ❌ | ❌ | ✅ (Google + Amazon) |

---

## KEY INSIGHTS FOR OMOLINK-NEXTJS

### 1. Architecture Decisions
- Omolink uses **Capacitor** (web app wrapped in native shell) — this is the RIGHT approach for our Next.js rebuild
- **Rizz uses Expo/React Native** — THIS IS THE GOLDEN FINDING. Expo is production-proven for dating apps at scale
- Grindr uses **XMPP** for chat — we should use Supabase Realtime instead (simpler)
- Romeo uses **gRPC** — overkill for our use case
- All apps use **Firebase Cloud Messaging** for push — we need this
- **RevenueCat** (used by Rizz) simplifies cross-platform subscription management

### 2. Features We MUST Implement (from APK analysis)
1. **MeetNow** — instant nearby meet (Grindr's "Right Now")
2. **Fansites** — external link showcase (hornyfans, etc.)
3. **Shouts/Social Feed** — public posts with likes
4. **Group Chat** — group messaging
5. **Video Calls** — 1:1 video (via WebRTC)
6. **Boost** — paid visibility boost
7. **Virtual Currency/Wallet** — in-app purchases
8. **Subscriptions** — tiered membership
9. **Photo Albums** — organized galleries
10. **Blog** — content system
11. **Events** — community events
12. **Map View** — proximity browsing
13. **Search Filters** — advanced filtering
14. **Who Viewed You** — profile visits
15. **Favorites/Bookmarks** — save profiles
16. **Circles** — custom profile groups
17. **Profile Verification** — photo verification
18. **PIN Lock** — app security
19. **Chat Backup** — export/import
20. **Do Not Disturb** — silent hours

### 3. Tech Stack Validation
- ✅ **Expo/React Native** is production-proven for dating apps (Rizz validates this)
- ✅ **Capacitor** also works (Omolink proves it at scale)
- ✅ **Supabase** replaces custom PHP API + MySQL
- ✅ **Supabase Realtime** replaces XMPP for chat
- ✅ **Firebase FCM** for push notifications (all 4 apps use it)
- ✅ **OpenStreetMap** for maps (Omolink uses it, no licensing cost)
- ✅ **Leaflet** for interactive maps (Omolink uses it)
- ✅ **RevenueCat** for subscription management (Rizz uses it — handles Google + Amazon + Stripe)
- ✅ **WebSocket** for chat (Rizz + Romeo + Grindr all use it)

### 4. API Design from Omolink
The Omolink API uses a **method-based** pattern:
```
POST /api
Body: { method: "user_search", page: 0, limit: 12, view: "nearby" }
```

Our Supabase approach is actually BETTER because:
- Row Level Security (RLS) built-in
- Real-time subscriptions
- Storage for photos
- No custom backend needed

### 5. Missing from Our Current Build
Based on APK analysis, these features exist in APKs but NOT in omolink-nextjs:
- [ ] MeetNow (instant nearby)
- [ ] Fansites/External links
- [ ] Social feed (shouts)
- [ ] Group chat
- [ ] Video calls
- [ ] Boost system
- [ ] Virtual wallet
- [ ] Subscription tiers
- [ ] Photo albums
- [ ] Blog system
- [ ] Events
- [ ] Map view (Leaflet)
- [ ] Advanced search filters
- [ ] Who viewed you
- [ ] Favorites/bookmarks
- [ ] Circles (profile groups)
- [ ] Profile verification
- [ ] PIN lock
- [ ] Chat backup
- [ ] Do not disturb
- [ ] i18n system
- [ ] Multi-site support
- [ ] Exit interview/feedback
