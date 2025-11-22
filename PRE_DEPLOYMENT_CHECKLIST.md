# Pre-Deployment Checklist

Use this checklist to ensure everything is ready before deploying to production.

---

## Code Quality

- [ ] All code is committed to GitHub
- [ ] No hardcoded API keys or secrets in code
- [ ] `.gitignore` includes `.env.local` and sensitive files
- [ ] No console.log() statements left in production code
- [ ] All imports are correct and dependencies are in `package.json`
- [ ] TypeScript compiles without errors: `npm run build`
- [ ] No unused dependencies in `package.json`

---

## Frontend (Next.js)

### Configuration
- [ ] `next.config.ts` is properly configured
- [ ] `tsconfig.json` is correct
- [ ] `tailwind.config.ts` is set up
- [ ] `postcss.config.mjs` is configured

### Environment Variables
- [ ] `.env.local` exists (for local development)
- [ ] `.env.production` exists (optional, for testing)
- [ ] All required variables are documented
- [ ] No secrets in `.env` files

### API Integration
- [ ] `/api/train-real` route exists and works
- [ ] API calls use `NEXT_PUBLIC_PYTHON_SERVICE_URL` environment variable
- [ ] Error handling is implemented
- [ ] CORS is properly configured

### Testing
- [ ] Frontend builds locally: `npm run build`
- [ ] Frontend runs locally: `npm run dev`
- [ ] API calls work with local backend
- [ ] API calls work with external backend (if available)

---

## Backend (Python FastAPI)

### Code Quality
- [ ] All Python code is properly formatted
- [ ] No hardcoded secrets in `main.py`
- [ ] Error handling is implemented
- [ ] Logging is set up

### Dependencies
- [ ] `requirements.txt` is up to date
- [ ] All dependencies are pinned to specific versions
- [ ] No unused dependencies

### Docker
- [ ] `Dockerfile` exists and is correct
- [ ] Dockerfile builds locally: `docker build -t pipeline-backend .`
- [ ] Container runs locally: `docker run -p 8000:8000 pipeline-backend`
- [ ] All environment variables are passed to container

### API Endpoints
- [ ] `GET /` returns service status
- [ ] `POST /train` accepts training requests
- [ ] `GET /status/{model_id}` returns training status
- [ ] CORS is enabled for all origins
- [ ] Error responses are properly formatted

### Testing
- [ ] Backend runs locally: `python main.py`
- [ ] API endpoints respond correctly
- [ ] Training works with real data
- [ ] Models are pushed to HuggingFace Hub

---

## Credentials & Secrets

### HuggingFace
- [ ] HuggingFace account created
- [ ] API token generated: https://huggingface.co/settings/tokens
- [ ] Token has write permissions
- [ ] Token is stored securely (not in code)

### Groq
- [ ] Groq account created (optional)
- [ ] API key generated: https://console.groq.com/keys
- [ ] API key is stored securely (not in code)

### Supabase
- [ ] Supabase project created
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] Service role key copied
- [ ] Keys are stored securely (not in code)

### GitHub
- [ ] Repository is public (or private if preferred)
- [ ] No secrets in repository
- [ ] `.gitignore` is properly configured

---

## Deployment Preparation

### GitHub
- [ ] Code is pushed to GitHub
- [ ] All changes are committed
- [ ] Branch is clean (no uncommitted changes)
- [ ] README is up to date

### Vercel Configuration
- [ ] `vercel.json` exists and is correct
- [ ] Build command is correct: `next build`
- [ ] Output directory is correct: `.next`
- [ ] Environment variables are documented

### Railway Configuration
- [ ] `railway.json` exists and is correct
- [ ] Dockerfile is in `python-service/`
- [ ] Start command is correct: `python main.py`
- [ ] Environment variables are documented

---

## Documentation

- [ ] `README.md` is up to date
- [ ] `DEPLOYMENT_GUIDE.md` is complete
- [ ] `STEP_BY_STEP_DEPLOYMENT.md` is accurate
- [ ] `API_INTEGRATION.md` is correct
- [ ] Environment variables are documented
- [ ] Troubleshooting guide is included

