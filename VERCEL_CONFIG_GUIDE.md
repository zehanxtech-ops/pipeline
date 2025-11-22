# Vercel Configuration Guide

Complete explanation of the `vercel.json` configuration for Pipeline AI.

---

## What is vercel.json?

The `vercel.json` file tells Vercel **exactly how to build, deploy, and run your Next.js application**. Without it, Vercel uses defaults which may not be optimal for your project.

---

## Configuration Breakdown

### 1. Build Settings

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps"
}
```

**What it does**:
- **buildCommand**: Runs `npm run build` to compile Next.js
- **outputDirectory**: Tells Vercel where the compiled app is (`.next` folder)
- **installCommand**: Installs dependencies with `--legacy-peer-deps` flag
  - This flag is needed because some packages have peer dependency conflicts
  - Vercel will run this before building

**Why it matters**:
- Without this, Vercel might use wrong build command
- Ensures consistent builds across deployments

---

### 2. Environment Variables

```json
{
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "NEXT_PUBLIC_PYTHON_SERVICE_URL": "@next_public_python_service_url",
    "GROQ_API_KEY": "@groq_api_key"
  }
}
```

**What it does**:
- Defines which environment variables your app needs
- The `@` prefix tells Vercel to read from dashboard settings
- Variables starting with `NEXT_PUBLIC_` are exposed to browser
- Variables without prefix are server-side only

**How to set them in Vercel**:
1. Go to Vercel Dashboard → Your Project → Settings
2. Go to "Environment Variables"
3. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your actual Supabase URL
4. Repeat for all variables

**Important**:
- `NEXT_PUBLIC_*` variables are visible in browser (safe for public data)
- `SUPABASE_SERVICE_ROLE_KEY` is server-only (never exposed to browser)
- `GROQ_API_KEY` is optional (only needed for AI features)

---

### 3. Regions

```json
{
  "regions": ["iad1"]
}
```

**What it does**:
- Deploys your app to the `iad1` region (Northern Virginia, USA)
- This is Vercel's default and fastest region

**Other regions**:
- `sfo1` - San Francisco
- `lhr1` - London
- `syd1` - Sydney
- `fra1` - Frankfurt

**Why it matters**:
- Affects latency for your users
- Choose region closest to your users

---

### 4. API Functions Configuration

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

**What it does**:
- Configures all API routes in `app/api/` folder
- **maxDuration**: API calls can run for max 60 seconds
- **memory**: Each function gets 1024 MB (1 GB) of RAM

**Why it matters**:
- Your `/api/train-real` route needs these settings
- 60 seconds is enough for API calls to Python backend
- 1 GB memory is standard for Next.js API routes

**Note**: Vercel free tier has 10-second timeout, Pro tier allows up to 60 seconds

---

### 5. Redirects

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

**What it does**:
- When user visits `/`, redirect to `/console`
- `permanent: false` means temporary redirect (302)

**Why it matters**:
- Your app's home page is `/console`, not `/`
- Ensures users land on the right page

---

### 6. Headers

```json
{
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        },
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
```

**What it does**:
- Sets HTTP headers for all API routes
- **Cache-Control**: Don't cache API responses
- **CORS headers**: Allow requests from any origin

**Why it matters**:
- Prevents stale API responses
- Allows frontend to call backend API
- Enables cross-origin requests

---

### 7. Rewrites

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

**What it does**:
- Routes all `/api/*` requests to Next.js API handlers
- User sees `/api/train-real` in URL
- Vercel internally routes to the handler

**Why it matters**:
- Ensures API routes work correctly
- Maintains clean URLs

---

### 8. URL Settings

```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

**What it does**:
- **cleanUrls**: Remove `.html` extensions from URLs
- **trailingSlash**: Don't add trailing slashes

**Examples**:
- ✅ `/console` (not `/console/` or `/console.html`)
- ✅ `/api/train-real` (not `/api/train-real/`)

**Why it matters**:
- Cleaner, more professional URLs
- Better for SEO

---

## How Vercel Uses This File

### Step 1: Read Configuration
```
Vercel reads vercel.json
    ↓
Extracts all settings
```

### Step 2: Install Dependencies
```
npm install --legacy-peer-deps
    ↓
Installs all packages from package.json
```

### Step 3: Build
```
npm run build
    ↓
Compiles Next.js to .next folder
```

### Step 4: Deploy
```
Uploads .next folder to Vercel servers
    ↓
Sets up environment variables
    ↓
Configures API routes
    ↓
Your app is live!
```

---

## What Each Variable Does

### NEXT_PUBLIC_SUPABASE_URL
- **Purpose**: Connect to Supabase database
- **Visible to**: Browser (public)
- **Get from**: Supabase Dashboard → Settings → API → Project URL
- **Example**: `https://abcdefg.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Purpose**: Authenticate with Supabase (public)
- **Visible to**: Browser (public)
- **Get from**: Supabase Dashboard → Settings → API → anon key
- **Example**: `eyJhbGc...` (long string)

### SUPABASE_SERVICE_ROLE_KEY
- **Purpose**: Admin access to Supabase (server-side only)
- **Visible to**: Server only (secret)
- **Get from**: Supabase Dashboard → Settings → API → service_role key
- **Example**: `eyJhbGc...` (long string)
- **⚠️ IMPORTANT**: Never expose this to browser!

### NEXT_PUBLIC_PYTHON_SERVICE_URL
- **Purpose**: URL of your Python backend
- **Visible to**: Browser (public)
- **Get from**: Railway Dashboard → Your Service → Public URL
- **Example**: `https://pipeline-production.up.railway.app`

### GROQ_API_KEY
- **Purpose**: Enable AI features (optional)
- **Visible to**: Server only (secret)
- **Get from**: https://console.groq.com/keys
- **Example**: `gsk_xxxxxxxxxxxxxxxxxxxx`

---

## Setting Environment Variables in Vercel

### Method 1: Via Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to Settings → Environment Variables
4. Add each variable:
   ```
   Name: NEXT_PUBLIC_SUPABASE_URL
   Value: https://abcdefg.supabase.co
   ```
5. Click "Save"
6. Redeploy for changes to take effect

### Method 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Set environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL

# You'll be prompted to enter the value
# Then select which environments (production, preview, development)
```

### Method 3: Via .env.local (Local Development Only)

Create `.env.local` in your project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_PYTHON_SERVICE_URL=http://localhost:8000
GROQ_API_KEY=gsk_...
```

**⚠️ Important**: `.env.local` is in `.gitignore` and never pushed to GitHub

---

## Troubleshooting

### "Build failed: npm ERR!"

**Solution**: The `--legacy-peer-deps` flag handles peer dependency conflicts
- Vercel automatically uses this flag
- If still failing, check package.json for conflicting versions

### "Cannot find module '@supabase/...'"

**Solution**: Dependencies not installed
- Check package.json has all dependencies
- Run locally: `npm install`
- Vercel will use `installCommand` to install

### "Environment variable not found"

**Solution**: Variable not set in Vercel dashboard
1. Go to Vercel Settings → Environment Variables
2. Add the missing variable
3. Redeploy the project

### "API calls return 404"

**Solution**: API routes not configured correctly
- Check `functions` section in vercel.json
- Ensure API files are in `app/api/` folder
- Verify file names match routes

### "CORS errors in browser"

**Solution**: CORS headers not set
- Check `headers` section in vercel.json
- Ensure `Access-Control-Allow-Origin` is set
- Redeploy after changes

---

## Best Practices

### 1. Use Environment Variables
✅ Store secrets in Vercel dashboard
❌ Don't hardcode API keys in code

### 2. Protect Sensitive Data
✅ Use `SUPABASE_SERVICE_ROLE_KEY` for server-side only
❌ Don't expose service keys to browser

### 3. Set Correct Timeouts
✅ 60 seconds for API routes is reasonable
❌ Don't set too high (wastes resources)

### 4. Use Appropriate Regions
✅ Choose region closest to users
❌ Don't use multiple regions unless needed

### 5. Test Locally First
✅ Run `npm run build && npm run start` locally
❌ Don't deploy without testing

---

## Verification Checklist

- [ ] vercel.json exists in project root
- [ ] buildCommand is `npm run build`
- [ ] outputDirectory is `.next`
- [ ] All environment variables are defined
- [ ] Environment variables are set in Vercel dashboard
- [ ] API functions have correct timeout (60 seconds)
- [ ] Redirects are configured
- [ ] Headers are set for API routes
- [ ] cleanUrls is true
- [ ] trailingSlash is false

---

## Summary

The `vercel.json` file:
- ✅ Tells Vercel how to build your app
- ✅ Defines environment variables
- ✅ Configures API routes
- ✅ Sets up redirects and headers
- ✅ Ensures consistent deployments

**Without it**: Vercel uses defaults (may not work correctly)
**With it**: Everything works as intended! 🚀

---

## Next Steps

1. ✅ Verify vercel.json is in your project root
2. ✅ Push to GitHub
3. ✅ Go to Vercel Dashboard
4. ✅ Import your repository
5. ✅ Set environment variables
6. ✅ Deploy!

Your app will now deploy correctly with all settings configured! 🎉
