'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Zap, Send, ArrowRight, AlertCircle } from 'lucide-react'
import { aiExampleQueries } from '@/lib/data'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function AIMatchContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<null | { summary: string, recommendations: any[], followUpQuestion?: string }>(null)
  const [error, setError] = useState('')
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('amalgus_role') || 'homeowner' : 'homeowner'

  useScrollReveal()

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) { setQuery(q); handleSubmit(q) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = async (q?: string) => {
    const finalQuery = q || query
    if (!finalQuery.trim()) return
    setLoading(true); setError(''); setResult(null)
    const start = Date.now()
    try {
      const res = await fetch('/api/ai-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: finalQuery, userRole }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      
      const elapsed = Date.now() - start
      const wait = 1200 - elapsed
      if (wait > 0) await new Promise(r => setTimeout(r, wait))
      
      setResult(data)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[#1E88E5]/5 blur-[120px] -z-10" />
      
      <div className="text-center mb-10 reveal">
        <div className="w-14 h-14 rounded-2xl bg-[#1E88E5]/20 flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-[#1E88E5]" />
        </div>
        <h1 className="text-3xl font-bold mb-3">AI Glass Matching</h1>
        <p className="text-white/60">Describe your project in plain language. Our AI will recommend the right glass type, thickness, and process.</p>
      </div>

      {/* Input */}
      <div className="glass-card p-6 mb-6 reveal">
        <textarea value={query} onChange={e => setQuery(e.target.value)}
          placeholder="e.g. I need glass for my bathroom shower enclosure..."
          className="w-full bg-transparent text-white placeholder-white/30 text-sm resize-none outline-none min-h-[80px]"
          onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) handleSubmit() }} />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-white/30 text-xs">Press ⌘+Enter or click Send</span>
            <button onClick={() => handleSubmit()}
              disabled={loading || !query.trim()}
              className="btn-primary">
              {loading ? 'Analysing...' : <><Send size={14} className="mr-2" /> Get Recommendation</>}
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

      {/* Shimmer Loading state */}
      {loading && (
        <div className="space-y-6">
          <div className="glass-card p-6 border-white/5 shimmer">
            <div className="h-4 w-1/4 bg-white/10 rounded mb-4" />
            <div className="h-3 w-full bg-white/10 rounded mb-2" />
            <div className="h-3 w-2/3 bg-white/10 rounded" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass-card p-24 shimmer" />
             <div className="glass-card p-24 shimmer" />
          </div>
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
        <div className="space-y-6">
          <div className="glass-card p-6 border-[#1E88E5]/30 bg-[#1E88E5]/5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#90CAF9] mb-2">Expert Appraisal</h3>
            <p className="text-white/80 text-sm leading-relaxed">{result.summary}</p>
          </div>

          {result.recommendations?.map((rec: any, i: number) => (
            <div key={i} className={`glass-card overflow-hidden border-white/10 ${i === 0 ? 'ring-1 ring-[#1E88E5]/40' : ''}`}>
              <div className="bg-white/5 px-6 py-3 border-b border-white/5 flex items-center justify-between">
                 <span className="text-[10px] font-bold uppercase tracking-tighter text-white/40">
                    {i === 0 ? 'Primary Recommendation' : 'Secondary Alternative'}
                 </span>
                 <span className="text-[#1E88E5] font-bold text-sm">{rec.priceRange}</span>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Specs */}
                  <div>
                    <h4 className="text-xs font-bold mb-4 text-white/30 uppercase tracking-widest">Recommended Glass</h4>
                    <div className="space-y-3">
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50">Type</span>
                          <span className="text-xs font-bold">{rec.glassType}</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50">Thickness</span>
                          <span className="text-xs font-bold">{rec.thickness}</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50">Process</span>
                          <span className="text-xs font-bold">{rec.process}</span>
                       </div>
                       <div className="flex justify-between border-b border-white/5 pb-2">
                          <span className="text-xs text-white/50">Application</span>
                          <span className="text-xs font-bold">{rec.application}</span>
                       </div>
                    </div>
                  </div>

                  {/* Why */}
                  <div>
                    <h4 className="text-xs font-bold mb-4 text-white/30 uppercase tracking-widest">Why This Glass</h4>
                    <div className="space-y-4">
                       <div>
                          <p className="text-[10px] font-bold text-[#90CAF9] uppercase mb-1">Safety</p>
                          <p className="text-xs text-white/70 leading-relaxed">{rec.safetyReason}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-[#90CAF9] uppercase mb-1">Performance</p>
                          <p className="text-xs text-white/70 leading-relaxed">{rec.performanceReason}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-[#90CAF9] uppercase mb-1">Use Case</p>
                          <p className="text-xs text-white/70 leading-relaxed">{rec.useCaseReason}</p>
                       </div>
                    </div>
                  </div>
                </div>

                {rec.alternativeType && (
                  <div className="mt-8 pt-6 border-t border-white/5">
                     <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                        <p className="text-[10px] font-bold text-amber-500 uppercase mb-1">Alternative Option: {rec.alternativeType}</p>
                        <p className="text-xs text-white/60">{rec.alternativeReason}</p>
                     </div>
                  </div>
                )}

                <div className="mt-8 flex gap-3">
                   {rec.productId && (
                     <Link href={`/products/${rec.productId}`}
                       className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#1E88E5] text-white text-xs font-bold hover:bg-[#1976D2] transition-colors">
                       View Inventory <ArrowRight size={14} />
                     </Link>
                   )}
                   <Link href={`/quote?type=${encodeURIComponent(rec.glassType)}&thickness=${encodeURIComponent(rec.thickness)}`}
                     className="btn-secondary">
                     Get Pricing Estimate
                   </Link>
                </div>
              </div>
            </div>
          ))}

          {result.followUpQuestion && (
            <div className="glass-card p-6 border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-3 mb-2">
                 <AlertCircle size={16} className="text-amber-500" />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Clarification Needed</span>
              </div>
              <p className="text-white/80 text-sm italic">"{result.followUpQuestion}"</p>
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
