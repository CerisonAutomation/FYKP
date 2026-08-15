# ROMEO v3.42.0 -- Quantum Extraction

> Package: `com.planetromeo.android.app`
> Generated: 2026-08-14 via ReverseAPK v1.2 + manual analysis
> Compile SDK: 35 (Android 15) | Java Files: 15,484 | Type: Native Android (Kotlin + Jetpack Compose)

---

## 1. ARCHITECTURE

### 1.1 Application Class

**File:** `PlanetRomeoApplication.java` (classes3.dex)

- Extends `android.app.Application`, implements `dagger.android.d` (Dagger Android injection interface)
- Singleton pattern via companion object (`PlanetRomeoApplication.Companion`)
- Application class registered in manifest: `com.planetromeo.android.app.core.PlanetRomeoApplication`
- Manifest flags: `largeHeap="true"`, `fullBackupContent="false"`, `extractNativeLibs="false"`
- Theme: `@style/PlanetRomeoTheme.NoActionBar`
- Locale config: `@xml/locale_config` (multi-language support)

**Injected Dependencies (via Dagger `@Inject`):**
| Field | Type | Purpose |
|-------|------|---------|
| `dispatchingAndroidInjector` | `DispatchingAndroidInjector<Object>` | Dagger Android activity/fragment injection |
| `accountDataSourceLazy` | `Lazy<PRAccountDataSource>` | Lazy-loaded account data |
| `accountProvider` | `AccountProvider` | Current account access |
| `analyticsManager` | `AnalyticsManager` | Firebase Analytics wrapper |
| `crashlytics` | `CrashlyticsInterface` | Firebase Crashlytics |
| `remoteConfig` | `RemoteConfig` | Firebase Remote Config |
| `messageDataSource` | `MessageDataSource` | Message data layer |
| `userLocationDataSource` | `Lazy<UserLocationDataSource>` | GPS location provider |
| `notificationReceiver` | `NotificationReceiver` | Push notification handler |
| `resendVerificationEmailReceiver` | `Lazy<ResendVerificationEmailReceiver>` | Email verification resend |
| `updateManager` | `UpdateManager` | App update checker |
| `workerFactory` | `WorkerFactory` | WorkManager factory |
| `glideOkHttpClient` | `Lazy<OkHttpClient>` (named "glide") | Glide image loading HTTP client |

**Initialization Sequence (`onCreate`):**
1. Set singleton instance
2. Initialize error handler
3. Set up RxJava error consumer
4. Register lifecycle observer (foreground/background tracking)
5. Build Dagger application component (`h0.a().a(this).build()`)
6. Inject application with component
7. Initialize Firebase (`FirebaseApp.initializeApp`)
8. Register `ActivityLifecycleCallbacks` (tracks resumed activity)
9. Register `LOCALE_CHANGED` broadcast receiver
10. Register `NotificationReceiver.HANDLE_NOTIFICATION` broadcast receiver
11. Set up `UiErrorHandler`
12. Register `ResendVerificationEmailReceiver`
13. Register Gson adapters for `FootprintWrapper` and `BedAndBreakFastWrapper`
14. Set default pick location preference
15. Initialize WorkManager

**Lifecycle Tracking:**
- `Application.ActivityLifecycleCallbacks` tracks currently resumed activity
- Foreground/background state tracked via `Lifecycle.Event.ON_START`/`ON_STOP`
- On move-to-foreground: if user is logged in and location needs refresh, triggers location update

**Memory Management:**
- `onLowMemory()`: Clears Glide memory cache + forces GC
- `onTrimMemory()`: Delegates to Glide's trim handler

### 1.2 UI Framework: Jetpack Compose

Confirmed via META-INF version markers and manifest:
```
META-INF/androidx.activity_activity-compose.version3
META-INF/androidx.compose.animation_animation-core.version3
META-INF/androidx.compose.animation_animation.version3
META-INF/androidx.compose.foundation_foundation-layout.version3
META-INF/androidx.compose.foundation_foundation.version3
META-INF/androidx.compose.material3_material3.version3
META-INF/androidx.compose.material_material-icons-core.version3
META-INF/androidx.compose.material_material-ripple.version3
META-INF/androidx.compose.material_material.version3
META-INF/androidx.compose.runtime_runtime-livedata.version3
META-INF/androidx.compose.runtime_runtime-rxjava2.version3
META-INF/androidx.compose.runtime_runtime-saveable.version3
META-INF/androidx.compose.runtime_runtime.version3
META-INF/androidx.compose.ui_ui-geometry.version3
META-INF/androidx.compose.ui_ui-graphics.version3
META-INF/androidx.compose.ui_ui-text.version3
META-INF/androidx.compose.ui_ui-tooling-data.version3
META-INF/androidx.compose.ui_ui-tooling-preview.version3
META-INF/androidx.compose.ui_ui-tooling.version3
META-INF/androidx.compose.ui_ui-unit.version3
META-INF/androidx.compose.ui_ui-util.version3
META-INF/androidx.compose.ui_ui.version3
META-INF/androidx.lifecycle_lifecycle-runtime-compose.version3
META-INF/androidx.lifecycle_lifecycle-viewmodel-compose.version3
META-INF/androidx.navigation_navigation-compose.version3
META-INF/androidx.paging_paging-compose.version3
```

**Compose libraries used:**
- `activity-compose` -- Activity integration
- `animation`, `animation-core` -- Compose animations
- `foundation`, `foundation-layout` -- Layout primitives
- `material3` -- Material Design 3
- `material-icons-core`, `material-ripple` -- Icons and ripple effects
- `runtime`, `runtime-livedata`, `runtime-rxjava2`, `runtime-saveable` -- State management
- `ui`, `ui-geometry`, `ui-graphics`, `ui-text`, `ui-tooling`, `ui-tooling-preview`, `ui-unit`, `ui-util` -- Core UI
- `lifecycle-runtime-compose`, `lifecycle-viewmodel-compose` -- Lifecycle integration
- `navigation-compose` -- Compose Navigation
- `paging-compose` -- Paging 3 with Compose

**Compose Preview Activity registered in manifest:**
```xml
<activity android:exported="true" android:name="androidx.compose.ui.tooling.PreviewActivity"/>
```

**Design System Playground:**
```java
public class DsPlaygroundActivity  // "Design system Playground" label in manifest
```

### 1.3 Navigation: Jetpack Navigation Compose

- `META-INF/androidx.navigation_navigation-compose.version3` confirms Navigation Compose
- Bottom navigation structure via `NavigationBar` items
- Compose screen files follow `*ScreenKt` naming (e.g., `RadarScreenKt`, `RadarMainTabScreenKt`, `FullImageViewScreenKt`, `MyPictureScreenKt`)

**Known Compose Screens:**
| Screen | File |
|--------|------|
| Radar main view | `RadarScreenKt.java` |
| Radar tabs | `RadarMainTabScreenKt.java` |
| Full image view | `FullImageViewScreenKt.java` |
| My pictures | `MyPictureScreenKt.java` |
| My picture list item | `MyPictureListItemKt.java` |
| My pictures vertical paging | `MyPicturesVerticalPagingListKt.java` |
| Their picture feed | `TheirPictureFeedVerticalPagingListKt.java` |
| Report picture dialog | `ReportPIctureDialogKt.java` |
| Captcha compose view | `ReportPIctureDialogKt$CaptchaComposeView` |

### 1.4 Dependency Injection: Dagger 2 (Android)

**Evidence:**
```
META-INF/com.google.dagger_dagger-android-support.version3
META-INF/com.google.dagger_dagger-android.version3
META-INF/com.google.dagger_dagger-lint-aar.version3
META-INF/com.google.dagger_dagger.version3
```

**Application implements `dagger.android.d`:**
```java
public class PlanetRomeoApplication extends Application implements dagger.android.d {
    @Inject DispatchingAndroidInjector<Object> dispatchingAndroidInjector;
    // ... 15+ @Inject fields
}
```

**Dagger Android patterns used:**
- `DispatchingAndroidInjector<Object>` -- Activity/Service injection
- `dagger.android.a.b(this)` -- Called in `FcmListenerService.onCreate()` (service injection)
- `H6.a<T>` (obfuscated `Lazy<T>`) -- Lazy providers throughout

**NOT using Hilt** -- uses raw Dagger Android with `@Inject` + `DispatchingAndroidInjector`.

### 1.5 Networking: gRPC-OkHttp + Retrofit

**gRPC:**
```
META-INF/services/io.grpc.ManagedChannelProvider
META-INF/services/io.grpc.Q
META-INF/services/io.grpc.Y
META-INF/services/io.grpc.e0
```

gRPC is used for primary API communication (protocol buffers). The OkHttp transport is used as the HTTP layer for gRPC.

**Retrofit:**
- `RetrofitHashMap` class in `core/network/` package
- `NetworkHealth` class in `core/network/` package
- `ApiException` class defines API error codes

**OkHttp:**
- Multiple OkHttp clients injected (one named "glide" for image loading)
- WebSocket support via OkHttp WebSocket (used for real-time messaging)
- Public suffix list: `okhttp3/internal/publicsuffix/publicsuffixes.gz`

**API Error Codes (from `ApiException.java`):**
| Code | Constant | Meaning |
|------|----------|---------|
| `AUTH_INVALID_CREDENTIALS` | Login failed | |
| `AUTH_WRONG_API_KEY` | Invalid API key (403) | |
| `AUTH_NOT_LOGGED_IN` | Session expired | |
| `AUTH_NOT_ENOUGH_PRIVILEGES` | Feature requires PLUS | |
| `AUTH_LIMIT_EXCEEDED` | Rate limit / contact limit | |
| `AUTH_BLOCKED_BY_PROFILE_OWNER` | User blocked you | |
| `AUTH_PROFILE_UNVERIFIED` | Email not verified | |
| `AUTH_PROFILE_DEACTIVATED` | Account deactivated | |
| `AUTH_PROFILE_BANNED` | Account banned | |
| `AUTH_ACCOUNT_NOT_CONFIRMED` | Email confirmation pending | |
| `ARGUMENT_INVALID` | Invalid parameter | |
| `ARGUMENT_REQUIRED` | Missing parameter | |
| `RESOURCE_ALREADY_EXISTS` | Duplicate resource | |
| `RESOURCE_NOT_FOUND` | Not found | |
| `TOO_MANY_REQUESTS` | Rate limited | |
| `PICTURE_INVALID_RATING` | Photo content rating issue | |
| `REACTIONS_NOT_ACCESSIBLE` | Cannot see reactions | |
| `INTERACTION_NOT_ALLOWED` | Action blocked | |
| `RECEIVER_IS_MESSAGE_PROTECTED` | Cannot message user | |
| `PROFILE_PARTNER_SELF` | Cannot link own profile | |
| `APPSTORE_DUPLICATE_PURCHASE` | Double purchase | |
| `GET_PROFILES_ARGUMENT_INVALID_handle` | Search parameter error | |

**API Error Context Constants:**
- `POST_SESSION` -- Login endpoint
- `PUT_ACCOUNT` -- Profile update
- `POST_PICTURES` -- Photo upload
- `POST_PICTURES_ALBUMS_SHARED_GRANTS` -- QuickShare album grant
- `POST_PAYMENT_APPSTORE_GOOGLE_PURCHASES` -- Payment processing
- `GET_PROFILES` -- Profile search/browse

### 1.6 Local Database

**File:** `PlanetRomeoDB.java`

**Not using Room ORM** -- uses raw SQLite via `SQLiteOpenHelper`. Database version: 12.

**Schema:**

**MESSAGES table:**
```sql
CREATE TABLE MESSAGES (
    _id TEXT UNIQUE NOT NULL,
    headline TEXT,
    text TEXT,
    date TEXT,
    from_id TEXT,
    to_id TEXT,
    other_id TEXT,
    complete INTEGER,
    unread INTEGER,
    locked INTEGER,
    spam INTEGER,
    expires TEXT,
    attachments TEXT,    -- JSON array of MessageAttachmentDom
    internal_state INTEGER NOT NULL DEFAULT 0
);
```
**Indexes:**
- `msg_to_date` on (to_id, date)
- `msg_from_date` on (from_id, date)
- `msg_from_internal_state_data` on (from_id, internal_state, date)
- `msg_to_internal_state_data` on (to_id, internal_state, date)
- `msg_other_id_data` on (other_id, date)

**USERS table:**
```sql
CREATE TABLE USERS (
    _id TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT,
    status TEXT,
    online_status TEXT,
    last_login TEXT,
    date_visited TEXT,
    headline TEXT,
    contact BLOB,
    location BLOB,
    non_contactable INTEGER,
    deactivated INTEGER,
    is_online INTEGER,
    is_favorite INTEGER,
    is_in_folder INTEGER,
    preview_pic BLOB,
    internal_state TEXT,
    blocked INTEGER DEFAULT 0
);
```

**PICTURES table:**
```sql
CREATE TABLE PICTURES (
    _id TEXT UNIQUE NOT NULL,
    token TEXT,
    url_token TEXT,
    comment TEXT,
    rating TEXT,
    width INTEGER,
    height INTEGER
);
```

**Message DB States (internal_state enum):**
| Value | State |
|-------|-------|
| 0 | NOTHING |
| 1 | INSERTING |
| 2 | UPDATING |
| 3 | DELETING |
| 4 | DRAFT |

**Message Attachment Types:**
- `COMMAND` -- System commands (action, url, text, format, album_id)
- `IMAGE` -- Photo attachments (id, token, url_token)
- `LOCATION` -- Shared location (lat, long, sensor, name)

**Message Transmission Status Logic:**
- If `other_id == from_id` -> RECEIVED
- If `internal_state == DRAFT` -> DRAFT
- If `internal_state == INSERTING` -> TRANSMITTING
- Otherwise -> SENT

### 1.7 Room Database (secondary)

Evidence of Room usage alongside raw SQLite:
```
META-INF/androidx.room_room-ktx.version3
META-INF/androidx.room_room-paging.version3
META-INF/androidx.room_room-runtime.version3
META-INF/androidx.room_room-rxjava3.version3
```
Also: `androidx.room.MultiInstanceInvalidationService` in manifest.

Room is likely used for newer features (paging, modern data layer) while `PlanetRomeoDB` is the legacy messaging database.

### 1.8 Preferences

**File:** `PlanetRomeoPreferences.java`

SharedPreferences name: `"planetromeo"`

**Key Preferences:**
| Key | Type | Purpose |
|-----|------|---------|
| `PREF_PUSH_NOTIFICATIONS` | boolean | Master push toggle |
| `PREF_PUSH_NOTIFICATIONS_SOUND` | boolean | Push sound |
| `PREF_PUSH_SOUND` | String | Push notification sound file |
| `PREF_PUSH_FOOTPRINT_STYLE` | int | Footprint notification style |
| `PREF_PUSH_MESSAGE_STYLE` | int | Message notification style |
| `like_push_settings` | boolean | Like notification toggle |
| `likes_notification_enabled` | boolean | Likes notifications |
| `messages_notification_enabled` | boolean | Messages notifications |
| `visitors_notification_enabled` | boolean | Visitors notifications |
| `footprint_notification_enabled` | boolean | Footprint notifications |
| `pref_sound_preference_sound_effects` | boolean | Sound effects |
| `pref_sound_preference_vibrate` | boolean | Vibration |
| `pref_current_location_address_object` | String | Current location address (JSON) |
| `pref_cached_location_address_objects` | String | Cached locations (JSON) |
| `pref_last_logged_in_account_id` | String | Last account ID |
| `PREF_LAST_UNREAD_MESSAGES_TIMESTAMP` | String | Last unread timestamp |
| `PREF_LAST_UPDATE_TIME` | long | Last update check |
| `PREF_PICTURE_FORMAT` | String | Picture format version |
| `LAST_PICTURE_FORMAT_UPDATE` | long | Last format update |
| `pref_apprater_launch_count` | int | App launch counter |
| `pref_apprater_launch_first_time` | long | First launch time |
| `pref_settings_metric_or_imperial` | int | Distance unit (0=metric, 1=imperial) |
| `KEY_AUTHENTICITY_THRESHOLD_LOWER` | int | Verification score lower bound |
| `KEY_AUTHENTICITY_THRESHOLD_UPPER` | int | Verification score upper bound |
| `KEY_AUTHENTICITY_BOUND_LAST_REFRESH` | long | Last verification refresh |
| `cookie_consent_device_level` | String | Cookie consent (JSON) |
| `KEY_TEST_BED` | String | Debug/test bed config |
| `pref_uncut_update_download_id` | long | UNCUT app download ID |
| `PREF_TAB_LIST_MODE_plus` | String | Grid/list mode for PLUS users |
| `PREF_TAB_LIST_MODE_nonplus` | String | Grid/list mode for free users |
| `like_notification_id` | int | Notification ID counter |

### 1.9 Analytics

**File:** `AnalyticsImpl.java`

- Implements `AnalyticsManager` interface
- Single analytics receiver: `AnalyticsReceiver.Firebase`
- Firebase Analytics wrapper (`b` class = `FirebaseWrapper`)
- Consent-gated via `AnalyticsConsentDataSource`
- Supports screen tracking, custom events, and user properties
- Uses Kotlin Coroutines Flow for consent state

### 1.10 Remote Config

**File:** `RemoteConfig.java`

Firebase Remote Config with 12-hour refresh interval. Controls feature flags and configuration.

**Remote Config Keys and Defaults:**
| Key | Default | Purpose |
|-----|---------|---------|
| `travel_standard_locations` | London, Paris, Amsterdam, SF, Rio | Default travel cities |
| `travel_page_list` | 6 lane types | Travel page layout |
| `travel_max_radius` | 25000 | Max travel radius (meters) |
| `min_booked_location_gap` | 30000 | Min gap between travel bookings |
| `show_discover_feature` | true | Enable discover tab |
| `discover_page_list` | 9 lane types | Discover page layout |
| `discover_item_count` | 6 | Items per discover lane |
| `show_popular_in_travel` | true | Popular profiles in travel |
| `preview_listview_length` | 4 | Preview list items |
| `radius_map_restriction` | 100.0 | Map zoom restriction |
| `radar_available_stats_post_3_22` | All DisplayStat values | Available profile stats |
| `radar_max_selected_stats` | 6 | Max selectable stats |
| `show_preview_listview` | true | Show list view preview |
| `show_preview_big_grid` | true | Show big grid preview |
| `popular_strategy` | "jocks" | Popular profiles algorithm |
| `show_stats_interview` | true | Stats interview on signup |
| `age_range_delta` | 7 | Age range step size |
| `signup_search_filter` | SearchFilter (default) | Default search filters |
| `version_code_optional_update` | 1100000551 | Optional update threshold |
| `version_code_immediate_update` | 1100000551 | Mandatory update threshold |
| `transaction_history_visibility` | true | Show payment history |
| `show_play_store_in_app_review` | true | In-app review prompt |
| `rejected_profile_check_message` | true | Check rejected profiles |
| `rejected_profile_show_banner` | true | Show rejected profile banner |
| `rejected_profile_support_chat` | true | Support chat for rejected |
| `force_mandatory_uncut_updates` | false | Force UNCUT update |
| `enable_hardware_bitmap` | false | HW bitmap acceleration |
| `show_chat_icon_on_radar` | false | Chat icon on radar cards |
| `show_linked_icon_on_radar` | false | Linked icon on radar cards |
| `use_static_signup_background` | true | Static signup bg image |
| `rate_the_app` | true | App rating prompt |
| `become_beta_tester` | true | Beta tester option |
| `show_get_verified_on_side_menu` | true | Verification in side menu |
| `show_groups_on_side_menu` | false | Groups in side menu |
| `show_exit_interview` | false | Exit interview on delete |
| `show_report_picture_on_feed` | false | Report button on feed pics |
| `get_verified_url_link` | romeo.com verification URL | Verification info link |
| `discover_lane` | All DiscoverLane entries | Discover lane config |
| `footprint_gridview_columns` | (int) | Footprint grid columns |

**Discover Lane Types (from remote config):**
- `VIEW_TYPE_PROMO_CONTAINER`
- `VIEW_TYPE_CONTACTS_LANE`
- `VIEW_TYPE_DISTANCE_LANE`
- `VIEW_TYPE_ONLINE_LANE`
- `VIEW_TYPE_NEWEST_LANE`
- `VIEW_TYPE_BLOG_CONTAINER`
- `VIEW_TYPE_TRAVELLERS_LANE`
- `VIEW_TYPE_POPULAR_LANE`
- `VIEW_TYPE_BED_BREAKFAST`

---

## 2. FEATURES

### 2.1 Authentication

**Activities:**
- `LoginActivity` -- Email/password login
- `ActivitySignup` -- New account registration
- `ForgotPasswordActivity` -- Password reset
- `AccountListActivity` -- Multi-account picker
- `ProfileDeactivatedActivity` -- Deactivated account screen

**Login methods (from strings):**
- Email/password
- Facebook OAuth (`FacebookCredentials` class, `CredentialType` enum)
- Account list switching

**Auth Flow:**
- Credentials stored locally (`Credentials`, `PasswordBasedCredentials`, `FacebookCredentials` classes)
- `PRAccount` model with `PRAccountSettings`
- API key validation (`AUTH_WRONG_API_KEY`)
- Email verification required for messaging (`AUTH_PROFILE_UNVERIFIED`)
- Profile deactivation/banning detection

### 2.2 Radar (Profile Browsing)

**The core browsing feature.** Replaces the old "Cruise" terminology.

**Components:**
- `RadarScreenKt` -- Compose radar screen
- `RadarMainTabScreenKt` / `RadarMainTabViewModel` -- Tab-based radar with multiple views
- `SearchViewModel` -- ViewModel for search with Paging 3
- `SearchTabs` -- Tab options including `ROMEOS` tab
- `RadarService` -- Network service for radar data
- `EditRadarSettingsActivity` -- Filter configuration
- `TagCategoryView`, `TagContainer` -- Filter tag UI

**Radar Grid Views (from strings):**
- Grid view options for PLUS users
- Customizable profile stat display
- Up to 6 selectable stats

**Cruise Tabs (from `CruiseTab` enum):**
| Tab | Index |
|-----|-------|
| `VISITORS` | 0 |
| `VISITED` | 1 |
| `LIKES` | 2 |

**Search:**
- Uses `PagingData` from Paging 3 library
- `Pager` with `CachedPagingData` for infinite scroll
- Search filters defined in `SearchFilter` model
- 120+ search options available with PLUS

