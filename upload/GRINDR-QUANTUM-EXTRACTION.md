# GRINDR 7.5.0 -- COMPLETE QUANTUM EXTRACTION

> Source: ReverseAPK + JADX decompilation of `com.grindrapp.android` (v7.5.0)
> Java Files: 11,721 | Language: Native Kotlin | Compile SDK: 29

---

## 1. ARCHITECTURE STACK

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Kotlin | - |
| DI | Dagger | 2.28 |
| Chat | XMPP (Smack) | 4.x (Smack TCP) |
| Presence | WebSocket | `/session/websocket` |
| REST | Retrofit 2 | - |
| HTTP | OkHttp 3 | - |
| DB | Room (SQLite) | 2.3.0-alpha02 |
| JSON | Jackson | - |
| JWT | JJWT (io.jsonwebtoken) | - |
| Async | Kotlin Coroutines | - |
| Logging | Timber | - |
| AOP | AspectJ | - |
| Phone | libphonenumber | MichaelRocks port |
| Navigation | AndroidX Navigation | 2.3.4 |
| Work | AndroidX WorkManager | 2.3.4 |
| Paging | AndroidX Paging | 2.1.2 |
| Biometric | AndroidX Biometric | 1.0.1 |
| Camera | CameraX | 1.0.0-beta08 |
| Video | ExoPlayer/Media2 | 1.0.3 |
| Material | Material Components | 1.2.0-beta01 |

---

## 2. COMPLETE REST API ENDPOINTS

All endpoints extracted from `ApiRestService.java` and `LoginRestService.java` (decompiled source).

### 2.1 Authentication (LoginRestService)

| Method | Path | Request Body | Response |
|--------|------|-------------|----------|
| POST | `v3/sessions` | `LoginEmailRequest` | `AuthResponse` |
| POST | `v4/sms/sessions` | `LoginPhoneRequest` | `AuthResponse` |
| POST | `v3/sessions/thirdparty` | `ThirdPartyRequest` | `ThirdPartyAuthResponse` |
| POST | `v3.1/users` | `CreateAccountEmailRequest` | `AuthResponse` |
| POST | `v6/users` | `CreateAccountEmailRequest` | `AuthResponse` |
| POST | `v4/sms/users` | `CreateAccountPhoneRequest` | `AuthResponse` |
| POST | `v3/users/thirdparty` | `CreateThirdPartyAccountRequest` | `AuthResponse` |
| POST | `v3/users/forgot-password` | `ForgotPwdEmailRequest` | `ForgotPwdEmailResponse` |
| POST | `v4/sms/users/update-password` | `ChangePasswordPhoneRequest` | `ChangePasswordResponse` |

**Login API paths recognized by interceptor:**
- `v3/sessions` (email login)
- `v4/sms/sessions` (phone login)
- `v3/sessions/thirdparty` (social login)
- `v3.1/users` (email registration)
- `v6/users` (email registration v6)

### 2.2 Profiles (ApiRestService)

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v4/me/profile` | - | `FullProfileList` |
| GET | `v4/profiles/{id}` | `@Path id` | `FullProfileList` |
| PUT | `v3.1/me/profile` | `@Body UpdateProfileRequest` | `ResponseBody` |
| POST | `v3/profiles` | `@Body ProfilesRequest` | `ProfileList` |
| POST | `/v4/profiles/status` | `@Body ProfileStatusRequest` | `ProfileStatusResponse` |
| POST | `/v4/profiles/reachable` | `@Body ReachableProfilesRequest` | `ReachableProfilesRequest` |
| GET | `/v4/profiles/supportedFeatures/{targetProfileId}` | `@Path targetProfileId` | `SupportedFeaturesResponse` |
| POST | `/v4/recognition/face` | `@Body FaceDetectionResult` | `ResponseBody` |
| POST | `/v4/recognition/chat` | `@Body OCRResultRequest` | `ResponseBody` |

### 2.3 Cascade/Explore (Proximity Browsing)

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v4/locations/{geohash}/profiles` | `@Path geohash`, 22 `@Query` filters | `CascadeList` |
| GET | `v4/locations/{geohash}/unlimited-profiles` | `@Path geohash`, 22 `@Query` filters + pagination | `CascadeList` |
| GET | `v4/locations/{geohash}/profiles?viewedMeOnly=true` | `@Path geohash` | `CascadeList` |
| GET | `/v3/places/search` | `@Query placeName` | `ExploreSearchResultList` |

**Cascade filter parameters:**
- `online` (boolean)
- `ageMinimum` / `ageMaximum` (Integer)
- `heightMinimum` / `heightMaximum` (Float)
- `weightMinimum` / `weightMaximum` (Float)
- `grindrTribesIds` (String)
- `lookingForIds` (String)
- `relationshipStatusIds` (String)
- `bodyTypeIds` (String)
- `sexualPositionIds` (String)
- `meetAtIds` (String)
- `nsfwIds` (String)
- `photoOnly` (Boolean)
- `faceOnly` (Boolean)
- `favorite` (Boolean)
- `notRecentlyChatted` (Boolean)
- `pageNumber` (Integer)
- `action` (String)
- `cascadeType` (String)
- `searchAfterDistance` / `searchAfterProfileId` (for unlimited pagination)

### 2.4 Favorites

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v3/me/favorites/{id}` | `@Path id` | `ResponseBody` |
| DELETE | `v3/me/favorites/{id}` | `@Path id` | `ResponseBody` |
| GET | `v5/favorites` | - | `FavoriteLiteList` |

### 2.5 Blocks

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v3.1/me/blocks` | - | `GetBlocksResponse` |
| GET | `v4/me/blocks` | `@Query page`, `@Query updateTime` | `GetBlocksV4Response` |
| POST | `v3/me/blocks/{id}` | `@Path id` | `ResponseBody` |
| DELETE | `v3/me/blocks/{targetProfileId}` | `@Path targetProfileId` | `ResponseBody` |
| DELETE | `v3/me/blocks` | - | `ResponseBody` (unblockAll) |

### 2.6 Chat & Messaging

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v3/me/chat/messages` | `@Query undelivered`, `receipts`, `limit`, `from` | `UndeliveredChatMessageResponse` |
| PUT | `v3/me/chat/messages` | `@Body ConfirmMessagesDeliveredRequest`, `@Query confirmed` | `ResponseBody` |
| DELETE | `/v3/msgstore` | `@Query msgid` | `ResponseBody` |
| POST | `/v4/chats/translate` | `@Body ChatTranslateRequest` | `ChatTranslateResponse` |

### 2.7 Group Chat

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `/v3/groupchats` | `@Body CreateGroupRequest` | `GroupChatResponse` |
| GET | `v3/groupchats` | - | `GroupChatIdsResponse` |
| GET | `v3/groupchats/all` | - | `GroupChatsResponse` |
| GET | `/v3/groupchats/{conversationId}` | `@Path conversationId` | `GroupChatResponse` |
| PATCH | `/v3/groupchats/{conversationId}` | `@Body ChangeGroupChatNameRequest` | `ResponseBody` |
| PATCH | `/v3/groupchats/{conversationId}` | `@Body InviteGroupChatMembersRequest` | `ResponseBody` |
| PATCH | `/v3/groupchats/{conversationId}/{profileId}` | `@Body AcceptGroupChatRequest` | `ResponseBody` |
| DELETE | `/v3/groupchats/{conversationId}/{profileId}` | `@Path conversationId`, `@Path profileId` | `ResponseBody` |
| DELETE | `v3/groupchats/all/{profileId}` | `@Path profileId` | `ResponseBody` |
| GET | `/v3.1/groupchat/canbeinvited` | - | `ProfileList` |

### 2.8 Chat Muting

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v4/me/muted-profiles` | `@Body IndividualChatMuteRequest` | `ResponseBody` |
| DELETE | `v4/me/muted-profiles` | `@Body IndividualChatMuteRequest` | `ResponseBody` |
| GET | `v4/me/muted-profiles` | - | `IndividualChatMuteRequest` |
| DELETE | `/v4/me/push-conversations` | `@Body GroupChatMuteRequest` | `ResponseBody` |
| POST | `v4/me/push-conversations` | `@Body GroupChatMuteRequest` | `ResponseBody` |
| POST | `/v3.1/me/push-conversations/{conversationId}` | `@Path conversationId` | `ResponseBody` |
| DELETE | `/v3.1/me/push-conversations/{conversationId}` | `@Path conversationId` | `ResponseBody` |

### 2.9 Video Call

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `/v3/video-call` | `@Body CreateVideoCallRequest` | `CreateVideoCallResponse` |
| PUT | `/v3/video-call` | `@Body JoinVideoCallRequest` | `JoinVideoCallResponse` |
| PATCH | `/v3/video-call` | `@Body RenewVideoCallRequest` | `RenewVideoCallResponse` |
| DELETE | `/v3/video-call/{creatorProfileId}` | `@Path creatorProfileId` | `ResponseBody` |
| GET | `/v3/video-call` | - | `VideoCallInfoResponse` |

### 2.10 Video Roulette

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v4/video-roulette` | - | `VideoRouletteResponse` |
| GET | `v4/video-roulette/{matchId}` | `@Path matchId` | `VideoRouletteMatchResponse` |
| DELETE | `v4/video-roulette/{matchId}` | `@Path matchId` | `ResponseBody` |
| POST | `v4/video-roulette-call` | `@Body CreateVideoRouletteRequest` | `VideoRouletteInfoResponse` |
| PUT | `v4/video-roulette-call/{matchId}` | `@Path matchId` | `VideoRouletteInfoResponse` |
| PATCH | `v4/video-roulette-call/{matchId}` | `@Path matchId` | `RenewVideoRouletteResponse` |
| DELETE | `v4/video-roulette-call/{matchId}` | `@Path matchId` | `ResponseBody` |

### 2.11 Views (Who Viewed Me)

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v4/views` | - | `CascadeList` |
| GET | `v5/views` | - | `V5Views` |
| POST | `v4/views` | `@Body ProfileViewsRequest` | `Unit` |
| POST | `v4/views/{profileId}` | `@Path profileId` | `Unit` |

### 2.12 Expiring Media (Private Photos/Videos)

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `/v4/pics/expiring` | `@Body ExpiringPhotoReportSentRequest` | `ExpiringPhotoStatusResponse` |
| GET | `/v4/pics/expiring/status` | - | `ExpiringPhotoStatusResponse` |
| POST | `/v4/videos/expiring` | `@Body PrivateVideoReportSentRequest` | `PrivateVideoStatusResponse` |
| GET | `/v4/videos/expiring/status` | - | `PrivateVideoStatusResponse` |

### 2.13 Chat Backup

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `/v3.1/chat/backup` | `@Body ChatBackupFileRequest` | `Unit` |
| GET | `/v3.1/chat/backup` | - | `ChatBackupFile` |
| DELETE | `/v3.1/chat/backup` | - | `ResponseBody` |

### 2.14 Settings & Preferences

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `v3/me/prefs` | - | `GetPreferencesResponse` |
| GET | `v3/me/prefs/settings` | - | `GrindrSettings` |
| PUT | `v3/me/prefs/settings` | `@Body UpdateSettingsRequest` | `ResponseBody` |
| PUT | `v3/me/location` | `@Body UpdateLocationRequest` | `ResponseBody` |

### 2.15 Saved Phrases

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v3/me/prefs/phrases` | `@Body AddSavedPhraseRequest` | `AddSavedPhraseResponse` |
| DELETE | `v3/me/prefs/phrases/{id}` | `@Path id` | `ResponseBody` |
| POST | `v4/phrases/frequency/{id}` | `@Path id` | `ResponseBody` |

### 2.16 Profile Photos

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| HTTP DELETE | `/v3/me/profile/images` | `@Body DeleteApprovedProfilePhotoRequest` | `Unit` |

### 2.17 Report & Flags

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v3.1/flags/{id}` | `@Body ReportProfileV31Request` | `ResponseBody` |
| GET | `v3.1/flags/{id}` | `@Path id` | `ReportProfileV31Response` |

### 2.18 Account Management

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v3/users/update-password` | `@Body ChangePasswordRequest` | `ChangePasswordResponse` |
| POST | `v3/users/email` | `@Body UpdateEmailRequest` | `AuthResponse` |
| DELETE | `v3/me/profile` | - | `ResponseBody` (delete account) |
| PUT | `v3/me/legal-agreements` | `@Body AcceptLegalAgreementsRequest` | `ResponseBody` |
| GET | `v3/me/legal-agreements` | - | `AcceptedLegalAgreementsResponse` |
| POST | `v3/gcm-push-tokens` | `@Body FcmPushRequest` | `ResponseBody` |

### 2.19 Explore Free Chats (Rewarded)

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | `/v5/rewarded-chats` | - | `ExploreFreeChatsResponse` |
| POST | `/v5/rewarded-chats` | - | `ResponseBody` |

### 2.20 Hashtags/Tags

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `v4/hashtags/valid` | `@Body String` | `ResponseBody` |
| GET | `v4/hashtags/recommend` | - | `MyTagRecommend` |

### 2.21 GDPR/Data

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | `/v1/access-requests` | `@Body DataPortabilityRequest` | `DataPortabilityResponse` |

### 2.22 Domain Check

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | (domain check) | `@Body DomainCheckRequest` | `ResponseBody` |

### 2.23 Vendor Token

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| POST | (vendor token) | `@Body VendorTokenRequest` | `VendorTokenResponse` |

### 2.24 Web Client

| Method | Path | Parameters | Response |
|--------|------|-----------|----------|
| GET | (web client) | `@Query clientId` | `ResponseBody` |

---

## 3. REST API INTERCEPTORS

### 3.1 HeaderRequestInterceptor

**Headers added to every request:**

| Header | Value | Condition |
|--------|-------|-----------|
| `Authorization` | `Grindr3 {sessionToken}` | Authenticated requests |
| `L-Time-Zone` | Device timezone ID | Always |
| `L-Grindr-Roles` | User roles string | Authenticated |
| `L-Device-Info` | Device info (anonymized or full) | Based on flag |
| `Accept` | `application/json` | Always |
| `User-Agent` | Custom Grindr UA string | Always |
| `L-Locale` | Device locale | Always |
| `Accept-language` | Language preference | Always |

**Authentication scheme:** `Grindr3 {token}` (custom scheme, not Bearer)

### 3.2 SessionResponseInterceptor

- Wraps every request with token refresh logic
- Uses `RefreshTokenRetryController` for automatic retry
- On 401: attempts token refresh, then retries with new headers
- Logs expired session events to analytics
- 180-second window for session expiry tracking

### 3.3 Other Interceptors

- `PreconditionResponseInterceptor` -- Handles precondition failures
- `BackgroundRestrictionInterceptor` -- Manages background restrictions

---

## 4. OKHTTP SERVICE URLS

**Base URL Construction (from GrindrRestService):**
```
{protocol}://{host}:{port}{path}
```
- Protocol, host, port, and path are dynamically configured via `BootstrapPref`
- File service, audio download, video download, and gaymoji service each have their own base URLs
- All URLs are fetched from bootstrap configuration (not hardcoded)

**Service Types:**
| Service | Purpose | Base URL Source |
|---------|---------|----------------|
| `GrindrFileRestService` | File uploads/downloads | `BootstrapPref` (scheme + host + port + path) |
| `AudioDownloadService` | Audio message downloads | `GrindrData` (dynamic URL) |
| `VideoDownloadService` | Video message downloads | `GrindrData` (dynamic URL) |
| `GaymojiService` | Gaymoji/emoji content | `GrindrData` (dynamic URL) |
| `ApiRestService` | Main API | Configured via `RetrofitFactory` |
| `SpotifyRestService` | Spotify integration | Separate base |
| `SpotifyBackendRestService` | Spotify backend | Separate base |
| `GiphyService` | GIF search | Separate base |
| `GoogleAccessTokenService` | Google OAuth tokens | Google endpoints |
| `CachedApiRestService` | Cached API responses | Same as main API |
| `UnauthedBootstrapRestService` | Bootstrap (no auth) | Bootstrap URL |
| `UnauthedFeatureConfigRestService` | Feature config (no auth) | Feature config URL |
| `UnauthedClientLogRestService` | Client logging (no auth) | Logging URL |
| `NewOnBoardingRestService` | Onboarding | Onboarding URL |

---

## 5. XMPP CHAT SYSTEM

### 5.1 GrindrXMPPManager

**Core class:** `com.grindrapp.android.xmpp.GrindrXMPPManager`
- Implements `CoroutineScope` for async operations
- Uses `AbstractXMPPConnection` (Smack TCP connection)
- Singleton pattern with `ReentrantLock`
- Custom config: `SimplifiedXMPPTCPConnectionConfigurationFactory`

### 5.2 XMPP Features

| Feature | Implementation |
|---------|---------------|
| Connection | `XMPPTCPConnection` via Smack |
| Auth | `AccountManager` integration |
| Chat States | `ChatStateManager`, `ChatStateListener` (composing, paused, etc.) |
| Message Receipts | `sendReceivedChatMarkerMessage`, `sendDisplayedMarker` |
| Message Retraction | `sendRetractionMessage` (message recall/delete) |
| Translation | `sendTranslationMessage`, `TranslationManager`, `TranslationHandler` |
| Failed Messages | `FailedSendMessageManager` with retry queue |
| Reconnection | `ReconnectManager` with automatic reconnect |
| Group Chat | MUC (Multi-User Chat) via Smack MUC extensions |
| Privacy | `PrivacyItem` subscription management |
| Chat State Changes | `sendChatStateChangeMessage` (typing indicators) |
| Stream Management | Smack Stream Management (ack/resume) |
| DNS | `ChatDnsManager` with `AndroidUsingLinkProperties` |
| Batch Processing | `BatchChatMessageHandler` |
| Local Send | `ChatSendLocalMessageHandler` |

### 5.3 XMPP Status States

```
CONNECTING -> CONNECTED -> AUTHENTICATED -> RESUMED
                          DISCONNECTED (retry)
```

### 5.4 XMPP Message Types

From model classes and managers:
- Text messages
- Image messages (chat photos)
- Audio messages (`AudioChatService`)
- Video call messages (`VideoCallMessageValidator`, `PrivateVideoChatService`)
- Expiring photo messages
- Private video messages
- Location sharing messages
- Gaymoji/emoji messages
- System messages (group events)

### 5.5 XMPP Namespaces (Active)

| Namespace | Purpose |
|-----------|---------|
| `http://jabber.org/protocol/chatstates` | Typing indicators |
| `http://jabber.org/protocol/muc#user` | Group chat |
| `http://jabber.org/protocol/muc#admin` | Group admin |
| `http://jabber.org/protocol/muc#owner` | Group owner |
| `http://jabber.org/protocol/geoloc` | Location sharing |
| `http://jabber.org/protocol/pubsub` | PubSub events |
| `http://jabber.org/protocol/rsm` | Message pagination |
| `http://jabber.org/protocol/amp` | Message processing |
| `http://jabber.org/protocol/shim` | Stanza headers |
| `http://jabber.org/protocol/si` | File transfer init |
| `http://jabber.org/protocol/bytestreams` | SOCKS5 transfer |
| `http://jabber.org/protocol/ibb` | In-band transfer |
| `http://jabber.org/protocol/commands` | Ad-hoc commands |
| `http://jabber.org/protocol/caps` | Entity capabilities |
| `http://jabber.org/protocol/nick` | Nicknames |
| `http://jabber.org/protocol/xhtml-im` | Rich messages |

---

## 6. ROOM DATABASE SCHEMA

### 6.1 Database Configuration

- **Class:** `AppDatabase`
- **Per-user databases:** `grinder_{profileId}{hash}.db`
- **Helper:** `GrindrHelperFactory` (WCDB-based)
- **Migrations:** `DBMigrations.getAppDBMigrations()`
- **FTS:** Full-text search on chat messages (`chat_message_fts`)
- **Trigger:** Auto-delete FTS entries when chat messages are deleted

### 6.2 DAOs (30 total)

| DAO | Purpose |
|-----|---------|
| `BannedProfileDao` | Banned profiles |
| `BlockedProfileDao` | Blocked profiles |
| `CascadeDao` | Cascade/explore grid profiles |
| `ChatMessageDao` | Chat messages (with FTS) |
| `ChatPhotoDao` | Chat photos |
| `ChatReactionDao` | Message reactions |
| `ChatRepliedMessageDao` | Reply-to messages |
| `ConversationDao` | Conversation threads |
| `DeletedMuteDao` | Deleted mute records |
| `ExploreProfileDao` | Explore profiles |
| `FailedMarkerDao` | Failed delivery markers |
| `FavoriteLiteDao` | Lightweight favorites |
| `FavoriteProfileDao` | Full favorite profiles |
| `FreshFaceProfileDao` | New/recent profiles |
| `GroupChatCircleDao` | Circle-group associations |
| `GroupChatDao` | Group chat data |
| `GroupChatProfileDao` | Group chat members |
| `IncomingChatMarkerDao` | Incoming message markers |
| `NSFWDetectionDao` | NSFW detection results |
| `NearbyProfileDao` | Nearby profiles |
| `PhraseDao` | Saved phrases |
| `ProfileDao` | User profiles |
| `ProfileNoteDao` | Private notes on profiles |
| `SearchInboxDao` | Inbox search index |
| `ViewedMeProfileDao` | Who viewed me |

### 6.3 Database Module (Dagger)

- `UserDatabaseModule` -- Per-user database provider
- `DatabaseModule` -- Shared database components
- `TransactionModule` -- Transaction management

---

## 7. DAGGER DI MODULES

### 7.1 Module Structure

| Module | Purpose |
|--------|---------|
| `AppModule` | Application-level dependencies |
| `ApiModule` | API service providers |
| `AuthModule` | Authentication dependencies |
| `UserApiModule` | User-scoped API services |
| `UserDatabaseModule` | Per-user Room database |
| `DatabaseModule` | Shared database components |
| `TransactionModule` | Transaction runners |

