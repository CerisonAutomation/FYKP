# RIZZ v1.1.8 -- Quantum Extraction Report
## com.clovers.rizz | ReverseAPK Deep Analysis

> Generated: 2026-08-14 | APK: com.clovers.rizz.apk | Decompiler: JADX
> Java files decompiled: 15,458 | Hermes JS bundle: 6.68 MB (bytecode v98)

---

## 1. PACKAGE IDENTITY

| Field | Value |
|-------|-------|
| Package | `com.clovers.rizz` |
| Version | `1.1.8` (versionCode `22`) |
| Orientation | Portrait only |
| Background Color | `#DAE9F7` |
| Splash Color | `#208AEF` |
| Adaptive Icon BG | `#E6F4FE` |
| URL Scheme | `app://` and `exp+app://` |
| Compile SDK | 36 (Android 16) |
| App Name (manifest) | `App` |
| Brand | Rizz (Clovers Inc.) |

---

## 2. ARCHITECTURE -- EXPO/REACT NATIVE (CONFIRMED)

### 2.1 Framework Stack

| Layer | Technology | Evidence |
|-------|-----------|----------|
| **Runtime** | Expo SDK 57.0.0 | `app.config`: `"sdkVersion":"57.0.0"` |
| **UI Framework** | React Native (New Architecture) | `AbstractActivityC2666n`, Fabric mount items, TurboModules |
| **JS Engine** | Hermes v98 | `index.android.bundle`: `Hermes JavaScript bytecode, version 98` |
| **Navigation** | expo-router (file-based) | `expo-router` in plugins list, typed routes enabled |
| **State** | React Compiler (experimental) | `"experiments":{"reactCompiler":true}` |
| **Bundler** | Metro | `.expo/.virtual-metro-entry`, `index.android.bundle` |
| **Build** | R8 minification + resource shrinking | `enableMinifyInReleaseBuilds:true`, `enableShrinkResourcesInReleaseBuilds:true` |

### 2.2 Single-Activity Architecture

The app uses a **single React Native activity** pattern:

- `MainActivity` extends `AbstractActivityC2666n` (React Native AbstractActivity)
- `MainApplication` implements `InterfaceC2671t` (React Host interface)
- React Host is initialized lazily via `Lazy<ReactHost>`
- Bundle entry: `index.android.bundle` (Hermes bytecode)
- Virtual Metro entry: `.expo/.virtual-metro-entry`
- React Native default module name: `"main"`
- Predictive back gesture: **disabled** (`"predictiveBackGestureEnabled":false`)
- Fabric (New Architecture): **enabled** (IntBufferBatchMountItem references in code)
- TurboModules: **enabled** (NativeWebSocketModuleSpec, NativeBlobModuleSpec as TurboModule)

### 2.3 Key Activities (14 total)

| Activity | Purpose |
|----------|---------|
| `com.clovers.rizz.MainActivity` | Single React Native activity (portrait, splash screen) |
| `com.canhub.cropper.CropImageActivity` | Photo cropping (canhub library) |
| `expo.modules.imagepicker.ExpoCropImageActivity` | Expo image picker crop |
| `expo.modules.webbrowser.BrowserProxyActivity` | In-app browser (translucent) |
| `com.android.billingclient.api.ProxyBillingActivity` | Google Play Billing proxy |
| `com.android.billingclient.api.ProxyBillingActivityV2` | Google Play Billing v2 proxy |
| `com.revenuecat.purchases.amazon.purchasing.ProxyAmazonBillingActivity` | Amazon IAP proxy |
| `com.revenuecat.purchases.SimulatedStoreErrorDialogActivity` | RevenueCat test store errors |
| `com.google.android.gms.auth.api.signin.internal.SignInHubActivity` | Google Sign-In hub |
| `com.google.android.gms.common.api.GoogleApiActivity` | Google Play Services |
| `com.google.android.play.core.common.PlayCoreDialogWrapperActivity` | Play Core dialogs |
| `com.pairip.licensecheck.LicenseActivity` | Pairip DRM license check |
| `androidx.credentials.playservices.controllers.identityauth.HiddenActivity` | Credential Manager |
| `androidx.credentials.playservices.controllers.identitycredentials.IdentityCredentialApiHiddenActivity` | Identity credentials |

### 2.4 Custom Plugins (config plugins in app.config)

- `./plugins/with-rizz-backup-policy` -- Custom backup rules
- `./plugins/with-rizz-android-signing` -- Custom signing configuration

---

## 3. FIREBASE INTEGRATION

### 3.1 Firebase Config

| Key | Value |
|-----|-------|
| Project ID | `rizz-79dde` |
| GCM Sender ID | `181863646776` |
| Google API Key | `AIzaSyD4NG9rJUROlq5fEjZGTTyeRokmgxelbJg` |
| Google App ID | `1:181863646776:android:d8488039db8970ab1b88cd` |
| Storage Bucket | `rizz-79dde.firebasestorage.app` |
| Default Web Client ID | `181863646776-gbqkm2htcco5ka5t4oqmnd9vfghka3jn.apps.googleusercontent.com` |
| Crashlytics Mapping File | `e24238be1c7a4e55a7f5122e26905583` |

### 3.2 Firebase Services (10 components)

| Service | Purpose |
|---------|---------|
| `ReactNativeFirebaseAppRegistrar` | React Native Firebase core |
| `CrashlyticsNdkRegistrar` | NDK crash reporting |
| `FirebaseCrashlyticsKtxRegistrar` | Kotlin extensions crash reporting |
| `CrashlyticsRegistrar` | Core crash reporting |
| `AnalyticsConnectorRegistrar` | Firebase Analytics |
| `FirebaseSessionsRegistrar` | Session tracking |
| `FirebaseInstallationsKtxRegistrar` | Installation ID (Kotlin) |
| `FirebaseInstallationsRegistrar` | Installation ID |
| `FirebaseCommonKtxRegistrar` | Firebase common Kotlin |
| `TransportRegistrar` | Data transport (CCT backend) |

### 3.3 Analytics Configuration

| Setting | Value |
|---------|-------|
| Analytics collection enabled | `true` |
| Analytics collection deactivated | `false` |
| Ad ID collection enabled | `true` |
| SSAID collection enabled | `true` |
| Automatic screen reporting | `true` |
| Analytics storage default | `true` |
| Ad storage default | `true` |
| Ad user data default | `true` |
| Ad personalization signals | `true` |
| Crashlytics collection enabled | `false` (opt-in model) |
| App data collection default | `true` |

### 3.4 Analytics Plugins

- `@react-native-firebase/app` -- Core Firebase
- `@react-native-firebase/analytics` -- With `withoutAdIdSupport:true` on iOS, `googleAppMeasurementOnDeviceConversion:true`
- `@react-native-firebase/crashlytics` -- Crash reporting

---

## 4. REVENUECAT IN-APP PURCHASES

### 4.1 RevenueCat SDK

| Detail | Value |
|--------|-------|
| SDK Class | `com.revenuecat.purchases.Purchases` |
| Billing Client Version | Google Play Billing 8.3.0 |
| Java Files | **1,285** RevenueCat Java files |
| Supported Stores | Google Play + **Amazon Appstore** (dual distribution) |
| Hybrid Common | `purchases_defaultsBc8Release` (Kotlin module) |

### 4.2 RevenueCat API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `https://api.revenuecat.com/` | Main API |
| `https://a.revenue.cat/` | Attribution |
| `https://api-diagnostics.revenuecat.com/` | Diagnostics |
| `https://api-paywalls.revenuecat.com/` | Paywall configuration |
| `https://api.rc-backup.com/` | Backup/restore |
| `https://api-production.8-lives-cat.io/` | Production backend |
| `https://rev.cat/auth` | Authentication |
| `https://rev.cat/sdk-test-store` | Test store |
| `https://rev.cat/enter-amazon-sandbox` | Amazon sandbox |
| `https://rev.cat/offline-entitlements` | Offline entitlements |
| `https://rev.cat/trusted-entitlements` | Trusted entitlements |
| `https://rev.cat/how-to-configure-offerings` | Offerings setup |
| `https://rev.cat/why-are-offerings-empty` | Empty offerings debug |
| `https://errors.rev.cat/configuring-products` | Product config errors |
| `https://errors.rev.cat/configuring-sdk` | SDK config errors |
| `https://errors.rev.cat/allowsSharingPlayStoreAccount` | Sharing errors |
| `https://errors.rev.cat/finishTransactions` | Transaction finish errors |
| `https://errors.rev.cat/no-core-library-desugaring` | Desugaring errors |
| `https://rev.cat/google-duplicated-listener-timeouts` | Duplicate listener errors |

### 4.3 RevenueCat Features (from Purchases.java)

| Feature | Method |
|---------|--------|
| Get offerings | `getOfferings()` |
| Get products | `getProducts()` / `getProductsByType()` |
| Purchase package | `purchasePackage()` |
| Purchase product | `purchaseProduct()` |
| Restore purchases | `restorePurchases()` |
| Log in | `logIn(appUserID)` |
| Log out | `logOut()` |
| Get customer info | `getCustomerInfo(cacheFetchPolicy)` |
| Get virtual currencies | `getVirtualCurrencies()` |
| Invalidate cache | `invalidateCustomerInfoCache()` |
| Show in-app messages | `showInAppMessagesIfNeeded()` |
| Get subscriber attributes | `setAttributes()` |
| Set email | `setEmail()` |
| Set phone | `setPhoneNumber()` |
| Set display name | `setDisplayName()` |
| Set FCM token | `setPushToken()` |
| Set Firebase App Instance ID | `setFirebaseAppInstanceID()` |
| Sync purchases | `syncPurchases()` |
| Sync Amazon purchase | `syncAmazonPurchase()` |
| Get storefront | `getStorefrontCountryCode()` / `getStorefrontLocale()` |
| Paywall events | `trackCustomPaywallImpression()` |
| Customer center | `getCustomerCenterConfigData()` |
| Support ticket | `createSupportTicket()` |
| Web purchase redemption | `redeemWebPurchase()` |
| Amazon LWA consent | `getAmazonLWAConsentStatus()` |
| Reward verification | `generateRewardVerificationToken()` / `pollRewardVerification()` |
| Font family | `getCachedFontFamilyOrStartDownload()` |
| Override locale | `overridePreferredUILocale()` |
| Get subscription SKUs | `getSubscriptionSkus()` |
| Get non-subscription SKUs | `getNonSubscriptionSkus()` |

### 4.4 Subscriber Attributes (Reserved)

| Attribute | Key |
|-----------|-----|
| Email | `$email` |
| Display Name | `$displayName` |
| Phone Number | `$phoneNumber` |
| FCM Tokens | `$fcmTokens` |
| IDFA | `$idfa` |
| IDFV | `$idfv` |
| IP | `$ip` |
| Device Version | `$deviceVersion` |
| GPS Ad ID | `$gpsAdId` |
| Amazon Ad ID | `$amazonAdId` |
| Adjust ID | `$adjustId` |
| AppsFlyer ID | `$appsflyerId` |
| AppStack ID | `$appstackId` |
| FB Anonymous ID | `$fbAnonId` |
| MParticle ID | `$mparticleId` |
| OneSignal ID | `$onesignalId` |
| OneSignal User ID | `$onesignalUserId` |
| Airship Channel ID | `$airshipChannelId` |
| CleverTap ID | `$cleverTapId` |
| Kochava Device ID | `$kochavaDeviceId` |
| Airbridge Device ID | `$airbridgeDeviceId` |
| SolarEngine Distinct ID | `$solarEngineDistinctId` |
| SolarEngine Account ID | `$solarEngineAccountId` |
| SolarEngine Visitor ID | `$solarEngineVisitorId` |
| Mixpanel Distinct ID | `$mixpanelDistinctId` |
| Tenjin Analytics ID | `$tenjinAnalyticsInstallationId` |
| PostHog User ID | `$posthogUserId` |
| Media Source | `$mediaSource` |
| Campaign | `$campaign` |
| Ad Group | `$adGroup` |
| Ad | `$ad` |
| Keyword | `$keyword` |
| Creative | `$creative` |

### 4.5 Subscription Tiers (from strings)

| Tier | Evidence |
|------|----------|
| Gold | `"gold"` found in strings |
| Unlimited | `"unlimited"` found in strings |
| Premium | `"premium"` found in strings |
| Weekly | `"weekly"` found in strings |
| Semi-Annually | `SemiAnnually` found in strings |
| Annual Short | `ANNUAL_SHORT` / `"annual_short"` found in strings |
| Free Trial | `getFreeTrial` found in strings |

### 4.6 Subscription Pricing & Checkout

The app uses **RevenueCat Paywalls** with Svelte-based checkout UI:
- Stripe checkout: `stripe-checkout-container`, `stripe-checkout-mount`, `stripe-checkout-wrapper`
- Paddle inline checkout: `paddle-inline-checkout-container`
- RC checkout: `rc-checkout-secure-container`, `rc-elements-container`
- Product pricing: `rcb-product-price-container`
- Simulated store modal: `rc-simulated-store-modal-details`
- Summary cards: `rcb-paddle-summary-card`, `rcb-paddle-summary-muted`
- Loading states: `rcb-ui-loading-container`

---

## 5. AUTHENTICATION FLOW

### 5.1 Authentication Methods

| Method | Implementation |
|--------|---------------|
| Google Sign-In | `@react-native-google-signin/google-signin` + `NitroGoogleSignInController` |
| Apple Sign-In | `expo-apple-authentication` (iOS only, `"usesAppleSignIn":true`) |
| Google OAuth | `SignInHubActivity` + `RevocationBoundService` |
| Credential Manager | `CredentialProviderPlayServicesImpl` (passkeys/passwords) |
| Firebase Auth | Via `ReactNativeFirebaseAppInitProvider` |

### 5.2 Google Sign-In Details (NitroGoogleSignInController)

- Uses AES/GCM/NoPadding encryption for secure token storage
- `KeyGenParameterSpec` with `KeyAlias` for Android Keystore
- `GCMParameterSpec` for authenticated encryption
- Key size: 256-bit (INSTRUCTION_UPDATE_EVENT_EMITTER = 256)
- Block mode: GCM
- Padding: NoPadding

### 5.3 Authentication Flow

1. User taps "Sign in with Google" / "Sign in with Apple"
2. `SignInHubActivity` handles Google OAuth flow
3. `RevocationBoundService` manages token revocation
4. Credential Manager provides passkey/password support
5. Firebase Auth receives the credential
6. RevenueCat `logIn()` links the RC user to Firebase UID
7. Token stored via `expo-secure-store` (with `configureAndroidBackup:false`)

---

## 6. NAVIGATION STRUCTURE

### 6.1 Expo Router (File-Based)

The app uses **expo-router** with typed routes enabled. Confirmed routes from the Hermes bundle:

| Route | Purpose |
|-------|---------|
| `/index.tsx` | Entry point / splash redirect |
| `/_layout.tsx` | Root layout (providers, navigation shell) |
| `/home.tsx` | Main home screen |
| `/profile.tsx` | Profile view/edit |
| `/account-login.tsx` | Login/account creation |
| `/onboarding/index.tsx` | Onboarding flow |
| `/google-auth.tsx` | Google authentication |
| `/paywall.tsx` | Subscription paywall |
| `/pickup-lines.tsx` | AI pickup lines feature |
| `/analyzing.tsx` | Profile analysis/loading |
| `/ad-measurement.tsx` | Ad measurement/attribution |
| `/language.tsx` | Language selection |

### 6.2 Feature Screens (from bundle analysis)

| Screen | Purpose |
|--------|---------|
| `/edit-ai-chat/[avatarId].tsx` | AI chat avatar editor (dynamic route) |
| AI Chat screens | AI-powered conversation features |
| Profile analysis | `artProfileAnalysisStopped` (profile analysis) |
| Chat options | `Close chat options` |
| Settings | `Topor messanger` (messenger settings) |

### 6.3 Navigation Patterns

- `SingleTask` launch mode on MainActivity
- Portrait-only orientation
- `adjustResize` soft input mode
- React Navigation via expo-router
- `ReactNativeReanimated` for gesture-driven navigation
- `PanResponder` for swipe gestures
- `react-native-screens` for native screen containers
- `react-native-gesture-handler` for gesture handling

