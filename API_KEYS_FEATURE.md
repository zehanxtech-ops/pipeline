# API Keys Configuration Feature

## Overview

Before training starts, users are now prompted to optionally provide API keys. If they don't provide keys, the system defaults to **CPU-based PyTorch training** without any external dependencies.

---

## How It Works

### Flow

```
User clicks "Start Training"
    ↓
API Keys Modal appears
    ↓
User can either:
  A) Provide API keys + choose compute type
  B) Skip and use CPU training
    ↓
Training starts with selected configuration
```

### User Options

#### Option A: Provide API Keys (Recommended)
- **HuggingFace Token**: Automatically push trained models to HuggingFace Hub
- **Groq API Key**: Enable AI-powered model analysis and recommendations
- **Compute Type**: Choose CPU or GPU training

#### Option B: Skip (CPU Training Only)
- Train models locally using PyTorch on CPU
- No external API dependencies
- Models saved locally instead of pushed to HuggingFace
- Slower training but completely free

---

## Component Details

### ApiKeysModal Component

**Location**: `components/training/ApiKeysModal.tsx`

**Props**:
```typescript
interface ApiKeysModalProps {
  onSubmit: (keys: ApiKeys) => void
  onSkip: () => void
}

interface ApiKeys {
  hf_token?: string
  groq_api_key?: string
  compute_type: 'cpu' | 'gpu'
}
```

**Features**:
- ✅ Password input fields (hidden by default)
- ✅ Toggle visibility buttons
- ✅ Input validation
- ✅ Helpful links to get API keys
- ✅ Compute type selection (CPU vs GPU)
- ✅ Error messages for invalid tokens
- ✅ Info box explaining CPU-only option
- ✅ "Skip" button for CPU training

---

## Integration

### TrainingClient Changes

The `TrainingClient` component now:

1. **Shows modal before training**
   ```typescript
   const handleStartTraining = () => {
     setShowApiKeysModal(true)
   }
   ```

2. **Handles API keys submission**
   ```typescript
   const handleApiKeysSubmit = (keys: ApiKeys) => {
     setApiKeys(keys)
     setShowApiKeysModal(false)
     startTraining(keys)
   }
   ```

3. **Handles skip (CPU training)**
   ```typescript
   const handleApiKeysSkip = () => {
     setApiKeys({ compute_type: 'cpu' })
     setShowApiKeysModal(false)
     startTraining({ compute_type: 'cpu' })
   }
   ```

---

## User Experience

### Scenario 1: User with API Keys

