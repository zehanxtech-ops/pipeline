# Step-by-Step Deployment Guide

Follow these exact steps to deploy your Pipeline AI to production.

---

## Prerequisites

- GitHub account with your code pushed
- HuggingFace account and API token
- Groq API key (optional but recommended)
- Supabase project (for database)

---

## Phase 1: Deploy Backend to Railway (5 minutes)

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click "Start Project"
3. Sign up with GitHub
4. Authorize Railway to access your repositories

### Step 2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub"
3. Find and select your repository
4. Click "Deploy"

### Step 3: Configure Python Service
Railway should auto-detect the `Dockerfile` in `python-service/`.

If not:
1. Go to your Railway project
2. Click "Add Service"
3. Select "GitHub Repo"
4. Choose your repo
5. Set root directory to `python-service`

### Step 4: Set Environment Variables
1. In Railway dashboard, click on your service
2. Go to "Variables" tab
3. Add these variables:

```
HF_TOKEN = your_huggingface_api_token
GROQ_API_KEY = your_groq_api_key
PORT = 8000
```

**Where to get these:**
- **HF_TOKEN**: https://huggingface.co/settings/tokens (create new token with write access)
- **GROQ_API_KEY**: https://console.groq.com/keys

### Step 5: Deploy
1. Railway automatically builds and deploys
2. Wait for the build to complete (takes ~2-3 minutes)
3. Go to "Deployments" tab to see status
4. Once deployed, click on your service
5. Copy the public URL (looks like: `https://pipeline-production.up.railway.app`)

**Save this URL!** You'll need it for Vercel.

---

## Phase 2: Deploy Frontend to Vercel (3 minutes)

### Step 1: Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Sign up with GitHub
4. Authorize Vercel to access your repositories

### Step 2: Import Project
1. Click "Add New..."
2. Select "Project"
3. Click "Import Git Repository"
4. Find and select your repository
5. Click "Import"

### Step 3: Configure Project
1. **Project Name**: `pipeline` (or your preferred name)
2. **Framework Preset**: Next.js (should auto-detect)
3. **Root Directory**: `pipeline` (important!)
4. Click "Continue"

### Step 4: Set Environment Variables
1. In the "Environment Variables" section, add:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
NEXT_PUBLIC_PYTHON_SERVICE_URL = https://your-railway-url
GROQ_API_KEY = your_groq_api_key
```

**Where to get these:**
- **Supabase**: https://app.supabase.com → Your Project → Settings → API
- **NEXT_PUBLIC_PYTHON_SERVICE_URL**: The Railway URL you saved in Phase 1

### Step 5: Deploy
1. Click "Deploy"
2. Vercel builds and deploys (takes ~2-3 minutes)
3. Once complete, you'll get a URL like: `https://pipeline-production.vercel.app`

**This is your production URL!**

---

## Phase 3: Verify Deployment (5 minutes)

### Step 1: Test Backend
```bash
curl https://your-railway-url
# Should return: {"message": "Pipeline AI Training Service", "status": "running"}
```

### Step 2: Test Frontend
1. Visit your Vercel URL: `https://your-app.vercel.app`
2. You should see your Pipeline AI interface
3. Try creating a new model

### Step 3: Test Training Flow
1. In your frontend, start a training job
2. Watch the progress update
3. Check that the model appears in HuggingFace Hub after training completes

---

## Phase 4: Update Vercel (if needed)

If you made changes to your code and want to redeploy:

### Option A: Automatic (Recommended)
1. Push changes to GitHub
2. Vercel automatically redeploys
3. Check "Deployments" tab to see status

### Option B: Manual
1. In Vercel dashboard, click "Deployments"
2. Click the three dots on the latest deployment
3. Select "Redeploy"

---

## Local Development After Deployment

### Test with Production Backend
```bash
# Set the Railway URL
export NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-railway-url

# Start frontend only
./start.sh --frontend-only

# Visit http://localhost:3000
```

### Test with Local Backend
```bash
# Use default localhost
./start.sh

# Runs both backend and frontend locally
```

