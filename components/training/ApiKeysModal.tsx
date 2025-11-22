'use client'

import { useState } from 'react'
import { AlertCircle, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react'

interface ApiKeysModalProps {
  onSubmit: (keys: ApiKeys) => void
  onSkip: () => void
}

export interface ApiKeys {
  hf_token?: string
  groq_api_key?: string
  compute_type: 'cpu' | 'gpu'
}

export default function ApiKeysModal({ onSubmit, onSkip }: ApiKeysModalProps) {
  const [showHfToken, setShowHfToken] = useState(false)
  const [showGroqKey, setShowGroqKey] = useState(false)
  const [hfToken, setHfToken] = useState('')
  const [groqKey, setGroqKey] = useState('')
  const [computeType, setComputeType] = useState<'cpu' | 'gpu'>('cpu')
  const [errors, setErrors] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: string[] = []

    if (hfToken.trim()) {
      if (!hfToken.startsWith('hf_')) {
        newErrors.push('HuggingFace token should start with "hf_"')
      }
      if (hfToken.length < 20) {
        newErrors.push('HuggingFace token seems too short')
      }
    }

    if (groqKey.trim()) {
      if (groqKey.length < 10) {
        newErrors.push('Groq API key seems too short')
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    onSubmit({
      hf_token: hfToken || undefined,
      groq_api_key: groqKey || undefined,
      compute_type: computeType,
    })
  }

  const handleSkip = () => {
    setErrors([])
    onSkip()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
          <h2 className="text-2xl font-bold">Configure Training</h2>
          <p className="text-blue-100 mt-1">
            Optionally provide API keys for enhanced features, or train with CPU
          </p>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Compute Type Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Compute Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setComputeType('cpu')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  computeType === 'cpu'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">CPU</div>
                <div className="text-sm text-gray-600 mt-1">
                  Free, slower training
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  15-25 min per epoch
                </div>
              </button>

              <button
                type="button"
                onClick={() => setComputeType('gpu')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  computeType === 'gpu'
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="font-semibold text-gray-900">GPU</div>
                <div className="text-sm text-gray-600 mt-1">
                  Faster training
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Requires Railway Pro
                </div>
              </button>
            </div>
          </div>

          {/* HuggingFace Token */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              HuggingFace API Token
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Needed to automatically push trained models to HuggingFace Hub. Get one at{' '}
              <a
                href="https://huggingface.co/settings/tokens"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                huggingface.co/settings/tokens
              </a>
            </p>
            <div className="relative">
              <input
                type={showHfToken ? 'text' : 'password'}
                value={hfToken}
                onChange={(e) => {
                  setHfToken(e.target.value)
                  setErrors(errors.filter(e => !e.includes('HuggingFace')))
                }}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowHfToken(!showHfToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showHfToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {hfToken && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                Token will be used to push models
              </div>
            )}
          </div>

          {/* Groq API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Groq API Key
              <span className="text-gray-500 font-normal ml-1">(Optional)</span>
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Enables AI-powered model analysis and recommendations. Get one at{' '}
              <a
                href="https://console.groq.com/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                console.groq.com/keys
              </a>
            </p>
            <div className="relative">
              <input
                type={showGroqKey ? 'text' : 'password'}
                value={groqKey}
                onChange={(e) => {
                  setGroqKey(e.target.value)
                  setErrors(errors.filter(e => !e.includes('Groq')))
                }}
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowGroqKey(!showGroqKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showGroqKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {groqKey && (
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <CheckCircle size={16} />
                AI analysis enabled
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              <div className="text-sm text-blue-900">
                <strong>No API keys?</strong> You can still train models using PyTorch on CPU.
                Models will be saved locally instead of pushed to HuggingFace.
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertTriangle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <div className="font-semibold text-red-900 mb-2">Please fix these issues:</div>
                  <ul className="text-sm text-red-800 space-y-1">
                    {errors.map((error, i) => (
                      <li key={i}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Skip (Train with CPU)
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Continue with Keys
            </button>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-500 text-center pt-2">
            Your API keys are only used during training and never stored.
          </div>
        </form>
      </div>
    </div>
  )
}
