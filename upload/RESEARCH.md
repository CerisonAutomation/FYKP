# RESEARCH: OmoLink Clone Audit

**Date:** 2026-08-15
**Pipeline:** clone-website-mega v3
**Depth:** FULL
**Original:** OmoLink dating app (Capacitor + OpenStreetMap)
**Clone:** Next.js 15 + Supabase + Tailwind v4

---

## Executive Summary

| Category | Status | Score |
|----------|--------|-------|
| **Project Structure** | ✅ Complete | 8/10 |
| **Dependencies** | ⚠️ 2 dead deps | 7/10 |
| **Auth** | ❌ Login is a mockup | 3/10 |
| **API Routes** | ⚠️ 54 working, 13 stubs | 7/10 |
| **Components** | ⚠️ 11 good, 9 needs work | 6/10 |
| **Design Tokens** | ⚠️ Defined but not used everywhere | 5/10 |
| **Accessibility** | ❌ Universal gaps | 2/10 |
| **TypeScript** | ✅ Strong types | 8/10 |
| **Realtime** | ⚠️ Infrastructure exists, not wired | 4/10 |
| **Database** | ✅ Full Supabase types (23 tables) | 7/10 |
| **Routing** | ⚠️ Duplicate routes exist | 7/10 |
| **Overall** | **Partial clone — visual OK, functional gaps** | **5.8/10** |

---

## Phase 0: Tech Stack Detection

| Layer | Technology | Status |
|-------|-----------|--------|
| Framework | Next.js 15.3.4 (App Router) | ✅ |
| React | React 19.1.0 | ✅ |
| Styling | Tailwind CSS 4.1.8 | ✅ |
| State | Zustand 5.0.5 | ✅ |
| Auth | Supabase Auth (@supabase/ssr) | ⚠️ Broken at UI |
| Database | Supabase Postgres (via @supabase/supabase-js) | ✅ |
| ORM | Drizzle ORM (installed, unused) | ❌ Dead dep |
| Maps | Leaflet + React-Leaflet | ✅ |
| Icons | FontAwesome (CDN + npm, mixed) | ⚠️ Redundant |
| Validation | Zod 4.4.3 | ✅ |
| Date | date-fns 4.4.0 | ✅ |
| Animations | None installed | ❌ Missing |
| Payments | Stripe (env vars, no code) | ⚠️ Stub only |

---

## Phase 1: Project Audit

### Files: 152 total
- 44 page routes
- 66 API routes (54 working, 13 stubs)
- 21 components
- 4 custom hooks
- 9 lib files
- 6 Supabase layer files

### Dead Code Found
| Item | Location | Issue |
|------|----------|-------|
| `drizzle-orm` + `postgres` | package.json | Installed, never used. No schema file exists |
| `src/middleware.ts` | src/middleware.ts | Never executed (Next.js reads root middleware.ts) |
| Font Awesome CDN | layout.tsx `<head>` | Redundant with npm packages |
| `src/lib/supabase/middleware.ts` | Supabase middleware | Exports `updateSession()` but root middleware does it inline |

### Duplicate Routes
| Route A | Route B | Recommendation |
|---------|---------|----------------|
| `/group/[groupId]` | `/groups/[groupId]` | Remove `/group/[groupId]` |
| `/event/[eventId]` | `/events/[eventId]` | Remove `/event/[eventId]` |

### API Typo
- `/api/user/profesional` → should be `/api/user/professional`

---

## Phase 2: Component Quality Audit

