# Architecture Diagram: Pipeline AI

Visual representation of how Pipeline AI is structured and deployed.

---

## 🏗️ System Architecture

### Local Development
```
┌─────────────────────────────────────────────────────────────────┐
│                     Your Computer (Local)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐         ┌──────────────────────┐      │
│  │   Next.js Frontend   │         │  Python FastAPI      │      │
│  │   (localhost:3000)   │◄───────►│  (localhost:8000)    │      │
│  │                      │         │                      │      │
│  │  - Web UI            │         │  - Model Training    │      │
│  │  - Forms             │         │  - HF Integration    │      │
│  │  - Status Display    │         │  - Background Tasks  │      │
│  └──────────────────────┘         └──────────────────────┘      │
│           ▲                                   ▲                   │
│           │                                   │                  │
│           └───────────────────┬───────────────┘                  │
│                               │                                   │
│                        npm run dev                               │
│                        python main.py                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Production Deployment
```
┌──────────────────────────────────────────────────────────────────┐
│                         Internet                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌────────────────────────┐         ┌────────────────────────┐  │
│  │   Vercel (Frontend)    │         │  Railway (Backend)     │  │
│  │ your-app.vercel.app    │◄───────►│ your-project.railway   │  │
│  │                        │         │                        │  │
│  │  - Next.js Build       │         │  - FastAPI Server      │  │
│  │  - Static Assets       │         │  - Model Training      │  │
│  │  - API Routes          │         │  - HF Integration      │  │
│  │  - HTTPS               │         │  - HTTPS               │  │
│  └────────────────────────┘         └────────────────────────┘  │
│           ▲                                   ▲                   │
│           │                                   │                  │
│           │         NEXT_PUBLIC_              │                  │
│           │         PYTHON_SERVICE_URL        │                  │
│           │                                   │                  │
│           └───────────────────┬───────────────┘                  │
│                               │                                   │
│                    Environment Variable                          │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow

### Training Request Flow
```
User Interface
    ↓
[Create Model Form]
    ↓
POST /api/train-real
    ↓
Next.js API Route
    ↓
NEXT_PUBLIC_PYTHON_SERVICE_URL/train
    ↓
FastAPI Backend
    ↓
[Start Training in Background]
    ↓
Return: { success: true, model_id: "..." }
    ↓
Frontend Polls Status
    ↓
GET /api/train-real?modelId=...
    ↓
NEXT_PUBLIC_PYTHON_SERVICE_URL/status/{model_id}
    ↓
FastAPI Backend Returns Status
    ↓
Frontend Updates UI
    ↓
Training Complete
    ↓
Model Pushed to HuggingFace Hub
```

---

## 🔄 Request/Response Cycle