**SearchFilter Fields (from `SearchFilter.java`):**
| Field | Type | Description |
|-------|------|-------------|
| `personal` | `SearchFilterPersonal` | Personal attributes (age, height, weight, body type, ethnicity, relationship) |
| `hobby` | `SearchFilterHobby` | Hobby/interest filters |
| `sexual` | `SearchFilterSexual` | Sexual preferences (position, size, safer sex, dirty, SM, fisting) |
| `fulltext` | `String` | Free-text search |
| `fulltextSearchMode` | `FullTextSearchMode` | Text search mode |
| `travellersFilter` | `TravellerFilter` | Travel filter (INCLUDED/EXCLUDED/TRAVELLERS_ONLY) |
| `bedBreakfastFilter` | `BedBreakfastFilter` | B&B filter (WITH/WITHOUT/ONLY) |
| `onlineStatus` | `List<OnlineStatusFilter>` | Online status filter |
| `isWithPicture` | `Boolean` | Only profiles with pictures |
| `profileIds` | `String[]` | Specific profile IDs |
| `geoPosition` | `GeoPosition` | Location-based filter |
| `strategy` | `String` | Sort strategy (default: "jocks") |
| `tags` | `Set<Tag>` | Tag-based filters |
| `userId` | `String` | Specific user ID |
| `username` | `String` | Username search |
| `popular` | `boolean` | Popular profiles only |
| `name` | `String` | Named saved search

### 2.3 Messaging System

**Components:**
- `MessengerFragment` -- Chat list / message inbox
- `MessageRepository` -- Message data access
- `DataMigrationActivity` -- Legacy message migration

**Database:** Raw SQLite (`PlanetRomeoDB`) with MESSAGES table

**Message Features:**
- Text messages
- Image attachments (via `MessageAttachmentDom.Image`)
- Location sharing (via `MessageAttachmentDom.Location`)
- Command attachments (via `MessageAttachmentDom.Command`)
- Draft messages (state: DRAFT)
- Message locking
- Spam reporting
- Expiring messages (expires field)
- Read receipts (`unread` field)
- Transmission status tracking (DRAFT, TRANSMITTING, SENT, RECEIVED)
- Saved phrases for faster chat
- Message syncing

**Push notification event:** `PushMessage.EVENT_NAME.MESSAGE`

### 2.4 Footprints (Visits / Profile Views)

**Activities:**
- `FootprintsActivity` -- Visit tracking screen

**ViewModels:**
- `FootprintsViewModel` with `initializeFootprints`, `onFootprintClick`, `onRetryClick`

**Features:**
- View who visited your profile
- Free users: last 24 hours only
- PLUS users: last 7 days
- Can leave footprints on profiles
- Can set/remove footprints
- Clear all visits
- Hide profile visits (PLUS feature)

**Push notification event:** `PushMessage.EVENT_NAME.FOOTPRINT`

**Related preferences:**
- `footprint_notification_enabled`
- `PREF_PUSH_FOOTPRINT_STYLE` (NORMAL vs other styles)

### 2.5 QuickShare (Private Photo Albums)

**Features:**
- Share private album with someone for 1 hour
- Request access to QuickShare albums
- Grant access to QuickShare albums
- Revoke QuickShare access
- Limited per-day for free users, unlimited for PLUS

**Album Management:**
- `AlbumListActivity` -- List all albums
- `DisplayAlbumActivity` -- View album contents
- `AlbumSelectionActivity` -- Select photos for album
- `SelectSectionedAlbumActivity` -- Sectioned album picker
- `UploadPictureService` -- Background photo upload (foreground service, dataSync type)

**Album Features:**
- Create new albums
- Delete albums
- Make albums public/private
- Set album as main profile picture
- Photo ordering (drag to reorder)
- Sectioned albums (organized galleries)

**Picture Model:**
- `PictureDom` with id, token, url_token
- Rating system (content ratings)
- Width/height metadata

### 2.6 Travel Mode (Spartacus)

**Activity:** `SpartacusWebViewActivity` -- WebView-based travel overview

**Features:**
- Add travel plans to be seen in up to 5 cities
- PLUS users visible in Radar 2 weeks before arrival
- Standard travel locations: London, Paris, Amsterdam, San Francisco, Rio de Janeiro
- Travel dates management (cannot be in past)
- Travel headline
- Travelers arriving section
- Travelers only filter
- Other travelers section
- Explore other places with travel search
- Travel page list with multiple lane types

**Remote Config:**
- `travel_standard_locations` -- Default cities
- `travel_max_radius` -- 25km max
- `min_booked_location_gap` -- 30km gap between bookings
- `show_popular_in_travel` -- Popular profiles in travel view

### 2.7 Profile Management

**Activities:**
- `ViewProfileActivity` -- View other profiles
- `EditProfileActivity` -- Edit own profile
- `PickProfileActivity` -- Choose from multiple profiles
- `ChangeEmailActivity` -- Change email address
- `StatsInterviewActivity` -- Profile stats setup interview

**Profile Data Model (`ProfileDom`):**
- ID, name, type, status, online status, last login
- Contact info (blob)
- Location (blob)
- Headline/bio
- Preview picture
- Online/offline status
- Favorite status
- Blocked status
- Deactivated status
- Non-contactable flag

**Profile Verification:**
- Authenticity scoring system with thresholds
- Verification badge: `authenticity_verified_user`, `authenticity_unverified_user`, `authenticity_known`, `authenticity_known_by`
- Verification status: "Probably authentic", "Authenticated", "Not yet authenticated"
- Contribute to other users' verification
- "Known personally" feature with threshold requirement
- Verification URL: `https://www.romeo.com/en/care/safety/#verification`

### 2.8 Friends / Contacts

**Activities:**
- `FriendRequestsActivity` -- Incoming friend requests
- `EditContactActivity` -- Edit contact details

**Components:**
- `ContactsViewModel` with `fetchContactFolders`, `renameContactFolder`, `deleteContactFolder`, `createContactFolder`

**Features:**
- Contact folders for organization
- Save as contact
- Save/block unlimited profiles (PLUS)
- Saved contacts limit for free users

### 2.9 Photos & Media

**Activities:**
- `MediaViewerActivity` -- Full media viewer
- `AlbumListActivity` -- Album list
- `DisplayAlbumActivity` -- Album contents
- `AlbumSelectionActivity` -- Photo picker

**Compose Screens:**
- `MyPictureScreenKt` -- Own photos management
- `MyPicturesVerticalPagingListKt` -- Own photo feed with vertical paging
- `MyPictureListItemKt` -- Photo list item
- `MyPictureScreenViewModel` -- ViewModel for photo management
- `TheirPictureFeedVerticalPagingListKt` -- Other user's photos feed
- `FullImageViewScreenKt` -- Full screen image viewer
- `ReportPIctureDialogKt` -- Report photo dialog with CAPTCHA

**Photo Features:**
- Upload unlimited pictures (PLUS)
- Sectioned albums
- Photo rating system
- Picture format management
- "Too hot" picture handling
- Picture reporting with CAPTCHA verification
- EXIF data handling (GPS coordinates managed)

### 2.10 Romeo Plus (Premium)

**Subscription Tiers (from strings):**
| Tier | Description |
|------|-------------|
| `PLUS (free)` | Free trial |
| `PLUS (compensation)` | Compensation credit |
| `PLUS (gift received)` | Gift |
| `PLUS (promotion)` | Promotional |
| `PLUS (referral)` | Referral bonus |
| `PLUS (voucher)` | Voucher redemption |
| `PLUS (with renewal)` | Auto-renewing |
| `PLUS (without renewal)` | One-time purchase |

**PLUS Features (from strings):**
- Unlimited Radar results and scrolling
- 120+ search options
- Grid view customization and stat display
- Hide profile visits within 30 seconds
- Invisible Mode (appear offline)
- Save, edit, and send chat phrases
- Unlimited QuickShare album sharing
- Upload unlimited pictures
- See visitors from last 7 days (free: 24 hours only)
- Be seen in travel location 2 weeks before arrival
- Save/block unlimited contacts
- Send saved phrases
- See XXX content
- App appear offline with PLUS
- Unlock over 120 search options

**Billing:**
- `BillingActivity` -- PLUS membership management
- `PaymentHistoryActivity` -- Transaction history
- `PaymentOrderActivity` -- Purchase flow
- `BillingViewModel` with `fetchMembershipSummary`
- Google Play Billing v8.0.0

**Push notification:** `PushMessage.EVENT_NAME.PLUS_STATUS_CHANGED`

### 2.11 Video Calls

**Features (from strings):**
- Incoming video calls
- Allow incoming video calls toggle
- Call declined / Call ended / Call ended unexpectedly
- Missed video calls
- Video call screening
- "How was the call?" feedback
- In a call / Ongoing call / Calling...
- Incoming video call notification
- Video paused / Video started

**Limitation:** Video calling requires enabling in settings (`Please enable video calls`)

### 2.12 Video Chat

**Evidence from R.java string resources:**
| Resource | Purpose |
|----------|---------|
| `ic_call_answer_video` | Video call answer icon |
| `menu_item_videochat` | Video chat menu item |
| `array_videochat_settings_allow_all` | Video chat settings array |
| `call_notification_answer_video_action` | Notification action |
| `notification_channel_videochat` | Video chat notification channel |
| `notification_channel_videochat_end_call` | End call channel |
| `title_settings_videochat` | Video chat settings title |
| `videochat_active_call` | Active call state |
| `videochat_audio_muted` / `videochat_audio_unmuted` | Audio mute states |
| `videochat_call_error` | Call error |
| `videochat_calling_info` / `videochat_calling_info_incoming` | Calling state info |
| `videochat_connection_failed` | Connection failure |
| `videochat_end_call` | End call label |
| `videochat_feedback_*` | Post-call feedback (button, description, dialog, snackbar) |

**Video Chat Features:**
- Incoming/outgoing video calls
- Audio mute/unmute during calls
- Connection error handling
- Post-call feedback system
- Notification channel for video calls
- Settings to control video chat visibility

### 2.13 Discover (Browse by Category)

**Discover Lane Types (from `DiscoverLane` enum):**
| Lane | String Resource |
|------|----------------|
| `BLOG` | null (no title) |
| `NEW` | `sort_newest` |
| `TRAVELLERS_ARRIVING` | `discover_travelers_title` |
| `EYECANDY` | `discover_popular_title` |
| `PICTURES_I_LIKED` | `pictures_i_liked_toolbar_title` |

**Components:**
- `DiscoverScreenKt` -- Compose discover screen
- `DiscoverLaneItemKt` -- Lane item component
- `DiscoverService` -- Network service for discover data

### 2.14 Bed & Breakfast (Accommodation)

**Model:** `BedBreakfast` (in profile data)

**Filter:** `BedBreakfastFilter` enum: WITH, WITHOUT, ONLY

**Components:**
- `BedAndBreakFastWrapper` -- Data wrapper
- `BedAndBreakfastWrapperGsonAdapter` -- Gson serialization
- `BedAndBreakfastRequest` -- API request model

**Search Integration:** B&B filter is part of the `SearchFilter` model, allowing users to filter profiles by accommodation availability.

### 2.15 Pictures I Liked

**Compose Screens:**
- `PicturesILikedGridScreenKt` -- Grid view of liked photos
- `PictureILikedVerticalFeedScreenKt` -- Vertical feed view
- `PicturesILikedService` -- API service for liked photos

**Features:**
- Grid view with pull-to-refresh
- Vertical feed view
- Photo likes tracking

### 2.16 Cruise (Visitors/Visited/Likes)

**Compose Screens:**
- `CruiseScreenKt` -- Main cruise screen
- `VisitorsScreenKt` -- Who visited you
- `VisitedScreenKt` -- Who you visited
- `LikesScreenKt` -- Who liked you
- `LikeDetailsScreenKt` -- Like details

**ViewModels:**
- `VisitorsViewModel` with `fetchVisitors`
- `VisitedViewModel` with `fetchVisited`
- `LikeDetailsViewModel` with `fetchLikeDetails`

**Services:**
- `VisitorsService` -- Fetch visitor data
- `VisitedService` -- Fetch visited data
- `LikesService` -- Fetch likes data

**Tab Navigation:** `CruiseTab` enum with VISITORS(0), VISITED(1), LIKES(2)

### 2.18 Display Stats (Profile Attributes)

**From `DisplayStat` enum -- all profile attributes shown on radar cards:**

| Stat | Source Field | Type |
|------|-------------|------|
| `AGE` | `PersonalInformation.age` | Integer |
| `HEIGHT` | `PersonalInformation.height` | Integer (cm/inches) |
| `WEIGHT` | `PersonalInformation.weight` | Integer (kg/lbs) |
| `POSITION` | `SexualInformation.analPosition` | `AnalPosition` enum |
| `AGE_RANGE` | `PersonalInformation.targetAge` | `TargetAge` (min-max) |
| `BODY_HAIR` | `PersonalInformation.bodyHair` | `BodyHair` enum |
| `BODY_TYPE` | `PersonalInformation.bodyType` | `BodyType` enum |
| `ETHNICITY` | `PersonalInformation.ethnicity` | `Ethnicity` enum |
| `RELATIONSHIP` | `PersonalInformation.relationship` | `Relationship` enum |
| `SIZE` | `SexualInformation.dickSize` | `DickSize` enum |
| `SAFE` | `SexualInformation.saferSex` | `SaferSex` enum |
| `DIRTY` | `SexualInformation.dirtySex` | `DirtySex` enum |
| `SM` | `SexualInformation.sm` | `Sm` enum |
| `FF` | `SexualInformation.fisting` | `Fisting` enum |

**PLUS users can customize which stats display on radar cards (up to 6 selectable).**

### 2.20 Signup Flow

**Signup Activity:** `ActivitySignup` with `SignupActivityViewModel`

**Signup Fragments (multi-step wizard):**
1. `LetsStartFragment` -- Welcome/intro screen
2. `ChooseUsernameAndPassFragment` -- Username + password
   - `AccountFieldValidationEnum` -- Field validation rules
   - `SignupValidationErrorType` -- Validation error types
3. `ChooseLocationSignupFragment` -- Location picker
   - `LocationAddressAdapterItem` -- Address suggestion
4. `CreateProfileFragment` -- Profile details
   - `CreateProfileUiState` -- UI state management
5. `DescribeYourselfFragment` -- Bio/description
6. `LetsGoDeeperFragment` -- Additional details
7. `LifestyleSignupFragment` -- Lifestyle preferences
8. `AddProfilePhotoFragment` -- Profile photo upload
9. `ResumeSignupFragment` -- Resume interrupted signup

**Signup Data Models:**
- `SignUpData` -- Cumulative signup data
- `SignupModel` -- Current signup state
- `SignupResponse` -- Server response
- `SignupScreenName` -- Screen navigation enum
- `SignupValidationRequest` -- Validation request
- `UpdateAccountRequest` -- Account creation request
- `SignupPreferencesImpl` -- Local signup persistence

**Signup Components:**
- `ChoosePictureView` -- Photo picker
- `CustomTextInputLayout` -- Styled text input
- `InputFieldSignup` -- Signup input field
- `InputFieldStatus` -- Input validation state
- `SelectableTextView` -- Selectable option
- `SignupDialogItem` -- Dialog picker item
- `SignupDialogConfigData` -- Dialog configuration

### 2.21 Notifications

**Service:** `FcmListenerService` (extends `FirebaseMessagingService`)

**Push Event Types:**
| Event | Description |
|-------|-------------|
| `MESSAGE` | New message received |
| `VISIT` | Profile viewed |
| `FOOTPRINT` | Footprint left |
| `NEW_PICTURE_LIKE` | Photo liked |
| `QUICKSHAREREQUEST` | QuickShare album request |
| `QUICKSHAREGRANT` | QuickShare access granted |
| `PLUS_STATUS_CHANGED` | PLUS subscription status changed |
| `REENGAGEMENT_MISSED_VISIT_COUNT` | Missed visits re-engagement |
| `FIREBASEMESSAGE` | Generic Firebase message |

**Notification Channels:**
- Messages
- Footprints
- Picture likes
- Visitor notifications
- Re-engagement

**Notification Preferences:**
- Master push toggle
- Sound effects toggle
- Vibration toggle
- Per-type toggles (messages, footprints, likes, visitors)
- Custom notification sounds
- Push notification style (normal vs expanded)

**Message Delivery:**
- FCM for push notifications
- Message syncing via API on app open
- Draft message persistence
- Message failure retry UI

### 2.23 Profile Verification (Authenticity System)

**Config Service:** `ConfigService` (in `profile.authenticity.data`)

**Verification Levels (from strings):**
| Level | Description |
|-------|-------------|
| `authenticity_unverified_user` | Not verified |
| `authenticity_verified_not_yet` | Pending verification |
| `authenticity_verified_user` | Verified |
| `authenticity_known` | Known personally |
| `authenticity_known_by` | Known by others |
| `authenticity_not_known` | Not known |
| `authenticity_view` | View verification details |

**Verification Thresholds:**
- `KEY_AUTHENTICITY_THRESHOLD_LOWER` -- Minimum score
- `KEY_AUTHENTICITY_THRESHOLD_UPPER` -- Maximum score
- `KEY_AUTHENTICITY_BOUND_LAST_REFRESH` -- Last refresh timestamp

**Verification Features:**
- Users contribute to other profiles' verification status
- "Known personally" requires threshold of other verified users
- Verification URL: `https://www.romeo.com/en/care/safety/#verification`
- Verification badge displayed on profile cards
- "Get verified" option in side menu (remote config controlled)

### 2.24 Reporting & Blocking

**Activities:**
- `ReportAndBlockActivity` -- Report and/or block a user
- `ReportCommentActivity` -- Report a message
- `ReportHateSpeechActivity` -- Report hate speech

**ViewModel:** `ReportAndBlockViewModel` with:
- `fetchReportReasons` -- Get report reason options
- `reportUser` -- Submit report
- `blockUser` -- Block a user
- `unblockUser` -- Unblock a user

**Report Reasons Service:** `ReportReasonsService` fetches available reasons

### 2.25 Settings

**Activity:** `SettingsActivity`

**Settings Categories (from strings):**
- Notification settings (per-type)
- Push notification sounds
- Sound effects
- Vibration
- Distance unit (metric/imperial)
- Privacy settings
- Profile visibility
- Data migration
- Cookie consent (GDPR)
- Video call settings

### 2.26 Deep Linking

**Activity:** `DeepLinkActivity`

**Custom URL Schemes:**
- `planetromeo://command/*`
- `romeo://command/*`
- `planetromeo://search/hashtag/*`
- `romeo://search/hashtag/*`

**Web Deep Links (both `www.planetromeo.com` and `www.romeo.com`):**
- `/payment_show_product_selection`
- `/payment/v4/*`
- `/show_quickshare_album`
- `/show_chats`
- `/show_visitors`
- `/show_radar`
- `/show_settings`
- `/show_edit_profile`
- `/welcome_screen`
- `/welcome_tour`
- `/auth/login`
- `/login`
- `/app`
- `/*/app`

### 2.27 Exit Interview

**Activity:** `ExitInterviewActivity`

Churn feedback collected when users delete their account. Controlled by remote config `show_exit_interview` (default: false).

### 2.28 Design System

**Custom Themes (from manifest and strings):**
- `PlanetRomeoTheme.DayNight`
- `PlanetRomeoTheme.NoActionBar`
- `PlanetRomeoTheme.Transparent`
- `PlanetRomeoTheme.VersionExtra`
- `PlanetRomeoSplash.Theme`
- `PlanetRomeoZendeskTheme`

**Custom Views:**
- `PlanetRomeo.AutoCompleteTextView`
- `PlanetRomeo.Dialog.Button.Normal`
- `PlanetRomeo.Signup.TabLayout.TabText`
- `PlanetRomeo.TextInputLayout.Settings`
- `PlanetRomeo.TextInputLayout.Registration`
- `PlanetRomeo.Theme.MaterialDatePicker`
- `PlanetRomeo.Travel.Explore.SearchView`

**Design System Playground Activity:** `DsPlaygroundActivity` -- Internal tool for design system testing

### 2.29 Data Migration

**Activity:** `DataMigrationActivity`

Handles migration from legacy data formats, including:
- Message attachment format migration (space-separated to JSON)
- Profile data migration
- Database schema upgrades (version 1 through 12)

---

## 3. API SURFACE

### 3.1 gRPC Service Definitions

gRPC is used as the primary API communication protocol (not REST).

**gRPC Service Files (from META-INF/services):**
- `io.grpc.ManagedChannelProvider` -- Channel management
- `io.grpc.Q` -- Obfuscated service
- `io.grpc.Y` -- Obfuscated service
- `io.grpc.e0` -- Obfuscated service

**OkHttp transport layer:** gRPC-OkHttp is the HTTP/2 transport for gRPC.

### 3.2 Protobuf Message Types

**Bundled Proto Files (from assets):**
- `client_analytics.proto` -- Analytics event definitions
- `messaging_event.proto` -- Messaging event structure
- `messaging_event_extension.proto` -- Message event extensions
- `firebase/inappmessaging/proto/common_types.proto`
- `firebase/inappmessaging/proto/experiment_payload.proto`
- `firebase/inappmessaging/proto/messages.proto`
- `firebase/perf/v1/perf_metric.proto`
- `google/firestore/v1/*.proto` -- Firestore protos
- `google/protobuf/*.proto` -- Standard well-known types

### 3.3 REST API Endpoints (via Retrofit)

**API Paths (from error codes and string analysis):**
- `POST /session` -- Login
- `PUT /account` -- Profile update
- `POST /pictures` -- Photo upload
- `DELETE /pictures/albums/{id}` -- Delete album
- `DELETE /pictures/albums/{id}/requests/{user_id}` -- Revoke QuickShare
- `POST /pictures/albums/{id}/grants` -- Grant QuickShare access
- `POST /pictures/albums/{id}/requests` -- Request QuickShare access
- `GET /pictures/albums/{id}/grants` -- List QuickShare grants
- `GET /pictures/albums/{id}/requests` -- List QuickShare requests
- `DELETE /pictures/albums/shared/grants/{user_id}` -- Revoke shared access
- `GET /pictures/albums/shared/grants/{user_id}` -- Get shared grants
- `GET /pictures/albums/shared/requests` -- Get shared requests
- `GET /profiles` -- Search profiles
- `GET /profiles/{id}/full` -- Full profile view
- `GET /profiles/{id}/linked` -- Linked profiles
- `GET /profiles/{id}/albums` -- Profile albums
- `GET /profiles/{id}/albums/{album_id}` -- Specific album
- `POST /messages` -- Send message
- `PATCH /messages` -- Update message
- `GET /visitors` -- View visitors
- `GET /visits` -- View visits
- `POST /contacts` -- Save contact
- `GET /memberships` -- Get membership info
- `GET /payment/appstore/google/offers` -- Get Google Play offers
- `POST /payment/appstore/google/purchases` -- Process Google Play purchase
- `POST /payment/orders` -- Create payment order

### 3.4 Authentication Flow

