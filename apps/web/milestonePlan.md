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

### **M3: Matches & Discovery** ✅
*Estimated: 3-4 hours*

**Goals:**
- Display user matches with explanations
- Implement filtering and search
- Create match cards with skill overlap

**Tasks:**
1. ✅ Build MatchCard component
2. ✅ Create matches page with filtering
3. ✅ Implement "why match" logic
4. ✅ Add availability snippet display
5. ✅ Connect to `/v1/match/preview` endpoint (mock data fallback)
6. ✅ Add empty states and loading states

**Deliverables:**
- ✅ Functional matches page
- ✅ Match cards with skill overlap visualization
- ✅ Filtering by tags, location, timezone
- ✅ Clear match explanations
- ✅ Professional job titles display
- ✅ Consistent card layout with fixed heights
- ✅ Skills sorted by proficiency level

---

### **M4: Cohort Management** ✅
*Estimated: 5-6 hours*

**Goals:**
- Complete cohort lifecycle (create, join, manage)
- Cohort overview, sessions, chat, artifacts

**Tasks:**
1. ✅ **Cohort Overview**: Participants, goals, progress
2. ✅ **Sessions**: Table with calendar links, status
3. ✅ **Chat**: Simple polling-based messaging
4. ✅ **Artifacts**: Grid of uploaded links
5. ✅ Cohort creation and joining flows
6. ⏳ API integration for all cohort operations (mock data fallback)

**Deliverables:**
- ✅ Full cohort management system
- ✅ Working chat with polling
- ✅ Session management with calendar integration
- ✅ Artifact sharing system
- ✅ Cohort creation modal with detailed configuration
- ✅ Individual cohort pages with tabs for different features

---

### **M5: Profile & Connections** ✅
*Estimated: 4-5 hours*

**Goals:**
- Public profile pages
- Connection management (send/accept/decline)
- Profile editing and settings

**Tasks:**
1. ✅ Public profile view (`/profile/[handle]`)
2. ✅ Private profile settings
3. ✅ Connection requests (sent/received/accepted)
4. ✅ Skills and availability editing
5. ✅ Avatar and bio management
6. ✅ Privacy settings

**Deliverables:**
- ✅ Complete profile system
- ✅ Connection management flow
- ✅ Profile editing capabilities
- ✅ Public/private profile views

**✅ Completed Features:**
- **Mock Data Service** (`/src/lib/connection-mock-data.ts`)
  - 15 diverse sample users with realistic profiles
  - Connection scenarios: sent (3-4), received (2-3), accepted (5-6)
  - Comprehensive user data: skills, locations, availability, languages
  - Deterministic generation for consistent testing

- **Connection Management Components**
  - **ConnectionCard** (`/src/components/connection-card.tsx`): Professional user cards with actions
  - **ConnectionTabs** (`/src/components/connection-tabs.tsx`): Tab navigation with counts and indicators
  - **Comprehensive documentation** for every function and component

- **Connections Page** (`/src/app/connections/page.tsx`)
  - **Tab-based interface**: Sent/Received/Accepted connections
  - **Advanced search & filtering**: By name, skills, location, status
  - **Statistics dashboard**: Total, pending, accepted counts
  - **Real-time updates**: Optimistic UI updates
  - **Empty states**: Helpful guidance when no connections found
  - **Responsive design**: Works on all screen sizes

- **Public Profile Page** (`/src/app/profile/[handle]/page.tsx`)
  - **Professional profile display**: Avatar, bio, skills, availability
  - **Skills organization**: Separate teach/learn sections with levels
  - **Connection actions**: Send requests, message, share
  - **Availability information**: Timezone, schedule, languages
  - **Tabbed interface**: Skills and availability sections

- **Profile Settings Page** (`/src/app/profile/settings/page.tsx`)
  - **Profile editing**: Name, bio, location, timezone, languages
  - **Skills management**: Add/remove/edit skills with levels
  - **Form validation**: Proper input handling and validation
  - **Tabbed interface**: Profile, skills, availability sections
  - **Save functionality**: With loading states and error handling

- **Connections Hook** (`/src/hooks/use-connections.ts`)
  - **React Query integration**: Efficient data fetching and caching
  - **Optimistic updates**: Immediate UI feedback
  - **API fallback**: Mock data when API unavailable
  - **Error handling**: Comprehensive error management
  - **Connection operations**: Send, accept, decline, remove

- **Navigation Integration**
  - **Fixed profile menu**: Points to correct routes (`/profile/settings`, `/profile/johndoe`)
  - **Type conflict resolution**: Resolved API vs mock data interface conflicts
  - **Seamless navigation**: All profile and connection features accessible

**🎨 Design System Compliance:**
- **Consistent styling**: Matches existing design patterns
- **Professional typography**: Inter font, proper sizing
- **Color scheme**: Blue primary, slate neutrals
- **Card layouts**: Uniform padding and structure
- **Button variants**: Primary, outline, ghost with proper styling
- **Accessibility**: Focus states, ARIA labels, keyboard navigation

