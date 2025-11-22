# API Integration Guide: Frontend ↔ Backend

Your Next.js frontend needs to call the Python FastAPI backend. Here's how to set it up correctly for both local development and production deployment.

---

## Current Setup ✅

Your frontend already has the correct API route:

```@/app/api/train-real/route.ts#1:10
import { NextResponse } from 'next/server'

// Use NEXT_PUBLIC_PYTHON_SERVICE_URL for production (set in Vercel)
// Fallback to PYTHON_SERVICE_URL for backward compatibility
// Default to localhost for local development
const PYTHON_SERVICE_URL = 
  process.env.NEXT_PUBLIC_PYTHON_SERVICE_URL || 
  process.env.PYTHON_SERVICE_URL || 
  'http://localhost:8000'
```

This route:
1. ✅ Uses `NEXT_PUBLIC_PYTHON_SERVICE_URL` (set in Vercel)
2. ✅ Falls back to `PYTHON_SERVICE_URL` (for server-side)
3. ✅ Defaults to `http://localhost:8000` (for local dev)

---

## How It Works

### Local Development (Both services running locally)
```
Frontend (localhost:3000)
    ↓
Next.js API Route (/api/train-real)
    ↓
Python Backend (localhost:8000)
```

**Environment:** `PYTHON_SERVICE_URL=http://localhost:8000` (default)

### Production (Frontend on Vercel, Backend on Railway)
```
Frontend (your-app.vercel.app)
    ↓
Next.js API Route (/api/train-real)
    ↓
Python Backend (your-project.railway.app)
```

**Environment:** `NEXT_PUBLIC_PYTHON_SERVICE_URL=https://your-project.railway.app`

---

## Setting Up Environment Variables

### Local Development

Create `.env.local` in the `pipeline` folder:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Python Backend (local)
PYTHON_SERVICE_URL=http://localhost:8000

# APIs
GROQ_API_KEY=your_groq_key
```

### Production (Vercel)

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |
| `NEXT_PUBLIC_PYTHON_SERVICE_URL` | `https://your-project.railway.app` |
| `GROQ_API_KEY` | Your Groq API key |

**Important:** Only variables starting with `NEXT_PUBLIC_` are exposed to the browser.

---

## API Endpoints

### Training Endpoints

#### Start Training
```typescript
// POST /api/train-real
const response = await fetch('/api/train-real', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model_id: 'model-123',
    model_name: 'My Model',
    creation_mode: 'fine-tune',
    training_mode: 'supervised',
    model_type: 'text-classification',
    task_type: 'classification',
    dataset_source: 'huggingface',
    dataset_name: 'imdb',
    base_model: 'distilbert-base-uncased',
    compute_type: 'cpu',
    epochs: 3,
    batch_size: 8,
    learning_rate: 2e-5,
    hf_token: 'your_hf_token',
    groq_api_key: 'your_groq_key'
  })
});

const result = await response.json();
// Returns: { success: true, model_id: 'model-123', message: 'Training started' }
```

#### Get Training Status
```typescript
// GET /api/train-real?modelId=model-123
const response = await fetch('/api/train-real?modelId=model-123');
const status = await response.json();
// Returns: {
//   status: 'training',
//   progress: 45.5,
//   current_epoch: 1,
//   total_epochs: 3,
//   metrics: { loss: 0.234 },
//   logs: ['Starting training...', 'Epoch 1/3 - Loss: 0.234']
// }
```

---

## Frontend Implementation Example

### In Your Component