1. Login via email/password or Facebook OAuth
2. API key validated (`AUTH_WRONG_API_KEY` check)
3. Account confirmed check (`AUTH_ACCOUNT_NOT_CONFIRMED`)
4. Profile verified check (`AUTH_PROFILE_UNVERIFIED`)
5. Profile not deactivated/banned check
6. FCM token sent to server on login and token refresh
7. Session maintained via local `PRAccount` model

### 3.5 Image CDN

**Base URL:** `https://pradn.net`

| Path | Purpose |
|------|---------|
| `/v12/img/footprints/circular/` | Circular footprint thumbnails |
| `/v12/img/footprints/rectangular/` | Rectangular footprint images |
| `/img/usr/original/` | Full resolution user photos |
| `/img/usr/squarish/` | Square-cropped user photos |
| `/img/usr/portrait/` | Portrait-cropped user photos |

**Picture format versioning:** Stored in `PREF_PICTURE_FORMAT` preference, updated via `LAST_PICTURE_FORMAT_UPDATE`.

### 3.6 API Service Layer

**All Retrofit Service interfaces found in decompiled code:**

| Service | Package | Purpose |
|---------|---------|---------|
| `AuthService` | `authentication.core.data` | Login/session creation |
| `SessionService` | `authentication.core.data` | Session management |
| `AccountService` | `authentication.account.data.remote` | Account CRUD |
| `OnlineStatusService` | `authentication.account.data.remote` | Online status updates |
| `RadarService` | `radar.data` | Profile search/browse |
| `DiscoverService` | `legacy_radar.discover.data` | Discover lanes |
| `ProfileService` | `profile.data` | Profile data |
| `ConfigService` | `profile.authenticity.data` | Verification config |
| `MessageService` | `messages.data.remote.chat` | Chat messages |
| `MessageTemplatesService` | `messages.data.remote.templates` | Saved phrases |
| `FootprintsService` | `footprints.data.remote` | Footprint operations |
| `PictureService` | `media_viewer.picture_management.data` | Picture management |
| `PictureLikeService` | `media_viewer.picture_likes.data` | Picture likes |
| `PicturesILikedService` | `pictures_i_liked.data` | Liked pictures |
| `VisitorsService` | `cruise.visitors.data` | Visitor list |
| `VisitedService` | `cruise.visited.data` | Visited list |
| `LikesService` | `cruise.likes.data` | Likes list |
| `BillingService` | `billing.data.billing` | Billing/purchases |
| `MembershipService` | `billing.data.membership` | Membership info |
| `ReportReasonsService` | `report_and_block.data` | Report reasons |
| `LocationService` | `location.data` | Location updates |
| `RoughIpService` | `location.data` | IP-based location |
| `GeocoderService` | `location.places.data` | Address geocoding |
| `SettingsService` | `core.data.settings` | User settings |
| `AppUpdateService` | `app_update.data` | App updates |
| `SpartacusService` | `travel.travel_overview.data` | Travel/escort feature |
| `AnalyticsConsentService` | `cookie_consent.data.remote` | Cookie consent |

---

## 4. UI PATTERNS

### 4.1 Navigation Structure

**Bottom Navigation (from color resources):**
- `mtrl_navigation_bar_item_tint` -- Navigation bar item tints
- `mtrl_navigation_bar_colored_item_tint` -- Colored item state
- `mtrl_navigation_bar_ripple_color` -- Ripple effects
- `m3_navigation_bar_item_with_indicator_icon_tint` -- Material 3 indicator

**Compose Navigation (confirmed from decompiled code):**
- `NavHostControllerKt.e()` -- NavController creation in `SettingsActivity`, `SupportActivity`, `MediaViewerActivity`
- `NavController.b0()` -- Navigation with encoded route parameters
- `NavGraphBuilder.g()` -- Graph builder for media viewer screens
- Route pattern: `myPictureScreenRoute/{id}/{token}/{accessPolicy}/{param1}/{param2}` (URL-encoded)
- `defaultNavHost` resource reference (from `R.java`)

**Activities using Compose Navigation:**
- `SettingsActivity` -- Settings screens via Compose
- `SupportActivity` -- Support screens via Compose
- `MediaViewerActivity` -- Media viewer via Compose

**Tab Navigation:**
- Radar tabs: `SearchTabs` with `ROMEOS` option
- Cruise tabs: `CruiseTab` enum (VISITORS, VISITED, LIKES)
- Custom `TabLayout` styling: `PlanetRomeo.Signup.TabLayout`

### 4.2 Compose Navigation

- Uses `navigation-compose` library
- Screen-based navigation with ViewModels
- Paging integration for scrollable lists

### 4.3 Profile Card Design

**Radar card elements:**
- Profile picture (circular thumbnail)
- Online status indicator
- Distance display
- Profile stats (customizable for PLUS)
- Chat icon (remote config toggle)
- Linked icon (remote config toggle)
- Favorite/save icon

### 4.4 Chat Interface

- Message list with read/unread states
- Image attachment preview
- Location attachment preview
- Draft message indicator
- Message options menu
- Copy to clipboard
- Saved phrases panel
- Zendesk messaging integration

### 4.5 Map Integration

- Google Maps SDK: `<uses-library android:name="com.google.android.maps"/>`
- Google Maps API key: `@string/google_maps_key`
- `PlacesAutocompleteActivity` -- Place search with autocomplete
- Location services: `LocationService`, `RoughIpService`
- GPS coordinates via `ACCESS_FINE_LOCATION` and `ACCESS_COARSE_LOCATION`

### 4.6 Material Design 3

- Material 3 components library (`material3`)
- Material Design date picker (`PlanetRomeo.Theme.MaterialDatePicker`)
- Bottom sheets, side sheets, search bars
- Material 3 navigation bar with indicators

### 4.7 Paging

- `androidx.paging_paging-compose.version3`
- `Pager` with `CachedPagingData` for infinite scroll
- `PagingData` flow to Compose

---

## 5. INTEGRATIONS

### 5.1 Google Maps

```xml
<meta-data android:name="com.google.android.geo.API_KEY" android:value="@string/google_maps_key"/>
<uses-library android:name="com.google.android.maps"/>
```

- Map queries: `com.google.android.apps.maps` in `<queries>`
- Places Autocomplete: `PlacesAutocompleteActivity`
- Custom location picker: `PickLocationActivity`

### 5.2 Firebase Suite

**Firebase Components (from manifest):**
| Component | Purpose |
|-----------|---------|
| `FirebaseMessagingService` | Push notifications (FCM) |
| `FirebaseInstanceIdReceiver` | FCM token management |
| `FirebasePerfKtxRegistrar` | Performance monitoring |
| `FirebaseFirestoreLegacyRegistrar` | Firestore database |
| `FirebaseFirestoreKtxRegistrar` | Firestore (Kotlin) |
| `FirebaseMessagingKtxRegistrar` | Messaging (Kotlin) |
| `FirebaseDynamicLinksKtxRegistrar` | Dynamic links |
| `FirebaseRemoteConfigKtxRegistrar` | Remote config |
| `FirebaseCrashlyticsKtxRegistrar` | Crash reporting |
| `FirebaseSessionsRegistrar` | Session tracking |
| `AnalyticsConnectorRegistrar` | Analytics |
| `FirebaseInAppMessagingKtxRegistrar` | In-app messaging |
| `FirebaseInAppMessagingDisplayKtxRegistrar` | In-app messaging display |
| `FirebaseInstallationsKtxRegistrar` | Installations ID |
| `FirebaseCommonKtxRegistrar` | Common utilities |
| `AbtRegistrar` | A/B testing |
| `TransportRegistrar` | Data transport |

**Firebase Config:**
| Key | Value |
|-----|-------|
| `project_id` | `api-project-4760212605` |
| `gcm_sender_id` | `4760212605` |
| `google_api_key` | `AIzaSyABrPsJbooKA4JSBdbFwpMi6Etb2uQCFXA` |
| `google_app_id` | `1:4760212605:android:3c1ae4b2e018f333` |
| `firebase_database_url` | `https://api-project-4760212605.firebaseio.com` |
| `google_storage_bucket` | `api-project-4760212605.appspot.com` |

**Google OAuth Client ID:** `4760212605-og8t21346pipj9ql7astdmg15m7bodes.apps.googleusercontent.com`

### 5.3 Zendesk Support

**Activities:**
- `zendesk.support.guide.HelpCenterActivity` -- Help center
- `zendesk.support.guide.ViewArticleActivity` -- Article viewer
- `zendesk.support.request.RequestActivity` -- Support ticket creation
- `zendesk.support.requestlist.RequestListActivity` -- Ticket list
- `zendesk.classic.messaging.MessagingActivity` -- Live chat

**Receivers:**
- `zendesk.support.DeepLinkingBroadcastReceiver` -- Deep link handling

**Providers:**
- `zendesk.support.SupportSdkStartupProvider`
- `zendesk.support.guide.GuideSdkStartupProvider`
- `zendesk.core.MediaFileProvider` -- File attachments

**Custom Theme:** `PlanetRomeoZendeskTheme`

### 5.4 Google Sign-In

```xml
<uses-permission android:name="com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE"/>
```

- `common_google_signin_btn_text_dark` / `_light` resources
- `GoogleApiActivity` in manifest

### 5.5 AdMob / Google Ads

```xml
<meta-data android:name="com.google.android.gms.ads.AD_MANAGER_APP" android:value="true"/>
<meta-data android:name="com.google.android.gms.ads.APPLICATION_ID" android:value="ca-app-pub-0030885515157287~7187724580"/>
```

**AdMob App ID:** `ca-app-pub-0030885515157287~7187724580`

### 5.6 Google Play Billing

```xml
<meta-data android:name="com.google.android.play.billingclient.version" android:value="8.0.0"/>
<uses-permission android:name="com.android.vending.BILLING"/>
```

**Billing Activities:**
- `ProxyBillingActivity`
- `ProxyBillingActivityV2`
- `PlayCoreDialogWrapperActivity`

**Billing Query:** `com.android.vending.billing.InAppBillingService.BIND`

### 5.7 Image Loading

**Glide (primary):**
- `com.bumptech.glide.integration.okhttp3.OkHttpGlideModule` -- OkHttp integration
- Separate OkHttp client named "glide" for image loading
- Memory cache clearing on low memory

**Picasso (secondary):**
- `com.squareup.picasso.PicassoProvider` -- Legacy image loading

### 5.8 AndroidX Libraries

| Library | Purpose |
|---------|---------|
| `androidx.startup.InitializationProvider` | App startup initialization |
| `androidx.emoji2.text.EmojiCompatInitializer` | Emoji support |
| `androidx.lifecycle.ProcessLifecycleInitializer` | Process lifecycle |
| `androidx.profileinstaller.ProfileInstallerInitializer` | Baseline profile |
| `androidx.work.*` | WorkManager for background tasks |
| `androidx.room.*` | Room database |
| `androidx.paging.*` | Paging 3 |
| `androidx.navigation.*` | Navigation Compose |
| `androidx.core.content.FileProvider` | File sharing |
| `androidx.window.extensions` | Window management |
| `androidx.window.sidecar` | Foldable support |

### 5.9 Data Transport

```xml
<service android:name="com.google.android.datatransport.runtime.backends.TransportBackendDiscovery"/>
<service android:name="com.google.android.datatransport.runtime.scheduling.jobscheduling.JobInfoSchedulerService"/>
```

Google Data Transport for analytics event batching.

### 5.10 AndroidX Compose Tooling

```xml
<activity android:exported="true" android:name="androidx.compose.ui.tooling.PreviewActivity"/>
```

Compose preview and inspection support.

### 5.11 Apache HTTP Legacy

```xml
<uses-library android:name="org.apache.http.legacy" android:required="false"/>
```

Legacy HTTP support (likely for older API compatibility).

### 5.12 Play Core

```xml
<activity android:name="com.google.android.play.core.common.PlayCoreDialogWrapperActivity"/>
```

In-app updates and review.

---

## 6. PERMISSIONS

| Permission | Purpose |
|------------|---------|
| `INTERNET` | Network access |
| `ACCESS_FINE_LOCATION` | GPS (high accuracy) |
| `ACCESS_COARSE_LOCATION` | Network location |
| `CAMERA` | Photo capture |
| `ACCESS_NETWORK_STATE` | Connectivity check |
| `MODIFY_AUDIO_SETTINGS` | Video call audio |
| `FOREGROUND_SERVICE` | Background upload |
| `FOREGROUND_SERVICE_DATA_SYNC` | Data sync foreground |
| `WAKE_LOCK` | Keep device awake |
| `READ_MEDIA_IMAGES` | Photo library (Android 13+) |
| `READ_EXTERNAL_STORAGE` | Photo library (Android 12-) |
| `POST_NOTIFICATIONS` | Push notifications (Android 13+) |
| `RECEIVE_BOOT_COMPLETED` | Restart on boot |
| `VIBRATE` | Haptic feedback |
| `REQUEST_INSTALL_PACKAGES` | App install (UNCUT) |
| `ACCESS_ADSERVICES_ATTRIBUTION` | Privacy Sandbox attribution |
| `ACCESS_ADSERVICES_AD_ID` | Privacy Sandbox ad ID |
| `com.android.vending.BILLING` | In-app purchases |
| `com.google.android.c2dm.permission.RECEIVE` | Cloud messaging |
| `com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE` | Install referrer |

---

## 7. SERVICES

| Service | Type | Purpose |
|---------|------|---------|
| `FcmListenerService` | FirebaseMessagingService | Push notification handler |
| `UploadPictureService` | Foreground (dataSync) | Background photo upload |
| `FirebaseMessagingService` | Firebase | FCM token refresh |
| `ComponentDiscoveryService` | Firebase | Component discovery |
| `SessionLifecycleService` | Firebase | Session lifecycle |
| `AppMeasurementService` | Firebase | Analytics |
| `AppMeasurementJobService` | Firebase | Analytics job |
| `MultiInstanceInvalidationService` | Room | Multi-process DB sync |
| `SystemAlarmService` | WorkManager | Scheduled tasks |
| `SystemJobService` | WorkManager | Job scheduling |
| `SystemForegroundService` | WorkManager | Foreground work |
| `TransportBackendDiscovery` | Data Transport | Backend discovery |
| `JobInfoSchedulerService` | Data Transport | Job scheduling |

---

## 8. CONTENT PROVIDERS

| Provider | Purpose |
|----------|---------|
| `FileProvider` (authorities: `com.planetromeo.android.app.fileProvider`) | File sharing |
| `InitializationProvider` (authorities: `com.planetromeo.android.app.androidx-startup`) | AndroidX startup |
| `FirebaseInitProvider` (authorities: `com.planetromeo.android.app.firebaseinitprovider`) | Firebase init |
| `SupportSdkStartupProvider` (Zendesk) | Zendesk support |
| `GuideSdkStartupProvider` (Zendesk) | Zendesk guide |
| `MediaFileProvider` (Zendesk) | Zendesk attachments |
| `PicassoProvider` | Picasso image loading |

---

## 9. BROADCAST RECEIVERS

| Receiver | Purpose |
|----------|---------|
| `FirebaseInstanceIdReceiver` | FCM token updates |
| `DeepLinkingBroadcastReceiver` (Zendesk) | Zendesk deep links |
| `ProfileInstallReceiver` | Baseline profile install |
| `ForceStopRunnable$BroadcastReceiver` | WorkManager force stop |
| `ConstraintProxy$*Proxy` (5) | WorkManager constraints |
| `RescheduleReceiver` | WorkManager reschedule |
| `DiagnosticsReceiver` | WorkManager diagnostics |
| `ConstraintProxyUpdateReceiver` | WorkManager updates |
| `AppMeasurementReceiver` | Firebase analytics |
| `AlarmManagerSchedulerBroadcastReceiver` | Data transport scheduling |

---

## 10. KEY URLS

| URL | Purpose |
|-----|---------|
| `https://pradn.net` | Image CDN |
| `https://www.romeo.com` | Main website |
| `https://www.planetromeo.com` | Legacy domain |
| `https://getromeoapp.com/privacy-statement/` | Privacy policy |
| `https://getromeoapp.com/terms/` | Terms of service |
| `https://support.romeo.com` | Zendesk support |
| `https://www.planetromeofoundation.org/` | Foundation |
| `https://api-project-4760212605.firebaseio.com` | Firebase RTDB |

---

## 11. AUDIO ASSETS

- `planetromeo_sheep.mp3` -- Notification sound (Romeo sheep sound)

---

## 12. INTERNATIONALIZATION

**Supported languages (from strings evidence):**
- English, German (de), French (fr), Spanish (es), Italian (it), Portuguese (pt), Polish, Indonesian, Malay, Latvian

**Locale handling:**
- `locale_config.xml` for Android auto-locale
- Locale change broadcast receiver
- Fallback to English if language not in supported list
- Full string translation for all features

---

## 13. SECURITY

- `fullBackupContent="false"` -- No automatic backup
- Profile blocking system
- Content rating on photos
- CAPTCHA on report submission
- Email verification required
- API key validation
- SSL handshake error handling
- Account deactivation/banning detection
- `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` -- Signature-level permission for broadcast receivers
- Cookie consent management (GDPR)

---

## 14. DEPENDENCY SUMMARY

| Library | Version | Purpose |
|---------|---------|---------|
| Dagger 2 | (latest) | Dependency injection |
| Jetpack Compose | Material3 | UI framework |
| Navigation Compose | - | Screen navigation |
| Paging 3 | - | Infinite scroll |
| Room | - | Local database (new features) |
| WorkManager | - | Background tasks |
| Firebase BOM | - | Firebase suite |
| Google Play Billing | 8.0.0 | Subscriptions |
| gRPC-OkHttp | - | API communication |
| OkHttp | - | HTTP client |
| Retrofit | - | REST API |
| Glide | - | Image loading (primary) |
| Picasso | - | Image loading (legacy) |
| Gson | - | JSON serialization |
| RxJava 3 | - | Reactive programming |
| Kotlin Coroutines | - | Async operations |
| Kotlin Flow | - | Reactive streams |
| Google Maps SDK | - | Maps |
| Zendesk SDK | - | Customer support |
| Google Sign-In | - | OAuth login |
| AdMob | - | Advertising |
| Firebase Remote Config | - | Feature flags |
| Firebase Crashlytics | - | Crash reporting |
| Firebase Analytics | - | Usage analytics |
| Firebase Performance | - | Performance monitoring |
| Firebase In-App Messaging | - | In-app messages |
| Firebase Dynamic Links | - | Deep linking |
| Google Data Transport | - | Analytics batching |
| AndroidX Baseline Profiles | - | Startup optimization |

---

## 15. PACKAGE STRUCTURE

```
com.planetromeo.android.app/
  core/
    PlanetRomeoApplication.java
    analytics/          -- Analytics (Firebase)
    data/
      db/               -- PlanetRomeoDB (SQLite)
      model/            -- DisplayStat, SearchFilter
      preferences/      -- PlanetRomeoPreferences
    notification/       -- FcmListenerService, push handling
    network/            -- ApiException, NetworkHealth, RetrofitHashMap
    remote_config/      -- RemoteConfig (Firebase)
    ui/                 -- RomeoWebViewActivity, ServiceUnavailableActivity
    utils/              -- UiErrorHandler
  authentication/
    account/            -- PRAccount, Credentials, AccountService
    signup/             -- ActivitySignup
    login/              -- LoginActivity
    forgot_password/    -- ForgotPasswordActivity
    account_list/       -- AccountListActivity
    deactivated/        -- ProfileDeactivatedActivity
  home/ui/             -- HomeActivity, HomeActivityViewModel
  radar/
    ui/                 -- RadarScreenKt, SearchViewModel
    main_tabs/          -- RadarMainTabScreenKt
    data/               -- RadarService
    discover/           -- Discover lanes
  messages/
    ui/                 -- MessengerFragment
    data/               -- MessageRepository, MessageDataSource
    data_migration/     -- DataMigrationActivity
  profile/
    ui/                 -- ViewProfileActivity
    edit/               -- EditProfileActivity
    pick_profile/       -- PickProfileActivity
    interview/          -- StatsInterviewActivity
    change_email/       -- ChangeEmailActivity
    data/               -- ProfileDom, FootprintWrapper
  footprints/ui/        -- FootprintsActivity, FootprintsViewModel
  contacts/ui/          -- ContactsViewModel, FriendRequestsActivity, EditContactActivity
  media_viewer/
    ui/                 -- MediaViewerActivity
    fullscreen/         -- FullImageViewScreenKt
    my_pictures/        -- MyPictureScreenKt
    their_pictures/     -- TheirPictureFeedVerticalPagingListKt
    picture_management/ -- Album management
    report_picture/     -- ReportPIctureDialogKt
  billing/ui/           -- BillingActivity, BillingViewModel
  travel/
    travel_overview/    -- SpartacusWebViewActivity
    data/               -- TravelLocation
  location/
    ui/                 -- UserLocationActivity, ShowLocationActivity
    data/               -- LocationService, RoughIpService
    pick_location/      -- PickLocationActivity
    places/             -- PlacesAutocompleteActivity
    address/            -- UserAddress
  report_and_block/ui/  -- ReportAndBlockActivity, ReportAndBlockViewModel
  more_menu/
    about_us/           -- AboutUsActivity
    support/ui/         -- SupportActivity
    settings/ui/        -- SettingsActivity
  deep_link/            -- DeepLinkActivity
  exit_interview/ui/    -- ExitInterviewActivity
  cruise/likes/ui/      -- LikeDetailsActivity
  legacy_radar/
    search_filter_settings/ui/ -- EditRadarSettingsActivity
    discover/ui/        -- Discover feature
  splash/ui/            -- SplashActivity, SplashPresenter
  debug/
    testbed/            -- TestBedActivity
    ui/                 -- DsPlaygroundActivity
  app_update/data/      -- AppUpdateService
```

---

## 16. COMPLETE RETROFIT SERVICE INTERFACES

All 30 Retrofit service interfaces discovered in decompiled code. These are the REST endpoints used alongside gRPC for hybrid API communication.

### 16.1 Authentication Services

**AuthService** (`com.planetromeo.android.app.authentication.core.data`)
```java
public interface AuthService {
    // Login/session creation
    // Referenced by: POST_SESSION error context
}
```

**SessionService** (`com.planetromeo.android.app.authentication.core.data`)
```java
public interface SessionService {
    // Session management, token refresh
}
```

**AccountService** (`com.planetromeo.android.app.authentication.account.data.remote`)
```java
public interface AccountService {
    // Account CRUD operations
    // Referenced by: PUT_ACCOUNT error context
}
```

**OnlineStatusService** (`com.planetromeo.android.app.authentication.account.data.remote`)
```java
public interface OnlineStatusService {
    // Online status updates (visible/invisible mode)
}
```

### 16.2 Radar & Search Services

