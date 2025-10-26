# Flowtusk MVP - AI Landing Page Generator

Transform any website into high-converting, ICP-targeted landing pages using AI.

## Features

- **Website Analysis**: Extracts content from any URL using Jina AI
- **ICP Generation**: Creates 3 unique Ideal Customer Profiles using GPT-4
- **Landing Page Generation**: Produces tailored landing page copy for each ICP
- **Beautiful UI**: Modern gradient design with Flowtusk branding
- **Real-time Preview**: See generated landing pages instantly

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   **Required:** Add your OpenAI API key to `.env.local`:
   ```
   OPENAI_API_KEY=sk-...
   ```

3. **Run dev server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)**

## Optional: Supabase Setup (for publish & leads)

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL in `supabase-schema.sql` in your Supabase SQL editor
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```
4. The app works without Supabase (mock mode), but you won't be able to publish or track leads

## Tech Stack

- **Framework**: Next.js 15
- **AI**: OpenAI GPT-4, Jina AI Reader
- **UI**: shadcn/ui, Tailwind CSS
- **Components**: AI Elements

## Workflow

1. User enters website URL
2. System analyzes website content (Jina AI)
3. AI generates 3 ICPs (OpenAI)
4. User selects target ICP
5. AI creates custom landing page copy
6. User previews and can publish

## Coming Soon

- ✅ Website analysis & ICP generation
- ✅ Landing page generation & preview
- ⏳ Publish to unique URLs (Supabase)
- ⏳ Lead form tracking & analytics
- ⏳ Inline editing of landing page sections
- ⏳ Export as HTML/React component

## Brand Colors

- Pink: `#FF6B9D`
- Purple: `#A78BFA`
- Blue: `#60A5FA`

---

Built with ❤️ using v0/AI Elements architecture
