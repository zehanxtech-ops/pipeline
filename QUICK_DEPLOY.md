# Quick Deployment Reference

## The Problem
Your `start.sh` won't work on Vercel because it runs background processes. Vercel is **serverless-only**.

## The Solution
Deploy frontend and backend separately:

```
Vercel (Frontend)  ←→  Railway (Backend)
  Next.js              FastAPI
  Port 3000            Port 8000
```

---

## 5-Minute Setup

### Step 1: Deploy Backend to Railway (5 min)
```bash
# 1. Go to https://railway.app → Sign up with GitHub
# 2. New Project → Deploy from GitHub → Select your repo
# 3. Railway auto-detects Dockerfile in python-service/
# 4. Set environment variables:
#    - HF_TOKEN = your_huggingface_token
#    - GROQ_API_KEY = your_groq_key
# 5. Deploy (takes ~2 min)
# 6. Copy the public URL: https://your-project.railway.app
```

### Step 2: Deploy Frontend to Vercel (3 min)
```bash
# 1. Go to https://vercel.com/new
# 2. Import your GitHub repo
# 3. Root directory: pipeline
# 4. Add environment variables:
#    - NEXT_PUBLIC_SUPABASE_URL = your_url
#    - NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
#    - SUPABASE_SERVICE_ROLE_KEY = your_key
#    - NEXT_PUBLIC_PYTHON_SERVICE_URL = https://your-project.railway.app
#    - GROQ_API_KEY = your_key
# 5. Deploy
```

### Step 3: Test
```bash
# Visit your Vercel URL and test the training flow
# Frontend calls Railway backend automatically
```

---

## Local Development

### Option 1: Full Local (Both services locally)
```bash
./start.sh
# Runs Python backend + Next.js frontend
```

### Option 2: Frontend Only (Backend on Railway)
```bash
export NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-project.railway.app
./start.sh --frontend-only
```

### Option 3: Docker Compose
```bash
./start.sh --docker
```

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

## Key Files

- `vercel.json` - Vercel build config
- `railway.json` - Railway deployment config
- `python-service/Dockerfile` - Backend container
- `package.json` - Frontend dependencies
- `python-service/requirements.txt` - Backend dependencies

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Cannot connect to backend" | Check `NEXT_PUBLIC_PYTHON_SERVICE_URL` in Vercel |
| "Build fails on Vercel" | Run `npm install && npm run build` locally first |
| "Training times out" | Upgrade Railway to Pro tier (free tier has limits) |
| "Model not uploading to HuggingFace" | Verify `HF_TOKEN` is set in Railway |

---

## Cost

- **Vercel**: Free (100GB bandwidth)
- **Railway**: ~$5/month (free tier credit)
- **Total**: ~$5/month

---

## Next Steps

1. ✅ Create Railway account
2. ✅ Deploy backend to Railway
3. ✅ Get Railway URL
4. ✅ Create Vercel account
5. ✅ Deploy frontend to Vercel
6. ✅ Set environment variables
7. ✅ Test end-to-end
