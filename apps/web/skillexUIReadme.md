skillex — Frontend Build Brief (Next.js + TS + Tailwind)

Context
skillex is a professional network like professional network/jobsites with a skill-exchange niche. Users list skills to teach and learn, get matched for 1:1 swaps or 4–5 person cohorts (4–6 weeks), run weekly sessions, chat, upload artifacts, exchange endorsements and referrals, and see light, contextual ads (clearly labelled).

I am building this based on my comment below I made on a professional network/jobsites post where someone allegedly spent over $20k just to learn tech skills while trying to pivot from an audio technician industry that was shrinking.  

"""My comment on the post:
This is exactly why we need a skill-exchange platform! Instead of paying $17K+ for bootcamps that don't even guarantee jobs or offer a Master's certficate, imagine professionals trading skills directly like "I'll teach you Python if you teach me marketing."

I've seen Reddit threads where someone offers to teach Photoshop for Excel skills and gets 200+ responses. People want structured learning with accountability, and not just another expensive bootcamp.

Picture 6-week skill swaps, small learning cohorts, and real networking that leads to hiring referrals. When you teach someone a skill, you're more likely to recommend them for roles and for me, that's organic networking that actually works."""


What to do first (Cursor)
Read:
/apps/api (routes under /v1)
/prisma/schema.prisma
this README

Propose a milestone plan (M0 scaffold → M1 auth → M2 API client → M3 onboarding → M4 matches → M5 cohorts → M6 profile/connections → M7 referrals → M8 polish/tests).

Wait for approval, then implement milestones in order with patch-style diffs.

Architecture (monorepo)

Location: /apps/web (this frontend package).

Next.js 14+ (App Router) + TypeScript.

TailwindCSS + shadcn/ui (accessible, modern UI).

Server Components by default; use Client Components for forms, chat, and the availability HeatmapPicker.

Auth: Supabase JS client (browser) for sign-in/up; attach user JWT to API calls.

API base: NEXT_PUBLIC_API_BASE (points to the running /apps/api service).

Data fetching: for authenticated views, use client-side fetch + React Query (simplifies JWT handling). For public pages, Server Components are fine. Validate responses with Zod.

i18n (skeleton only): English first, structure ready for locales.

Analytics placeholder: Plausible/PostHog optional.

Ads: render small, clearly labelled components; contextual only (skill tags/city), frequency-capped.

Hard requirements (so Cursor doesn’t choose another stack):
Use Next.js 14 App Router.
Do NOT use Vite, CRA, Remix, Astro, or other frameworks.
Use pnpm workspaces and add scripts under this package.

Pages & flows
Home/Discover: feed of matches (people & cohorts), success stories, other posts, “Start a Skill Swap” CTA.
Onboarding (3-step wizard):
Basics: name, handle, photo, location (city/time-zone), short bio

Skills: choose teach/learn tags with levels (1–5)

Availability: 7×24 HeatmapPicker (+ remote/in-person preference)
→ On complete: call /v1/match/preview, show initial matches & cohort suggestions.

Matches: list with “why match” explanation; filters (tags, city, time-zone, cohort size).

Cohort (/cohorts/[id]):

Overview: participants, weekly goals checklist, progress bar

Sessions: table (week, date/time, status), “Add to calendar” links

Chat: simple thread (polling for MVP)

Artifacts: grid of uploaded links

Profile (/profile/[handle]): public view with skills (teach/learn), endorsements, badges, completed swaps. Private settings to edit profile, skills, availability, privacy.

Connections: tabs for sent/received/accepted; accept/decline.

Referrals: modal/page to request/send; list pending/completed.

Settings: notifications, ad preferences (opt-out), data export.

Project structure
/apps/web
  /app
    /onboarding/step1/page.tsx
    /onboarding/step2/page.tsx
    /onboarding/step3/page.tsx
    /matches/page.tsx
    /profile/[handle]/page.tsx
    /cohorts/[id]/overview/page.tsx
    /cohorts/[id]/sessions/page.tsx
    /cohorts/[id]/chat/page.tsx
    /cohorts/[id]/artifacts/page.tsx
    /connections/page.tsx
    /settings/page.tsx
    layout.tsx        # top nav, left content, right rail with AdSlot
  api-client/
    fetcher.ts        # reads NEXT_PUBLIC_API_BASE; injects Authorization: Bearer <supabase jwt>
    users.ts, match.ts, cohorts.ts, connections.ts, referrals.ts
  components/
    MatchCard.tsx
    HeatmapPicker.tsx
    SkillTag.tsx
    AdSlot.tsx
    ProgressBar.tsx
    FormInput.tsx
    AvatarImg.tsx     # uses deterministic avatar URLs (see lib/avatars)
  lib/
    supabaseClient.ts # Supabase init (browser)
    auth.ts           # get current session, route guards/redirects
    avatars.ts        # DiceBear/UI-Avatars/Picsum helpers
    utils.ts
  styles/
    globals.css
    tailwind.config.ts
  public/
    images/, icons/
  package.json
  tsconfig.json

