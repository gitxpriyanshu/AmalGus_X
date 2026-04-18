'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator, AlertCircle } from 'lucide-react'
import { glassTypes, glassThicknessMap } from '@/lib/data'

import { useCountUp } from '@/hooks/useCountUp'
import { useScrollReveal } from '@/hooks/useScrollReveal'

function QuoteContent() {
  const searchParams = useSearchParams()
  const [glassType, setGlassType] = useState(searchParams.get('type') || 'Toughened')
  const [thickness, setThickness] = useState(searchParams.get('thickness') || '8mm')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [pricePerSqft, setPricePerSqft] = useState(140)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useScrollReveal()

  useEffect(() => {
    const t = glassThicknessMap[glassType]
    if (t) setThickness(t)
  }, [glassType])

  useEffect(() => {
    const vId = searchParams.get('vendorId')
    if (vId) {
      setLoading(true)
      fetch(`/api/products?id=${vId}`).then(res => res.json()).then(data => {
        if (data && data.price_per_sqft) {
          setPricePerSqft(data.price_per_sqft)
        }
        setLoading(false)
      })
    } else {
      setLoading(true)
      fetch(`/api/products?type=${encodeURIComponent(glassType)}&limit=1`).then(res => res.json()).then(data => {
        if (data && data.length > 0 && data[0].price_min > 0) {
          setPricePerSqft(data[0].price_min)
        } else {
          const typeKey = glassType.toLowerCase().trim()
          const industrialDefaults: Record<string, number> = {
            'double glazing unit (dgu)': 1850,
            'laminated glass': 950,
            'toughened': 140,
            'clear float': 45,
            'low-e glass': 450,
            'frosted': 97,
            'back-painted': 185
          }
          const matchedRate = industrialDefaults[typeKey] || 
                             Object.entries(industrialDefaults).find(([k]) => typeKey.includes(k))?.[1] || 
                             140
          setPricePerSqft(matchedRate)
        }
        setLoading(false)
      })
    }
  }, [glassType, searchParams])

  const areaSqft = width && height ? ((Number(width) / 304.8) * (Number(height) / 304.8)) : 0
  const basePrice = areaSqft * pricePerSqft * Number(quantity || 1)
  const gst = basePrice * 0.18
  const total = basePrice + gst

  const animatedTotal = useCountUp(Math.round(total))
  const animatedGst = useCountUp(Math.round(gst))

  const handleGenerate = async () => {
    if (!width || !height) return
    setLoading(true)
    const res = await fetch('/api/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ glassType, widthMm: width, heightMm: height, quantity, pricePerSqft }),
    })
    await res.json()
    setSaved(true)
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] -z-10" />

      <div className="mb-12 reveal">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-4 tracking-tight">
          <Calculator size={32} className="text-[#1E88E5]" /> 
          Digital Specification Estimate
        </h1>
        <p className="text-white/40 text-lg font-light">Input precise industrial dimensions for instant factory-direct appraisal.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-10 space-y-8 reveal border-white/5 shadow-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 px-1">Glass Configuration</label>
              <div className="relative group">
                <select value={glassType} onChange={e => setGlassType(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5] transition-all appearance-none cursor-pointer">
                  {glassTypes.map(t => <option key={t} value={t} className="bg-[#0D1F3C] text-white">{t}</option>)}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20 group-hover:text-white/40 transition-colors">▼</div>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 px-1">Default Thickness</label>
              <input value={thickness} readOnly 
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.02] border border-white/5 text-white/60 text-sm cursor-not-allowed outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 px-1">Width (mm)</label>
              <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="0"
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5] transition-all font-mono" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-3 px-1">Height (mm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="0"
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5] transition-all font-mono" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3 px-1">
              <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Quantity (Panels)</label>
              <span className="text-[10px] font-bold text-[#1E88E5] tracking-widest">{quantity} Unit</span>
            </div>
            <div className="space-y-4">
              <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1"
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5] transition-all font-mono" />
              <div className="px-1">
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1" 
                  value={quantity} 
                  onChange={e => setQuantity(e.target.value)} 
                  className="w-full cursor-grab active:cursor-grabbing"
                />
              </div>
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!width || !height || loading}
            className="btn-primary w-full shadow-2xl shadow-[#1E88E5]/30">
            {loading ? 'Finalizing Estimate...' : 'Generate Factory Estimate'}
          </button>
        </div>

        <div className="glass-card p-10 border-[#1E88E5]/20 bg-[#1E88E5]/[0.02] reveal">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h3 className="font-bold text-lg tracking-tight">Appraisal Preview</h3>
            {saved && <span className="text-[10px] font-bold px-2 py-1 rounded bg-green-500/20 text-green-400 uppercase tracking-widest">✓ Confirmed</span>}
          </div>
          <div className="space-y-6 text-sm">
            <div className="flex justify-between items-center group">
              <span className="text-white/40 font-medium">Project Total Area</span>
              <span className="font-bold text-right group-hover:text-white transition-colors">{(areaSqft * Number(quantity || 1)).toFixed(3)} <span className="text-[10px] text-white/20 ml-1 uppercase">sq.ft</span></span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-white/40 font-medium tracking-tight">Configuration Rate</span>
              <span className="font-bold text-right text-[#1E88E5] tracking-tighter">₹{pricePerSqft}<span className="text-[10px] text-white/20 ml-1 uppercase">/sq.ft</span></span>
            </div>
            <div className="flex justify-between items-center group pt-4 border-t border-white/5">
              <span className="text-white/40 font-medium">Base Appraisal</span>
              <span className="font-bold text-right">₹{Math.round(basePrice).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center group">
              <span className="text-white/40 font-medium">Applied GST (18%)</span>
              <span className="font-bold text-right text-white/60">₹{animatedGst.toLocaleString('en-IN')}</span>
            </div>
            
            <div className="mt-8 p-6 rounded-2xl bg-[#1E88E5] text-white shadow-2xl shadow-[#1E88E5]/30 group hover:scale-[1.02] transition-transform">
               <div className="flex justify-between items-end">
                  <span className="text-xs font-bold uppercase tracking-widest opacity-60">Estimated Total</span>
                  <span className="text-3xl font-bold tracking-tighter">₹{animatedTotal.toLocaleString('en-IN')}</span>
               </div>
            </div>
          </div>
          <div className="mt-8 p-5 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-3">
            <AlertCircle size={16} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-amber-200/60 text-[11px] leading-relaxed italic">Rate integrity valid for 24 hours. Final factory calibration and logistics weight may adjust total by ±2%.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuotePage() {
  return <Suspense><QuoteContent /></Suspense>
}
