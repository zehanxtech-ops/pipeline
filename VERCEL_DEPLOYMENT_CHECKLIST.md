# Vercel Deployment Checklist

Step-by-step checklist to deploy your Pipeline AI to Vercel.

---

## Pre-Deployment (Local)

### Code Verification
- [ ] All code is committed to GitHub
- [ ] No uncommitted changes: `git status`
- [ ] Latest code is pushed: `git push origin main`

### Build Test
- [ ] Run locally: `npm run build`
- [ ] No build errors
- [ ] `.next` folder is created
- [ ] Run: `npm run start`
- [ ] App loads at `http://localhost:3000`

### File Verification
- [ ] `vercel.json` exists in project root
- [ ] `package.json` has correct scripts:
  ```json
  {
    "scripts": {
      "dev": "next dev",
      "build": "next build",
      "start": "next start"
    }
  }
  ```
- [ ] `next.config.ts` exists
- [ ] `tsconfig.json` exists

### Environment Variables
- [ ] `.env.local` exists (for local testing)
- [ ] `.env.local` is in `.gitignore` (never push secrets!)
- [ ] All required variables are in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `NEXT_PUBLIC_PYTHON_SERVICE_URL`
  - `GROQ_API_KEY` (optional)

### Backend Ready
- [ ] Python backend is deployed to Railway
- [ ] Railway backend URL is available (e.g., `https://pipeline-production.up.railway.app`)
- [ ] Backend responds: `curl https://your-railway-url`
- [ ] Backend has environment variables set:
  - `HF_TOKEN`
  - `GROQ_API_KEY`

---

## Vercel Setup

### Create Vercel Account
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub
- [ ] Authorize Vercel to access your repositories

### Import Project
- [ ] Go to https://vercel.com/new
- [ ] Click "Import Git Repository"
- [ ] Select your GitHub repository
- [ ] Click "Import"

### Configure Project
- [ ] **Project Name**: `pipeline` (or your preferred name)
- [ ] **Framework Preset**: Next.js (should auto-detect)
- [ ] **Root Directory**: `pipeline` (important!)
- [ ] Click "Continue"

---

## Set Environment Variables

### Method 1: Via Vercel Dashboard (Recommended)

1. After import, you'll see "Environment Variables" section
2. Add each variable:

**Variable 1: NEXT_PUBLIC_SUPABASE_URL**
- Name: `NEXT_PUBLIC_SUPABASE_URL`
- Value: Your Supabase project URL
  - Get from: Supabase Dashboard → Settings → API → Project URL
  - Example: `https://abcdefg.supabase.co`
- Click "Add"

**Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY**
- Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Value: Your Supabase anon key
  - Get from: Supabase Dashboard → Settings → API → anon key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Click "Add"

**Variable 3: SUPABASE_SERVICE_ROLE_KEY**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: Your Supabase service role key
  - Get from: Supabase Dashboard → Settings → API → service_role key
  - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Click "Add"

**Variable 4: NEXT_PUBLIC_PYTHON_SERVICE_URL**
- Name: `NEXT_PUBLIC_PYTHON_SERVICE_URL`
- Value: Your Railway backend URL
  - Get from: Railway Dashboard → Your Service → Public URL
  - Example: `https://pipeline-production.up.railway.app`
- Click "Add"

**Variable 5: GROQ_API_KEY (Optional)**
- Name: `GROQ_API_KEY`
- Value: Your Groq API key
  - Get from: https://console.groq.com/keys
  - Example: `gsk_xxxxxxxxxxxxxxxxxxxx`
- Click "Add"

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter value when prompted
# Select environments: production, preview, development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
# Repeat for other variables
```

---

## Deploy

### Option A: Via Dashboard (Easiest)

1. After setting all environment variables
2. Click "Deploy" button
3. Wait for build to complete (2-3 minutes)
4. You'll get a URL like: `https://pipeline-production.vercel.app`

### Option B: Via Vercel CLI

```bash
# Deploy to production
vercel --prod

# Or just preview
vercel
```

---

## Verify Deployment

### Check Build Status
- [ ] Go to Vercel Dashboard
- [ ] Click your project
- [ ] Go to "Deployments" tab
- [ ] Latest deployment shows green checkmark
- [ ] Build log shows no errors

### Test Frontend
- [ ] Visit your Vercel URL: `https://your-app.vercel.app`
- [ ] Page loads without errors
- [ ] You see the Pipeline AI interface
- [ ] No console errors (press F12)

### Test API Connection
- [ ] In browser console, check for errors
- [ ] Try creating a new model
- [ ] Check that it connects to backend
- [ ] Look for any error messages

### Test Backend Connection
```bash
# From your terminal
curl https://your-app.vercel.app/api/train-real

# Should return error about missing body (that's OK)
# If you get 404, API route is not configured correctly
```

