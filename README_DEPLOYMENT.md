# Pipeline AI - Deployment Ready! 🚀

Your AI model generator is ready for production deployment.

---

## ⚡ Quick Start (5 Minutes)

### Problem
Your `start.sh` script won't work on Vercel because it runs background processes.

### Solution
Deploy frontend and backend separately:
- **Frontend (Next.js)** → Vercel
- **Backend (Python)** → Railway

### Deploy Now
1. **Railway**: https://railway.app (deploy backend)
2. **Vercel**: https://vercel.com (deploy frontend)
3. **Connect**: Set `NEXT_PUBLIC_PYTHON_SERVICE_URL` in Vercel
4. **Done!** 🎉

---

## 📚 Documentation

All documentation is in the `pipeline` folder:

| Document | Purpose | Read Time |
|----------|---------|-----------|
| **[DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md)** | Navigation hub | 5 min |
| **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** | Quick reference | 2 min |
| **[STEP_BY_STEP_DEPLOYMENT.md](STEP_BY_STEP_DEPLOYMENT.md)** | Exact steps | 15 min |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | All options | 20 min |
| **[VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)** | Vercel setup | 15 min |
| **[API_INTEGRATION.md](API_INTEGRATION.md)** | API docs | 15 min |
| **[ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)** | Visual guide | 10 min |
| **[PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)** | Verification | 10 min |

---

## 🎯 Start Here

1. **Read**: [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md) (5 min)
2. **Follow**: [STEP_BY_STEP_DEPLOYMENT.md](STEP_BY_STEP_DEPLOYMENT.md) (15 min)
3. **Verify**: [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) (10 min)
4. **Deploy**: Follow the steps (10 min)
5. **Test**: Verify everything works (5 min)

**Total Time**: ~45 minutes to production! ⏱️

---

## 🏗️ Architecture

```
Your App (Vercel)  ←→  Python Backend (Railway)
https://your-app.vercel.app    https://your-project.railway.app
```

**How they connect**: Environment variable `NEXT_PUBLIC_PYTHON_SERVICE_URL`

---

## 📋 What You Get

### Documentation (10 files)
- ✅ Complete deployment guides
- ✅ Step-by-step instructions
- ✅ Troubleshooting guides
- ✅ Architecture diagrams
- ✅ API documentation
- ✅ Pre-deployment checklist

### Configuration (2 files)
- ✅ `vercel.json` - Vercel build config
- ✅ `railway.json` - Railway deployment config

### Code Updates (1 file)
- ✅ `start.sh` - Added `--frontend-only` flag

---

## 🚀 Deployment Steps

### 1. Deploy Backend to Railway (5 min)
```bash
# Go to https://railway.app
# Sign up with GitHub
# New Project → Deploy from GitHub
# Set environment variables:
#   HF_TOKEN = your_huggingface_token
#   GROQ_API_KEY = your_groq_key
# Deploy
# Copy the public URL
```

### 2. Deploy Frontend to Vercel (3 min)
```bash
# Go to https://vercel.com/new
# Import your GitHub repo
# Root directory: pipeline
# Set environment variables:
#   NEXT_PUBLIC_PYTHON_SERVICE_URL = https://your-railway-url
#   NEXT_PUBLIC_SUPABASE_URL = your_url
#   NEXT_PUBLIC_SUPABASE_ANON_KEY = your_key
#   SUPABASE_SERVICE_ROLE_KEY = your_key
#   GROQ_API_KEY = your_key
# Deploy
```

### 3. Test (5 min)
```bash
# Visit your Vercel URL
# Start a training job
# Watch it train and deploy to HuggingFace
```

---

## 💰 Cost

| Service | Cost |
|---------|------|
| Vercel | Free (100GB/month) |
| Railway | $5/month credit |
| HuggingFace | Free |
| Supabase | Free (500MB) |
| **Total** | **~$5/month** |

---

## 🔑 Environment Variables

### For Railway (Backend)
```
HF_TOKEN=your_huggingface_token
GROQ_API_KEY=your_groq_key
```

### For Vercel (Frontend)
```
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
SUPABASE_SERVICE_ROLE_KEY=your_key
NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-railway-url
GROQ_API_KEY=your_key
```

---

## 🧪 Local Development

### Full Local Stack
```bash
./start.sh
# Runs both backend and frontend locally
```

### Frontend Only (Backend on Railway)
```bash
export NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-railway-url
./start.sh --frontend-only
```

### Docker Compose
```bash
./start.sh --docker
```

---

## 📊 Technology Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- FastAPI
- PyTorch
- Transformers
- HuggingFace Hub
- Groq API

### Deployment
- Vercel (Frontend)
- Railway (Backend)
- HuggingFace (Models)
- Supabase (Database)

---

## ✅ Checklist

Before deploying:

- [ ] Code is pushed to GitHub
- [ ] No secrets in code
- [ ] Frontend builds locally: `npm run build`
- [ ] Backend runs locally: `python main.py`
- [ ] All environment variables are documented
- [ ] HuggingFace token is ready
- [ ] Supabase project is set up
- [ ] Groq API key is ready (optional)

---

## 🆘 Troubleshooting

### "Cannot connect to backend"
→ Check `NEXT_PUBLIC_PYTHON_SERVICE_URL` in Vercel

### "Build fails on Vercel"
→ Run `npm install && npm run build` locally first

### "Training times out"
→ Upgrade Railway to Pro tier

### "Model not uploading"
→ Verify `HF_TOKEN` is set in Railway

**More help**: See [STEP_BY_STEP_DEPLOYMENT.md](STEP_BY_STEP_DEPLOYMENT.md#troubleshooting)

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Next.js Docs**: https://nextjs.org/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com

---

## 🎓 Learn More

- **Architecture**: [ARCHITECTURE_DIAGRAM.md](ARCHITECTURE_DIAGRAM.md)
- **API Integration**: [API_INTEGRATION.md](API_INTEGRATION.md)
- **All Options**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Vercel Details**: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

## 🎉 You're Ready!

Everything is set up. You just need to:

1. ✅ Read the documentation
2. ✅ Follow the deployment steps
3. ✅ Set environment variables
4. ✅ Deploy to production

**Your Pipeline AI will be live in ~45 minutes!** 🚀

---

## 📝 Next Steps

1. **Read** [DEPLOYMENT_INDEX.md](DEPLOYMENT_INDEX.md)
2. **Follow** [STEP_BY_STEP_DEPLOYMENT.md](STEP_BY_STEP_DEPLOYMENT.md)
3. **Deploy** to Railway and Vercel
4. **Test** your production app
5. **Share** with your team

---

**Status**: ✅ Ready for Production
**Created**: 2025-01-22
**Version**: 1.0

Good luck! 🚀
