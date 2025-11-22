# vercel.json Quick Reference

Your complete Vercel configuration at a glance.

---

## What Vercel Reads

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps",
  
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@next_public_supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@next_public_supabase_anon_key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase_service_role_key",
    "NEXT_PUBLIC_PYTHON_SERVICE_URL": "@next_public_python_service_url",
    "GROQ_API_KEY": "@groq_api_key"
  },
  
  "regions": ["iad1"],
  
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 60,
      "memory": 1024
    }
  },
  
  "redirects": [
    {
      "source": "/",
      "destination": "/console",
      "permanent": false
    }
  ],
  
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    },
    {
      "source": "/:path*",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    }
  ],
  
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## Environment Variables to Set in Vercel Dashboard

| Variable | Value | Required | Where to Get |
|----------|-------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ Yes | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | ✅ Yes | Supabase Dashboard → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ✅ Yes | Supabase Dashboard → Settings → API → service_role key |
| `NEXT_PUBLIC_PYTHON_SERVICE_URL` | Your Railway backend URL | ✅ Yes | Railway Dashboard → Your Service → Public URL |
| `GROQ_API_KEY` | Your Groq API key | ❌ Optional | https://console.groq.com/keys |

---

## How to Set Environment Variables

### In Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click your project
3. Settings → Environment Variables
4. Add each variable:
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://abcdefg.supabase.co`
5. Click "Save"
6. Redeploy

### In Vercel CLI

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
# Enter value when prompted
```

### Local Development (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
NEXT_PUBLIC_PYTHON_SERVICE_URL=http://localhost:8000
GROQ_API_KEY=gsk_...
```

---

## What Each Setting Does

### Build Settings
- **buildCommand**: `npm run build` - Compiles your Next.js app
- **outputDirectory**: `.next` - Where compiled app is stored
- **installCommand**: `npm install --legacy-peer-deps` - Installs dependencies

### Regions
- **regions**: `["iad1"]` - Deploy to Northern Virginia (fastest for US)

### API Functions
- **maxDuration**: `60` - API calls can run for 60 seconds max
- **memory**: `1024` - Each function gets 1 GB RAM

### Redirects
- `/` → `/console` - Home page redirects to console

### Headers
- **Cache-Control**: Don't cache API responses
- **CORS**: Allow cross-origin requests
- **Security**: Add security headers

### URLs
- **cleanUrls**: Remove `.html` extensions
- **trailingSlash**: No trailing slashes

---

## Deployment Flow

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
7. Sets environment variables
   ↓
8. Your app is live! 🚀
```

---

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails | Check `buildCommand` is correct |
| Environment variable not found | Add to Vercel dashboard |
| API returns 404 | Check `functions` configuration |
| CORS errors | Check `headers` configuration |
| Slow builds | Check `installCommand` has `--legacy-peer-deps` |

---

## File Location

```
pipeline/
├── vercel.json          ← This file
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

## Verification

Before deploying, verify:

```bash
# Check vercel.json exists
ls vercel.json

# Check it's valid JSON
cat vercel.json | jq .

# Check package.json has build script
cat package.json | grep '"build"'

# Test build locally
npm run build

# Test start locally
npm run start
```

---

## Summary

✅ **vercel.json tells Vercel**:
- How to build your app
- What environment variables to use
- How to configure API routes
- How to handle URLs and redirects
- What security headers to add

✅ **You need to**:
- Keep vercel.json in project root
- Set environment variables in Vercel dashboard
- Push code to GitHub
- Let Vercel deploy automatically

✅ **Result**: Your app deploys correctly every time! 🎉

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **This Guide**: See VERCEL_CONFIG_GUIDE.md for detailed explanations