| # | Component | Rating | Critical Issues |
|---|-----------|--------|----------------|
| 1 | ActionButtons | **NeedsWork** | Dead `style={{ width: undefined }}`, convoluted SIZE_MAP |
| 2 | AppHeader | **NeedsWork** | Hardcoded inline rgba, no aria-labels, functions in render |
| 3 | Badge | **Good** | Minor: hardcoded colors in inline styles |
| 4 | BannerAd | **NeedsWork** | Entirely inline styles, no design tokens, hardcoded Spanish text |
| 5 | BottomSheet | **Good** | Minor: duplicated max-height logic |
| 6 | ChatBubble | **Good** | No `<time>` element, unvalidated date parsing |
| 7 | ChatInputBar | **Good** | Hardcoded gradient in send button |
| 8 | Chip | **Good** | COLOR_MAP not using design tokens |
| 9 | ContactListItem | **Good** | Interactive icons have no aria-labels |
| 10 | EmptyState | **NeedsWork** | Hardcoded gradient, icon prop has no validation |
| 11 | MeetNowButton | **NeedsWork** | `<div>` instead of `<button>`, not interactive, entirely inline |
| 12 | MessageListItem | **NeedsWork** | Dead close button (renders, no onClick), missing a11y |
| 13 | ProfileCard | **NeedsWork** | Legacy Ionic classes, no design tokens, hardcoded colors |
| 14 | ProfileGridCard | **Good** | Missing aria on badges/dots |
| 15 | SkeletonLoader | **Good** | Missing `aria-busy`/`role="status"` |
| 16 | SwipeCard | **NeedsWork** | Timer leak risk, hardcoded colors, no keyboard support |
| 17 | TabBar | **NeedsWork** | Hardcoded badge "1932", no `aria-current`, no aria labels |
| 18 | TabFilter | **Good** | Missing ARIA tab semantics, hardcoded gradient |
| 19 | Toolbar | **Good** | Minor: hardcoded padding/border, missing icon labels |
| 20 | UserGridCard | **Good** | Identical ternary branches, hardcoded avatar colors |

### Cross-Cutting Issues

**1. Design Token Adoption (16/20 components fail)**
Only ContactListItem, MessageListItem, ProfileGridCard, TabBar, Toolbar properly use `colors` from design tokens. The gradient `#e91e8c → #6c5ce7` is hardcoded in 6+ files.

**2. Accessibility (ALL 20 components fail)**
- No `aria-label` on icon-only buttons (ContactListItem, Toolbar, ProfileGridCard)
- No ARIA tab semantics on TabBar or TabFilter
- No `aria-busy` on SkeletonLoader
- No `aria-current="page"` on active TabBar items
- MeetNowButton is a `<div>` not a `<button>`
- SwipeCard has no keyboard alternative

**3. FontAwesome Inconsistency**
5 components use `@fortawesome/react-fontawesome` (FontAwesomeIcon component).
9 components use `<i className="fa-solid fa-...">` (CSS approach).
Should pick ONE strategy.

---

## Phase 3: Auth System Audit

### CRITICAL: Login Page Is a Mockup

```typescript
// src/app/login/page.tsx — THIS IS FAKE
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setTimeout(() => {
    setLoading(false);
    router.push("/welcome");
  }, 1500);
};
```

The login page shows a loading spinner for 1.5 seconds then navigates to `/welcome` WITHOUT calling any auth API. The auth API exists at `/api/auth/login` but is never invoked.

### Auth Infrastructure (Working)
- ✅ Supabase server client (cookie-based auth)
- ✅ Supabase browser client
- ✅ Root middleware refreshes session
- ✅ Register page → `/api/auth/register` (creates user + profile)
- ✅ 5 auth API endpoints (login, register, logout, callback, forgot-password)
- ✅ `/api/auth/forgot-password` sends reset email

### Auth Gaps
- ❌ Login page doesn't call the API
- ❌ No route protection in middleware (all pages accessible without auth)
- ❌ No `/reset-password` page (forgot-password sends link to non-existent route)
- ❌ No email confirmation handling
- ❌ Verification auto-approves (`is_verified: true` immediately)

---

## Phase 4: API Routes Audit