1. User clicks "Start Training"
2. Modal appears
3. User enters:
   - HuggingFace token (from https://huggingface.co/settings/tokens)
   - Groq API key (from https://console.groq.com/keys)
   - Selects GPU if available
4. Clicks "Continue with Keys"
5. Training starts with all features enabled

**Result**: Model trains and automatically pushes to HuggingFace

### Scenario 2: User without API Keys

1. User clicks "Start Training"
2. Modal appears
3. User clicks "Skip (Train with CPU)"
4. Training starts with CPU only
5. Model trains locally

**Result**: Model trains locally, no external dependencies needed

---

## API Keys Explained

### HuggingFace Token

**Purpose**: Automatically push trained models to HuggingFace Hub

**How to get**:
1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it (e.g., "Pipeline AI")
4. Select "Write" access
5. Copy the token (starts with `hf_`)

**Format**: `hf_xxxxxxxxxxxxxxxxxxxx` (minimum 20 characters)

**What happens**:
- Model is automatically uploaded to HuggingFace
- User can share the model link
- Model is publicly available for others to use

### Groq API Key

**Purpose**: Enable AI-powered model analysis and recommendations

**How to get**:
1. Go to https://console.groq.com/keys
2. Click "Create API Key"
3. Copy the key (starts with `gsk_`)

**Format**: `gsk_xxxxxxxxxxxxxxxxxxxx` (minimum 10 characters)

**What happens**:
- AI analyzes the model description
- Suggests optimal hyperparameters
- Recommends dataset sources
- Provides training strategy

---

## Compute Type Selection

### CPU Training
- **Speed**: Slower (15-25 min per epoch)
- **Cost**: Free
- **Availability**: Always available
- **Best for**: Small datasets, testing, learning

### GPU Training
- **Speed**: Faster (10-15 min per epoch)
- **Cost**: Requires Railway Pro ($10-50/month)
- **Availability**: Only on Railway Pro
- **Best for**: Large datasets, production models

---

## Backend Integration

### Passing API Keys to Backend

The API keys are passed to the training request:

```typescript
const response = await fetch('/api/train-real', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ...trainingConfig,
    hf_token: apiKeys?.hf_token,
    groq_api_key: apiKeys?.groq_api_key,
    compute_type: apiKeys?.compute_type || 'cpu',
  })
})
```

### Backend Handling

In `python-service/main.py`:

```python
@app.post("/train")
async def start_training(request: TrainingRequest, background_tasks: BackgroundTasks):
    # If hf_token provided, login to HuggingFace
    if request.hf_token:
        login(token=request.hf_token)
    
    # If groq_api_key provided, analyze model description
    if request.groq_api_key:
        await analyze_model_description(request, model_id)
    
    # Use compute_type for device selection
    device = "cuda" if request.compute_type == "gpu" else "cpu"
    model.to(device)
```

---

## Security Considerations

### API Keys are NOT Stored

- ✅ Keys are only used during training
- ✅ Keys are not saved in database
- ✅ Keys are not logged
- ✅ Keys are passed directly to backend
- ✅ Backend uses them immediately and discards them

### Best Practices

1. **Use dedicated tokens**: Create separate tokens for this app
2. **Limit permissions**: Only grant necessary permissions
3. **Rotate regularly**: Change tokens periodically
4. **Monitor usage**: Check HuggingFace and Groq dashboards

---

## Error Handling

### Invalid Token Format

```
❌ HuggingFace token should start with "hf_"
❌ HuggingFace token seems too short
❌ Groq API key seems too short
```

**User sees**: Error messages in red box
**User action**: Correct the token and try again

### Missing Tokens (CPU Training)

```
✅ No API keys? You can still train models using PyTorch on CPU.
   Models will be saved locally instead of pushed to HuggingFace.
```

**User sees**: Info box explaining CPU-only option
**User action**: Click "Skip (Train with CPU)"

---

## Future Enhancements

### Planned Features

1. **Token validation**: Real-time validation against APIs
2. **Token storage**: Optional secure storage in user profile
3. **Multiple compute types**: TPU, custom hardware
4. **Batch training**: Train multiple models with same keys
5. **Cost estimation**: Show estimated cost before training
6. **Key management**: UI to manage saved API keys

---

## Testing

### Test Scenario 1: With API Keys

```bash
# Fill in both tokens
HuggingFace: hf_xxxxxxxxxxxxxxxxxxxx
Groq: gsk_xxxxxxxxxxxxxxxxxxxx
Compute: GPU

# Expected: Training starts with all features
```

### Test Scenario 2: Without API Keys

```bash
# Leave fields empty
# Click "Skip (Train with CPU)"

# Expected: Training starts with CPU only
```

### Test Scenario 3: Invalid Token

```bash
# Enter invalid token (too short)
# Click "Continue with Keys"

# Expected: Error message appears
```

---

## Files Modified

- **Created**: `components/training/ApiKeysModal.tsx`
- **Modified**: `components/training/TrainingClient.tsx`
  - Added state for API keys modal
  - Added handlers for submit/skip
  - Added modal to render output
  - Updated training start flow

---

## Summary

The API Keys feature provides a **flexible, user-friendly way** to configure training:

- ✅ Optional API keys for advanced features
- ✅ CPU training as fallback
- ✅ No forced dependencies
- ✅ Secure (keys not stored)
- ✅ Clear user guidance
- ✅ Error handling

Users can now choose their preferred training setup without friction!
