# Vercel Deployment Guide for Pipeline AI

## ⚠️ Important: Your Current Setup Won't Work on Vercel

Your `start.sh` script runs:
- ❌ Background Python process (`python main.py &`)
- ❌ Dev mode (`npm run dev &`)
- ❌ Waiting loops (`wait`)

**Vercel doesn't support any of this.** Vercel is **serverless-only** and doesn't allow:
- Long-running processes
- Background tasks
- Custom servers
- Dev mode

---

## ✅ Solution: Separate Deployments

### Frontend → Vercel
- Static Next.js build
- Runs `next build` then `next start`
- No background processes
- Calls external API

### Backend → Railway/Render/Fly.io
- Long-running FastAPI service
- Handles model training
- Pushes to HuggingFace
- Accessible via HTTP API

---

## Quick Start: Deploy to Vercel

### 1. Prepare Your Code

Ensure your Next.js code uses the environment variable for the backend URL:

```typescript
// lib/api.ts (or wherever you make API calls)
const PYTHON_SERVICE_URL = process.env.NEXT_PUBLIC_PYTHON_SERVICE_URL || 'http://localhost:8000';

export async function startTraining(request: any) {
  const response = await fetch(`${PYTHON_SERVICE_URL}/train`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return response.json();
}

export async function getTrainingStatus(modelId: string) {
  const response = await fetch(`${PYTHON_SERVICE_URL}/status/${modelId}`);
  return response.json();
}
```

### 2. Create `.env.production` (Optional, for local testing)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-backend.railway.app
GROQ_API_KEY=your_groq_key
```

### 3. Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 4. Deploy to Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repo
4. Set root directory to `pipeline`
5. Add environment variables (see below)
6. Click "Deploy"

**Option B: Via Vercel CLI**
```bash
npm install -g vercel
vercel --prod
```

### 5. Set Environment Variables in Vercel

In Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `NEXT_PUBLIC_PYTHON_SERVICE_URL` | `https://your-backend.railway.app` |
| `GROQ_API_KEY` | Your Groq API key |

**Important:** Only variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## Deploying Backend to Railway

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub"
- Choose your repository

### 3. Configure Railway
- Railway will auto-detect the `Dockerfile` in `python-service/`
- Set environment variables:
  - `HF_TOKEN` = Your HuggingFace token
  - `GROQ_API_KEY` = Your Groq API key
  - `PORT` = 8000

### 4. Deploy
- Railway builds and deploys automatically
- Your service URL will be: `https://your-project.railway.app`

### 5. Update Vercel
- Copy the Railway URL
- Update `NEXT_PUBLIC_PYTHON_SERVICE_URL` in Vercel to this URL
- Vercel will redeploy automatically

---

## Vercel Build Process

When you deploy to Vercel, it runs:

```bash
# 1. Install dependencies
npm install

# 2. Build Next.js
next build

# 3. Start production server
next start
```

This is defined in `vercel.json` and `package.json`.

---

## What Gets Deployed to Vercel

```
pipeline/
├── app/                    ✅ Deployed
├── components/             ✅ Deployed
├── lib/                    ✅ Deployed
├── public/                 ✅ Deployed
├── package.json            ✅ Used for build
├── next.config.ts          ✅ Used for build
├── tsconfig.json           ✅ Used for build
├── tailwind.config.ts      ✅ Used for build
├── postcss.config.mjs      ✅ Used for build
├── vercel.json             ✅ Used for build config
├── .env.production         ⚠️  Not deployed (set in dashboard)
├── python-service/         ❌ NOT deployed (separate Railway)
├── docker-compose.yml      ❌ NOT deployed (local only)
├── start.sh                ❌ NOT deployed (local only)
└── start.bat               ❌ NOT deployed (local only)
```

---

## Testing Before Deployment

### Local Test with Production Config

```bash
# Build Next.js (same as Vercel)
npm run build

# Start production server
npm run start

# In another terminal, test API calls
curl http://localhost:3000
```

### Test with External Backend

```bash
# Set backend URL to your Railway service
export NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-backend.railway.app

# Start Next.js
npm run dev
```

---

## Troubleshooting

### Build Fails: "Cannot find module"
- Check `package.json` has all dependencies
- Run `npm install` locally first
- Check imports are correct

### Build Fails: "next: command not found"
- Make sure `next` is in `package.json` dependencies
- Check Node version (should be 18+)

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_PYTHON_SERVICE_URL` is set in Vercel
- Check Railway backend is running: `curl https://your-backend.railway.app`
- Check CORS is enabled in `python-service/main.py`

### CORS Errors
- Your `main.py` already has CORS enabled:
  ```python
  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # ✅ Allows all origins
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

### Training Timeout
- Vercel serverless functions timeout after 60 seconds
- Your backend on Railway handles long training (no timeout)
- Make sure frontend calls `PYTHON_SERVICE_URL`, not local endpoint

---

## Cost Breakdown

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Vercel** | 100GB/month bandwidth | Generous free tier |
| **Railway** | $5/month credit | Covers small backend |
| **HuggingFace** | Free | For model hosting |
| **Supabase** | 500MB DB | Enough for most projects |
| **Total** | ~$5/month | Very affordable |

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `NEXT_PUBLIC_PYTHON_SERVICE_URL` used in API calls
- [ ] Railway backend deployed and running
- [ ] Railway URL copied
- [ ] Vercel project created
- [ ] Environment variables set in Vercel
- [ ] Vercel deployment successful
- [ ] Test training flow end-to-end
- [ ] Monitor logs for errors

---

## Useful Links

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [Environment Variables in Vercel](https://vercel.com/docs/projects/environment-variables)
