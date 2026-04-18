'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Filter, SlidersHorizontal, Zap, ArrowRight } from 'lucide-react'
import { glassTypes, applications } from '@/lib/data'
import type { GlassProduct } from '@/lib/supabase'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function ProductsPage() {
  const [products, setProducts] = useState<GlassProduct[]>([])
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(600)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useScrollReveal()

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (selectedTypes.length === 1) params.set('type', selectedTypes[0])
    if (selectedApps.length === 1) params.set('application', selectedApps[0])
    params.set('maxPrice', String(maxPrice))
    const res = await fetch('/api/products?' + params.toString())
    const data = await res.json()
    if (Array.isArray(data)) {
      setProducts(data)
    } else {
      setProducts([])
    }
    setLoading(false)
  }, [search, selectedTypes, selectedApps, maxPrice])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const toggleType = (t: string) => setSelectedTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleApp = (a: string) => setSelectedApps(prev => prev.includes(a) ? prev.filter(x => x !== a) : [...prev, a])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="mb-12 reveal">
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Industrial Grade Catalog</h1>
        <p className="text-white/40 text-lg font-light leading-relaxed max-w-2xl">
          Browse verified configurations across our ecosystem of factory partners. <br />
          Filter by technical application or industrial process.
        </p>
      </div>

      <div className="flex gap-4 mb-10 reveal">
        <div className="flex-1 relative glass-card !rounded-2xl border-white/5 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#1E88E5] transition-colors" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search for '8mm DGU' or 'Kitchen Backsplash'..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-transparent text-white placeholder-white/20 outline-none" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all ${showFilters ? 'bg-[#1E88E5] border-[#1E88E5] text-white' : 'border-white/5 text-white/40 hover:text-white hover:border-white/20'}`}>
          <SlidersHorizontal size={18} /> Filters
          {(selectedTypes.length + selectedApps.length) > 0 && (
            <span className="w-5 h-5 rounded-full bg-white text-[#1E88E5] text-[10px] font-bold flex items-center justify-center">
              {selectedTypes.length + selectedApps.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {showFilters && (
          <aside className="w-full lg:w-64 shrink-0 space-y-10 reveal">
            <div>
              <h3 className="text-[10px] font-bold text-[#1E88E5] uppercase tracking-[0.2em] mb-6">Glass Type</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {glassTypes.map(t => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#1E88E5]" />
                    <span className={`text-xs font-medium transition-colors ${selectedTypes.includes(t) ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-[#1E88E5] uppercase tracking-[0.2em] mb-6">Application</h3>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                {applications.slice(0, 10).map(a => (
                  <label key={a} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" checked={selectedApps.includes(a)} onChange={() => toggleApp(a)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#1E88E5]" />
                    <span className={`text-xs font-medium transition-colors ${selectedApps.includes(a) ? 'text-white' : 'text-white/40 group-hover:text-white'}`}>{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-[#1E88E5] uppercase tracking-[0.2em] mb-4">Max Appraisal: ₹{maxPrice}/sq.ft</h3>
              <input type="range" min={50} max={600} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1E88E5] h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer" />
              <div className="flex justify-between text-[9px] font-bold text-white/20 mt-2 uppercase tracking-tighter"><span>₹50</span><span>₹600</span></div>
            </div>
          </aside>
        )}

        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card h-80 shimmer border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 reveal active-immediate">
              {products.map((p, idx) => (
                <div key={p.id} className="glass-card overflow-hidden group" style={{ transitionDelay: `${idx * 50}ms` }}>
                  <div className="h-44 overflow-hidden bg-[#122550] relative border-b border-white/5">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-500" />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      <span className="text-[9px] px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-[#90CAF9] font-bold border border-[#1E88E5]/30 uppercase tracking-widest">{p.glass_type}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-sm tracking-tight group-hover:text-[#1E88E5] transition-colors">{p.name}</h3>
                       <span className="text-[10px] text-white/20 font-mono">{p.thickness}</span>
                    </div>
                    <p className="text-white/30 text-[11px] leading-relaxed line-clamp-2 min-h-[32px]">{p.description}</p>
                    
                    <div className="flex items-center justify-between mt-6 pt-5 border-t border-white/5">
                      <div className="flex flex-col">
                         <span className="text-[9px] uppercase font-bold text-white/20 tracking-widest mb-0.5">Appraisal Range</span>
                         <span className="text-[#1E88E5] font-bold text-base tracking-tighter">₹{p.price_min}<span className="text-xs font-normal text-white/20 ml-1">/{p.unit}</span></span>
                      </div>
                      <Link href={`/products/${p.id}`}
                        className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:bg-[#1E88E5] hover:text-white transition-all">
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="glass-card p-20 text-center reveal border-dashed border-white/10">
              <Filter size={48} className="mx-auto mb-4 text-white/10" />
              <p className="text-white/40 font-medium">No specialized configurations found for this filter set.</p>
              <button onClick={() => { setSearch(''); setSelectedTypes([]); setSelectedApps([]); setMaxPrice(600) }}
                className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E88E5] hover:underline">
                Clear System Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
