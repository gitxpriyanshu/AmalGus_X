'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GlassProduct, VendorProduct, AlliedProduct } from '@/lib/supabase'
import Link from 'next/link'
import { Star, CheckCircle, Clock, ArrowRight, User } from 'lucide-react'

function InstallerCard({ product, index }: { product: GlassProduct, index: number }) {
  const [requested, setRequested] = useState(false)
  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-[#1E88E5]/30 transition-all">
      <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-white/90">Verified Installer #{index}</span>
          <div className="flex items-center gap-1 text-amber-400 text-xs">
            <Star size={10} fill="currentColor" /> 5.0
          </div>
      </div>
      <p className="text-[10px] text-white/40 leading-relaxed italic">Specializes in {product.glass_type} installations for {product.application[0]?.toLowerCase()}.</p>
      <button 
        onClick={() => setRequested(true)}
        className={`${requested ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'btn-secondary'} mt-2 w-full py-2.5 !px-0 text-[10px]`}>
        {requested ? '✓ Quotation Requested' : 'Request Installation Quote'}
      </button>
    </div>
  )
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<GlassProduct | null>(null)
  const [vendors, setVendors] = useState<VendorProduct[]>([])
  const [allied, setAllied] = useState<AlliedProduct[]>([])
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const role = typeof window !== 'undefined' ? localStorage.getItem('amalgus_role') || 'homeowner' : 'homeowner'

  useEffect(() => {
    supabase.from('glass_products').select('*').eq('id', params.id).single().then(({ data }) => setProduct(data))
    supabase.from('vendor_products').select('*, vendors(*)').eq('product_id', params.id).order('price_per_sqft', { ascending: true }).then(({ data }) => setVendors(data || []))
  }, [params.id])

  useEffect(() => {
    if (!product) return
    supabase.from('allied_products').select('*').contains('related_glass_types', [product.glass_type]).then(({ data }) => setAllied(data || []))
  }, [product])

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-40 text-center text-white/40 reveal active">Loading product configuration...</div>

  // Industry logic: Role-based detail pivot
  const renderRolePivot = () => {
    switch(role) {
      case 'architect':
        return (
          <div className="bg-[#1E88E5]/5 border border-[#1E88E5]/20 rounded-xl p-4 mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-[#90CAF9] font-bold mb-2">Technical Specification (Architecture)</h4>
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <p className="text-white/40 text-[10px]">U-Value (W/m²K)</p>
                  <p className="text-sm font-mono">1.6 — 5.8 (Variable)</p>
               </div>
               <div>
                  <p className="text-white/40 text-[10px]">Solar Factor (g)</p>
                  <p className="text-sm font-mono">0.24 — 0.70</p>
               </div>
            </div>
          </div>
        )
      case 'dealer':
      case 'builder':
        return (
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-amber-400 font-bold mb-2">Trade Procurement Info</h4>
            <p className="text-xs text-white/70">Trade discounts available for orders exceeding 5,000 sq.ft. Factory lead time: {vendors[0]?.delivery_days || 5} days.</p>
          </div>
        )
      default:
        return (
          <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4 mb-6">
            <h4 className="text-[10px] uppercase tracking-widest text-green-400 font-bold mb-2">Home Safety Check</h4>
            <p className="text-xs text-white/70">This {product.glass_type} configuration is IS-certified for residential {product.application[0]?.toLowerCase()} use.</p>
          </div>
        )
    }
  }

  // Multi-Vendor Price Comparison
  const vendorData = vendors.length > 0 ? vendors : []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 reveal active-immediate">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div>
          <div className="rounded-2xl overflow-hidden bg-[#122550] h-96 relative border border-white/5 shadow-2xl">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-60" />
            <div className="absolute top-4 left-4 flex gap-2">
               {product.application.slice(0, 2).map(app => (
                 <span key={app} className="text-[9px] font-bold px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/10 uppercase tracking-widest">{app}</span>
               ))}
            </div>
          </div>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1E88E5]">{product.glass_type}</span>
          <h1 className="text-4xl font-bold mt-3 mb-2 tracking-tight">{product.name}</h1>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">{product.description}</p>
          
          {renderRolePivot()}

          {/* Expert Rationale Section */}
          <div className="glass-card p-6 border-[#1E88E5]/10 mb-8">
            <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 flex items-center gap-2 text-white/60">
              <CheckCircle size={14} className="text-[#1E88E5]" /> Why this configuration?
            </h4>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-[#1E88E5] mt-2 shrink-0" />
                <p className="text-xs text-white/60 leading-relaxed font-light"><strong className="text-white/80 font-bold uppercase text-[9px] mr-1">Safety:</strong> {product.process === 'Tempered' ? 'Breaks into small, harmless granules' : 'Holds in place even when broken'}.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-[#1E88E5] mt-2 shrink-0" />
                <p className="text-xs text-white/60 leading-relaxed font-light"><strong className="text-white/80 font-bold uppercase text-[9px] mr-1">Performance:</strong> High thermal resistance (RSV: 0.85) suitable for tropical climates.</p>
              </div>
              <div className="flex gap-4">
                <div className="w-1 h-1 rounded-full bg-[#1E88E5] mt-2 shrink-0" />
                <p className="text-xs text-white/60 leading-relaxed font-light"><strong className="text-white/80 font-bold uppercase text-[9px] mr-1">Applications:</strong> Ideally specified for {product.application.slice(0, 2).join(' and ')} projects.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-10">
            {[['Thickness', product.thickness], ['Process', product.process], ['Unit', product.unit], ['Standards', 'IS 2553']].map(([k, v]) => (
              <div key={String(k)} className="glass-card p-4 border-white/5 group hover:border-[#1E88E5]/30">
                <div className="text-white/20 text-[9px] uppercase font-bold tracking-widest mb-1">{k}</div>
                <div className="font-bold text-xs group-hover:text-white transition-colors">{v}</div>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-2xl bg-white/[0.02] border border-white/5 shadow-2xl relative overflow-hidden">
            {selectedVendor && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#1E88E5] to-transparent animate-pulse" />
            )}
            <div className="text-center sm:text-left">
              <div className="text-[10px] uppercase font-bold text-white/20 tracking-widest mb-1">
                {selectedVendor ? 'Selected Partner Rate' : 'Market Appraisal'}
              </div>
              <div className="text-3xl font-bold tracking-tighter text-[#1E88E5]">
                ₹{selectedVendor ? vendorData.find(v => v.id === selectedVendor)?.price_per_sqft : product.price_min}
                <span className="text-xs text-white/20 font-normal ml-1">/{product.unit}</span>
              </div>
            </div>
            <Link href={`/quote?type=${encodeURIComponent(product.glass_type)}&thickness=${encodeURIComponent(product.thickness)}&vendorId=${selectedVendor || ''}`}
              className="btn-primary flex-1 w-full sm:w-auto">
              {selectedVendor ? 'Get Final Partner Quote' : 'Generate Estimation'} <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Multi-Vendor Price Comparison */}
      {vendorData.length > 0 && (
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
             <h2 className="text-2xl font-bold tracking-tight">Verified Factory Rates</h2>
             <span className="text-[10px] text-white/20 uppercase font-bold tracking-[0.3em]">Live Marketplace Integrity</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
             {vendorData.map((vp, i) => (
               <div key={vp.id} className={`glass-card p-6 flex flex-wrap items-center justify-between gap-8 transition-all hover:bg-white/5 ${selectedVendor === vp.id ? 'border-[#1E88E5] bg-[#1E88E5]/5' : i === 0 && !selectedVendor ? 'border-[#1E88E5]/40 bg-[#1E88E5]/5' : 'border-white/5'}`}>
                  <div className="flex items-center gap-6 min-w-[280px]">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl font-bold border border-white/10 text-[#1E88E5]">{vp.vendors?.name[0]}</div>
                     <div>
                        <div className="font-bold text-lg flex items-center gap-2 tracking-tight">
                           {vp.vendors?.name}
                           {vp.vendors?.verified && <CheckCircle size={18} className="text-[#1E88E5]" />}
                        </div>
                        <p className="text-xs text-white/30 font-medium">{vp.vendors?.city} · {vp.vendors?.rating} ★ Rating</p>
                     </div>
                  </div>
                  <div className="flex flex-wrap gap-12">
                     <div>
                        <p className="text-[10px] uppercase text-white/20 mb-1 font-bold tracking-widest">Rate/sq.ft</p>
                        <p className="text-xl font-bold text-[#1E88E5]">₹{vp.price_per_sqft}</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase text-white/20 mb-1 font-bold tracking-widest">Lead Time</p>
                        <p className="text-sm font-bold text-white/80">{vp.delivery_days} Work Days</p>
                     </div>
                     <div>
                        <p className="text-[10px] uppercase text-white/20 mb-1 font-bold tracking-widest">Min Order</p>
                        <p className="text-sm font-bold text-white/80">{vp.min_order_sqft} <span className="text-[10px] opacity-40">sq.ft</span></p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                    {i === 0 && !selectedVendor && (
                      <div className="hidden sm:block px-4 py-1.5 rounded-lg bg-[#1E88E5]/10 text-[#90CAF9] text-[10px] font-bold uppercase tracking-widest border border-[#1E88E5]/20">Best Fit L1</div>
                    )}
                    <button 
                      onClick={() => setSelectedVendor(vp.id)}
                      className={`${selectedVendor === vp.id ? 'btn-primary px-8 py-3' : 'btn-secondary px-8 py-3'}`}>
                      {selectedVendor === vp.id ? 'Selected' : 'Select Vendor'}
                    </button>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Linked Ecosystem Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
           <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Ecosystem Checklist</h2>
              <span className="text-xs text-white/30 italic">Commonly required for {product.glass_type}</span>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 border-[#1E88E5]/20">
                 <h3 className="font-bold text-sm mb-4 text-[#90CAF9] flex items-center gap-2">
                    <CheckCircle size={14} /> 1. Hardware & Fittings
                 </h3>
                 <div className="space-y-3">
                    {allied.filter(a => a.category === 'Hardware').slice(0, 3).map(a => (
                      <div key={a.id} className="flex items-center justify-between text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                         <span className="font-medium">{a.name}</span>
                         <span className="text-white/40">{a.price_range}</span>
                      </div>
                    ))}
                    {allied.filter(a => a.category === 'Hardware').length === 0 && (
                      <div className="p-3 bg-white/2 rounded-lg border border-dashed border-white/10 text-[10px] text-white/30 text-center">No specific hardware mapped</div>
                    )}
                 </div>
              </div>
              <div className="glass-card p-6 border-green-500/20">
                 <h3 className="font-bold text-sm mb-4 text-green-400 flex items-center gap-2">
                    <CheckCircle size={14} /> 2. Installation Supplies
                 </h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                       <span className="font-medium">Weather-proof Sealant (Black)</span>
                       <span className="text-white/40">₹450/tube</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                       <span className="font-medium">Setting Blocks (EPDM)</span>
                       <span className="text-white/40">₹12/unit</span>
                    </div>
                    <div className="flex items-center justify-between text-xs p-3 rounded-lg bg-white/5 border border-white/5">
                       <span className="font-medium">Aluminium Spacers (12mm)</span>
                       <span className="text-white/40">₹85/rmt</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        
        <div className="glass-card p-6 border-white/10 bg-white/2 flex flex-col">
           <h3 className="font-bold text-[10px] uppercase tracking-widest mb-5 flex items-center justify-between text-white/40">
              <span>3. Installation Partners</span>
              <Link href="/service-partners" className="text-[10px] text-[#1E88E5] hover:underline uppercase">View All</Link>
           </h3>
           <div className="space-y-4 flex-1">
              {[1, 2].map(i => (
                <InstallerCard key={i} product={product} index={i} />
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