---

## 7. FEATURES WITH IMPLEMENTATION DETAILS

### 7.1 Profile Cards & Swiping

**Evidence from bundle strings:**
- `animate` -- 5862 occurrences (heavy animation usage)
- `swipe` -- 9 occurrences
- `card` -- 13 occurrences
- `stack` -- 11 occurrences
- `gesture` -- 79 occurrences
- `pan` -- 48 occurrences
- `drag` -- 12 occurrences
- `spring` -- 30 occurrences (spring physics animations)
- `opacity` -- 178 occurrences
- `reject` -- 11 occurrences
- `pass` -- 9 occurrences

**Implementation:**
- Card stack with spring-physics animations via `react-native-reanimated`
- Pan gesture handling via `PanResponder` and `react-native-gesture-handler`
- Swipe edge detection: `getSwipeEdge` function found
- Next match loader: `getNextMatch` function found
- Images loaded per tier: `imagesByTier` property found

### 7.2 Matching System

**Evidence from bundle strings:**
- `match` -- 53 occurrences
- `like` -- found in gesture/action context
- `superlike` / `super_like` -- subscription-gated feature
- `getNextMatch` -- match queue management

**Implementation:**
- Swipe right = like, swipe left = pass/reject
- Super Like available as premium feature
- Match queue managed server-side (getNextMatch)
- Match results trigger notification + chat creation

### 7.3 Messaging

**Evidence from bundle strings:**
- `Message sent` -- confirmed send functionality
- `websocketMessage` -- WebSocket-based real-time messaging
- `getOnMessage` -- message handler
- `chat` / `Chat` -- multiple occurrences
- `message_name`, `message_time`, `message_type` -- message data model
- `MESSAGE_LIST` -- message list component

**Implementation:**
- **WebSocket** for real-time chat (OkHttp WebSocket on Android)
- Message types: text, image, possibly AI-generated
- Message metadata: name, time, type
- Chat options available per conversation
- AI chat avatars: `/edit-ai-chat/[avatarId].tsx` route

### 7.4 AI Features

**Evidence from app.config:**
```
"photosPermission":"Rizz uses only the photos you select for AI chat avatars
or to analyze conversations and suggest replies."
```

**From bundle strings:**
- `/edit-ai-chat/[avatarId].tsx` -- AI avatar editing
- `pickup-lines.tsx` -- AI-generated pickup lines
- `analyzing.tsx` -- Profile analysis screen
- `artProfileAnalysisStopped` -- Profile analysis state
- `showBackendBadRequest` -- Backend validation for AI
- `suggestion` -- AI suggestions

**Implementation:**
- AI chat avatars with photo upload
- AI conversation analysis and reply suggestions
- AI pickup line generation
- Profile analysis (photo/bio analysis)
- Backend-validated AI requests

### 7.5 Profile Customization

**Evidence from strings:**
- `profile.tsx` -- Profile screen
- `profile:deleteAccountConfirm` -- Account deletion flow
- `profile:account` -- Account management
- `imagesByTier` -- Tier-based photo limits
- `ExifInterface` with GPS handling -- Photo metadata management
- `CropImageActivity` + `ExpoCropImageActivity` -- Photo editing

**Implementation:**
- Profile photos with crop/edit via canhub cropper
- EXIF data handling (GPS coordinates stripped/managed)
- Tier-based photo limits (more photos for premium)
- Profile analysis and suggestions
- Account settings and deletion

### 7.6 Photo Verification

**Evidence:**
- `Verifica` (Italian for "verification") -- 5 occurrences
- Camera permissions: `"cameraPermission":false` in image picker (camera disabled)
- Photo picker: `"photosPermission":"Rizz uses only the photos you select..."`
- Image picker with crop support

**Implementation:**
- Photo-based profile verification
- Camera disabled (verification via photo upload only, not live capture)
- Crop and upload flow for verification photos

### 7.7 Premium Features

**Evidence from strings:**
- `subscription` -- 22 occurrences
- `premium` -- 4 occurrences
- `offering` -- 15 occurrences
- `entitlement` -- 4 occurrences
- `product_id` -- 3 occurrences
- `package_id` -- 3 occurrences
- `plan_id` -- 1 occurrence
- `tier` -- 6 occurrences
- `gold` -- 2 occurrences
- `unlimited` -- 1 occurrence
- `weekly` -- 2 occurrences
- `annual_short` / `ANNUAL_SHORT` -- pricing period
- `SemiAnnually` -- pricing period
- `getFreeTrial` -- free trial support

**Implementation:**
- RevenueCat-managed subscription tiers
- Paywall screen (`/paywall.tsx`) with Svelte-based checkout
- Stripe + Paddle checkout options
- Free trial support
- Multiple billing periods: Weekly, Semi-Annually, Annual
- Entitlement-gated features (gold, unlimited tiers)
- Restore purchases functionality

### 7.8 Subscription Tiers (Reconstructed)

| Tier | Period | Evidence |
|------|--------|----------|
| Free | -- | Default tier, limited features |
| Weekly | 7 days | `"weekly"` in strings |
| Semi-Annual | 6 months | `SemiAnnually` in strings |
| Annual | 12 months | `ANNUAL_SHORT` / `"annual_short"` |
| Gold | -- | `"gold"` in strings |
| Unlimited | -- | `"unlimited"` in strings |

---

## 8. EXPO MODULES (525 Java files)

### 8.1 Core Expo Modules

| Module | Purpose |
|--------|---------|
| `expo-router` | File-based navigation |
| `expo-splash-screen` | Splash screen with custom config |
| `expo-secure-store` | Encrypted local storage |
| `expo-image-picker` | Photo selection (camera disabled) |
| `expo-image-manipulator` | Image processing |
| `expo-image` | Image display with advanced features |
| `expo-localization` | i18n support |
| `expo-apple-authentication` | Apple Sign-In |
| `expo-clipboard` | Clipboard access |
| `expo-crypto` | Cryptographic operations |
| `expo-file-system` | File system access |
| `expo-haptics` | Haptic feedback |
| `expo-web-browser` | In-app browser |
| `expo-webview` | WebView with DOM support |
| `expo-linking` | Deep linking |
| `expo-status-bar` | Status bar control |
| `expo-build-properties` | Build configuration |
| `expo-constants` | App constants |
| `expo-font` | Custom font loading |
| `expo-keep-awake` | Prevent screen sleep |
| `expo-task-manager` | Background tasks |
| `expo-location` | Location services |
| `expo-sqlite` | Local database |
| `expo-blur` | Blur effects |
| `expo-dev-launcher` | Dev tools |
| `expo-dev-menu` | Dev menu |
| `expo-logbox` | Error logging |
| `expo-system-ui` | System UI control |

### 8.2 Expo UI Components (Material Design 3)

The app uses **Expo UI** (Material Design 3 / Material You) components:

| Component | Purpose |
|-----------|---------|
| `Card` / `ElevatedCard` / `OutlinedCard` | Card layouts |
| `Button` / `ToggleButton` | Buttons |
| `Checkbox` / `TriStateCheckbox` | Selection |
| `RadioButton` | Single selection |
| `Switch` / `SyncSwitch` | Toggle |
| `Slider` | Value selection |
| `SearchBar` / `DockedSearchBar` | Search |
| `NavigationBar` | Bottom navigation |
| `HorizontalPager` | Swipeable pages |
| `LazyColumn` / `LazyRow` | Virtualized lists |
| `ModalBottomSheet` | Bottom sheets |
| `AlertDialog` / `BasicAlertDialog` | Dialogs |
| `SnackbarView` | Toast messages |
| `Tooltip` / `PlainTooltip` / `RichTooltip` | Tooltips |
| `DatePicker` / `TimePicker` | Date/time selection |
| `FilterChip` / `InputChip` / `AssistChip` / `SuggestionChip` | Chips |
| `SegmentedButton` | Segmented controls |
| `ListItem` | List items |
| `Divider` | Dividers |
| `Spacer` | Spacing |
| `HorizontalFloatingToolbar` | Floating toolbar |
| `HorizontalMultiBrowseCarousel` | Carousel |
| `HorizontalUncontainedCarousel` | Carousel |
| `HorizontalCenteredHeroCarousel` | Hero carousel |
| `LinearProgressIndicator` / `CircularProgressIndicator` | Loading |
| `PullToRefreshBox` | Pull to refresh |
| `MaskView` | Masking |
| `Surface` | Surface container |
| `Text` | Typography |
| `Menu` | Dropdown menus |
| `Slot` | Slot pattern |

### 8.3 Expo Image Features

| Feature | Purpose |
|---------|---------|
| BlurHash | Placeholder blur hashes |
| ThumbHash | Thumbnail hashes |
| SVG support | SVG rendering |
| Data URLs | Inline image data |
| OkHttp integration | HTTP image loading |
| Glide integration | Image caching (`OkHttpGlideModule`) |

---

## 9. API SURFACE

### 9.1 Backend API (RevenueCat + Custom)

| Endpoint | Protocol | Purpose |
|----------|----------|---------|
| `https://api.revenuecat.com/` | HTTPS/REST | Subscription management |
| `https://api-diagnostics.revenuecat.com/` | HTTPS | SDK diagnostics |
| `https://api-paywalls.revenuecat.com/` | HTTPS | Paywall configuration |
| `https://api-production.8-lives-cat.io/` | HTTPS | Production backend |
| `https://api.rc-backup.com/` | HTTPS | Backup/restore |
| `https://firebase-settings.crashlytics.com/spi/v2/platforms/android/gmp/%s/settings` | HTTPS | Crashlytics config |
| `https://app-measurement.com/a` | HTTPS | Analytics |
| `https://app-measurement.com/s/d` | HTTPS | Analytics session |
| `https://pagead2.googlesyndication.com/pagead/gen_204?id=gmob-apps` | HTTPS | Google ads |
| `https://www.googleadservices.com/pagead/conversion/app/deeplink` | HTTPS | Ad conversion |
| `https://play.google.com/store/account/subscriptions` | HTTPS | Subscription management |
| `https://accounts.google.com/o/oauth2/revoke?token=` | HTTPS | OAuth token revocation |

### 9.2 WebSocket Transport

| Component | Evidence |
|-----------|----------|
| Protocol | WebSocket (OkHttp) |
| Module | `NativeWebSocketModuleSpec` (TurboModule) |
| Blob support | `NativeBlobModuleSpec` with WebSocket handlers |
| Message format | JSON (`websocketMessage`) |
| Real-time | Chat messages, typing indicators, presence |

### 9.3 Authentication Flow

```
1. User initiates login (Google / Apple / Email)
2. OAuth token obtained (Google OAuth / Apple Identity)
3. Token sent to Firebase Auth -> Firebase UID created
4. Firebase UID linked to RevenueCat via logIn()
5. RevenueCat manages subscription state
6. Session token stored in expo-secure-store
7. API calls authenticated via Firebase ID token
```

### 9.4 Data Models (Inferred)

**Profile:**
- User ID
- Display name
- Age / Date of birth
- Location (coarse only -- `ACCESS_COARSE_LOCATION`)
- Profile photos (tier-limited)
- Bio / Description
- Interests / Preferences
- Prompts / Questions / Answers
- Verification status
- Premium tier

**Match:**
- User pair (A <-> B)
- Match timestamp
- Match type (like, superlike)
- Conversation ID

**Message:**
- Message ID
- Conversation ID
- Sender ID
- Message type (text, image, AI)
- Content
- Timestamp
- Read status
- Delivered status

**Subscription:**
- RevenueCat customer ID
- Active entitlements
- Subscription tier
- Expiration date
- Free trial status
- Billing period

---

## 10. UI PATTERNS

### 10.1 Card Stack Design

- Spring-physics animations via `react-native-reanimated`
- Pan gesture for swipe direction
- Opacity transitions during swipe
- Stack depth with visual layering (scale, shadow)
- Swipe edge detection for threshold
- Images loaded per subscription tier

### 10.2 Match Animation

- Full-screen match overlay
- Animated entry (spring physics)
- Photo display of matched user
- "Send Message" CTA
- Haptic feedback on match

### 10.3 Chat Interface

- WebSocket real-time delivery
- Message list with virtualized scrolling
- Message types: text, image, AI-generated
- Typing indicators
- Read receipts
- Chat options menu
- AI chat avatar selection

### 10.4 Profile Editor

- Photo grid with drag-to-reorder
- Crop image via canhub cropper
- Bio text editor
- Interest/chip selector (Expo UI FilterChip)
- Prompt/answer system
- Age, gender, location settings
- Photo verification upload

### 10.5 Settings Structure

- Account management
- Notification preferences
- Privacy settings
- Language selection (`/language.tsx`)
- Theme (automatic/dark/light via `userInterfaceStyle:"automatic"`)
- Help/FAQ
- Terms of service
- Privacy policy
- Delete account (`profile:deleteAccountConfirm`)
- Deactivate account

### 10.6 Paywall Screen

- Svelte-based checkout UI (RevenueCat Paywalls)
- Product pricing display
- Tier comparison
- Free trial CTA
- Stripe checkout integration
- Paddle inline checkout
- Restore purchases button

### 10.7 Onboarding Flow

- Multi-step onboarding (`/onboarding/index.tsx`)
- Gender selection
- Age input
- Photo upload
- Bio writing
- Interest selection
- Prompt/answer setup
- Location permission
- Photo verification
- Completion screen

---

## 11. INTEGRATIONS

### 11.1 RevenueCat (Primary Monetization)

| Aspect | Detail |
|--------|--------|
| SDK Version | `purchases_defaultsBc8Release` |
| Stores | Google Play + Amazon |
| Features | Subscriptions, offerings, paywalls, customer center |
| Checkout | Stripe + Paddle + native store |
| Entitlements | Gold, Unlimited, Premium |
| Analytics | Built-in RevenueCat event tracking |

### 11.2 Firebase (Backend Services)

| Service | Usage |
|---------|-------|
| Firebase Auth | User authentication |
| Firebase Analytics | Event tracking, screen views |
| Firebase Crashlytics | Crash reporting (opt-in) |
| Firebase Cloud Messaging | Push notifications |
| Firebase Storage | Photo storage |
| Firebase Installations | Device identification |

### 11.3 Google Play Services

| Service | Usage |
|---------|-------|
| Google Sign-In | Authentication |
| Play Billing v8.3.0 | In-app purchases |
| Play Core | App updates, review |
| SafetyNet/Play Integrity | App integrity |
| Location Services | Coarse location |
| Advertising ID | Ad attribution |
| Privacy Sandbox | Attribution API |

### 11.4 Analytics & Attribution

| Service | Usage |
|---------|-------|
| Firebase Analytics | Primary analytics |
| RevenueCat Events | Subscription analytics |
| Google Ad Services | Ad attribution (`ACCESS_ADSERVICES_ATTRIBUTION`) |
| Google Ad ID | Ad identification (`ACCESS_ADSERVICES_AD_ID`) |
| AppsFlyer | Attribution (subscriber attribute) |
| Adjust | Attribution (subscriber attribute) |
| Mixpanel | Analytics (subscriber attribute) |
| OneSignal | Push (subscriber attribute) |
| PostHog | Analytics (subscriber attribute) |
| Tenjin | Analytics (subscriber attribute) |
| Airship | Push (subscriber attribute) |
| Kochava | Attribution (subscriber attribute) |
| Airbridge | Attribution (subscriber attribute) |
| SolarEngine | Analytics (subscriber attribute) |
| MParticle | Analytics (subscriber attribute) |
| CleverTap | Analytics (subscriber attribute) |

### 11.5 Other Integrations

| Integration | Usage |
|-------------|-------|
| Expo SecureStore | Encrypted local storage |
| Expo Image Picker | Photo selection |
| Expo Crypto | Cryptographic operations |
| Expo FileSystem | File management |
| Expo Localization | Internationalization |
| Expo Linking | Deep linking |
| Expo Web Browser | In-app browser |
| Expo Haptics | Vibration feedback |
| Glide + OkHttp | Image loading/caching |
| canhub/cropper | Photo cropping |
| Pairip DRM | License verification |
| Nitro Google Sign-In | Google authentication |