---

## Local Testing

### Frontend
- [ ] `npm install` works
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts without errors
- [ ] Frontend loads at `http://localhost:3000`
- [ ] All pages are accessible
- [ ] Forms work correctly

### Backend
- [ ] `pip install -r requirements.txt` works
- [ ] `python main.py` starts without errors
- [ ] Backend responds at `http://localhost:8000`
- [ ] All API endpoints work
- [ ] Training completes successfully

### Integration
- [ ] Frontend can call backend API
- [ ] Training jobs start and complete
- [ ] Models are uploaded to HuggingFace
- [ ] Status updates are received
- [ ] Error handling works

---

## Pre-Deployment Testing

### With External Backend (if available)
- [ ] Set `NEXT_PUBLIC_PYTHON_SERVICE_URL` to external URL
- [ ] Frontend can connect to external backend
- [ ] Training works with external backend
- [ ] All features work end-to-end

### Build Verification
- [ ] Frontend builds without errors
- [ ] Backend builds without errors
- [ ] No warnings in build output
- [ ] Build artifacts are correct

---

## Security Checklist

- [ ] No API keys in code
- [ ] No passwords in code
- [ ] No secrets in environment files
- [ ] `.gitignore` includes all sensitive files
- [ ] CORS is properly configured
- [ ] Input validation is implemented
- [ ] Error messages don't expose sensitive info
- [ ] HTTPS is enforced (Vercel does this automatically)

---

## Performance Checklist

- [ ] Frontend bundle size is reasonable
- [ ] No unused dependencies
- [ ] Images are optimized
- [ ] API responses are fast
- [ ] Database queries are efficient
- [ ] No memory leaks in backend

---

## Monitoring Setup

- [ ] Vercel analytics are enabled
- [ ] Railway logs are accessible
- [ ] Error tracking is set up (optional)
- [ ] Performance monitoring is set up (optional)
- [ ] Alerts are configured (optional)

---

## Final Checks

- [ ] All checklist items are complete
- [ ] Code is ready for production
- [ ] Credentials are secure
- [ ] Documentation is complete
- [ ] Team is informed about deployment
- [ ] Rollback plan is in place (if needed)

---

## Deployment Day

### Before Deploying
- [ ] Review all changes one more time
- [ ] Ensure no breaking changes
- [ ] Notify team of deployment
- [ ] Have rollback plan ready

### During Deployment
- [ ] Follow `STEP_BY_STEP_DEPLOYMENT.md` exactly
- [ ] Monitor build progress
- [ ] Check for errors in logs
- [ ] Verify environment variables are set

### After Deployment
- [ ] Test all features on production
- [ ] Check logs for errors
- [ ] Monitor performance
- [ ] Verify models are uploading to HuggingFace
- [ ] Share production URL with team

---

## Post-Deployment

- [ ] Monitor logs daily for errors
- [ ] Check HuggingFace Hub for uploaded models
- [ ] Verify training jobs complete successfully
- [ ] Track costs and usage
- [ ] Plan for scaling if needed
- [ ] Update documentation with lessons learned

---

## Troubleshooting

If something goes wrong:

1. **Check logs** in Vercel and Railway dashboards
2. **Verify environment variables** are set correctly
3. **Test locally** to isolate the issue
4. **Check documentation** for known issues
5. **Rollback** if necessary
6. **Fix the issue** locally
7. **Redeploy** when ready

---

## Success Criteria

✅ Deployment is successful when:
- Frontend is accessible at Vercel URL
- Backend is accessible at Railway URL
- Frontend can call backend API
- Training jobs start and complete
- Models are uploaded to HuggingFace
- No errors in logs
- All features work as expected

---

## Notes

Use this space to track any issues or notes:

```
Issue: 
Solution: 
Date: 
```

---

## Sign-Off

- [ ] I have completed all checklist items
- [ ] I am ready to deploy to production
- [ ] I understand the deployment process
- [ ] I have a rollback plan if needed

**Deployment Date**: _______________

**Deployed By**: _______________

**Status**: ✅ Ready / ⚠️ Hold / ❌ Not Ready
