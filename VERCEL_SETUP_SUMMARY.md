# Vercel Setup Summary

Everything you need to know about your Vercel configuration.

---

## What Changed

### Updated vercel.json

Your `vercel.json` now has:

✅ **Build Configuration**
- Correct build command: `npm run build`
- Correct output directory: `.next`
- Correct install command: `npm install --legacy-peer-deps`

✅ **Environment Variables**
- All 5 required variables defined
- Proper format for Vercel to read

✅ **API Configuration**
- API routes configured with 60-second timeout
- 1 GB memory per function
- CORS headers enabled

✅ **URL Configuration**
- Redirect `/` to `/console`
- Clean URLs (no `.html`)
- No trailing slashes

✅ **Security Headers**
- Cache-Control for API routes
- CORS headers for cross-origin requests
- Security headers for all pages

---

## Files Created

### 1. VERCEL_CONFIG_GUIDE.md
**What**: Detailed explanation of every setting in vercel.json
**When to read**: When you want to understand what each setting does
**Length**: ~500 lines

### 2. VERCEL_JSON_REFERENCE.md
**What**: Quick reference card for vercel.json
**When to read**: Quick lookup while deploying
**Length**: ~200 lines

### 3. VERCEL_DEPLOYMENT_CHECKLIST.md
**What**: Step-by-step checklist for deploying to Vercel
**When to read**: When you're actually deploying
**Length**: ~400 lines

### 4. VERCEL_SETUP_SUMMARY.md (This File)
**What**: Overview of Vercel setup
**When to read**: To understand what was done

---

## How Vercel Uses vercel.json

### When You Deploy

```
1. Push code to GitHub
   ↓
2. Vercel detects changes
   ↓
3. Reads vercel.json
   ↓
4. Runs: npm install --legacy-peer-deps
   ↓
5. Runs: npm run build
   ↓
6. Uploads .next folder
   ↓
7. Sets environment variables from dashboard
   ↓
8. Configures API routes
   ↓
9. Your app is live! 🚀
```

---

## What You Need to Do

### Step 1: Prepare Code (Local)
```bash
# Make sure everything is committed
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### Step 2: Get Credentials
Gather these before deploying:

| Credential | Where to Get |
|-----------|-------------|
| Supabase URL | Supabase Dashboard → Settings → API → Project URL |
| Supabase Anon Key | Supabase Dashboard → Settings → API → anon key |
| Supabase Service Role Key | Supabase Dashboard → Settings → API → service_role key |
| Railway Backend URL | Railway Dashboard → Your Service → Public URL |
| Groq API Key (optional) | https://console.groq.com/keys |

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repo
3. Set root directory to `pipeline`
4. Add environment variables (see Step 2)
5. Click "Deploy"

### Step 4: Verify
1. Wait for build to complete (2-3 minutes)
2. Visit your Vercel URL
3. Test the app
4. Check for errors in console

---

## Environment Variables Explained

### What They Do

| Variable | Purpose | Visible To |
|----------|---------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Connect to database | Browser (public) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Authenticate with database | Browser (public) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin database access | Server only (secret) |
| `NEXT_PUBLIC_PYTHON_SERVICE_URL` | Call Python backend | Browser (public) |
| `GROQ_API_KEY` | AI features | Server only (secret) |

### How to Set Them

**In Vercel Dashboard**:
1. Go to Settings → Environment Variables
2. Add each variable
3. Click "Save"
4. Redeploy

**In .env.local (Local Only)**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_PYTHON_SERVICE_URL=http://localhost:8000
GROQ_API_KEY=gsk_...
```

---

## Vercel Configuration Breakdown

### Build Settings
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps"
}
```
**What it does**: Tells Vercel how to build your app

### API Configuration
```json
{
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  }
}
```
**What it does**: Configures API routes (60-second timeout, 1 GB memory)

### Headers
```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Access-Control-Allow-Origin", "value": "*" }
      ]
    }
  ]
}
```
**What it does**: Adds HTTP headers to API responses (enables CORS)

### Redirects
```json
{
  "redirects": [
    {
      "source": "/",
      "destination": "/console",
      "permanent": false
    }
  ]
}
```
**What it does**: Redirects home page to console

---

## Common Questions

### Q: Do I need to modify vercel.json?
**A**: No, it's already configured correctly. Just push it to GitHub.

### Q: Where do I set environment variables?
**A**: In Vercel Dashboard → Settings → Environment Variables

### Q: What if I forget to set a variable?
**A**: Your app will fail to build. Vercel will show an error.

### Q: Can I test locally first?
**A**: Yes! Create `.env.local` with the same variables and run `npm run build && npm run start`

### Q: How do I redeploy?
**A**: Just push to GitHub. Vercel automatically redeploys.

### Q: What if deployment fails?
**A**: Check the build logs in Vercel dashboard. Common issues:
- Missing environment variable
- Build command failed
- API route not found

### Q: Can I use a custom domain?
**A**: Yes! Go to Vercel Settings → Domains

---

## Deployment Checklist

Before clicking "Deploy":

- [ ] Code is pushed to GitHub
- [ ] vercel.json is in project root
- [ ] package.json has correct scripts
- [ ] You have all credentials ready
- [ ] Railway backend is deployed
- [ ] You tested build locally: `npm run build`

---

## After Deployment

### Immediate (First 5 minutes)
- [ ] Check build status in Vercel
- [ ] Visit your Vercel URL
- [ ] Check for console errors (F12)

### First Hour
- [ ] Test creating a model
- [ ] Test starting training
- [ ] Check backend connection
- [ ] Monitor Vercel logs

### First Day
- [ ] Test full training flow
- [ ] Verify models upload to HuggingFace
- [ ] Share URL with team
- [ ] Monitor for errors

---

## Files in Your Project

```
pipeline/
├── vercel.json                          ← Vercel configuration
├── VERCEL_CONFIG_GUIDE.md               ← Detailed guide
├── VERCEL_JSON_REFERENCE.md             ← Quick reference
├── VERCEL_DEPLOYMENT_CHECKLIST.md       ← Deployment steps
├── VERCEL_SETUP_SUMMARY.md              ← This file
├── package.json
├── next.config.ts
├── app/
│   ├── api/
│   │   └── train-real/
│   │       └── route.ts
│   └── ...
└── ...
```

---

## Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Dashboard**: https://app.supabase.com
- **Railway Dashboard**: https://railway.app

---

## Summary

### What Was Done
✅ Created comprehensive `vercel.json` configuration
✅ Configured build settings
✅ Configured environment variables
✅ Configured API routes
✅ Added security headers
✅ Created detailed documentation

### What You Need to Do
1. Gather credentials
2. Push code to GitHub
3. Go to Vercel and import project
4. Set environment variables
5. Click Deploy
6. Test the app

### Result
Your Pipeline AI will be live on Vercel in ~30 minutes! 🚀

---

## Next Steps

1. **Read**: VERCEL_DEPLOYMENT_CHECKLIST.md
2. **Gather**: All required credentials
3. **Deploy**: Follow the checklist
4. **Test**: Verify everything works
5. **Share**: Your Vercel URL with team

---

**You're all set!** Your Vercel configuration is complete and ready to deploy. 🎉