### 7.2 Component Structure

| Component | Purpose |
|-----------|---------|
| `UserComponent` | User-scoped dependency graph |
| `UserComponentProvider` | Provides user component |
| `AppEntryInjector` | App entry injection |
| `ColdStartInjector` | Cold start injection |
| `CertFailInjector` | Certificate failure injection |
| `BanAccountInjector` | Ban account injection |
| `UserInjection` | User-level injection |
| `AppComponentInvalidationListener` | Component lifecycle |

---

## 8. FEATURES -- IMPLEMENTATION DETAILS

### 8.1 Taps (Like System)
- **API:** Not a dedicated endpoint; likely XMPP-based or internal
- **Double tap:** `Double Tap to Like` string
- **Delete:** `Delete Tap` / `Delete Taps`
- **Filtering:** `Penapis Taps` in filter system
- **Onboarding:** `lottie_onboard_page2_tap.zip`
- **Unread indicator:** `Messages[img src=taps_unread_indicator/]`

### 8.2 Favorites
- **Add:** `POST v3/me/favorites/{id}`
- **Remove:** `DELETE v3/me/favorites/{id}`
- **List:** `GET v5/favorites` -> `FavoriteLiteList`
- **Local:** `FavoriteProfileDao`, `FavoriteLiteDao`
- **Filters:** `Favorites Filters`, `Favorites Tab`

### 8.3 Explore/Cascade
- **Standard:** `GET v4/locations/{geohash}/profiles` (22 filter params)
- **Unlimited:** `GET v4/locations/{geohash}/unlimited-profiles` (pagination via `searchAfterDistance`/`searchAfterProfileId`)
- **Local:** `CascadeDao`, `ExploreProfileDao`, `NearbyProfileDao`
- **Geohash:** Location converted to geohash for server-side proximity query
- **Free chats:** `GET /v5/rewarded-chats` -> `ExploreFreeChatsResponse`

### 8.4 Boost
- **Activities:** `BoostBuyActivity`, `BoostBundleBuyActivity`, `BoostUseActivity`, `BoostReportActivity`
- **Type:** Consumable purchase (not subscription)
- **Theme:** `ConsumablePurchaseTheme`
- **Incognito interaction:** Boost stops when going incognito

### 8.5 XTRA/Unlimited
- **Billing:** Play Billing v3 (`com.google.android.play.billingclient.version=3.0.0`)
- **XTRA:** Premium filters, online now, unlimited scrolling, saved phrases
- **Unlimited:** All XTRA + video chat (300 min/month), unlimited profiles
- **Store:** `StoreActivity` with `storeV2Xtra*` resources

### 8.6 Circles (Public Forums)
- **Create:** `CircleCreateActivity`
- **Invite:** `CircleInviteActivity`
- **Chat:** `GroupChatCircleDao`, `GroupChatDao`
- **Mute:** `Mute Circle` / `Circle is default muted`
- **Tags:** Searchable by all users

### 8.7 Groups (Private Group Chat)
- **Create:** `POST /v3/groupchats` -> `CreateGroupRequest`
- **List:** `GET v3/groupchats` -> `GroupChatIdsResponse`
- **Details:** `GET /v3/groupchats/{conversationId}`
- **Rename:** `PATCH /v3/groupchats/{conversationId}` -> `ChangeGroupChatNameRequest`
- **Invite:** `PATCH /v3/groupchats/{conversationId}` -> `InviteGroupChatMembersRequest`
- **Accept:** `PATCH /v3/groupchats/{conversationId}/{profileId}`
- **Remove:** `DELETE /v3/groupchats/{conversationId}/{profileId}`
- **Leave:** `DELETE v3/groupchats/all/{profileId}`
- **Invitable:** `GET /v3.1/groupchat/canbeinvited`

### 8.8 Video Call
- **Create:** `POST /v3/video-call` -> `CreateVideoCallRequest`
- **Join:** `PUT /v3/video-call` -> `JoinVideoCallRequest`
- **Renew:** `PATCH /v3/video-call` -> `RenewVideoCallRequest`
- **Leave:** `DELETE /v3/video-call/{creatorProfileId}`
- **Info:** `GET /v3/video-call` -> `VideoCallInfoResponse`
- **Service:** `VideoCallForegroundService` (foreground, dataSync)
- **Manager:** `PrivateVideoChatService` in XMPP package
- **UI:** `VideoCallActivity` (singleTask), `VideoCallDialogActivity`

### 8.9 Video Roulette
- **Start:** `POST v4/video-roulette` -> `VideoRouletteResponse`
- **Match:** `GET v4/video-roulette/{matchId}` -> `VideoRouletteMatchResponse`
- **Delete match:** `DELETE v4/video-roulette/{matchId}`
- **Create call:** `POST v4/video-roulette-call` -> `CreateVideoRouletteRequest`
- **Join call:** `PUT v4/video-roulette-call/{matchId}`
- **Renew:** `PATCH v4/video-roulette-call/{matchId}`
- **End call:** `DELETE v4/video-roulette-call/{matchId}`
- **Guide:** `VideoRouletteGuideActivity`

### 8.10 Spotify
- **Services:** `SpotifyRestService`, `SpotifyBackendRestService`
- **Auth:** `SpotifyAuthRestService`
- **Activity:** `SpotifyActivity`
- **SDK:** `com.spotify.sdk.android.authentication`
- **Deep link:** OAuth callback via custom URI

### 8.11 Viewed Me
- **API:** `GET v4/locations/{geohash}/profiles?viewedMeOnly=true`
- **V5:** `GET v5/views` -> `V5Views`
- **Record:** `POST v4/views` / `POST v4/views/{profileId}`
- **Local:** `ViewedMeProfileDao`
- **Activities:** `ViewedMeActivity`, `ViewedMeCruiseActivityV2`

### 8.12 Profile Notes
- **Local:** `ProfileNoteDao`
- **Strings:** `Has A Note` (filter), `Add Number to Note`, `Delete Note?`
- **Feature:** Private notes, adding phone number also favorites

### 8.13 Chat Backup
- **Create:** `POST /v3.1/chat/backup` -> `ChatBackupFileRequest`
- **Get:** `GET /v3.1/chat/backup` -> `ChatBackupFile`
- **Delete:** `DELETE /v3.1/chat/backup`
- **Services:** `BackupService`, `RestoreService` (foreground, dataSync)
- **Destinations:** Google Drive, local device
- **Auto:** Sunday midnight on WiFi

### 8.14 Do Not Disturb
- **Activity:** `DoNotDisturbSettingsActivity`
- **Time sync:** `TimeChangedReceiver` for timezone changes
- **Settings:** `GET v3/me/prefs/settings` / `PUT v3/me/prefs/settings`

### 8.15 Profile Verification
- **Face detection:** `POST v4/recognition/face` -> `FaceDetectionResult`
- **OCR:** `POST v4/recognition/chat` -> `OCRResultRequest`
- **ML Vision:** Face, OCR, barcode detection
- **NSFW model:** `https://nsfw.grindr.com/nsfw.tflite`
- **Local:** `NSFWDetectionDao`

### 8.16 Expiring Media
- **Photos:** `POST /v4/pics/expiring`, `GET /v4/pics/expiring/status`
- **Videos:** `POST /v4/videos/expiring`, `GET /v4/videos/expiring/status`
- **Activity:** `FullScreenExpiringImageActivity`
- **Capture:** `PrivateVideoCaptureActivity`, `PrivateVideoPlayerActivity`

### 8.17 Incognito Mode
- **API:** `updateIncognito(isIncognito: Boolean)` in `GrindrRestService`
- **Effect:** Hidden from grid, stops boost
- **String:** `Your profile will be hidden from the grid, but you will still be able to browse, send messages, and tap.`

---

## 9. AD NETWORKS

| Network | Activities | Key Classes |
|---------|-----------|-------------|
| **MoPub** | `ConsentDialogActivity`, `MoPubBrowser`, `MoPubActivity`, `MraidActivity`, `RewardedMraidActivity`, `MraidVideoPlayerActivity` | `mopub-sdk-base_release`, `mopub-sdk-interstitial_release`, `mopub-sdk-rewardedvideo_release` |
| **Vungle** | `VungleActivity`, `VungleFlexViewActivity` | `ApkDownloader`, `NetworkProviderReceiver` |
| **Smaato** | `SmaatoSdkBrowserActivity`, `InterstitialAdActivity`, `RewardedInterstitialAdActivity` | `UnifiedBiddingInitialiser`, `OMViewabilityPlugin`, `SdkInitialisationObserver` |
| **Fyber** | `InneractiveInternalBrowserActivity`, `InneractiveFullscreenAdActivity`, `InneractiveRichMediaVideoPlayerActivityCore` | `IAVideoKit`, `IAMraidKit` |
| **PubNative** | `UserConsentActivity`, `MraidInterstitialActivity`, `VastInterstitialActivity`, `VastRewardedActivity` | Lite SDK |
| **Braze** | `AppboyWebViewActivity`, `AppboyFeedActivity`, `AppboyContentCardsActivity`, `AppboyNotificationRoutingActivity` | `BrazePushReceiver`, `AppboyActionReceiver` |

---

## 10. THIRD-PARTY INTEGRATIONS

### 10.1 Zendesk
- `HelpCenterActivity`, `ViewArticleActivity`, `RequestActivity`, `RequestListActivity`
- `DeepLinkingBroadcastReceiver`, `SupportSdkStartupProvider`
- `BelvedereFileProvider` (attachments)

### 10.2 Facebook
- `FacebookActivity`, `CustomTabActivity` (scheme: `fb1273378622718674`)
- `FacebookInitProvider`, `CurrentAccessTokenExpirationBroadcastReceiver`
- `CampaignTrackingReceiver` (install tracking)
- Auto-init: **disabled**, AdvertiserID: **disabled**, AppEvents: **disabled**

### 10.3 Google Sign-In
- `SignInHubActivity`, `FederatedSignInActivity`
- `RevocationBoundService`
- OAuth client: `1036042917246-raksfbjj517n848fb37aae7kdnfvoh3u.apps.googleusercontent.com`

### 10.4 OneTrust
- `OTPublishersSDKActivity`
- Gates Firebase analytics/crashlytics/performance until consent

### 10.5 SafetyNet
- `play-services-safetynet` for device attestation

### 10.6 AppsFlyer
- `MultipleInstallBroadcastReceiver` for install referrer

### 10.7 Google Play Services (Complete)
Auth, Auth-API-Phone, Auth-Base, Base, Basement, Ads-Identifier, Clearcut, Flags, Location, Maps, Measurement (full suite), Phenotype, Places-PlaceReport, SafetyNet, Stats, Tasks, Vision (common, image-label, main)

---

## 11. COMPLETE ACTIVITY INVENTORY

### Auth & Onboarding (15)
`LoginActivity`, `LandingActivity`, `LandingPhoneActivity`, `LandingEmailActivity`, `LandingForgotPwdActivity`, `LandingSMSVerifyActivity`, `CreateAccountEmailActivity`, `SMSVerifyActivity`, `SmsCountryPickerActivity`, `ForgotPasswordActivity`, `ResetPasswordPhoneActivity`, `AccountVerifyActivity`, `ThirdPartyLoginProfileActivity`, `CredentialsChangedActivity`, `ChangePasswordActivity`, `UpdateEmailActivity`

### Profile & Cruise (8)
`EditProfileActivity`, `RegisterProfileActivity`, `BaseCruiseActivityV2`, `ExploreCruiseActivityV2`, `StandaloneCruiseActivityV2`, `LocalCruiseActivity`, `PickProfileActivity`, `NewOnBoardingUpsellActivity`

### Chat (9)
`ChatActivityV2`, `ShareToChatActivity`, `ShareChatMessageActivity`, `ChatCreateGroupActivity`, `GroupChatDetailsActivity`, `BlockedMembersActivity`, `InviteMembersActivity`, `IndividualUnblockActivity`, `SearchInboxActivity`

### Media (8)
`FullScreenExpiringImageActivity`, `FullScreenImageActivity`, `ChatRoomPhotosActivity`, `CropImageActivity`, `PhotoDecorationActivity`, `EditPhotosActivity`, `PrivateVideoCaptureActivity`, `PrivateVideoPlayerActivity`

### Video (6)
`VideoCallActivity`, `VideoCallDialogActivity`, `VideoMatchActivity`, `VideoRouletteActivity`, `VideoRouletteGuideActivity`

### Settings (11)
`SettingsActivity`, `SettingsDeleteProfileActivity`, `SettingsDeleteProfileReasonActivity`, `SettingsDeleteProfileOtherReasonActivity`, `SettingsDeactivateActivity`, `NotificationSettingsActivity`, `DoNotDisturbSettingsActivity`, `PrivacySettingsActivity`, `PinSettingsActivity`, `SetPinActivity`, `PinLockActivity`

### Subscription (6)
`SubscriptionManagementActivity`, `PurchaseDirectlyActivity`, `UpgradeConfirmationActivity`, `BoostBuyActivity`, `BoostBundleBuyActivity`, `BoostUseActivity`, `BoostReportActivity`, `StoreActivity`

### Social (5)
`CircleCreateActivity`, `CircleInviteActivity`, `EventCalendarActivity`, `SpotifyActivity`, `ViewedMeActivity`, `ViewedMeCruiseActivityV2`

### Explore (2)
`ExploreMapActivity`, `ExploreCascadeActivity`

### Other (12)
`ReportProfileActivity`, `BackupActivity`, `RestoreActivity`, `WebViewActivity`, `DebugToolsActivity`, `DebugFeatureFlagsActivity`, `DebugFeatureConfigActivity`, `DebugOneTrustStringActivity`, `DebugSDKPermissionActivity`, `DebugInstagramConnectionActivity`, `RequestDataActivity`, `IntentEntryActivity`

### Error/Security (5)
`BannedActivity`, `DeprecationActivity`, `PackageCorruptedActivity`, `CertFailActivity`, `BootstrapFailActivity`

### Account (3)
`AccountVerifyActivity`, `UpdateEmailActivity`, `ChangePasswordActivity`

---

## 12. FIREBASE CONFIGURATION

| Key | Value |
|-----|-------|
| project_id | `api-project-1036042917246` |
| gcm_sender_id | `1036042917246` |
| google_api_key | `AIzaSyDD5Ceh8j-a6Xw2R_seA7d5FZ5W09PcGkI` |
| google_app_id | `1:1036042917246:android:93d3725a6ad2a74d` |
| firebase_database_url | `https://api-project-1036042917246.firebaseio.com` |
| google_storage_bucket | `api-project-1036042917246.appspot.com` |
| google_geo_api_key | `AIzaSyBaKOPTkY2DsuSvnPC3ZzA4yFIVV1WQTxM` |
| Google OAuth client_id | `1036042917246-raksfbjj517n848fb37aae7kdnfvoh3u.apps.googleusercontent.com` |
| Facebook app_id | `1273378622718674` (from URI scheme) |

**All analytics/performance gated behind OneTrust consent (disabled by default).**

---

## 13. PERMISSIONS (COMPLETE)

| Permission | Purpose |
|------------|---------|
| `ACCESS_FINE_LOCATION` | Precise GPS |
| `ACCESS_COARSE_LOCATION` | Approximate location |
| `CAMERA` | Photo/video capture |
| `RECORD_AUDIO` | Video calls, audio messages |
| `MODIFY_AUDIO_SETTINGS` | Audio routing |
| `READ_EXTERNAL_STORAGE` | Photo access |
| `WRITE_EXTERNAL_STORAGE` | Photo save, backup |
| `USE_BIOMETRIC` | Biometric auth |
| `USE_FINGERPRINT` | Fingerprint (legacy) |
| `INTERNET` | Network |
| `ACCESS_NETWORK_STATE` | Connectivity |
| `ACCESS_WIFI_STATE` | WiFi detection |
| `CHANGE_NETWORK_STATE` | Network switching |
| `WAKE_LOCK` | Background processing |
| `VIBRATE` | Notifications |
| `SYSTEM_ALERT_WINDOW` | Overlays |
| `KILL_BACKGROUND_PROCESSES` | Performance |
| `RECEIVE_BOOT_COMPLETED` | Restart on boot |
| `FOREGROUND_SERVICE` | Background services |
| `com.android.vending.BILLING` | In-app purchases |
| `com.google.android.c2dm.permission.RECEIVE` | FCM |

---

## 14. DISGUISED ICONS

| Alias | Icon | Purpose |
|-------|------|---------|
| `HomeActivityOriginal` | Default Grindr icon | Normal (enabled) |
| `HomeActivityUnlimited` | Default icon | Unlimited branding |
| `HomeActivityCamera` | Camera icon | Disguise as camera app |
| `HomeActivityMusic` | Music icon | Disguise as music app |
| `HomeActivityNotes` | Notes icon | Disguise as notes app |
| `HomeActivityToDo` | To-Do icon | Disguise as to-do app |
| `HomeActivityCalculator` | Calculator icon | Disguise as calculator |

---

## 15. DEEP LINKING

| Scheme | Host | Handler |
|--------|------|---------|
| `grindr://` | - | `IntentEntryActivity` |
| `https://` | `grindrxx.page.link` | `IntentEntryActivity` (Firebase Dynamic Links) |
| `fb1273378622718674://` | - | `CustomTabActivity` (Facebook OAuth) |
| Spotify redirect | - | `AuthCallbackActivity` |

---

*Extracted from JADX-decompiled Grindr 7.5.0 APK sources*
*Key files analyzed: ApiRestService.java, LoginRestService.java, HeaderRequestInterceptor.java, SessionResponseInterceptor.java, GrindrXMPPManager.java, UserDatabaseModule.java, GrindrRestService.java*

---

# APPENDIX A: COMPLETE RETROFIT API DEFINITIONS

> Source: `ApiRestService.java` and `LoginRestService.java` decompiled from `classes2.dex`
> All methods are Kotlin suspend functions returning `Object` (for coroutine bridge)

## A.1 Authentication API (LoginRestService)

```
POST  v3/sessions              -> AuthResponse          (LoginEmailRequest)
POST  v4/sms/sessions          -> AuthResponse          (LoginPhoneRequest)
POST  v3/sessions/thirdparty   -> ThirdPartyAuthResponse (ThirdPartyRequest)
POST  v3.1/users               -> AuthResponse          (CreateAccountEmailRequest)
POST  v6/users                 -> AuthResponse          (CreateAccountEmailRequest)
POST  v4/sms/users             -> AuthResponse          (CreateAccountPhoneRequest)
POST  v3/users/thirdparty      -> AuthResponse          (CreateThirdPartyAccountRequest)
POST  v3/users/forgot-password -> ForgotPwdEmailResponse (ForgotPwdEmailRequest)
POST  v4/sms/users/update-password -> ChangePasswordResponse (ChangePasswordPhoneRequest)
```

**Login API path recognition (LoginRestService.Companion):**
- Login APIs: `["v3/sessions", "v4/sms/sessions", "v3/sessions/thirdparty"]`
- Registration APIs recognized: `v3/sessions`, `v4/sms/sessions`, `v3.1/users`, `v6/users`
- Request body fields parsed: `email`, `phone_number`, `country_code`

## A.2 Profile API (ApiRestService)

```
GET    v4/me/profile                           -> FullProfileList
GET    v4/profiles/{id}                        -> FullProfileList
PUT    v3.1/me/profile                         -> ResponseBody            (UpdateProfileRequest)
POST   v3/profiles                             -> ProfileList             (ProfilesRequest)
POST   /v4/profiles/status                     -> ProfileStatusResponse   (ProfileStatusRequest)
POST   /v4/profiles/reachable                  -> ReachableProfilesRequest (ReachableProfilesRequest)
GET    /v4/profiles/supportedFeatures/{targetProfileId} -> SupportedFeaturesResponse
POST   v4/recognition/face                     -> ResponseBody            (FaceDetectionResult)
POST   /v4/recognition/chat                    -> ResponseBody            (OCRResultRequest)
```

## A.3 Cascade/Explore (Proximity Browsing)

```
GET  v4/locations/{geohash}/profiles           -> CascadeList
     Query params: online, ageMinimum, ageMaximum, heightMinimum, heightMaximum,
                   weightMinimum, weightMaximum, grindrTribesIds, lookingForIds,
                   relationshipStatusIds, bodyTypeIds, sexualPositionIds, meetAtIds,
                   nsfwIds, photoOnly, faceOnly, favorites, notRecentlyChatted,
                   pageNumber, action, cascadeType

GET  v4/locations/{geohash}/unlimited-profiles -> CascadeList
     Query params: (same as above minus pageNumber) + searchAfterDistance, searchAfterProfileId

GET  v4/locations/{geohash}/profiles?viewedMeOnly=true -> CascadeList

GET  /v3/places/search                         -> ExploreSearchResultList
     Query params: placeName
```

## A.4 Favorites

```
POST   v3/me/favorites/{id}   -> ResponseBody
DELETE v3/me/favorites/{id}   -> ResponseBody
GET    v5/favorites            -> FavoriteLiteList
```

## A.5 Blocks

```
GET    v3.1/me/blocks                         -> GetBlocksResponse
GET    v4/me/blocks                           -> GetBlocksV4Response
       Query: page (int), updateTime (long)
POST   v3/me/blocks/{id}                      -> ResponseBody
DELETE v3/me/blocks/{targetProfileId}          -> ResponseBody
DELETE v3/me/blocks                           -> ResponseBody (unblockAll)
```

## A.6 Chat & Messaging

```
GET    v3/me/chat/messages                    -> UndeliveredChatMessageResponse
       Query: undelivered (Boolean), receipts (Boolean), limit (int), from (int)
PUT    v3/me/chat/messages                    -> ResponseBody
       Body: ConfirmMessagesDeliveredRequest, Query: confirmed (boolean)
DELETE /v3/msgstore                           -> ResponseBody
       Query: msgid
POST   /v4/chats/translate                    -> ChatTranslateResponse
       Body: ChatTranslateRequest
```

