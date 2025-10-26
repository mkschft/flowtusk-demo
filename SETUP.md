# Flowtusk MVP Setup Guide

## 🎯 What You Just Built

A fully functional AI-powered landing page generator that:
- Analyzes any website URL
- Generates 3 unique ICPs using GPT-4
- Creates custom landing page copy for each ICP
- Provides real-time preview with Flowtusk branding
- Supports publishing and lead tracking (with Supabase)

---

## 🚀 Installation & First Run

### 1. Install Dependencies

```bash
npm install
```

This will install:
- Next.js 15
- OpenAI SDK
- shadcn/ui components
- AI Elements
- Supabase (optional)

### 2. Set Up OpenAI API Key (Required)

Create `.env.local` from the example:
```bash
cp .env.local.example .env.local
```

Add your OpenAI API key:
```env
OPENAI_API_KEY=sk-proj-...
```

> Get your API key from [platform.openai.com](https://platform.openai.com/api-keys)

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Test the Core Flow

1. **Enter a website URL** (try: `https://stripe.com` or `https://notion.so`)
2. **Wait for ICP generation** (~5-10 seconds)
3. **Select an ICP** to generate landing page
4. **Preview** the custom landing page
5. **Click "Publish"** (mock mode if Supabase not configured)

---

## 🗄️ Optional: Enable Publish & Lead Tracking

The app works perfectly without Supabase, but to enable full publish and lead tracking:

### 1. Create Supabase Project

Go to [supabase.com](https://supabase.com/dashboard) and create a new project.

### 2. Run Database Schema

1. Open your Supabase project
2. Go to **SQL Editor**
3. Copy contents of `supabase-schema.sql`
4. Run the SQL

This creates:
- `landing_pages` table
- `leads` table
- Proper indexes and RLS policies

### 3. Add Supabase Environment Variables

Get your credentials from **Project Settings → API** and add to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Restart Dev Server

```bash
npm run dev
```

Now "Publish" will create real unique URLs and track views/leads!

---

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze-website/     # Jina AI integration
│   │   ├── generate-icps/       # OpenAI ICP generation
│   │   ├── generate-landing-page/ # OpenAI landing page copy
│   │   ├── publish/             # Save to Supabase
│   │   └── submit-lead/         # Lead form submission
│   ├── page.tsx                 # Main Flowtusk UI
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Flowtusk brand styles
├── components/
│   ├── ui/                      # shadcn/ui components
│   └── ai-elements/             # AI Elements components
└── lib/
    ├── utils.ts                 # Utility functions
    └── supabase.ts              # Supabase client

supabase-schema.sql              # Database schema
.env.local.example               # Environment template
```

---

## 🎨 Customization

### Brand Colors

Already configured in `globals.css`:
- Pink: `#FF6B9D` (`--flowtusk-pink`)
- Purple: `#A78BFA` (`--flowtusk-purple`)
- Blue: `#60A5FA` (`--flowtusk-blue`)

### Modify ICP Generation

Edit `src/app/api/generate-icps/route.ts` to customize:
- Number of ICPs (default: 3)
- ICP structure (pain points, goals, etc.)
- AI model (default: `gpt-4o-mini`)

### Modify Landing Page Generation

Edit `src/app/api/generate-landing-page/route.ts` to customize:
- Copy structure
- Tone and style
- Number of value props

---

## 🐛 Troubleshooting

### "Failed to analyze website"
- Check website URL is valid and accessible
- Jina AI may be rate-limited (free tier)
- Consider adding Firecrawl API key as fallback

### "Failed to generate ICPs"
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Review console logs for detailed errors

### Supabase publish not working
- Verify all 3 Supabase env vars are set
- Check SQL schema was run successfully
- Confirm RLS policies are enabled

---

## 🚢 Next Steps

The MVP is production-ready! Consider adding:

1. **Published Page Route** (`/p/[slug]`) to display published pages
2. **Analytics Dashboard** to view leads and conversion rates
3. **Inline Editing** to modify landing page sections
4. **Export Feature** to download as HTML/React
5. **Authentication** for user accounts
6. **Custom Domains** for published pages
7. **A/B Testing** between different ICPs

---

## 🆘 Need Help?

Check the code comments or review:
- [Next.js Docs](https://nextjs.org/docs)
- [OpenAI API Docs](https://platform.openai.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

Happy building! 🎉