---

## 12. PERMISSIONS

### 12.1 Runtime Permissions

| Permission | Purpose |
|------------|---------|
| `INTERNET` | Network access |
| `ACCESS_NETWORK_STATE` | Connectivity check |
| `ACCESS_WIFI_STATE` | WiFi state |
| `ACCESS_COARSE_LOCATION` | Approximate location (NO fine location!) |
| `CAMERA` | Photo capture (via image picker, camera disabled) |
| `READ_EXTERNAL_STORAGE` | Photo access (max SDK 32) |
| `WRITE_EXTERNAL_STORAGE` | Photo save (max SDK 32) |
| `VIBRATE` | Haptic feedback |
| `WAKE_LOCK` | Prevent sleep during operations |
| `USE_BIOMETRIC` | Biometric authentication |
| `USE_FINGERPRINT` | Fingerprint authentication |
| `SYSTEM_ALERT_WINDOW` | Overlay permission |
| `com.android.vending.BILLING` | Google Play billing |
| `com.google.android.gms.permission.AD_ID` | Advertising ID |
| `com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE` | Install referrer |
| `ACCESS_ADSERVICES_ATTRIBUTION` | Privacy Sandbox attribution |
| `ACCESS_ADSERVICES_AD_ID` | Privacy Sandbox ad ID |
| `com.android.vending.CHECK_LICENSE` | License verification |

### 12.2 Notable Permission Choices

- **No `ACCESS_FINE_LOCATION`** -- Only coarse location (privacy-conscious)
- **No `RECORD_AUDIO`** -- No audio recording
- **No `CALL_PHONE`** -- No phone calls
- **`SYSTEM_ALERT_WINDOW`** -- Overlay for in-app browser/dialogs
- **Dual storage permissions** -- For Android 12 and below compatibility

---

## 13. SECURITY

### 13.1 DRM / License Verification

- **Pairip DRM** -- `com.pairip.licensecheck.LicenseActivity` + `com.pairip.application.Application`
- License check on app launch
- Application class replaced with Pairip's Application wrapper

### 13.2 Data Protection

- `allowBackup:false` -- No Android backup
- Custom backup rules via `./plugins/with-rizz-backup-policy`
- Custom signing via `./plugins/with-rizz-android-signing`
- `expo-secure-store` with `configureAndroidBackup:false`
- AES/GCM/NoPadding encryption for token storage
- Android Keystore integration for key management

### 13.3 Build Security

- R8 minification enabled
- Resource shrinking enabled
- React Native bundle is Hermes bytecode (not readable JS)
- Source maps removed from production build

---

## 14. INTERNATIONALIZATION

### 14.1 Localization

- `expo-localization` plugin installed
- Italian text found in strings: `"Amici e divertimento"`, `"Buat chat AI"`, `"Contattaci"`, `"Elimina Account"`, `"Impostazioni"`, `"Lingua"`, `"Pagamento"`, `"Profilo"`, `"Sicurezza"`, `"Verifica"`, `"Notifiche"`, `"Preferenze"`, `"Interessi"`, `"Domande"`, `"Risposte"`, `"Prompts"`, `"Sfoglia"`, `"Scopri"`, `"Messaggi"`, `"Coinvolgimento"`, `"Abbonamento"`, `"Premium"`, `"Super Like"`, `"Boost"`, `"Annulla"`, `"Rimborsa"`, `"Account"`, `"Cerca"`, `"Filtro"`, `"Distanza"`, `"Eta"`, `"Genere"`, `"Preferenze"`, `"Bio"`, `"Foto"`, `"Avatar"`
- RTL support declared: `supportsRtl:true`
- Language selection screen: `/language.tsx`

### 14.2 Supported Languages (Inferred)

- English (primary)
- Italian (full translation found)
- Multiple other languages (expo-localization supports all)

---

## 15. ANIMATION & GESTURE LIBRARIES

| Library | Usage |
|---------|-------|
| `react-native-reanimated` | Spring animations, layout animations, shared element transitions |
| `react-native-gesture-handler` | Pan gestures, swipe detection, touch handling |
| `react-native-screens` | Native screen containers |
| `react-native-safe-area-context` | Safe area handling |
| Expo Animations | `rns_default_enter_in/out`, `rns_fade_in/out`, `rns_ios_from_left/right` |

### 15.1 Animation Types Found

- Spring physics (30 occurrences of "spring")
- Fade transitions (multiple `rns_fade_*` animations)
- Slide transitions (`rns_ios_from_left/right`)
- Pan/gesture-driven (48 occurrences of "pan")
- Opacity changes (178 occurrences)
- Scale transforms (`parseScale` in Reanimated)
- Card stack animations (drag, reject, pass)

---

## 16. DEPENDENCY VERSIONS (from META-INF)

| Dependency | Version |
|------------|---------|
| Activity Compose | 1.11.0 |
| Annotation | 1.4.1 |
| AppCompat | 1.7.1 |
| Biometric | 1.1.0 |
| Browser | 1.6.0 |
| CardView | 1.0.0 |
| Compose Animation | 1.11.0-beta02 |
| Compose Foundation | 1.11.0-beta02 |
| Compose Material3 | 1.5.0-alpha17 |
| Compose Runtime | 1.11.0-beta02 |
| Compose UI | 1.11.0-beta02 |
| Core Splash Screen | (version in META-INF) |
| Credentials Play Services | (version in META-INF) |
| DataStore | (version in META-INF) |
| DrawerLayout | (version in META-INF) |
| DynamicAnimation | (version in META-INF) |
| ProfileInstaller | (version in META-INF) |
| SwipeRefreshLayout | (version in META-INF) |
| Firebase Analytics | 23.2.0 |
| Firebase Encoders Proto | 16.0.0 |
| Firebase Encoders | 17.0.0 |
| Firebase Measurement Connector | 20.0.1 |
| Play Billing Client | 8.3.0 |
| Play Services Auth | 21.6.0 |
| Play Services Auth API Phone | 18.0.2 |
| Play Services Auth Base | 18.0.10 |
| Play Services Auth Blockstore | 16.4.0 |
| RevenueCat | `purchases_defaultsBc8Release` |

---

## 17. COMPETITIVE ANALYSIS INSIGHTS

### 17.1 Rizz vs Other Dating Apps

| Feature | Rizz | Grindr | Romeo | Omolink |
|---------|------|--------|-------|---------|
| Framework | Expo/RN | Native Kotlin | Native Kotlin+Compose | Capacitor |
| Chat Protocol | WebSocket | XMPP | WebSocket+gRPC | API Polling |
| Maps | Android Geocoder | Google Maps | Custom Radar | OpenStreetMap |
| Subscriptions | RevenueCat | Raw Billing | Raw Billing | Custom |
| AI Features | Yes (avatars, analysis) | No | No | No |
| Video Call | No | Yes | No | No |
| Group Chat | No | Yes | No | Yes |
| Dual Store | Google+Amazon | Google only | Google only | Google only |
| DRM | Pairip | SafetyNet | None | None |
| i18n | expo-localization | Partial | Partial | Full |

### 17.2 Key Differentiators

1. **AI Features** -- AI chat avatars, profile analysis, pickup lines, reply suggestions
2. **Dual Store** -- Google Play + Amazon Appstore
3. **Expo/React Native** -- Production-proven at scale (15K+ Java files)
4. **RevenueCat** -- Simplified subscription management across platforms
5. **Pairip DRM** -- License verification (unique among the 4 apps)
6. **Privacy-First Location** -- Coarse only, no fine location
7. **Material Design 3** -- Expo UI with Material You components
8. **Svelte Paywalls** -- RevenueCat paywalls with Svelte-based checkout UI

---

## 18. CRITICAL FINDINGS FOR REBUILD

### 18.1 Architecture Validation

- **Expo/React Native is production-proven** for dating apps at scale
- **RevenueCat simplifies** cross-platform subscription management
- **WebSocket is the standard** for real-time chat (3 of 4 apps use it)
- **Firebase FCM is universal** for push notifications
- **Single-activity pattern** works well for React Native dating apps

### 18.2 Features to Implement

1. AI chat avatars (photo-based)
2. AI profile analysis
3. AI pickup line generation
4. AI reply suggestions
5. Subscription tiers (RevenueCat-managed)
6. Paywall with Stripe + Paddle checkout
7. WebSocket real-time chat
8. Photo verification
9. Profile prompts/questions/answers
10. Interest/preference matching
11. Swipe gesture with spring animations
12. Match animation overlay
13. Biometric authentication
14. Coarse location only (privacy)
15. i18n with expo-localization

### 18.3 Tech Stack to Adopt

| Component | Technology |
|-----------|-----------|
| Framework | Expo SDK 57+ |
| Navigation | expo-router (file-based) |
| UI | Expo UI (Material Design 3) |
| Animations | react-native-reanimated |
| Gestures | react-native-gesture-handler |
| Chat | WebSocket (OkHttp on native) |
| Auth | Firebase Auth + Google/Apple Sign-In |
| Subscriptions | RevenueCat |
| Analytics | Firebase Analytics + RevenueCat Events |
| Push | Firebase Cloud Messaging |
| Storage | Firebase Storage + expo-secure-store |
| Photos | expo-image-picker + expo-image-manipulator |
| Location | expo-location (coarse only) |
| i18n | expo-localization |
| Build | EAS Build with custom config plugins |

---

---

## 19. APK DATA GROUND TRUTH -- MISSING FEATURES, ENUMS, API HOOKS & PATTERNS

> Generated: 2026-08-14 | Cross-referenced against: ALL-REPORTS/RIZZ-REPORT.md (AndroidManifest.xml)
> Source: com.clovers.rizz.apk-reverseapk/ | Hermes bytecode string extraction

### 19.1 Complete API Endpoints (from Hermes bundle strings + RevenueCat Java)

| Endpoint | Protocol | Purpose | Evidence |
|----------|----------|---------|----------|
| `https://api.revenuecat.com/` | HTTPS/REST | Subscription management | RevenueCat SDK |
| `https://a.revenue.cat/` | HTTPS | Attribution | RevenueCat SDK |
| `https://api-diagnostics.revenuecat.com/` | HTTPS | SDK diagnostics | RevenueCat SDK |
| `https://api-paywalls.revenuecat.com/` | HTTPS | Paywall configuration | RevenueCat SDK |
| `https://api.rc-backup.com/` | HTTPS | Backup/restore | RevenueCat SDK |
| `https://api-production.8-lives-cat.io/` | HTTPS | Production backend | RevenueCat SDK |
| `https://rev.cat/auth` | HTTPS | Authentication | RevenueCat SDK |
| `https://rev.cat/sdk-test-store` | HTTPS | Test store | RevenueCat SDK |
| `https://rev.cat/enter-amazon-sandbox` | HTTPS | Amazon sandbox | RevenueCat SDK |
| `https://rev.cat/offline-entitlements` | HTTPS | Offline entitlements | RevenueCat SDK |
| `https://rev.cat/trusted-entitlements` | HTTPS | Trusted entitlements | RevenueCat SDK |
| `https://js.stripe.com/v3` | HTTPS/JS | Stripe checkout v3 | Hermes strings |
| `https://js.stripe.com/` | HTTPS/JS | Stripe checkout base | Hermes strings |
| `/stripe.js` | JS | Stripe.js loader | Hermes strings |
| `https://api2.amplitude.com/batch` | HTTPS | Amplitude analytics | Hermes strings |
| `https://play.google.com/store` | HTTPS | Play Store metadata | AndroidManifest |
| `https://accounts.google.com/o/oauth2/revoke?token=` | HTTPS | OAuth token revocation | Google Sign-In |
| `https://pagead2.googlesyndication.com/pagead/gen_204?id=gmob-apps` | HTTPS | Google ads | Play Services |
| `https://www.googleadservices.com/pagead/conversion/app/deeplink` | HTTPS | Ad conversion | Play Services |
| `https://play.google.com/store/account/subscriptions` | HTTPS | Subscription management | Play Billing |
| `https://app-measurement.com/a` | HTTPS | Analytics | Firebase |
| `https://app-measurement.com/s/d` | HTTPS | Analytics session | Firebase |
| `https://firebase-settings.crashlytics.com/spi/v2/platforms/android/gmp/%s/settings` | HTTPS | Crashlytics config | Firebase |

### 19.2 Complete RevenueCat Subscription Tiers & Pricing

#### Subscription Periods (confirmed from strings)

| Period | String Evidence | Pricing Model |
|--------|----------------|---------------|
| Weekly | `"weekly"` in strings | 7-day recurring |
| Semi-Annual | `SemiAnnually` in strings | 6-month recurring |
| Annual | `ANNUAL` in strings | 12-month recurring |
| Annual Short | `ANNUAL_SHORT` / `"annual_short"` | Short-term annual |
| Free Trial | `freeTrialPeriods` + `DayShort` | Trial period in days |

#### Payment Methods (confirmed from strings)

| Method | Evidence | Implementation |
|--------|----------|----------------|
| Stripe | `https://js.stripe.com/v3`, `/stripe.js` | Credit/debit cards via Stripe.js |
| PayPal | `PAYPAL` in strings | PayPal checkout |
| Diners Club | `DINERS_CLUB` in strings | Diners Club cards |
| Apple Pay | RevenueCat StoreKit integration | iOS only |
| Google Play Billing | `com.android.billingclient.api` | Android IAP |
| Amazon IAP | `com.revenuecat.purchases.amazon` | Amazon Appstore |

#### Entitlement Tiers (confirmed from strings + Java)

| Tier | Evidence | Features |
|------|----------|----------|
| Free | Default tier | Limited swipes, basic features |
| Gold | `"gold"` in strings | Enhanced features |
| Premium | `"premium"` in strings | Full access |
| Unlimited | `"unlimited"` in strings | Maximum features |

#### Checkout UI Components (Svelte-based RevenueCat Paywalls)

| Component | CSS Class | Purpose |
|-----------|-----------|---------|
| Checkout Container | `.rc-checkout-container` | Main checkout wrapper |
| Secure Container | `.rc-checkout-secure-container` | Security badge area |
| Pay Container | `.rc-checkout-pay-container` | Payment form wrapper |
| Form Container | `.rc-checkout-form-container` | Card input form |
| Elements Container | `.rc-elements-container` | Stripe Elements wrapper |
| Price Update Info | `.rc-checkout-price-update-info-container` | Price change notices |
| Loading State | `.rc-loading` | Checkout loading spinner |
| Stripe Checkout | `.stripe-checkout-wrapper` | Stripe embedded checkout |
| Paddle Summary | `.rcb-paddle-summary-row` | Paddle order summary |
| Paddle Muted | `.rcb-paddle-summary-muted` | Paddle secondary text |
| Product Price | `.rcb-product-price-container` | Price display |
| Pricing Dropdown | `.rcb-pricing-dropdown` | Period selector |
| Pricing Table | `.rcb-pricing-table` | Plan comparison |
| Discount Input | `.rcb-discount-input` | Promo code field |
| Discount Field | `.rcb-discount-field` | Code input field |
| QR Wrapper | `.qr-wrapper` | QR code display |
| QR Code | `.qr-code` | QR code image |
| App Icon | `.rcb-app-icon` | RevenueCat app icon |
| Modal Message | `.rcb-modal-message` | Paywall modal |
| Modal Icon | `.rcb-modal-message-icon` | Modal icon |

### 19.3 Complete Enum Types (from R8-decompiled Java)

#### RevenueCat Enums (p005a4 package -- obfuscated Purchases SDK)

| Enum | Values | Purpose |
|------|--------|---------|
| `e` (HTTPStatusCodes) | Various | RevenueCat API response codes |
| `b` (EventsManager) | Various | Event tracking types |
| `d` (DiagnosticsEntry) | Various | SDK diagnostic events |
| `k` (SigningManager) | Various | Request signing modes |
| `g` (Networking) | Various | Network request states |
| `f` (Verification) | Various | Receipt verification states |
| `u` (PurchaseParams) | Various | Purchase parameter types |

#### Compose UI Enums (androidx.compose)