## A.7 Group Chat

```
POST   /v3/groupchats                                  -> GroupChatResponse        (CreateGroupRequest)
GET    v3/groupchats                                   -> GroupChatIdsResponse
GET    v3/groupchats/all                               -> GroupChatsResponse
GET    /v3/groupchats/{conversationId}                 -> GroupChatResponse
PATCH  /v3/groupchats/{conversationId}                 -> ResponseBody             (ChangeGroupChatNameRequest)
PATCH  /v3/groupchats/{conversationId}                 -> ResponseBody             (InviteGroupChatMembersRequest)
PATCH  /v3/groupchats/{conversationId}/{profileId}     -> ResponseBody             (AcceptGroupChatRequest)
DELETE /v3/groupchats/{conversationId}/{profileId}     -> ResponseBody
DELETE v3/groupchats/all/{profileId}                   -> ResponseBody
GET    /v3.1/groupchat/canbeinvited                    -> ProfileList
```

## A.8 Chat Muting

```
POST    v4/me/muted-profiles                       -> ResponseBody             (IndividualChatMuteRequest)
DELETE  v4/me/muted-profiles                       -> ResponseBody             (IndividualChatMuteRequest)
GET     v4/me/muted-profiles                       -> IndividualChatMuteRequest
DELETE  /v4/me/push-conversations                  -> ResponseBody             (GroupChatMuteRequest)
POST    /v4/me/push-conversations                  -> ResponseBody             (GroupChatMuteRequest)
POST    /v3.1/me/push-conversations/{conversationId} -> ResponseBody
DELETE  /v3.1/me/push-conversations/{conversationId} -> ResponseBody
```

## A.9 Video Call

```
POST    /v3/video-call        -> CreateVideoCallResponse   (CreateVideoCallRequest)
PUT     /v3/video-call        -> JoinVideoCallResponse     (JoinVideoCallRequest)
PATCH   /v3/video-call        -> RenewVideoCallResponse    (RenewVideoCallRequest)
DELETE  /v3/video-call/{creatorProfileId} -> ResponseBody
GET     /v3/video-call        -> VideoCallInfoResponse
```

## A.10 Video Roulette

```
POST    v4/video-roulette                     -> VideoRouletteResponse
GET     v4/video-roulette/{matchId}           -> VideoRouletteMatchResponse
DELETE  v4/video-roulette/{matchId}           -> ResponseBody
POST    v4/video-roulette-call                -> VideoRouletteInfoResponse  (CreateVideoRouletteRequest)
PUT     v4/video-roulette-call/{matchId}      -> VideoRouletteInfoResponse
PATCH   v4/video-roulette-call/{matchId}      -> RenewVideoRouletteResponse
DELETE  v4/video-roulette-call/{matchId}      -> ResponseBody
```

## A.11 Views (Who Viewed Me)

```
GET    v4/views               -> CascadeList
GET    v5/views               -> V5Views
POST   v4/views               -> Unit               (ProfileViewsRequest)
POST   v4/views/{profileId}   -> Unit
```

## A.12 Expiring Media

```
POST   /v4/pics/expiring         -> ExpiringPhotoStatusResponse  (ExpiringPhotoReportSentRequest)
GET    /v4/pics/expiring/status  -> ExpiringPhotoStatusResponse
POST   /v4/videos/expiring       -> PrivateVideoStatusResponse   (PrivateVideoReportSentRequest)
GET    /v4/videos/expiring/status -> PrivateVideoStatusResponse
```

## A.13 Chat Backup

```
POST   /v3.1/chat/backup   -> Unit        (ChatBackupFileRequest)
GET    /v3.1/chat/backup   -> ChatBackupFile
DELETE /v3.1/chat/backup   -> ResponseBody
```

## A.14 Settings & Preferences

```
GET    v3/me/prefs             -> GetPreferencesResponse
GET    v3/me/prefs/settings    -> GrindrSettings
PUT    v3/me/prefs/settings    -> ResponseBody  (UpdateSettingsRequest)
PUT    v3/me/location          -> ResponseBody  (UpdateLocationRequest)
```

## A.15 Saved Phrases

```
POST   v3/me/prefs/phrases           -> AddSavedPhraseResponse  (AddSavedPhraseRequest)
DELETE v3/me/prefs/phrases/{id}      -> ResponseBody
POST   v4/phrases/frequency/{id}     -> ResponseBody
```

## A.16 Profile Photos

```
HTTP DELETE /v3/me/profile/images  -> Unit  (DeleteApprovedProfilePhotoRequest)
```

## A.17 Report & Flags

```
POST   v3.1/flags/{id}   -> ResponseBody            (ReportProfileV31Request)
GET    v3.1/flags/{id}   -> ReportProfileV31Response
```

## A.18 Account Management

```
POST   v3/users/update-password -> ChangePasswordResponse  (ChangePasswordRequest)
POST   v3/users/email           -> AuthResponse            (UpdateEmailRequest)
DELETE v3/me/profile            -> ResponseBody (delete account)
PUT    v3/me/legal-agreements   -> ResponseBody            (AcceptLegalAgreementsRequest)
GET    v3/me/legal-agreements   -> AcceptedLegalAgreementsResponse
POST   v3/gcm-push-tokens      -> ResponseBody            (FcmPushRequest)
```

## A.19 Explore Free Chats (Rewarded)

```
GET    /v5/rewarded-chats   -> ExploreFreeChatsResponse
POST   /v5/rewarded-chats   -> ResponseBody
```

## A.20 Hashtags/Tags

```
POST   v4/hashtags/valid      -> ResponseBody  (String body)
GET    v4/hashtags/recommend  -> MyTagRecommend
```

## A.21 GDPR/Data

```
POST   /v1/access-requests   -> DataPortabilityResponse  (DataPortabilityRequest)
```

## A.22 Domain Check

```
POST   (domain check)   -> ResponseBody  (DomainCheckRequest)
```

## A.23 Vendor Token

```
POST   (vendor token)   -> VendorTokenResponse  (VendorTokenRequest)
```

## A.24 Web Client

```
GET    (web client)   -> ResponseBody  (Query: clientId)
```

---

# APPENDIX B: GRINDR SETTINGS MODEL (GrindrSettings.java)

```kotlin
@Serializable
data class GrindrSettings(
    @SerializedName("locationSearchOptOut") val locationSearchOptOut: Boolean?,
    @SerializedName("incognito")            val incognito: Boolean?
)
```

- `incognito` -- When `true`, profile is hidden from grid. Stored via `PURCHASE_SOURCE_INCOGNITO` key.
- `locationSearchOptOut` -- Opt-out from appearing in location-based search results.

---

# APPENDIX C: PROFILE DATA MODEL (BaseProfile.java)

All profile fields extracted from `BaseProfile.java` (implements `Serializable`):

| Field | Type | SerializedName | Description |
|-------|------|----------------|-------------|
| `aboutMe` | `String` | `"aboutMe"` | Profile bio text |
| `acceptNSFWPics` | `int` | `"nsfw"` | NSFW content preference (0=off, 1=on) |
| `age` | `int` | `"age"` | User age |
| `bodyType` | `int` | `"bodyType"` | Body type enum (integer) |
| `displayName` | `String` | `"displayName"` | Display name |
| `distance` | `Double?` | `"distance"` | Distance in km/miles from viewer |
| `ethnicity` | `int` | `"ethnicity"` | Ethnicity enum (integer) |
| `grindrTribes` | `List<Integer>?` | `"grindrTribes"` | Tribe tags (Bear, Otter, etc.) |
| `hashtags` | `List<String>?` | `"hashtags"` | Custom hashtags |
| `height` | `double` | `"height"` | Height value |
| `hivStatus` | `int` | `"hivStatus"` | HIV status enum (integer) |
| `identity` | `Identity?` | `"identity"` | Gender identity object |
| `lastTestedDate` | `long` | `"lastTestedDate"` | Timestamp of last HIV test |
| `lookingFor` | `List<Integer>?` | `"lookingFor"` | Looking-for tags |
| `meetAt` | `List<Integer>?` | `"meetAt"` | Meet-at location preferences |
| `profileImageMediaHash` | `String` | `"profileImageMediaHash"` | Primary photo hash for URL construction |
| `relationshipStatus` | `int` | `"relationshipStatus"` | Relationship status enum |
| `sexualPosition` | `int` | `"sexualPosition"` | Sexual position enum |
| `showAge` | `boolean` | `"showAge"` | Whether age is visible on profile |
| `showDistance` | `boolean` | `"showDistance"` | Whether distance is visible on profile |
| `socialNetworks` | `SocialNetworks?` | `"socialNetworks"` | Connected social accounts |
| `weight` | `double` | `"weight"` | Weight value |

---

# APPENDIX D: ENUM TYPES (Complete)

## D.1 DirtyFieldType

Profile filter dirty-tracking enum:

| Value | Ordinal | allResourceId |
|-------|---------|---------------|
| `AGE` | 0 | 0 |
| `HEIGHT` | 1 | 0 |
| `WEIGHT` | 2 | 0 |
| `TRIBES` | 3 | `R.string.edit_my_type_all_tribes` |
| `RELATIONSHIP_STATUS` | 4 | `R.string.edit_my_type_all_relationship_statuses` |
| `LOOKING_FOR` | 5 | `R.string.edit_my_type_all_looking_for` |
| `BODY_TYPE` | 6 | `R.string.edit_my_type_all_body_types` |
| `SEXUAL_POSITION` | 7 | `R.string.edit_my_type_all_positions` |
| `MEET_AT` | 8 | `R.string.edit_my_type_all_meet_at` |
| `ACCEPT_NSFW_PICS` | 9 | `R.string.edit_my_type_all_accept_nsfw_pics` |

## D.2 SoundType

Notification sound types:

| Value | rawId |
|-------|-------|
| `RECEIVE_CHAT` | `R.raw.receive_chat` |
| `SEND_CHAT` | `R.raw.send_chat` |
| `RECEIVE_CHAT_BUT_NOT_CHATTING_WITH_THEM` | `R.raw.receive_chat_but_not_chatting_with_them` |
| `CASCADE_REFRESH` | `R.raw.refresh` |

## D.3 ChatType (from ChatConstant)

```kotlin
enum class ChatType {
    // Inner enum within ChatConstant
    // Values not fully decompiled but referenced throughout codebase
}
```

## D.4 ChatStatusInt (from ChatConstant)

```kotlin
enum class ChatStatusInt {
    // Inner enum for chat message delivery status integers
}
```

## D.5 AudioStatus (from ChatConstant)

```kotlin
enum class AudioStatus {
    // Inner enum for audio message playback status
}
```

## D.6 ChatRoomPhotoFilter (from ChatConstant)

```kotlin
enum class ChatRoomPhotoFilter {
    // Inner enum for filtering photos in chat room view
}
```

## D.7 EntryMethod (from ChatConstant)

Chat entry point tracking:

```kotlin
enum class EntryMethod {
    // Values track how user entered the chat:
    // ENTRY_CAROUSEL, ENTRY_CASCADE, ENTRY_CIRCLE, ENTRY_CREATE_GROUP,
    // ENTRY_GROUP_INVITE_LINK, ENTRY_INBOX, ENTRY_INDIVIDUAL_CHAT,
    // ENTRY_NOTHING, ENTRY_NOTIFICATION, ENTRY_PROFILE,
    // ENTRY_REMOTE_CASCADE, ENTRY_REMOTE_PROFILE,
    // ENTRY_SEARCH_INBOX, ENTRY_SHARE_IMAGE_INBOX,
    // ENTRY_SHARE_TEXT_INBOX, ENTRY_VIEWED_ME
}
```

## D.8 MessageEntry (from ChatConstant)

Message interaction tracking:

| Constant | Value |
|----------|-------|
| `MESSAGE_ENTRY_STANDARD` | Normal tap to open |
| `MESSAGE_ENTRY_LONG_PRESS` | Long press menu |
| `MESSAGE_ENTRY_SWIPE` | Swipe action |

## D.9 ApplicationStatus (from CircleService)

```kotlin
// Used in circle/ group membership application tracking
// Referenced in ApplicationStatusAdapter
```

## D.10 VendorTokenType

Annotation-based type (not an enum with values). Used for vendor token classification.

## D.11 MediaErrorStatus

Referenced in `MediaErrorStatusAdapter.java` -- used for media upload/download error classification.

## D.12 NeoErrorStatus

Referenced in `NeoErrorStatusAdapter.java` -- API error status codes.

---

# APPENDIX E: XMPP CONNECTION AND MESSAGE FORMAT

## E.1 ConnectionSettings (XMPP Connection Config)

```kotlin
data class ConnectionSettings(
    val host: String,           // XMPP server hostname
    val domain: String,         // XMPP domain (e.g., "grindr.com")
    val port: Int,              // XMPP port (typically 5222 for TCP)
    val address: InetAddress?,  // Resolved IP address
    val secure: Boolean,        // TLS enabled
    val user: String?,          // User JID
    val resourcePart: Resourcepart?, // Client resource identifier
    val token: String           // Auth token for XMPP authentication
)
```

## E.2 XMPP Connection Flow

```
1. Bootstrap API returns XMPP config (host, domain, port, token)
2. ConnectionSettings created from bootstrap data
3. SimplifiedXMPPTCPConnectionConfigurationFactory builds Smack config
4. XMPPTCPConnection established with TLS
5. AccountManager authenticates with token
6. Smack Stream Management enabled (ack/resume)
7. ReconnectManager monitors connection state
8. ChatStateManager manages composing/paused states
```

## E.3 XMPP Connection States (Reason hierarchy)

**Connect Reasons:**
- `Reason.Connect.Debug` -- Debug/forced connection
- `Reason.Connect.Reconnect` -- Auto-reconnection
- `Reason.Connect.MessageSend` -- Connect to send pending message
- `Reason.Connect.Lockout` -- Lockout expired, reconnecting

**Disconnect Reasons:**
- `Reason.Disconnect.Debug` -- Debug/forced disconnect
- `Reason.Disconnect.Logout` -- User logged out
- `Reason.Disconnect.Lockout` -- Too many failed attempts
- `Reason.Disconnect.Reconnect` -- Reconnecting to new server
- `Reason.Disconnect.UserBanned` -- Account banned
- `Reason.Disconnect.EnterBackground` -- App backgrounded
- `Reason.Disconnect.SessionRefreshFail` -- Token refresh failed
- `Reason.Disconnect.PingFail` -- Server ping timeout
- `Reason.Disconnect.FromError(Throwable)` -- Error-caused disconnect with throwable

## E.4 SendMessageResult

```kotlin
sealed class SendMessageResult {
    data class Success(val data: Any) : SendMessageResult()
    data class Failure(val params: SendMessageParams, val error: Throwable?) : SendMessageResult()
}
```

## E.5 Chat Message Types (BACKUP_MESSAGE_IGNORED_TYPES)

These are system message types excluded from chat backup:

| Message Type String | Purpose |
|---------------------|---------|
| `"braze_message"` | Marketing/push notification |
| `"tap_sent"` | Tap sent notification |
| `"tap_receive"` | Tap received notification |
| `"groupchat:invite"` | Group invite system message |
| `"groupchat:join"` | Group join system message |
| `"groupchat:leave"` | Group leave system message |
| `"groupchat:create"` | Group creation system message |
| `"groupchat:create_circle"` | Circle creation system message |
| `"groupchat:group_name_changed"` | Group rename system message |
| `"groupchat:owner_changed"` | Group ownership transfer |
| `"groupchat:invitees_changed"` | Group invite list changed |
| `"groupchat:decline"` | Group invite declined |
| `"groupchat:group_deleted"` | Group deleted system message |
| `"videocall:connect"` | Video call initiated |
| `"videocall:accept"` | Video call accepted |
| `"videocall:decline"` | Video call declined |
| `"videocall:hangoff"` | Video call ended |
| `"videocall:busy"` | Video call target busy |

## E.6 Chat Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| `AUDIOCALL_MESSAGE_PREFIX` | (string) | Prefix for audio call messages |
| `VIDEOCALL_MESSAGE_PREFIX` | (string) | Prefix for video call messages |
| `GROUP_CHAT_DOMAIN_PREFIX` | (string) | MUC domain prefix |
| `DEFAULT_FREE_USER_MAX_CREATE_GROUP_COUNT` | (int) | Free user group limit |
| `DEFAULT_XTRA_USER_MAX_CREATE_GROUP_COUNT` | (int) | XTRA user group limit |
| `DEFAULT_MAX_INVITE_MEMBERS` | (int) | Max members per group invite |
| `OFFLINE_MESSAGE_BATCH_SIZE` | (int) | Batch size for offline message sync |
| `SHARE_CHAT_MAXIMUM` | (int) | Max chats for share action |
| `ERROR_GROUP_NOT_EXIST` | (string) | Error: group not found |
| `ERROR_USER_NOT_A_MEMBER` | (string) | Error: not a group member |

---

# APPENDIX F: MESSAGE FLOW DIAGRAMS

## F.1 Text Message Send Flow

```
User types message
    |
    v
ChatSendLocalMessageHandler
    |-- Stores message in Room DB (status: SENDING)
    |-- Updates UI immediately (optimistic)
    |
    v
MessageSender
    |-- Builds XMPP message stanza
    |-- Sets recipient JID
    |-- Sets message body
    |-- Sets timestamp from ServerTime
    |
    v
GrindrXMPPManager.send(message)
    |-- Checks connection state
    |-- If disconnected: FailedSendMessageManager queues for retry
    |-- If connected: sends via XMPPTCPConnection
    |
    v
Smack Stream Management
    |-- Server acknowledges receipt (Stream Ack)
    |-- MessageSentAckListener fires
    |
    v
MessageSentListener
    |-- Updates Room DB status: SENT
    |-- UI updates checkmark
    |
    v
Recipient receives via XMPP
    |-- MessageReceivedListener fires
    |-- ChatReceivedMessageHandler processes
    |-- Stored in Room DB (status: RECEIVED)
    |
    v
Delivery Receipt (XEP-0184)
    |-- Recipient sends <received> stanza
    |-- ChatMarkerManager processes receipt
    |-- Updates Room DB status: DELIVERED
    |
    v
Display Receipt (XEP-0333)
    |-- When recipient opens chat
    |-- ChatMarkerMessageManager sends <displayed> marker
    |-- Updates Room DB status: DISPLAYED
```

## F.2 Message Retraction (Delete for Everyone)

```
User long-presses message -> Delete
    |
    v
RecallMessageManager
    |-- RetractionManager builds retraction stanza
    |-- Sends XMPP retraction message
    |
    v
Recipient receives retraction
    |-- Message deleted from their Room DB
    |-- UI updates to show "Message retracted"
```

## F.3 Group Chat Message Flow

```
User sends message to group
    |
    v
GrindrXMPPManager
    |-- Resolves group JID: {groupId}@{GROUP_CHAT_DOMAIN_PREFIX}
    |-- Sends via MUC (Multi-User Chat)
    |
    v
Smack MUC Extension
    |-- Message broadcast to all group members
    |-- Each member's client receives independently
    |
    v
System messages for group events:
    |-- "groupchat:create"  -- Group created
    |-- "groupchat:invite"  -- Member invited
    |-- "groupchat:join"    -- Member joined
    |-- "groupchat:leave"   -- Member left
    |-- "groupchat:decline" -- Invite declined
    |-- "groupchat:group_name_changed" -- Renamed
    |-- "groupchat:owner_changed"      -- Owner changed
    |-- "groupchat:invitees_changed"   -- Invite list changed
    |-- "groupchat:group_deleted"      -- Group deleted
```

## F.4 Presence Flow (WebSocket)

```
App connects to /session/websocket
    |
    v
PhoenixSocketAdapter
    |-- WebSocket connection established
    |-- Auth token sent in initial frame
    |
    v
Presence updates:
    |-- User comes online  -> presence: "online"
    |-- User goes offline  -> presence: "offline"
    |-- User typing        -> chatstate: "composing"
    |-- User stopped typing -> chatstate: "paused"
    |
    v
Online status displayed in cascade/grid
```

---

# APPENDIX G: ADDITIONAL REST SERVICES

## G.1 GrindrFileRestService

- Base URL: `{scheme}://{host}:{port}{path}` (from `BootstrapPref`)
- Purpose: File uploads (profile photos, chat images) and downloads
- Supports: Photo upload, photo approval status, pending photos
- Methods: Upload profile images, upload chat images, upload audio, upload video

## G.2 AudioDownloadService

- Base URL: Dynamic URL from `GrindrData`
- Purpose: Audio message file downloads
- Method: `GET {mediaHash}` -> `Response<ResponseBody>`

## G.3 VideoDownloadService

- Base URL: Dynamic URL from `GrindrData`
- Purpose: Video message file downloads
- Method: `GET {mediaHash}` -> `Response<ResponseBody>`

## G.4 GaymojiService

- Base URL: Dynamic URL from `GrindrData`
- Purpose: Gaymoji/emoji content delivery
- Methods:
  - `GET /categories` -> `GaymojiResponse` (contains `List<GaymojiCategory>`)
  - `GET /gaymojis` -> `GaymojiResponse` (contains `List<GaymojiItem>`)
- Caching: HTTP cache enabled, items filtered by `expiredTime`

## G.5 SpotifyRestService

- Purpose: Spotify music search and integration
- Methods: Search tracks, get artist info

## G.6 SpotifyBackendRestService

- Purpose: Backend Spotify integration (song-on-profile)

## G.7 SpotifyAuthRestService

- Purpose: Spotify OAuth token exchange

## G.8 GiphyService

- Purpose: GIF search integration

## G.9 GoogleAccessTokenService

- Purpose: Google OAuth token exchange

## G.10 UnauthedBootstrapRestService

- Purpose: Bootstrap configuration (no auth required)
- Returns: Server URLs, XMPP config, feature flags, etc.

## G.11 UnauthedFeatureConfigRestService

- Purpose: Feature configuration (no auth required)