Libraries

next, react, react-dom, typescript, @types/node

tailwindcss, postcss, autoprefixer, clsx

@supabase/supabase-js

@tanstack/react-query (client data), zod (validation)

shadcn/ui + deps: lucide-react, @radix-ui/react-slot

(optional) react-hook-form + @hookform/resolvers/zod

(optional) analytics: next-plausible or PostHog

shadcn components to generate: Button, Input, Dialog, Tabs, Card, Badge, Avatar, DropdownMenu, Toast/Toaster.

Environment variables (frontend)

NEXT_PUBLIC_API_BASE — base URL of the API (e.g., http://localhost:3001 or prod domain)

NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY — for Supabase Auth (publishable)

NEXT_PUBLIC_PLAUSIBLE_DOMAIN — optional analytics

Note: These are public by design. RLS on the backend DB and JWT checks on the API enforce access.

Implementation notes
Scaffolding

Use pnpm dlx create-next-app@latest apps/web --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-pnpm.

Init shadcn/ui and add components listed above.

Auth flow (client-side)

Initialize Supabase client in lib/supabaseClient.ts.

On protected pages, if no session, redirect to /onboarding/step1.

On requests, api-client/fetcher.ts pulls the current JWT from Supabase and sets Authorization: Bearer <jwt>.

Match card & availability

MatchCard shows avatar, overlapping skills (teach↔learn) with a “why match” summary, plus a tiny availability grid snippet.

HeatmapPicker supports 7×24 selection, keyboard accessible, with onChange(weekMask:boolean[]).

Images/avatars (no uploads in MVP)

Deterministic avatar/cover URLs; no storage required:

Avatars (DiceBear): https://api.dicebear.com/7.x/thumbs/svg?seed=<handle>&radius=50

Initials (UI Avatars): https://ui-avatars.com/api/?name=<full+name>&background=random

Covers (Picsum): https://picsum.photos/seed/<handle>/1200/300

Provide helpers in lib/avatars.ts and use them in AvatarImg.tsx.

Accessibility & UX

WCAG-AA focus rings, keyboard nav, labelled controls.

Empty states everywhere (matches, cohorts, messages).

Single primary CTA per screen; secondary actions as links.

Testing (light but useful)

Add one Playwright or Cypress smoke test (navigate → login mock → onboarding → matches loads).

Component tests for HeatmapPicker and MatchCard (basic rendering + interactions).

Scripts (package.json in /apps/web)
{
  "name": "@skillex/web",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3000",
    "build": "next build",
    "start": "next start -p 3000",
    "lint": "next lint",
    "test": "vitest"
  }
}


At the repo root, ensure pnpm workspaces are set so pnpm -C apps/web dev works.

Acceptance criteria

User can sign in (Supabase), complete 3-step onboarding, and land on Matches within ~3 minutes.

Matches show candidates with a clear “why match” explanation; filters work.

Cohorts: view overview, sessions (with calendar links), chat (simple polling), artifacts grid.

Profile: public view and private settings; Connections and Referrals flows work end-to-end.

Ads only render in designated slots with “Ad” labels; never block content.

UI is responsive and accessible; no overlapping UI or broken nav; errors are surfaced nicely.

Non-goals (for MVP)

Real-time websockets (polling is fine for chat).

File uploads (use URL artifacts).

Complex i18n; just the scaffolding.

Behavioral ad tracking (contextual only).

Deliverables

A running Next.js app in /apps/web using the structure above.

api-client wrappers that hit /v1/* endpoints with a Bearer JWT.

Onboarding, Matches, Cohort, Profile, Connections, Referrals pages implemented.

Basic tests and lint passing.

Cursor: After you read this, propose the milestone plan first. When approved, scaffold and implement milestone by milestone, producing patch-style diffs for review.