### Frontend to Backend Communication
```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Vercel)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  User clicks "Start Training"                                    │
│           ↓                                                       │
│  Collect form data                                               │
│           ↓                                                       │
│  POST /api/train-real                                            │
│           ↓                                                       │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Next.js API Route (/api/train-real)                    │    │
│  │                                                          │    │
│  │ 1. Read NEXT_PUBLIC_PYTHON_SERVICE_URL                 │    │
│  │ 2. Forward request to backend                          │    │
│  │ 3. Return response to frontend                         │    │
│  └─────────────────────────────────────────────────────────┘    │
│           ↓                                                       │
│  Receive response                                                │
│           ↓                                                       │
│  Display success message                                         │
│           ↓                                                       │
│  Start polling for status                                        │
│           ↓                                                       │
│  Every 5 seconds:                                                │
│    GET /api/train-real?modelId=...                              │
│           ↓                                                       │
│  Update progress bar                                             │
│           ↓                                                       │
│  When complete: Show HuggingFace link                            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Railway)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  Receive POST /train                                             │
│           ↓                                                       │
│  Validate request                                                │
│           ↓                                                       │
│  Initialize training job                                         │
│           ↓                                                       │
│  Return immediately with model_id                               │
│           ↓                                                       │
│  Start training in background                                    │
│           ↓                                                       │
│  Receive GET /status/{model_id}                                 │
│           ↓                                                       │
│  Return current training status                                  │
│           ↓                                                       │
│  Training completes                                              │
│           ↓                                                       │
│  Push model to HuggingFace                                       │
│           ↓                                                       │
│  Update status to "completed"                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

### Frontend (Vercel)
```
pipeline/
├── app/
│   ├── api/
│   │   └── train-real/
│   │       └── route.ts          ← API Route (forwards to backend)
│   ├── console/
│   │   ├── create/
│   │   │   └── page.tsx          ← Create model page
│   │   └── train/
│   │       └── [id]/
│   │           └── page.tsx      ← Training progress page
│   └── page.tsx                  ← Home page
├── components/                   ← React components
├── lib/                          ← Utilities
├── public/                       ← Static files
├── package.json                  ← Frontend dependencies
├── next.config.ts                ← Next.js config
├── tsconfig.json                 ← TypeScript config
├── tailwind.config.ts            ← Tailwind config
├── postcss.config.mjs            ← PostCSS config
├── vercel.json                   ← Vercel build config
└── .env.local                    ← Local environment variables
```

### Backend (Railway)
```
python-service/
├── main.py                       ← FastAPI application
│   ├── TrainingRequest           ← Request model
│   ├── TrainingStatus            ← Response model
│   ├── @app.post("/train")       ← Start training endpoint
│   ├── @app.get("/status/{id}")  ← Get status endpoint
│   ├── train_model()             ← Training logic
│   ├── load_training_dataset()   ← Dataset loading
│   └── analyze_model_description()← AI analysis
├── requirements.txt              ← Python dependencies
├── Dockerfile                    ← Container config
└── README.md                     ← Documentation
```

---

## 🔐 Environment Variables Flow

### Local Development
```
.env.local (Your Computer)
    ↓
PYTHON_SERVICE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ↓
npm run dev
    ↓
Frontend uses localhost:8000
Backend runs on localhost:8000
```

### Production
```
Vercel Dashboard
    ↓
NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-project.railway.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
    ↓
Vercel Build
    ↓
Frontend uses Railway URL
Backend runs on Railway
```

---

## 🚀 Deployment Flow

### Step 1: Deploy Backend
```
Your Code (GitHub)
    ↓
Railway Detects Changes
    ↓
Railway Builds Docker Image
    ↓
Railway Starts Container
    ↓
FastAPI Server Running
    ↓
Public URL: https://your-project.railway.app
```

### Step 2: Deploy Frontend
```
Your Code (GitHub)
    ↓
Vercel Detects Changes
    ↓
Vercel Runs: npm install
    ↓
Vercel Runs: next build
    ↓
Vercel Deploys .next folder
    ↓
Next.js Server Running
    ↓
Public URL: https://your-app.vercel.app
```

### Step 3: Connect Them
```
Vercel Dashboard
    ↓
Set NEXT_PUBLIC_PYTHON_SERVICE_URL
    ↓
= https://your-project.railway.app
    ↓
Vercel Redeploys
    ↓