---

## Troubleshooting

### "Build failed on Vercel"

**Check:**
1. Run locally first: `npm install && npm run build`
2. Check `package.json` has all dependencies
3. Check Node version (should be 18+)

**Fix:**
1. Fix the error locally
2. Push to GitHub
3. Vercel will automatically redeploy

### "Cannot connect to backend"

**Check:**
1. Verify `NEXT_PUBLIC_PYTHON_SERVICE_URL` is set in Vercel
2. Test the URL: `curl https://your-railway-url`
3. Check Railway service is running

**Fix:**
1. Go to Vercel Settings → Environment Variables
2. Update `NEXT_PUBLIC_PYTHON_SERVICE_URL` with correct Railway URL
3. Redeploy

### "Training starts but never completes"

**This is normal!** Training happens in the background on Railway.

**Check:**
1. Go to Railway dashboard
2. Click on your service
3. Go to "Logs" tab
4. Watch the training progress

### "Model not uploading to HuggingFace"

**Check:**
1. Go to Railway dashboard
2. Click on your service
3. Go to "Variables" tab
4. Verify `HF_TOKEN` is set correctly
5. Check HuggingFace token has write permissions

**Fix:**
1. Generate new token: https://huggingface.co/settings/tokens
2. Update `HF_TOKEN` in Railway
3. Restart the service

### "CORS errors in browser console"

**This shouldn't happen** because CORS is enabled in your backend.

**Check:**
1. Verify `NEXT_PUBLIC_PYTHON_SERVICE_URL` is correct
2. Make sure Railway service is running
3. Check browser console for exact error

---

## Monitoring Your Deployment

### Vercel Dashboard
- **Deployments**: See all deployments and their status
- **Analytics**: View traffic and performance
- **Logs**: See real-time logs from your frontend
- **Settings**: Manage environment variables

### Railway Dashboard
- **Deployments**: See all deployments and their status
- **Logs**: See real-time logs from your backend
- **Metrics**: Monitor CPU, memory, and network usage
- **Variables**: Manage environment variables

---

## Scaling Your Deployment

### If Training Times Out
Railway free tier has limitations. Upgrade to Pro:
1. Go to Railway dashboard
2. Click "Billing"
3. Upgrade to Pro plan
4. Enjoy longer training times and GPU support

### If You Need More Storage
1. Go to Railway dashboard
2. Click on your service
3. Go to "Volumes" tab
4. Add persistent storage

### If You Need GPU
1. Upgrade to Railway Pro
2. In your service settings, select GPU instance type
3. Redeploy

---

## Maintenance

### Regular Tasks
- Monitor logs for errors
- Check HuggingFace Hub for uploaded models
- Update dependencies regularly
- Test new features before deploying

### Updating Code
```bash
# Make changes locally
git add .
git commit -m "Update message"
git push origin main

# Vercel automatically redeploys
# Check Deployments tab to see status
```

### Updating Environment Variables
1. Go to Vercel Settings → Environment Variables
2. Update the variable
3. Click "Save"
4. Redeploy your project

---

## Cost Tracking

### Monthly Costs
- **Vercel**: $0 (free tier)
- **Railway**: ~$5 (free tier credit)
- **HuggingFace**: $0 (free tier)
- **Supabase**: $0 (free tier)
- **Total**: ~$5/month

### Upgrade When Needed
- **Vercel Pro**: $20/month (if you exceed free tier)
- **Railway Pro**: Pay as you go (usually $10-50/month)
- **HuggingFace Pro**: $9/month (if you need premium features)

---

## Summary

✅ **You've successfully deployed:**
- Frontend on Vercel
- Backend on Railway
- Connected them together
- Set up automatic redeployment

🎉 **Your Pipeline AI is now live!**

---

## Next Steps

1. Share your Vercel URL with others
2. Monitor logs for any issues
3. Test the full training flow
4. Iterate and improve your models
5. Scale up when needed

---

## Support

- **Vercel Support**: https://vercel.com/support
- **Railway Support**: https://railway.app/support
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