**RadarService** (`com.planetromeo.android.app.radar.data`)
```java
public interface RadarService {
    // Profile search/browse - the core browsing feature
    // Referenced by: GET_PROFILES error context
    // SearchRequest params:
    //   - SearchFilter (personal, hobby, sexual, fulltext, geoPosition, tags, etc.)
    //   - sorting: "NEARBY_ASC" | "LAST_LOGIN_DESC" | "SIGNUP_DESC" | "ALPHABETICAL_ASC"
    //   - pageLength: default "30"
    //   - popular: boolean
}
```

**DiscoverService** (`com.planetromeo.android.app.legacy_radar.discover.data`)
```java
public interface DiscoverService {
    // Discover lanes (Blog, New, Travellers, Popular, Pictures I Liked)
}
```

### 16.3 Profile Services

**ProfileService** (`com.planetromeo.android.app.profile.data`)
```java
public interface ProfileService {
    // Profile data retrieval and updates
}
```

**ConfigService** (`com.planetromeo.android.app.profile.authenticity.data`)
```java
public interface ConfigService {
    // Verification/authenticity config
    // Returns threshold scores for "Known Personally" feature
}
```

### 16.4 Messaging Services

**MessageService** (`com.planetromeo.android.app.messages.data.remote.chat`)
```java
public interface MessageService {
    // Chat message CRUD
    // POST /messages - Send message
    // PATCH /messages - Update message
    // Supports: text, image attachments, location attachments, command attachments
}
```

**MessageTemplatesService** (`com.planetromeo.android.app.messages.data.remote.templates`)
```java
public interface MessageTemplatesService {
    // Saved phrases/templates management
    // GET /message-templates
    // PUT /message-templates/{id}
    // DELETE /message-templates/{id}
}
```

### 16.5 Footprints & Cruise Services

**FootprintsService** (`com.planetromeo.android.app.footprints.data.remote`)
```java
public interface FootprintsService {
    // Footprint (visit) operations
    // Set/remove footprints, clear all visits
}
```

**VisitorsService** (`com.planetromeo.android.app.cruise.visitors.data`)
```java
public interface VisitorsService {
    // GET /visitors - Who visited your profile
    // Free: last 24h, PLUS: last 7 days
}
```

**VisitedService** (`com.planetromeo.android.app.cruise.visited.data`)
```java
public interface VisitedService {
    // GET /visits - Who you visited
}
```

**LikesService** (`com.planetromeo.android.app.cruise.likes.data`)
```java
public interface LikesService {
    // Profile likes management
}
```

### 16.6 Media & Picture Services

**PictureService** (`com.planetromeo.android.app.media_viewer.picture_management.data`)
```java
public interface PictureService {
    // POST /pictures - Upload photo
    // POST /pictures/albums - Create album
    // DELETE /pictures/albums/{id} - Delete album
    // POST /pictures/albums/{id}/grants - Grant QuickShare access
    // POST /pictures/albums/{id}/requests - Request QuickShare access
    // GET /pictures/albums/{id}/grants - List QuickShare grants
    // GET /pictures/albums/{id}/requests - List QuickShare requests
    // DELETE /pictures/albums/{id}/requests/{user_id} - Revoke QuickShare
    // DELETE /pictures/albums/shared/grants/{user_id} - Revoke shared access
    // GET /pictures/albums/shared/grants/{user_id} - Get shared grants
    // GET /pictures/albums/shared/requests - Get shared requests
}
```

**PictureLikeService** (`com.planetromeo.android.app.media_viewer.picture_likes.data`)
```java
public interface PictureLikeService {
    // Picture like/unlike operations
}
```

**PicturesILikedService** (`com.planetromeo.android.app.pictures_i_liked.data`)
```java
public interface PicturesILikedService {
    // GET /pictures/liked - Photos you liked
    // Grid and vertical feed views
}
```

### 16.7 Contact Services

**ContactsService** (`com.planetromeo.android.app.contacts.data.contacts.remote`)
```java
public interface ContactsService {
    // POST /contacts - Save contact
    // GET /contacts - List contacts
}
```

**ContactsFolderService** (`com.planetromeo.android.app.contacts.data.contacts_folder.data`)
```java
public interface ContactsFolderService {
    // Contact folder management (CRUD)
}
```

### 16.8 Billing & Membership Services

**BillingService** (`com.planetromeo.android.app.billing.data.billing`)
```java
public interface BillingService {
    // GET /payment/appstore/google/offers - Google Play offers
    // POST /payment/appstore/google/purchases - Process purchase
    // POST /payment/orders - Create payment order
    // GET /payment/history - Transaction history
}
```

**MembershipService** (`com.planetromeo.android.app.billing.data.membership`)
```java
public interface MembershipService {
    // GET /memberships - Get membership info
    // Membership tiers: free, PLUS (various sources)
}
```

### 16.9 Location Services

**LocationService** (`com.planetromeo.android.app.location.data`)
```java
public interface LocationService {
    // Location updates to server
}
```

**RoughIpService** (`com.planromeo.android.app.location.data`)
```java
public interface RoughIpService {
    // IP-based rough location detection
}
```

**GeocoderService** (`com.planetromeo.android.app.location.places.data`)
```java
public interface GeocoderService {
    // Address geocoding/reverse geocoding
}
```

### 16.10 Other Services

**SettingsService** (`com.planetromeo.android.app.core.data.settings`)
```java
public interface SettingsService {
    // User settings CRUD
}
```

**LimitsService** (`com.planetromeo.android.app.core.data.limits.remote`)
```java
public interface LimitsService {
    // Rate limits and usage quotas
    // Stores: PRLimitsEntity (name, limit, currently_used)
}
```

**AppUpdateService** (`com.planetromeo.android.app.app_update.data`)
```java
public interface AppUpdateService {
    // App version check
    // Compares: version_code_optional_update, version_code_immediate_update
}
```

**SpartacusService** (`com.planetromeo.android.app.travel.travel_overview.data`)
```java
public interface SpartacusService {
    // Travel/escort feature endpoints
    // Travel location management
}
```

**ReportReasonsService** (`com.planetromeo.android.app.report_and_block.data`)
```java
public interface ReportReasonsService {
    // GET /report-reasons - Fetch available report reasons
}
```

**AnalyticsConsentService** (`com.planetromeo.android.app.cookie_consent.data.remote`)
```java
public interface AnalyticsConsentService {
    // Cookie consent management (GDPR)
}
```

---

## 17. COMPLETE ROOM DATABASE SCHEMA

Room database class: `com.planetromeo.android.app.core.data.db.Database` (extends `RoomDatabase`)
Identity hash: `f7d3f1f4c8d9934d53b06a0b6aa32b7e`

### 17.1 MessageTemplateEntity
```sql
CREATE TABLE IF NOT EXISTS `MessageTemplateEntity` (
    `id` TEXT NOT NULL,
    `template` TEXT NOT NULL,
    `sort_index` INTEGER NOT NULL,
    PRIMARY KEY(`id`)
);
```
**Purpose:** Saved chat phrases/templates for faster messaging.

### 17.2 PictureEntity
```sql
CREATE TABLE IF NOT EXISTS `PictureEntity` (
    `id` TEXT NOT NULL,
    `url_token` TEXT NOT NULL,
    `auth_token` TEXT NOT NULL,
    `width` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `rating` TEXT NOT NULL,
    `comment` TEXT NOT NULL,
    `uploadDate` TEXT NOT NULL,
    `albumId` TEXT NOT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY(`albumId`) REFERENCES `PRAlbumEntity`(`albumId`) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS `index_PictureEntity_albumId` ON `PictureEntity` (`albumId`);
```
**Purpose:** Photo metadata with content rating and album association.

### 17.3 PRAlbumEntity
```sql
CREATE TABLE IF NOT EXISTS `PRAlbumEntity` (
    `albumId` TEXT NOT NULL,
    `ownerId` TEXT NOT NULL,
    `accessPolicy` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `lastModified` TEXT,
    `previewPictureId` TEXT,
    `hasItems` INTEGER NOT NULL,
    `restriction` TEXT NOT NULL,
    `accessExpiration` TEXT,
    `owner` TEXT,
    `accessor` TEXT,
    `album` TEXT,
    `createdDate` TEXT,
    `requestedDate` TEXT,
    `grantedDate` TEXT,
    `accessedDate` TEXT,
    `duration` INTEGER NOT NULL,
    `status` TEXT,
    `requestWaitingTime` INTEGER NOT NULL,
    `listPosition` INTEGER NOT NULL,
    PRIMARY KEY(`albumId`)
);
```
**Purpose:** Photo albums including QuickShare albums with access policies and expiry times.

### 17.4 PRLimitsEntity
```sql
CREATE TABLE IF NOT EXISTS `PRLimitsEntity` (
    `name` TEXT NOT NULL,
    `limit` INTEGER NOT NULL,
    `currently_used` INTEGER NOT NULL,
    PRIMARY KEY(`name`)
);
```
**Purpose:** Rate limits and usage quotas (e.g., QuickShare daily limits).

### 17.5 FootprintEntity
```sql
CREATE TABLE IF NOT EXISTS `FootprintEntity` (
    `id` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `isFrequentlyUsed` INTEGER NOT NULL DEFAULT 0,
    `position` INTEGER NOT NULL DEFAULT -1,
    PRIMARY KEY(`id`)
);
```
**Purpose:** Saved footprint/visit presets with ordering.

### 17.6 ContactEntity
```sql
CREATE TABLE IF NOT EXISTS `ContactEntity` (
    `userId` TEXT NOT NULL,
    `contactNote` TEXT NOT NULL,
    `isKnown` INTEGER NOT NULL,
    `isLinked` INTEGER NOT NULL,
    `isFavorite` INTEGER NOT NULL,
    `tags` TEXT NOT NULL,
    `linkStatus` TEXT,
    PRIMARY KEY(`userId`)
);
```
**Purpose:** Saved contacts with verification status and partner linking.

### 17.7 MessageEntity
```sql
CREATE TABLE IF NOT EXISTS `MessageEntity` (
    `messageId` TEXT NOT NULL,
    `chatPartnerId` TEXT NOT NULL,
    `text` TEXT NOT NULL,
    `date` TEXT NOT NULL,
    `transmissionStatus` TEXT NOT NULL,
    `saved` INTEGER NOT NULL,
    `unread` INTEGER NOT NULL,
    PRIMARY KEY(`messageId`)
);
```
**Purpose:** Chat messages with transmission status tracking.

### 17.8 ChatPartnerEntity
```sql
CREATE TABLE IF NOT EXISTS `ChatPartnerEntity` (
    `profileId` TEXT NOT NULL,
    `onlineStatus` TEXT,
    `name` TEXT NOT NULL,
    `headline` TEXT,
    `deletionDate` TEXT,
    `isDeactivated` INTEGER NOT NULL,
    `isBlocked` INTEGER NOT NULL,
    `fetchDate` INTEGER NOT NULL,
    `age` INTEGER,
    `weight` INTEGER,
    `height` INTEGER,
    `locationName` TEXT,
    `country` TEXT,
    `distance` INTEGER,
    `sensor` INTEGER,
    `imageId` TEXT,
    `urlToken` TEXT,
    PRIMARY KEY(`profileId`)
);
```
**Purpose:** Chat partner profile data cache with location and physical attributes.

### 17.9 ImageAttachmentEntity
```sql
CREATE TABLE IF NOT EXISTS `ImageAttachmentEntity` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `parentMessageId` TEXT NOT NULL,
    `imageId` TEXT NOT NULL,
    `authToken` TEXT,
    `urlToken` TEXT NOT NULL,
    `height` INTEGER NOT NULL DEFAULT 0,
    `width` INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(`parentMessageId`) REFERENCES `MessageEntity`(`messageId`) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS `index_ImageAttachmentEntity_parentMessageId` ON `ImageAttachmentEntity` (`parentMessageId`);
```
**Purpose:** Image attachments on messages.

### 17.10 LocationAttachmentEntity
```sql
CREATE TABLE IF NOT EXISTS `LocationAttachmentEntity` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `parentMessageId` TEXT NOT NULL,
    `lat` REAL NOT NULL,
    `lon` REAL NOT NULL,
    `isSensor` INTEGER NOT NULL,
    `name` TEXT NOT NULL,
    FOREIGN KEY(`parentMessageId`) REFERENCES `MessageEntity`(`messageId`) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS `index_LocationAttachmentEntity_parentMessageId` ON `LocationAttachmentEntity` (`parentMessageId`);
```
**Purpose:** Location sharing in messages.

### 17.11 CommandAttachmentEntity
```sql
CREATE TABLE IF NOT EXISTS `CommandAttachmentEntity` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    `parentMessageId` TEXT NOT NULL,
    `index` INTEGER,
    `action` TEXT NOT NULL,
    `url` TEXT,
    `text` TEXT,
    `format` TEXT,
    `albumId` TEXT,
    FOREIGN KEY(`parentMessageId`) REFERENCES `MessageEntity`(`messageId`) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS `index_CommandAttachmentEntity_parentMessageId` ON `CommandAttachmentEntity` (`parentMessageId`);
```
**Purpose:** Command attachments (action URLs, album shares, system commands).

### 17.12 Legacy SQLite Database (PlanetRomeoDB)

Separate from Room, version 12:

```sql
-- MESSAGES table (legacy)
CREATE TABLE MESSAGES (
    _id TEXT UNIQUE NOT NULL,
    headline TEXT,
    text TEXT,
    date TEXT,
    from_id TEXT,
    to_id TEXT,
    other_id TEXT,
    complete INTEGER,
    unread INTEGER,
    locked INTEGER,
    spam INTEGER,
    expires TEXT,
    attachments TEXT,    -- JSON array of MessageAttachmentDom
    internal_state INTEGER NOT NULL DEFAULT 0
);

-- USERS table (legacy)
CREATE TABLE USERS (
    _id TEXT UNIQUE NOT NULL,
    name TEXT,
    type TEXT,
    status TEXT,
    online_status TEXT,
    last_login TEXT,
    date_visited TEXT,
    headline TEXT,
    contact BLOB,
    location BLOB,
    non_contactable INTEGER,
    deactivated INTEGER,
    is_online INTEGER,
    is_favorite INTEGER,
    is_in_folder INTEGER,
    preview_pic BLOB,
    internal_state TEXT,
    blocked INTEGER DEFAULT 0
);

-- PICTURES table (legacy)
CREATE TABLE PICTURES (
    _id TEXT UNIQUE NOT NULL,
    token TEXT,
    url_token TEXT,
    comment TEXT,
    rating TEXT,
    width INTEGER,
    height INTEGER
);
```

---

## 18. ALL ENUM TYPES WITH COMPLETE VALUES

### 18.1 Profile Attribute Enums

