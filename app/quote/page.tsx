'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Calculator, AlertCircle } from 'lucide-react'
import { glassTypes, glassThicknessMap } from '@/lib/data'

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

  useEffect(() => {
    const t = glassThicknessMap[glassType]
    if (t) setThickness(t)
  }, [glassType])

  useEffect(() => {
    const priceMap: Record<string, number> = {
      'Clear Float': 52, 'Toughened': 140, 'Laminated': 215,
      'DGU / IGU': 425, 'Frosted': 97, 'Reflective': 120, 'Low-E Glass': 250, 'Back-Painted': 185,
    }
    setPricePerSqft(priceMap[glassType] || 140)
  }, [glassType])

  const areaSqft = width && height ? ((Number(width) / 304.8) * (Number(height) / 304.8)) : 0
  const basePrice = areaSqft * pricePerSqft * Number(quantity || 1)
  const gst = basePrice * 0.18
  const total = basePrice + gst

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3"><Calculator size={28} className="text-[#1E88E5]" /> Quote Generator</h1>
        <p className="text-white/50">Enter your glass dimensions to get an instant price estimate.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="glass-card p-6 space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Glass Type</label>
            <select value={glassType} onChange={e => setGlassType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5]/50 appearance-none">
              {glassTypes.map(t => <option key={t} value={t} className="bg-[#0D1F3C]">{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Thickness (auto-set)</label>
            <input value={thickness} readOnly className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 text-sm cursor-not-allowed" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Width (mm)</label>
              <input type="number" value={width} onChange={e => setWidth(e.target.value)} placeholder="e.g. 900"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5]/50 placeholder-white/20" />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-2">Height (mm)</label>
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="e.g. 2100"
                className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5]/50 placeholder-white/20" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Quantity (panels)</label>
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="1"
              className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-[#1E88E5]/50" />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-2">Rate: ₹{pricePerSqft}/sq.ft (today&apos;s rate)</label>
            <input type="range" min={40} max={600} value={pricePerSqft} onChange={e => setPricePerSqft(Number(e.target.value))}
              className="w-full accent-[#1E88E5]" />
          </div>
          <button onClick={handleGenerate} disabled={!width || !height || loading}
            className="w-full py-3 rounded-xl bg-[#1E88E5] text-white font-medium hover:bg-[#1976D2] disabled:opacity-40 transition-colors">
            {loading ? 'Saving...' : 'Generate & Save Quote'}
          </button>
        </div>

        {/* Live Preview */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold">Estimate Preview</h3>
            {saved && <span className="text-xs text-green-400 flex items-center gap-1">✓ Saved</span>}
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Glass Type</span>
              <span className="font-medium">{glassType} ({thickness})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Area (per panel)</span>
              <span className="font-medium">{areaSqft.toFixed(2)} sq.ft</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Quantity</span>
              <span>{quantity} panels</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Total Area</span>
              <span>{(areaSqft * Number(quantity)).toFixed(2)} sq.ft</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">Base Price (₹{pricePerSqft}/sq.ft)</span>
              <span>₹{Math.round(basePrice).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-white/50">GST (18%)</span>
              <span>₹{Math.round(gst).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between py-3 text-lg font-bold">
              <span>Total Estimate</span>
              <span className="text-[#1E88E5]">₹{Math.round(total).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
            <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
            <p className="text-amber-300 text-xs">Rates valid for today only. Glass prices change daily based on raw material costs. Installation charges extra.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function QuotePage() {
  return <Suspense><QuoteContent /></Suspense>
}
