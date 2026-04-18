'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, TrendingDown, Minus, Home, Ruler, Building2, Store } from 'lucide-react'
import { aiExampleQueries, platformStats, roleContent, customerRoles } from '@/lib/data'
import type { DailyRate, GlassProduct } from '@/lib/supabase'

export default function HomePage() {
  const [rates, setRates] = useState<DailyRate[]>([])
  const [products, setProducts] = useState<GlassProduct[]>([])
  const [selectedRole, setSelectedRole] = useState('homeowner')

  useEffect(() => {
    fetch('/api/rates').then(r => r.json()).then(setRates)
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) {
        setProducts(d.slice(0, 4))
      }
    })
    const saved = localStorage.getItem('amalgus_role')
    if (saved) setSelectedRole(saved)
  }, [])

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role)
    localStorage.setItem('amalgus_role', role)
  }

  const roleIcons: Record<string, typeof Home> = { homeowner: Home, architect: Ruler, builder: Building2, dealer: Store }

  return (
    <div className="min-h-screen">

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-20 pb-16 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E88E5]/20 border border-[#1E88E5]/30 text-[#90CAF9] text-xs font-medium mb-6">
          <Zap size={12} /> World&apos;s First B2B2C Glass Marketplace
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
          India&apos;s Glass Industry,<br />
          <span className="text-[#1E88E5]">Finally Online.</span>
        </h1>
        <p className="text-lg text-white/60 max-w-2xl mx-auto mb-8">
          The ₹150B+ glass market still runs on WhatsApp and phone calls. AmalGus brings AI-powered product matching,
          daily live rates, and verified fabricators — all in one marketplace.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/products" className="px-6 py-3 rounded-xl bg-[#1E88E5] text-white font-medium hover:bg-[#1976D2] transition-colors flex items-center justify-center gap-2">
            Explore Glass Catalog <ArrowRight size={16} />
          </Link>
          <Link href="/ai-match" className="px-6 py-3 rounded-xl border border-white/20 text-white font-medium hover:bg-white/10 transition-colors">
            Get AI Recommendation
          </Link>
        </div>
      </section>

      {/* Rate Ticker */}
      {rates.length > 0 && (
        <div className="bg-[#0D1F3C] border-y border-white/10 py-3 overflow-hidden">
          <div className="flex animate-[ticker_30s_linear_infinite] whitespace-nowrap gap-8 px-4">
            {[...rates, ...rates].map((r, i) => (
              <span key={i} className="flex items-center gap-2 text-sm shrink-0">
                <span className="text-white/60">{r.glass_type} {r.thickness}</span>
                <span className="text-white font-medium">₹{r.price_min}–{r.price_max}/sq.ft</span>
                {r.change_pct > 0
                  ? <span className="text-green-400 flex items-center gap-0.5"><TrendingUp size={12} />+{r.change_pct}%</span>
                  : r.change_pct < 0
                  ? <span className="text-red-400 flex items-center gap-0.5"><TrendingDown size={12} />{r.change_pct}%</span>
                  : <span className="text-white/40 flex items-center gap-0.5"><Minus size={12} />0%</span>}
                <span className="text-white/20">|</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Role Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-center mb-2">Who are you?</h2>
        <p className="text-white/50 text-center mb-8 text-sm">We tailor the experience for your needs</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {customerRoles.map(role => {
            const Icon = roleIcons[role.id]
            const active = selectedRole === role.id
            return (
              <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                className={`p-5 rounded-xl border text-left transition-all ${active
                  ? 'border-[#1E88E5] bg-[#1E88E5]/10 text-white'
                  : 'border-white/10 bg-white/5 text-white/60 hover:border-white/30 hover:text-white'}`}>
                <Icon size={24} className="mb-3" />
                <div className="font-semibold text-sm">{role.label}</div>
                <div className="text-xs mt-1 opacity-60">{role.description}</div>
              </button>
            )
          })}
        </div>
        {/* Role-specific content */}
        <div className="glass-card p-6 text-center max-w-xl mx-auto">
          <h3 className="font-bold text-lg mb-2">{roleContent[selectedRole]?.headline}</h3>
          <p className="text-white/60 text-sm mb-4">{roleContent[selectedRole]?.subtext}</p>
          <Link href="/products" className="inline-block px-5 py-2 rounded-lg bg-[#1E88E5] text-white text-sm font-medium hover:bg-[#1976D2] transition-colors">
            {roleContent[selectedRole]?.ctaLabel}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {platformStats.map(s => (
            <div key={s.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-[#1E88E5]">{s.value}</div>
              <div className="text-white/50 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Featured Glass Products</h2>
          <Link href="/products" className="text-[#1E88E5] text-sm hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <Link href={`/products/${p.id}`} key={p.id}
              className="glass-card overflow-hidden group hover:border-[#1E88E5]/50 transition-all">
              <div className="h-40 overflow-hidden bg-[#122550]">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-70" />
              </div>
              <div className="p-4">
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E88E5]/20 text-[#90CAF9] font-medium">{p.glass_type}</span>
                <h3 className="font-semibold text-sm mt-2">{p.name}</h3>
                <p className="text-white/40 text-xs mt-1">{p.thickness} · {p.process}</p>
                <p className="text-[#1E88E5] font-semibold text-sm mt-2">₹{p.price_min}–{p.price_max}/{p.unit}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* AI CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="glass-card p-8 sm:p-12 text-center border-[#1E88E5]/30">
          <div className="w-12 h-12 rounded-xl bg-[#1E88E5]/20 flex items-center justify-center mx-auto mb-4">
            <Zap size={24} className="text-[#1E88E5]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Not sure which glass you need?</h2>
          <p className="text-white/60 mb-6">Describe your project in plain language and our AI will recommend the right glass type, thickness, and process.</p>
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {aiExampleQueries.map(q => (
              <Link key={q} href={`/ai-match?q=${encodeURIComponent(q)}`}
                className="px-3 py-1.5 rounded-full border border-white/10 text-white/60 text-xs hover:border-[#1E88E5]/50 hover:text-white transition-colors">
                {q}
              </Link>
            ))}
          </div>
          <Link href="/ai-match" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E88E5] text-white font-medium hover:bg-[#1976D2] transition-colors">
            Try AI Glass Matching <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
