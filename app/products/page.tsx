'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, Filter, SlidersHorizontal, Zap } from 'lucide-react'
import { glassTypes, applications } from '@/lib/data'
import type { GlassProduct } from '@/lib/supabase'

export default function ProductsPage() {
  const [products, setProducts] = useState<GlassProduct[]>([])
  const [search, setSearch] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [maxPrice, setMaxPrice] = useState(600)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Glass Product Catalog</h1>
        <p className="text-white/50">Browse {products.length} glass products from verified manufacturers</p>
      </div>

      {/* Search + Filter Toggle */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search glass type, application, specs..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#1E88E5]/50" />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-white/5 text-white/70 text-sm hover:text-white hover:border-white/30 transition-colors">
          <SlidersHorizontal size={16} /> Filters
          {(selectedTypes.length + selectedApps.length) > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#1E88E5] text-white text-xs flex items-center justify-center">
              {selectedTypes.length + selectedApps.length}
            </span>
          )}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <aside className="w-56 shrink-0 space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Glass Type</h3>
              <div className="space-y-2">
                {glassTypes.map(t => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedTypes.includes(t)} onChange={() => toggleType(t)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#1E88E5]" />
                    <span className={`text-sm ${selectedTypes.includes(t) ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Application</h3>
              <div className="space-y-2">
                {applications.slice(0, 7).map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={selectedApps.includes(a)} onChange={() => toggleApp(a)}
                      className="w-4 h-4 rounded border-white/20 bg-white/5 accent-[#1E88E5]" />
                    <span className={`text-sm ${selectedApps.includes(a) ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Max Price: ₹{maxPrice}/sq.ft</h3>
              <input type="range" min={50} max={600} step={10} value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#1E88E5]" />
              <div className="flex justify-between text-xs text-white/30 mt-1"><span>₹50</span><span>₹600</span></div>
            </div>
          </aside>
        )}

        {/* Product Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="glass-card h-64 animate-pulse bg-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(p => (
                <div key={p.id} className="glass-card overflow-hidden group hover:border-[#1E88E5]/40 transition-all">
                  <div className="h-36 overflow-hidden bg-[#122550] relative">
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-80 transition-all duration-300" />
                    <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#0A1628]/80 text-[#90CAF9] border border-[#1E88E5]/30">{p.glass_type}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#0A1628]/80 text-white/60 border border-white/10">{p.thickness}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm">{p.name}</h3>
                    <p className="text-white/40 text-xs mt-1 line-clamp-2">{p.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.application.slice(0, 2).map(a => (
                        <span key={a} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{a}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
                      <span className="text-[#1E88E5] font-semibold text-sm">₹{p.price_min}–{p.price_max}/sq.ft</span>
                      <span className="text-xs text-white/30">3 vendors</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Link href={`/products/${p.id}`}
                        className="flex-1 text-center py-1.5 rounded-lg border border-white/10 text-xs text-white/60 hover:text-white hover:border-white/30 transition-colors">
                        View Details
                      </Link>
                      <Link href={`/ai-match?q=${encodeURIComponent(p.glass_type)}`}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E88E5]/10 border border-[#1E88E5]/30 text-xs text-[#90CAF9] hover:bg-[#1E88E5]/20 transition-colors">
                        <Zap size={10} /> AI
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!loading && products.length === 0 && (
            <div className="text-center py-20 text-white/40">
              <Filter size={40} className="mx-auto mb-3 opacity-30" />
              <p>No products found. Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