### Working (54 routes with real Supabase integration)
| Domain | Routes | Status |
|--------|--------|--------|
| Auth | 5 | ✅ API works, login page broken |
| Messages | 7 | ✅ Full CRUD + emoji, pinned, ephemeral |
| Threads | 5 | ✅ Full CRUD + search, images |
| Matches | 1 | ✅ Listing with partner profiles |
| Likes | 1 | ✅ Like/superlike/pass + mutual match |
| Blocks | 2 | ✅ Block/unblock + match removal |
| Notifications | 1 | ✅ CRUD |
| Albums | 3 | ✅ Full CRUD + photos |
| Profile Photos | 1 | ✅ 4 methods (GET/POST/DELETE/PATCH) |
| Upload | 1 | ✅ Supabase Storage |
| Groups | 5 | ✅ Full CRUD + join, members, messages |
| Events | 3 | ✅ Full CRUD + RSVP |
| Blogs | 2 | ✅ Full CRUD |
| Videos | 1 | ✅ POST protected, GET public |
| FAQs | 1 | ✅ Public listing |
| Reports | 1 | ✅ User reporting |
| Favorites | 1 | ✅ CRUD |
| Footprints | 1 | ✅ Profile visit tracking |
| Profile Views | 2 | ✅ CRUD |
| Boosts | 1 | ✅ Profile boost |
| Wallet | 2 | ✅ Transactions (mock Stripe) |
| Subscription | 1 | ✅ Management |
| Travel | 1 | ✅ Travel mode |
| Discover | 1 | ✅ Swipe deck (optional auth) |
| Verification | 1 | ⚠️ Auto-approves |

### Stubs (13 routes returning hardcoded data)
| Route | Returns | Needs |
|-------|---------|-------|
| `/api/checkin` | Hardcoded check-in | Supabase table + queries |
| `/api/sessions` | Hardcoded session list | Supabase table |
| `/api/sites` | Hardcoded site list | Supabase table |
| `/api/banners` | Hardcoded banners | Supabase table |
| `/api/meetnow` | Hardcoded nearby users | Geolocation + Supabase |
| `/api/user/tap` | Hardcoded tap response | Supabase table |
| `/api/user/notes` | Hardcoded notes | Supabase table |
| `/api/user/hotpics` | Hardcoded trending | Supabase query |
| `/api/user/profesional` | Hardcoded verification | Supabase + manual review |
| `/api/user/superfav` | Hardcoded super fav | Supabase table |
| `/api/user/private` | Hardcoded private mode | Supabase toggle |
| `/api/messages/recall` | Hardcoded recall | Supabase + storage cleanup |
| `/api/messages/translate` | Hardcoded translation | Translation API |

---

## Phase 5: Foundation Audit

### Design Tokens
- ✅ Defined in `src/lib/design-tokens.ts` with 5 groups (colors, typography, spacing, borderRadius, shadows)
- ❌ NOT wired into Tailwind v4 config (CSS-based `@theme` block)
- ❌ Only 5/20 components import and use them
- ❌ Hardcoded colors duplicated across 16 components

### TypeScript
- ✅ 603-line types file with 26 enums + 26 interfaces + 3 utility types
- ⚠️ `User` and `Profile` interfaces are near-duplicates
- ⚠️ All IDs typed as `string` (no branded types)

### State Management
- ✅ Zustand store with 18 state fields + 19 actions
- ❌ No `persist()` middleware (state lost on refresh)
- ❌ No `devtools()` middleware
- ❌ `onlineUsers` uses `Set` (non-serializable)

### Environment Variables
- ✅ `.env.local` exists with 11 variables
- ✅ `.env.local.example` exists
- ⚠️ Missing: `NEXT_PUBLIC_SITE_URL` (forgot-password uses it, only `NEXT_PUBLIC_APP_URL` defined)

---

## Action Plan (Priority Order)

### P0 — Must Fix (Broken Functionality)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 1 | **Wire login page to auth API** | `src/app/login/page.tsx` | 15 min |
| 2 | **Add route protection in middleware** | `src/middleware.ts` | 30 min |
| 3 | **Create `/reset-password` page** | `src/app/reset-password/page.tsx` | 20 min |
| 4 | **Remove dead deps** (drizzle-orm, postgres) | `package.json` | 2 min |
| 5 | **Remove dead middleware** | `src/middleware.ts` | 2 min |
| 6 | **Fix duplicate routes** (group, event) | Delete `src/app/group/`, `src/app/event/` | 5 min |
| 7 | **Fix API typo** | `src/app/api/user/profesional/` → `professional/` | 5 min |

