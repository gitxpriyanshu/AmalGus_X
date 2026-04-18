'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, TrendingUp, TrendingDown, Minus, Home, Ruler, Building2, Store, CheckCircle } from 'lucide-react'
import { aiExampleQueries, platformStats, roleContent, customerRoles } from '@/lib/data'
import type { DailyRate, GlassProduct } from '@/lib/supabase'
import { useScrollReveal } from '@/hooks/useScrollReveal'

export default function HomePage() {
  const [rates, setRates] = useState<DailyRate[]>([])
  const [products, setProducts] = useState<GlassProduct[]>([])
  const [selectedRole, setSelectedRole] = useState('homeowner')

  useScrollReveal()

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
    <div className="min-h-screen overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/10 blur-[100px] rounded-full" />
      </div>

      {/* Hero */}
      <section className="relative px-4 sm:px-6 lg:px-8 pt-32 pb-24 max-w-7xl mx-auto text-center reveal">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-[#90CAF9] mb-8 animate-pulse">
          <Zap size={12} /> Industrial Grade Marketplace
        </div>
        <h1 className="text-5xl sm:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white">
          The Future of Glass <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88E5] to-[#90CAF9]">Is Now Digital.</span>
        </h1>
        <p className="text-lg text-white/40 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
          AmalGus digitizes the ₹150B India glass sector with AI matching, <br className="hidden md:block" />
          live trade rates, and a vetted ecosystem for professional projects.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="btn-primary flex items-center justify-center gap-2">
            Explore Glass Catalog <ArrowRight size={16} />
          </Link>
          <Link href="/ai-match" className="btn-secondary">
            Get AI Recommendation
          </Link>
        </div>
      </section>

      {/* Rate Ticker + Market Pulse */}
      {rates.length > 0 && (
        <div className="reveal">
          <div className="bg-[#0D1F3C] border-y border-white/5 py-3.5 overflow-hidden">
            <div className="flex animate-[ticker_40s_linear_infinite] whitespace-nowrap gap-12 px-4">
              {[...rates, ...rates].map((r, i) => (
                <span key={i} className="flex items-center gap-2.5 text-xs shrink-0 font-medium">
                  <span className="text-white/40 uppercase tracking-tighter">{r.glass_type} {r.thickness}</span>
                  <span className="text-white">₹{r.price_min}–{r.price_max}</span>
                  {r.change_pct > 0
                    ? <span className="text-green-400">↑{r.change_pct}%</span>
                    : r.change_pct < 0
                    ? <span className="text-red-400">↓{r.change_pct}%</span>
                    : <span className="text-white/20">0%</span>}
                  <span className="text-white/10 ml-4">/</span>
                </span>
              ))}
            </div>
          </div>
          
          <section className="bg-white/[0.01] border-b border-white/5 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
               <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1E88E5]">Market Pulse</h3>
                    <p className="text-xs text-white/30">Factory direct indication rates · Hourly updates</p>
                  </div>
                  <div className="text-[9px] text-white/20 text-right uppercase tracking-widest">Pricing Region: India (All Hubs)</div>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {rates.slice(0, 4).map(r => (
                    <div key={r.id} className="glass-card p-5 group">
                       <p className="text-[10px] font-bold text-white/30 mb-2 uppercase tracking-wide group-hover:text-[#1E88E5] transition-colors">{r.glass_type}</p>
                       <div className="flex items-end justify-between">
                          <span className="font-bold text-2xl tracking-tighter">₹{r.price_min}</span>
                          <span className={`${r.change_pct >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'} px-1.5 py-0.5 rounded text-[10px] font-bold`}>
                             {r.change_pct >= 0 ? '+' : ''}{r.change_pct}%
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </section>
        </div>
      )}

      {/* Role Selector */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 reveal">
        <h2 className="text-3xl font-bold text-center mb-3 tracking-tight">Tailored Experience</h2>
        <p className="text-white/40 text-center mb-12 text-sm max-w-lg mx-auto leading-relaxed">Specialized interfaces for every player in the glass industry value chain.</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {customerRoles.map(role => {
            const Icon = roleIcons[role.id]
            const active = selectedRole === role.id
            return (
              <button key={role.id} onClick={() => handleRoleSelect(role.id)}
                className={`p-6 rounded-2xl transition-all duration-500 text-left ${active
                  ? 'bg-[#1E88E5] text-white scale-[1.02] shadow-2xl shadow-[#1E88E5]/20'
                  : 'bg-white/[0.03] border border-white/5 text-white/40 hover:bg-white/[0.05] hover:text-white'}`}>
                <Icon size={24} className={active ? 'text-white' : 'text-[#1E88E5]'} />
                <div className="font-bold text-sm mt-4">{role.label}</div>
                <div className={`text-[10px] mt-1 leading-relaxed ${active ? 'text-white/80' : 'text-white/40'}`}>{role.description}</div>
              </button>
            )
          })}
        </div>
        <div className="glass-card p-10 text-center max-w-2xl mx-auto border-white/5">
          <h3 className="font-bold text-xl mb-3 tracking-tight">{roleContent[selectedRole]?.headline}</h3>
          <p className="text-white/40 text-sm mb-8 leading-relaxed">{roleContent[selectedRole]?.subtext}</p>
          <Link href="/products" className="btn-primary">
            {roleContent[selectedRole]?.ctaLabel}
          </Link>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 reveal">
        <div className="text-center mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1E88E5] mb-4">Ecosystem Edge</h2>
          <h3 className="text-3xl font-bold tracking-tight">Capabilities for Commercial Success</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-8 group">
            <Zap className="text-[#1E88E5] mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-base mb-3">AI Matching</h4>
            <p className="text-white/30 text-xs leading-relaxed">Advanced semantic mapping for safety, acoustics, and energy configurations.</p>
          </div>
          <div className="glass-card p-8 group">
            <TrendingUp className="text-[#1E88E5] mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-base mb-3">Rate Analytics</h4>
            <p className="text-white/30 text-xs leading-relaxed">Harness massive factory dataset for real-time trade rate optimization.</p>
          </div>
          <div className="glass-card p-8 group">
            <ArrowRight className="text-[#1E88E5] mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-base mb-3">Multi-Source</h4>
            <p className="text-white/30 text-xs leading-relaxed">Compare logistics, quality, and pricing across 15+ verified providers.</p>
          </div>
          <div className="glass-card p-8 group">
            <CheckCircle className="text-[#1E88E5] mb-6 group-hover:scale-110 transition-transform" size={32} />
            <h4 className="font-bold text-base mb-3">Smart Estimate</h4>
            <p className="text-white/30 text-xs leading-relaxed">GST-ready professional project estimation with wastage calculation.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 reveal">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Market Standards</h2>
            <p className="text-xs text-white/30">Top specified glass configurations this week</p>
          </div>
          <Link href="/products" className="text-[#1E88E5] text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-2">
            Full Catalog <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <Link href={`/products/${p.id}`} key={p.id}
              className="glass-card overflow-hidden group">
              <div className="h-44 overflow-hidden bg-[#122550] relative border-b border-white/5">
                <img src={p.image_url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                <div className="absolute top-3 right-3">
                   <span className="text-[9px] px-2 py-1 rounded bg-black/60 backdrop-blur-md text-white/80 font-bold border border-white/10 uppercase tracking-widest">
                      {p.application[0]}
                   </span>
                </div>
              </div>
              <div className="p-5">
                <span className="text-[10px] uppercase font-bold text-[#1E88E5] tracking-widest">{p.glass_type}</span>
                <h3 className="font-bold text-sm mt-1 group-hover:text-[#1E88E5] transition-colors">{p.name}</h3>
                <p className="text-white/30 text-[10px] mt-1">{p.thickness} · {p.process}</p>
                <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                   <p className="font-bold text-sm">₹{p.price_min}<span className="text-[10px] text-white/30 font-normal ml-0.5">/{p.unit}</span></p>
                   <ArrowRight size={14} className="text-white/20 group-hover:text-[#1E88E5] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      {/* AI CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-32 reveal">
        <div className="glass-card p-12 sm:p-20 text-center border-[#1E88E5]/20 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="w-16 h-16 rounded-2xl bg-[#1E88E5]/10 flex items-center justify-center mx-auto mb-8 border border-[#1E88E5]/20">
            <Zap size={32} className="text-[#1E88E5]" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Technical Uncertainty?</h2>
          <p className="text-white/40 mb-10 text-sm max-w-md mx-auto leading-relaxed">Describe your project in natural language. Our AI will specify the technically correct configuration for your safety & performance needs.</p>
          <div className="flex flex-wrap gap-2.5 justify-center mb-10">
            {aiExampleQueries.map(q => (
              <Link key={q} href={`/ai-match?q=${encodeURIComponent(q)}`}
                className="px-4 py-2 rounded-full border border-white/5 text-white/30 text-[10px] uppercase font-bold tracking-widest hover:border-[#1E88E5] hover:text-[#90CAF9] transition-all">
                {q}
              </Link>
            ))}
          </div>
          <Link href="/ai-match" className="btn-primary inline-flex items-center gap-2">
            Launch AI Match Tool <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  )
}
