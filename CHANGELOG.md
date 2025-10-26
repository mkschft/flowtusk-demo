# Flowtusk MVP Changelog

## [0.1.0] - 2025-10-19

### ✨ Initial MVP Release

Transformed v0-clone starter into Flowtusk MVP - an AI-powered landing page generator.

### Added

#### Core Features
- **Website Analysis** - Extract content from any URL using Jina AI Reader
- **ICP Generation** - Generate 3 unique Ideal Customer Profiles using GPT-4o-mini
- **Landing Page Generation** - Create custom landing page copy tailored to each ICP
- **Real-time Preview** - Beautiful preview with Flowtusk branding
- **Publish System** - Save and share generated landing pages
- **Lead Tracking** - Collect and track leads from published pages

#### UI/UX
- Multi-step wizard flow (URL → ICPs → Preview)
- Gradient-based Flowtusk brand design (pink/purple/blue)
- Responsive card layout for ICP selection
- Live landing page preview with hero, value props, and lead form
- Loading states and error handling

#### API Routes
- `POST /api/analyze-website` - Analyzes website content via Jina AI
- `POST /api/generate-icps` - Generates 3 ICPs using OpenAI structured outputs
- `POST /api/generate-landing-page` - Creates landing page copy from ICP
- `POST /api/publish` - Publishes page to Supabase (with mock fallback)
- `POST /api/submit-lead` - Submits lead form and updates analytics

#### Database (Supabase)
- `landing_pages` table with slug, ICP data, analytics
- `leads` table with contact info and timestamps
- RLS policies for public read/insert
- Automatic conversion rate calculation

#### Developer Experience
- Clean project structure with API routes separated
- Environment variable template (`.env.local.example`)
- Database schema file (`supabase-schema.sql`)
- Comprehensive README and SETUP guide
- TypeScript types for all data structures

### Changed
- Replaced default Next.js starter page with Flowtusk UI
- Updated app metadata (title, description)
- Added Flowtusk brand colors to globals.css
- Modified `open-in-chat.tsx` to support Flowtusk (removed v0-specific parts remain for reference)

### Removed
- `v0-sdk` dependency (no longer needed)
- Default Next.js boilerplate content

### Dependencies Added
- `openai` (^4.77.3) - For GPT-4o-mini integration
- `@supabase/supabase-js` (^2.49.2) - For database and lead tracking

### Technical Details

**Architecture:**
- Next.js 15 App Router
- Server-side API routes for all AI operations
- Client-side React for UI state management
- Supabase for persistence (optional)

**AI Integration:**
- Uses Jina AI Reader for free website scraping (no API key needed)
- OpenAI GPT-4o-mini for ICP and landing page generation
- Structured JSON outputs for reliable parsing

**Styling:**
- Tailwind CSS with custom Flowtusk brand colors
- shadcn/ui components (Card, Button, Input, Badge, etc.)
- Gradient backgrounds and text
- Responsive design (mobile-friendly)

### Notes

This is a functional MVP ready for testing and iteration. Core workflow is complete:
1. User enters website URL
2. AI analyzes and generates ICPs
3. User selects ICP
4. AI generates landing page
5. User previews and publishes

The app works with just OpenAI API key. Supabase is optional for publish/lead features.

---

## Future Roadmap

### v0.2.0 (Planned)
- [ ] Published page viewer (`/p/[slug]` route)
- [ ] Analytics dashboard
- [ ] Inline editing of landing page sections
- [ ] Export as HTML/React component

### v0.3.0 (Planned)
- [ ] User authentication
- [ ] Save drafts
- [ ] Custom branding per landing page
- [ ] A/B testing between ICPs

### v0.4.0 (Planned)
- [ ] Custom domains for published pages
- [ ] Email notifications for new leads
- [ ] CRM integrations (Salesforce, HubSpot, etc.)
- [ ] Advanced analytics and conversion tracking