### Test Environment Variables
- [ ] Go to Vercel Dashboard → Settings → Environment Variables
- [ ] Verify all variables are set
- [ ] Check values are correct (not empty)

---

## Troubleshooting

### Build Failed

**Error**: `npm ERR! peer dep missing`

**Solution**:
- Check `installCommand` in vercel.json has `--legacy-peer-deps`
- Redeploy

**Error**: `Cannot find module '@supabase/...'`

**Solution**:
- Check package.json has all dependencies
- Run locally: `npm install`
- Push to GitHub
- Redeploy

### Environment Variable Not Found

**Error**: `Error: NEXT_PUBLIC_SUPABASE_URL is not defined`

**Solution**:
1. Go to Vercel Settings → Environment Variables
2. Check if variable is set
3. If not, add it
4. Redeploy

### API Returns 404

**Error**: `POST /api/train-real 404`

**Solution**:
1. Check vercel.json has `functions` section
2. Check API file exists at `app/api/train-real/route.ts`
3. Redeploy

### Cannot Connect to Backend

**Error**: `Failed to connect to Python service`

**Solution**:
1. Check `NEXT_PUBLIC_PYTHON_SERVICE_URL` is set correctly
2. Test the URL: `curl https://your-railway-url`
3. If Railway is down, restart it
4. Update the URL if it changed
5. Redeploy

### CORS Errors

**Error**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:
1. Check vercel.json has CORS headers
2. Verify `Access-Control-Allow-Origin` is set to `*`
3. Redeploy

---

## Post-Deployment

### Monitor Logs
- [ ] Go to Vercel Dashboard
- [ ] Click your project
- [ ] Go to "Logs" tab
- [ ] Watch for any errors
- [ ] Check that requests are being processed

### Test Full Flow
- [ ] Visit your app
- [ ] Create a new model
- [ ] Start training
- [ ] Watch progress updates
- [ ] Verify model appears in HuggingFace (if using HF token)

### Share with Team
- [ ] Copy your Vercel URL
- [ ] Share with team members
- [ ] They can now access your app!

### Set Up Custom Domain (Optional)
- [ ] Go to Vercel Settings → Domains
- [ ] Add your custom domain
- [ ] Configure DNS records
- [ ] Your app is now at your custom domain!

---

## Automatic Deployments

After initial setup, Vercel automatically:

1. **Detects changes** when you push to GitHub
2. **Builds** your app with `npm run build`
3. **Deploys** to production
4. **Updates** environment variables if changed

**To trigger deployment**:
```bash
git add .
git commit -m "Your message"
git push origin main
# Vercel automatically deploys!
```

---

## Rollback (If Something Goes Wrong)

### Via Vercel Dashboard
1. Go to Deployments tab
2. Find the previous working deployment
3. Click the three dots
4. Select "Promote to Production"

### Via Vercel CLI
```bash
# List recent deployments
vercel list

# Rollback to previous
vercel rollback
```

---

## Performance Monitoring

### Check Build Time
- [ ] Go to Deployments tab
- [ ] Click on a deployment
- [ ] See build time (should be < 2 minutes)

### Check Response Time
- [ ] Open browser DevTools (F12)
- [ ] Go to Network tab
- [ ] Reload page
- [ ] Check response times (should be < 1 second)

### Check Errors
- [ ] Go to Logs tab
- [ ] Look for any error messages
- [ ] Fix and redeploy if needed

---

## Maintenance

### Weekly
- [ ] Check Vercel logs for errors
- [ ] Monitor Railway backend status
- [ ] Test training flow

### Monthly
- [ ] Review Vercel analytics
- [ ] Check build times
- [ ] Update dependencies if needed

### As Needed
- [ ] Update environment variables
- [ ] Change Railway backend URL if needed
- [ ] Redeploy after code changes

---

## Success Checklist

✅ **Deployment is successful when**:
- [ ] Build completes without errors
- [ ] App loads at Vercel URL
- [ ] All pages are accessible
- [ ] API routes work correctly
- [ ] Backend connection works
- [ ] No console errors
- [ ] Environment variables are set
- [ ] Training flow works end-to-end

---

## Summary

**Before Deployment**:
1. Test build locally
2. Push to GitHub
3. Have Railway backend URL ready
4. Have Supabase credentials ready

**During Deployment**:
1. Import project to Vercel
2. Set all environment variables
3. Click Deploy
4. Wait for build to complete

**After Deployment**:
1. Test the app
2. Monitor logs
3. Share with team
4. Celebrate! 🎉

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Troubleshooting**: See VERCEL_CONFIG_GUIDE.md
- **Quick Reference**: See VERCEL_JSON_REFERENCE.md

**You're ready to deploy!** 🚀
