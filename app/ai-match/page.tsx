'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Send, ArrowRight, AlertCircle } from 'lucide-react'
import { aiExampleQueries } from '@/lib/data'

function AIMatchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { summary: string, recommendations: any[], followUpQuestion?: string }>(null)
  const [error, setError] = useState('')
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('amalgus_role') || 'homeowner' : 'homeowner'

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); handleSubmit(q) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (q?: string) => {
    const finalQuery = q || query
    if (!finalQuery.trim()) return
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, userRole }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="w-14 h-14 rounded-2xl bg-[#1E88E5]/20 flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-[#1E88E5]" />
        </div>
        <h1 className="text-3xl font-bold mb-3">AI Glass Matching</h1>
        <p className="text-white/60">Describe your project in plain language. Our AI will recommend the right glass type, thickness, and process.</p>
      </div>

      {/* Input */}
      <div className="glass-card p-6 mb-6">
        <textarea value={query} onChange={e => setQuery(e.target.value)}
          placeholder="e.g. I need glass for my bathroom shower enclosure..."
          className="w-full bg-transparent text-white placeholder-white/30 text-sm resize-none outline-none min-h-[80px]"
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit() }} />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-white/30 text-xs">Press ⌘+Enter or click Send</span>
          <button onClick={() => handleSubmit()}
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#1E88E5] text-white text-sm font-medium hover:bg-[#1976D2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            {loading ? 'Analysing...' : <><Send size={14} /> Get Recommendation</>}
          </button>
        </div>
      </div>

      {/* Example chips */}
      {!result && !loading && (
        <div className="flex flex-wrap gap-2 mb-8">
          {aiExampleQueries.map(q => (
            <button key={q} onClick={() => { setQuery(q); handleSubmit(q) }}
              className="px-3 py-1.5 rounded-full border border-white/10 text-white/50 text-xs hover:border-[#1E88E5]/40 hover:text-white/80 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="glass-card p-8 text-center">
          <div className="w-8 h-8 border-2 border-[#1E88E5] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60 text-sm">Analysing your requirement with glass industry knowledge...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="glass-card p-4 border-red-500/30 flex items-start gap-3">
          <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <div className="glass-card p-5 border-[#1E88E5]/20">
            <p className="text-white/80 text-sm leading-relaxed">{result.summary}</p>
          </div>
          {result.recommendations?.map((rec: any, i: number) => (
            <div key={i} className="glass-card p-6 hover:border-[#1E88E5]/40 transition-all">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#1E88E5]/20 text-[#90CAF9]">
                      {i === 0 ? 'Best Match' : `Option ${i + 1}`}
                    </span>
                    <span className="text-xs text-white/40">{rec.thickness} · {rec.process}</span>
                  </div>
                  <h3 className="font-bold text-lg">{rec.glassType} Glass</h3>
                </div>
                <span className="text-[#1E88E5] font-semibold text-sm shrink-0">{rec.priceRange}</span>
              </div>
              <p className="text-white/60 text-sm mb-3 leading-relaxed">{rec.reason}</p>
              {rec.safetyNote && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 mb-3">
                  <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
                  <p className="text-amber-300 text-xs">{rec.safetyNote}</p>
                </div>
              )}
              {rec.alternative && (
                <p className="text-white/40 text-xs mb-4">Alternative: {rec.alternative}</p>
              )}
              <div className="flex gap-3">
                {rec.productId && (
                  <Link href={`/products/${rec.productId}`}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E88E5] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors">
                    View Product <ArrowRight size={14} />
                  </Link>
                )}
                <Link href={`/quote?type=${encodeURIComponent(rec.glassType)}&thickness=${encodeURIComponent(rec.thickness)}`}
                  className="px-4 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors">
                  Get Quote
                </Link>
              </div>
            </div>
          ))}
          {result.followUpQuestion && (
            <div className="glass-card p-4 border-[#1E88E5]/20">
              <p className="text-white/50 text-xs mb-1">Refine your recommendation:</p>
              <p className="text-white/80 text-sm">{result.followUpQuestion}</p>
            </div>
          )}
          <button onClick={() => { setResult(null); setQuery('') }}
            className="text-white/30 text-xs hover:text-white/60 transition-colors">
            ← Start a new search
          </button>
        </div>
      )}
    </div>
  )
}

export default function AIMatchPage() {
  return <Suspense><AIMatchContent /></Suspense>
}