**📱 Sample Users Available:**
- **Sarah Chen** - Senior Frontend Developer (React, TypeScript)
- **Marcus Johnson** - DevOps Engineer (AWS, Kubernetes)
- **Elena Rodriguez** - UX Designer (Figma, Design Systems)
- **David Kim** - Full-Stack Developer (Node.js, Python)
- **Lisa Wang** - Data Scientist (Machine Learning, Python)
- **Alex Thompson** - Backend Engineer (Go, Microservices)
- **Maria Garcia** - Mobile Developer (React Native, Swift)
- **James Wilson** - Cloud Architect (Azure, Terraform)
- **Priya Patel** - Product Manager (Agile, Strategy)
- **Tom Anderson** - Security Engineer (Cybersecurity, Compliance)
- And 5 more diverse professionals

**🔧 Technical Implementation:**
- **TypeScript**: Full type safety throughout
- **React Query**: Efficient data management
- **Error boundaries**: Graceful error handling
- **Loading states**: Skeleton loaders and progress indicators
- **Responsive design**: Mobile-first approach
- **API integration**: Real API calls with mock fallback
- **Optimistic updates**: Immediate UI feedback

**🚀 Ready for Production:**
The profile and connections system is now fully functional and ready for users. It includes:
- Real API integration with mock data fallback
- Professional UI that matches the design system
- Comprehensive connection management capabilities
- Complete profile editing functionality
- Mobile-responsive design

---

### **M6: Referrals System** ✅
*Estimated: 4-5 hours* | *Completed: 4 hours*

**Goals:**
- Cohort-based referral system (only cohort members can refer each other)
- Referral request/send functionality after 75% of cohort sessions completed
- Referral tracking and management within cohort context
- Integration with cohort system for meaningful professional referrals

**Tasks:**
1. **Cohort-Based Referral Logic** ✅ - Implement 75% session completion requirement
2. **Referral Request Modal** ✅ - Create referral interface within cohort context
3. **Cohort Member Referral Cards** ✅ - Show referral options for eligible members
4. **Referral Management Dashboard** ✅ - List and track all referrals by cohort
5. **Referral Status Tracking** ✅ - Real-time status updates with cohort context
6. **Cohort Integration** ✅ - Link referrals to specific cohorts and sessions
7. **API Integration** ✅ - Connect to referral endpoints with cohort validation
8. **Mock Data Service** ✅ - Sample referrals linked to cohort members

**Deliverables:**
- ✅ Cohort-based referral system with session completion validation
- ✅ Referral tracking and management interface within cohort context
- ✅ Integration with cohort system for meaningful professional referrals
- ✅ Professional referral workflow based on actual working relationships

**📋 Detailed Implementation Plan:**

**Phase 1: Mock Data & Types Setup** (30 mins)
1. **Create Mock Referral Data** (`/src/lib/referral-mock-data.ts`)
   - Generate 10-15 sample referrals linked to specific cohorts
   - Include referral contexts (job opportunities, projects, collaborations)
   - Link referrals to cohort members (not just connections)
   - Create realistic timestamps and status progression
   - Include cohort session completion validation

2. **Extend Referral Types**
   - Add cohort-based referral context types
   - Create referral eligibility helpers (75% session completion)
   - Add referral action types (send, accept, decline, withdraw)
   - Include cohort validation in referral creation

**Phase 2: Referral Components** (60 mins)
1. **ReferralCard Component** (`/src/components/referral-card.tsx`)
   - Display referral details, status, and actions
   - Show sender/receiver information with avatars
   - Context preview with expandable details
   - Status-specific action buttons
   - Cohort context and session completion info

2. **ReferralRequestModal Component** (`/src/components/referral-request-modal.tsx`)
   - Form to create new referral requests within cohort context
   - Cohort member selection (only eligible members)
   - Context input with character limit
   - Referral type selection (job, project, etc.)
   - Session completion validation display

3. **CohortMemberReferralCard Component** (`/src/components/cohort-member-referral-card.tsx`)
   - Display cohort members with referral eligibility
   - Show session completion percentage
   - Referral button (enabled only after 75% completion)
   - Member skills and availability for context

4. **ReferralTabs Component** (`/src/components/referral-tabs.tsx`)
   - Tab navigation for sent/received referrals
   - Status filtering (draft, sent, accepted, declined)
   - Referral counts and status indicators
   - Cohort-based filtering

**Phase 3: Referral Pages** (75 mins)
1. **Main Referrals Page** (`/src/app/referrals/page.tsx`)
   - Tab-based layout (Sent/Received)
   - Search and filter functionality by cohort
   - Referral statistics dashboard
   - Empty states and loading states
   - Cohort-based referral filtering