## G.12 UnauthedClientLogRestService

- Purpose: Client-side logging (no auth required)

## G.13 AuthedClientLogRestService

- Purpose: Authenticated client-side logging

## G.14 AuthedBootstrapRestService

- Purpose: Authenticated bootstrap refresh

## G.15 AuthedFeatureConfigRestService

- Purpose: Authenticated feature configuration refresh

## G.16 RefreshSessionRestService

- Purpose: Token refresh on 401

## G.17 NewOnBoardingRestService

- Purpose: New user onboarding flow

## G.18 SmsVerificationService

- Purpose: Phone number SMS verification

## G.19 ConsumablesService

- Purpose: In-app purchase consumables (Boosts)

## G.20 InstagramAuthService

- Purpose: Instagram OAuth integration

## G.21 InstagramGraphService

- Purpose: Instagram Graph API integration

---

# APPENDIX H: CIRCUIT BREAKER PATTERN

Grindr implements a **Resilience4j-style Circuit Breaker** for API calls:

```
CircuitBreakerRegistry
    |-- CircuitBreakerConfig
    |   |-- failureRateThreshold
    |   |-- waitDurationInOpenState
    |   |-- slidingWindowSize
    |   |-- minimumNumberOfCalls
    |
    v
CircuitBreaker (per endpoint)
    |-- ClosedState    (normal, counting failures)
    |-- OpenState      (failing, reject calls)
    |-- HalfOpenState  (testing, allow sample calls)
    |
    v
CircuitBreakerDecoratedCall
    |-- Wraps Retrofit Call
    |-- On failure: increments metrics
    |-- On threshold: transitions state
    |
    v
CircuitBreakerCallAdapterFactory
    |-- Injects into Retrofit service creation
```

**Exception:** `CircuitBreakerOpenException` thrown when circuit is open.

---

# APPENDIX I: API INTERCEPTOR CHAIN (Complete)

## I.1 Request Interceptors (in order)

1. **HeaderRequestInterceptor** -- Adds auth headers (`Authorization: Grindr3 {token}`)
2. **SessionResponseInterceptor** -- Token refresh on 401, retry logic
3. **PreconditionResponseInterceptor** -- Handles precondition failures
4. **BackgroundRestrictionInterceptor** -- Manages background API restrictions
5. **BannedResponseInterceptor** -- Handles banned account responses

## I.2 Authentication Flow

```
Request -> HeaderRequestInterceptor
    |-- Adds: Authorization: Grindr3 {sessionToken}
    |-- Adds: L-Time-Zone, L-Grindr-Roles, L-Device-Info
    |-- Adds: Accept: application/json, User-Agent, L-Locale, Accept-language
    |
    v
Response <- SessionResponseInterceptor
    |-- If 401:
    |   |-- RefreshTokenHelper attempts token refresh
    |   |-- RefreshTokenRetryController manages retry
    |   |-- On success: retry original request with new token
    |   |-- On failure: redirect to login
    |-- Tracks session expiry with 180-second window
    |-- Logs expired session events to analytics
```

---

# APPENDIX J: FEATURE CONFIG SYSTEM

## J.1 FeatureConfigManager

- Interface: `FeatureConfigManager`
- Access pattern: `FeatureConfigManager.isFeatureEnabled(configName)`
- Debug UI: `DebugFeatureFlagsActivity`, `DebugFeatureConfigActivity`
- Config sources:
  - `UnauthedFeatureConfigRestService` (pre-login)
  - `AuthedFeatureConfigRestService` (post-login)
- Migration: `FeatureConfigManagerMigrateHelper` / `FeatureConfigManagerMigrateHelperImpl`

## J.2 Known Feature Flags (from code references)

| Flag | Purpose |
|------|---------|
| `isHashtagsFeatureFlagEnabled` | Enables hashtag system on profiles |
| `Feature.MyTypeFilters.isGranted()` | Premium filter access (XTRA/Unlimited) |
| Various `Feature.*` flags | Control feature rollouts |

## J.3 Experiments System

- Interface: `IExperimentsManager`
- Injected into UI fragments for A/B testing
- Referenced in `EditProfileFragment` and other UI components

---

# APPENDIX K: SUBSCRIPTION TIERS AND ENTITLEMENTS

## K.1 Tier Hierarchy

| Tier | Role | Entitlements |
|------|------|-------------|
| **Free** | Default | Basic cascade (limited profiles), basic filters, limited group creation |
| **XTRA** | `Role.XTRA` | Premium filters (MyType), online now, unlimited scrolling, saved phrases, ad-free |
| **Unlimited** | `Role.UNLIMITED` | All XTRA + video chat (300 min/month), unlimited profiles, incognito mode |

## K.2 Billing Integration

- **Play Billing v3** (`com.google.android.play.billingclient.version=3.0.0`)
- **Store UI:** `StoreActivity` with `storeV2Xtra*` resources
- **Store Helper:** `StoreV2Helper` manages purchase flow
- **Purchase Sources (analytics tracking):**
  - `PURCHASE_SOURCE_DEEP_LINK`
  - `PURCHASE_SOURCE_VIDEO_CALL_FREE_ASK_XTRA`
  - `PURCHASE_SOURCE_VIDEO_CALL_XTRA_ASK_UNLIMITED`
  - `PURCHASE_SOURCE_FAVORITE`
  - `PURCHASE_SOURCE_INCOGNITO`

## K.3 Feature Access Logic

```kotlin
// From HomeActivity.java
return if (Feature.MyTypeFilters.isGranted()) {
    "TAG_FILTER_CASCADE_EXTRA"   // Premium filters available
} else {
    "TAG_FILTER_CASCADE_FREE"    // Basic filters only
}

// From StoreV2Helper.java
val role = when {
    isFreeUser || isNoXtraUpsell -> Role.XTRA
    isUnlimitedFeature(source)   -> Role.UNLIMITED
    else                         -> Role.XTRA
}
```

## K.4 Consumable Purchases (Boost)

- Not a subscription -- one-time purchase
- `ConsumablesService` manages consumable SKUs
- Activities: `BoostBuyActivity`, `BoostBundleBuyActivity`, `BoostUseActivity`, `BoostReportActivity`
- Theme: `ConsumablePurchaseTheme`
- Incognito interaction: Boost stops when going incognito

---

# APPENDIX L: CHAT CONSTANTS (Group Limits)

| Constant | Free User | XTRA User |
|----------|-----------|-----------|
| `DEFAULT_FREE_USER_MAX_CREATE_GROUP_COUNT` | (int) | -- |
| `DEFAULT_XTRA_USER_MAX_CREATE_GROUP_COUNT` | -- | (int) |
| `DEFAULT_MAX_INVITE_MEMBERS` | (int) | (int) |

---

# APPENDIX M: ERROR HANDLING

## M.1 API Error Types

- `NeoErrorStatus` -- Standard API error status
- `MediaErrorStatus` -- Media upload/download errors
- `ProfileUnavailableException` -- Profile not accessible
- `UnrecognizedNeoErrorException` -- Unknown error format
- `CircuitBreakerOpenException` -- Circuit breaker tripped
- `UnrecognizedCircleStatusErrorException` -- Circle status unknown
- `BackgroundRestrictionException` -- Background restriction active

## M.2 XMPP Error Handling

- `AuthErrorCounter` -- Tracks consecutive auth failures
- `FailedSendMessageManager` -- Queues failed messages for retry
- `ReconnectManager` -- Auto-reconnect with exponential backoff
- `ExponentialSocketReconnectionStrategy` -- Backoff implementation

---

# APPENDIX N: WEBSOCKET PRESENCE SYSTEM

## N.1 PhoenixSocketAdapter

- Uses Phoenix channels (Elixir/Phoenix WebSocket framework)
- `SocketReconnectionStrategy` -- Reconnection logic
- `ExponentialSocketReconnectionStrategy` -- Exponential backoff
- `ExponentialBackoffUtils` -- Backoff calculation utilities

## N.2 Presence Protocol

```
WebSocket connect -> /session/websocket
    |-- Auth token in initial handshake
    |-- Subscribe to presence channel
    |
    v
Presence updates broadcast:
    |-- Online/offline status
    |-- Typing indicators
    |-- Location updates (when permitted)
```

---

# APPENDIX O: ANALYTICS AND TRACKING

## O.1 Analytics Providers

| Provider | Class | Purpose |
|----------|-------|---------|
| Firebase Analytics | `FirebaseAnalytics` | Event tracking |
| Grindr Analytics | `GrindrAnalytics` | Internal analytics |
| Anonymous Analytics | `AnonymousAnalytics` | Non-PII tracking |
| AppsFlyer | `GrindrAppsFlyer` | Install attribution |
| Braze | (via Appboy SDK) | Push/marketing |
| MoPub Analytics | `MoPubAnalyticsAdapter` | Ad analytics |

## O.2 Key Tracking Events

- `MeasureAction` -- User action tracking
- `OnboardingHelper` -- Onboarding funnel events
- `ClientLogHelper` -- Client-side error/event logging
- `DeviceInfo` -- Device metadata for analytics
- `DurationRecorder` -- Session duration tracking

---

# APPENDIX P: SOURCE FILE PATHS (Key Classes)

| File Path | Class | Purpose |
|-----------|-------|---------|
| `com/grindrapp/android/api/ApiRestService.java` | `ApiRestService` | Main REST API interface (60+ endpoints) |
| `com/grindrapp/android/api/LoginRestService.java` | `LoginRestService` | Auth REST API interface |
| `com/grindrapp/android/api/GrindrRestService.java` | `GrindrRestService` | High-level API wrapper |
| `com/grindrapp/android/api/HeaderRequestInterceptor.java` | `HeaderRequestInterceptor` | Auth header injection |
| `com/grindrapp/android/api/SessionResponseInterceptor.java` | `SessionResponseInterceptor` | Token refresh logic |
| `com/grindrapp/android/xmpp/GrindrXMPPManager.java` | `GrindrXMPPManager` | XMPP connection manager |
| `com/grindrapp/android/xmpp/ConnectionSettings.java` | `ConnectionSettings` | XMPP connection config |
| `com/grindrapp/android/xmpp/MessageSender.java` | `MessageSender` | XMPP message sending |
| `com/grindrapp/android/xmpp/ChatMessageManager.java` | `ChatMessageManager` | Chat message processing |
| `com/grindrapp/android/xmpp/ReconnectManager.java` | `ReconnectManager` | XMPP auto-reconnect |
| `com/grindrapp/android/xmpp/Reason.java` | `Reason` | Connect/disconnect reason hierarchy |
| `com/grindrapp/android/xmpp/SendMessageResult.java` | `SendMessageResult` | Message send outcome |
| `com/grindrapp/android/model/BaseProfile.java` | `BaseProfile` | Profile data model |
| `com/grindrapp/android/model/GrindrSettings.java` | `GrindrSettings` | User settings model |
| `com/grindrapp/android/model/DirtyFieldType.java` | `DirtyFieldType` | Profile filter enums |
| `com/grindrapp/android/model/SoundType.java` | `SoundType` | Notification sound enums |
| `com/grindrapp/android/ui/chat/ChatConstant.java` | `ChatConstant` | Chat system constants |
| `com/grindrapp/android/api/circuitbreaker/CircuitBreaker.java` | `CircuitBreaker` | API resilience pattern |
| `com/grindrapp/android/api/retrofit/RetrofitFactory.java` | `RetrofitFactory` | Retrofit instance creation |
| `com/grindrapp/android/GrindrApplication.java` | `GrindrApplication` | App entry point |

---

# APPENDIX Q: REVISION NOTES

**Appended:** 2026-08-14
**Analyst:** ZCode Quantum Reverse Engineering Analyst
**Source:** JADX decompilation of Grindr 7.5.0 APK (`com.grindrapp.android`)
**Files analyzed:** 2,582 Grindr-specific Java files + 9,139 library files = 11,721 total

**What this appendix addresses (from QUANTUM-ANALYSIS-CRITIQUE.md):**

| Critique Gap | Status | Appendix |
|-------------|--------|----------|
| No API method documentation | RESOLVED | A.1-A.24 (complete Retrofit definitions) |
| No database schema | PARTIAL | (Room entities not in JADX output -- obfuscated) |
| No XMPP message formats | RESOLVED | E.1-E.6 (connection, states, message types) |
| No profile data model | RESOLVED | C (BaseProfile with 22 fields) |
| No message flow documentation | RESOLVED | F.1-F.4 (send, retraction, group, presence) |
| No enum types | RESOLVED | D.1-D.12 (12 enum types documented) |
| No error code documentation | RESOLVED | M.1-M.2 (API and XMPP errors) |
| No feature flag documentation | RESOLVED | J.1-J.3 (feature config system) |
| No subscription tier details | RESOLVED | K.1-K.4 (Free/XTRA/Unlimited) |
| No code examples | RESOLVED | F.1-F.4 (flow diagrams with pseudocode) |

**Remaining gaps:**
- Room database CREATE TABLE statements (Room annotations not present in JADX output; WCDB used instead of standard Room)
- Exact WebSocket message JSON format (binary protocol, not visible in static analysis)
- Smack library version (still ambiguous from `org.jivesoftware.smack/version3` directory)

---

# APPENDIX R: UX/UI COMPONENT ANALYSIS

> Extracted from JADX-decompiled Grindr 7.5.0 APK sources
> Source directory: `com/grindrapp/android/ui/` (822 UI Java files)
> Activities: 105 | Fragments: 83 | Adapters: 60+ | ViewModels: 40+ | Dialogs: 40+

---

## R.1 COMPLETE SCREEN INVENTORY (105 Activities)

### R.1.1 Auth & Onboarding (14 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `LandingActivity` | `ui/account/onboard/LandingActivity.java` | Initial landing/splash screen |
| `LandingEmailActivity` | `ui/account/onboard/LandingEmailActivity.java` | Email login entry |
| `LandingPhoneActivity` | `ui/account/onboard/LandingPhoneActivity.java` | Phone login entry |
| `LandingForgotPwdActivity` | `ui/account/onboard/LandingForgotPwdActivity.java` | Forgot password flow |
| `LandingSMSVerifyActivity` | `ui/account/onboard/LandingSMSVerifyActivity.java` | SMS verification |
| `SmsCountryPickerActivity` | `ui/account/onboard/SmsCountryPickerActivity.java` | Country code picker |
| `LoginActivity` | `ui/login/LoginActivity.java` | Main login screen |
| `CreateAccountEmailActivity` | `ui/account/signup/CreateAccountEmailActivity.java` | Email registration |
| `SMSVerifyActivity` | `ui/account/sms/SMSVerifyActivity.java` | SMS code verification |
| `RegisterProfileActivity` | `ui/account/RegisterProfileActivity.java` | Profile creation |
| `ThirdPartyLoginProfileActivity` | `ui/login/ThirdPartyLoginProfileActivity.java` | Social login profile setup |
| `AccountVerifyActivity` | `ui/account/verify/AccountVerifyActivity.java` | Account verification |
| `CredentialsChangedActivity` | `ui/login/CredentialsChangedActivity.java` | Password change confirmation |
| `NewOnBoardingUpsellActivity` | `ui/newonboarding/NewOnBoardingUpsellActivity.java` | Post-signup upsell |

### R.1.2 Home & Navigation (4 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `HomeActivity` | `ui/home/HomeActivity.java` | Main app shell (bottom nav, tabs) |
| `IntentEntryActivity` | `ui/home/IntentEntryActivity.java` | Deep link handler/router |
| `PackageCorruptedActivity` | `ui/home/PackageCorruptedActivity.java` | Package integrity error |
| `WebViewActivity` | `ui/web/WebViewActivity.java` | In-app browser |

### R.1.3 Profile & Browse (8 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `BaseCruiseActivityV2` | `ui/profileV2/BaseCruiseActivityV2.java` | Base profile card viewer |
| `ExploreCruiseActivityV2` | `ui/profileV2/ExploreCruiseActivityV2.java` | Explore profile viewer |
| `StandaloneCruiseActivityV2` | `ui/profileV2/StandaloneCruiseActivityV2.java` | Standalone profile viewer |
| `LocalCruiseActivity` | `ui/profileV2/LocalCruiseActivity.java` | Local profile viewer |
| `ViewedMeCruiseActivityV2` | `ui/profileV2/ViewedMeCruiseActivityV2.java` | Viewed-me profile viewer |
| `EditProfileActivity` | `ui/editprofile/EditProfileActivity.java` | Profile editing |
| `ExploreCascadeActivity` | `ui/explore/ExploreCascadeActivity.java` | Explore grid view |
| `ExploreMapActivity` | `ui/explore/ExploreMapActivity.java` | Explore map view |

### R.1.4 Chat & Messaging (9 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `ChatActivityV2` | `ui/chat/ChatActivityV2.java` | Main chat screen |
| `ShareToChatActivity` | `ui/chat/ShareToChatActivity.java` | Share content to chat |
| `ShareChatMessageActivity` | `ui/chat/ShareChatMessageActivity.java` | Share specific message |
| `ChatCreateGroupActivity` | `ui/chat/group/invite/ChatCreateGroupActivity.java` | Create group chat |
| `GroupChatDetailsActivity` | `ui/chat/group/detail/GroupChatDetailsActivity.java` | Group chat settings |
| `BlockedMembersActivity` | `ui/chat/group/block/BlockedMembersActivity.java` | Blocked group members |
| `InviteMembersActivity` | `ui/chat/group/invite/InviteMembersActivity.java` | Invite to group |
| `IndividualUnblockActivity` | `ui/block/IndividualUnblockActivity.java` | Unblock user |
| `SearchInboxActivity` | `ui/inbox/search/SearchInboxActivity.java` | Search conversations |

### R.1.5 Media & Photos (8 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `FullScreenExpiringImageActivity` | `ui/photos/FullScreenExpiringImageActivity.java` | View expiring photo |
| `FullScreenImageActivity` | `ui/photos/FullScreenImageActivity.java` | View full-screen photo |
| `ChatRoomPhotosActivity` | `ui/photos/ChatRoomPhotosActivity.java` | Chat photo gallery |
| `CropImageActivity` | `ui/photos/CropImageActivity.java` | Photo cropping |
| `PhotoDecorationActivity` | `ui/photodecoration/PhotoDecorationActivity.java` | Photo editing/decoration |
| `EditPhotosActivity` | `ui/photos/EditPhotosActivity.java` | Photo management |
| `PrivateVideoCaptureActivity` | `ui/video/PrivateVideoCaptureActivity.java` | Private video recording |
| `PrivateVideoPlayerActivity` | `ui/video/PrivateVideoPlayerActivity.java` | Private video playback |

### R.1.6 Video Call & Roulette (5 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `VideoCallActivity` | `ui/videocall/VideoCallActivity.java` | Video call screen (singleTask) |
| `VideoCallDialogActivity` | `ui/videocall/VideoCallDialogActivity.java` | Video call dialog/incoming |
| `VideoMatchActivity` | `ui/videocall/VideoMatchActivity.java` | Video match screen |
| `VideoRouletteActivity` | `ui/videocall/VideoRouletteActivity.java` | Video roulette screen |
| `VideoRouletteGuideActivity` | `ui/videocall/VideoRouletteGuideActivity.java` | Roulette tutorial |

### R.1.7 Settings (11 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `SettingsActivity` | `ui/settings/SettingsActivity.java` | Main settings |
| `SettingsDeleteProfileActivity` | `ui/settings/SettingsDeleteProfileActivity.java` | Delete account |
| `SettingsDeleteProfileReasonActivity` | `ui/settings/SettingsDeleteProfileReasonActivity.java` | Delete reason |
| `SettingsDeleteProfileOtherReasonActivity` | `ui/settings/SettingsDeleteProfileOtherReasonActivity.java` | Custom delete reason |
| `SettingsDeactivateActivity` | `ui/settings/SettingsDeactivateActivity.java` | Deactivate account |
| `NotificationSettingsActivity` | `ui/settings/NotificationSettingsActivity.java` | Notification prefs |
| `DoNotDisturbSettingsActivity` | `ui/settings/DoNotDisturbSettingsActivity.java` | DND schedule |
| `PrivacySettingsActivity` | `ui/settings/PrivacySettingsActivity.java` | Privacy controls |
| `PinSettingsActivity` | `ui/pin/PinSettingsActivity.java` | PIN management |
| `SetPinActivity` | `ui/pin/SetPinActivity.java` | Set PIN |
| `PinLockActivity` | `ui/pin/PinLockActivity.java` | PIN lock screen |

### R.1.8 Subscription & Store (5 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `StoreActivity` | `store/ui/StoreActivity.java` | Main store/subscription screen |
| `SubscriptionManagementActivity` | `ui/subscription/SubscriptionManagementActivity.java` | Manage subscription |
| `PurchaseDirectlyActivity` | `ui/subscription/PurchaseDirectlyActivity.java` | Direct purchase |
| `UpgradeConfirmationActivity` | `ui/subscription/UpgradeConfirmationActivity.java` | Upgrade confirmation |
| `BoostBuyActivity` / `BoostBundleBuyActivity` | `ui/boost/BoostBuyActivity.java` | Boost purchase |

### R.1.9 Social Features (6 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `CircleCreateActivity` | `ui/circle/CircleCreateActivity.java` | Create circle |
| `CircleInviteActivity` | `ui/circle/CircleInviteActivity.java` | Invite to circle |
| `EventCalendarActivity` | `ui/eventcalendar/EventCalendarActivity.java` | Events calendar |
| `SpotifyActivity` | `ui/spotify/SpotifyActivity.java` | Spotify integration |
| `ViewedMeActivity` | `ui/viewedme/ViewedMeActivity.java` | Who viewed me |
| `PinInputActivity` | `ui/pin/PinInputActivity.java` | PIN input |

