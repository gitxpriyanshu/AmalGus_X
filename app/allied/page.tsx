'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { AlliedProduct } from '@/lib/supabase'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const categories = ['All', 'Hardware & Fittings', 'Silicones & Sealants', 'Doors & Windows', 'Shower Systems', 'Railing Systems']

export default function AlliedPage() {
  const [products, setProducts] = useState<AlliedProduct[]>([])
  const [filtered, setFiltered] = useState<AlliedProduct[]>([])
  const [selectedCat, setSelectedCat] = useState('All')

  useScrollReveal()

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="mb-12 reveal">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1E88E5] mb-4">Ecosystem</h2>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Allied Components</h1>
        <p className="text-white/30 max-w-2xl leading-relaxed">Hardware, sealants, frames, and precision installation accessories required for a complete glass system.</p>
      </div>

      <div className="flex gap-3 flex-wrap mb-12">
        {categories.map(c => (
          <button key={c} onClick={() => setSelectedCat(c)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedCat === c ? 'bg-[#1E88E5] text-white' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal active-immediate">
        {filtered.map(p => (
          <div key={p.id} className="glass-card p-6 border-white/5 group hover:border-[#1E88E5]/30 transition-all">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border border-[#1E88E5]/20 bg-[#1E88E5]/5 text-[#90CAF9]">{p.category}</span>
            <h3 className="font-bold tracking-tight mt-6 mb-2 group-hover:text-[#1E88E5] transition-colors">{p.name}</h3>
            <p className="text-white/30 text-xs mb-6 leading-relaxed line-clamp-2">{p.description}</p>
            {p.price_range && <p className="text-[#1E88E5] font-bold text-sm mb-6">{p.price_range}</p>}
            
            <button className="btn-secondary w-full py-3 text-[10px] uppercase font-bold tracking-widest">
              Enquire Source
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