**AnalPosition** (Sexual Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_anal_position_NO_ENTRY |
| `TOP_ONLY` | prdata_sexual_anal_position_TOP_ONLY |
| `MORE_TOP` | prdata_sexual_anal_position_MORE_TOP |
| `VERSATILE` | prdata_sexual_anal_position_VERSATILE |
| `MORE_BOTTOM` | prdata_sexual_anal_position_MORE_BOTTOM |
| `BOTTOM_ONLY` | prdata_sexual_anal_position_BOTTOM_ONLY |
| `NO` | no_anal_stat |

**BodyHair** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_body_hair_NO_ENTRY |
| `SMOOTH` | prdata_personal_body_hair_SMOOTH |
| `SHAVED` | prdata_personal_body_hair_SHAVED |
| `LITTLE` | prdata_personal_body_hair_LITTLE |
| `AVERAGE` | prdata_personal_body_hair_AVERAGE |
| `VERY_HAIRY` | prdata_personal_body_hair_VERY_HAIRY |

**BodyType** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_body_type_NO_ENTRY |
| `SLIM` | prdata_personal_body_type_SLIM |
| `AVERAGE` | prdata_personal_body_type_AVERAGE |
| `ATHLETIC` | prdata_personal_body_type_ATHLETIC |
| `MUSCULAR` | prdata_personal_body_type_MUSCULAR |
| `BELLY` | prdata_personal_body_type_BELLY |
| `STOCKY` | prdata_personal_body_type_STOCKY |

**Ethnicity** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_ethnicity_NO_ENTRY |
| `CAUCASIAN` | prdata_personal_ethnicity_CAUCASIAN |
| `ASIAN` | prdata_personal_ethnicity_ASIAN |
| `LATIN` | prdata_personal_ethnicity_LATIN |
| `MEDITERRANEAN` | prdata_personal_ethnicity_MEDITERRANEAN |
| `BLACK` | prdata_personal_ethnicity_BLACK |
| `MIXED` | prdata_personal_ethnicity_MIXED |
| `ARAB` | prdata_personal_ethnicity_ARAB |
| `INDIAN` | prdata_personal_ethnicity_INDIAN |

**Relationship** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_relationship_NO_ENTRY |
| `SINGLE` | prdata_personal_relationship_SINGLE |
| `PARTNER` | prdata_personal_relationship_PARTNER |
| `OPEN` | prdata_personal_relationship_OPEN |
| `MARRIED` | prdata_personal_relationship_MARRIED |

**Gender** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_gender_NO_ENTRY |
| `MAN` | prdata_personal_gender_MAN |
| `TRANS_MAN` | prdata_personal_gender_TRANS_MAN |
| `TRANS_WOMAN` | prdata_personal_gender_TRANS_WOMAN |
| `NON_BINARY` | prdata_personal_gender_NON_BINARY |
| `OTHER` | prdata_personal_gender_OTHER |

Note: `straightAllowedGenders` = [TRANS_MAN, TRANS_WOMAN] (used for orientation filtering)

**Orientation** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_orientation_NO_ENTRY |
| `GAY` | prdata_personal_orientation_GAY |
| `BISEXUAL` | prdata_personal_orientation_BISEXUAL |
| `STRAIGHT` | prdata_personal_orientation_STRAIGHT |
| `QUEER` | prdata_personal_orientation_QUEER |
| `OTHER` | prdata_personal_orientation_OTHER |

Note: STRAIGHT orientation excluded when gender is not in `straightAllowedGenders`

**Smoker** (Personal Information)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_personal_smoker_NO_ENTRY |
| `NO` | prdata_personal_smoker_NO |
| `SOCIALLY` | prdata_personal_smoker_SOCIALLY |
| `YES` | prdata_personal_smoker_YES |

### 18.2 Sexual Information Enums

**DickSize**
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_dick_size_NO_ENTRY |
| `S` | prdata_sexual_dick_size_S |
| `M` | prdata_sexual_dick_size_M |
| `L` | prdata_sexual_dick_size_L |
| `XL` | prdata_sexual_dick_size_XL |
| `XXL` | prdata_sexual_dick_size_XXL |

**SaferSex**
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_safer_sex_NO_ENTRY |
| `ALWAYS` | prdata_sexual_safer_sex_ALWAYS |
| `NEEDS_DISCUSSION` | prdata_sexual_safer_sex_NEEDS_DISCUSSION |
| `CONDOM` | prdata_sexual_safer_sex_CONDOM |
| `PREP` | prdata_sexual_safer_sex_PREP |
| `PREP_AND_CONDOM` | prdata_sexual_safer_sex_PREP_AND_CONDOM |
| `TASP` | prdata_sexual_safer_sex_TASP |

**DirtySex**
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_dirty_sex_NO_ENTRY |
| `NO` | prdata_sexual_dirty_sex_NO |
| `WS_ONLY` | prdata_sexual_dirty_sex_WS_ONLY |
| `YES` | prdata_sexual_dirty_sex_YES |

**Sm** (S&M)
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_sm_NO_ENTRY |
| `NO` | prdata_sexual_sm_NO |
| `SOFT` | prdata_sexual_sm_SOFT |
| `YES` | prdata_sexual_sm_YES |

**Fisting**
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_fisting_NO_ENTRY |
| `ACTIVE` | prdata_sexual_fisting_ACTIVE |
| `ACTIVE_PASSIVE` | prdata_sexual_fisting_ACTIVE_PASSIVE |
| `PASSIVE` | prdata_sexual_fisting_PASSIVE |
| `NO` | prdata_sexual_fisting_NO |

**Concision**
| Value | String Resource |
|-------|----------------|
| `NO_ENTRY` | prdata_sexual_concision_NO_ENTRY |
| `CUT` | prdata_sexual_concision_CUT |
| `UNCUT` | prdata_sexual_concision_UNCUT |

### 18.3 Hobby/Interest Enums

**Interests** (Parcelable, 17 values)
| Value | String Resource |
|-------|----------------|
| `ART` | prdata_hobby_interests_ART |
| `BOARDGAME` | prdata_hobby_interests_BOARDGAME |
| `CAR` | prdata_hobby_interests_CAR |
| `COLLECT` | prdata_hobby_interests_COLLECT |
| `COOK` | prdata_hobby_interests_COOK |
| `COMPUTER` | prdata_hobby_interests_COMPUTER |
| `DANCE` | prdata_hobby_interests_DANCE |
| `FILM` | prdata_hobby_interests_FILM |
| `GAME` | prdata_hobby_interests_GAME |
| `LITERATURE` | prdata_hobby_interests_LITERATURE |
| `MODELING` | prdata_hobby_interests_MODELING |
| `MOTORBIKE` | prdata_hobby_interests_MOTORBIKE |
| `MUSIC` | prdata_hobby_interests_MUSIC |
| `NATURE` | prdata_hobby_interests_NATURE |
| `FOTO` | prdata_hobby_interests_FOTO |
| `POLITICS` | prdata_hobby_interests_POLITICS |
| `TV` | prdata_hobby_interests_TV |

### 18.4 Search & Filter Enums

**DisplayStat** (14 values - profile card stats)
| Value | Source | Type |
|-------|--------|------|
| `AGE` | PersonalInformation.age | Integer |
| `HEIGHT` | PersonalInformation.height | Integer (cm/inches) |
| `WEIGHT` | PersonalInformation.weight | Integer (kg/lbs) |
| `POSITION` | SexualInformation.analPosition | AnalPosition enum |
| `AGE_RANGE` | PersonalInformation.targetAge | TargetAge (min-max) |
| `BODY_HAIR` | PersonalInformation.bodyHair | BodyHair enum |
| `BODY_TYPE` | PersonalInformation.bodyType | BodyType enum |
| `ETHNICITY` | PersonalInformation.ethnicity | Ethnicity enum |
| `RELATIONSHIP` | PersonalInformation.relationship | Relationship enum |
| `SIZE` | SexualInformation.dickSize | DickSize enum |
| `SAFE` | SexualInformation.saferSex | SaferSex enum |
| `DIRTY` | SexualInformation.dirtySex | DirtySex enum |
| `SM` | SexualInformation.sm | Sm enum |
| `FF` | SexualInformation.fisting | Fisting enum |

**TravellerFilter**
| Value | Description |
|-------|-------------|
| `INCLUDED` | Include travellers in results |
| `EXCLUDED` | Exclude travellers from results |
| `TRAVELLERS_ONLY` | Show only travellers |

**BedBreakfastFilter**
| Value | Description |
|-------|-------------|
| `WITH` | Include B&B hosts |
| `WITHOUT` | Exclude B&B hosts |
| `ONLY` | Show only B&B hosts |

**OnlineStatusFilter** (implements EnumWithValueResource)
| Value | String Resource |
|-------|----------------|
| `ONLINE` | list_onlinestatus_online |
| `DATE` | list_onlinestatus_filter_date |
| `SEX` | list_onlinestatus_filter_sex |

**FullTextSearchMode**
| Value | Description |
|-------|-------------|
| `ANY` | Match any word |
| `ALL` | Match all words |
| `EXACT` | Exact phrase match |

**SearchTabs** (Radar search)
| Value | String Resource |
|-------|----------------|
| `ROMEOS` | radar_redesign_romeos |
| `HASHTAGS` | radar_search_tab_hashtag |
| `PROFILE_TEXT` | radar_search_tab_profiletext |

**RadarTab** (Radar main tabs)
| Value | Tag | IsUserList | String Resource |
|-------|-----|------------|----------------|
| `DISCOVER` | "discover_tab" | false | discover |
| `DISTANCE` | "NEARBY_ASC" | true | sort_nearby |
| `ACTIVITY` | "LAST_LOGIN_DESC" | true | sort_recently |
| `NEW` | "SIGNUP_DESC" | true | sort_newest |

**SearchSettings.SORTING**
| Value | IsWithRadius |
|-------|-------------|
| `NEARBY_ASC` | false |
| `LAST_LOGIN_DESC` | true |
| `SIGNUP_DESC` | true |
| `ALPHABETICAL_ASC` | false |

**SearchSettings.SEARCH_CONTEXT**
| Value | Description |
|-------|-------------|
| `GROUP` | Group search |
| `GROUP_MEMBER` | Group member search |
| `POPULAR_PROFILES` | Popular profiles |
| `RADAR` | Main radar |
| `START_PAGE` | Start/home page |
| `TRAVEL` | Travel mode |

### 18.5 Cruise & Navigation Enums

**CruiseTab** (Cruise section tabs)
| Value | TabIndex |
|-------|----------|
| `VISITORS` | 0 |
| `VISITED` | 1 |
| `LIKES` | 2 |

**CruiseTabs** (Cruise tab UI)
| Value | String Resource |
|-------|----------------|
| `VISITORS` | visitors |
| `VISITED` | visits |
| `LIKES` | likes |

**DiscoverLane** (Discover sections)
| Value | Title |
|-------|-------|
| `BLOG` | null |
| `NEW` | sort_newest |
| `TRAVELLERS_ARRIVING` | discover_travelers_title |
| `EYECANDY` | discover_popular_title |
| `PICTURES_I_LIKED` | pictures_i_liked_toolbar_title |

### 18.6 Media & Picture Enums

**PictureRestriction**
| Value | Description |
|-------|-------------|
| `NON_PLUS` | Non-PLUS user restriction |

**AccessPolicy** (Album access)
| Value | Description |
|-------|-------------|
| (values from decompiled code) | Album sharing policies |

**RatingPicture** (Content rating)
| Value | Description |
|-------|-------------|
| `NEUTRAL` | Safe for all |
| `EROTIC` | Erotic content |
| `HARDCORE` | Explicit content |
| `ILLEGAL` | Illegal content |
| `UNPROCESSED` | Not yet rated |
| `QUEUED` | Rating pending |
| `REJECTED` | Rejected by moderation |
| `BLACKLISTED` | Blocked |
| `DELETING` | Pending deletion |
| `APP_SAFE` | App-safe content |

### 18.7 Notification & Push Enums

**PushMessage.EVENT_NAME**
| Value | Name String | ID |
|-------|-------------|-----|
| `UNKNOWN` | "unknown" | -1 |
| `MESSAGE` | "NewMessage" | 0 |
| `FOOTPRINT` | "NewFootprint" | 1 |
| `QUICKSHAREREQUEST` | "QuickShareRequest" | 3 |
| `QUICKSHAREGRANT` | "QuickShareGrant" | 4 |
| `FORWARDSIGNAL` | "ForwardSignal" | 6 |
| `VISIT` | "ProfileVisit" | 8 |
| `REENGAGEMENT_MISSED_VISIT_COUNT` | "NewVisitorsCount" | 9 |
| `FIREBASEMESSAGE` | "FirebaseMessage" | 10 |
| `PLUS_STATUS_CHANGED` | "PaymentStatusChanged" | 11 |
| `NEW_PICTURE_LIKE` | "NewPictureLike" | 50 |

**PushMessageChat.MESSAGE_STYLE**
| Value | Description |
|-------|-------------|
| `NONE` | No notification |
| `SIMPLE` | Minimal notification |
| `NORMAL` | Standard notification |
| `EXTENDED` | Rich notification |

**PushMessageFootprint.FOOTPRINT_STYLE**
| Value | Description |
|-------|-------------|
| `NONE` | No notification |
| `SIMPLE` | Minimal notification |
| `NORMAL` | Standard notification |

### 18.8 UI & View Enums

**UserListViewHolderType** (27 view types)
| Value | ViewType ID |
|-------|-------------|
| `VIEW_TYPE_UNKNOWN` | 9 |
| `VIEW_TYPE_GRID_SMALL` | 10 |
| `VIEW_TYPE_GRID_BIG` | 11 |
| `VIEW_TYPE_CONTACT` | 12 |
| `VIEW_TYPE_CONTACT_HEADER` | 13 |
| `VIEW_TYPE_PROMO_CONTAINER` | 14 |
| `VIEW_TYPE_CONTACTS_LANE` | 15 |
| `VIEW_TYPE_DISTANCE_LANE` | 16 |
| `VIEW_TYPE_PICTURES_I_LIKED` | 17 |
| `VIEW_TYPE_ONLINE_LANE` | 18 |
| `VIEW_TYPE_NEWEST_LANE` | 19 |
| `VIEW_TYPE_BLOG_CONTAINER` | 20 |
| `VIEW_TYPE_TRAVELLERS_LANE` | 21 |
| `VIEW_TYPE_POPULAR_LANE` | 22 |
| `VIEW_TYPE_SKELETON_LIST` | 23 |
| `VIEW_TYPE_SKELETON_GRID` | 24 |
| `VIEW_TYPE_USER_LIST` | 25 |
| `VIEW_TYPE_EMPTY` | 29 |
| `VIEW_TYPE_BLOG_POST` | 30 |
| `VIEW_TYPE_PREVIEW_BANNER` | 31 |
| `VIEW_TYPE_BED_BREAKFAST` | 33 |
| `VIEW_TYPE_SPARTACUS_BLOG` | 34 |
| `VIEW_TYPE_SPARTACUS_BLOG_CONTAINER` | 35 |
| `VIEW_TYPE_TRAVEL_UPGRADE_PLUS_BANNER` | 36 |
| `VIEW_TYPE_TRAVEL_ARRIVAL_INFO_BANNER` | 37 |
| `VIEW_TYPE_PLUS_UNLIMITED_RADAR_BANNER` | 38 |

**UserListColumnType**
| Value | DefaultColumns | Description |
|-------|---------------|-------------|
| `LIST` | from resources | List view |
| `GRID_SMALL` | from R.integer.small_grid_num_columns | Small grid |
| `GRID_BIG` | from R.integer.big_grid_num_columns | Big grid |

**MessageDom.TransmissionStatus**
| Value | Condition |
|-------|-----------|
| `RECEIVED` | other_id == from_id |
| `DRAFT` | internal_state == DRAFT |
| `TRANSMITTING` | internal_state == INSERTING |
| `SENT` | Otherwise |

**PlanetRomeoDB.MSG_DB_STATE**
| Value | Description |
|-------|-------------|
| `NOTHING` | No pending operation |
| `INSERTING` | Being inserted |
| `UPDATING` | Being updated |
| `DELETING` | Being deleted |
| `DRAFT` | Draft message |

### 18.9 Model & Auth Enums

**CredentialType**
| Value | Description |
|-------|-------------|
| `DEFAULT` | Email/password |
| `FACEBOOK` | Facebook OAuth |

**AppStatus**
| Value | Description |
|-------|-------------|
| `MINOR_UPDATE` | Minor version update |
| `MAJOR_UPDATE` | Major version update |
| `FIRST_START` | First app launch |
| `UPDATE_TO_UNCUT` | Update to UNCUT version |
| `NO_UPDATE` | No update needed |

**ProfileType** (values from decompiled code)
**PartnerLinkStatus** (values from decompiled code)
**ProfileInteraction** (values from decompiled code)
**LinkStatus** (Contact linking)
**StatType** (Profile stat display)
**RatingPicture** (see 18.6 above)

---

## 19. COMPLETE COMPOSE NAVIGATION GRAPH

### 19.1 Media Viewer Navigation (MediaViewerActivity)

The `MediaViewerActivity` uses Jetpack Navigation Compose with these routes:

| Route Pattern | Screen | Parameters |
|---------------|--------|------------|
| `albumListScreenRoute` | Album list | profileIdArg |
| `albumPicturesScreenRoute/{profileIdArg}/{albumIdArg}/{albumNameArg}/{isQuickshareArg}/{newMediaViewerQuickshareExpiryTimeMillis}` | Album photos | profileId, albumId, albumName, isQuickshare, expiryTimeMillis |
| `chatPictureScreenRoute` | Chat picture viewer | messageId, selectedPictureUrlToken |
| `likedPictureScreenRoute` | Liked picture viewer | pictureId |
| `myPictureScreenRoute/{albumIdArg}/{albumNameArg}/{selectedPictureToken}/{albumPreviewPictureToken}/{media_viewer_album_access_policy}` | My album photos | albumId, albumName, selectedToken, previewToken, accessPolicy |
| `pictureILikedScreenRoute/{selectedPictureToken}` | Picture I liked | selectedPictureToken |
| `picturesILikedGridScreenRoute` | Pictures I liked grid | (none) |
| `theirPictureScreenRoute/{profileIdArg}/{albumIdArg}/{albumNameArg}/{isQuickshareArg}/{selectedPictureToken}` | Their album photos | profileId, albumId, albumName, isQuickshare, selectedToken |
| `myAlbumPicturesScreen/{albumIdArg}/{albumNameArg}/{media_viewer_album_access_policy}/{media_viewer_album_access_policy}` | My album pictures | albumId, albumName, accessPolicy |

### 19.2 Settings Navigation (SettingsActivity)

| Route Pattern | Screen |
|---------------|--------|
| `settingsRoute` | Settings main screen |
| Settings sub-screens via NavHost | Account, Analytics, Favourite Stats, Notification, Privacy, etc. |

Settings sub-screens discovered:
- `AccountScreenRoute` (`AccountScreen.kt`)
- `AnalyticsScreenRoute` (`AnalyticsScreen.kt`)
- `FavouriteStatsScreenRoute` (`FavouriteStatsScreen.kt`)
- `SettingsScreenRoute` (`SettingsScreen.kt`)

### 19.3 Support Navigation (SupportActivity)

| Route Pattern | Screen |
|---------------|--------|
| `supportScreenRoute` | Support main screen |

### 19.4 Picture Likes Navigation

| Route Pattern | Screen |
|---------------|--------|
| `pictureLikesScreenRoute/{pictureId}` | Picture likes view |

### 19.5 Main App Navigation (HomeActivity)

Bottom navigation tabs (from color resources and Compose screen evidence):
- **Radar** - Main browsing screen (`RadarScreenKt`)
- **Messages** - Chat list (`MessengerFragment` / `ChatListFragment`)
- **Cruise** - Visitors/Visited/Likes (`CruiseScreenKt`)
- **More** - Settings, support, profile, etc.

### 19.6 Top-Level Activities (Intent-based navigation)

| Activity | Purpose |
|----------|---------|
| `HomeActivity` | Main app shell with bottom navigation |
| `LoginActivity` | Email/password login |
| `ActivitySignup` | Multi-step signup wizard |
| `ForgotPasswordActivity` | Password reset |
| `AccountListActivity` | Multi-account picker |
| `ProfileDeactivatedActivity` | Deactivated account screen |
| `ViewProfileActivity` | View other profiles |
| `EditProfileActivity` | Edit own profile |
| `PickProfileActivity` | Choose from profiles |
| `StatsInterviewActivity` | Profile stats setup |
| `ChangeEmailActivity` | Change email |
| `FootprintsActivity` | Visit tracking |
| `FriendRequestsActivity` | Incoming friend requests |
| `EditContactActivity` | Edit contact details |
| `MediaViewerActivity` | Compose-based media viewer |
| `BillingActivity` | PLUS membership |
| `PaymentHistoryActivity` | Transaction history |
| `PaymentOrderActivity` | Purchase flow |
| `SpartacusWebViewActivity` | Travel mode |
| `DeepLinkActivity` | Deep link handler |
| `ExitInterviewActivity` | Churn feedback |
| `ReportAndBlockActivity` | Report/block user |
| `ReportCommentActivity` | Report message |
| `ReportHateSpeechActivity` | Report hate speech |
| `DataMigrationActivity` | Legacy data migration |
| `PlacesAutocompleteActivity` | Place search |
| `PickLocationActivity` | Location picker |
| `UserLocationActivity` | Location display |
| `ShowLocationActivity` | Show location |
| `EditRadarSettingsActivity` | Radar filter config |
| `DsPlaygroundActivity` | Design system playground |
| `TestBedActivity` | Debug/test bed |

---

## 20. SUBSCRIPTION TIER DETAILS

### 20.1 PLUS Tier Sources

| Source | Description |
|--------|-------------|
| `PLUS (free)` | Free trial |
| `PLUS (compensation)` | Compensation credit |
| `PLUS (gift received)` | Gift from another user |
| `PLUS (promotion)` | Promotional access |
| `PLUS (referral)` | Referral bonus |
| `PLUS (voucher)` | Voucher redemption |
| `PLUS (with renewal)` | Auto-renewing subscription |
| `PLUS (without renewal)` | One-time purchase |

### 20.2 PLUS Feature Matrix

| Feature | Free | PLUS |
|---------|------|------|
| Radar results | Limited | Unlimited |
| Scrolling | Limited | Unlimited |
| Search options | Basic | 120+ options |
| Grid view customization | Basic | Full customization |
| Profile stat display | Fixed | Up to 6 selectable |
| Profile visit visibility | 24 hours | 7 days |
| Hide profile visits | No | Within 30 seconds |
| Invisible Mode | No | Yes (appear offline) |
| Chat phrases | View only | Save, edit, send |
| QuickShare sharing | Limited/day | Unlimited |
| Photo uploads | Limited | Unlimited |
| Travel visibility | Standard | 2 weeks before arrival |
| Contact saving | Limited | Unlimited |
| Contact blocking | Limited | Unlimited |
| XXX content | Hidden | Visible |
| App appear offline | No | Yes |

### 20.3 PictureRestriction

| Value | Description |
|-------|-------------|
| `NON_PLUS` | Non-PLUS user - restricted content display |

### 20.4 Billing Integration

- Google Play Billing v8.0.0
- `ProxyBillingActivity` / `ProxyBillingActivityV2` - Billing flow handlers
- `PlayCoreDialogWrapperActivity` - Play Core dialog
- Purchase validation via `POST /payment/appstore/google/purchases`
- Transaction history via `GET /payment/history`
- Remote config: `transaction_history_visibility` (default: true)

### 20.5 PLUS Status Push Notification

- Event: `PLUS_STATUS_CHANGED` ("PaymentStatusChanged", ID: 11)
- Triggered when subscription status changes
- Updates local PLUS status immediately

---

## 21. FIREBASE REMOTE CONFIG KEYS (COMPLETE)

All Remote Config keys with their defaults, organized by feature area.

### 21.1 Travel Configuration

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `travel_standard_locations` | London, Paris, Amsterdam, SF, Rio | JSON | Default travel cities |
| `travel_page_list` | 6 lane types | JSON | Travel page layout lanes |
| `travel_max_radius` | 25000 | Long | Max travel radius (meters) |
| `min_booked_location_gap` | 30000 | Long | Min gap between travel bookings (meters) |
| `show_popular_in_travel` | true | Boolean | Popular profiles in travel view |

### 21.2 Discover Configuration

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `show_discover_feature` | true | Boolean | Enable discover tab |
| `discover_page_list` | 9 lane types | JSON | Discover page layout |
| `discover_item_count` | 6 | Long | Items per discover lane |
| `discover_lane` | All DiscoverLane entries | JSON | Discover lane configuration |

### 21.3 Radar Configuration

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `radar_available_stats_post_3_22` | All DisplayStat values | JSON | Available profile stats |
| `radar_max_selected_stats` | 6 | Long | Max selectable stats on cards |
| `show_preview_listview` | true | Boolean | Show list view preview |
| `show_preview_big_grid` | true | Boolean | Show big grid preview |
| `preview_listview_length` | 4 | Long | Preview list items count |
| `radius_map_restriction` | 100.0 | Double | Map zoom restriction |
| `show_chat_icon_on_radar` | false | Boolean | Chat icon on radar cards |
| `show_linked_icon_on_radar` | false | Boolean | Linked icon on radar cards |
| `popular_strategy` | "jocks" | String | Popular profiles algorithm |
| `footprint_gridview_columns` | (int) | Long | Footprint grid columns |

### 21.4 Search & Filter Configuration

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `signup_search_filter` | SearchFilter (default) | JSON | Default search filters for signup |
| `age_range_delta` | 7 | Long | Age range step size |
| `show_stats_interview` | true | Boolean | Stats interview on signup |

### 21.5 App Update Configuration

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `version_code_optional_update` | 1100000551 | Long | Optional update threshold |
| `version_code_immediate_update` | 1100000551 | Long | Mandatory update threshold |
| `force_mandatory_uncut_updates` | false | Boolean | Force UNCUT update |

### 21.6 Feature Flags

| Key | Default | Type | Purpose |
|-----|---------|------|---------|
| `transaction_history_visibility` | true | Boolean | Show payment history |
| `show_play_store_in_app_review` | true | Boolean | In-app review prompt |
| `rejected_profile_check_message` | true | Boolean | Check rejected profiles |
| `rejected_profile_show_banner` | true | Boolean | Show rejected profile banner |
| `rejected_profile_support_chat` | true | Boolean | Support chat for rejected |
| `enable_hardware_bitmap` | false | Boolean | HW bitmap acceleration |
| `use_static_signup_background` | true | Boolean | Static signup bg image |
| `rate_the_app` | true | Boolean | App rating prompt |
| `become_beta_tester` | true | Boolean | Beta tester option |
| `show_get_verified_on_side_menu` | true | Boolean | Verification in side menu |
| `show_groups_on_side_menu` | false | Boolean | Groups in side menu |
| `show_exit_interview` | false | Boolean | Exit interview on delete |
| `show_report_picture_on_feed` | false | Boolean | Report button on feed pics |
| `get_verified_url_link` | romeo.com verification URL | String | Verification info link |

### 21.7 Remote Config Implementation

```java
public final class RemoteConfig {
    // 12-hour refresh interval
    private static final long REFRESH_INTERVAL_HOURS = 12;
    
    // Key methods:
    // getFromRemoteConfig(key, defaultValue) -> T
    // defaultTravelLocations -> List<TravelLocation>
    // C() -> GeoPosition (default geo position from config)
    // n() -> boolean (feature flag check)
}
```

---

## 22. ADDITIONAL API ERROR CODES & CONTEXTS

### 22.1 Complete Error Code Table

| HTTP | Error Code | Context | Meaning |
|------|-----------|---------|---------|
| 403 | `AUTH_WRONG_API_KEY` | any | Invalid API key |
| 403 | `AUTH_INVALID_CREDENTIALS` | POST_SESSION | Wrong email/password |
| 403 | `AUTH_NOT_LOGGED_IN` | any | Session expired |
| 403 | `AUTH_NOT_ENOUGH_PRIVILEGES` | any | Feature requires PLUS |
| 403 | `AUTH_LIMIT_EXCEEDED` | any | Rate/contact limit hit |
| 403 | `AUTH_BLOCKED_BY_PROFILE_OWNER` | any | User blocked you |
| 403 | `AUTH_PROFILE_UNVERIFIED` | any | Email not verified |
| 403 | `AUTH_PROFILE_DEACTIVATED` | any | Account deactivated |
| 403 | `AUTH_PROFILE_BANNED` | any | Account banned |
| 403 | `AUTH_ACCOUNT_NOT_CONFIRMED` | any (except POST_SESSION) | Email confirmation pending |
| 403 | `AUTH_REPORTING_NOT_ALLOWED` | any | Cannot submit reports |
| 400 | `ARGUMENT_INVALID` | GET_PROFILES | Search expired/invalid |
| 400 | `ARGUMENT_REQUIRED` | any | Missing required parameter |
| 400 | `PICTURE_INVALID_RATING` | POST_PICTURES | Photo content rating issue (QUEUED) |
| 400 | `INTERACTION_NOT_ALLOWED` | any | Action blocked (AUTH_PROFILE_UNVERIFIED reason) |
| 406 | `RESOURCE_ALREADY_EXISTS` | POST_PICTURES | Duplicate picture upload |
| 406 | `RESOURCE_ALREADY_EXISTS` | POST_PICTURES_ALBUMS_SHARED_GRANTS | QuickShare already shared |
| 404 | `RESOURCE_NOT_FOUND` | any | Resource not found |
| 429 | `TOO_MANY_REQUESTS` | any | Rate limited |
| any | `REACTIONS_NOT_ACCESSIBLE` | any | Cannot see reactions |
| any | `RECEIVER_IS_MESSAGE_PROTECTED` | any | Cannot message user |
| any | `PROFILE_PARTNER_SELF` | any | Cannot link own profile |
| any | `APPSTORE_DUPLICATE_PURCHASE` | POST_PAYMENT_APPSTORE_GOOGLE_PURCHASES | Double purchase attempt |
| any | `GET_PROFILES_ARGUMENT_INVALID_handle` | GET_PROFILES | Search parameter error |

### 22.2 Exception Classes

| Class | Purpose |
|-------|---------|
| `ApiException.PrException` | Main API error (errorCode, context, parameter, errorMessage) |
| `ApiException.InvalidCredentialsException` | Login failure |
| `ApiException.DuplicatePictureUploadException` | Photo already uploaded (carries pictureJsonString) |
| `ApiException.PictureUnderReviewException` | Photo under moderation review |
| `ApiException.ProfileBannedException` | Account banned |
| `ApiException.RejectedProfileException` | Profile rejected |
| `ApiException.ServiceUnavailableException` | Server unavailable (503) |
| `ApiException.SslHandshakeException` | SSL certificate error |
| `ApiException.UnconfirmedAccountException` | Email not confirmed |
| `ApiException.WrongApiKeyException` | Invalid API key (403) |

### 22.3 Error Detection Methods on PrException

```java
// Detect specific error conditions:
isSearchExpiredException()     // context=GET_PROFILES, errorCode=ARGUMENT_INVALID
isDuplicatePurchase()          // errorCode=APPSTORE_DUPLICATE_PURCHASE, context=POST_PAYMENT_*
isLimitExceeded()              // errorCode=AUTH_LIMIT_EXCEEDED
isQuickshareAlreadySharedException() // errorCode=RESOURCE_ALREADY_EXISTS, context=POST_PICTURES_ALBUMS_SHARED_GRANTS
isDeactivatedProfile()         // errorCode=AUTH_PROFILE_DEACTIVATED
accountNotConfirmed()          // errorCode=AUTH_ACCOUNT_NOT_CONFIRMED
```

### 22.4 Error Detection on Companion Object

```java
Companion.a(httpStatus, errorCode)           // 403 + AUTH_WRONG_API_KEY
Companion.b(httpStatus, errorCode, context)  // 406 + RESOURCE_ALREADY_EXISTS + POST_PICTURES
Companion.c(httpStatus, errorCode, context)  // 403 + AUTH_INVALID_CREDENTIALS + POST_SESSION
Companion.d(httpStatus, errorCode)           // 403 + AUTH_PROFILE_BANNED
Companion.e(httpStatus, errorCode, msg, reason) // 400 + PICTURE_INVALID_RATING + "QUEUED"
Companion.f(httpStatus, errorCode, reason)   // 400 + INTERACTION_NOT_ALLOWED + AUTH_PROFILE_UNVERIFIED
Companion.g(httpStatus, errorCode, isOffline) // 503 or 5xx error
Companion.h(httpStatus, errorCode, context)  // 403 + AUTH_ACCOUNT_NOT_CONFIRMED (except POST_SESSION)
```

---

## 23. PROTOBUF MESSAGE TYPES (BUNDLED)

### 23.1 Application-Specific Protos

| Proto File | Purpose |
|------------|---------|
| `client_analytics.proto` | Analytics event definitions for client-side tracking |
| `messaging_event.proto` | Messaging event structure (chat events) |
| `messaging_event_extension.proto` | Message event extensions |

### 23.2 Firebase Protos

| Proto File | Purpose |
|------------|---------|
| `firebase/inappmessaging/proto/common_types.proto` | In-app messaging common types |
| `firebase/inappmessaging/proto/experiment_payload.proto` | A/B test experiment payloads |
| `firebase/inappmessaging/proto/messages.proto` | In-app message definitions |
| `firebase/perf/v1/perf_metric.proto` | Performance monitoring metrics |

### 23.3 Google Standard Protos

| Proto File | Purpose |
|------------|---------|
| `google/firestore/v1/*.proto` | Firestore database operations |
| `google/protobuf/*.proto` | Standard well-known types (Any, Timestamp, etc.) |

### 23.4 gRPC Service Definitions

gRPC services are registered via META-INF:
- `io.grpc.ManagedChannelProvider` -- Channel management
- `io.grpc.Q` -- Obfuscated service
- `io.grpc.Y` -- Obfuscated service
- `io.grpc.e0` -- Obfuscated service

The gRPC-OkHttp transport uses HTTP/2 framing with `ErrorCode.fromHttp2()` for error handling.

---

## 24. UX/UI ANALYSIS

### 24.1 Complete Screen Inventory (30+ Activities)

Extracted from Dagger injection map (`h0.java`) and manifest declarations. Each Activity is a distinct screen in the app.

| # | Activity | Category | UI Framework | Purpose |
|---|----------|----------|--------------|---------|
| 1 | `SplashActivity` | Onboarding | Compose | App launch splash screen |
| 2 | `LoginActivity` | Auth | XML Views | Email/password login |
| 3 | `ActivitySignup` | Auth | Fragments + Compose | Multi-step signup wizard (9 fragments) |
| 4 | `ForgotPasswordActivity` | Auth | XML Views | Password reset |
| 5 | `AccountListActivity` | Auth | XML Views | Multi-account picker |
| 6 | `ProfileDeactivatedActivity` | Auth | XML Views | Deactivated account notice |
| 7 | `HomeActivity` | Core | Compose Navigation | Main shell with bottom navigation |
| 8 | `RadarPagingActivity` | Radar | Compose | Profile browsing (grid/list) |
| 9 | `EditRadarSettingsActivity` | Radar | XML Views + Compose | Filter configuration |
| 10 | `ViewProfileActivity` | Profile | Compose | View other user profiles |
| 11 | `EditProfileActivity` | Profile | XML Views | Edit own profile |
| 12 | `PickProfileActivity` | Profile | Compose | Choose from multiple profiles |
| 13 | `StatsInterviewActivity` | Profile | Fragments | Profile stats setup wizard |
| 14 | `ChangeEmailActivity` | Profile | XML Views | Change email address |
| 15 | `FootprintsActivity` | Social | Compose | Visit tracking screen |
| 16 | `FriendRequestsActivity` | Social | XML Views | Incoming friend requests |
| 17 | `EditContactActivity` | Social | XML Views | Edit contact details |
| 18 | `MediaViewerActivity` | Media | Compose Navigation | Full media viewer with sub-screens |
| 19 | `AlbumListActivity` | Media | Compose | Album list |
| 20 | `DisplayAlbumActivity` | Media | Compose | Album contents |
| 21 | `AlbumSelectionActivity` | Media | XML Views | Photo picker for albums |
| 22 | `SelectSectionedAlbumActivity` | Media | Compose | Sectioned album picker |
| 23 | `BillingActivity` | Billing | Compose | PLUS membership management |
| 24 | `PaymentHistoryActivity` | Billing | XML Views | Transaction history |
| 25 | `PaymentOrderActivity` | Billing | XML Views | Purchase flow |
| 26 | `SpartacusWebViewActivity` | Travel | WebView | Travel mode overview |
| 27 | `DeepLinkActivity` | System | Intent routing | Deep link handler |
| 28 | `ExitInterviewActivity` | Feedback | XML Views | Churn feedback survey |
| 29 | `ReportAndBlockActivity` | Safety | Compose | Report/block user |
| 30 | `ReportCommentActivity` | Safety | XML Views | Report a message |
| 31 | `ReportHateSpeechActivity` | Safety | XML Views | Report hate speech |
| 32 | `SettingsActivity` | Settings | Compose Navigation | Settings hub with sub-screens |
| 33 | `SupportActivity` | Support | Compose Navigation | Support/help hub |
| 34 | `AboutUsActivity` | Info | Compose | About Romeo |
| 35 | `DataMigrationActivity` | System | Background | Legacy data migration |
| 36 | `PlacesAutocompleteActivity` | Location | Google Places | Place search with autocomplete |
| 37 | `PickLocationActivity` | Location | Google Maps | Location picker on map |
| 38 | `UserLocationActivity` | Location | XML Views | Location display |
| 39 | `ShowLocationActivity` | Location | XML Views | Show shared location |
| 40 | `DsPlaygroundActivity` | Debug | Compose | Design system playground |
| 41 | `TestBedActivity` | Debug | XML Views | Debug/test bed |
| 42 | `ServiceUnavailableActivity` | System | Compose | Server unavailable notice |

### 24.2 Fragment Inventory

| Fragment | Activity Host | Purpose |
|----------|---------------|---------|
| `LetsStartFragment` | ActivitySignup | Welcome/intro screen |
| `ChooseUsernameAndPassFragment` | ActivitySignup | Username + password entry |
| `ChooseLocationSignupFragment` | ActivitySignup | Location picker |
| `CreateProfileFragment` | ActivitySignup | Profile details entry |
| `DescribeYourselfFragment` | ActivitySignup | Bio/description |
| `LetsGoDeeperFragment` | ActivitySignup | Additional details |
| `LifestyleSignupFragment` | ActivitySignup | Lifestyle preferences |
| `AddProfilePhotoFragment` | ActivitySignup | Profile photo upload |
| `ResumeSignupFragment` | ActivitySignup | Resume interrupted signup |
| `MessengerFragment` | HomeActivity | Chat list / message inbox |
| `ChatListFragment` | HomeActivity | Chat list (Compose-based) |
| `ContactListFragment` | HomeActivity | Contact list |
| `NavHostFragment` | Various | Jetpack Navigation host |

### 24.3 Compose Component Library

Extracted from `ComposableSingletons$*Kt` class references in decompiled code. These are the reusable Compose components and screens.

#### 24.3.1 Core UI Components

| Component | File | Package | Purpose |
|-----------|------|---------|---------|
| `RomeoTheme` | `Theme.kt` | `core.ui.components.compose` | Material 3 theme wrapper |
| `RadarTabRow` | `RadarTabRow.kt` | `core.ui.components.compose` | Tab row for radar sections |
| `ServiceUnavailableActivity` | `ServiceUnavailableActivity.kt` | `core.ui` | Server error screen |

#### 24.3.2 Radar & Browsing Components

| Component | File | Purpose |
|-----------|------|---------|
| `RadarScreenKt` | `RadarScreen.kt` | Main radar browsing screen |
| `RadarMainTabScreenKt` | `RadarMainTabScreen.kt` | Radar with tab navigation |
| `DiscoverScreenKt` | `DiscoverScreen.kt` | Discover lanes screen |
| `DiscoverLaneItemKt` | `DiscoverLaneItem.kt` | Individual discover lane |

#### 24.3.3 Cruise (Visitors/Visited/Likes) Components

| Component | File | Purpose |
|-----------|------|---------|
| `CruiseScreenKt` | `CruiseScreen.kt` | Main cruise screen with confirm-clear-all dialog |
| `CruiseListItemKt` | `CruiseListItem.kt` | List item for cruise entries |
| `CruiseSmallGridItemKt` | `CruiseSmallGridItem.kt` | Small grid card for cruise |
| `CruiseBigGridItemKt` | `CruiseBigGridItem.kt` | Large grid card for cruise |
| `CruiseTabRowKt` | `CruiseTabRow.kt` | Tab row for Visitors/Visited/Likes |
| `CruiseTabItemKt` | `CruiseTabItem.kt` | Individual tab item |
| `VisitorsScreenKt` | `VisitorsScreen.kt` | Who visited you |
| `VisitedScreenKt` | `VisitedScreen.kt` | Who you visited |
| `LikesScreenKt` | `LikesScreen.kt` | Who liked you |
| `LikeDetailsScreenKt` | `LikeDetailsScreen.kt` | Like details view |

#### 24.3.4 Media Viewer Components

| Component | File | Purpose |
|-----------|------|---------|
| `AlbumListScreenKt` | `AlbumListScreen.kt` | Album list with grid |
| `FullImageViewScreenKt` | `FullImageViewScreen.kt` | Full-screen image viewer (4 composable lambdas) |
| `MyPictureScreenKt` | `MyPictureScreen.kt` | Own photos management |
| `MyPictureListItemKt` | `MyPictureListItem.kt` | Photo list item |
| `MyPicturesVerticalPagingListKt` | `MyPicturesVerticalPagingList.kt` | Vertical paging photo feed |
| `TheirPictureFeedVerticalPagingListKt` | `TheirPictureFeedVerticalPagingList.kt` | Other user's photo feed |
| `VerticalScrollListKt` | `VerticalScrollList.kt` | Vertical scrollable list |
| `ReportPIctureDialogKt` | `ReportPictureDialog.kt` | Report photo dialog with CAPTCHA |
| `PictureLikesScreenKt` | `PictureLikesScreen.kt` | Picture likes view |
| `PicturesILikedGridScreenKt` | `PicturesILikedGridScreen.kt` | Grid of liked photos |
| `PictureILikedVerticalFeedScreenKt` | `PictureILikedVerticalFeedScreen.kt` | Vertical feed of liked photos |
| `MenuKt` | `Menu.kt` (my_album_pictures) | Album picture context menu (4 options) |

#### 24.3.5 Settings Components

| Component | File | Purpose |
|-----------|------|---------|
| `SettingsScreenKt` | `SettingsScreen.kt` | Main settings screen |
| `AccountScreenKt` | `AccountScreen.kt` | Account settings (3 composable lambdas) |
| `AnalyticsScreenKt` | `AnalyticsScreen.kt` | Analytics consent screen |
| `FavouriteStatsScreenKt` | `FavouriteStatsScreen.kt` | Favorite stat customization |
| `PreferencesScreenKt` | `PreferencesScreen.kt` | App preferences |
| `NewPasswordDialogKt` | `NewPasswordDialog.kt` | New password dialog |

#### 24.3.6 More Menu Components

| Component | File | Purpose |
|-----------|------|---------|
| `MoreMenuSettingsItemKt` | `MoreMenuSettingsItem.kt` | Settings menu item |
| `AboutUsScreenKt` | `AboutUsScreen.kt` | About screen (3 composable lambdas) |
| `GetSupportScreenKt` | `GetSupportScreen.kt` | Get support screen |
| `SupportScreenKt` | `SupportScreen.kt` | Support hub screen |

#### 24.3.7 Debug Components

| Component | File | Purpose |
|-----------|------|---------|
| `DsToolbarFragmentKt` | `DsToolbarFragment.kt` | Design system toolbar |

### 24.4 Page Flows

#### 24.4.1 First Launch / Onboarding Flow

```
SplashActivity
  --> [First launch?] --> ActivitySignup (9-step wizard)
      1. LetsStartFragment (welcome)
      2. ChooseUsernameAndPassFragment
      3. ChooseLocationSignupFragment
      4. CreateProfileFragment
      5. DescribeYourselfFragment
      6. LetsGoDeeperFragment
      7. LifestyleSignupFragment
      8. AddProfilePhotoFragment
      9. StatsInterviewActivity (optional, remote config)
  --> [Resume?] --> ResumeSignupFragment
  --> [Existing session?] --> HomeActivity
```

#### 24.4.2 Login Flow

```
LoginActivity
  --> [Email/password] --> validate --> HomeActivity
  --> [Facebook OAuth] --> FacebookCredentials --> HomeActivity
  --> [Forgot password] --> ForgotPasswordActivity
  --> [Multiple accounts] --> AccountListActivity
  --> [Deactivated] --> ProfileDeactivatedActivity
  --> [Unconfirmed email] --> Resend verification
```

#### 24.4.3 Main App Navigation Flow (HomeActivity)

```
HomeActivity (Bottom Navigation)
  |
  |-- [Radar] --> RadarScreenKt / RadarMainTabScreenKt
  |     |-- Radar tabs: DISCOVER | DISTANCE | ACTIVITY | NEW
  |     |-- Search tabs: ROMEOS | HASHTAGS | PROFILE_TEXT
  |     |-- Edit filters --> EditRadarSettingsActivity
  |     |-- Tap profile --> ViewProfileActivity
  |     |     |-- Send message --> messaging
  |     |     |-- View photos --> MediaViewerActivity
  |     |     |-- Leave footprint --> FootprintsActivity
  |     |     |-- Report --> ReportAndBlockActivity
  |     |     |-- Block --> ReportAndBlockActivity
  |     |     |-- Save contact --> EditContactActivity
  |
  |-- [Messages] --> MessengerFragment / ChatListFragment
  |     |-- Tap conversation --> chat view
  |     |-- Saved phrases panel
  |     |-- Image/location sharing
  |
  |-- [Cruise] --> CruiseScreenKt
  |     |-- Tab: Visitors --> VisitorsScreenKt
  |     |-- Tab: Visited --> VisitedScreenKt
  |     |-- Tab: Likes --> LikesScreenKt
  |     |-- Tap item --> ViewProfileActivity
  |     |-- Clear all --> confirm dialog
  |
  |-- [More] --> More menu
        |-- My Profile --> EditProfileActivity
        |-- My Pictures --> MediaViewerActivity (album nav)
        |-- Travel --> SpartacusWebViewActivity
        |-- Footprints --> FootprintsActivity
        |-- Friends --> FriendRequestsActivity
        |-- Settings --> SettingsActivity
        |     |-- Account --> AccountScreen
        |     |-- Analytics --> AnalyticsScreen
        |     |-- Favourite Stats --> FavouriteStatsScreen
        |     |-- Preferences --> PreferencesScreen
        |     |-- Notification settings
        |     |-- Privacy settings
        |     |-- Video chat settings
        |-- Support --> SupportActivity
        |     |-- Help center --> Zendesk
        |     |-- Live chat --> Zendesk Messaging
        |     |-- Submit ticket --> Zendesk RequestActivity
        |-- About Us --> AboutUsActivity
        |-- Get Verified --> web link
        |-- Rate the App --> Play Store review
        |-- Exit --> ExitInterviewActivity (optional)
```

#### 24.4.4 Profile Viewing Flow

```
ViewProfileActivity
  |-- Profile header (photo, name, age, distance, online status)
  |-- Verification badge
  |-- Profile stats (customizable for PLUS)
  |-- Photo gallery --> MediaViewerActivity
  |     |-- Album list --> AlbumListScreen
  |     |-- Album photos --> albumPicturesScreenRoute
  |     |-- Full image --> FullImageViewScreen
  |     |-- Their photos --> theirPictureScreenRoute
  |     |-- QuickShare request --> API call
  |-- Send message --> chat
  |-- Leave footprint --> NewFootprintDetailsDialogCompose
  |-- Save/remove contact
  |-- Report --> ReportAndBlockActivity
  |-- Block --> ReportAndBlockActivity
```

#### 24.4.5 Media Viewer Flow (MediaViewerActivity)

```
MediaViewerActivity (Compose Navigation)
  |-- Album List (albumListScreenRoute)
  |     |-- Tap album --> Album Pictures
  |     |     |-- albumPicturesScreenRoute/{profileId}/{albumId}/{albumName}/{isQuickshare}/{expiryTime}
  |     |     |-- Pull to refresh
  |     |     |-- Tap photo --> Full Image
  |     |     |-- QuickShare request/grant/revoke
  |
  |-- My Pictures (myPictureScreenRoute)
  |     |-- myAlbumPicturesScreen/{albumId}/{albumName}/{accessPolicy}
  |     |-- Photo management (reorder, delete, set main)
  |     |-- Menu: Reorder, Delete, Set as main, Share
  |
  |-- Full Image (FullImageViewScreen)
  |     |-- Pinch to zoom
  |     |-- Like/unlike
  |     |-- Report (with CAPTCHA)
  |     |-- Share
  |
  |-- Pictures I Liked
  |     |-- picturesILikedGridScreenRoute (grid view)
  |     |-- pictureILikedScreenRoute/{token} (detail view)
  |
  |-- Chat Pictures
  |     |-- chatPictureScreenRoute/{messageId}/{urlToken}
  |
  |-- Their Pictures
        |-- theirPictureScreenRoute/{profileId}/{albumId}/{albumName}/{isQuickshare}/{selectedToken}
```

#### 24.4.6 Settings Flow

```
SettingsActivity (Compose Navigation)
  |-- settingsRoute (main)
  |-- AccountScreenRoute --> Account settings
  |     |-- Change email --> ChangeEmailActivity
  |     |-- Change password --> NewPasswordDialog
  |-- AnalyticsScreenRoute --> Analytics consent
  |-- FavouriteStatsScreenRoute --> Customize radar card stats
  |-- PreferencesScreenRoute --> App preferences
  |     |-- Notification settings
  |     |-- Distance unit (metric/imperial)
  |     |-- Sound effects
  |     |-- Vibration
  |-- Privacy settings
  |-- Video chat settings
  |-- Data migration
```

#### 24.4.7 Signup Wizard Flow (Detailed)

```
ActivitySignup
  |
  |-- Step 1: LetsStartFragment
  |     "Welcome to Romeo" with animated Lottie intro
  |     (new_footprint_onboarding_animation)
  |
  |-- Step 2: ChooseUsernameAndPassFragment
  |     Username field + validation (AccountFieldValidationEnum)
  |     Password field + strength indicator
  |     Error types: SignupValidationErrorType
  |
  |-- Step 3: ChooseLocationSignupFragment
  |     LocationAddressAdapterItem (autocomplete suggestions)
  |     GPS coordinates capture
  |     LocationValid + InputFieldStatus tracking
  |     animateCamera for map focus
  |
  |-- Step 4: CreateProfileFragment
  |     CreateProfileUiState management
  |     Personal attributes entry
  |
  |-- Step 5: DescribeYourselfFragment
  |     Bio/description text input
  |
  |-- Step 6: LetsGoDeeperFragment
  |     Additional profile details
  |
  |-- Step 7: LifestyleSignupFragment
  |     Lifestyle preferences selection
  |
  |-- Step 8: AddProfilePhotoFragment
  |     ChoosePictureView (photo picker)
  |     Camera capture or gallery selection
  |
  |-- Step 9: StatsInterviewActivity (optional)
  |     Controlled by: show_stats_interview (remote config)
  |     Display stat preference setup
  |
  --> HomeActivity
```

### 24.5 Interaction Patterns

#### 24.5.1 Pull-to-Refresh

- **Compose:** `PullRefreshState` + `PullRefreshIndicatorKt` in album picture lists
- **Legacy:** `SwipeRefreshLayout` in older screens (messaging, support request list)
- Used in: Album pictures, cruise lists, discover lanes, pictures I liked

#### 24.5.2 Infinite Scroll / Paging

- **Paging 3** with `LazyPagingItems` for all scrollable lists
- `Pager` with `CachedPagingData` for cached infinite scroll
- Used in: Radar results, cruise lists, album pictures, picture feeds
- `PagingData` flow collected in Compose via `collectAsLazyPagingItems()`

#### 24.5.3 Swipe Gestures

- `SwipeRefreshLayout` for pull-to-refresh in legacy views
- SwipeRefreshLayout interface `x extends SwipeRefreshLayout.j` for callback handling
- Potential swipe actions on cruise list items (delete/dismiss)

#### 24.5.4 Drag Gestures

- Accessibility drag actions: `ACTION_DRAG_START`, `ACTION_DRAG_DROP`, `ACTION_DRAG_CANCEL`
- Photo reordering in albums via drag-to-reorder
- `Modifier` chains with `ComposedModifierKt` for touch handling

#### 24.5.5 Tap Gestures

- Profile card taps navigate to ViewProfileActivity
- Image taps open full-screen viewer
- Long press for context menus (album picture menu with 4 options)
- `ClickableKt.d()` for clickable Compose modifiers

#### 24.5.6 Bottom Sheet Dialogs

- `BottomSheetDialog` subclass (`d8/f.java`) for modal bottom sheets
- `ModalBottomSheetDialogWrapper` from Material 3 for Compose bottom sheets
- `BottomSheetScaffold` for persistent bottom sheet layouts
- Used for: footprint details, report options, filter settings

#### 24.5.7 Dialogs

| Dialog | Location | Purpose |
|--------|----------|---------|
| `NewFootprintDetailsDialogCompose` | Footprints | Leave a footprint on a profile |
| `ReportPIctureDialogKt` | Media Viewer | Report photo with CAPTCHA verification |
| `BuyPlusDialogDom` | Various | PLUS upsell dialog |
| `NewPasswordDialogKt` | Settings | Change password |
| `MaterialStyledDatePickerDialog` | Travel/Settings | Date picker (Material 3) |
| `CruiseScreen confirm dialog` | Cruise | Confirm clear all visitors/visited |
| `ServiceUnavailableActivity` | System | Server error with retry |

#### 24.5.8 Compose Modifier Patterns

- `ComposedModifierKt.e()` used extensively for modifier chaining
- `BoxScope.a()` for box alignment modifiers
- `SizeKt.f()` for size modifiers
- `ClickableKt.d()` for click handling
- `Modifier.fillMaxSize()`, `Modifier.fillMaxWidth()` patterns throughout

### 24.6 Visual Design System

#### 24.6.1 Theme Structure

```
PlanetRomeoTheme
  |-- PlanetRomeoTheme.DayNight (auto dark/light)
  |-- PlanetRomeoTheme.NoActionBar (main app)
  |-- PlanetRomeoTheme.Transparent (overlay screens)
  |-- PlanetRomeoTheme.VersionExtra (version info)
  |-- PlanetRomeoSplash.Theme (splash screen)
  |-- PlanetRomeoZendeskTheme (support integration)
```

#### 24.6.2 Material 3 Integration

- `MaterialThemeKt.a()` wraps content with Material 3 theme
- `RomeoTheme` composable applies custom color scheme
- Material 3 components: `BottomSheetScaffold`, `ModalBottomSheet`, `NavigationBar`, `TabRow`
- Material 3 date picker: `PlanetRomeo.Theme.MaterialDatePicker`
- Material 3 ripple effects: `material-ripple` library

#### 24.6.3 Color System

- `colorPrimary` -- Primary brand color
- `colorAccent` -- Accent/interactive color
- `color_state_accent` -- Accent color state list (pressed/default states)
- `mtrl_navigation_bar_item_tint` -- Navigation bar item tints
- `mtrl_navigation_bar_colored_item_tint` -- Active tab color
- `mtrl_navigation_bar_ripple_color` -- Touch ripple on nav items
- `m3_navigation_bar_item_with_indicator_icon_tint` -- Material 3 indicator

#### 24.6.4 Custom View Components

| Component | Style | Purpose |
|-----------|-------|---------|
| `PlanetRomeo.AutoCompleteTextView` | Custom | Search autocomplete |
| `PlanetRomeo.Dialog.Button.Normal` | Custom | Dialog button styling |
| `PlanetRomeo.Signup.TabLayout.TabText` | Custom | Signup step tabs |
| `PlanetRomeo.TextInputLayout.Settings` | Custom | Settings input fields |
| `PlanetRomeo.TextInputLayout.Registration` | Custom | Registration input fields |
| `PlanetRomeo.Theme.MaterialDatePicker` | Custom | Date picker theme |
| `PlanetRomeo.Travel.Explore.SearchView` | Custom | Travel search |

#### 24.6.5 Typography

- Custom text appearances via `textAppearanceLargePopupMenu`, `textAppearanceListItem`, etc.
- `TextInputLayout` with custom styling for registration vs settings contexts
- Tab text styling via `PlanetRomeo.Signup.TabLayout.TabText`

### 24.7 Animation Patterns

#### 24.7.1 Lottie Animations

- **Library:** Airbnb Lottie (`com.airbnb.lottie`)
- **Animation file:** `R.raw.new_footprint_onboarding_animation` -- Onboarding intro animation
- **Usage pattern:**
  ```java
  RememberLottieCompositionKt.r(g.e.a(g.e.b(R.raw.new_footprint_onboarding_animation)), ...)
  AnimateLottieCompositionAsStateKt.c(composition, ...)
  LottieAnimationKt.a(...)
  ```
- Lottie attributes available: `lottie_asyncUpdates`, `lottie_autoPlay`, `lottie_cacheComposition`, `lottie_clipTextToBoundingBox`, `lottie_clipToCompositionBounds`, `lottie_colorFilter`, `lottie_defaultFontFileExtension`, `lottie_enableMergePathsForKitKatAndAbove`, `lottie_fallbackRes`, `lottie_fileName`, `lottie_ignoreDisabledSystemAnimations`, `lottie_imageAssetsFolder`, `lottie_loop`, `lottie_progress`, `lottie_rawRes`, `lottie_renderMode`, `lottie_repeatCount`, `lottie_repeatMode`, `lottie_speed`, `lottie_url`, `lottie_useCompositionFrameRate`
- Lottie network fetching with cache: `lottie_cache_` prefix, `.lottie` file extension support

#### 24.7.2 AnimatedImageDrawable

- `AnimatedImageDrawable` for animated GIF/WebP playback
- Used in profile picture displays

#### 24.7.3 Keyframe Animations

- `BaseKeyframeAnimation` with `transitionPathRotate` for Lottie path animations
- Keyframe-based animation system for complex motion paths

#### 24.7.4 Compose Animations

- `androidx.compose.animation` and `androidx.compose.animation-core` libraries
- Material 3 transitions for bottom sheets and dialogs
- `ModalBottomSheetDialogWrapper` with `Animatable<Float>` for sheet animation

### 24.8 Image Loading Architecture

#### 24.8.1 Glide (Primary - Compose)

- **Compose integration:** `GlideImageKt` (`com.bumptech.glide.integration.compose`)
- **Custom wrapper:** `GlideImageViewKt.f()` -- App-specific Compose image component
- **Parameters:** `pictureDom`, width/height constraints, placeholder/error drawables
- **Placeholder resources:**
  - `R.drawable.too_hot_grid` -- Restricted content placeholder
  - `R.drawable.no_pic_grid` -- No picture placeholder
- **OkHttp integration:** Separate `OkHttpClient` named "glide" for image loading
- **Memory management:** Clears Glide cache on `onLowMemory()`, handles `onTrimMemory()`

#### 24.8.2 Glide (Legacy XML)

- `com.bumptech.glide.integration.okhttp3.OkHttpGlideModule` -- OkHttp transport
- `PicassoProvider` for legacy image loading paths

#### 24.8.3 Image CDN URLs

| Pattern | Purpose |
|---------|---------|
| `https://pradn.net/v12/img/footprints/circular/{token}` | Circular footprint thumbnails |
| `https://pradn.net/v12/img/footprints/rectangular/{token}` | Rectangular footprint images |
| `https://pradn.net/img/usr/original/{token}` | Full resolution user photos |
| `https://pradn.net/img/usr/squarish/{token}` | Square-cropped user photos |
| `https://pradn.net/img/usr/portrait/{token}` | Portrait-cropped user photos |

### 24.9 Responsive Behavior

#### 24.9.1 Display Configurations

- **Grid columns:** Configured via `R.integer.small_grid_num_columns` and `R.integer.big_grid_num_columns`
- **Column types:** `LIST`, `GRID_SMALL`, `GRID_BIG` (from `UserListColumnType`)
- **User preferences:** `PREF_TAB_LIST_MODE_plus` and `PREF_TAB_LIST_MODE_nonplus` for grid/list toggle
- **Footprint grid:** `footprint_gridview_columns` from remote config

#### 24.9.2 Foldable/Tablet Support

```xml
<uses-feature android:name="android.hardware.foldable" android:required="false"/>
<uses-feature android:name="android.hardware.type.tablet" android:required="false"/>
```

- `androidx.window.extensions` and `androidx.window.sidecar` for foldable device support
- `androidx.window` library for window management on large screens

#### 24.9.3 View Type System (27 Types)

The app uses a comprehensive `UserListViewHolderType` enum to handle different screen contexts:

| View Type | ID | Context |
|-----------|-----|---------|
| `VIEW_TYPE_GRID_SMALL` | 10 | Small profile grid |
| `VIEW_TYPE_GRID_BIG` | 11 | Large profile grid |
| `VIEW_TYPE_CONTACT` | 12 | Contact list item |
| `VIEW_TYPE_CONTACT_HEADER` | 13 | Contact section header |
| `VIEW_TYPE_PROMO_CONTAINER` | 14 | Promotional content |
| `VIEW_TYPE_CONTACTS_LANE` | 15 | Contacts discover lane |
| `VIEW_TYPE_DISTANCE_LANE` | 16 | Distance-sorted lane |
| `VIEW_TYPE_PICTURES_I_LIKED` | 17 | Liked pictures lane |
| `VIEW_TYPE_ONLINE_LANE` | 18 | Online users lane |
| `VIEW_TYPE_NEWEST_LANE` | 19 | Newest users lane |
| `VIEW_TYPE_BLOG_CONTAINER` | 20 | Blog content container |
| `VIEW_TYPE_TRAVELLERS_LANE` | 21 | Travelers lane |
| `VIEW_TYPE_POPULAR_LANE` | 22 | Popular profiles lane |
| `VIEW_TYPE_SKELETON_LIST` | 23 | Loading skeleton (list) |
| `VIEW_TYPE_SKELETON_GRID` | 24 | Loading skeleton (grid) |
| `VIEW_TYPE_USER_LIST` | 25 | Generic user list |
| `VIEW_TYPE_EMPTY` | 29 | Empty state |
| `VIEW_TYPE_BLOG_POST` | 30 | Blog post item |
| `VIEW_TYPE_PREVIEW_BANNER` | 31 | Preview banner |
| `VIEW_TYPE_BED_BREAKFAST` | 33 | B&B listing |
| `VIEW_TYPE_SPARTACUS_BLOG` | 34 | Travel blog post |
| `VIEW_TYPE_SPARTACUS_BLOG_CONTAINER` | 35 | Travel blog container |
| `VIEW_TYPE_TRAVEL_UPGRADE_PLUS_BANNER` | 36 | PLUS upgrade banner |
| `VIEW_TYPE_TRAVEL_ARRIVAL_INFO_BANNER` | 37 | Travel arrival info |
| `VIEW_TYPE_PLUS_UNLIMITED_RADAR_BANNER` | 38 | Unlimited radar upsell |

#### 24.9.4 Distance Unit Handling

- `pref_settings_metric_or_imperial` -- 0 = metric, 1 = imperial
- Height displayed in cm or inches based on preference
- Weight displayed in kg or lbs based on preference
- Distance in km or miles based on preference

#### 24.9 5 Dark Mode Support

- `PlanetRomeoTheme.DayNight` -- Automatic dark/light theme switching
- DayNight theme follows system setting
- Separate color resources for light and dark contexts

### 24.10 UX Polish Details

#### 24.10.1 Loading States

- `VIEW_TYPE_SKELETON_LIST` (ID: 23) -- Skeleton loading for list views
- `VIEW_TYPE_SKELETON_GRID` (ID: 24) -- Skeleton loading for grid views
- Pull-to-refresh indicators in Compose and legacy views

#### 24.10.2 Empty States

- `VIEW_TYPE_EMPTY` (ID: 29) -- Empty state placeholder
- Used when no results, no messages, no visitors, etc.

#### 24.10.3 Error Handling

- `ServiceUnavailableActivity` -- Server unavailable with retry
- `UiErrorHandler` class for global UI error handling
- `onRetryClick` callback in FootprintsViewModel
- `onRetryClick` in various ViewModels

#### 24.10.4 PLUS Upsell Touchpoints

- `VIEW_TYPE_PLUS_UNLIMITED_RADAR_BANNER` -- Unlimited radar upsell
- `VIEW_TYPE_TRAVEL_UPGRADE_PLUS_BANNER` -- Travel upgrade upsell
- `BuyPlusDialogDom` -- PLUS purchase dialog
- `AUTH_NOT_ENOUGH_PRIVILEGES` error triggers PLUS prompt
- Feature gates throughout: grid customization, search options, visitor history

#### 24.10.5 Content Rating System

- `RatingPicture` enum controls photo visibility
- `NEUTRAL` (safe) / `EROTIC` / `HARDCORE` / `ILLEGAL` ratings
- `APP_SAFE` for in-app safe content
- `NON_PLUS` restriction for non-subscribers
- "Too hot" placeholder (`R.drawable.too_hot_grid`) for restricted content
- PLUS users see XXX content; free users see blurred/hidden

---

*End of extraction. All data sourced from ReverseAPK output, decompiled Java sources, AndroidManifest.xml, protobuf files, resource strings, and META-INF metadata. Supplemented with comprehensive enum, navigation, Room schema, API, and UX/UI analysis from direct decompiled source inspection. UX/UI analysis covers 42 Activities, 13 Fragments, 30+ Compose components, 7 page flows, 8 interaction patterns, and complete visual design system documentation.*

---

# DESIGN SYSTEM

> Extracted from `colors.xml` + `RomeoTheme` (Material 3 / Jetpack Compose) in romeo-3.42.0.apk-reverseapk
> Framework: Material 3 (Material You) + Jetpack Compose + Custom RomeoTheme

## 1. Primitive Tokens (Raw Values)

### Colors

#### Romeo Design System (ds_* prefix)

| Token | Hex | Usage |
|-------|-----|-------|
| `ds_neutral_black` | `#000000` | Pure black |
| `ds_neutral_grey_0` | `#121212` | Background base |
| `ds_neutral_grey_1` | `#1e1e1e` | Surface low |
| `ds_neutral_grey_2` | `#232323` | Surface |
| `ds_neutral_grey_8` | `#2e2e2e` | Surface elevated |
| `ds_neutral_white` | `#ffffff` | White |
| `ds_primary_base` | `#ff00bdff` | Primary cyan-blue |
| `ds_primary_dark` | `#00a0f0` | Primary dark |
| `ds_primary_darker` | `#007cc8` | Primary darker |
| `ds_error_dark` | `#e83627` | Error dark |
| `ds_error_light` | `#e45346` | Error light |
| `ds_status_online` | `#00d100` | Online indicator |
| `ds_status_date_now` | `#f10087` | Active date indicator |

#### Gradient Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `ds_gradient_accent_1` | `#88d800` | Accent gradient start |
| `ds_gradient_accent_2` | `#549900` | Accent gradient end |
| `ds_gradient_plus_1` | `#fae100` | Plus gradient start (yellow) |
| `ds_gradient_plus_2` | `#f8b600` | Plus gradient end (gold) |

#### Alpha Tokens

| Token | Hex | Usage |
|-------|-----|-------|
| `ds_alpha_disabled` | `#29ffffff` | Disabled state |
| `ds_alpha_fill_hover` | `#14ffffff` | Hover fill |
| `ds_alpha_fill_pressed` | `#14000000` | Pressed fill |
| `ds_alpha_fill_scrim` | `#cc121212` | Scrim overlay |
| `ds_alpha_fill_scrim_dark` | `#99000000` | Dark scrim |
| `ds_alpha_high` | `#deffffff` | High emphasis text |
| `ds_alpha_medium` | `#99ffffff` | Medium emphasis text |
| `ds_alpha_low` | `#61ffffff` | Low emphasis text |

#### Semantic Aliases

| Token | Value | Usage |
|-------|-------|-------|
| `color_accent` | `ds_primary_base` | Accent color |
| `color_background` | `ds_neutral_black` | App background |
| `color_bg0` | `ds_neutral_grey_0` | Top navigation bg |
| `color_bg1` | `ds_neutral_grey_1` | Slider bg |
| `color_bg2` | `ds_neutral_grey_2` | Dialog bg |
| `color_bg8` | `ds_neutral_grey_8` | Elevated bg |

#### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `red` | `#ffd90000` | Error/danger |
| `red_400` | `#ff7474` | Light error |
| `red_500` | `#ff3939` | Medium error |
| `red_600` | `#cc2d2d` | Dark error |
| `red_error_color` | `#ffef6157` | Error text |
| `green_online` | `#ff6ddc00` | Online status |
| `green_quick_share` | `#6ddc00` | QuickShare accent |
| `blue_600` | `#ff00a3e4` | Blue accent |
| `blue_700` | `#ff0075a5` | Blue dark |
| `yellow` | `#fffabe00` | Warning/plus |
| `pink` | `#b30246` | Pink accent |

### Typography

| Property | Value |
|----------|-------|
| Framework | Material 3 Typography |
| Font family | System (Roboto on Android) |
| Text scale | Material 3 default type scale |
| Display | `57sp` / `45sp` / `36sp` |
| Headline | `32sp` / `28sp` / `24sp` |
| Title | `22sp` / `16sp` / `14sp` |
| Body | `16sp` / `14sp` |
| Label | `14sp` / `12sp` |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| xs | `4dp` | Tight spacing |
| sm | `8dp` | Small spacing |
| md | `16dp` | Default spacing |
| lg | `24dp` | Large spacing |
| xl | `32dp` | Extra large |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| none | `0dp` | No radius |
| xs | `4dp` | Tight corners |
| sm | `8dp` | Small corners |
| md | `12dp` | Default corners |
| lg | `16dp` | Large corners |
| xl | `28dp` | Full-round buttons |
| full | `50%` | Circles (avatars) |

### Shadows

| Token | Value | Usage |
|-------|-------|-------|
| elevation-0 | `0dp` | Flat |
| elevation-1 | `1dp` | Subtle cards |
| elevation-2 | `3dp` | Cards |
| elevation-3 | `6dp` | Elevated cards |
| elevation-4 | `8dp` | FABs |
| elevation-5 | `12dp` | Dialogs |

### Border Widths

| Token | Value | Usage |
|-------|-------|-------|
| none | `0dp` | No border |
| thin | `1dp` | Dividers |
| default | `1.5dp` | Outlines |
| thick | `2dp` | Focused inputs |

---

## 2. Semantic Tokens (Contextual Meaning)

### Text

| Token | Value | Usage |
|-------|-------|-------|
| `text_high` | `ds_alpha_high` (#deffffff) | Primary text |
| `text_medium` | `ds_alpha_medium` (#99ffffff) | Secondary text |
| `text_low` | `ds_alpha_low` (#61ffffff) | Disabled/hint text |
| `text_neutral` | `ds_neutral_white` | Default text |
| `text_high_inverse` | `black_87` | Text on light bg |

### Surface

| Token | Value | Usage |
|-------|-------|-------|
| `surface_base` | `ds_neutral_black` | App background |
| `surface-low` | `ds_neutral_grey_0` | Raised surface |
| `surface-default` | `ds_neutral_grey_1` | Card surface |
| `surface-elevated` | `ds_neutral_grey_2` | Elevated surface |
| `surface-highest` | `ds_neutral_grey_8` | Highest elevation |
| `surface_dialog` | `color_bg2` | Dialog background |

### Border

| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `white_10` (#1affffff) | Subtle borders |
| `border-default` | `white_25` (#40ffffff) | Default borders |
| `border-strong` | `white_50` (#80ffffff) | Strong borders |
| `border-accent` | `ds_primary_base` | Active borders |
| `divider` | `color_control_highlight` | List dividers |

### Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `interactive-primary` | `ds_primary_base` | Primary actions |
| `interactive-primary-pressed` | `blue_600` | Pressed state |
| `interactive-danger` | `red` | Destructive actions |
| `interactive-success` | `green_online` | Online/active |
| `interactive-accent` | `ds_primary_base` | Accent actions |

### Status

| Token | Value | Usage |
|-------|-------|-------|
| `status-online` | `#00d100` | Online indicator |
| `status-error` | `ds_error_dark` | Error state |
| `status-success` | `green_quick_share` | Success state |
| `status-date-now` | `#f10087` | Active date |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#00bdff` | Romeo blue |
| `brand-plus-gold` | `#fae100` | PLUS tier gold |
| `brand-plus-dark` | `#f8b600` | PLUS tier dark gold |
| `brand-accent-green` | `#88d800` | Accent green |
| `brand-pink` | `#b30246` | Pink accent |

---

## 3. Component Tokens (Specific Usage)

### Buttons

| Token | Value |
|-------|-------|
| `button-primary-bg` | `ds_primary_base` (#00bdff) |
| `button-primary-text` | `#ffffff` |
| `button-primary-pressed` | `blue_600` (#00a3e4) |
| `button-secondary-bg` | `ds_alpha_fill_hover` |
| `button-secondary-text` | `ds_alpha_high` |
| `button-danger-bg` | `red` (#d90000) |
| `button-danger-text` | `#ffffff` |
| `button-disabled-bg` | `ds_alpha_disabled` |
| `button-disabled-text` | `ds_alpha_low` |

### Cards

| Token | Value |
|-------|-------|
| `card-bg` | `ds_neutral_grey_1` (#1e1e1e) |
| `card-bg-elevated` | `ds_neutral_grey_2` (#232323) |
| `card-radius` | `12dp` |
| `card-elevation` | `2dp` |
| `card-border` | `white_10` |

### Chat

| Token | Value |
|-------|-------|
| `chat-bubble-sent-bg` | `ds_primary_base` (#00bdff) |
| `chat-bubble-sent-text` | `#ffffff` |
| `chat-bubble-received-bg` | `ds_neutral_grey_2` (#232323) |
| `chat-bubble-received-text` | `ds_alpha_high` |
| `chat-input-bg` | `ds_neutral_grey_0` (#121212) |
| `chat-timestamp` | `ds_alpha_medium` |

### Navigation

| Token | Value |
|-------|-------|
| `nav-bg` | `ds_neutral_black` (#000000) |
| `nav-text` | `ds_alpha_medium` |
| `nav-active` | `ds_primary_base` (#00bdff) |
| `nav-indicator` | `ds_primary_base` |
| `bottom-nav-bg` | `color_background` |

### Badges

| Token | Value |
|-------|-------|
| `badge-plus-bg` | `ds_gradient_plus_1` (#fae100) |
| `badge-plus-text` | `#000000` |
| `badge-online-bg` | `ds_status_online` (#00d100) |
| `badge-verified-bg` | `ds_primary_base` |
| `badge-notification-bg` | `red` |

### Snackbars

| Token | Value |
|-------|-------|
| `snackbar-error-bg` | `red` (#d90000) |
| `snackbar-success-bg` | `green_quick_share` (#6ddc00) |
| `snackbar-neutral-bg` | `color_bg2` (#232323) |

---

## 4. Theme Architecture

```
RomeoTheme (Material 3 + Jetpack Compose)
  |-- RomeoTheme.kt wraps MaterialThemeKt
  |-- Color scheme: dark-first (ds_neutral_black base)
  |-- Typography: Material 3 default scale
  |-- Shapes: Material 3 default shapes
  |-- Components: DsPlaygroundActivity for testing
  |
  |-- Surface hierarchy: #000000 -> #121212 -> #1e1e1e -> #232323 -> #2e2e2e
  |-- Primary: #00bdff (cyan-blue)
  |-- Error: #e83627 (dark) / #e45346 (light)
  |-- Online: #00d100
  |-- Plus: #fae100 -> #f8b600 (gold gradient)
  |-- Accent: #88d800 -> #549900 (green gradient)
```

---

# DEVELOPER QUICK START

> "I just opened this doc. How do I start building in 5 minutes?"

## Architecture Overview

Romeo (Planet Romeo) is a native Android app built with Kotlin and Jetpack Compose, using gRPC (via OkHttp) as the primary API protocol alongside Retrofit for REST endpoints. The app uses Dagger 2 (not Hilt) for dependency injection, a hybrid database approach (raw SQLite via `PlanetRomeoDB` for legacy messaging + Room for newer features), and Firebase for analytics, remote config, push notifications, and crash reporting. The UI is a mix of traditional Activities/Fragments and modern Compose screens with Navigation Compose, featuring a bottom navigation bar and Paging 3 for infinite scroll.

## Key Technologies and Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| Language | Kotlin | - |
| UI | Jetpack Compose (Material 3) | - |
| DI | Dagger 2 (Android) | - |
| API (primary) | gRPC-OkHttp | - |
| API (secondary) | Retrofit | - |
| HTTP | OkHttp | - |
| DB (legacy) | Raw SQLite (`PlanetRomeoDB`) | v12 |
| DB (modern) | Room | - |
| Navigation | Navigation Compose | - |
| Paging | Paging 3 + Compose | - |
| Image Loading | Glide (primary), Picasso (legacy) | - |
| Reactive | RxJava 3, Kotlin Flow, Coroutines | - |
| Maps | Google Maps SDK | - |
| Billing | Google Play Billing | 8.0.0 |
| Firebase | Full suite | BOM |

## Where to Start Reading the Code

1. **`PlanetRomeoApplication.java`** -- App initialization, Dagger component setup, 15+ injected dependencies
2. **`ApiException.java`** -- All API error codes and their meanings (critical for understanding auth flow)
3. **`PlanetRomeoDB.java`** -- Legacy SQLite schema (MESSAGES, USERS, PICTURES tables)
4. **`SearchFilter.java`** -- The complete search model (15+ filter fields)
5. **`DisplayStat.java`** -- All profile attributes shown on radar cards (14 stats)
6. **`RemoteConfig.java`** -- Firebase Remote Config keys and defaults (feature flags)
7. **`RadarService.java`** -- Core profile browsing API
8. **`MessageService.java`** -- Chat message API
9. **`FcmListenerService`** -- Push notification handling
10. **`PRAccount.java`** -- User account model

## How to Set Up the Development Environment

```bash
# 1. Requirements
#    - Android Studio (latest stable with Compose support)
#    - JDK 17+
#    - Android SDK 35 (compileSdk = Android 15)
#    - Google Play Services (for Maps)

# 2. Clone the project
git clone <repo-url> romeo-android
cd romeo-android

# 3. Open in Android Studio
#    File -> Open -> select project root

# 4. Configure local.properties
sdk.dir=/path/to/your/Android/sdk

# 5. Add Google Maps API key
#    In local.properties:
#    MAPS_API_KEY=your-google-maps-key

# 6. Build
./gradlew assembleDebug

# 7. Firebase config
#    Place google-services.json in app/
#    (required for analytics, crashlytics, remote config, FCM)
```

## Common Patterns to Follow

1. **Dual database**: Legacy messages live in `PlanetRomeoDB` (raw SQLite). Newer features use Room. The `DataMigrationActivity` handles migration between the two.

2. **gRPC + REST hybrid**: gRPC is the primary API protocol (protocol buffers). Retrofit handles REST endpoints. Both share the same OkHttp transport layer.

3. **Compose screen pattern**: New screens use `*ScreenKt` naming (e.g., `RadarScreenKt`, `FullImageViewScreenKt`). Each has a corresponding ViewModel with `PagingData` flow.

4. **Remote Config gating**: Features are toggled via Firebase Remote Config. Check `RemoteConfig` before showing UI elements. Default values are defined in the `RemoteConfig.java` file.

5. **Push notification events**: All push types are defined in `PushMessage.EVENT_NAME` (MESSAGE, VISIT, FOOTPRINT, NEW_PICTURE_LIKE, QUICKSHAREREQUEST, PLUS_STATUS_CHANGED).

## Key Files to Understand First

| File | What You Learn |
|------|----------------|
| `PlanetRomeoApplication.java` | App init, DI setup, lifecycle tracking |
| `ApiException.java` | All 20+ API error codes |
| `SearchFilter.java` | Complete search model (15 fields) |
| `DisplayStat.java` | Profile card attributes (14 stats) |
| `PlanetRomeoDB.java` | Legacy DB schema (3 tables, 8 indexes) |
| `RemoteConfig.java` | 30+ feature flags with defaults |
| `RadarService.java` | Core browsing API |
| `MessageService.java` | Chat message CRUD |
| `FcmListenerService` | Push notification event types |
| `PRAccount.java` | User account model with settings |

---

# FEATURE BLUEPRINTS

## Feature 1: Radar (Profile Browsing)

**What it does:** The core browsing feature. Displays nearby profiles in a grid or list with customizable stat badges. Supports 120+ search filters (age, height, weight, body type, ethnicity, position, sexual preferences, tags) and infinite scroll via Paging 3.

**API methods used:**
- `GET /profiles` -- Search/browse profiles (via `RadarService`)
- `GET /profiles/{id}/full` -- Full profile view
- `GET /profiles/{id}/linked` -- Linked profiles
- gRPC `SearchRequest` with `SearchFilter` model

**Components that implement it:**
- `RadarScreenKt` -- Compose radar screen
- `RadarMainTabScreenKt` / `RadarMainTabViewModel` -- Tab-based radar
- `SearchViewModel` -- ViewModel with Paging 3 `Pager` + `CachedPagingData`
- `EditRadarSettingsActivity` -- Filter configuration
- `TagCategoryView`, `TagContainer` -- Filter tag UI

**Step-by-step implementation:**
1. Build a `SearchFilter` object with personal, hobby, sexual, and geo filters
2. Set `geoPosition` with latitude, longitude, and radius
3. Set sorting: `"NEARBY_ASC"`, `"LAST_LOGIN_DESC"`, `"SIGNUP_DESC"`, or `"ALPHABETICAL_ASC"`
4. Create a `Pager` with `PagingConfig(pageSize = 30)` and `RadarService` as data source
5. Collect `PagingData` in Compose via `collectAsLazyPagingItems()`
6. Render each profile card with `DisplayStat` badges (customizable for PLUS users, up to 6)
7. Handle pull-to-refresh by invalidating the Paging source

**Common pitfalls:**
- The `pageLength` default is 30. Do not set it higher without server support.
- PLUS users can customize which stats appear on cards (up to 6 from `DisplayStat` enum).
- The `strategy` parameter controls sort algorithm. Default is `"jocks"`.
- Free users get limited results. PLUS unlocks unlimited scrolling and 120+ filters.
- The `SearchFilter.tags` field uses `Set<Tag>` for tag-based filtering. Tags are categorized.

---

## Feature 2: Messaging System

**What it does:** Full messaging with text, image attachments, location sharing, draft messages, read receipts, transmission status tracking, saved phrases, and message syncing. Uses raw SQLite (`PlanetRomeoDB`) for local storage.

**API methods used:**
- `POST /messages` -- Send message
- `PATCH /messages` -- Update message
- `GET /visitors` -- View visitors (related to messaging context)
- gRPC messaging events (`messaging_event.proto`)

**Components that implement it:**
- `MessengerFragment` -- Chat list / inbox
- `MessageRepository` -- Data access layer
- `MessageDataSource` -- Message CRUD operations
- `MessageTemplatesService` -- Saved phrases API

**Database:** Raw SQLite with MESSAGES table:
```sql
CREATE TABLE MESSAGES (
    _id TEXT UNIQUE NOT NULL,
    headline TEXT, text TEXT, date TEXT,
    from_id TEXT, to_id TEXT, other_id TEXT,
    complete INTEGER, unread INTEGER, locked INTEGER,
    spam INTEGER, expires TEXT,
    attachments TEXT,  -- JSON array
    internal_state INTEGER NOT NULL DEFAULT 0
);
```

**Step-by-step implementation:**
1. Load conversations: Query MESSAGES table grouped by `other_id`
2. Send message: `POST /messages` with recipient ID and text
3. Store locally: Insert into MESSAGES with `internal_state = INSERTING`
4. On server confirmation: Update `internal_state` to `NOTHING` (sent)
5. Handle attachments: Store as JSON in `attachments` field (IMAGE, LOCATION, COMMAND types)
6. Track status: `other_id == from_id` = RECEIVED, `internal_state == DRAFT` = DRAFT, `internal_state == INSERTING` = TRANSMITTING
7. Sync on app open: Fetch new messages from server, merge with local

**Common pitfalls:**
- The `internal_state` enum controls message lifecycle: NOTHING(0), INSERTING(1), UPDATING(2), DELETING(3), DRAFT(4).
- Message attachments are JSON arrays of `MessageAttachmentDom` objects (IMAGE, LOCATION, COMMAND types).
- The `expires` field enables self-destructing messages. Check expiration before displaying.
- Draft messages are persisted locally with `internal_state = DRAFT`. They sync when the user sends.
- There are 8 database indexes on the MESSAGES table. Queries must use the right index for performance.

---

## Feature 3: Footprints (Profile Visits)

**What it does:** Track who visited your profile and who you visited. Free users see last 24 hours; PLUS users see last 7 days. Includes push notifications for new visits and the ability to hide your visits.

**API methods used:**
- `GET /visitors` -- Fetch who visited you
- `GET /visits` -- Fetch who you visited
- `POST /visitors` -- Record a visit (leave a footprint)
- gRPC footprint events

**Components that implement it:**
- `FootprintsActivity` / `FootprintsViewModel` -- Visit tracking UI
- `VisitorsViewModel` with `fetchVisitors` -- Visitor list
- `VisitedViewModel` with `fetchVisited` -- Visited list
- Push notification: `PushMessage.EVENT_NAME.FOOTPRINT`

**Step-by-step implementation:**
1. When viewing a profile, record the visit: `POST /visitors` with target profile ID
2. Load your visitors: `GET /visitors` -> paginated list
3. Load your visits: `GET /visits` -> paginated list
4. Display with circular thumbnail images from CDN: `https://pradn.net/v12/img/footprints/circular/{id}`
5. For PLUS: extend time window to 7 days
6. For hide visits: PLUS feature, updates via settings
7. Send push notification when new footprint received

**Common pitfalls:**
- Free users are limited to 24-hour visitor history. PLUS unlocks 7 days.
- Footprint images have two formats: circular (thumbnails) and rectangular (full).
- The CDN base URL is `https://pradn.net` -- all image paths are relative to this.
- The "hide visits" feature is PLUS-only and controlled by `footprint_notification_enabled` preference.
- The `FootprintWrapper` class has a custom Gson adapter registered in `PlanetRomeoApplication.onCreate()`.

---

## Feature 4: QuickShare (Private Photo Albums)

**What it does:** Share private photo albums with specific users for 1 hour. Includes album creation, access requests, grants, revocation, and background photo upload. Free users have daily limits; PLUS users get unlimited sharing.

**API methods used:**
- `POST /pictures/albums/{id}/grants` -- Grant access to album
- `POST /pictures/albums/{id}/requests` -- Request access
- `DELETE /pictures/albums/{id}/requests/{user_id}` -- Revoke access
- `GET /pictures/albums/{id}/grants` -- List grants
- `GET /pictures/albums/{id}/requests` -- List requests
- `DELETE /pictures/albums/shared/grants/{user_id}` -- Revoke shared access
- `POST /pictures` -- Upload photo

**Components that implement it:**
- `AlbumListActivity` -- List all albums
- `DisplayAlbumActivity` -- View album contents
- `AlbumSelectionActivity` -- Select photos for album
- `UploadPictureService` -- Foreground service for background upload
- `PictureService` -- API for picture management

**Step-by-step implementation:**
1. Create album: `POST /pictures` with album metadata
2. Add photos to album via `AlbumSelectionActivity`
3. Share album: `POST /pictures/albums/{albumId}/grants` with target user ID
4. Recipient sees QuickShare request in notifications: `PushMessage.EVENT_NAME.QUICKSHAREREQUEST`
5. Recipient grants: `POST /pictures/albums/{albumId}/grants`
6. Access expires after 1 hour (server-enforced)
7. Revoke: `DELETE /pictures/albums/shared/grants/{userId}`
8. Upload runs as foreground service (`UploadPictureService` with `dataSync` type)

**Common pitfalls:**
- QuickShare access expires after 1 hour automatically. Do not cache shared album access.
- Free users have a daily limit on QuickShare shares. PLUS users get unlimited.
- Photos are uploaded via a foreground service. If the app is killed mid-upload, the upload resumes.
- Album photos have a `PictureDom` model with `id`, `token`, `url_token`, `comment`, `rating`, `width`, `height`.
- The `rating` field controls content visibility (NEUTRAL, EROTIC, HARDCORE). Respect user preferences.

---

## Feature 5: Romeo PLUS (Premium Subscription)

**What it does:** Premium subscription tier that unlocks unlimited Radar results, 120+ search options, grid view customization, invisible mode, saved phrases, unlimited QuickShare, visitor history (7 days), travel visibility, and XXX content.

**API methods used:**
- `GET /memberships` -- Get membership info
- `GET /payment/appstore/google/offers` -- Get available subscription offers
- `POST /payment/appstore/google/purchases` -- Process purchase
- `POST /payment/orders` -- Create payment order

**Components that implement it:**
- `BillingActivity` / `BillingViewModel` -- Subscription management
- `PaymentHistoryActivity` -- Transaction history
- `PaymentOrderActivity` -- Purchase flow
- `BuyPlusDialogDom` -- PLUS upsell dialog
- Push: `PushMessage.EVENT_NAME.PLUS_STATUS_CHANGED`

**Step-by-step implementation:**
1. Check current membership: `GET /memberships`
2. Load offers: `GET /payment/appstore/google/offers`
3. Present paywall with plan options (Free trial, with/without renewal, gift, voucher)
4. On purchase: `POST /payment/appstore/google/purchases` with Google Play purchase token
5. Server validates and activates subscription
6. Handle `PLUS_STATUS_CHANGED` push to update local state
7. Gate features: check `PRAccount.isPlus` before showing premium UI
8. Restore purchases: re-check membership on app start

**Common pitfalls:**
- PLUS has multiple acquisition sources: free trial, compensation, gift, promotion, referral, voucher, with/without renewal. The source affects feature access.
- The `AUTH_NOT_ENOUGH_PRIVILEGES` error code triggers the PLUS upsell dialog.
- Subscription state is synced via push notification (`PLUS_STATUS_CHANGED`). Do not rely solely on local cache.
- The `PREF_TAB_LIST_MODE_plus` and `PREF_TAB_LIST_MODE_nonplus` preferences control grid/list mode per tier.
- Google Play Billing v8.0.0 is used. Test with Play Billing sandbox before production.

---

*Appended: 2026-08-14*
*Developer Quick Start & Feature Blueprints added by ZCode Documentation Writer*

---

# PAGE FLOW DIAGRAMS

## Flow 1: App Launch & Authentication

```
App Launch
    |
    v
PlanetRomeoApplication.onCreate()
    |-- Dagger DI setup (15+ injected dependencies)
    |-- Firebase init
    |-- WorkManager init
    |-- Register broadcast receivers
    |
    v
[Has Account?] --Yes--> LoginActivity
    |                         |
    No                         v
    |                    Email/Password: POST /session
    v                    Facebook: FacebookCredentials
Registration               |
    |-- Step 1: LetsStartFragment (welcome)
    |-- Step 2: ChooseUsernameAndPassFragment
    |-- Step 3: ChooseLocationSignupFragment
    |-- Step 4: CreateProfileFragment
    |-- Step 5: DescribeYourselfFragment
    |-- Step 6: LetsGoDeeperFragment
    |-- Step 7: LifestyleSignupFragment
    |-- Step 8: AddProfilePhotoFragment
    |
    v
HomeActivity
    |-- Bottom navigation
    |-- Radar (main tab)
    |-- Messages
    |-- More menu
```

## Flow 2: Radar (Profile Browsing)

```
RadarScreenKt (Compose)
    |
    v
SearchViewModel --> RadarService
    |-- GET /profiles (SearchFilter params)
    |-- Paging 3 with CachedPagingData
    |
    v
Grid/List Display
    |-- Profile cards with stats (customizable for PLUS)
    |-- Online status indicator
    |-- Distance display
    |-- Tap to view full profile
    |
    v
[Scroll] --> Pager loads next page (infinite scroll)
    |
    v
[Filter] --> EditRadarSettingsActivity
    |-- Personal (age, height, weight, body type)
    |-- Hobby (interests)
    |-- Sexual (position, size, safer sex)
    |-- Fulltext search
    |-- Online status
    |-- Travellers / B&B filter
```

## Flow 3: Messaging

```
MessengerFragment
    |-- MessageRepository (local SQLite + API sync)
    |
    v
PlanetRomeoDB (MESSAGES table)
    |-- _id, text, date, from_id, to_id
    |-- attachments (JSON: COMMAND, IMAGE, LOCATION)
    |-- internal_state (NOTHING, INSERTING, UPDATING, DELETING, DRAFT)
    |
    v
[New message?] --Yes--> FcmListenerService
    |                       |-- PushMessage.EVENT_NAME.MESSAGE
    |                       |-- Update local DB
    |                       v
    |                    Notification
    |
    No
    |
    v
Open conversation
    |-- Load messages from PlanetRomeoDB
    |-- Sync with API: POST /messages (send)
    |-- Sync with API: PATCH /messages (update)
```

## Flow 4: Footprints (Profile Visits)

```
FootprintsActivity
    |-- FootprintsViewModel.fetchFootprints()
    |
    v
FootprintsService (API)
    |-- Free: last 24 hours only
    |-- PLUS: last 7 days
    |
    v
Display Visitors
    |-- Circular thumbnails (pradn.net CDN)
    |-- Tap to view profile
    |-- Clear all visits option
    |
    v
[Visit someone's profile?]
    |-- Leave footprint (optional)
    |-- Tracked by FootprintsService
```

## Flow 5: QuickShare (Private Albums)

```
AlbumListActivity
    |-- List all albums (public, private, secret1/2/3)
    |
    v
[Share album]
    |-- POST /pictures/albums/{id}/grants (grant access)
    |-- Time limit: 1 hour
    |-- Limited per-day for free users
    |
    v
[Request access]
    |-- POST /pictures/albums/{id}/requests
    |-- Owner receives notification
    |-- Grant/revoke via API
    |
    v
UploadPictureService (foreground, dataSync)
    |-- Background photo upload
    |-- Progress notification
```

---

# ERROR HANDLING PATTERNS

## Pattern 1: API Error Codes (ApiException)

```
API Response
    |
    v
ApiException handler
    |-- AUTH_INVALID_CREDENTIALS --> Show "Wrong email/password"
    |-- AUTH_WRONG_API_KEY --> Re-authenticate
    |-- AUTH_NOT_LOGGED_IN --> Redirect to login
    |-- AUTH_NOT_ENOUGH_PRIVILEGES --> Show PLUS upsell
    |-- AUTH_BLOCKED_BY_PROFILE_OWNER --> Show "User blocked you"
    |-- AUTH_PROFILE_UNVERIFIED --> Show verification prompt
    |-- AUTH_PROFILE_DEACTIVATED --> Show deactivated screen
    |-- AUTH_PROFILE_BANNED --> Show banned screen
    |-- TOO_MANY_REQUESTS --> Show "Rate limited" + retry timer
    |-- RESOURCE_NOT_FOUND --> Show "Not found"
```

## Pattern 2: Push Notification Handling

```
FCM Push Received
    |
    v
FcmListenerService
    |-- Parse event type
    |
    v
[Event Type]
    |-- MESSAGE --> Update local DB, show notification
    |-- VISIT --> Update footprints, show notification
    |-- FOOTPRINT --> Update footprints
    |-- NEW_PICTURE_LIKE --> Update picture likes
    |-- QUICKSHAREREQUEST --> Show album request
    |-- QUICKSHAREGRANT --> Grant album access
    |-- PLUS_STATUS_CHANGED --> Update subscription state
    |-- REENGAGEMENT --> Show re-engagement notification
```

## Pattern 3: Data Migration

```
App Update (new DB version)
    |
    v
DataMigrationActivity
    |-- Check PlanetRomeoDB version
    |-- Migrate message attachment format (space-separated -> JSON)
    |-- Migrate profile data
    |-- Schema upgrades (version 1 through 12)
    |
    v
[Migration success?] --Yes--> Continue to app
    |
    No
    v
Show migration error + retry option
```

## Pattern 4: Network Health

```
API Call
    |
    v
NetworkHealth check
    |-- Monitor connection quality
    |-- Retry with exponential backoff
    |-- Circuit breaker for degraded endpoints
    |
    v
[Network available?] --Yes--> Proceed with API call
    |
    No
    v
Queue for later sync
    |-- WorkManager schedules retry
    |-- Background sync on connectivity restore
```

## Pattern 5: Image Upload Error

```
Photo Upload
    |
    v
UploadPictureService (foreground)
    |-- Progress notification
    |
    v
[Upload success?] --Yes--> Update local DB, show in album
    |
    No
    v
[Retryable?] --Yes--> Retry with backoff
    |
    No
    v
Show error notification
    |-- "Upload failed" + retry button
    |-- Queue for background retry
```

---

# PERFORMANCE CONSIDERATIONS

## 1. Dual Database Strategy

- PlanetRomeoDB (raw SQLite) for legacy messaging
- Room database for newer features (paging, modern data layer)
- Multi-instance invalidation for multi-process support
- WAL journal mode for concurrent reads

## 2. Jetpack Compose Rendering

- Material Design 3 components
- Paging 3 with Compose integration
- LazyColumn/LazyRow for virtualized lists
- Shared element transitions via Navigation Compose

## 3. Image Loading

- Glide (primary) with OkHttp integration
- Picasso (secondary) for legacy code
- CDN: pradn.net with format versioning
- Memory cache clearing on low memory
- Separate OkHttp client for Glide

## 4. Background Processing

- WorkManager for scheduled tasks
- UploadPictureService (foreground, dataSync)
- Foreground services for critical operations
- Boot completed receiver for restart

## 5. Analytics & Consent

- Firebase Analytics gated by consent
- AnalyticsConsentDataSource with Kotlin Flow
- Consent state persists across sessions
- OneTrust integration for GDPR

## 6. gRPC Optimization

- gRPC-OkHttp for HTTP/2 transport
- Protocol buffers for efficient serialization
- Connection pooling via OkHttp
- WebSocket for real-time messaging

## 7. Memory Management

- Glide trim callbacks on low memory
- Room lazy loading for large datasets
- Paging 3 for infinite scroll without OOM
- Compose recomposition optimization

## 8. Offline Support

- PlanetRomeoDB caches messages locally
- Draft messages persisted
- WorkManager for background sync
- Bootstrap config cached in preferences