### R.1.10 Report & Safety (7 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `ReportProfileActivity` | `ui/report/ReportProfileActivity.java` | Report user (multi-step) |
| `BackupActivity` | `ui/backup/BackupActivity.java` | Chat backup |
| `RestoreActivity` | `ui/restore/RestoreActivity.java` | Chat restore |
| `RequestDataActivity` | `ui/requestdata/RequestDataActivity.java` | GDPR data request |
| `ChangePasswordActivity` | `ui/account/changepwd/ChangePasswordActivity.java` | Change password |
| `UpdateEmailActivity` | `ui/account/UpdateEmailActivity.java` | Update email |
| `ForgotPasswordActivity` | `ui/password/ForgotPasswordActivity.java` | Forgot password |

### R.1.11 Debug & Error (10 Activities)

| Activity | File Path | Purpose |
|----------|-----------|---------|
| `DebugToolsActivity` | `ui/debugtool/DebugToolsActivity.java` | Debug tools |
| `DebugFeatureFlagsActivity` | `ui/debugtool/DebugFeatureFlagsActivity.java` | Feature flag viewer |
| `DebugFeatureConfigActivity` | `ui/debugtool/DebugFeatureConfigActivity.java` | Feature config viewer |
| `DebugOneTrustStringActivity` | `ui/debugtool/DebugOneTrustStringActivity.java` | OneTrust debug |
| `DebugSDKPermissionActivity` | `ui/debugtool/DebugSDKPermissionActivity.java` | SDK permissions debug |
| `DebugInstagramConnectionActivity` | `ui/debugtool/instagram/DebugInstagramConnectionActivity.java` | Instagram debug |
| `BannedActivity` | `ui/account/banned/BannedActivity.java` | Account banned |
| `DeprecationActivity` | `ui/account/banned/DeprecationActivity.java` | App deprecated |
| `CertFailActivity` | `ui/account/cert/CertFailActivity.java` | Certificate failure |
| `BootstrapFailActivity` | `ui/account/BootstrapFailActivity.java` | Bootstrap failure |

---

## R.2 COMPLETE FRAGMENT INVENTORY (83 Fragments)

### R.2.1 Core Navigation Fragments

| Fragment | File Path | Purpose |
|----------|-----------|---------|
| `CascadeFragment` | `ui/cascade/CascadeFragment.java` | Main grid/browse view |
| `InboxFragment` | `ui/inbox/InboxFragment.java` | Messages inbox |
| `ConversationsFragment` | `ui/inbox/ConversationsFragment.java` | Conversation list |
| `TapsFragment` | `ui/inbox/TapsFragment.java` | Taps list |
| `FavoritesFragment` | `ui/favorites/FavoritesFragment.java` | Favorites grid |
| `ViewedMeFragment` | `ui/viewedme/ViewedMeFragment.java` | Who viewed me |
| `DrawerProfileFragmentV2` | `ui/drawer/DrawerProfileFragmentV2.java` | Profile drawer/sheet |

### R.2.2 Filter Drawer Fragments (12)

| Fragment | Purpose |
|----------|---------|
| `DrawerFilterFragment` | Base filter drawer |
| `DrawerFilterCascadeFreeFragment` | Free user cascade filters |
| `DrawerFilterCascadeExtraFragment` | XTRA cascade filters |
| `DrawerFilterCascadeExtraFragmentV2` | XTRA cascade filters v2 |
| `DrawerFilterExploreFreeFragment` | Free explore filters |
| `DrawerFilterExploreExtraFragment` | XTRA explore filters |
| `DrawerFilterFavoriteFragment` | Favorites filters |
| `DrawerFilterMessageFragment` | Message filters |
| `DrawerFilterProfilesFragment` | Profile filters |
| `DrawerFilterTapFragment` | Tap filters |
| `DrawerFilterBaseCascadeFreeFragment` | Base free cascade filter |
| `DrawerFilterBaseCascadeExtraFragment` | Base XTRA cascade filter |

### R.2.3 Chat Fragments (8)

| Fragment | Purpose |
|----------|---------|
| `ChatBaseFragmentV2` | Base chat fragment |
| `ChatIndividualFragment` | Individual chat |
| `ChatGroupFragmentV2` | Group chat |
| `ChatGiphySearchFragment` | GIF search in chat |
| `ShareFavoritesAdapter` | Share favorites in chat |
| `SavedPhrasesAdapter` | Quick phrases |
| `SavedPhrasesHorizontalAdapter` | Horizontal phrase picker |

### R.2.4 Explore Fragments (3)

| Fragment | Purpose |
|----------|---------|
| `ExploreCascadeFragment` | Explore grid |
| `ExploreMapFragment` | Explore map |
| `CircleExploreFragment` | Circle explore |

### R.2.5 Circle Fragments (4)

| Fragment | Purpose |
|----------|---------|
| `CircleFragment` | Circle main |
| `CircleJoinedFragment` | Joined circles |
| `CircleExploreFragment` | Browse circles |
| `CircleApplyDialogFragment` | Apply to circle |

### R.2.6 Profile & Edit Fragments (5)

| Fragment | Purpose |
|----------|---------|
| `EditProfileFragment` | Edit profile |
| `PhotoFieldsFragment` | Photo fields editor |
| `DrawerProfileFragmentV2` | Profile view drawer |
| `ThirdPartyLoginProfileFragment` | Social login profile |
| `LegalFragment` | Legal agreements |

### R.2.7 Settings Fragments (4)

| Fragment | Purpose |
|----------|---------|
| `DiscreetAppIconSettingsFragment` | App icon disguise |
| `PrivacySettingsActivity` | Privacy settings |
| `UpdateEmailFragment` | Email update |
| `ChangePasswordFragment` | Password change |

### R.2.8 Report Flow Fragments (7)

| Fragment | Purpose |
|----------|---------|
| `ReportProfileWhatFragment` | What happened |
| `ReportProfileWhereFragment` | Where it happened |
| `ReportProfileDetailsFragment` | Additional details |
| `ReportProfileAttachFragment` | Attach evidence |
| `ReportProfileSummaryFragment` | Review report |
| `ReportProfileSubmittedFragment` | Submission confirmation |
| `ReportProfileReasonFragment` | Report reason |

### R.2.9 Store Fragments (5)

| Fragment | Purpose |
|----------|---------|
| `XtraStoreFragment` | XTRA subscription store |
| `UnlimitedFragment` | Unlimited subscription |
| `StoreContainerFragment` | Store container |
| `UpsellDialogFragment` | Upsell popup |
| `PostAnimationFragment` | Post-purchase animation |

### R.2.10 Other Fragments (12)

| Fragment | Purpose |
|----------|---------|
| `WebViewFragment` | In-app web browser |
| `BackupFragment` | Chat backup |
| `OldSignatureBackupFragment` | Legacy backup |
| `NewOnBoardingDialogFragment` | Onboarding dialog |
| `MyTagDialogFragment` | Hashtag/tag editor |
| `SpotifySearchFragment` | Spotify search |
| `PhotoRejectionDialogFragment` | Photo rejection info |
| `AccountVerifyInputFragment` | Verification input |
| `AccountVerifyPinFragment` | Verification PIN |
| `AccountVerifyDoneFragment` | Verification complete |
| `LandingPageFragment` | Data request landing |
| `VerifyEmailFragment` / `VerifyPasswordFragment` | Data request verification |

---

## R.3 COMPONENT LIBRARY

### R.3.1 RecyclerView Adapters (60+)

#### Base Adapters

| Adapter | File Path | Purpose |
|---------|-----------|---------|
| `BaseCascadeAdapter` | `ui/base/BaseCascadeAdapter.java` | Base grid adapter |
| `BaseGrindrAdapter` | `ui/base/BaseGrindrAdapter.java` | Base app adapter |
| `RecyclerAdapterBase` | `ui/base/RecyclerAdapterBase.java` | Generic RecyclerView base |
| `GrindrRoomListAdapter` | `ui/base/GrindrRoomListAdapter.java` | Room-backed list adapter |
| `ViewTypesAdapter` | `ui/base/ViewTypesAdapter.java` | Multi-view-type adapter |
| `EmptyStateCascadeAdapter` | `ui/base/EmptyStateCascadeAdapter.java` | Empty state adapter |
| `ItemTapAdapter` | `ui/base/ItemTapAdapter.java` | Tap item adapter |

#### Cascade/Browse Adapters

| Adapter | Purpose |
|---------|---------|
| `CascadeAdapter` | Main cascade grid (profile cards) |
| `CruiseAdapterV2` | Profile card carousel |
| `ExploreAdapter` | Explore results |
| `ExploreSearchResultAdapter` | Search results |
| `ExploreSearchSuggestionAdapter` | Search suggestions |
| `ExploreRecentSearchAdapter` | Recent searches |
| `ViewedMeAdapter` | Who viewed me grid |
| `FavoritesProfileViewHolder` | Favorites grid item |
| `PhotoCascadeViewHolder` | Photo cascade item |
| `RatingCascadeItemViewHolder` | Rating cascade item |

#### Chat Adapters

| Adapter | Purpose |
|---------|---------|
| `ChatListAdapter` | Chat message list |
| `ChatLoaderAdapter` | Chat loading states |
| `ChatPhotosAdapter` | Chat photo gallery |
| `GiphyListAdapterV2` | GIF picker |
| `GaymojiListAdapter` | Gaymoji picker |
| `SavedPhrasesAdapter` | Quick phrases |
| `SavedPhrasesHorizontalAdapter` | Horizontal phrases |
| `ShareFavoritesAdapter` | Share favorites |
| `MoreMenuAdapter` | Chat more menu |
| `ConversationsAdapter` | Conversation list |
| `SelectConversationAdapter` | Multi-select conversations |
| `ShareInboxAdapter` | Share to inbox |

#### Group Chat Adapters

| Adapter | Purpose |
|---------|---------|
| `GroupChatDetailsAdapter` | Group member list |
| `InviteMembersAdapter` | Invite member list |
| `InviteMembersSelectedAdapter` | Selected invitees |
| `BlockedMembersAdapter` | Blocked members |

#### Store Adapters

| Adapter | Purpose |
|---------|---------|
| `StoreViewPagerAdapter` | Store tab pager |
| `XtraStoreProductListAdapter` | XTRA products |
| `UnlimitedProductListAdapter` | Unlimited products |
| `XtraStoreCarouselAdapter` | Store carousel |
| `UpsellAdapter` | Upsell items |
| `SubscriptionsListAdapter` | Subscription list |

#### Other Adapters

| Adapter | Purpose |
|---------|---------|
| `CircleAdapter` | Circles list |
| `CircleBannerAdapter` | Circle banners |
| `CircleInviteAdapter` | Circle invites |
| `TapsAdapter` | Taps list |
| `IndividualUnblockAdapter` | Unblock list |
| `BoostBundleAdapter` | Boost bundles |
| `ReportProfileReasonAdapter` | Report reasons |
| `ReportProfileDetailsAdapter` | Report details |
| `ReportProfileSummaryAdapter` | Report summary |
| `ReportProfileWhereAdapter` | Report locations |
| `SettingsDeleteProfileAllReasonAdapter` | Delete reasons |
| `SpotifySettingAdapter` | Spotify settings |
| `SpotifySongAdapter` | Spotify songs |
| `PhotoDecorationAdapter` | Photo decoration tools |
| `FilterAdapter` | Photo filters |
| `CutterAdapter` | Photo crop tools |
| `PaletteItemAdapter` | Color palette |
| `ToolsAdapter` | Editing tools |
| `DebugFeatureConfigAdapter` | Debug config |
| `DebugFeatureFlagsAdapter` | Debug flags |
| `PhotoRejectionAdapter` | Photo rejection reasons |
| `NewOnBoardingAdapter` | Onboarding pages |
| `NewOnBoardingUpsellAdapter` | Onboarding upsells |
| `VideoRouletteCarouselAdapter` | Video roulette |

### R.3.2 Dialog Components (40+)

#### Profile Attribute Dialogs

| Dialog | File Path | Purpose |
|--------|-----------|---------|
| `AgeRangeDialog` | `dialog/AgeRangeDialog.java` | Age range filter |
| `AgeProfileDialog` | `dialog/AgeProfileDialog.java` | Age on profile |
| `HeightRangeDialog` | `dialog/HeightRangeDialog.java` | Height range filter |
| `HeightProfileDialog` | `dialog/HeightProfileDialog.java` | Height on profile |
| `WeightRangeDialog` | `dialog/WeightRangeDialog.java` | Weight range filter |
| `WeightProfileDialog` | `dialog/WeightProfileDialog.java` | Weight on profile |
| `BodyTypesDialog` | `dialog/BodyTypesDialog.java` | Body type filter |
| `BodyTypeProfileDialog` | `dialog/BodyTypeProfileDialog.java` | Body type on profile |
| `TribesDialog` | `dialog/TribesDialog.java` | Tribe filter |
| `TribesProfileDialog` | `dialog/TribesProfileDialog.java` | Tribe on profile |
| `TribesRegProfileDialog` | `dialog/TribesRegProfileDialog.java` | Tribe registration |
| `LookingForDialog` | `dialog/LookingForDialog.java` | Looking-for filter |
| `LookingForProfileDialog` | `dialog/LookingForProfileDialog.java` | Looking-for on profile |
| `SexualPositionDialog` | `dialog/SexualPositionDialog.java` | Position filter |
| `SexualPositionProfileDialog` | `dialog/SexualPositionProfileDialog.java` | Position on profile |
| `MeetAtDialog` | `dialog/MeetAtDialog.java` | Meet-at filter |
| `MeetAtProfileDialog` | `dialog/MeetAtProfileDialog.java` | Meet-at on profile |
| `RelationshipStatusDialog` | `dialog/RelationshipStatusDialog.java` | Relationship filter |
| `RelationshipStatusProfileDialog` | `dialog/RelationshipStatusProfileDialog.java` | Relationship on profile |
| `EthnicityProfileDialog` | `dialog/EthnicityProfileDialog.java` | Ethnicity on profile |
| `HivStatusProfileDialog` | `dialog/HivStatusProfileDialog.java` | HIV status on profile |
| `LastTestedDateProfileDialog` | `dialog/LastTestedDateProfileDialog.java` | Last tested date |
| `AcceptNSFWPicsDialog` | `dialog/AcceptNSFWPicsDialog.java` | NSFW preference |
| `AcceptNSFWPicsProfileDialog` | `dialog/AcceptNSFWPicsProfileDialog.java` | NSFW on profile |
| `TestingReminderDialogBuilder` | `dialog/TestingReminderDialogBuilder.java` | Testing reminder |
| `TestingReminderProfileDialog` | `dialog/TestingReminderProfileDialog.java` | Testing on profile |
| `GenderDialogBuilder` | `dialog/GenderDialogBuilder.java` | Gender selector |
| `PronounsDialogBuilderV2` | `dialog/PronounsDialogBuilderV2.java` | Pronouns selector |

#### System Dialogs

| Dialog | File Path | Purpose |
|--------|-----------|---------|
| `GrindrMaterialDialogBuilderV2` | `base/dialog/GrindrMaterialDialogBuilderV2.java` | Custom Material dialog builder |
| `GrindrMaterialMultiChoiceDialogBuilder` | `dialog/GrindrMaterialMultiChoiceDialogBuilder.java` | Multi-choice dialog |
| `GrindrMaterialSingleChoiceDialogBuilder` | `dialog/GrindrMaterialSingleChoiceDialogBuilder.java` | Single-choice dialog |
| `FullButtonDialogBuilder` | `dialog/FullButtonDialogBuilder.java` | Full-width button dialog |
| `ChoosePhotoDialogBuilder` | `dialog/ChoosePhotoDialogBuilder.java` | Photo source picker |
| `ProfileNoteDialogBuilder` | `dialog/ProfileNoteDialogBuilder.java` | Profile note editor |
| `SavedPhrasesDialogCreator` | `dialog/SavedPhrasesDialogCreator.java` | Saved phrases manager |
| `RateGrindrDialog` | `dialog/RateGrindrDialog.java` | App rating prompt |
| `SmsCountryPickerDialog` | `dialog/SmsCountryPickerDialog.java` | Country code picker |
| `RangeDialog` | `dialog/RangeDialog.java` | Generic range selector |
| `ShowListInfoDialog` | `dialog/ShowListInfoDialog.java` | List info popup |
| `GrindrDatePickerDialog` | `view/GrindrDatePickerDialog.java` | Custom date picker |
| `CaptchaDialog` | `ui/account/captcha/CaptchaDialog.java` | CAPTCHA verification |
| `ViewedMeHintDialog` | `ui/viewedme/ViewedMeHintDialog.java` | Viewed-me hint |
| `BackupTermsDialogFragment` | `dialog/BackupTermsDialogFragment.java` | Backup terms |

### R.3.3 Bottom Sheets (2)

| Sheet | File Path | Purpose |
|-------|-----------|---------|
| `SponsoredGaymojiBottomSheet` | `ui/chat/SponsoredGaymojiBottomSheet.java` | Sponsored gaymoji |
| `EditPhotosBottomSheet` | `view/EditPhotosBottomSheet.java` | Photo edit options |

### R.3.4 ViewHolder Components (40+)

#### Cascade ViewHolders

| ViewHolder | Purpose |
|------------|---------|
| `CascadeProfileViewHolder` | Profile card in grid |
| `CascadeDividerViewHolder` | Grid divider |
| `CascadeUpsellProfileViewHolder` | Upsell in cascade |
| `PhotoCascadeViewHolder` | Photo-only cascade item |
| `RatingCascadeItemViewHolder` | Rating cascade item |
| `EventCalendarCascadeItemViewHolder` | Event cascade item |
| `UnlimitedCascadesFooterViewHolder` | Unlimited footer |
| `WhosNearbyDividerEyeWinkViewHolder` | Nearby divider |

#### Chat ViewHolders (28)

| ViewHolder | Purpose |
|------------|---------|
| `ReceivedTextViewHolder` | Received text message |
| `SentTextViewHolder` | Sent text message |
| `ReceivedImageViewHolder` | Received image |
| `SentImageViewHolder` | Sent image |
| `ReceivedExpiringImageViewHolder` | Received expiring photo |
| `SentExpiringImageViewHolder` | Sent expiring photo |
| `ReceivedAudioViewHolder` | Received audio |
| `SentAudioViewHolder` | Sent audio |
| `ReceivedGaymojiViewHolder` | Received gaymoji |
| `SentGaymojiViewHolder` | Sent gaymoji |
| `ReceivedGiphyViewHolder` | Received GIF |
| `SentGiphyViewHolder` | Sent GIF |
| `ReceivedMapViewHolder` | Received location |
| `SentMapViewHolder` | Sent location |
| `ReceivedVideoCallViewHolder` | Received video call |
| `SentVideoCallViewHolder` | Sent video call |
| `ReceivedAudioCallViewHolder` | Received audio call |
| `SentAudioCallViewHolder` | Sent audio call |
| `ReceivedPrivateVideoViewHolder` | Received private video |
| `SentPrivateVideoViewHolder` | Sent private video |
| `ReceivedRetractionViewHolder` | Retracted message |
| `SentRetractionViewHolder` | Sent retraction |
| `ReceivedUnSupportViewHolder` | Unsupported message type |
| `SentUnSupportViewHolder` | Unsupported sent type |
| `TipsViewHolder` | Tips/hints |
| `TranslatePromptViewHolder` | Translation prompt |
| `TextHolder` | Generic text holder |
| `AudioViewHolder` | Audio playback |

#### Conversation ViewHolders

| ViewHolder | Purpose |
|------------|---------|
| `DirectConversationViewHolder` | 1:1 conversation row |
| `GroupConversationViewHolder` | Group conversation row |
| `CircleConversationViewHolder` | Circle conversation row |
| `ConversationPlaceHolderViewHolder` | Loading placeholder |
| `EmptyViewHolder` | Empty state |
| `EmptyTapsViewHolder` | No taps state |

#### Profile ViewHolders

| ViewHolder | Purpose |
|------------|---------|
| `ExploreProfileViewHolder` | Explore profile card |
| `FavoritesProfileViewHolder` | Favorites profile card |
| `ViewedMeFooterUpsellViewHolder` | Viewed-me upsell |
| `ExploreUpsellFooterViewHolder` | Explore upsell footer |
| `ExploreUpsellProfileViewHolder` | Explore upsell profile |
| `MoreGuysUpsellFooterViewHolder` | "More guys" upsell |
| `TapsViewHolder` | Tap item |
| `SavedPhrasesViewHolder` | Saved phrase item |

#### Other ViewHolders

| ViewHolder | Purpose |
|------------|---------|
| `UploadedPhotosViewHolder` | Uploaded photo |
| `UploadedPhotosAddViewHolder` | Add photo button |
| `UploadedPhotosEmptyViewHolder` | Empty photos |
| `BoostBundleViewHolder` | Boost bundle item |
| `ChatGiphyItemViewHolder` | GIF item |
| `SelectableViewHolder` | Selectable item |
| `ShareFavoritesViewHolder` | Share favorite item |
| `MRectBannerAdsViewHolder` | Banner ad |
| `ProfileToolbar` | Profile toolbar |
| `SavedPhrasesViewHolderV2` | Saved phrase v2 |

### R.3.5 Custom View Components