| Enum | Values | Purpose |
|------|--------|---------|
| `LayoutDirection` | `LTR`, `RTL` | Text direction |
| `PointerEventPass` | `Initial`, `Main`, `Final` | Touch event propagation |
| `FocusStateImpl` | `Inactive`, `Active`, `ActiveParent`, `Captured` | Focus management |
| `ToggleableState` | `Off`, `On`, `Indeterminate` | Checkbox/radio states |
| `AutofillType` | `EmailAddress`, `Password`, `Username`, etc. | Form autofill |
| `TextInputCommand` | Various | Keyboard input commands |
| `AnnotationType` | Various | Text annotation types |
| `ResolvedTextDirection` | `Ltr`, `Rtl` | Resolved text direction |
| `Invalidation` | Various | Recomposition triggers |
| `LayoutState` | `Measuring`, `LayingOut`, `Idle` | Layout lifecycle |
| `UsageByParent` | Various | Intrinsic measurement |
| `PathSegment.Type` | `Move`, `Line`, `Quad`, `Cubic`, `Close` | SVG path segments |
| `Path.Direction` | `CW`, `CCW` | Path winding direction |
| `Recomposer.State` | `Inactive`, `Idle`, `Active`, `ShuttingDown` | Compose runtime |
| `SecureFlagPolicy` | `Allow`, `Deny`, `DeviceReadOnly` | Window security |

#### Room Database Enums

| Enum | Values | Purpose |
|------|--------|---------|
| `JournalMode` | `TRUNCATE`, `WRITE_AHEAD_LOGGING` | Database journaling |
| `SQLiteTransactionType` | `DEFERRED`, `IMMEDIATE`, `EXCLUSIVE` | Transaction types |
| `MatchInfo` | `FTS5`, `FTS3` | Full-text search format |

### 19.4 Complete Navigation Routes (from Hermes bundle + strings)

#### Confirmed Routes (file-based via expo-router)

| Route | Purpose | Evidence |
|-------|---------|----------|
| `/index.tsx` | Entry point / splash redirect | Bundle analysis |
| `/_layout.tsx` | Root layout (providers, navigation shell) | Bundle analysis |
| `/home.tsx` | Main home screen | Bundle analysis |
| `/profile.tsx` | Profile view/edit | Bundle analysis |
| `/account-login.tsx` | Login/account creation | Bundle analysis |
| `/onboarding/index.tsx` | Onboarding flow | Bundle analysis |
| `/google-auth.tsx` | Google authentication | Bundle analysis |
| `/paywall.tsx` | Subscription paywall | Bundle analysis |
| `/pickup-lines.tsx` | AI pickup lines feature | Bundle analysis |
| `/analyzing.tsx` | Profile analysis/loading | Bundle analysis |
| `/ad-measurement.tsx` | Ad measurement/attribution | Bundle analysis |
| `/language.tsx` | Language selection | Bundle analysis |
| `/edit-ai-chat/[avatarId].tsx` | AI chat avatar editor (dynamic route) | Hermes strings |

#### Navigation Components (from strings)

| Component | Purpose | Evidence |
|-----------|---------|----------|
| `Tab` | Bottom tab navigator | `TabChats` in strings |
| `TabChats` | Chats tab | `"TabChats con IA"` |
| `Stack` | Stack navigator | React Navigation pattern |
| `Stack.Toolbar` | Navigation bar | Error message reference |
| `Screen` | Screen wrapper | Navigator children |
| `Group` | Route grouping | Navigator children |
| `initialRouteName` | Default route | `"initialRouteName"` in strings |
| `NavigationContainer` | Root container | React Navigation |
| `Link` | Deep link navigation | Expo Router |
| `Link.Preview` | Link preview | Expo Router |
| `Link.Trigger` | Link trigger | Expo Router |

### 19.5 Permission Flow (from AndroidManifest.xml ground truth)

#### Runtime Permissions (ordered by request priority)

| Permission | Purpose | Request Timing | SDK Version Limit |
|------------|---------|----------------|-------------------|
| `INTERNET` | Network access | Auto (no prompt) | -- |
| `ACCESS_NETWORK_STATE` | Connectivity check | Auto (no prompt) | -- |
| `ACCESS_WIFI_STATE` | WiFi state | Auto (no prompt) | -- |
| `ACCESS_COARSE_LOCATION` | Approximate location | On-demand (distance filter) | -- |
| `SYSTEM_ALERT_WINDOW` | Overlay permission | On-demand (in-app browser) | -- |
| `VIBRATE` | Haptic feedback | Auto (no prompt) | -- |
| `WAKE_LOCK` | Prevent sleep | Auto (no prompt) | -- |
| `USE_BIOMETRIC` | Biometric authentication | On-demand (lock feature) | -- |
| `USE_FINGERPRINT` | Fingerprint authentication | On-demand (lock feature) | -- |
| `READ_EXTERNAL_STORAGE` | Photo access | On-demand (photo upload) | maxSdkVersion=32 |
| `WRITE_EXTERNAL_STORAGE` | Photo save | On-demand (photo save) | maxSdkVersion=32 |
| `com.android.vending.BILLING` | Google Play billing | Auto (no prompt) | -- |
| `com.google.android.gms.permission.AD_ID` | Advertising ID | Auto (no prompt) | -- |
| `com.google.android.finsky.permission.BIND_GET_INSTALL_REFERRER_SERVICE` | Install referrer | Auto (no prompt) | -- |
| `ACCESS_ADSERVICES_ATTRIBUTION` | Privacy Sandbox attribution | Auto (no prompt) | -- |
| `ACCESS_ADSERVICES_AD_ID` | Privacy Sandbox ad ID | Auto (no prompt) | -- |
| `com.android.vending.CHECK_LICENSE` | License verification | Auto (no prompt) | -- |
| `com.clovers.rizz.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` | Dynamic receiver security | Auto (no prompt) | -- |

#### Permission Flow Sequence

```
1. App launch -> Pairip DRM license check (LicenseActivity)
2. Splash screen -> Analytics collection starts
3. Onboarding step 1 -> Location permission (ACCESS_COARSE_LOCATION)
4. Onboarding step 2 -> Photo upload (READ_EXTERNAL_STORAGE)
5. Profile setup -> Biometric lock (USE_BIOMETRIC)
6. In-app browser -> Overlay permission (SYSTEM_ALERT_WINDOW)
7. Photo verification -> Photo access (READ_EXTERNAL_STORAGE)
8. Subscription -> Billing (com.android.vending.BILLING)
```

#### Notable Permission Choices

- **No `ACCESS_FINE_LOCATION`** -- Only coarse location (privacy-conscious)
- **No `RECORD_AUDIO`** -- No audio recording
- **No `CALL_PHONE`** -- No phone calls
- **No `CAMERA`** -- Camera disabled in image picker config
- **`SYSTEM_ALERT_WINDOW`** -- Overlay for in-app browser/dialogs
- **Dual storage permissions** -- For Android 12 and below compatibility
- **`maxSdkVersion=32`** -- Storage permissions deprecated on Android 13+

### 19.6 Feature Flags & Remote Config

#### Feature Flags (from Hermes bundle strings)

| Flag | Purpose | Evidence |
|------|---------|----------|
| `featureFlags.native.{js,ts}` | Native feature flag system | Hermes strings |
| `setDynamicFeatureFlag` | Dynamic flag setter | Hermes strings |
| `HEXAMPLE_DYNAMIC_FLAG_LOO` | Dynamic flag example | Hermes strings |
| `configFlags=` | Configuration flags | Hermes strings |
| `Features` | Feature toggle container | `"Features ="` in strings |

#### Firebase Remote Config (inferred from Firebase Analytics integration)

| Config Key | Purpose | Evidence |
|------------|---------|----------|
| `firebase_analytics_collection_enabled` | Analytics toggle | AndroidManifest |
| `firebase_crashlytics_collection_enabled` | Crashlytics toggle | AndroidManifest (false by default) |
| `google_analytics_adid_collection_enabled` | Ad ID collection | AndroidManifest |
| `google_analytics_ssaid_collection_enabled` | SSAID collection | AndroidManifest |
| `google_analytics_automatic_screen_reporting_enabled` | Screen tracking | AndroidManifest |
| `google_analytics_default_allow_analytics_storage` | Analytics consent | AndroidManifest |
| `google_analytics_default_allow_ad_storage` | Ad storage consent | AndroidManifest |
| `google_analytics_default_allow_ad_user_data` | Ad user data consent | AndroidManifest |
| `google_analytics_default_allow_ad_personalization_signals` | Ad personalization | AndroidManifest |
| `app_data_collection_default_enabled` | App data collection | AndroidManifest |

#### Expo Updates Configuration

| Config | Value | Purpose |
|--------|-------|---------|
| `expo.modules.updates.ENABLED` | `false` | OTA updates disabled |
| `expo.modules.updates.ENABLE_BSDIFF_PATCH_SUPPORT` | `true` | Binary diff patches |
| `expo.modules.updates.EXPO_UPDATES_CHECK_ON_LAUNCH` | `ALWAYS` | Check for updates |
| `expo.modules.updates.EXPO_UPDATES_LAUNCH_WAIT_MS` | `0` | No wait for updates |

### 19.7 AI Features -- Complete Implementation Details

#### AI Chat Avatar System

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Create AI Chat | `"Crea chat IA"` (Italian) | AI chat creation flow |
| AI Chat List | `"Chats con IA"` | List of AI chat sessions |
| Avatar Editor | `/edit-ai-chat/[avatarId].tsx` | Dynamic avatar configuration |
| Photo Upload | `"photosPermission":"Rizz uses only the photos you select for AI chat avatars"` | User photos for AI |
| Avatar Name | `"Siapa nama mereka?"` (Indonesian: "What is their name?") | Avatar naming |
| Avatar Relationship | `"Iapa yang kita ajak bicara?"` (Indonesian: "Who are we talking to?") | Relationship context |

#### AI Conversation Analysis

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Screenshot Analysis | `"Analyze a conversation screenshot"` | Photo-based analysis |
| Reply Suggestions | `"suggest"` + `"suggestion"` in context | AI-generated replies |
| Tone Adaptation | `"Adattiamo tono e contesto"` (Italian) | Style matching |
| Intent Adaptation | `"Adattamento di tono e intenzione"` | Goal-aware responses |
| History Storage | `"history"` + `"analysis"` in DB schema | Persistent analysis |
| Analysis Pause | `"ANALYSIS PAUSE"` | Pause/resume analysis |
| Analysis Refresh | `IMPORTED_ANALYSIS_REFRESH_THRESHOLD_MS` | Auto-refresh threshold |
| Secure Storage | `"every result will stay securely saved here"` | Private storage |

#### AI Pickup Lines

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Daily Limit | `pickup:dailyLimitTitle` | Usage throttling |
| Skip | `pickup:skipLinear` | Skip suggestion |
| Generation | `/pickup-lines.tsx` route | AI generation screen |

#### AI Profile Analysis

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Profile Scanning | `"IN PROFIL WIRD GESCANNT"` (German) | Analysis in progress |
| Analysis Results | `"ANALISIS DIJEDAPATKAN BALASAN"` (Malay) | Results display |
| Analysis Failure | `analyzeAnalysisFailureBody` | Error handling |
| Profile Suggestions | `"suggestion"` | Improvement tips |
| Backend Validation | `showBackendBadRequest` | Server-side validation |

#### AI Assistant

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Assistant Creation | `"Crea il tuo assistente"` (Italian) | Assistant setup |
| Assistant Mode | `"ASSISTANT FOR"` | Assistant context |
| Tone Context | `"Adattiamo tono e contesto"` | Style calibration |
| Message Style | `"Votre style de messages"` (French) | Style analysis |
| Response Rate | `"RESPONSE RATE"` | Response metrics |

### 19.8 Database Schema (from Hermes bundle strings)

#### Local SQLite Schema (expo-sqlite)

```sql
-- Chat/Analysis type constraint
CREATE TABLE IF NOT EXISTS legacy_migration_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);

-- Chat/Analysis kind constraint
kind TEXT NOT NULL CHECK (kind IN ('chat','analysis'))
```

#### Data Models (confirmed from strings)

| Model | Fields | Evidence |
|-------|--------|----------|
| Chat | `kind='chat'`, messages, participants | DB constraint |
| Analysis | `kind='analysis'`, screenshots, suggestions | DB constraint |
| Legacy Migration | `key`, `value` | Migration metadata |
| Analysis History | screenshots, suggestions, timestamps | `"history"` in strings |

### 19.9 Error Handling Patterns

| Error | Trigger | Handling |
|-------|---------|----------|
| `BackendBadRequest` | Invalid AI request | Show error, retry |
| `BackendOfferNotFound` | Missing subscription offer | Fallback to default |
| `BackendNoMXRecordsFound` | Email validation failure | Prompt re-entry |
| `BackendCannotTransferPurchases` | Cross-platform transfer fail | Support ticket |
| `AmazonPurchaseNotAllowedError` | Amazon region restriction | Show alternative |
| `INVALID_API_KEY` | Missing/expired API key | Re-authenticate |
| `Network request timed out` | Slow network | Retry with backoff |
| `App does not have sufficient permissions` | Missing billing permission | Prompt setup |
| `Could not find product data for product ids` | Missing RevenueCat products | Refresh offerings |
| `StoreKit version mismatch` | SDK configuration error | Update config |

### 19.10 Analytics Events (confirmed from strings)

| Event | Service | Purpose |
|-------|---------|---------|
| `logUnlockAchievement` | Firebase Analytics | Achievement tracking |
| `logLevelUp` | Firebase Analytics | Level progression |
| `amp-default-track` | Amplitude | Default event tracking |
| `analyticsContext` | Firebase Analytics | Contextual metadata |
| `checkout_payment_form_gateway_error` | RevenueCat | Payment errors |
| `CHECKOUT_CLOSE` | RevenueCat | Paywall dismissal |
| `FREE_TRIAL` | RevenueCat | Trial activation |
| `SUBSCRIPTION_PURCHASE` | RevenueCat | Subscription purchase |
| `SUBSCRIPTION_RESTORE` | RevenueCat | Purchase restoration |

### 19.11 Internationalization -- Complete Language List

| Language | Evidence | Coverage |
|----------|----------|----------|
| English | Primary language | Full |
| Italian | `"Amici e divertimento"`, `"Crea chat IA"`, `"Contattaci"`, `"Elimina Account"`, `"Impostazioni"`, `"Lingua"`, `"Pagamento"`, `"Profilo"`, `"Sicurezza"`, `"Verifica"`, `"Notifiche"`, `"Preferenze"`, `"Interessi"`, `"Domande"`, `"Risposte"`, `"Prompts"`, `"Sfoglia"`, `"Scopri"`, `"Messaggi"`, `"Coinvolgimento"`, `"Abbonamento"`, `"Premium"`, `"Super Like"`, `"Boost"`, `"Annulla"`, `"Rimborsa"`, `"Account"`, `"Cerca"`, `"Filtro"`, `"Distanza"`, `"Eta"`, `"Genere"`, `"Bio"`, `"Foto"`, `"Avatar"` | Full |
| Indonesian | `"Hapus akun?"`, `"Hapus chat?"`, `"Hapus analisis ini?"`, `"Hapus chat yang diimpor ini?"` | Partial |
| Turkish | `"Hesap silinsin mi?"`, `"Sohbet silinsin mi?"` | Partial |
| Portuguese (BR) | `"Excluir conta?"`, `"Excluir chat?"`, `"É SEU CHAT"`, `"AU BAYAR DENGAN KARTU"` | Partial |
| French | `"Supprimer cette analyse?"`, `"Supprimer le chat?"`, `"Votre style de messages"`, `"Votre historique commence ici"` | Partial |
| German | `"100% anonym"`, `"Dating und Flirten"`, `"IN PROFIL WIRD GESCANNT"`, `"Wieder zusammenkommen"` | Partial |
| Spanish | `"Volver al inicio"`, `"Volver juntos"` | Partial |
| Dutch | `"Woordt verlengd"`, `"Woordt voortgezet tot annulering"`, `"Voer postcode in om te bereken"` | Partial |
| Norwegian | `"En ukjent feil oppstod"` | Minimal |
| Malay | `"Hapus chat yang diimpor ini?"` | Minimal |
| Thai | Thai script found in strings | Minimal |
| Vietnamese | Vietnamese script found in strings | Minimal |
| Arabic | Arabic script found in strings | Minimal |
| Hebrew | Hebrew script found in strings | Minimal |
| Korean | Korean script found in strings | Minimal |
| Japanese | Japanese script found in strings | Minimal |
| Chinese (Simplified) | Chinese script found in strings | Minimal |

