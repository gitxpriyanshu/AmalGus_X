'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw } from 'lucide-react'
import type { DailyRate } from '@/lib/supabase'

const sparkData: Record<string, number[]> = {
  'Clear Float': [48,50,49,52,51,53,52],
  'Toughened': [130,128,135,140,138,142,140],
  'Laminated': [195,200,210,215,205,215,215],
  'DGU / IGU': [380,390,400,410,405,420,425],
  'Frosted': [88,90,92,95,93,97,97],
  'Reflective': [105,108,112,115,110,118,120],
  'Low-E Glass': [210,215,220,235,240,245,250],
  'Back-Painted': [160,165,170,175,172,180,185],
}

function Sparkline({ data }: { data: number[] }) {
  const min = Math.min(...data); const max = Math.max(...data)
  const w = 80; const h = 28
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / (max - min + 1)) * h}`).join(' ')
  const trend = data[data.length - 1] >= data[0]
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={trend ? '#10B981' : '#EF4444'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardPage() {
  const [rates, setRates] = useState<DailyRate[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated] = useState(new Date())

  useEffect(() => {
    fetch('/api/rates').then(r => r.json()).then(d => { setRates(d); setLoading(false) })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">Daily Glass Rates</h1>
          <p className="text-white/50 text-sm">Live pricing from verified manufacturers. Updated daily based on raw material costs.</p>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/30 flex items-center gap-1 justify-end">
            <RefreshCw size={12} /> Last updated
          </div>
          <div className="text-white/60 text-sm">{lastUpdated.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST</div>
        </div>
      </div>

      <div className="glass-card p-4 mb-8 text-xs text-white/40 border-amber-500/20 bg-amber-500/5">
        💡 Glass rates change daily based on soda ash (Clear Float), energy costs (Toughened), argon gas (DGU), and import prices (Low-E). Use the <a href="/quote" className="text-[#1E88E5] hover:underline">Quote Generator</a> to calculate your project cost at today&apos;s rates.
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <div key={i} className="glass-card h-36 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rates.map(r => (
            <div key={r.id} className="glass-card p-5 hover:border-white/20 transition-all">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-sm">{r.glass_type}</h3>
                  <p className="text-white/40 text-xs">{r.thickness}</p>
                </div>
                {r.change_pct > 0
                  ? <span className="flex items-center gap-0.5 text-xs text-green-400"><TrendingUp size={12} />+{r.change_pct}%</span>
                  : r.change_pct < 0
                  ? <span className="flex items-center gap-0.5 text-xs text-red-400"><TrendingDown size={12} />{r.change_pct}%</span>
                  : <span className="flex items-center gap-0.5 text-xs text-white/30"><Minus size={12} />0%</span>}
              </div>
              <div className="text-xl font-bold text-[#1E88E5] mb-1">₹{r.price_min}–{r.price_max}</div>
              <div className="text-xs text-white/30 mb-3">per sq.ft · GST extra</div>
              <Sparkline data={sparkData[r.glass_type] || [100, 105, 102, 108, 106, 110, 108]} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