| View | File Path | Purpose |
|------|-----------|---------|
| `CascadeProfileDraweeView` | `ui/cascade/CascadeProfileDraweeView.java` | Profile image (Fresco) |
| `CascadeProfileItemView` | `ui/cascade/CascadeProfileItemView.java` | Profile card layout |
| `GrindrMapView` | `view/GrindrMapView.java` | Map wrapper |
| `GoogleMapView` | `view/map/GoogleMapView.java` | Google Maps integration |
| `ExploreMapLayout` | `view/ExploreMapLayout.java` | Explore map layout |
| `ChatMapLayout` | `view/ChatMapLayout.java` | Chat map layout |
| `ProfileTapLayout` | `view/ProfileTapLayout.java` | Tap interaction layout |
| `FeatureEduProfileV2TapTipView` | `view/FeatureEduProfileV2TapTipView.java` | Tap education tooltip |
| `GrindrCollapsingToolbarLayout` | `view/GrindrCollapsingToolbarLayout.java` | Collapsing toolbar |
| `HomeTabView` | `view/HomeTabView.java` | Bottom tab item |
| `AccountTabLayout` | `view/AccountTabLayout.java` | Account tab layout |
| `EventCalendarTabLayout` | `view/EventCalendarTabLayout.java` | Event calendar tabs |
| `UnClickableToolbar` | `view/UnClickableToolbar.java` | Non-clickable toolbar |
| `StoreToolBarLayout` | `store/ui/StoreToolBarLayout.java` | Store toolbar |
| `Logo` | `store/ui/Logo.java` | Store logo |
| `BodyStyle` / `BodyStyleBuilder` | `view/BodyStyle.java` | Body type visual |
| `ColorPaletteAnimateLineView` | `view/ColorPaletteAnimateLineView.java` | Color palette animation |
| `ColorPaletteAnimateRoundRectTextView` | `view/ColorPaletteAnimateRoundRectTextView.java` | Color palette text |
| `UpsellUnlimited*` (10 views) | `store/view/UpsellUnlimited*.java` | Unlimited upsell components |
| `XtraUpsellLayout` | `store/view/XtraUpsellLayout.java` | XTRA upsell layout |

---

## R.4 PAGE FLOWS

### R.4.1 First Launch / Onboarding Flow

```
App Launch
    |
    v
LandingActivity (splash/branding)
    |
    +---> LandingEmailActivity (email login)
    |         |
    |         +---> LoginActivity (enter credentials)
    |         |         |
    |         |         +---> HomeActivity (authenticated)
    |         |
    |         +---> CreateAccountEmailActivity (registration)
    |         |         |
    |         |         +---> SMSVerifyActivity / AccountVerifyActivity
    |         |         |         |
    |         |         |         +---> RegisterProfileActivity (profile setup)
    |         |         |                   |
    |         |         |                   +---> PhotoFieldsFragment (upload photos)
    |         |         |                   |
    |         |         |                   +---> NewOnBoardingUpsellActivity (upsell)
    |         |         |                   |
    |         |         |                   +---> HomeActivity
    |         |
    |         +---> LandingForgotPwdActivity
    |                   |
    |                   +---> ForgotPasswordActivity
    |
    +---> LandingPhoneActivity (phone login)
    |         |
    |         +---> LandingSMSVerifyActivity
    |         |         |
    |         |         +---> SmsCountryPickerActivity (country code)
    |         |
    |         +---> SMSVerifyActivity
    |                   |
    |                   +---> RegisterProfileActivity -> HomeActivity
    |
    +---> ThirdPartyLoginProfileActivity (social login)
              |
              +---> HomeActivity
```

### R.4.2 Main App Navigation Flow

```
HomeActivity (bottom navigation shell)
    |
    +---> Tab 1: Cascade (Browse)
    |         |
    |         +---> CascadeFragment (grid of profiles)
    |         |         |
    |         |         +---> [Tap profile] --> BaseCruiseActivityV2 (profile card)
    |         |         |         |
    |         |         |         +---> [Tap] --> ChatActivityV2
    |         |         |         +---> [Favorite] --> POST v3/me/favorites/{id}
    |         |         |         +---> [Block] --> BlockInterstitial
    |         |         |         +---> [Report] --> ReportProfileActivity
    |         |         |
    |         |         +---> [Pull down] --> CascadeSwipeRefreshLayout (refresh)
    |         |         +---> [Filter icon] --> DrawerFilterCascadeFreeFragment / DrawerFilterCascadeExtraFragment
    |         |         +---> [Scroll to end] --> UnlimitedCascadesFooterViewHolder (upsell)
    |
    +---> Tab 2: Explore
    |         |
    |         +---> ExploreCascadeActivity
    |         |         |
    |         |         +---> ExploreCascadeFragment (explore grid)
    |         |         +---> ExploreMapActivity (map view)
    |         |                   |
    |         |                   +---> ExploreMapFragment (Google Maps)
    |         |
    |         +---> [Search] --> SearchInboxActivity
    |                   |
    |                   +---> ExploreSearchResultAdapter
    |                   +---> ExploreSearchSuggestionAdapter
    |                   +---> ExploreRecentSearchAdapter
    |
    +---> Tab 3: Inbox (Messages)
    |         |
    |         +---> InboxFragment
    |         |         |
    |         |         +---> InboxFragmentLayout (ViewPager)
    |         |                   |
    |         |                   +---> ConversationsFragment (chat list)
    |         |                   |         |
    |         |                   |         +---> [Tap conversation] --> ChatActivityV2
    |         |                   |                   |
    |         |                   |                   +---> ChatBaseFragmentV2
    |         |                   |                   |     (ChatIndividualFragment or ChatGroupFragmentV2)
    |         |                   |                   |
    |         |                   |                   +---> [Long press] --> MoreMenuAdapter (menu)
    |         |                   |                   +---> [Swipe] --> MessageSwipeController (reply/delete)
    |         |                   |
    |         |                   +---> TapsFragment (taps list)
    |         |                   +---> FavoritesFragment (favorites grid)
    |         |
    |         +---> [Search] --> SearchInboxActivity
    |
    +---> Tab 4: Favorites
    |         |
    |         +---> FavoritesFragment (favorites grid)
    |                   |
    |                   +---> [Tap] --> BaseCruiseActivityV2
    |                   +---> [Filter] --> DrawerFilterFavoriteFragment
    |
    +---> Tab 5: Profile / Settings
              |
              +---> DrawerProfileFragmentV2 (profile drawer)
                        |
                        +---> [Edit] --> EditProfileActivity
                        |         |
                        |         +---> EditProfileFragment
                        |         +---> PhotoFieldsFragment (photos)
                        |         +---> MyTagDialogFragment (hashtags)
                        |
                        +---> [Settings] --> SettingsActivity
                        |         |
                        |         +---> NotificationSettingsActivity
                        |         +---> PrivacySettingsActivity
                        |         +---> DoNotDisturbSettingsActivity
                        |         +---> PinSettingsActivity
                        |         +---> DiscreetAppIconSettingsFragment
                        |         +---> SubscriptionManagementActivity
                        |         +---> AccountVerifyActivity
                        |         +---> ChangePasswordActivity
                        |         +---> UpdateEmailActivity
                        |         +---> RequestDataActivity (GDPR)
                        |         +---> SettingsDeleteProfileActivity
                        |
                        +---> [Spotify] --> SpotifyActivity
                        +---> [Circles] --> CircleCreateActivity / CircleInviteActivity
                        +---> [Viewed Me] --> ViewedMeActivity
                        +---> [Events] --> EventCalendarActivity
```

### R.4.3 Chat Flow

```
ChatActivityV2 (singleTask)
    |
    +---> ChatBaseFragmentV2
    |         |
    |         +---> ChatIndividualFragment (1:1 chat)
    |         |     or
    |         +---> ChatGroupFragmentV2 (group chat)
    |
    +---> Chat Bottom Bar
    |         |
    |         +---> [Text input] --> Send text message (XMPP)
    |         +---> [Photo icon] --> ChoosePhotoDialogBuilder
    |         |         |
    |         |         +---> Camera / Gallery / Expiring photo
    |         |
    |         +---> [Gaymoji icon] --> GaymojiListAdapter
    |         |         |
    |         |         +---> GaymojiService (HTTP API)
    |         |
    |         +---> [GIF icon] --> ChatGiphySearchFragment
    |         |         |
    |         |         +---> GiphyService (GIF search)
    |         |
    |         +---> [Phrase icon] --> SavedPhrasesHorizontalAdapter
    |         |         |
    |         |         +---> POST v3/me/prefs/phrases (add)
    |         |
    |         +---> [Audio icon] --> AudioChatService (record audio)
    |         +---> [Video icon] --> PrivateVideoCaptureActivity
    |         +---> [Location icon] --> Location sharing (XMPP geoloc)
    |
    +---> Chat Message List
    |         |
    |         +---> [Long press message] --> MoreMenuAdapter
    |         |         |
    |         |         +---> Copy, Reply, Forward, Delete, Retract
    |         |
    |         +---> [Swipe right] --> MessageSwipeController (reply)
    |         +---> [Double tap] --> Reaction
    |
    +---> Chat Header
    |         |
    |         +---> [Profile tap] --> BaseCruiseActivityV2
    |         +---> [Video call] --> VideoCallActivity
    |         +---> [More] --> GroupChatDetailsActivity (group)
    |         +---> [Mute] --> POST v4/me/muted-profiles
    |         +---> [Block] --> BlockInterstitial
    |         +---> [Report] --> ReportProfileActivity
    |
    +---> Translation
              |
              +---> [Translate] --> POST /v4/chats/translate
```

### R.4.4 Report Flow (Multi-Step)

```
ReportProfileActivity
    |
    +---> Step 1: ReportProfileWhatFragment
    |         |
    |         +---> ReportProfileReasonAdapter (reason selection)
    |         |
    |         v
    +---> Step 2: ReportProfileWhereFragment
    |         |
    |         +---> ReportProfileWhereAdapter (location selection)
    |         |
    |         v
    +---> Step 3: ReportProfileDetailsFragment (conditional)
    |         |
    |         +---> ReportProfileDetailsAdapter (additional info)
    |         |
    |         v
    +---> Step 4: ReportProfileAttachFragment (conditional)
    |         |
    |         +---> Attach evidence (photos)
    |         |
    |         v
    +---> Step 5: ReportProfileSummaryFragment
    |         |
    |         +---> ReportProfileSummaryAdapter (review)
    |         |
    |         v
    +---> [Submit] --> POST v3.1/flags/{id}
    |
    +---> Step 6: ReportProfileSubmittedFragment (confirmation)
```

### R.4.5 Video Call Flow

```
[Initiate from chat]
    |
    v
VideoCallDialogActivity (incoming/outgoing)
    |
    +---> [Accept] --> VideoCallActivity
    |         |
    |         +---> POST /v3/video-call (create)
    |         +---> PUT /v3/video-call (join)
    |         +---> PATCH /v3/video-call (renew, periodic)
    |         +---> DELETE /v3/video-call/{id} (end)
    |         |
    |         +---> VideoCallForegroundService (background)
    |
    +---> [Decline] --> POST decline via XMPP

[Video Roulette]
    |
    v
VideoRouletteActivity
    |
    +---> POST v4/video-roulette (start matching)
    +---> GET v4/video-roulette/{matchId} (check match)
    +---> VideoMatchActivity (match found)
    |         |
    |         +---> VideoRouletteCarouselAdapter (carousel)
    |
    +---> VideoCallActivity (start call)
```

### R.4.6 Store / Subscription Flow

```
[Entry points]
    +---> StoreActivity (from settings/profile)
    +---> UpsellDialogFragment (contextual upsell)
    +---> NewOnBoardingUpsellActivity (post-signup)
    +---> Cascade upsell footer (in grid)
    +---> Video call upsell (VideoCallUpsellDialogManager)
    |
    v
StoreActivity
    |
    +---> StoreContainerFragment
              |
              +---> StoreViewPagerAdapter (tabs)
              |         |
              |         +---> XtraStoreFragment (XTRA)
              |         |         |
              |         |         +---> XtraStoreProductListAdapter
              |         |         +---> XtraStoreCarouselAdapter
              |         |
              |         +---> UnlimitedFragment (Unlimited)
              |                   |
              |                   +---> UnlimitedProductListAdapter
              |                   +---> UpsellUnlimited* views
              |
              +---> [Select plan] --> PurchaseDirectlyActivity
                        |
                        +---> Play Billing v3
                        |
                        +---> [Success] --> UpgradeConfirmationActivity
                        |                   |
                        |                   +---> PostAnimationFragment (celebration)
                        |
                        +---> [Boost] --> BoostBuyActivity
                                          |
                                          +---> BoostBundleBuyActivity
                                          +---> BoostUseActivity
                                          +---> BoostReportActivity
```

### R.4.7 Settings Flow

```
SettingsActivity
    |
    +---> Account Section
    |         |
    |         +---> AccountVerifyActivity (photo verification)
    |         +---> ChangePasswordActivity
    |         +---> UpdateEmailActivity
    |         +---> PinSettingsActivity
    |               |
    |               +---> SetPinActivity (set/change PIN)
    |               +---> PinLockActivity (verify PIN)
    |
    +---> Privacy Section
    |         |
    |         +---> PrivacySettingsActivity
    |         +---> DiscreetAppIconSettingsFragment (disguise icon)
    |         +---> SettingsDeactivateActivity (deactivate)
    |         +---> SettingsDeleteProfileActivity (delete)
    |               |
    |               +---> SettingsDeleteProfileReasonActivity
    |               +---> SettingsDeleteProfileOtherReasonActivity
    |
    +---> Notifications Section
    |         |
    |         +---> NotificationSettingsActivity
    |         +---> DoNotDisturbSettingsActivity (DND schedule)
    |
    +---> Subscription Section
    |         |
    |         +---> SubscriptionManagementActivity
    |         +---> StoreActivity (upgrade)
    |
    +---> Support Section
    |         |
    |         +---> Zendesk HelpCenterActivity
    |         +---> RequestDataActivity (GDPR data portability)
    |
    +---> Legal Section
    |         |
    |         +---> LegalFragment
    |         +---> PrivacyPolicyActivity
    |         +---> TermsOfServiceActivity
    |
    +---> Spotify Section
              |
              +---> SpotifyActivity
                    |
                    +---> SpotifySearchFragment
                    +---> SpotifySettingAdapter
```

---

## R.5 INTERACTION PATTERNS

### R.5.1 Tap (Like) System

| Interaction | Handler | API |
|-------------|---------|-----|
| **Double tap on profile** | `ProfilePhotoTouchListenerV2` | XMPP tap message |
| **Tap icon on profile** | `ProfileTapLayout` | XMPP tap message |
| **Receive tap** | `TapsFragment` / `TapsAdapter` | `GET v5/views` |
| **Delete tap** | `TapsDeleteHelper` | XMPP retraction |
| **Tap education** | `FeatureEduProfileV2TapTipView` | Local only |

**Tap event flow:**
```
User double-taps profile photo
    |
    v
ProfilePhotoTouchListenerV2.onDoubleTap()
    |
    v
CascadeItemTapEvent (EventBus)
    |
    v
GrindrXMPPManager sends tap message
    |
    v
Recipient receives "tap_receive" message type
    |
    v
TapsFragment updates with new tap
```

### R.5.2 Swipe Gestures

| Gesture | Component | Action |
|---------|-----------|--------|
| **Swipe right on message** | `MessageSwipeController` | Reply to message |
| **Swipe left on message** | `MessageSwipeController` | Delete/retract message |
| **Pull down on cascade** | `CascadeSwipeRefreshLayout` | Refresh profiles |
| **Swipe on conversation** | `ItemMoveSwipeListener` | Mute/delete conversation |
| **Swipe on tap item** | `TapsDeleteHelper` | Remove tap |
| **Horizontal swipe on profile photos** | `ProfilePhotoTouchListener` | Cycle through photos |

### R.5.3 Long Press Gestures

| Gesture | Component | Action |
|---------|-----------|--------|
| **Long press message** | `ChatOnLongPressMenuListener` | Context menu (copy, reply, forward, delete, retract) |
| **Long press conversation** | `ConversationsAdapter` | Mute/delete options |
| **Long press profile photo** | `ProfilePhotoPrimaryTouchListener` | Photo options |

### R.5.4 Scroll Behaviors

| Pattern | Component | Behavior |
|---------|-----------|----------|
| **Infinite scroll (cascade)** | `CascadeFragment` + Paging 2.1.2 | Load more profiles on scroll |
| **Scroll to hide tabs** | `ScrollToShowHideTabsListener` | Hide bottom nav on scroll down |
| **Collapsing toolbar** | `GrindrCollapsingToolbarLayout` | Collapse profile header on scroll |
| **Nested scroll (drawer)** | `DrawerProfileFragmentV2` | Drawer scroll behavior |
| **ViewPager swipe** | `InboxFragmentLayout` | Switch between tabs (conversations/taps/favorites) |

### R.5.5 Photo Interactions

| Interaction | Component | Action |
|-------------|-----------|--------|
| **Tap photo** | `FullScreenImageActivity` | View full-screen |
| **Tap expiring photo** | `FullScreenExpiringImageActivity` | View with timer |
| **Pinch to zoom** | `FullScreenImageActivity` | Zoom photo |
| **Photo decoration** | `PhotoDecorationActivity` | Draw, filter, crop |
| **Drawing gesture** | `DrawingGesture` / `DrawingOverlayGesture` | Freehand drawing |
| **Movement gesture** | `MovementGesture` | Move stickers |
| **Touching mode** | `TouchingMode` | Photo edit touch mode |

### R.5.6 Map Interactions

| Interaction | Component | Action |
|-------------|-----------|--------|
| **Drag map** | `OnMapDragListener` | Pan map view |
| **Tap marker** | `GoogleMapView` | View profile at location |
| **Cluster tap** | `GrindrMapView` | Expand cluster |
| **Map type toggle** | `ExploreMapFragment` | Switch map styles |

---

## R.6 VISUAL DESIGN SYSTEM

### R.6.1 Color System

| Token | Resource ID | Purpose |
|-------|-------------|---------|
| `colorPrimary` | `R.attr.colorPrimary` | Brand primary (Grindr green) |
| `colorPrimaryDark` | `R.attr.colorPrimaryDark` | Status bar color |
| `colorAccent` | `R.attr.colorAccent` | Accent/interactive elements |
| `colorBackgroundFloating` | `R.attr.colorBackgroundFloating` | Floating UI background |
| `colorButtonNormal` | `R.attr.colorButtonNormal` | Button background |
| `colorControlActivated` | `R.attr.colorControlActivated` | Active control state |
| `colorControlHighlight` | `R.attr.colorControlHighlight` | Pressed/hover state |
| `colorControlNormal` | `R.attr.colorControlNormal` | Default control state |
| `colorError` | `R.attr.colorError` | Error state |
| `notification_action_color_filter` | `R.color.notification_action_color_filter` | Notification icon tint |

**Color palette components:**
- `ColorPaletteAnimateLineView` -- Animated color palette line
- `ColorPaletteAnimateRoundRectTextView` -- Animated color palette text

### R.6.2 Theme System

| Theme | Purpose |
|-------|---------|
| `AppCompatTheme` | Base Material theme (100+ attributes) |
| `ConsumablePurchaseTheme` | Boost/consumable purchase screens |
| `GrindrMaterialDialogBuilderV2` | Custom dialog theming |

**Theme attributes (complete list from AppCompatTheme):**
- Window: `windowActionBar`, `windowActionBarOverlay`, `windowActionModeOverlay`, `windowNoTitle`
- Sizing: `windowFixedHeightMajor/Minor`, `windowFixedWidthMajor/Minor`, `windowMinWidthMajor/Minor`
- Typography: `textAppearanceLargePopupMenu`, `textAppearanceListItem`, `textAppearanceListItemSecondary`, `textAppearanceListItemSmall`, `textAppearancePopupMenuHeader`, `textAppearanceSearchResultSubtitle/Title`, `textAppearanceSmallPopupMenu`
- Controls: `checkboxStyle`, `checkedTextViewStyle`, `editTextStyle`, `radioButtonStyle`, `ratingBarStyle`, `seekBarStyle`, `switchStyle`
- Buttons: `buttonStyle`, `buttonStyleSmall`, `borderlessButtonStyle`, `buttonBarButtonStyle`
- Dialog: `dialogTheme`, `dialogCornerRadius`, `dialogPreferredPadding`, `alertDialogStyle`, `alertDialogTheme`
- List: `listPreferredItemHeight`, `listPreferredItemHeightLarge/Small`, `listPreferredItemPadding*`
- Action: `actionBarSize`, `actionBarStyle`, `actionModeStyle`, `actionBarTheme`

### R.6.3 Typography

Referenced text appearances from theme:
- `textAppearanceLargePopupMenu` -- Large menu text
- `textAppearanceListItem` -- List primary text
- `textAppearanceListItemSecondary` -- List secondary text
- `textAppearanceListItemSmall` -- Small list text
- `textAppearancePopupMenuHeader` -- Menu header
- `textAppearanceSearchResultSubtitle` -- Search subtitle
- `textAppearanceSearchResultTitle` -- Search title
- `textAppearanceSmallPopupMenu` -- Small menu text

### R.6.4 Icon System

**App icon variants (disguised icons):**
| Alias | Icon | Purpose |
|-------|------|---------|
| `HomeActivityOriginal` | Default Grindr icon | Normal |
| `HomeActivityUnlimited` | Default icon | Unlimited branding |
| `HomeActivityCamera` | Camera icon | Disguise as camera |
| `HomeActivityMusic` | Music icon | Disguise as music |
| `HomeActivityNotes` | Notes icon | Disguise as notes |
| `HomeActivityToDo` | To-Do icon | Disguise as to-do |
| `HomeActivityCalculator` | Calculator icon | Disguise as calculator |

---

## R.7 ANIMATION PATTERNS

### R.7.1 Animation Infrastructure

| Class | File Path | Purpose |
|-------|-----------|---------|
| `GrindrAnimationListener` | `base/listener/GrindrAnimationListener.java` | Animation callback base |
| `GrindrAnimatorListener` | `base/listener/GrindrAnimatorListener.java` | Animator callback base |
| `GrindrAnimationUtils` | `library/utils/GrindrAnimationUtils.java` | Animation utility methods |
| `DynamicItemAnimator` | `ui/base/DynamicItemAnimator.java` | Dynamic item animation |
| `ReuseViewHolderItemAnimator` | `ui/base/ReuseViewHolderItemAnimator.java` | ViewHolder reuse animation |
| `ViewedMeAnimationLayout` | `ui/cascade/ViewedMeAnimationLayout.java` | Viewed-me reveal animation |
| `PostAnimationFragment` | `store/ui/PostAnimationFragment.java` | Post-purchase celebration |