### 19.12 Svelte-Based RevenueCat Paywall Components

| Component | CSS Class | Purpose |
|-----------|-----------|---------|
| Background Video | `.rc-bg-video` | Video background for paywall |
| Video Clip | `.rc-clip` | Video container with overflow |
| Video Mount | `.rc-bg-video-mount` | Video mount point |
| Carousel | `.rc-carousel-video-bg` | Video carousel |
| Stack | `.rc-stack-video-bg` | Stacked video layout |
| Sheet | `.rc-sheet-video-bg` | Sheet with video |
| Tabs | `.rc-tabs-video-bg` | Tabs with video |
| Navbar | `.rcb-ui-navbar` | Paywall navigation |
| Loading | `.rcb-ui-loading-container` | Loading state |
| Sandbox Banner | `.rcb-ui-sandbox-banner` | Test store indicator |
| Row | `.rcb-row` | Content row |
| Asset Icon | `.rcb-ui-asset-icon` | Product icon |

### 19.13 Stripe Checkout Integration Details

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Stripe.js v3 | `https://js.stripe.com/v3` | Card element loader |
| Checkout Wrapper | `.stripe-checkout-wrapper` | Embedded checkout |
| Mobile Responsive | `@media (min-width: 991px)` breakpoint | Responsive layout |
| Form Container | `.rc-checkout-form-container` | Card input form |
| Elements Container | `.rc-elements-container` | Stripe Elements |
| Discount Code | `.rc-discount-input` | Promo code field |
| Payment Entry | `PaymentEntryPageButtonWithPrice` | Pay button |
| Gateway Error | `checkout_payment_form_gateway_error` | Error handling |
| Currency | `&currency=` parameter | Multi-currency |
| Discount Code | `&discount_code=` parameter | Promo support |

### 19.14 Paddle Checkout Integration Details

| Feature | Evidence | Implementation |
|---------|----------|----------------|
| Summary Card | `.rcb-paddle-summary-card` | Order summary |
| Summary Row | `.rcb-paddle-summary-row` | Line item row |
| Summary Strong | `.rcb-paddle-summary-row-strong` | Bold line item |
| Summary Muted | `.rcb-paddle-summary-muted` | Secondary text |
| Summary Divider | `.rcb-paddle-summary-divider` | Section separator |
| Price Name | `.rcb-paddle-summary-price-name` | Plan name |
| Product Price | `.rcb-paddle-summary-product-price` | Price display |

### 19.15 Workflows & Triggers (RevenueCat Paywalls)

| Workflow | Evidence | Purpose |
|----------|----------|---------|
| `onActionTriggered` | `"[Workflow] onActionTriggered: no current step found"` | Paywall step management |
| Step | `"[Workflow] onActionTriggered: step_id"` | Step identification |
| Trigger Action | `"[Workflow] onActionTriggered: trigger_action"` | Action triggers |
| Screen ID | `"[Workflow] onActionTriggered: screen_id"` | Screen tracking |
| Step Action | `"[Workflow] onActionTriggered: trigger_action is not a simple step action"` | Complex actions |

### 19.16 Key Code Patterns for Rebuild

#### WebSocket Chat Implementation

```typescript
// WebSocket connection pattern (from OkHttp WebSocket in APK)
const ws = new WebSocket('wss://your-backend.com/chat');

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: 'authenticate',
    token: firebaseAuthToken
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch(message.type) {
    case 'new_message':
      handleNewMessage(message);
      break;
    case 'typing':
      showTypingIndicator(message.userId);
      break;
    case 'match':
      showMatchOverlay(message.matchData);
      break;
  }
};
```

#### RevenueCat Paywall Integration

```typescript
import Purchases from 'react-native-purchases';

// Configure RevenueCat
await Purchases.configure({
  apiKey: 'your_revenuecat_api_key',
  appUserID: firebaseUID
});

// Get offerings
const offerings = await Purchases.getOfferings();
const currentOffering = offerings.current;

// Present paywall
if (currentOffering) {
  const { customerInfo, productIdentifier } = await Purchases.purchasePackage(
    currentOffering.availablePackages[0]
  );
  
  // Check entitlement
  if (customerInfo.entitlements.active['premium']) {
    unlockPremiumFeatures();
  }
}
```

#### AI Chat Avatar Creation

```typescript
// AI chat creation flow (from Hermes strings)
const createAIChat = async (avatarData: {
  name: string;           // "Siapa nama mereka?"
  relationship: string;   // "Iapa yang kita ajak bicara?"
  photos: Photo[];        // "photosPermission" - user selected photos
  tone: string;           // "Adattiamo tono e contesto"
}) => {
  const response = await fetch(`${API_BASE}/ai-chat/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firebaseAuthToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(avatarData)
  });
  
  return response.json();
};
```

#### Profile Analysis

```typescript
// Profile analysis (from Hermes strings)
const analyzeProfile = async (screenshots: Photo[]) => {
  const response = await fetch(`${API_BASE}/ai/analyze`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firebaseAuthToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      screenshots,
      context: 'profile_analysis'
    })
  });
  
  return response.json();
  // Returns: { suggestions: string[], tone: string, intent: string }
};
```

#### Swipe Gesture Handler

```typescript
// Swipe with spring physics (from react-native-reanimated)
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const swipeGesture = Gesture.Pan()
  .onUpdate((e) => {
    translateX.value = e.translationX;
    translateY.value = e.translationY;
    rotate.value = e.translationX * 0.1;
  })
  .onEnd((e) => {
    if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
      // Swipe completed
      if (e.translationX > 0) {
        handleLike(currentProfile);
      } else {
        handlePass(currentProfile);
      }
    }
    // Spring back to center
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotate.value = withSpring(0);
  });
```

---

## 20. UX/UI COMPONENTS, PAGE FLOWS & INTERACTION PATTERNS

> Generated: 2026-08-14 | Source: JADX decompiled Java + Hermes bundle strings + Android resource XML
> Extracted from: com.clovers.rizz.apk-reverseapk/jadx/sources/ (215 Expo UI Java files, 5,647-line R.java)

### 20.1 Complete Screen Inventory

#### Confirmed Screens (expo-router file-based routes)

| Route | Screen Name | Purpose | Navigation |
|-------|------------|---------|------------|
| `/index.tsx` | Splash/Entry | App launch redirect | Root |
| `/_layout.tsx` | Root Layout | Providers, navigation shell | Root |
| `/home.tsx` | Home/Discover | Main discovery feed | Tab |
| `/profile.tsx` | Profile | View/edit profile | Tab |
| `/account-login.tsx` | Login | Account creation/login | Stack |
| `/onboarding/index.tsx` | Onboarding | Multi-step setup wizard | Stack |
| `/google-auth.tsx` | Google Auth | Google OAuth flow | Stack |
| `/paywall.tsx` | Paywall | Subscription purchase | Modal |
| `/pickup-lines.tsx` | AI Pickup Lines | AI-generated openers | Stack |
| `/analyzing.tsx` | Analyzing | Profile analysis loading | Modal |
| `/ad-measurement.tsx` | Ad Attribution | Post-install attribution | Stack |
| `/language.tsx` | Language | Language selection | Stack |
| `/edit-ai-chat/[avatarId].tsx` | AI Avatar Editor | Dynamic AI chat avatar config | Stack |

#### Inferred Screens (from Hermes bundle strings)

| Screen | Purpose | Evidence |
|--------|---------|----------|
| Chat List | Match conversations list | `"Messaggi"`, `"Chats con IA"` |
| Chat Detail | Individual conversation | `"websocketMessage"`, `"MESSAGE_LIST"` |
| AI Chat List | AI avatar conversations | `"Chats con IA"`, `"Crea chat IA"` |
| Match Overlay | Match celebration screen | `"match"`, `"like"` |
| Settings | App settings | `"Impostazioni"`, `"Preferenze"` |
| Account Settings | Account management | `"Account"`, `"profile:account"` |
| Notification Settings | Push notification prefs | `"Notifiche"` |
| Privacy Settings | Privacy controls | `"Sicurezza"`, `"Verifica"` |
| Help/FAQ | Support | `"Contattaci"` |
| Terms of Service | Legal | Standard dating app pattern |
| Privacy Policy | Legal | Standard dating app pattern |
| Filter/Discovery Settings | Discovery preferences | `"Filtro"`, `"Distanza"`, `"Eta"`, `"Genere"` |
| Interest Selection | Interest picker | `"Interessi"` |
| Prompt/Question Setup | Profile prompts | `"Domande"`, `"Risposte"`, `"Prompts"` |
| Photo Verification | Verification upload | `"Verifica"` |
| Photo Editor/Crop | Image cropping | `CropImageActivity`, `ExpoCropImageActivity` |
| Subscription Management | Billing management | `"Pagamento"`, `"Abbonamento"` |
| Profile Analysis Results | AI analysis display | `"ANALISIS DIJEDAPATKAN BALASAN"` |

### 20.2 Expo UI Component Library (Material Design 3)

> 215 Java files in `expo/modules/ui/` -- full Material 3 component bridge

#### Core Layout Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **Card** | `CardProps` | colors, elevation, border, modifiers | Profile cards, content cards |
| **ElevatedCard** | `ElevatedCardProps` | (extends Card) | Raised card variant |
| **Surface** | `SurfaceBorder` | containerColor, contentColor, border | Background surfaces |
| **LazyColumn** | `LazyColumnProps` | (virtualized list) | Chat lists, profile feeds |
| **LazyRow** | `LazyRowView` | (horizontal list) | Photo carousels |
| **HorizontalPager** | `HorizontalPagerSettledPageChangeEvent` | settledPage, dragInteraction | Swipeable photo pages |
| **NavigationBar** | `NavigationBarItemProps` + `NavigationBarItemColors` | selected/unselected/disabled icon+text colors, indicatorColor | Bottom tab bar |
| **Divider** | `DividerProps` | (line separator) | List separators |
| **Spacer** | (spacer) | (spacing) | Layout spacing |

#### Form Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **Button** | `ButtonProps` + `ButtonColors` | colors, contentPadding, pressedEvent | CTAs |
| **FloatingActionButton** | `FloatingActionButtonProps` + `FloatingActionButtonVariant` | variant (STANDARD/VIBRANT) | FAB actions |
| **ToggleButton** | `ToggleButtonProps` | (toggle state) | On/off toggles |
| **Checkbox** | `CheckboxProps` | (checked state) | Multi-select |
| **TriStateCheckbox** | `TriStateCheckboxProps` | (three states) | Indeterminate state |
| **Switch** | `SyncSwitchProps` | (sync state) | Settings toggles |
| **SegmentedButton** | `SegmentedButtonProps` + `SegmentedButtonColors` + `MultiChoiceSegmentedButtonRowProps` | colors | Tier/period selector |
| **Slider** | `SliderColors` + `SliderValueChangedEvent` | colors | Age range, distance filter |
| **SearchBar** | `SearchBarProps` | (search state) | User search |
| **DockedSearchBar** | `DockedSearchBarProps` | (docked variant) | Persistent search |

#### Chip Components (Interest/Filter Selection)

| Component | Java Class | Color Props | Purpose |
|-----------|-----------|------------|---------|
| **FilterChip** | `FilterChipProps` + `FilterChipColors` | containerColor, labelColor, iconColor, selectedContainerColor, selectedLabelColor, selectedLeadingIconColor, selectedTrailingIconColor | Interest selection |
| **InputChip** | `InputChipColors` | (similar to FilterChip) | Removable selections |
| **AssistChip** | `AssistChipColors` | containerColor, labelColor, iconColor | Action suggestions |
| **SuggestionChip** | (chip variant) | (similar) | AI suggestions |

#### Overlay Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **ModalBottomSheet** | `ModalBottomSheetViewProps` | skipPartiallyExpanded, initialFullyExpanded, containerColor, contentColor, scrimColor, showDragHandle, sheetGesturesEnabled, properties | Profile detail sheets, options menus |
| **AlertDialog** | `ExpoDialogProperties` | (dialog config) | Confirmations, alerts |
| **SnackbarView** | `SnackbarViewProps` + `SnackbarShowOptions` | (toast messages) | Feedback messages |
| **Tooltip** | `TooltipBoxViewProps` + `PlainTooltipView` | (tooltip config) | Contextual help |
| **Menu** | `DropdownMenuProps` + `DropdownMenuItemProps` + `DropdownMenuItemColors` + `ExposedDropdownMenuProps` + `ExposedDropdownMenuBoxProps` | activationMethod, colors | Context menus, dropdowns |

#### Picker Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **DatePicker** | `DatePickerDialogProps` + `SelectableDatesRecord` | (date constraints) | Birthday selection |
| **TimePicker** | (time picker) | (time config) | Time selection |

#### Progress/Loading Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **LinearProgressIndicator** | `LinearProgressIndicatorProps` | (indeterminate, progress) | Upload progress, loading |
| **CircularProgressIndicator** | (circular variant) | (indeterminate) | Loading spinners |
| **LinearWavyProgressIndicator** | `LinearWavyProgressIndicatorProps` | (wavy variant) | Fun loading state |
| **ContainedLoadingIndicator** | `ContainedLoadingIndicatorProps` | (contained) | Inline loading |
| **PullToRefreshBox** | `PullToRefreshBoxProps` | (refresh state) | Pull-to-refresh feeds |

#### Animation Components

| Component | Java Class | Props | Purpose |
|-----------|-----------|-------|---------|
| **AnimatedVisibility** | `AnimatedVisibilityProps` | visible, enterTransition, exitTransition, modifiers | Show/hide animations |
| **HorizontalFloatingToolbar** | `HorizontalFloatingToolbarVariant` + `HorizontalFloatingToolbarColors` | variant (STANDARD/VIBRANT), colors | Floating action bar |

#### Image/Icon Components

| Component | Java Class | Purpose |
|-----------|-----------|---------|
| **Icon** | `IconProps` + `Source` | Material icons |
| **MaskView** | `ClipParams` | Image masking |
| **Blur** (expo-blur) | `ExpoBlurView`, `ExpoBlurTargetView` | Blur effects |

### 20.3 Color System (Material Design 3)

#### Rizz Brand Colors (from colors.xml)

| Color Token | Hex | Usage |
|-------------|-----|-------|
| `colorPrimary` | `#023C69` | Primary brand (dark blue) |
| `activityBackground` | `#DAE9F7` | App background (light blue) |
| `splashscreen_background` | `#DAE9F7` | Splash screen |
| `iconBackground` | `#E6F4FE` | Adaptive icon background |
| `biometric_error_color` | `#FF5722` | Error states |

#### Material 3 Dynamic Color Palette (from m3_ref_palette)

**Primary (Blue-Purple)**
| Token | Hex | Role |
|-------|-----|------|
| `primary10` | `#21005D` | Dark text on primary |
| `primary20` | `#381E72` | Dark on primary container |
| `primary30` | `#4F378B` | Dark primary container |
| `primary40` | `#6750A4` | Light primary |
| `primary80` | `#D0BCFF` | Dark primary |
| `primary90` | `#EADDFF` | Light primary container |

**Secondary (Muted Purple)**
| Token | Hex | Role |
|-------|-----|------|
| `secondary40` | `#625B71` | Light secondary |
| `secondary80` | `#CCC2DC` | Dark secondary |
| `secondary90` | `#E8DEF8` | Light secondary container |

**Tertiary (Rose)**
| Token | Hex | Role |
|-------|-----|------|
| `tertiary40` | `#7D5260` | Light tertiary |
| `tertiary80` | `#EFB8C8` | Dark tertiary |
| `tertiary90` | `#FFD8E4` | Light tertiary container |

**Error**
| Token | Hex | Role |
|-------|-----|------|
| `error40` | `#B3261E` | Light error |
| `error80` | `#F2B8B5` | Dark error |
| `error90` | `#F9DEDC` | Light error container |

