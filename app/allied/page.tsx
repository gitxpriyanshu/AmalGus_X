'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AlliedProduct } from '@/lib/supabase'

const categories = ['All', 'Hardware & Fittings', 'Silicones & Sealants', 'Doors & Windows', 'Shower Systems', 'Railing Systems']

export default function AlliedPage() {
  const [products, setProducts] = useState<AlliedProduct[]>([])
  const [filtered, setFiltered] = useState<AlliedProduct[]>([])
  const [selectedCat, setSelectedCat] = useState('All')

  useEffect(() => {
    supabase.from('allied_products').select('*').order('category').then(({ data }) => {
      setProducts(data || [])
      setFiltered(data || [])
    })
  }, [])

  useEffect(() => {
    setFiltered(selectedCat === 'All' ? products : products.filter(p => p.category === selectedCat))
  }, [selectedCat, products])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Allied Products</h1>
        <p className="text-white/50">Complete your glass system with hardware, sealants, frames, and installation accessories.</p>
      </div>
      <div className="glass-card p-4 mb-8 text-sm text-white/60">
        💡 <strong className="text-white">Glass never goes alone.</strong> Every glass application requires a complete system — hardware, sealants, frames, and installation. AmalGus covers the full ecosystem.
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCat(c)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${selectedCat === c ? 'bg-[#1E88E5] text-white' : 'border border-white/10 text-white/50 hover:text-white hover:border-white/30'}`}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="glass-card p-5 hover:border-white/20 transition-all">
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E88E5]/10 text-[#90CAF9] border border-[#1E88E5]/20">{p.category}</span>
            <h3 className="font-semibold mt-3 mb-2">{p.name}</h3>
            <p className="text-white/50 text-sm mb-3 leading-relaxed">{p.description}</p>
            {p.price_range && <p className="text-[#1E88E5] font-semibold text-sm mb-3">{p.price_range}</p>}
            <div className="text-xs text-white/30 mb-4">Used with: {p.related_glass_types?.join(', ')}</div>
            <button className="w-full py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-colors">
              Enquire Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
