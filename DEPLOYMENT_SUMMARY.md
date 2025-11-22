# Deployment Summary: Pipeline AI

## What You're Building

An **AI system that generates and trains ML models**:
- 🎨 **Frontend**: Next.js web app (Vercel)
- 🧠 **Backend**: Python FastAPI service (Railway)
- 📚 **Training**: Real PyTorch model training
- 🤗 **Deployment**: Auto-push to HuggingFace Hub

---

## The Problem

Your `start.sh` script **cannot run on Vercel** because it:
- ❌ Starts background processes (`npm run dev &`, `python main.py &`)
- ❌ Uses dev mode (not production)
- ❌ Expects localhost services
- ❌ Has waiting loops

**Vercel is serverless-only.** It doesn't support long-running processes.

---

## The Solution

Deploy **two separate services**:

```
┌──────────────────────────────────────────┐
│         Vercel (Frontend)                 │
│  Next.js → Calls External Python API    │
│  https://your-app.vercel.app            │
└──────────────────────────────────────────┘
                    ↓
        NEXT_PUBLIC_PYTHON_SERVICE_URL
                    ↓
┌──────────────────────────────────────────┐
│      Railway (Backend)                    │
│  FastAPI → Trains Models                │
│  https://your-project.railway.app       │
└──────────────────────────────────────────┘
```

---

## Quick Start (5 Steps)

### 1. Deploy Backend to Railway (2 min)
```bash
# Go to https://railway.app
# Sign up with GitHub
# New Project → Deploy from GitHub → Select your repo
# Railway auto-detects Dockerfile in python-service/
# Set environment variables:
#   - HF_TOKEN = your_huggingface_token
#   - GROQ_API_KEY = your_groq_key
# Deploy (takes ~2 min)
# Copy the public URL
```

### 2. Deploy Frontend to Vercel (2 min)
```bash
# Go to https://vercel.com/new
# Import your GitHub repo
# Root directory: pipeline
# Add environment variables:
#   - NEXT_PUBLIC_SUPABASE_URL = your_url
#   - NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
#   - SUPABASE_SERVICE_ROLE_KEY = your_key
#   - NEXT_PUBLIC_PYTHON_SERVICE_URL = https://your-project.railway.app
#   - GROQ_API_KEY = your_key
# Deploy
```

### 3. Test
```bash
# Visit your Vercel URL
# Start a training job
# Watch it train and deploy to HuggingFace
```

---

## Files Created for You

| File | Purpose |
|------|---------|
| `DEPLOYMENT_GUIDE.md` | Complete deployment guide with all options |
| `VERCEL_DEPLOYMENT.md` | Vercel-specific setup and troubleshooting |
| `QUICK_DEPLOY.md` | Quick reference card |
| `API_INTEGRATION.md` | How frontend calls backend |
| `vercel.json` | Vercel build configuration |
| `railway.json` | Railway deployment configuration |
| `start.sh` (updated) | Added `--frontend-only` flag for testing |

---

## Environment Variables Needed

### For Railway (Backend)
```
HF_TOKEN=your_huggingface_token
GROQ_API_KEY=your_groq_key
```

### For Vercel (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-railway-url
GROQ_API_KEY=your_groq_key
```

---

## Local Development Options

### Option 1: Full Local Stack
```bash
./start.sh
# Runs both Python backend and Next.js frontend locally
```

### Option 2: Frontend Only (Backend on Railway)
```bash
export NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-project.railway.app
./start.sh --frontend-only
```

### Option 3: Docker Compose
```bash
./start.sh --docker
# Requires Docker and Docker Compose installed
```

---

## Architecture Details

### Frontend (Next.js on Vercel)
- **Build command**: `next build`
- **Start command**: `next start`
- **Port**: 3000 (local) / HTTPS (Vercel)
- **Calls**: Python backend API

### Backend (FastAPI on Railway)
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Port**: 8000
- **Features**:
  - Real PyTorch model training
  - HuggingFace Hub integration
  - Background training tasks
  - Progress tracking
  - CORS enabled for frontend

### API Communication
```
Frontend (Next.js)
    ↓
/api/train-real (Next.js API route)
    ↓
NEXT_PUBLIC_PYTHON_SERVICE_URL (environment variable)
    ↓
Backend (FastAPI)
    ↓
/train (POST) - Start training
/status/{model_id} (GET) - Get training status
```

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

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to backend" | Check `NEXT_PUBLIC_PYTHON_SERVICE_URL` in Vercel |
| "Build fails on Vercel" | Run `npm install && npm run build` locally first |
| "Training times out" | Upgrade Railway to Pro tier (free tier has limits) |
| "Model not uploading to HuggingFace" | Verify `HF_TOKEN` is set in Railway |
| "CORS errors" | CORS is already enabled in your backend |

---

## Next Steps

1. ✅ Read `QUICK_DEPLOY.md` for quick reference
2. ✅ Read `DEPLOYMENT_GUIDE.md` for detailed instructions
3. ✅ Create Railway account and deploy backend
4. ✅ Create Vercel account and deploy frontend
5. ✅ Set environment variables in Vercel
6. ✅ Test end-to-end training flow
7. ✅ Monitor logs and performance

---

## Key Differences: Local vs Production

| Aspect | Local | Production |
|--------|-------|-----------|
| **Frontend URL** | `http://localhost:3000` | `https://your-app.vercel.app` |
| **Backend URL** | `http://localhost:8000` | `https://your-project.railway.app` |
| **Environment** | `.env.local` | Vercel dashboard |
| **Build** | `npm run dev` | `next build && next start` |
| **Processes** | Both local | Separate services |
| **Scaling** | Manual | Automatic |

---

## Your Current Setup

✅ **Already Correct:**
- Next.js frontend structure
- FastAPI backend with real training
- CORS enabled for cross-origin requests
- Environment variable handling
- HuggingFace integration
- Docker support

⚠️ **Needs Update:**
- `start.sh` - Added `--frontend-only` flag
- Vercel configuration - Created `vercel.json`
- Railway configuration - Created `railway.json`
- Documentation - Created deployment guides

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Railway Docs](https://docs.railway.app)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [HuggingFace Hub](https://huggingface.co/docs/hub)

---

## Summary

Your project is **production-ready**. You just need to:

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Connect them with environment variables
4. Test the training flow

Everything else is already set up correctly! 🚀
