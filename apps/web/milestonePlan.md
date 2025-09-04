# skillex Frontend Development Plan

Based on my analysis of your codebase, here's a comprehensive milestone plan for building the frontend. The API is well-structured with proper authentication, and the database schema is comprehensive.

## Codebase Analysis Summary

**✅ What's Already Built:**
- **API**: Fastify-based API with JWT auth, comprehensive routes for users, skills, availability, connections, cohorts, etc.
- **Database**: Well-designed Prisma schema with all core entities (User, Skill, Availability, Cohort, Connection, etc.)
- **Types**: Shared Zod schemas and TypeScript types in `@skillex/types` package
- **Auth**: Supabase JWT verification with JWKS
- **Monorepo**: Proper pnpm workspace setup

**🔧 What Needs Building:**
- Complete frontend Next.js application
- API client integration
- UI components and pages
- Authentication flow
- Onboarding wizard

## Detailed Milestone Plan

### **M0: Project Scaffolding & Setup** 
*Estimated: 2-3 hours*

**Goals:**
- Initialize Next.js 14 app in `/apps/web`
- Configure monorepo integration
- Set up basic project structure

**Tasks:**
1. ✅ Create Next.js app with App Router, TypeScript, Tailwind
2. ✅ Configure pnpm workspace integration
3. ✅ Set up shadcn/ui components
4. ✅ Create basic folder structure per README
5. ✅ Configure environment variables
6. ✅ Add basic scripts to package.json

**Deliverables:**
- ✅ Running Next.js app on port 3000
- ✅ Basic layout with navigation
- ✅ Environment configuration
- ✅ shadcn/ui components installed

---

### **M1: Authentication & API Client** ✅
*Estimated: 3-4 hours*

**Goals:**
- Implement Supabase auth integration
- Create API client with JWT handling
- Set up protected routes

**Tasks:**
1. ✅ Install and configure Supabase client
2. ✅ Create `lib/supabaseClient.ts` and `lib/auth.ts`
3. ✅ Build `api-client/fetcher.ts` with JWT injection
4. ✅ Create API client wrappers for all endpoints
5. ✅ Implement route guards and redirects
6. ✅ Add auth context/provider

**Deliverables:**
- ✅ Working Supabase sign-in/sign-up
- ✅ API client that automatically handles JWT
- ✅ Protected route middleware
- ✅ Auth state management

---

### **M2: Onboarding Wizard (3 Steps)** ✅
*Estimated: 4-5 hours*

**Goals:**
- Complete 3-step onboarding flow
- Integrate with API for user creation
- Show initial matches after completion

**Tasks:**
1. ✅ **Step 1**: Basics form (name, handle, photo, location, bio)
2. ✅ **Step 2**: Skills selection with teach/learn tags and levels
3. ✅ **Step 3**: Availability HeatmapPicker (7×24 grid)
4. ✅ Form validation with Zod schemas
5. ⏳ API integration for user creation (placeholder)
6. ⏳ Call `/v1/match/preview` on completion (placeholder)
7. ✅ Redirect to matches page

**Deliverables:**
- ✅ Complete onboarding flow
- ✅ Working HeatmapPicker component
- ⏳ User profile creation via API (placeholder)
- ✅ Initial match preview (mock data)

---

### **M3: Matches & Discovery**
*Estimated: 3-4 hours*

**Goals:**
- Display user matches with explanations
- Implement filtering and search
- Create match cards with skill overlap

**Tasks:**
1. Build MatchCard component
2. Create matches page with filtering
3. Implement "why match" logic
4. Add availability snippet display
5. Connect to `/v1/match/preview` endpoint
6. Add empty states and loading states

**Deliverables:**
- Functional matches page
- Match cards with skill overlap visualization
- Filtering by tags, location, timezone
- Clear match explanations

---

### **M4: Cohort Management**
*Estimated: 5-6 hours*

**Goals:**
- Complete cohort lifecycle (create, join, manage)
- Cohort overview, sessions, chat, artifacts

**Tasks:**
1. **Cohort Overview**: Participants, goals, progress
2. **Sessions**: Table with calendar links, status
3. **Chat**: Simple polling-based messaging
4. **Artifacts**: Grid of uploaded links
5. Cohort creation and joining flows
6. API integration for all cohort operations

**Deliverables:**
- Full cohort management system
- Working chat with polling
- Session management with calendar integration
- Artifact sharing system

---

### **M5: Profile & Connections**
*Estimated: 4-5 hours*

