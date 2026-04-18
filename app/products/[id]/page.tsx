'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { GlassProduct, VendorProduct, AlliedProduct } from '@/lib/supabase'
import Link from 'next/link'
import { Star, CheckCircle, Clock, ArrowRight } from 'lucide-react'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<GlassProduct | null>(null)
  const [vendors, setVendors] = useState<VendorProduct[]>([])
  const [allied, setAllied] = useState<AlliedProduct[]>([])

  useEffect(() => {
    supabase.from('glass_products').select('*').eq('id', params.id).single().then(({ data }) => setProduct(data))
    supabase.from('vendor_products').select('*, vendors(*)').eq('product_id', params.id).then(({ data }) => setVendors(data || []))
  }, [params.id])

  useEffect(() => {
    if (!product) return
    supabase.from('allied_products').select('*').contains('related_glass_types', [product.glass_type]).limit(4).then(({ data }) => setAllied(data || []))
  }, [product])

  if (!product) return <div className="max-w-7xl mx-auto px-4 py-20 text-center text-white/40">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
        <div>
          <div className="rounded-2xl overflow-hidden bg-[#122550] h-80">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover opacity-70" />
          </div>
        </div>
        <div>
          <span className="text-xs px-2 py-1 rounded-full bg-[#1E88E5]/20 text-[#90CAF9]">{product.glass_type}</span>
          <h1 className="text-3xl font-bold mt-3 mb-3">{product.name}</h1>
          <p className="text-white/60 mb-6 leading-relaxed">{product.description}</p>
          <div className="grid grid-cols-2 gap-3 text-sm mb-6">
            {[['Thickness', product.thickness], ['Process', product.process], ['Unit', product.unit], ['Applications', product.application.join(', ')]].map(([k, v]) => (
              <div key={String(k)} className="glass-card p-3">
                <div className="text-white/40 text-xs mb-1">{k}</div>
                <div className="font-medium text-sm">{v}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-white/40">Price Range</div>
              <div className="text-2xl font-bold text-[#1E88E5]">₹{product.price_min}–{product.price_max}/sq.ft</div>
            </div>
            <Link href={`/quote?type=${encodeURIComponent(product.glass_type)}`}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1E88E5] text-white font-medium hover:bg-[#1976D2] transition-colors">
              Get Quote <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Vendor Comparison */}
      {vendors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold mb-4">Compare Vendors</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-xs border-b border-white/10">
                  <th className="text-left py-3 pr-4">Vendor</th>
                  <th className="text-left py-3 pr-4">City</th>
                  <th className="text-left py-3 pr-4">Price/sq.ft</th>
                  <th className="text-left py-3 pr-4">Delivery</th>
                  <th className="text-left py-3 pr-4">Min Order</th>
                  <th className="text-left py-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vp, i) => (
                  <tr key={vp.id} className={`border-b border-white/5 ${i === 0 ? 'bg-[#1E88E5]/5' : ''}`}>
                    <td className="py-3 pr-4 font-medium flex items-center gap-2">
                      {i === 0 && <span className="text-xs px-1.5 py-0.5 rounded bg-[#1E88E5]/20 text-[#90CAF9]">Best</span>}
                      {vp.vendors?.name}
                      {vp.vendors?.verified && <CheckCircle size={12} className="text-green-400" />}
                    </td>
                    <td className="py-3 pr-4 text-white/60">{vp.vendors?.city}</td>
                    <td className="py-3 pr-4 text-[#1E88E5] font-semibold">₹{vp.price_per_sqft}</td>
                    <td className="py-3 pr-4 text-white/60 flex items-center gap-1"><Clock size={12} />{vp.delivery_days} days</td>
                    <td className="py-3 pr-4 text-white/60">{vp.min_order_sqft} sq.ft</td>
                    <td className="py-3 text-amber-400 flex items-center gap-1"><Star size={12} fill="currentColor" />{vp.vendors?.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Allied Products Cross-sell */}
      {allied.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">You&apos;ll Also Need</h2>
          <p className="text-white/40 text-sm mb-4">Products commonly ordered with {product.glass_type} glass</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {allied.map(a => (
              <div key={a.id} className="glass-card p-4 hover:border-white/20 transition-all">
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{a.category}</span>
                <h3 className="font-medium text-sm mt-2 mb-1">{a.name}</h3>
                <p className="text-white/40 text-xs line-clamp-2">{a.description}</p>
                {a.price_range && <p className="text-[#1E88E5] text-sm font-medium mt-2">{a.price_range}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
