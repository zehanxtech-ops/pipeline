# Deployment Guide: Pipeline AI

Your project has **two separate components** that need different deployments:

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                         │
│  Next.js App (3000) → Calls External Python API             │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    PYTHON_SERVICE_URL
                              ↓
┌─────────────────────────────────────────────────────────────┐
│         Railway/Render/Fly.io (Backend)                      │
│  FastAPI Training Service (8000) → Trains & Deploys Models  │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: Deploy Frontend to Vercel

### Prerequisites
- Vercel account (free at vercel.com)
- GitHub repo with your code

### Deployment Steps

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select the `pipeline` folder as root directory

3. **Set Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-backend.railway.app
   GROQ_API_KEY=your_groq_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically run: `next build && next start`

---

## Step 2: Deploy Backend to Railway

### Why Railway?
- ✅ Supports long-running Python services
- ✅ Docker support
- ✅ Easy environment variables
- ✅ Free tier available
- ✅ GPU options available

### Deployment Steps

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository

3. **Configure Railway**
   - Railway will detect the `Dockerfile` in `python-service/`
   - Set environment variables:
     ```
     HF_TOKEN=your_huggingface_token
     GROQ_API_KEY=your_groq_key
     PORT=8000
     ```

4. **Deploy**
   - Railway will automatically build and deploy
   - Your service will be available at: `https://your-project.railway.app`

5. **Get Your Backend URL**
   - Go to Railway dashboard
   - Copy the public URL (e.g., `https://pipeline-production.up.railway.app`)
   - Update Vercel's `NEXT_PUBLIC_PYTHON_SERVICE_URL` with this URL

---

## Step 3: Update Frontend Configuration

### Update Environment Variables

Create `.env.production` in the `pipeline` folder:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-backend.railway.app
GROQ_API_KEY=your_groq_key
```

### Update API Calls in Frontend

Make sure your Next.js code uses the environment variable:

```typescript
// In your API call files
const PYTHON_SERVICE_URL = process.env.NEXT_PUBLIC_PYTHON_SERVICE_URL || 'http://localhost:8000';

// Example API call
const response = await axios.post(`${PYTHON_SERVICE_URL}/train`, trainingRequest);
```

---

## Local Development

### Option A: Full Local Stack
```bash
./start.sh
# Runs both Python backend and Next.js frontend locally
```

### Option B: Frontend Only (Backend on Railway)
```bash
export PYTHON_SERVICE_URL=https://your-backend.railway.app
./start.sh --frontend-only
```

### Option C: Docker Compose (Local)
```bash
./start.sh --docker
# Requires Docker and Docker Compose installed
```

---

## Troubleshooting

### "Cannot connect to Python service"
- Check `NEXT_PUBLIC_PYTHON_SERVICE_URL` is set correctly
- Verify Railway backend is running: `curl https://your-backend.railway.app`
- Check CORS settings in `python-service/main.py` (should allow all origins)

### "Training job times out"
- Railway free tier has 10-minute timeout
- Upgrade to Railway Pro for longer training
- Or split training into smaller batches

### "Model not pushing to HuggingFace"
- Verify `HF_TOKEN` is set in Railway environment
- Check token has write permissions
- Ensure HuggingFace account is active

### "GPU not available"
- Railway free tier uses CPU only
- Upgrade to Railway Pro GPU plan
- Or use Render.com with GPU support

---

## Alternative Deployment Platforms

### Render.com
- Similar to Railway
- Better free tier for long-running services
- Deploy: https://render.com/docs/deploy-from-github

### Fly.io
- Global deployment
- Generous free tier
- Deploy: https://fly.io/docs/getting-started/

### AWS Lambda + RDS
- Serverless option
- More complex setup
- Better for scaling

### Your Own VPS
- DigitalOcean, Linode, AWS EC2
- Full control
- Requires DevOps knowledge

---

## Cost Breakdown

| Service | Free Tier | Paid Tier |
|---------|-----------|-----------|
| **Vercel** | 100GB bandwidth | $20/month |
| **Railway** | $5/month credit | Pay as you go |
| **HuggingFace** | Free models | Pro: $9/month |
| **Supabase** | 500MB DB | Pay as you go |
| **Total** | ~$5/month | ~$30-50/month |

---

## Next Steps

1. ✅ Create Railway account
2. ✅ Deploy Python backend
3. ✅ Get Railway URL
4. ✅ Update Vercel environment variables
5. ✅ Deploy Next.js frontend
6. ✅ Test end-to-end training flow
7. ✅ Monitor logs and performance
