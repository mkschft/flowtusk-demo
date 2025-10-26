# Flowtusk Deployment Guide

## 🚀 Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy your Flowtusk MVP since it's built with Next.js.

### Quick Deploy

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial Flowtusk MVP"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Vercel auto-detects Next.js

3. **Add Environment Variables:**
   
   In Vercel project settings → Environment Variables, add:
   
   **Required:**
   ```
   OPENAI_API_KEY=sk-proj-...
   ```
   
   **Optional (for publish/leads):**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
   ```

4. **Deploy:**
   - Click "Deploy"
   - Wait ~2 minutes
   - Your app is live! 🎉

### Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain (e.g., `flowtusk.com`)
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## 🐳 Deploy with Docker

Build and run locally or deploy to any container platform.

### Dockerfile

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
```

### Build & Run

```bash
docker build -t flowtusk .
docker run -p 3000:3000 \
  -e OPENAI_API_KEY=sk-... \
  -e NEXT_PUBLIC_SUPABASE_URL=... \
  flowtusk
```

---

## ☁️ Deploy to AWS/GCP/Azure

### AWS Amplify

1. Connect GitHub repo to Amplify
2. Add build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: .next
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
3. Add environment variables in Amplify console
4. Deploy

### Google Cloud Run

```bash
# Build
gcloud builds submit --tag gcr.io/PROJECT-ID/flowtusk

# Deploy
gcloud run deploy flowtusk \
  --image gcr.io/PROJECT-ID/flowtusk \
  --platform managed \
  --set-env-vars OPENAI_API_KEY=sk-...
```

---

## 📊 Production Checklist

Before going live, ensure:

- [ ] **OpenAI API Key** is set and has sufficient credits
- [ ] **Supabase** is configured (if using publish/leads)
- [ ] **Error monitoring** set up (e.g., Sentry, LogRocket)
- [ ] **Analytics** added (e.g., Vercel Analytics, Google Analytics)
- [ ] **Rate limiting** on API routes (prevent abuse)
- [ ] **CORS** configured if needed
- [ ] **Custom domain** with SSL
- [ ] **SEO meta tags** updated in `layout.tsx`

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`** (already in `.gitignore`)
2. **Rotate API keys** periodically
3. **Use environment variables** for all secrets
4. **Enable Supabase RLS** (already configured in schema)
5. **Add rate limiting** to prevent API abuse:

Example with `next-rate-limit`:
```typescript
// middleware.ts
import rateLimit from 'express-rate-limit';

export const config = {
  matcher: '/api/:path*',
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

---

## 📈 Monitoring & Analytics

### Vercel Analytics (Easiest)

Add to `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### PostHog (Product Analytics)

```bash
npm install posthog-js
```

---

## 💰 Cost Estimates

**MVP Hosting (with Vercel Free Tier):**
- Vercel: Free (up to 100GB bandwidth)
- Supabase: Free (up to 500MB database, 2GB bandwidth)
- OpenAI API: ~$0.15 per 1M tokens (GPT-4o-mini)
  - Each full workflow: ~2000 tokens = $0.0003
  - 1000 generated pages = ~$0.30

**Scaling (1000 users/month):**
- Vercel Pro: $20/mo
- Supabase Pro: $25/mo
- OpenAI: ~$30-50/mo (depending on usage)
- **Total: ~$75-95/mo**

---

## 🆘 Troubleshooting Deployment

### Build Fails on Vercel
- Check Node.js version (should be 18+)
- Verify all dependencies in `package.json`
- Check build logs for specific errors

### API Routes Timeout
- Increase timeout in `vercel.json`:
  ```json
  {
    "functions": {
      "src/app/api/**/*.ts": {
        "maxDuration": 30
      }
    }
  }
  ```

### Supabase Connection Issues
- Verify environment variables are set
- Check Supabase project is not paused
- Confirm RLS policies allow public insert

---

Ready to deploy? Just push to GitHub and connect to Vercel! 🚀