**Goals:**
- Public profile pages
- Connection management (send/accept/decline)
- Profile editing and settings

**Tasks:**
1. Public profile view (`/profile/[handle]`)
2. Private profile settings
3. Connection requests (sent/received/accepted)
4. Skills and availability editing
5. Avatar and bio management
6. Privacy settings

**Deliverables:**
- Complete profile system
- Connection management flow
- Profile editing capabilities
- Public/private profile views

---

### **M6: Referrals System**
*Estimated: 3-4 hours*

**Goals:**
- Referral request/send functionality
- Referral tracking and management

**Tasks:**
1. Referral request modal/page
2. Referral list (pending/completed)
3. Referral status tracking
4. Integration with connections
5. API integration for referrals

**Deliverables:**
- Complete referral system
- Referral tracking and management
- Integration with connections

---

### **M7: Polish & Testing**
*Estimated: 3-4 hours*

**Goals:**
- UI polish and accessibility
- Basic testing setup
- Error handling improvements

**Tasks:**
1. Accessibility improvements (WCAG-AA)
2. Error boundaries and error handling
3. Loading states and empty states
4. Basic component tests
5. E2E smoke test setup
6. Performance optimizations

**Deliverables:**
- Polished, accessible UI
- Basic test coverage
- Robust error handling
- Performance optimizations

---

### **M8: Ads & Analytics (Optional)**
*Estimated: 2-3 hours*

**Goals:**
- Contextual ad placement
- Basic analytics setup

**Tasks:**
1. AdSlot component with clear labeling
2. Contextual ad placement (skill tags, location)
3. Frequency capping
4. Analytics integration (Plausible/PostHog)
5. Ad preferences in settings

**Deliverables:**
- Non-intrusive ad system
- Basic analytics tracking
- User ad preferences

---

## Technical Implementation Notes

**Key Dependencies:**
```json
{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "@tanstack/react-query": "^5.0.0",
  "zod": "^3.0.0",
  "lucide-react": "^0.300.0",
  "@radix-ui/react-*": "^1.0.0"
}
```

**Environment Variables:**
All environment variables are centralized in the root `.env` file. Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL`: PostgreSQL connection string
- `SUPABASE_JWKS_URL`: Supabase JWKS endpoint for JWT verification  
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (for frontend)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (for frontend)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

**API Integration Strategy:**
- Use React Query for client-side data fetching
- Server Components for public pages
- JWT automatically injected via API client
- Zod validation for all API responses

## Questions for You

1. **Priority**: Should we start with M0 (scaffolding) or do you want to see a specific milestone first?

2. **Matching Algorithm**: The API has a placeholder for `/v1/match/preview`. Do you want me to implement a basic matching algorithm, or should I focus on the frontend first?

3. **Design System**: Do you have any specific design preferences, or should I use a clean, modern approach with shadcn/ui?

4. **Testing**: How important is testing for the MVP? Should I include basic tests in M7 or focus on functionality first?

5. **Timeline**: What's your preferred timeline? I estimate 25-35 hours total across all milestones.

Would you like me to proceed with M0 (scaffolding) or would you prefer to discuss any of these milestones in more detail first?

My answers (to Cursor)

Priority
Start with M0 (scaffolding) in /apps/web (monorepo). After M0, implement other milestones 

Matching Algorithm
Focus frontend first. Consume POST /v1/match/preview. If the endpoint returns placeholder data, that’s fine for now. No frontend mocks unless the API is unreachable—if so, use MSW with a small fixture and remove it once the real endpoint is ready.

Design System
Use shadcn/ui + Tailwind with a professional, professional network/jobsites-adjacent look:
Typography: Inter/system, base text-[15px], titles text-lg/2xl.
Color tokens (Tailwind):
primary: blue-600/blue-700
accent: blue-100/blue-50
neutrals: slate-900/700/500/300/200/100
borders: slate-200
Density: default compact list views; comfy on detail pages.
Radii & shadows: rounded-lg/rounded-2xl, shadow-sm/md.
Components to generate (shadcn): Button, Input, Card, Tabs, Dialog, DropdownMenu, Badge, Avatar, Toast.
Layout: top nav + left rail + main + right rail (AdSlot). Accessible focus states everywhere.

Testing
Ship functionality first. Include light tests at M8:
Unit: HeatmapPicker, MatchCard
“Happy path” smoke (Playwright/Cypress) for onboarding → matches
Basic API client tests with mocked fetch

Timeline
Your timeline estimate is fine. let's just do the work one by one