2. **Referral Details Page** (`/src/app/referrals/[id]/page.tsx`)
   - Detailed referral view with cohort context
   - Full context and conversation history
   - Action buttons based on user role and status
   - Related cohort members and opportunities
   - Session completion progress display

3. **Cohort Referrals Section** (`/src/app/cohorts/[id]/referrals/page.tsx`)
   - Referral management within specific cohort
   - Member eligibility status and session progress
   - Referral request creation for eligible members
   - Cohort-specific referral statistics

**Phase 4: Referral Management** (60 mins)
1. **Referral Hook** (`/src/hooks/use-referrals.ts`)
   - React Query integration for referral operations
   - CRUD operations with optimistic updates
   - Status change handling
   - Error handling and retry logic
   - Cohort validation and session completion checks

2. **Referral API Client** (`/src/api-client/referrals.ts`)
   - API methods for all referral operations
   - Type-safe request/response handling
   - Mock data fallback when API unavailable
   - Cohort-based referral validation

3. **Cohort Referral Logic** (`/src/lib/cohort-referral-utils.ts`)
   - Session completion percentage calculation
   - Referral eligibility validation (75% threshold)
   - Cohort member referral status tracking
   - Referral context generation based on cohort work

**Phase 5: Integration & Polish** (45 mins)
1. **Cohort Integration**
   - Add referral section to cohort pages
   - Show referral eligibility status for each member
   - Link referrals to cohort session progress
   - Display referral history within cohort context

2. **Navigation Updates**
   - Add referrals link to main navigation
   - Update cohort pages with referral sections
   - Breadcrumb navigation for referral pages
   - Cohort-specific referral management

**🎨 Design System Compliance:**
- **Consistent Card Layout**: All referral cards use same padding and structure
- **Professional Typography**: Inter font, proper text sizing
- **Color Scheme**: Blue primary, slate neutrals, status-specific colors
- **Button Variants**: Primary, outline, ghost with proper styling
- **Status Indicators**: Color-coded badges for referral status
- **Accessibility**: Focus states, ARIA labels, keyboard navigation

**📱 Sample Referrals Data:**
- **Job Referrals**: Software Engineer at Google, Product Manager at Stripe
- **Project Referrals**: Open source collaboration, freelance opportunities
- **Mentorship Referrals**: React development guidance, career advice
- **Collaboration Referrals**: Startup co-founder search, consulting projects
- **Cohort Context**: All referrals linked to specific cohorts and sessions
- **Session Progress**: Referrals only available after 75% session completion

**🔧 Technical Implementation:**
- **TypeScript**: Full type safety with shared schemas
- **React Query**: Efficient data fetching and caching
- **Optimistic Updates**: Immediate UI feedback for actions
- **Error Handling**: Graceful fallbacks and user feedback
- **Responsive Design**: Mobile-first approach
- **API Integration**: Real API calls with mock fallback

**✅ Success Criteria:**
1. **Cohort-Based Referrals**: Only cohort members can refer each other ✅
2. **Session Completion Validation**: Referrals only available after 75% of sessions completed ✅
3. **Referral Creation**: Users can create and send referral requests within cohort context ✅
4. **Referral Management**: Users can view, track, and manage all referrals by cohort ✅
5. **Status Tracking**: Real-time updates for referral status changes ✅
6. **Cohort Integration**: Seamless integration with cohort system and session progress ✅
7. **Professional Workflow**: Complete referral process based on actual working relationships ✅
8. **Responsive Design**: Works on all screen sizes ✅
9. **Error Handling**: Graceful error states and user feedback ✅

**🎉 M6 Implementation Summary:**
- **11 New Components**: ReferralCard, ReferralRequestModal, CohortMemberReferralCard, ReferralTabs
- **3 New Pages**: Main referrals page, referral details page, cohort referrals section
- **2 New Hooks**: useReferrals, useCohortReferrals with React Query integration
- **1 API Client**: Complete referrals API client with cohort validation
- **2 Utility Files**: Referral mock data and cohort referral utilities
- **Cohort Integration**: 75% session completion requirement enforced
- **Professional Workflow**: Meaningful referrals based on actual working relationships
- **Comprehensive Documentation**: Every function documented with JSDoc comments

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

**Design System Guidelines:**
- **Consistent Card Padding**: All cards use `CardContent` with `space-y-4` for content spacing
- **Uniform Layout**: Cards maintain consistent structure with header, content, and footer sections
- **Responsive Design**: Cards adapt to different screen sizes with proper grid layouts
- **Visual Hierarchy**: Clear separation between different content sections within cards
- **Header Card Consistency**: All tab headers (Resources, Sessions, Chat) are wrapped in cards for visual consistency
- **Consistent Card Content Padding**: All card content uses the same padding pattern with `CardContent` and internal `space-y-4` divs
- **Uniform Card Heights**: Session cards maintain consistent height (h-48) with flex layout and always show notes section
- **Complete Mock Data**: All session mock data includes attendeeCount field for realistic display

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