Frontend Now Calls Railway Backend
```

---

## 🔄 Training Lifecycle

```
┌─────────────────────────────────────────────────────────────────┐
│                    Training Job Lifecycle                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. INITIALIZING                                                 │
│     └─ User submits form                                         │
│     └─ Job created with status "initializing"                   │
│                                                                   │
│  2. ANALYZING                                                    │
│     └─ AI analyzes model description (if from-scratch)          │
│     └─ Suggests configuration                                    │
│                                                                   │
│  3. LOADING_DATASET                                              │
│     └─ Download dataset from HuggingFace                         │
│     └─ Prepare data for training                                 │
│                                                                   │
│  4. PREPARING_MODEL                                              │
│     └─ Load base model or create from scratch                    │
│     └─ Initialize tokenizer                                      │
│                                                                   │
│  5. TRAINING                                                     │
│     └─ Run training loop                                         │
│     └─ Update progress every epoch                               │
│     └─ Save checkpoints                                          │
│                                                                   │
│  6. EVALUATING                                                   │
│     └─ Evaluate on test set                                      │
│     └─ Calculate metrics                                         │
│                                                                   │
│  7. DEPLOYING                                                    │
│     └─ Push to HuggingFace Hub                                   │
│     └─ Generate model URL                                        │
│                                                                   │
│  8. COMPLETED                                                    │
│     └─ Training finished                                         │
│     └─ Model available at HuggingFace                            │
│     └─ User can download/use model                               │
│                                                                   │
│  OR: FAILED                                                      │
│     └─ Error occurred                                            │
│     └─ Check logs for details                                    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Stack

### Frontend
```
┌─────────────────────────────────────────┐
│          Next.js 16.0.3                  │
├─────────────────────────────────────────┤
│  - React 19.2.0                         │
│  - TypeScript 5                         │
│  - Tailwind CSS 4                       │
│  - Lucide Icons                         │
│  - Recharts (Charts)                    │
│  - Supabase (Database)                  │
│  - Axios (HTTP)                         │
└─────────────────────────────────────────┘
```

### Backend
```
┌─────────────────────────────────────────┐
│          FastAPI 0.104.1                 │
├─────────────────────────────────────────┤
│  - Uvicorn (Server)                     │
│  - PyTorch 2.1.0                        │
│  - Transformers 4.36.0                  │
│  - HuggingFace Hub                      │
│  - Datasets 2.15.0                      │
│  - Groq API (AI Analysis)               │
│  - Pydantic (Validation)                │
└─────────────────────────────────────────┘
```

### Deployment
```
┌─────────────────────────────────────────┐
│          Vercel (Frontend)               │
│          Railway (Backend)               │
│          HuggingFace (Models)            │
│          Supabase (Database)             │
└─────────────────────────────────────────┘
```

---

## 🔗 Integration Points

### Frontend ↔ Backend
```
Frontend (Vercel)
    │
    ├─ NEXT_PUBLIC_PYTHON_SERVICE_URL
    │  (Environment Variable)
    │
    ├─ /api/train-real (Next.js Route)
    │  └─ POST: Start training
    │  └─ GET: Get status
    │
    └─ Polls every 5 seconds
       └─ Updates UI with progress
```

### Backend ↔ HuggingFace
```
FastAPI Backend (Railway)
    │
    ├─ HF_TOKEN (Environment Variable)
    │
    ├─ Trainer.push_to_hub()
    │  └─ Uploads trained model
    │
    └─ HfApi.whoami()
       └─ Gets username for model URL
```

### Backend ↔ Groq (Optional)
```
FastAPI Backend (Railway)
    │
    ├─ GROQ_API_KEY (Environment Variable)
    │
    └─ Groq API
       └─ Analyzes model description
       └─ Suggests configuration
```

---

## 📈 Scaling Architecture

### Current Setup (Small Scale)
```
1 Vercel Instance ↔ 1 Railway Instance
```

### Scaled Setup (Large Scale)
```
Vercel (Auto-scales)
    ↓
Load Balancer
    ↓
Multiple Railway Instances
    ↓
Shared Storage (Models, Logs)
    ↓
HuggingFace Hub
```

---

## 🎯 Summary

- **Frontend**: Next.js on Vercel (serverless)
- **Backend**: FastAPI on Railway (long-running)
- **Connection**: Environment variable `NEXT_PUBLIC_PYTHON_SERVICE_URL`
- **Database**: Supabase
- **Model Hub**: HuggingFace
- **Communication**: REST API (HTTP/HTTPS)
- **Cost**: ~$5/month

---

**Architecture Version**: 1.0
**Last Updated**: 2025-01-22
**Status**: ✅ Production Ready