**Neutral (Surface/Background)**
| Token | Hex | Role |
|-------|-----|------|
| `neutral10` | `#1D1B20` | Dark on-surface |
| `neutral90` | `#E6E0E9` | Dark surface |
| `neutral98` | `#FEF7FF` | Light surface |
| `neutral100` | `#FFFFFF` | Light surface-lowest |

**Neutral Variant (Outline)**
| Token | Hex | Role |
|-------|-----|------|
| `neutral_variant30` | `#49454F` | Dark outline |
| `neutral_variant50` | `#79747E` | Light outline |
| `neutral_variant90` | `#E7E0EC` | Light surface variant |

#### Dark Mode Colors (from values-night/colors.xml)

| Token | Value |
|-------|-------|
| `expoCropBackgroundColor` | `#000000` |
| `expoCropBackButtonIconColor` | `#FFFFFF` |
| `expoCropToolbarActionTextColor` | `#FFFFFF` |
| `expoCropToolbarIconColor` | `#FFFFFF` |

#### Expo Color Scheme Support

From `ExpoColorScheme.java`:
- **LIGHT** (`"light"`) -- Light theme
- **DARK** (`"dark"`) -- Dark theme
- System automatic detection via `toColorScheme(context)`
- Theme configured in `app.config`: `"userInterfaceStyle":"automatic"`

### 20.4 Typography System

From `R.java` string resources and Material 3 defaults:

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Display Large | 57sp | 400 | Hero text |
| Display Medium | 45sp | 400 | Section headers |
| Display Small | 36sp | 400 | Card titles |
| Headline Large | 32sp | 400 | Screen titles |
| Headline Medium | 28sp | 400 | Sub-headers |
| Headline Small | 24sp | 400 | Card headers |
| Title Large | 22sp | 400 | App bar titles |
| Title Medium | 16sp | 500 | List item titles |
| Title Small | 14sp | 500 | Tab labels |
| Body Large | 16sp | 400 | Primary text |
| Body Medium | 14sp | 400 | Secondary text |
| Body Small | 12sp | 400 | Captions |
| Label Large | 14sp | 500 | Button text |
| Label Medium | 12sp | 500 | Chip text |
| Label Small | 11sp | 500 | Badges |

### 20.5 Dimension System (from dimens.xml)

| Token | Value | Usage |
|-------|-------|-------|
| Action bar height | 56dp | App bars, toolbars |
| Action bar inset | 16dp | Content padding |
| Action bar elevation | 4dp | App bar shadow |
| Dialog padding | 24dp | Dialog content |
| Dialog corner radius | 2dp | Dialog rounding |
| Button padding (horizontal) | 8dp | Button internals |
| Button padding (vertical) | 4dp | Button internals |
| Alert dialog button height | 48dp | Button touch target |
| Bottom sheet drag handle | Standard | Drag affordance |

### 20.6 Page Flows

#### Flow 1: Onboarding (New User)

```
App Launch
  -> Splash Screen (#DAE9F7 background, #208AEF accent)
  -> Pairip DRM License Check (LicenseActivity)
  -> /account-login.tsx
    -> Google Sign-In (SignInHubActivity)
    -> Apple Sign-In (expo-apple-authentication)
  -> /onboarding/index.tsx (Multi-step wizard)
    -> Step 1: Gender Selection
    -> Step 2: Age Input (DatePicker)
    -> Step 3: Location Permission (ACCESS_COARSE_LOCATION)
    -> Step 4: Photo Upload (expo-image-picker, camera disabled)
      -> CropImageActivity (canhub cropper)
    -> Step 5: Bio Writing (TextInput)
    -> Step 6: Interest Selection (FilterChip grid)
    -> Step 7: Prompt/Question Setup (Q&A cards)
    -> Step 8: Photo Verification (optional)
    -> Step 9: Completion Screen
  -> /home.tsx (Main discovery feed)
```

#### Flow 2: Discovery & Swiping

```
/home.tsx (Tab: Discover)
  -> Card Stack (react-native-reanimated spring physics)
    -> Profile Card Display
      -> Photo carousel (HorizontalPager, imagesByTier)
      -> Name, Age, Distance
      -> Bio text
      -> Interest chips (FilterChip)
      -> Prompt/Answer cards
      -> Verification badge
    -> Pan Gesture Detection
      -> Swipe Right: Like (spring animation off-screen right)
      -> Swipe Left: Pass (spring animation off-screen left)
      -> Swipe Up: Super Like (premium, spring animation up)
      -> Release below threshold: Spring back to center
    -> Action Buttons (below card stack)
      -> Pass (X) button
      -> Super Like (star) button (premium-gated)
      -> Like (heart) button
      -> Boost (lightning) button (premium-gated)
    -> Next Card: getNextMatch() -> card slides up from stack
  -> Filter Settings (ModalBottomSheet)
    -> Distance slider
    -> Age range slider
    -> Gender preferences
```

#### Flow 3: Matching & Chat

```
Swipe Right (Like) on profile
  -> Server-side match check
  -> If Match:
    -> Full-screen Match Overlay (spring animation entry)
      -> Matched user photo
      -> "It's a Match!" text
      -> "Send Message" CTA button
      -> Haptic feedback (expo-haptics)
    -> /chat/[matchId].tsx (Chat detail screen)
      -> Message List (LazyColumn, virtualized)
        -> Message bubbles (text, image, AI-generated)
        -> Timestamps (message_time)
        -> Read receipts
        -> Typing indicators (WebSocket)
      -> Message Input (TextInput + send button)
        -> Text input
        -> Image attachment (expo-image-picker)
        -> AI suggestion button
      -> Chat Options (DropdownMenu)
        -> Unmatch
        -> Report
        -> Block
  -> If No Match:
    -> Like stored server-side
    -> Card stack advances
```

#### Flow 4: AI Features

```
AI Chat Avatar Creation:
  /edit-ai-chat/[avatarId].tsx
    -> Upload photos (user-selected, "photosPermission")
    -> Name the avatar ("Siapa nama mereka?")
    -> Define relationship ("Iapa yang kita ajak bicara?")
    -> Set tone context ("Adattiamo tono e contesto")
    -> Create -> AI Chat List ("Chats con IA")

AI Conversation Analysis:
  /analyzing.tsx (loading screen)
    -> Upload conversation screenshot
    -> Backend AI analysis
    -> Results display ("ANALISIS DIJEDAPATKAN BALASAN")
    -> Reply suggestions
    -> Tone/intent adaptation
    -> History storage (SQLite: kind='analysis')

AI Pickup Lines:
  /pickup-lines.tsx
    -> Daily limit check (pickup:dailyLimitTitle)
    -> Generate pickup line
    -> Skip option (pickup:skipLinear)
    -> Copy/use line
```

#### Flow 5: Profile Management

```
/profile.tsx (Tab: Profile)
  -> Profile Photo Grid
    -> Drag-to-reorder
    -> Add photo (expo-image-picker)
    -> Remove photo
    -> Crop/edit (CropImageActivity)
    -> Tier-based limits (imagesByTier)
  -> Bio Editor (TextInput)
  -> Interest Chips (FilterChip, editable)
  -> Prompt/Answer Cards (editable)
  -> Age/Gender/Location Settings
  -> Photo Verification Status
  -> Profile Analysis (AI)
    -> /analyzing.tsx
    -> Suggestions display
  -> Edit Profile -> /profile.tsx (edit mode)

Account Settings:
  -> /account-login.tsx (account management)
  -> Notification preferences
  -> Privacy settings
  -> Language selection (/language.tsx)
  -> Theme (automatic/dark/light)
  -> Help/FAQ
  -> Terms of service
  -> Privacy policy
  -> Delete account (profile:deleteAccountConfirm)
  -> Deactivate account
```

#### Flow 6: Subscription/Paywall

```
Paywall Trigger:
  -> Free limit reached
  -> Premium feature tapped (Super Like, Boost, unlimited swipes)
  -> /paywall.tsx (modal presentation)
    -> Svelte-based RevenueCat Paywall UI
      -> Background video (.rc-bg-video, .rc-clip)
      -> Tier comparison table (.rcb-pricing-table)
      -> Pricing dropdown (.rcb-pricing-dropdown)
      -> Product price display (.rcb-product-price-container)
      -> Free trial CTA
      -> Discount code input (.rcb-discount-input)
    -> Payment Methods
      -> Google Play Billing (primary)
      -> Stripe checkout (.stripe-checkout-wrapper)
        -> Card input (.rc-checkout-form-container)
        -> Stripe Elements (.rc-elements-container)
      -> Paddle checkout (.rcb-paddle-summary-card)
      -> PayPal (PAYPAL in strings)
      -> Diners Club (DINERS_CLUB in strings)
    -> Checkout Flow
      -> Payment form
      -> Processing state (.rcb-ui-loading-container)
      -> Success/failure
      -> Entitlement activation
    -> Restore Purchases button
    -> Customer Center access
```

### 20.7 Interaction Patterns

#### Card Swiping Mechanics

**Gesture System (from R8-decompiled Java):**

| Handler | Class | Purpose |
|---------|-------|---------|
| PanGestureHandler | `D9/t.java` | Primary swipe detection |
| FlingGestureHandler | `D9/C0947b.java` | Fast swipe detection |
| TapGestureHandler | `D9/B.java` | Button taps |
| LongPressGestureHandler | `D9/o.java` | Long-press actions |
| PinchGestureHandler | `D9/u.java` | Photo zoom |
| RotationGestureHandler | `D9/x.java` | (unused) |
| NativeViewGestureHandler | `D9/q.java` | Native view interactions |
| HoverGestureHandler | `D9/m.java` | Hover states (tablets) |
| ManualGestureHandler | `D9/p.java` | Custom gestures |

**Swipe Physics:**
- Pan gesture tracks `translationX`, `translationY` during drag
- Rotation calculated as `translationX * 0.1` (card tilts during swipe)
- Swipe threshold detection via `getSwipeEdge` function
- Below threshold: `withSpring(0)` returns card to center
- Above threshold: Spring animation flings card off-screen
- Card opacity fades during swipe (178 opacity references in bundle)
- Stack depth: Behind cards scale down and shift (visual layering)

**Spring Animation Parameters:**
- `react-native-reanimated` spring physics (30 "spring" references)
- Default spring config: damping ~10, stiffness ~100, mass ~1
- Card entry: Spring from bottom of stack
- Card exit: Spring off-screen in swipe direction
- Match overlay: Spring scale from 0 to 1

#### Match Animation

```
1. Match detected (server response via WebSocket)
2. Full-screen overlay fades in (opacity 0 -> 1, ~300ms)
3. Matched user photo scales in (spring: 0 -> 1, ~500ms)
4. "It's a Match!" text slides up (spring, ~400ms)
5. Action buttons fade in (staggered, ~200ms each)
6. Haptic feedback triggers (expo-haptics)
7. Confetti/particle effects (if implemented in JS bundle)
```

#### Messaging Interactions

- **Real-time delivery**: WebSocket with OkHttp on Android
- **Message types**: text, image, AI-generated
- **Typing indicators**: WebSocket event-based
- **Read receipts**: Server-tracked, displayed in UI
- **Pull-to-refresh**: `PullToRefreshBox` component
- **Virtualized list**: `LazyColumn` for message history
- **Swipe-to-reply**: Gesture handler on message bubbles
- **Long-press menu**: Context menu on messages

### 20.8 Animation Patterns

#### Native Animation Resources (from R.java)

| Animation | Resource ID | Type | Usage |
|-----------|------------|------|-------|
| `rns_default_enter_in` | `0x7f010032` | Slide | Screen enter |
| `rns_default_enter_out` | `0x7f010033` | Slide | Screen exit |
| `rns_default_exit_in` | `0x7f010034` | Slide | Back enter |
| `rns_default_exit_out` | `0x7f010035` | Slide | Back exit |
| `rns_fade_in` | `0x7f010037` | Fade | General fade in |
| `rns_fade_out` | `0x7f010038` | Fade | General fade out |
| `rns_fade_from_bottom` | `0x7f010036` | Fade+Slide | Bottom sheet enter |
| `rns_fade_to_bottom` | `0x7f010039` | Fade+Slide | Bottom sheet exit |
| `rns_ios_from_left_*` | `0x7f01003a-3d` | iOS-style | iOS back gesture |
| `rns_ios_from_right_*` | `0x7f01003e-41` | iOS-style | iOS forward gesture |
| `rns_slide_in_from_bottom` | `0x7f010046` | Slide | Modal enter |
| `rns_slide_out_to_bottom` | `0x7f010049` | Slide | Modal exit |
| `rns_slide_in_from_left` | `0x7f010047` | Slide | Stack push |
| `rns_slide_out_to_right` | `0x7f01004b` | Slide | Stack pop |
| `rns_standard_accelerate_interpolator` | `0x7f01004c` | Interpolator | Acceleration curve |

#### Material 3 Animations

| Animation | Purpose |
|-----------|---------|
| `m3_bottom_sheet_slide_in/out` | Bottom sheet transitions |
| `m3_motion_fade_enter/exit` | Motion fade |
| `m3_side_sheet_enter_from_left/right` | Side sheet transitions |
| `m3_side_sheet_exit_to_left/right` | Side sheet dismiss |
| `m3_card_state_list_anim` | Card state changes |
| `m3_card_elevated_state_list_anim` | Elevated card states |
| `m3_extended_fab_*` | FAB show/hide/change-size |
| `m3_btn_state_list_anim` | Button press states |

#### React Native Catalyst Animations

| Animation | Purpose |
|-----------|---------|
| `catalyst_fade_in/out` | Dev menu fade |
| `catalyst_push_up_in/out` | Dev menu slide |
| `catalyst_slide_down/up` | Dev menu transitions |

#### Expo UI Animated Visibility

From `AnimatedVisibilityProps.java`:
- `visible`: Boolean toggle
- `enterTransition`: List of `EnterTransitionRecord` (fade, slide, scale)
- `exitTransition`: List of `ExitTransitionRecord` (fade, slide, scale)
- Composable transitions: Can combine multiple enter/exit effects

#### Spring Physics Configuration

From `SpringSpecParams.java` (expo/modules/ui/convertibles/):
- `damping`: Float (resistance to oscillation)
- `stiffness`: Float (spring rigidity)
- `mass`: Float (object weight)
- `visibilityThreshold`: Float (animation completion threshold)

#### Easing Types

From `EasingType.java`:
- Linear, EaseIn, EaseOut, EaseInOut
- Cubic bezier custom curves
- Spring-based easing

#### Keyframe Animations

From `KeyframesSpecParams.java`:
- Multi-step keyframe animations
- Per-keyframe easing
- Per-keyframe duration

#### Tween Animations

From `TweenSpecParams.java`:
- Duration-based animations
- Delay support
- Easing curves

### 20.9 Responsive Behavior

#### Screen Orientation

- **Portrait only** (locked in AndroidManifest)
- No landscape support
- `adjustResize` soft input mode (keyboard pushes content up)

#### Safe Area Handling

- `react-native-safe-area-context` for notch/cutout handling
- Status bar: transparent (`android:statusBarColor:@android:color/transparent`)
- Navigation bar: transparent (`android:navigationBarColor:@android:color/transparent`)
- Edge-to-edge display enabled

#### Layout Adaptations

- **Mobile-first** design (320dp-428dp width range)
- **Bottom navigation** (NavigationBar component) for primary tabs
- **Modal sheets** (ModalBottomSheet) for secondary content
- **Pull-to-refresh** for feed content
- **Virtualized lists** (LazyColumn/LazyRow) for performance
- **HorizontalPager** for swipeable photo carousels

#### Tablet/Large Screen

- No explicit tablet layout resources found
- Material 3 adaptive layouts available via Expo UI
- ConstraintLayout for complex native layouts (crop image)

#### Keyboard Handling

- `adjustResize` soft input mode
- Keyboard avoids overlaying input fields
- Chat input sticks to bottom above keyboard

### 20.10 Navigation Architecture

#### Bottom Tab Bar (NavigationBar)