### P1 — Should Fix (Quality)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 8 | **Wire Zustand persist middleware** | `src/lib/store.ts` | 15 min |
| 9 | **Remove Font Awesome CDN** from layout | `src/app/layout.tsx` | 5 min |
| 10 | **Standardize FontAwesome** — pick one approach | All components | 1 hr |
| 11 | **Wire design tokens into Tailwind** via `@theme` | `src/app/globals.css` | 20 min |
| 12 | **Fix MeetNowButton** — `<div>` → `<button>` | `src/components/MeetNowButton.tsx` | 10 min |
| 13 | **Fix TabBar** — remove hardcoded "1932" badge | `src/components/TabBar.tsx` | 10 min |
| 14 | **Fix MessageListItem** — wire close button or remove | `src/components/MessageListItem.tsx` | 10 min |
| 15 | **Fix SwipeCard timer leak** — add cleanup | `src/components/SwipeCard.tsx` | 15 min |
| 16 | **Add aria-labels** to all icon-only buttons | Multiple components | 1 hr |
| 17 | **Add ARIA tab semantics** to TabBar + TabFilter | 2 components | 30 min |

### P2 — Nice to Have (Polish)

| # | Task | Files | Effort |
|---|------|-------|--------|
| 18 | **Add Zustand devtools** | `src/lib/store.ts` | 10 min |
| 19 | **Merge User/Profile interfaces** | `src/lib/types.ts` | 20 min |
| 20 | **Convert hardcoded gradients to tokens** | 6+ components | 30 min |
| 21 | **Replace legacy Ionic classes** | `ProfileCard.tsx` | 15 min |
| 22 | **Add loading states** (skeletons) to all pages | Multiple pages | 2 hr |
| 23 | **Add error boundaries** | `src/app/error.tsx` | 15 min |
| 24 | **Add `aria-busy` to SkeletonLoader** | `SkeletonLoader.tsx` | 5 min |
| 25 | **Wire realtime subscriptions** to pages | Hooks + pages | 2 hr |

### P3 — Future (Stub Routes)

| # | Task | Routes | Effort |
|---|------|--------|--------|
| 26 | Create Supabase tables for 13 stub routes | DB schema | 4 hr |
| 27 | Implement real checkin, sessions, sites, banners | API routes | 4 hr |
| 28 | Implement meetnow with geolocation | API + map | 2 hr |
| 29 | Implement user notes, hotpics, superfav, private | API routes | 3 hr |
| 30 | Integrate real Stripe for wallet | API + Stripe SDK | 4 hr |
| 31 | Add translation API for messages | API route | 2 hr |

---

## Verification Checklist

### Build
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` passes
- [ ] `npm run dev` starts without errors

### Auth
- [ ] Register creates account
- [ ] Login actually authenticates
- [ ] Protected routes redirect to /login
- [ ] Logout clears session
- [ ] Forgot password sends email
- [ ] Reset password page exists and works

### Features
- [ ] Navigation works across all 44 routes
- [ ] Match/discover deck loads profiles
- [ ] Messaging sends and receives messages
- [ ] Profile photos upload correctly
- [ ] Map shows Leaflet view
- [ ] Groups can be created and joined
- [ ] Events can be created and RSVP'd
- [ ] Notifications appear and can be dismissed
- [ ] Search returns results

### Visual
- [ ] Dark theme renders correctly
- [ ] Mobile layout works at 390px
- [ ] Tablet layout works at 768px
- [ ] Desktop layout works at 1440px
- [ ] All images load from Supabase Storage
- [ ] Animations are smooth (no jank)
- [ ] No hardcoded colors visible (all from tokens)

### Accessibility
- [ ] All buttons have aria-labels
- [ ] Tab navigation works
- [ ] Screen reader can navigate main sections
- [ ] Form inputs have labels
- [ ] Error messages are announced