```typescript
// components/TrainingForm.tsx
'use client'

import { useState } from 'react'

export function TrainingForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelId, setModelId] = useState<string | null>(null)

  const handleStartTraining = async (formData: any) => {
    setLoading(true)
    setError(null)

    try {
      // Call your Next.js API route
      const response = await fetch('/api/train-real', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Training failed')
      }

      const result = await response.json()
      setModelId(result.model_id)

      // Poll for status updates
      pollTrainingStatus(result.model_id)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const pollTrainingStatus = async (modelId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/train-real?modelId=${modelId}`)
        const status = await response.json()

        console.log('Training status:', status)

        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(interval)
        }

      } catch (err) {
        console.error('Status check failed:', err)
      }
    }, 5000) // Poll every 5 seconds
  }

  return (
    <div>
      {error && <div className="error">{error}</div>}
      {modelId && <div className="success">Training started: {modelId}</div>}
      {/* Your form JSX here */}
    </div>
  )
}
```

---

## Troubleshooting

### "Cannot connect to Python service"

**Symptom:** Error message about connection refused

**Solution:**
1. Check if Python backend is running:
   ```bash
   curl http://localhost:8000
   # Should return: {"message": "Pipeline AI Training Service", "status": "running"}
   ```

2. Verify environment variable:
   ```bash
   echo $PYTHON_SERVICE_URL
   # Should show: http://localhost:8000 (local) or https://your-project.railway.app (prod)
   ```

3. Check CORS is enabled in `python-service/main.py`:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # ✅ Should be present
       allow_credentials=True,
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### "Training API error" on Vercel

**Symptom:** Works locally but fails on Vercel

**Solution:**
1. Verify `NEXT_PUBLIC_PYTHON_SERVICE_URL` is set in Vercel
2. Test the URL directly:
   ```bash
   curl https://your-project.railway.app
   ```
3. Check Railway backend logs for errors

### "CORS error"

**Symptom:** Browser console shows CORS error

**Solution:**
- CORS is already enabled in your Python backend
- If still getting errors, check that the backend URL is correct
- Verify Railway service is running

### "Training times out"

**Symptom:** Training starts but never completes

**Solution:**
- This is normal for long training jobs
- The frontend polls every 5 seconds
- Training happens in the background on the backend
- Check Railway logs to see actual progress

---

## API Response Format

### Successful Training Start
```json
{
  "success": true,
  "model_id": "model-123",
  "message": "Training started"
}
```

### Training Status
```json
{
  "status": "training",
  "progress": 45.5,
  "current_epoch": 1,
  "total_epochs": 3,
  "metrics": {
    "loss": 0.234,
    "accuracy": 0.92
  },
  "logs": [
    "Analyzing dataset and model requirements...",
    "Loading dataset: imdb",
    "Preparing model and tokenizer...",
    "Starting training...",
    "Epoch 1/3 - Loss: 0.234"
  ]
}
```

### Completed Training
```json
{
  "status": "completed",
  "progress": 100,
  "current_epoch": 3,
  "total_epochs": 3,
  "metrics": {
    "final": {
      "eval_loss": 0.123,
      "eval_accuracy": 0.95
    }
  },
  "hf_url": "https://huggingface.co/username/model-name-123456",
  "logs": [
    "...",
    "Training completed! Model available at: https://huggingface.co/username/model-name-123456"
  ]
}
```

### Error Response
```json
{
  "error": "Training service error: Invalid dataset",
  "hint": "Make sure the Python training service is running on port 8000"
}
```

---

## Testing Locally

### Test Backend Directly
```bash
# Check if service is running
curl http://localhost:8000

# Start a training job
curl -X POST http://localhost:8000/train \
  -H "Content-Type: application/json" \
  -d '{
    "model_id": "test-123",
    "model_name": "Test Model",
    "creation_mode": "fine-tune",
    "training_mode": "supervised",
    "model_type": "text-classification",
    "task_type": "classification",
    "dataset_source": "auto",
    "compute_type": "cpu",
    "epochs": 1,
    "batch_size": 8,
    "learning_rate": 2e-5,
    "hf_token": "your_token"
  }'

# Check training status
curl http://localhost:8000/status/test-123
```

### Test Frontend API Route
```bash
# Start training via Next.js API
curl -X POST http://localhost:3000/api/train-real \
  -H "Content-Type: application/json" \
  -d '{ ... training request ... }'

# Check status via Next.js API
curl http://localhost:3000/api/train-real?modelId=test-123
```

---

## Summary

| Environment | Backend URL | Set In |
|-------------|------------|--------|
| **Local Dev** | `http://localhost:8000` | `.env.local` (default) |
| **Production** | `https://your-project.railway.app` | Vercel dashboard |

Your frontend automatically uses the correct URL based on the environment!