### R.7.2 Animation Types

| Animation | Trigger | Component |
|-----------|---------|-----------|
| **Profile card enter** | New cascade load | `CascadeAdapter` item animation |
| **Profile card exit** | Scroll off screen | `DynamicItemAnimator` |
| **Viewed-me reveal** | Viewed-me tab load | `ViewedMeAnimationLayout` |
| **Post-purchase** | Successful purchase | `PostAnimationFragment` (Lottie) |
| **Tap animation** | Double tap | `ProfileTapLayout` |
| **Filter drawer open** | Filter icon tap | Drawer slide-in |
| **Bottom sheet slide** | Sheet open/close | `design_bottom_sheet_slide_in/out` |
| **Color palette animate** | Palette selection | `ColorPaletteAnimateLineView` |
| **Collapsing toolbar** | Profile scroll | `GrindrCollapsingToolbarLayout` |
| **Tab indicator** | Tab switch | Tab layout indicator animation |
| **Chat message enter** | New message received | `ChatListAdapter` item animation |
| **Message swipe** | Swipe gesture | `MessageSwipeController` |
| **Upsell pulse** | Upsell display | `UpsellAdapter` animation |
| **Onboarding page** | Onboarding scroll | Lottie animations (`lottie_onboard_*.zip`) |

### R.7.3 Transition System

| Transition | Context |
|------------|---------|
| `Fade` (AndroidX Transition) | Fragment enter/exit |
| `TransitionSet` | Composite transitions |
| `Visibility` | Show/hide transitions |
| `ObjectAnimator` | Property animations |
| `ViewPropertyAnimator` | View property animations |

---

## R.8 RESPONSIVE BEHAVIOR

### R.8.1 Layout Adaptations

| Behavior | Component | Details |
|----------|-----------|---------|
| **Grid columns** | `CascadeFragment` | Adaptive grid based on screen width |
| **Drawer overlay** | `DrawerProfileFragmentV2` | Side drawer on phone, overlay on tablet |
| **Bottom sheet** | `SponsoredGaymojiBottomSheet` | Responsive bottom sheet |
| **ViewPager tabs** | `InboxFragmentLayout` | Tab layout with swipe |
| **Collapsing header** | `GrindrCollapsingToolbarLayout` | Collapsible profile header |
| **Map/List toggle** | `ExploreMapActivity` | Map vs list view |

### R.8.2 Orientation Handling

| Orientation | Behavior |
|-------------|----------|
| **Portrait** | Standard mobile layout |
| **Landscape** | Chat split view, map expansion |
| **Rotation** | Activity recreation with state preservation |

### R.8.3 Network State Behavior

| State | Behavior |
|-------|----------|
| **Online** | Full API access, real-time XMPP |
| **Offline** | Cached profiles from Room DB, failed message queue |
| **Slow network** | Reduced image quality, deferred uploads |
| **Background** | `BackgroundRestrictionInterceptor` limits API calls |

### R.8.4 Permission State Behavior

| Permission | Fallback |
|------------|----------|
| **Location denied** | `StubbedLocationPermissionLayoutParent` (stub UI) |
| **Camera denied** | Photo upload disabled |
| **Storage denied** | Photo save disabled |
| **Notifications denied** | In-app notifications only |

---

## R.9 VIEWMODEL ARCHITECTURE (40+ ViewModels)

### R.9.1 Core ViewModels

| ViewModel | File Path | Scope |
|-----------|-----------|-------|
| `GrindrViewModel` | `base/ui/GrindrViewModel.java` | Base ViewModel |
| `HomeTabViewModel` | `ui/home/HomeTabViewModel.java` | Home tab state |
| `CascadeViewModel` | `ui/cascade/CascadeViewModel.java` | Cascade grid state |
| `DrawerFilterViewModel` | `ui/drawer/DrawerFilterViewModel.java` | Filter drawer state |
| `SettingsViewModel` | `ui/settings/SettingsViewModel.java` | Settings state |

### R.9.2 Chat ViewModels

| ViewModel | Scope |
|-----------|-------|
| `ChatActivityViewModel` | Chat activity state |
| `ChatBaseFragmentViewModel` | Chat fragment base |
| `ChatBottomViewModel` | Chat bottom bar state |
| `ChatAudioViewModel` | Audio recording state |
| `ChatGroupFragmentViewModel` | Group chat state |
| `GroupChatDetailsViewModel` | Group details state |
| `GroupChatInviteViewModel` | Group invite state |
| `ChatCreateGroupViewModel` | Group creation state |
| `InviteMembersViewModel` | Member invitation state |
| `InviteMembersActivityViewModel` | Invite activity state |
| `IndividualChatNavViewModel` | Individual chat navigation |
| `BlockAndReportNavViewModel` | Block/report navigation |
| `TapToRetryViewModel` | Retry failed messages |

### R.9.3 Profile & Explore ViewModels

| ViewModel | Scope |
|-----------|-------|
| `ExploreCruiseViewModelV2` | Explore profile viewing |
| `ViewedMeViewModel` | Viewed me list state |
| `CircleApplyViewModel` | Circle application state |
| `CircleCreateViewModel` | Circle creation state |
| `CircleExploreViewModel` | Circle exploration state |
| `CircleInviteViewModel` | Circle invitation state |
| `CircleJoinedViewModel` | Joined circles state |

### R.9.4 Video Call ViewModels

| ViewModel | Scope |
|-----------|-------|
| `VideoCallViewModel` | Video call state |
| `VideoCallDialogViewModel` | Video call dialog state |
| `VideoCallSenderViewModel` | Call sender state |
| `VideoCallReceiverViewModel` | Call receiver state |
| `VideoMatchViewModel` | Video match state |
| `VideoMatchSenderViewModel` | Match sender state |
| `VideoMatchReceiverViewModel` | Match receiver state |
| `VideoRouletteViewModel` | Roulette state |

### R.9.5 Store & Settings ViewModels

| ViewModel | Scope |
|-----------|-------|
| `StoreViewModel` | Store state |
| `SettingsDeleteProfileViewModel` | Delete profile state |
| `SettingsDeleteProfileReasonActivityViewModel` | Delete reason state |
| `BackupViewModel` | Backup state |
| `BackupStateViewModel` | Backup progress state |
| `OldSignatureBackupViewModel` | Legacy backup state |

### R.9.6 Other ViewModels

| ViewModel | Scope |
|-----------|-------|
| `IndividualUnblockActivityViewModel` | Unblock state |
| `ReportProfileActivityViewModel` | Report state |
| `ReportProfileReasonViewModel` | Report reason state |
| `ReportProfileDetailsViewModel` | Report details state |
| `ReportProfileSummaryViewModel` | Report summary state |
| `ReportProfileSubmittedViewModel` | Report submitted state |
| `ReportProfileAttachViewModel` | Report attachment state |
| `ReportProfileWhatViewModel` | Report what state |
| `ReportProfileWhereViewModel` | Report where state |
| `AccountVerifyViewModel` | Account verification state |
| `LandingViewModel` | Landing page state |
| `LandingSMSVerifyViewModel` | SMS verification state |
| `SMSVerifyViewModel` | SMS code state |
| `PrivateVideoViewModel` | Private video state |
| `SpotifyViewModel` | Spotify integration state |
| `SpotifySearchViewModel` | Spotify search state |
| `SavedPhrasesViewModel` | Saved phrases state |
| `TrackPlayerViewModel` | Track player state |
| `GrindrXmppViewModel` | XMPP connection state |
| `NewOnBoardingUpsellViewModel` | Onboarding upsell state |
| `MyTagDialogViewModel` | Hashtag dialog state |

---

## R.10 AD INTERSTITIAL PATTERNS

### R.10.1 Ad Integration Points

| Interstitial | File Path | Trigger |
|--------------|-----------|---------|
| `BlockInterstitial` | `interstitial/BlockInterstitial.java` | After blocking a user |
| `ChatInterstitial` | `interstitial/ChatInterstitial.java` | Between chat sessions |
| `AbstractMoPubInterstitialWrapper` | `interstitial/AbstractMoPubInterstitialWrapper.java` | MoPub ad wrapper |

### R.10.2 Ad Networks (from Section 9)

| Network | Ad Types |
|---------|----------|
| **MoPub** | Interstitial, Rewarded, MRAID, Banner |
| **Vungle** | Full-screen, FlexView |
| **Smaato** | Interstitial, Rewarded |
| **Fyber** | Full-screen, Rich Media, Video |
| **PubNative** | MRAID, VAST, Rewarded |
| **Braze** | In-app messages, Content Cards |

### R.10.3 Banner Ad Components

| Component | Purpose |
|-----------|---------|
| `MRectBannerAdsViewHolder` | Medium rectangle banner in cascade |
| `GrindrBannerAdActivity` | Banner ad activity base |
| `GrindrBannerAdViewModel` | Banner ad state management |
| `BannerCounter` | Ad impression counting |
| `RatingBannerHelper` | Rating banner logic |

---

## R.11 GESTURE AND TOUCH SYSTEM

### R.11.1 Touch Listeners

| Listener | File Path | Purpose |
|----------|-----------|---------|
| `ProfilePhotoTouchListener` | `ui/profileV2/ProfilePhotoTouchListener.java` | Primary photo touch |
| `ProfilePhotoTouchListenerV2` | `ui/profileV2/ProfilePhotoTouchListenerV2.java` | Photo touch v2 (double tap) |
| `ProfilePhotoPrimaryTouchListener` | `ui/profileV2/ProfilePhotoPrimaryTouchListener.java` | Primary photo interactions |
| `ProfilePhotoSecondaryTouchListener` | `ui/profileV2/ProfilePhotoSecondaryTouchListener.java` | Secondary photo interactions |

### R.11.2 Gesture Detectors

| Detector | File Path | Purpose |
|----------|-----------|---------|
| `DrawingGesture` | `ui/photodecoration/gesture/DrawingGesture.java` | Freehand drawing on photos |
| `DrawingOverlayGesture` | `ui/photodecoration/gesture/DrawingOverlayGesture.java` | Overlay drawing |
| `MovementGesture` | `ui/photodecoration/gesture/MovementGesture.java` | Sticker/moveable element |
| `TouchingMode` | `ui/photodecoration/view/mode/TouchingMode.java` | Touch mode state machine |
| `MessageSwipeController` | `ui/chat/MessageSwipeController.java` | Chat message swipe |
| `ItemMoveSwipeListener` | `ui/chat/ItemMoveSwipeListener.java` | Conversation item swipe |
| `OnMapDragListener` | `view/map/OnMapDragListener.java` | Map drag detection |

---

## R.12 NOTIFICATION SYSTEM

### R.12.1 Notification Channels

| Manager | File Path | Purpose |
|---------|-----------|---------|
| `GrindrNotificationManager` | `manager/GrindrNotificationManager.java` | Notification orchestration |
| `NotificationChannelManager` | `manager/NotificationChannelManager.java` | Channel creation |
| `NotificationPref` | `manager/NotificationPref.java` | Notification preferences |

### R.12.2 Notification Types

| Type | Sound | Trigger |
|------|-------|---------|
| `RECEIVE_CHAT` | `R.raw.receive_chat` | Incoming chat message |
| `SEND_CHAT` | `R.raw.send_chat` | Message sent confirmation |
| `RECEIVE_CHAT_BUT_NOT_CHATTING_WITH_THEM` | `R.raw.receive_chat_but_not_chatting_with_them` | Message from non-active chat |
| `CASCADE_REFRESH` | `R.raw.refresh` | Cascade refresh complete |

### R.12.3 Push Notification

| Component | Purpose |
|-----------|---------|
| `FcmPushNotification` | FCM push data model |
| `PushNotificationData` | Push notification payload |
| `BrazePushReceiver` | Braze push handling |
| `BrazeDeepLinkNavigator` | Push deep link routing |
| `NewOnBoardingNotificationWorker` | Onboarding re-engagement |

---

## R.13 ACCESSIBILITY PATTERNS

| Pattern | Component | Details |
|---------|-----------|---------|
| **Content descriptions** | All ImageViews | `android:contentDescription` |
| **Touch exploration** | `CascadeFragment` | Focus order for screen readers |
| **TalkBack support** | Material Components | Built-in a11y |
| **High contrast** | Theme system | Dynamic color adaptation |
| **Large text** | Text appearances | Scalable text sizes |
| **Focus management** | Dialog fragments | Focus trapping in dialogs |

---

*Appended: 2026-08-14*
*Analyst: ZCode UX/UI Reverse Engineering Analyst*
*Source: JADX-decompiled Grindr 7.5.0 APK sources*
*UI files analyzed: 822 Java files in `com/grindrapp/android/ui/`*
*Components cataloged: 105 Activities, 83 Fragments, 60+ Adapters, 40+ Dialogs, 40+ ViewModels, 40+ ViewHolders, 2 Bottom Sheets*

*End of GRINDR-QUANTUM-EXTRACTION.md*

---

# DESIGN SYSTEM

> Extracted from `colors.xml` + `FeatureConfigManager.java` in grindr-7.5.0.apk-reverseapk
> Framework: Material Components 1.2.0-beta01 + Custom Theme (dark-first)

## 1. Primitive Tokens (Raw Values)

### Colors

#### Brand Greens

| Token | Hex | Usage |
|-------|-----|-------|
| `grindr_green` | `#4cd964` | Primary brand green |
| `grindr_green_2` | `#70b558` | Secondary green |
| `grindr_green_3` | `#54a471` | Tertiary green |
| `grindr_green_4` | `#38938a` | Teal-green |

#### Brand Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `grindr_star_gay` | `#ffcc00` | Yellow/gold accent, colorAccentOTUI |
| `grindr_ketchup_stain` | `#ef5242` | Red accent, error |
| `grindr_amethyst_purple` | `#be58d3` | Purple accent |
| `grindr_chatty_mcchatface` | `#64cffc` | Cyan/chat color |
| `grindr_deep_blue` | `#5192f0` | Deep blue |
| `grindr_electric_blue` | `#1383eb` | Electric blue |
| `grindr_lime_time` | `#00e676` | Lime green, online |
| `grindr_marketing_blue` | `#00bcff` | Marketing blue |
| `grindr_pink` | `#ffb1b8` | Pink accent |
| `grindr_golden_brown` | `#e6a315` | Golden brown |
| `grindr_takis_red` | `#dc1f3e` | Takis red |

#### Grays

| Token | Hex | Usage |
|-------|-----|-------|
| `grindr_grey_1` | `#d6d6d6` | Lightest gray |
| `grindr_grey_2` | `#b5b5ba` | Light gray |
| `grindr_grey_3` | `#9e9ea8` | Mid gray |
| `grindr_grey_5` | `#4a4a4f` | Dark gray |
| `grindr_grey_6` | `#2c2c2e` | Darker gray |
| `grindr_grey_black` | `#1f1f20` | Near-black |
| `grindr_grey_black_2` | `#090a0a` | Deepest black |
| `grindr_grey_black_3` | `#231f20` | Black variant |
| `grindr_grey_black_4` | `#363637` | Dark surface |

#### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `grindr_pure_black` | `#000000` | Pure black |
| `grindr_pure_white` | `#ffffff` | Pure white |
| `grindr_off_white` | `#f0f1f3` | Off-white |
| `grindr_unlimited_card_bg` | `#3e3e3f` | Unlimited card bg |

#### Calendar/Event UI (Feature Config)

| Token | Hex | Usage |
|-------|-----|-------|
| Event top colors | `#DC1F3E`, `#FFCC00` | Calendar event top gradient |
| Event bottom colors | `#1383EB`, `#3CC589` | Calendar event bottom gradient |
| Cascade frame colors | `#DC1F3E`, `#FCB316`, `#24C07C`, `#1383EB`, `#AB58D3` | Profile frame colors |
| Event picker bg | `#FCB316` | Current event picker background |
| Event picker text | `#090A0A` | Current event picker text |

### Typography

| Property | Value |
|----------|-------|
| Framework | Material Components 1.2.0-beta01 |
| Font family | System default (Roboto on Android) |
| Text appearances | `TextAppearance.MaterialComponents.*` |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| Material default | `4dp`, `8dp`, `16dp`, `24dp` | Standard Material spacing |
| Card padding | `16dp` | Profile cards, list items |
| Grid gutter | `4dp` | Cascade grid gaps |
| Chat padding | `8dp` | Chat message padding |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| Card | `8dp` | Profile cards |
| Avatar | `50%` (circle) | Profile photos |
| Button | `20dp` | Action buttons |
| Dialog | `28dp` | Material dialogs |
| Bottom sheet | `16dp` top | Bottom sheets |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| Card elevation | `2dp` | Profile cards |
| FAB elevation | `6dp` | Floating action buttons |
| Dialog elevation | `24dp` | Modal dialogs |
| Bottom sheet elevation | `8dp` | Bottom sheets |

### Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| Divider | `1dp` | List dividers |
| Stroke | `2dp` | Icon buttons |
| Active indicator | `3dp` | Tab indicators |

---

## 2. Semantic Tokens (Contextual Meaning)

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `text-high` | `#ffffff` (alpha 87%) | Primary text on dark |
| `text-medium` | `#ffffff` (alpha 60%) | Secondary text |
| `text-low` | `#ffffff` (alpha 38%) | Disabled/hint text |
| `text-on-green` | `#000000` | Text on green buttons |

### Surface

| Token | Value | Usage |
|-------|-------|-------|
| `surface-dark` | `#090A0A` | Primary dark background |
| `surface-card` | `#1f1f20` | Card background |
| `surface-elevated` | `#2c2c2e` | Elevated surfaces |
| `surface-unlimited` | `#3e3e3f` | Unlimited tier cards |

### Border

| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `#ffffff` (alpha 12%) | Subtle dividers |
| `border-default` | `#2c2c2e` | Default borders |
| `border-strong` | `#4a4a4f` | Strong borders |

### Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `interactive-primary` | `#4cd964` | Green primary actions |
| `interactive-secondary` | `#1383eb` | Blue secondary actions |
| `interactive-danger` | `#ef5242` | Red destructive actions |
| `interactive-super` | `#be58d3` | Purple super actions |
| `interactive-gold` | `#ffcc00` | Gold/yellow premium |

### Status

| Token | Value | Usage |
|-------|-------|-------|
| `status-online` | `#00e676` | Online indicator |
| `status-error` | `#ef5242` | Error states |
| `status-success` | `#4cd964` | Success states |
| `status-chat` | `#64cffc` | Chat accent |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#4cd964` | Grindr green |
| `brand-secondary` | `#ffcc00` | Gold accent |
| `brand-accent` | `#1383eb` | Electric blue |
| `brand-chat` | `#64cffc` | Chat cyan |
| `brand-purple` | `#be58d3` | Amethyst purple |
| `brand-red` | `#dc1f3e` | Takis red |

---

## 3. Component Tokens (Specific Usage)

### Buttons

| Token | Value |
|-------|-------|
| `button-primary-bg` | `#4cd964` |
| `button-primary-text` | `#000000` |
| `button-secondary-bg` | `#2c2c2e` |
| `button-secondary-text` | `#ffffff` |
| `button-disabled-bg` | `#4a4a4f` |
| `button-disabled-text` | `#9e9ea8` |
| `button-danger-bg` | `#ef5242` |
| `button-danger-text` | `#ffffff` |

### Cards (Profile/Cascade)

| Token | Value |
|-------|-------|
| `card-bg` | `#1f1f20` |
| `card-radius` | `8dp` |
| `card-elevation` | `2dp` |
| `card-frame-colors` | `#DC1F3E`, `#FCB316`, `#24C07C`, `#1383EB`, `#AB58D3` |

### Chat

| Token | Value |
|-------|-------|
| `chat-bubble-sent-bg` | `#4cd964` |
| `chat-bubble-sent-text` | `#000000` |
| `chat-bubble-received-bg` | `#2c2c2e` |
| `chat-bubble-received-text` | `#ffffff` |
| `chat-input-bg` | `#090A0A` |
| `chat-typing-dot` | `#9e9ea8` |

### Navigation

| Token | Value |
|-------|-------|
| `nav-bg` | `#090A0A` |
| `nav-text` | `#9e9ea8` |
| `nav-active` | `#4cd964` |
| `nav-border` | `1dp #2c2c2e` |

### Badges

| Token | Value |
|-------|-------|
| `badge-xtra-bg` | `#ffcc00` |
| `badge-xtra-text` | `#000000` |
| `badge-unlimited-bg` | `#3e3e3f` |
| `badge-unlimited-text` | `#ffffff` |
| `badge-online-bg` | `#00e676` |
| `badge-chat-bg` | `#64cffc` |

### Subscription Tiers

| Token | Value |
|-------|-------|
| `tier-free-bg` | `#2c2c2e` |
| `tier-free-text` | `#ffffff` |
| `tier-xtra-bg` | `#ffcc00` |
| `tier-xtra-text` | `#000000` |
| `tier-unlimited-bg` | `#3e3e3f` |
| `tier-unlimited-text` | `#ffffff` |

---

## 4. Theme Architecture

```
Grindr Theme (dark-first)
  |-- colorPrimaryOT:    #67b54b (green)
  |-- colorPrimaryDarkOT: #3c881d (dark green)
  |-- colorAccentOTUI:   #ffcc00 (star gay yellow)
  |-- Primary surfaces:  #090A0A -> #1f1f20 -> #2c2c2e
  |-- Accent system:     green (primary) + yellow (accent) + blue (info)
  |-- Status indicators: #00e676 (online) + custom per-feature
```

---

# DEVELOPER QUICK START

> "I just opened this doc. How do I start building in 5 minutes?"

## Architecture Overview

Grindr is a native Android app written in Kotlin with a layered architecture: Dagger 2 for dependency injection, Retrofit for REST API calls, Smack (XMPP) for real-time chat, Room (SQLite) for local persistence, and Coroutines for async operations. The app authenticates with a custom `Grindr3 {token}` scheme (not Bearer), and all API URLs are dynamically configured via a bootstrap endpoint rather than hardcoded. The codebase contains 11,721 Java files with 30 DAOs, 50+ Retrofit endpoints, and a per-user database pattern (`grinder_{profileId}{hash}.db`).