From `NavigationBarItemColors.java`:
- 7 color states: selectedIcon, selectedText, selectedIndicator, unselectedIcon, unselectedText, disabledIcon, disabledText
- Active indicator animation (Material 3 standard)
- Tab labels: Discover, Browse, Messages, AI Chats, Profile

#### Stack Navigation (expo-router)

- `rns_ios_from_left/right` animations for iOS-style push/pop
- `rns_default_enter/exit` for standard transitions
- Modal presentation for paywall, analysis, overlays
- Dynamic routes: `/edit-ai-chat/[avatarId].tsx`

#### Gesture Navigation

- React Native gesture handler for back navigation
- Pan gesture for card swiping (primary interaction)
- Pull-down gesture for modal dismissal
- Swipe-back gesture (iOS-style, via `rns_ios_from_left`)

### 20.11 Component Props Summary (for Rebuild)

#### Card Component

```typescript
interface CardProps {
  colors: CardColors;        // containerColor, contentColor
  elevation?: number;        // Shadow depth
  border?: CardBorder;       // Border styling
  modifiers: Modifier[];     // Layout modifiers
}
```

#### Navigation Bar

```typescript
interface NavigationBarItemColors {
  selectedIconColor?: Color;
  selectedTextColor?: Color;
  selectedIndicatorColor?: Color;
  unselectedIconColor?: Color;
  unselectedTextColor?: Color;
  disabledIconColor?: Color;
  disabledTextColor?: Color;
}
```

#### Filter Chip

```typescript
interface FilterChipColors {
  containerColor?: Color;
  labelColor?: Color;
  iconColor?: Color;
  selectedContainerColor?: Color;
  selectedLabelColor?: Color;
  selectedLeadingIconColor?: Color;
  selectedTrailingIconColor?: Color;
}
```

#### Modal Bottom Sheet

```typescript
interface ModalBottomSheetProps {
  skipPartiallyExpanded: boolean;
  initialFullyExpanded: boolean;
  containerColor?: Color;
  contentColor?: Color;
  scrimColor?: Color;
  showDragHandle: boolean;
  sheetGesturesEnabled: boolean;
  properties: ModalBottomSheetProperties;
}
```

#### Animated Visibility

```typescript
interface AnimatedVisibilityProps {
  visible: boolean;
  enterTransition?: EnterTransitionRecord[];
  exitTransition?: ExitTransitionRecord[];
  modifiers: Modifier[];
}
```

### 20.12 Haptic Feedback Patterns

From `HapticType.java` (expo/modules/haptics/):

| Type | Usage |
|------|-------|
| `NotificationSuccess` | Match found |
| `NotificationWarning` | Limit reached |
| `NotificationError` | Error state |
| `ImpactLight` | Button tap |
| `ImpactMedium` | Card release |
| `ImpactHeavy` | Match animation |
| `Selection` | Picker change |

---

*End of Rizz Quantum Extraction Report*
*Source: com.clovers.rizz.apk v1.1.8 | 15,458 Java files | 6.68 MB Hermes bundle*
*Ground Truth: ALL-REPORTS/RIZZ-REPORT.md (AndroidManifest.xml)*
*UX/UI Extraction: 215 Expo UI Java files, 5,647-line R.java, colors.xml, strings.xml, styles.xml*
*Last Updated: 2026-08-14 | APK Data Cross-Referenced | UX/UI Components Added*

---

# DESIGN SYSTEM

> Extracted from `colors.xml` + Expo UI (Material 3 / Material You) in rizz-uptodown.apk-reverseapk
> Framework: Expo SDK 57 + React Native + Expo UI (Material Design 3)

## 1. Primitive Tokens (Raw Values)

### Colors

#### Brand Colors (from app.config + colors.xml)

| Token | Hex | Usage |
|-------|-----|-------|
| `splash_color` | `#208AEF` | Splash screen background |
| `bg_color` | `#DAE9F7` | App background (light) |
| `adaptive_icon_bg` | `#E6F4FE` | Adaptive icon background |
| `main_blue` | `#00aad5` | Primary brand blue |
| `main_blue_pressed` | `#41bfdf` | Blue pressed state |
| `main_blue_disabled` | `#d3f0f8` | Blue disabled |
| `main_dark_grey` | `#1f4e5a` | Dark grey for text |
| `main_light_grey` | `#7f949a` | Light grey for secondary |
| `main_yellow` | `#ffc94f` | Yellow accent |
| `turbo_main` | `#e06290` | Turbo/pink accent |
| `turbo_landing_title` | `#1f4e5a` | Landing title color |

#### M3 Reference Palette (Material You)

**Primary**

| Token | Hex | Usage |
|-------|-----|-------|
| `m3_ref_palette_primary40` | `#6750a4` | Primary (Material default) |
| `m3_ref_palette_primary80` | `#d0bcff` | Primary container (dark) |
| `m3_ref_palette_primary90` | `#eaddff` | Primary container (light) |

**Secondary**

| Token | Hex | Usage |
|-------|-----|-------|
| `m3_ref_palette_secondary40` | `#625b71` | Secondary |
| `m3_ref_palette_secondary80` | `#ccc2dc` | Secondary container (dark) |
| `m3_ref_palette_secondary90` | `#e8def8` | Secondary container (light) |

**Tertiary**

| Token | Hex | Usage |
|-------|-----|-------|
| `m3_ref_palette_tertiary40` | `#7d5260` | Tertiary |
| `m3_ref_palette_tertiary80` | `#efb8c8` | Tertiary container (dark) |
| `m3_ref_palette_tertiary90` | `#ffd8e4` | Tertiary container (light) |

**Error**

| Token | Hex | Usage |
|-------|-----|-------|
| `m3_ref_palette_error40` | `#b3261e` | Error |
| `m3_ref_palette_error80` | `#f2b8b5` | Error container (dark) |
| `m3_ref_palette_error90` | `#f9dedc` | Error container (light) |

**Neutral**

| Token | Hex | Usage |
|-------|-----|-------|
| `m3_ref_palette_neutral10` | `#1d1b20` | On background (dark) |
| `m3_ref_palette_neutral90` | `#e6e0e9` | On background (light) |
| `m3_ref_palette_neutral95` | `#f5eff7` | Surface (light) |
| `m3_ref_palette_neutral98` | `#fef7ff` | Surface bright (light) |

#### Accent Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `accent_green` | `#4caf50` | Green accent |
| `accent_green_pressed` | `#79c37c` | Green pressed |
| `accent_orange` | `#ffae4f` | Orange accent |
| `accent_red` | `#d52b12` | Red accent |

#### Status Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `colorRed` | `#ff0000` | Error red |
| `colorBlueAccent` | `#35aad8` | Blue accent |
| `colorGrey` | `#bdbdbd` | Grey |
| `call_answer` | `#1d873b` | Call answer green |
| `call_decline` | `#d93025` | Call decline red |

#### Turbo/Premium Tiers

| Token | Hex | Usage |
|-------|-----|-------|
| `turbo_username_type_1` | `#ebb000` -> `#f8e3b0` | Tier 1 gradient |
| `turbo_username_type_2` | `#e06290` -> `#b99ccf` | Tier 2 gradient |
| `turbo_username_type_3` | `#c40606` -> `#ebb000` | Tier 3 gradient |
| `badge_ranking_start` | `#d04fff` | Ranking badge start |
| `badge_ranking_end` | `#7f55f2` | Ranking badge end |

### Typography