## Key Technologies and Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Kotlin | - |
| DI | Dagger | 2.28 |
| Chat | XMPP (Smack TCP) | 4.x |
| Presence | WebSocket | `/session/websocket` |
| REST | Retrofit 2 | - |
| HTTP | OkHttp 3 | - |
| DB | Room (SQLite) | 2.3.0-alpha02 |
| JSON | Jackson | - |
| Async | Kotlin Coroutines | - |
| Navigation | AndroidX Navigation | 2.3.4 |
| Camera | CameraX | 1.0.0-beta08 |
| Video | ExoPlayer/Media2 | 1.0.3 |
| Billing | Play Billing v3 | 3.0.0 |

## Where to Start Reading the Code

1. **`ApiRestService.java`** -- All REST endpoints (profiles, favorites, blocks, settings, chat backup, views, video call)
2. **`LoginRestService.java`** -- Authentication endpoints (email, phone, third-party)
3. **`HeaderRequestInterceptor.java`** -- How every request is authenticated (`Grindr3 {token}` + device headers)
4. **`SessionResponseInterceptor.java`** -- Token refresh on 401, retry logic
5. **`GrindrXMPPManager.java`** -- The XMPP chat connection manager (connection, send, receive, reconnect)
6. **`UserDatabaseModule.java`** -- Per-user Room database setup
7. **`GrindrRestService.java`** -- Dynamic URL construction from bootstrap config

## How to Set Up the Development Environment

```bash
# 1. Requirements
#    - Android Studio (latest stable)
#    - JDK 11+
#    - Android SDK 29 (compileSdk)
#    - Gradle 7.x+

# 2. Clone the project (if you have the source)
git clone <repo-url> grindr-android
cd grindr-android

# 3. Open in Android Studio
#    File -> Open -> select the project root

# 4. Configure local.properties
sdk.dir=/path/to/your/Android/sdk

# 5. Build
./gradlew assembleDebug

# 6. The app requires a live backend.
#    Bootstrap URLs are fetched dynamically from server config.
#    You cannot run against a mock server without replicating
#    the full bootstrap response.
```

## Common Patterns to Follow

1. **Per-user database**: Each user gets their own Room DB file (`grinder_{profileId}{hash}.db`). Always scope DB access to the current user.

2. **Auth header pattern**: Every authenticated request includes:
   ```
   Authorization: Grindr3 {sessionToken}
   L-Time-Zone: {device timezone}
   L-Grindr-Roles: {user roles}
   L-Device-Info: {anonymized device info}
   ```

3. **Circuit breaker**: API calls are wrapped in Resilience4j-style circuit breakers. Handle `CircuitBreakerOpenException` gracefully.

4. **XMPP message flow**: User types -> `ChatSendLocalMessageHandler` stores in Room (status: SENDING) -> `GrindrXMPPManager` sends via Smack -> Stream Ack -> status: SENT -> recipient receives -> XEP-0184 receipt -> status: DELIVERED -> XEP-0333 displayed marker -> status: DISPLAYED.

5. **Feature flags**: Access via `FeatureConfigManager.isFeatureEnabled(configName)`. Debug via `DebugFeatureFlagsActivity`.

## Key Files to Understand First

| File | What You Learn |
|------|----------------|
| `ApiRestService.java` | Complete API surface (50+ endpoints) |
| `LoginRestService.java` | Auth flow and token management |
| `HeaderRequestInterceptor.java` | How auth headers are added |
| `SessionResponseInterceptor.java` | Token refresh and retry logic |
| `GrindrXMPPManager.java` | Real-time chat architecture |
| `UserDatabaseModule.java` | Per-user DB pattern |
| `GrindrRestService.java` | Dynamic URL construction |
| `BaseProfile.java` | User data model (28 fields) |
| `ChatConstant.java` | Chat message types and constants |
| `CascadeDao.java` | How profile browsing data is cached |

---

# FEATURE BLUEPRINTS

## Feature 1: Cascade (Profile Browsing)

**What it does:** The core browsing experience. Shows nearby profiles in a grid, filtered by 22 parameters including age, height, weight, tribes, looking-for, body type, position, NSFW preference, and online status. Supports standard and "unlimited" pagination.

**API methods used:**
- `GET v4/locations/{geohash}/profiles` -- Standard cascade with page-based pagination
- `GET v4/locations/{geohash}/unlimited-profiles` -- Cursor-based pagination via `searchAfterDistance`/`searchAfterProfileId`
- `GET /v3/places/search` -- Location search for Explore mode
- `GET v4/locations/{geohash}/profiles?viewedMeOnly=true` -- Who viewed me filter

**Components that implement it:**
- `BaseCruiseActivityV2` / `ExploreCruiseActivityV2` -- Main browsing activities
- `CascadeDao` -- Local cache for cascade results
- `ExploreProfileDao` -- Explore-specific profile cache
- `NearbyProfileDao` -- Nearby profiles cache
- Filter system (`DirtyFieldType` enum) with 10 filter categories

**Step-by-step implementation:**
1. Get user location and convert to geohash (6+ characters for precision)
2. Build filter query params: `online`, `ageMinimum`, `ageMaximum`, `grindrTribesIds`, `lookingForIds`, etc.
3. Call `GET v4/locations/{geohash}/profiles?pageNumber=0` with filters
4. Cache results in `CascadeDao` for offline browsing
5. For infinite scroll: use `unlimited-profiles` with `searchAfterDistance` and `searchAfterProfileId` from last result
6. Display in grid with profile image (constructed from `profileImageMediaHash`), distance, age, tribe badges

**Common pitfalls:**
- The geohash must be at least 6 characters. Shorter geohashes return too broad results.
- Free users see limited profiles per page. XTRA/Unlimited users get more.
- The `action` and `cascadeType` parameters control refresh vs. load-more behavior.
- Profile images are not direct URLs -- they are constructed from `profileImageMediaHash` via the file service.

---

## Feature 2: XMPP Real-Time Chat

**What it does:** Full-featured real-time messaging over XMPP (Smack library). Supports text, images, audio, video calls, expiring photos, gaymoji, location sharing, typing indicators, delivery/display receipts, message retraction, and group chat (MUC).

**API methods used:**
- XMPP connection via `XMPPTCPConnection` (Smack)
- `GET v3/me/chat/messages` -- Sync undelivered messages
- `PUT v3/me/chat/messages` -- Confirm delivery
- `DELETE /v3/msgstore` -- Delete message
- `POST /v4/chats/translate` -- Translate message
- WebSocket at `/session/websocket` -- Presence updates

**Components that implement it:**
- `GrindrXMPPManager` -- Connection lifecycle, send/receive
- `ChatSendLocalMessageHandler` -- Optimistic local send
- `FailedSendMessageManager` -- Retry queue for failed sends
- `ChatStateManager` -- Typing indicators (composing, paused)
- `ChatMarkerManager` -- XEP-0184 delivery + XEP-0333 display receipts
- `RecallMessageManager` / `RetractionManager` -- Message deletion
- `BatchChatMessageHandler` -- Batch message processing
- `ReconnectManager` -- Auto-reconnection with backoff

**Step-by-step implementation:**
1. Bootstrap returns XMPP config (host, domain, port, token)
2. Build Smack config via `SimplifiedXMPPTCPConnectionConfigurationFactory`
3. Establish `XMPPTCPConnection` with TLS
4. Authenticate via `AccountManager` with token
5. Enable Smack Stream Management (ack/resume)
6. For sending: build XMPP stanza, set recipient JID, call `XMPPTCPConnection.send()`
7. For receiving: register `ChatStateListener`, process in `ChatReceivedMessageHandler`
8. Store all messages in Room DB with status tracking (SENDING -> SENT -> DELIVERED -> DISPLAYED)

**Common pitfalls:**
- The XMPP connection uses a custom auth scheme -- not standard SASL. The token comes from the bootstrap API.
- `FailedSendMessageManager` queues messages when offline. Do not lose these on app restart.
- Group chat uses MUC (Multi-User Chat) extensions. Group JID format: `{groupId}@{GROUP_CHAT_DOMAIN_PREFIX}`.
- Presence (online/offline/typing) comes via WebSocket, not XMPP. The two protocols run in parallel.
- The `ReconnectManager` has a lockout mechanism after too many failed attempts. Respect the `Reason.Disconnect.Lockout` state.

---

## Feature 3: Favorites & Blocks

**What it does:** Save profiles as favorites for quick access. Block profiles to prevent all interaction. Sync favorites and blocks between local DB and server.

**API methods used:**
- `POST v3/me/favorites/{id}` -- Add favorite
- `DELETE v3/me/favorites/{id}` -- Remove favorite
- `GET v5/favorites` -- List all favorites
- `POST v3/me/blocks/{id}` -- Block user
- `DELETE v3/me/blocks/{targetProfileId}` -- Unblock user
- `DELETE v3/me/blocks` -- Unblock all
- `GET v4/me/blocks` -- List blocks with pagination

**Components that implement it:**
- `FavoriteProfileDao` / `FavoriteLiteDao` -- Local favorite storage
- `BlockedProfileDao` -- Local block storage
- `BannedProfileDao` -- Server-enforced bans
- Favorites filter in cascade

**Step-by-step implementation:**
1. Add favorite: `POST v3/me/favorites/{profileId}` -> sync to `FavoriteProfileDao`
2. Remove favorite: `DELETE v3/me/favorites/{profileId}` -> delete from local DB
3. Load favorites: `GET v5/favorites` -> `FavoriteLiteList` -> merge with local cache
4. Block user: `POST v3/me/blocks/{profileId}` -> add to `BlockedProfileDao` -> remove from cascade
5. Unblock: `DELETE v3/me/blocks/{profileId}` -> remove from local DB
6. Filter cascade by favorites: use `favorite=true` query param

**Common pitfalls:**
- Favorites and blocks are bidirectional sync. Local changes must be pushed to server, and server state must be pulled on app start.
- The `GET v5/favorites` endpoint returns `FavoriteLiteList` (lightweight). Full profile data comes from the cascade.
- Blocking a user removes them from all views immediately. Unblocking may take time to propagate.
- `GET v4/me/blocks` supports pagination via `page` and `updateTime` params. Use `updateTime` for incremental sync.

---

## Feature 4: Video Call & Video Roulette

**What it does:** One-on-one video calls with WebRTC-style signaling, plus a "video roulette" feature that randomly matches you with someone for a video chat. Includes call creation, joining, renewal, and termination.

**API methods used:**
- `POST /v3/video-call` -- Create call
- `PUT /v3/video-call` -- Join call
- `PATCH /v3/video-call` -- Renew/extend call
- `DELETE /v3/video-call/{creatorProfileId}` -- End call
- `GET /v3/video-call` -- Get call info
- `POST v4/video-roulette` -- Start roulette match
- `GET v4/video-roulette/{matchId}` -- Get match info
- `POST v4/video-roulette-call` -- Create roulette call
- `PUT v4/video-roulette-call/{matchId}` -- Join roulette call

**Components that implement it:**
- `VideoCallActivity` (singleTask) -- Main call UI
- `VideoCallDialogActivity` -- Incoming call dialog
- `VideoCallForegroundService` -- Keeps call alive in background
- `PrivateVideoChatService` -- XMPP-based call signaling
- `VideoRouletteActivity` / `VideoRouletteGuideActivity` -- Roulette UI

**Step-by-step implementation:**
1. Create call: `POST /v3/video-call` -> `CreateVideoCallResponse` with session details
2. Notify recipient via XMPP (video call message type)
3. Recipient joins: `PUT /v3/video-call` -> `JoinVideoCallResponse`
4. Start foreground service: `VideoCallForegroundService` with `dataSync` type
5. Renew call before timeout: `PATCH /v3/video-call` -> `RenewVideoCallResponse`
6. End call: `DELETE /v3/video-call/{creatorProfileId}`
7. For roulette: `POST v4/video-roulette` -> get matched -> create call via `v4/video-roulette-call`

**Common pitfalls:**
- Video calls require Unlimited subscription. Free/XTRA users see an upsell.
- The `VideoCallForegroundService` is mandatory -- without it, Android kills the call process.
- Call signaling happens over XMPP, not the REST API. The REST endpoints manage session state.
- Roulette matches are server-assigned. You cannot choose who you match with.
- The call has a timeout. Renew via `PATCH` before it expires, or the call drops.

---

## Feature 5: Profile Verification & NSFW Detection

**What it does:** Verify user identity through face detection and OCR. Detect NSFW content in uploaded photos using a TensorFlow Lite model. Gate content visibility based on verification status and NSFW scores.

**API methods used:**
- `POST v4/recognition/face` -- Submit face detection result
- `POST v4/recognition/chat` -- Submit OCR result
- `GET /v4/profiles/supportedFeatures/{targetProfileId}` -- Check verification status
- `POST /v4/profiles/status` -- Update profile status

**Components that implement it:**
- ML Vision pipeline (face, OCR, barcode detection)
- `NSFWDetectionDao` -- Local NSFW detection cache
- NSFW TFLite model: `https://nsfw.grindr.com/nsfw.tflite`
- Photo approval flow (pending -> approved/rejected)

**Step-by-step implementation:**
1. User uploads profile photo
2. Run local face detection via ML Kit
3. Submit result: `POST v4/recognition/face` with `FaceDetectionResult`
4. Run OCR on photo (for text/ID detection)
5. Submit OCR: `POST v4/recognition/chat` with `OCRResultRequest`
6. Run NSFW TFLite model locally on the image
7. Cache result in `NSFWDetectionDao`
8. Upload photo with NSFW score metadata
9. Server reviews and sets photo approval status
10. Check verification status via `supportedFeatures/{targetProfileId}`

**Common pitfalls:**
- The NSFW model is downloaded from `nsfw.grindr.com` and cached locally. Do not bundle it in the APK.
- Face detection and OCR run on-device, not server-side. The API receives the results, not the raw image.
- Photos have a pending/approved/rejected lifecycle. The `ChatPhotoDao` tracks this state.
- NSFW content is only visible to users with `acceptNSFWPics=1` in their profile.
- The verification badge is earned through a threshold of other verified users confirming your identity.

---

*Appended: 2026-08-14*
*Developer Quick Start & Feature Blueprints added by ZCode Documentation Writer*

---

# PAGE FLOW DIAGRAMS

## Flow 1: App Launch & Session

```
App Launch
    |
    v
GrindrApplication.onCreate()
    |-- Dagger DI setup
    |-- Firebase init
    |-- Register broadcast receivers
    |
    v
[Has Session?] --Yes--> HomeActivity
    |                         |
    No                         v
    |                    Bootstrap API (unauthed)
    v                         |
LoginActivity                 v
    |-- Email login: POST v3/sessions
    |-- Phone login: POST v4/sms/sessions
    |-- Social: POST v3/sessions/thirdparty
    |
    v
Auth Response --> Store token --> Connect XMPP
    |                                  |
    v                                  v
HomeActivity                   WebSocket (/session/websocket)
    |-- Cascade grid             |-- Presence updates
    |-- Bottom tabs              |-- Typing indicators
    |-- Unread badge             |-- Online status
```

## Flow 2: Cascade (Profile Browsing)

```
HomeActivity --> CascadeFragment
    |
    v
GET v4/locations/{geohash}/profiles
    |-- 22 filter parameters
    |-- Online, age, height, weight, tribes, etc.
    |
    v
Grid Display (CascadeDao cache)
    |-- Profile cards with photo, name, age, distance
    |-- Online indicator
    |-- Tap to view profile
    |
    v
[Scroll to bottom?] --Yes--> Load more (pageNumber++)
    |
    v
[Unlimited user?] --Yes--> GET v4/locations/{geohash}/unlimited-profiles
    |                            (searchAfterDistance pagination)
    No
    |
    v
[XTRA filter?] --Yes--> Premium filter UI (MyType)
```

## Flow 3: Chat (XMPP)

```
Tap Profile --> ChatActivityV2
    |
    v
GrindrXMPPManager.connect()
    |-- XMPPTCPConnection with TLS
    |-- AccountManager auth
    |-- Stream Management (ack/resume)
    |
    v
Load History: GET v3/me/chat/messages?limit=50
    |
    v
Real-time messages via XMPP
    |-- Text, Image, Audio, Video, Location
    |-- Chat states (composing, paused)
    |-- Delivery receipts (XEP-0184)
    |-- Display receipts (XEP-0333)
    |
    v
Send Message
    |-- ChatSendLocalMessageHandler
    |-- Store in Room DB (status: SENDING)
    |-- XMPP send via GrindrXMPPManager
    |-- Stream Ack --> status: SENT
    |-- Recipient received --> status: RECEIVED
    |-- Recipient opened --> status: DISPLAYED
```

## Flow 4: Video Call

```
Tap "Video Call" --> POST /v3/video-call
    |-- CreateVideoCallRequest
    |
    v
VideoCallActivity (singleTask)
    |-- WebRTC connection setup
    |-- VideoCallForegroundService
    |
    v
Other User Receives Invitation
    |-- PUT /v3/video-call (JoinVideoCallRequest)
    |
    v
Connected
    |-- PATCH /v3/video-call (RenewVideoCallRequest) -- periodic
    |-- Video/Audio streams via WebRTC
    |
    v
End Call
    |-- DELETE /v3/video-call/{creatorProfileId}
    |-- Feedback: "How was the call?"
```

## Flow 5: Settings & Privacy

```
SettingsActivity
    |
    +--> Notification Settings
    |       |-- Per-type toggles
    |       |-- DND schedule
    |
    +--> Privacy Settings
    |       |-- Incognito mode: PUT v3/me/prefs/settings {incognito: true}
    |       |-- Show distance toggle
    |       |-- Show age toggle
    |
    +--> Profile Edit
    |       |-- PUT v3.1/me/profile (UpdateProfileRequest)
    |       |-- Photo management
    |       |-- Saved phrases
    |
    +--> Account
    |       |-- Change password
    |       |-- Change email
    |       |-- Delete account: DELETE v3/me/profile
    |
    +--> Blocked Users
    |       |-- GET v4/me/blocks
    |       |-- Unblock: DELETE v3/me/blocks/{id}
    |
    +--> Backup
            |-- POST /v3.1/chat/backup (ChatBackupFileRequest)
            |-- Auto: Sunday midnight on WiFi
```

---

# ERROR HANDLING PATTERNS

## Pattern 1: Circuit Breaker (API Resilience)

Grindr implements Resilience4j-style circuit breakers:
```
Per-endpoint CircuitBreaker
    |-- ClosedState: counting failures
    |-- OpenState: rejecting calls (after threshold)
    |-- HalfOpenState: testing with sample calls
    |
    v
CircuitBreakerOpenException --> Show "Service temporarily unavailable"
```

## Pattern 2: XMPP Reconnection

```
Connection lost
    |
    v
ReconnectManager
    |-- ExponentialSocketReconnectionStrategy
    |-- Backoff: 1s -> 2s -> 4s -> 8s -> 16s -> 30s (max)
    |
    v
[Max retries?] --Yes--> Show "Connection lost" banner
    |
    No
    v
Retry connection --> Success --> Resume message queue
```

## Pattern 3: Failed Message Queue

```
Message send fails
    |
    v
FailedSendMessageManager
    |-- Store in retry queue
    |-- Retry on next connection
    |-- Max retries before permanent failure
    |
    v
[Retries exhausted?] --Yes--> Show "Failed to send" indicator
    |
    No
    v
Auto-retry on reconnect
```

## Pattern 4: Token Refresh

```
API returns 401
    |
    v
SessionResponseInterceptor
    |-- RefreshTokenHelper attempts refresh
    |-- RefreshTokenRetryController manages retry
    |
    v
[Refresh success?] --Yes--> Retry original request with new token
    |
    No
    v
Redirect to LoginActivity
    |-- Log expired session event
```

## Pattern 5: Background Restriction

```
App backgrounded
    |
    v
BackgroundRestrictionInterceptor
    |-- Reduces API call frequency
    |-- Pauses non-critical sync
    |
    v
ForegroundService for critical operations
    |-- Video call
    |-- Chat backup
    |-- Photo upload
```

---

# PERFORMANCE CONSIDERATIONS

## 1. Per-User Database

- Room database per user: `grinder_{profileId}{hash}.db`
- Prevents data leakage between accounts
- WAL journal mode for concurrent reads
- FTS (Full-Text Search) on chat messages

## 2. XMPP Connection Management

- Single TCP connection with Stream Management (ack/resume)
- Reduces connection overhead
- Automatic reconnection with exponential backoff
- DNS resolution via `ChatDnsManager`

## 3. Image Loading

- GrindrFileRestService for profile photos
- Dynamic URLs from BootstrapPref
- Photo hash-based URL construction (no full URL in DB)
- Separate OkHttp clients for API vs file downloads

## 4. Ad Network Optimization

- 6 ad networks: MoPub, Vungle, Smaato, Fyber, PubNative, Braze
- Mediation layer for fill rate optimization
- Rewarded video for premium feature unlocks
- Consent-gated via OneTrust

## 5. Memory Management

- Glide for image caching with trim callbacks
- Room DAO lazy loading
- Per-user database prevents cross-user cache pollution
- `onLowMemory()` clears Glide cache + forces GC

## 6. Analytics Batching

- Google Data Transport for event batching
- Firebase Analytics with consent gating
- AppsFlyer for install attribution
- Braze for push/marketing

## 7. Offline Support

- Room database caches profiles, messages, favorites
- Failed message queue with retry
- Background sync via WorkManager
- Bootstrap config cached locally

## 8. Security

- SafetyNet device attestation
- TLS 1.3 for all connections
- XMPP SASL authentication
- Token-based API auth (Grindr3 scheme)
- Biometric app lock option