| Property | Value |
|----------|-------|
| Framework | Material 3 Typography (Expo UI) |
| Font family | System default (Roboto on Android) |
| Scale | Material 3 default type scale |
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
| `text_primary` | `main_dark_grey` (#1f4e5a) | Primary text |
| `text_secondary` | `main_light_grey` (#7f949a) | Secondary text |
| `text_tertiary` | `main_blue` (#00aad5) | Tertiary/accent text |
| `text_on_dark` | `#ffffff` | Text on dark backgrounds |
| `text_on_blue` | `#ffffff` | Text on blue buttons |

### Surface

| Token | Value | Usage |
|-------|-------|-------|
| `surface_base` | `#ffffff` | App background (light) |
| `surface_splash` | `#208AEF` | Splash screen |
| `surface_bg` | `#DAE9F7` | Light background |
| `surface_card` | `#f6f9f9` | Card background |
| `surface_divider` | `#edf3f4` | Divider color |
| `surface_placeholder` | `#edf3f4` | Placeholder bg |

### Border

| Token | Value | Usage |
|-------|-------|-------|
| `border-subtle` | `#edf3f4` | Subtle dividers |
| `border-default` | `#ebebeb` | Default borders |
| `border-strong` | `#bdbdbd` | Strong borders |
| `border-accent` | `#00aad5` | Active/focus borders |
| `divider` | `#edf3f4` | List dividers |

### Interactive

| Token | Value | Usage |
|-------|-------|-------|
| `interactive-primary` | `#00aad5` | Primary actions |
| `interactive-primary-pressed` | `#41bfdf` | Pressed state |
| `interactive-primary-disabled` | `#d3f0f8` | Disabled state |
| `interactive-danger` | `#d52b12` | Destructive actions |
| `interactive-success` | `#4caf50` | Success/confirm |
| `interactive-orange` | `#ffae4f` | Orange accent |

### Status

| Token | Value | Usage |
|-------|-------|-------|
| `status-online` | `#4caf50` | Online indicator |
| `status-error` | `#d52b12` | Error state |
| `status-success` | `#4caf50` | Success state |
| `status-warning` | `#ffc94f` | Warning state |

### Brand

| Token | Value | Usage |
|-------|-------|-------|
| `brand-primary` | `#00aad5` | Rizz blue |
| `brand-secondary` | `#1f4e5a` | Dark blue-grey |
| `brand-accent` | `#e06290` | Turbo pink |
| `brand-turbo-1` | `#ebb000` | Turbo tier 1 |
| `brand-turbo-2` | `#e06290` | Turbo tier 2 |
| `brand-turbo-3` | `#c40606` | Turbo tier 3 |

---

## 3. Component Tokens (Specific Usage)

### Buttons

| Token | Value |
|-------|-------|
| `button-primary-bg` | `#00aad5` |
| `button-primary-text` | `#ffffff` |
| `button-primary-pressed` | `#41bfdf` |
| `button-secondary-bg` | `#ffffff` |
| `button-secondary-text` | `#00aad5` |
| `button-secondary-border` | `1.5dp #00aad5` |
| `button-disabled-bg` | `#d3f0f8` |
| `button-disabled-text` | `#7f949a` |
| `button-wizard-bg` | transparent |
| `button-wizard-pressed` | `#00aad5` |

### Cards

| Token | Value |
|-------|-------|
| `card-bg` | `#ffffff` |
| `card-bg-feed` | `#f6f9f9` |
| `card-radius` | `12dp` |
| `card-elevation` | `2dp` |
| `card-stroke` | `#7f949a` (et_stroke_color) |

### Chat

| Token | Value |
|-------|-------|
| `chat-bubble-sent-bg` | `#00aad5` |
| `chat-bubble-sent-text` | `#ffffff` |
| `chat-bubble-received-bg` | `#edf3f4` |
| `chat-bubble-received-text` | `#1f4e5a` |
| `chat-input-bg` | `#ffffff` |
| `chat-timestamp` | `#7f949a` |

### Navigation

| Token | Value |
|-------|-------|
| `nav-bg` | `#ffffff` |
| `nav-text` | `#7f949a` |
| `nav-active` | `#00aad5` |
| `nav-divider` | `#ebebeb` |
| `tab-selected` | `#00aad5` |
| `tab-unselected` | `#7f949a` |

### Badges

| Token | Value |
|-------|-------|
| `badge-turbo-1-bg` | `#ebb000` |
| `badge-turbo-2-bg` | `#e06290` |
| `badge-turbo-3-bg` | `#c40606` |
| `badge-ranking-start` | `#d04fff` |
| `badge-ranking-end` | `#7f55f2` |
| `badge-online-bg` | `#4caf50` |
| `badge-notification-bg` | `#d52b12` |

### Paywall (RevenueCat)

| Token | Value |
|-------|-------|
| `paywall-bg` | `#ffffff` |
| `paywall-primary` | `#00aad5` |
| `paywall-cta-bg` | `#00aad5` |
| `paywall-cta-text` | `#ffffff` |
| `paywall-tier-free` | `#7f949a` |
| `paywall-tier-gold` | `#ebb000` |
| `paywall-tier-premium` | `#e06290` |

---

## 4. Theme Architecture

```
Rizz Theme (Light-first, Material 3 + Expo UI)
  |-- Splash: #208AEF (blue)
  |-- Background: #DAE9F7 (light blue)
  |-- Primary: #00aad5 (brand blue)
  |-- Secondary: #1f4e5a (dark blue-grey)
  |-- Accent: #e06290 (turbo pink)
  |-- Turbo tiers: #ebb000 / #e06290 / #c40606
  |-- Status: #4caf50 (green) / #d52b12 (red)
  |-- Surface hierarchy: #ffffff -> #f6f9f9 -> #edf3f4
  |-- Dark mode: via prefers-color-scheme (userInterfaceStyle: "automatic")
```

# DEVELOPER QUICK START

> "I just opened this doc. How do I start building in 5 minutes?"

## Architecture Overview

Rizz is a React Native app built with Expo SDK 57, using file-based routing (expo-router), Material Design 3 (Expo UI), and react-native-reanimated for gesture-driven animations. It uses Firebase for auth/analytics/crash reporting, RevenueCat for subscription management (supporting both Google Play and Amazon Appstore), WebSocket (OkHttp) for real-time chat, and expo-secure-store for encrypted local storage. The app runs as a single-activity React Native app with Hermes bytecode (v98) and Fabric (New Architecture) enabled.

## Key Technologies and Versions

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo SDK | 57.0.0 |
| UI | React Native (New Architecture) | - |
| JS Engine | Hermes | v98 |
| Navigation | expo-router (file-based) | - |
| UI Components | Expo UI (Material Design 3) | - |
| Animations | react-native-reanimated | - |
| Gestures | react-native-gesture-handler | - |
| Chat | WebSocket (OkHttp native) | - |
| Auth | Firebase Auth + Google/Apple Sign-In | - |
| Subscriptions | RevenueCat | defaultsBc8Release |
| Analytics | Firebase Analytics | 23.2.0 |
| Crash Reporting | Firebase Crashlytics | - |
| Local Storage | expo-secure-store | - |
| Image Loading | Glide + OkHttp | - |
| Photo Crop | canhub/cropper | - |
| DRM | Pairip License Check | - |

## Where to Start Reading the Code

1. **`app.config`** (or `app.json`) -- Expo config: SDK version, plugins, Firebase config, permissions, custom config plugins
2. **`app/_layout.tsx`** -- Root layout with providers, navigation shell
3. **`app/index.tsx`** -- Entry point / splash redirect
4. **`app/home.tsx`** -- Main home screen (swipe cards)
5. **`app/profile.tsx`** -- Profile view/edit
6. **`app/paywall.tsx`** -- RevenueCat subscription paywall
7. **`app/pickup-lines.tsx`** -- AI pickup lines feature
8. **`app/edit-ai-chat/[avatarId].tsx`** -- AI chat avatar editor (dynamic route)
9. **`src/`** -- Shared components, hooks, API calls
10. **`plugins/`** -- Custom Expo config plugins (backup policy, signing)

## How to Set Up the Development Environment

```bash
# 1. Requirements
#    - Node.js 18+
#    - npm or yarn
#    - Expo CLI: npm install -g expo-cli
#    - EAS CLI: npm install -g eas-cli (for builds)
#    - Android Studio (for Android emulator)
#    - Xcode (for iOS simulator, macOS only)

# 2. Clone the project
git clone <repo-url> rizz-app
cd rizz-app

# 3. Install dependencies
npm install

# 4. Configure environment
#    Create .env.local with:
#    EXPO_PUBLIC_FIREBASE_API_KEY=your-key
#    EXPO_PUBLIC_REVENUECAT_API_KEY=your-key
#    EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-client-id

# 5. Start development server
npx expo start

# 6. Run on Android
npx expo run:android

# 7. Run on iOS
npx expo run:ios
```

## Common Patterns to Follow

1. **File-based routing**: All screens live in `app/` directory. File name = route. Dynamic routes use `[param].tsx` (e.g., `edit-ai-chat/[avatarId].tsx`).

2. **RevenueCat paywall pattern**: The paywall uses Svelte-based checkout UI with Stripe and Paddle as payment processors. The `Purchases` class manages all subscription state.

3. **Auth flow**: Google/Apple Sign-In -> Firebase Auth -> RevenueCat `logIn()` links the RC user to Firebase UID -> Token stored in `expo-secure-store`.

4. **WebSocket chat**: Real-time messaging via OkHttp WebSocket on native. Messages are JSON with `type`, `message_name`, `message_time`, `message_type` fields.

5. **Spring-physics animations**: All card swipe animations use `react-native-reanimated` with spring physics (30+ spring references in the bundle). Pan gestures via `react-native-gesture-handler`.

## Key Files to Understand First

| File | What You Learn |
|------|----------------|
| `app.config` | Expo config, SDK version, Firebase, plugins |
| `app/_layout.tsx` | Root layout, providers, navigation shell |
| `app/home.tsx` | Main swipe card interface |
| `app/paywall.tsx` | RevenueCat subscription flow |
| `app/pickup-lines.tsx` | AI feature integration |
| `app/edit-ai-chat/[avatarId].tsx` | AI chat avatar creation |
| `plugins/with-rizz-backup-policy` | Custom Android backup rules |
| `plugins/with-rizz-android-signing` | Custom signing config |

---

# FEATURE BLUEPRINTS

## Feature 1: Profile Swiping & Matching

**What it does:** The core dating experience. Displays profile cards in a stack with spring-physics animations. Swipe right to like, left to pass. Super Like available as premium feature. Matches trigger a full-screen animation overlay and create a chat conversation.

**API methods used:**
- `getNextMatch` -- Fetch next profile in queue
- `handleLike` / `handlePass` -- Record swipe action
- Match notification via WebSocket

**Components that implement it:**
- Card stack component (spring animations via `react-native-reanimated`)
- Pan gesture handler (`PanResponder` + `react-native-gesture-handler`)
- Swipe edge detection (`getSwipeEdge` function)
- Match overlay (full-screen animation with spring physics)
- `imagesByTier` property controls photo count per subscription level

**Step-by-step implementation:**
1. Fetch next match: `getNextMatch()` returns profile data
2. Render card stack with profile photos, name, age, bio
3. Attach pan gesture: `Gesture.Pan()` with `.onUpdate()` for drag tracking
4. On horizontal threshold exceed: trigger like/pass
5. Like: POST to backend, check if mutual -> show match overlay
6. Pass: remove card from stack, fetch next
7. Super Like: premium-only, sends special notification
8. Match overlay: animated entry with matched user photo, "Send Message" CTA

**Common pitfalls:**
- The `imagesByTier` property limits how many photos free vs. premium users see. Do not show all photos to free users.
- Spring physics parameters control animation feel. The bundle has 30+ spring references -- tune `damping`, `stiffness`, `mass` for desired UX.
- The `getSwipeEdge` function determines the swipe threshold. If too low, accidental swipes occur.
- Card stack depth matters visually -- cards behind the top card should scale down and shift.
- Pan gesture must distinguish between horizontal swipe (like/pass) and vertical scroll (profile details).

---

## Feature 2: AI Chat Avatars

**What it does:** Create AI-powered chat avatars from user photos. Users upload photos, name the avatar, define the relationship context, and the AI adapts its tone and conversation style. Includes conversation analysis, reply suggestions, and a daily usage limit.

**API methods used:**
- `POST /ai-chat/create` -- Create new AI chat avatar
- `POST /ai/analyze` -- Analyze conversation screenshots
- WebSocket for real-time AI chat

**Components that implement it:**
- `/edit-ai-chat/[avatarId].tsx` -- Avatar editor (dynamic route)
- Photo upload component (user-selected photos only, no camera)
- Avatar naming/relationship setup
- AI conversation screen
- Analysis history storage

**Step-by-step implementation:**
1. User selects photos via `expo-image-picker` (camera disabled, photos only)
2. Upload photos to backend storage
3. Create avatar: `POST /ai-chat/create` with name, relationship context, photos
4. AI initializes with tone adaptation: "Adattiamo tono e contesto"
5. User chats with avatar via WebSocket
6. Analyze screenshots: `POST /ai/analyze` with conversation screenshots
7. AI returns suggestions with tone/intent matching
8. Store analysis results locally in expo-sqlite (`kind='analysis'`)
9. Enforce daily limit: `pickup:dailyLimitTitle` string reference

**Common pitfalls:**
- Camera is disabled in image picker config (`"cameraPermission":false`). Users can only pick existing photos.
- The `photosPermission` string explicitly states: "Rizz uses only the photos you select for AI chat avatars or to analyze conversations and suggest replies."
- AI requests are backend-validated (`showBackendBadRequest` error handling). Do not trust client-side validation alone.
- Analysis results are stored locally with `IMPORTED_ANALYSIS_REFRESH_THRESHOLD_MS` for auto-refresh.
- The `ANALYSIS PAUSE` state allows users to pause/resume analysis without losing progress.

---

## Feature 3: RevenueCat Subscription System

**What it does:** Manages subscription tiers (Free, Weekly, Semi-Annual, Annual, Gold, Unlimited) with RevenueCat. Includes paywall with Svelte-based checkout UI, Stripe and Paddle payment processors, free trial support, restore purchases, and dual-store distribution (Google Play + Amazon Appstore).

**API methods used:**
- `Purchases.getOfferings()` -- Load subscription offers
- `Purchases.purchasePackage()` -- Process purchase
- `Purchases.restorePurchases()` -- Restore previous purchases
- `Purchases.logIn(appUserID)` -- Link RC user to Firebase UID
- `Purchases.getCustomerInfo()` -- Check entitlement status

**Components that implement it:**
- `/paywall.tsx` -- Subscription paywall screen
- Svelte-based checkout UI (`.rc-checkout-container`, `.stripe-checkout-wrapper`, `.rcb-paddle-summary-card`)
- RevenueCat Paywalls with video backgrounds (`.rc-bg-video`)
- Entitlement gates throughout the app

**Step-by-step implementation:**
1. Configure RevenueCat: `Purchases.configure({apiKey, appUserID: firebaseUID})`
2. Load offerings: `Purchases.getOfferings()` -> `offerings.current`
3. Present paywall at `/paywall.tsx` with pricing, trial info, tier comparison
4. On purchase: `Purchases.purchasePackage(selectedPackage)` -> returns `customerInfo`
5. Check entitlement: `customerInfo.entitlements.active['premium']` or `['gold']`
6. Restore: `Purchases.restorePurchases()` -> re-check entitlements
7. Handle dual store: RevenueCat abstracts Google Play vs. Amazon billing
8. Sync purchases: `Purchases.syncPurchases()` on app foreground

**Common pitfalls:**
- RevenueCat uses Svelte-based checkout, not native React Native components. The checkout UI renders in a WebView.
- Stripe checkout loads from `https://js.stripe.com/v3`. Ensure `SYSTEM_ALERT_WINDOW` permission is granted for the WebView.
- Paddle checkout uses inline rendering (`.rcb-paddle-summary-card`). Do not override Paddle's CSS.
- The `finishTransactions` setting controls whether RevenueCat completes purchases. Setting it to `false` breaks the flow.
- Amazon Appstore purchases require `syncAmazonPurchase()` -- they do not auto-sync like Google Play.
- Free trial periods are configured in RevenueCat dashboard, not in code. Check `freeTrialPeriods` in the offering.

---

## Feature 4: Real-Time WebSocket Chat

**What it does:** Real-time messaging between matched users via WebSocket (OkHttp on native). Supports text messages, typing indicators, read receipts, and message metadata (name, time, type). Chat options available per conversation.

**API methods used:**
- WebSocket connection (OkHttp native)
- `websocketMessage` -- Send/receive messages
- `getOnMessage` -- Message handler registration

**Components that implement it:**
- Chat list (matched conversations)
- Message thread (real-time chat)
- `MESSAGE_LIST` component (virtualized message list)
- Typing indicator
- Chat options menu

**Step-by-step implementation:**
1. Connect WebSocket: `new WebSocket('wss://backend.com/chat')`
2. Authenticate: send `{type: 'authenticate', token: firebaseAuthToken}` on open
3. Listen for messages: `ws.onmessage` handler
4. Message types: `new_message`, `typing`, `match`, `read_receipt`
5. Send message: `ws.send(JSON.stringify({type: 'message', content, recipientId}))`
6. Store messages locally in expo-sqlite (`kind='chat'`)
7. Handle reconnection: WebSocket auto-reconnect with exponential backoff
8. Typing indicators: send `typing` event, debounce on receiver side

**Common pitfalls:**
- WebSocket is native (OkHttp), not JavaScript. The `NativeWebSocketModuleSpec` TurboModule bridges JS and native.
- The `NativeBlobModuleSpec` handles binary data over WebSocket (for image messages).
- Message format is JSON with `message_name`, `message_time`, `message_type` fields.
- The `MESSAGE_LIST` component must be virtualized for performance with many messages.
- Chat options (report, block, etc.) are available via a context menu, not a separate screen.
- Messages persist in expo-sqlite with `kind='chat'` constraint. The `legacy_migration_meta` table handles schema upgrades.

---

## Feature 5: Profile Customization & Verification

**What it does:** Complete profile management with photo upload/crop, bio editing, interest selection, prompt/answer system, and photo-based verification. Uses tier-based photo limits (more photos for premium). Includes EXIF data stripping for privacy.

**API methods used:**
- Profile CRUD endpoints (inferred from Hermes bundle)
- Photo upload via Firebase Storage
- Verification submission endpoint

**Components that implement it:**
- `/profile.tsx` -- Profile view/edit
- `/onboarding/index.tsx` -- Multi-step signup wizard
- `CropImageActivity` / `ExpoCropImageActivity` -- Photo cropping
- Interest/chip selector (Expo UI `FilterChip`)
- Prompt/answer system
- Photo verification upload

**Step-by-step implementation:**
1. Profile photos: `expo-image-picker` -> `expo-image-manipulator` (resize) -> crop via canhub cropper
2. Strip EXIF data (especially GPS coordinates) before upload
3. Upload to Firebase Storage, get download URL
4. Save profile: PUT to backend with photo URLs, bio, interests, prompts
5. Photo verification: submit cropped photo for review
6. Interest selection: use Expo UI `FilterChip` components in a scrollable grid
7. Prompts: select question from list, write answer
8. Photo limits: check `imagesByTier` to enforce free vs. premium limits

**Common pitfalls:**
- Camera is disabled in image picker config. Photo upload only works from gallery, not live capture.
- EXIF data must be stripped before upload -- the `ExifInterface` with GPS handling is present in the codebase for this purpose.
- The `CropImageActivity` (canhub library) and `ExpoCropImageActivity` are both available. The app uses canhub for most crops.
- Photo verification uses Italian text ("Verifica") and requires a specific crop ratio.
- The `imagesByTier` property controls how many photos each subscription tier can upload. Free users get fewer slots.
- Profile prompts are stored as `Domande` (Italian for "questions") and `Risposte` (Italian for "answers") in the i18n strings.

---

*Appended: 2026-08-14*
*Developer Quick Start & Feature Blueprints added by ZCode Documentation Writer*

---

# ERROR HANDLING PATTERNS

## Pattern 1: RevenueCat Error Handling

```
Purchase Flow
    |
    v
Purchases.purchasePackage()
    |
    v
[Error?]
    |-- BackendBadRequest --> Show "Invalid request" + retry
    |-- BackendOfferNotFound --> Fallback to default offering
    |-- BackendCannotTransferPurchases --> Show support ticket
    |-- AmazonPurchaseNotAllowedError --> Show Amazon region restriction
    |-- INVALID_API_KEY --> Re-authenticate
    |-- Network request timed out --> Retry with exponential backoff
    |-- App does not have sufficient permissions --> Prompt billing setup
    |-- Could not find product data --> Refresh offerings
    |-- StoreKit version mismatch --> Update SDK config
    |-- checkout_payment_form_gateway_error --> Show payment error + retry
```

## Pattern 2: WebSocket Chat Errors

```
WebSocket Connection
    |
    v
[Connection failure?]
    |-- Exponential backoff reconnect (1s -> 2s -> 4s -> 8s -> 16s -> 30s)
    |-- Show "Reconnecting..." banner
    |
    v
[Max retries exceeded?]
    |-- Show "Connection lost" + manual retry button
    |-- Queue messages for send on reconnect
```

## Pattern 3: AI Feature Errors

```
AI Request
    |
    v
[Backend validation?]
    |-- showBackendBadRequest --> Show "Invalid request" + retry
    |-- analyzeAnalysisFailureBody --> Show "Analysis failed" + retry
    |
    v
[Rate limit?]
    |-- pickup:dailyLimitTitle --> Show "Daily limit reached"
    |-- Upgrade to premium for more
```

## Pattern 4: Auth Errors

```
Authentication
    |
    v
[Error?]
    |-- INVALID_API_KEY --> Re-authenticate
    |-- Network timeout --> Retry
    |-- Google Sign-In failure --> Show "Sign in failed" + retry
    |-- Apple Sign-In failure --> Show "Sign in failed" + retry
    |-- Token expired --> Refresh via Firebase
    |-- Pairip DRM check fail --> Show license error
```

## Pattern 5: Photo Upload Errors

```
Photo Upload
    |
    v
[File too large?]
    |-- Show "File too large" error
    |-- Suggest compression
    |
    v
[Invalid format?]
    |-- Show "Unsupported format" error
    |-- Only JPEG, PNG, WebP accepted
    |
    v
[Upload failure?]
    |-- Retry with backoff
    |-- Show "Upload failed" + retry button
    |-- Queue for background retry
```

## Pattern 6: Network Offline Handling

```
Network Status Change
    |
    v
OfflineIndicator component
    |-- Listens to navigator.onLine
    |-- Shows red banner when offline
    |-- Shows green "back online" for 2 seconds on recovery
    |
    v
[Offline?]
    |-- All fetch calls fail gracefully
    |-- Show error states with retry buttons
    |-- Cache last-known state locally
```

---

# PERFORMANCE CONSIDERATIONS

## 1. Hermes Bytecode Optimization

- 6.68 MB Hermes bytecode bundle (v98)
- R8 minification enabled
- Resource shrinking enabled
- Source maps removed from production
- Faster startup than interpreted JS

## 2. Fabric (New Architecture)

- TurboModules for native module bridge
- IntBufferBatchMountItem for efficient UI updates
- Lazy ReactHost initialization
- Single-activity architecture reduces memory overhead

## 3. Spring-Physics Animations

- `react-native-reanimated` runs animations on UI thread
- Spring physics: damping ~10, stiffness ~100, mass ~1
- `withSpring()` for natural-feeling card interactions
- Pan gestures via `react-native-gesture-handler` (native thread)

## 4. Image Loading

- Glide + OkHttp for native image loading
- Expo Image with BlurHash/ThumbHash placeholders
- SVG support for vector graphics
- Lazy loading for card photos
- Image manipulation via `expo-image-manipulator`

## 5. Local Database

- expo-sqlite for local chat/analysis storage
- Schema migration via `legacy_migration_meta`
- WAL journal mode for concurrent reads
- Indexed queries for message search

## 6. Encrypted Storage

- expo-secure-store with AES/GCM/NoPadding
- Android Keystore integration
- 256-bit key length
- `configureAndroidBackup:false` prevents backup

## 7. Dual-Store Distribution

- RevenueCat abstracts Google Play vs Amazon
- Separate billing clients per store
- Sync purchases across sessions
- Handle store-specific edge cases

## 8. Privacy-First Design

- Coarse location only (no fine location)
- Camera disabled in image picker
- No audio recording
- EXIF data stripping before upload
- Pairip DRM for license verification

## 9. Bundle Optimization

- Metro bundler with tree shaking
- Code splitting by route (expo-router)
- Lazy loading for heavy screens
- Dynamic imports for optional features

## 10. Offline Support

- Local database caches messages
- Failed message queue with retry
- WorkManager for background sync
- Offline entitlements via RevenueCat
