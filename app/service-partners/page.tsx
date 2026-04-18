'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { ServicePartner } from '@/lib/supabase'
import { Star, CheckCircle, MapPin, Wrench } from 'lucide-react'

const serviceTypes = ['All', 'Installation', 'Measurement', 'Site Visit', 'AMC']
const cities = ['All', 'Mumbai', 'Delhi', 'Pune']
const serviceColors: Record<string, string> = {
  Installation: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Measurement: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  'Site Visit': 'bg-amber-500/10 text-amber-300 border-amber-500/20',
  AMC: 'bg-green-500/10 text-green-300 border-green-500/20',
}

export default function ServicePartnersPage() {
  const [partners, setPartners] = useState<ServicePartner[]>([])
  const [filtered, setFiltered] = useState<ServicePartner[]>([])
  const [serviceType, setServiceType] = useState('All')
  const [city, setCity] = useState('All')

  useEffect(() => {
    supabase.from('service_partners').select('*').order('rating', { ascending: false }).then(({ data }) => {
      setPartners(data || [])
      setFiltered(data || [])
    })
  }, [])

  useEffect(() => {
    setFiltered(partners.filter(p =>
      (serviceType === 'All' || p.service_type === serviceType) &&
      (city === 'All' || p.city === city)
    ))
  }, [serviceType, city, partners])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Service Partners</h1>
        <p className="text-white/50">Verified glass installation, measurement, and maintenance professionals near you.</p>
      </div>
      <div className="glass-card p-4 mb-8 text-sm text-white/60 border-green-500/20 bg-green-500/5">
        ✅ All partners are verified by AmalGus. Ratings based on genuine customer reviews. Measurement precision is critical — 1mm wrong = entire panel rejected.
      </div>
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex gap-2 flex-wrap">
          {serviceTypes.map(s => (
            <button key={s} onClick={() => setServiceType(s)}
              className={`px-3 py-1.5 rounded-full text-xs transition-colors ${serviceType === s ? 'bg-[#1E88E5] text-white' : 'border border-white/10 text-white/50 hover:text-white'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1 transition-colors ${city === c ? 'bg-white/10 text-white' : 'border border-white/10 text-white/40 hover:text-white'}`}>
              <MapPin size={10} />{c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(p => (
          <div key={p.id} className="glass-card p-5 hover:border-white/20 transition-all">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{p.name}</h3>
                  {p.verified && <CheckCircle size={14} className="text-green-400" />}
                </div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${serviceColors[p.service_type] || 'bg-white/5 text-white/40 border-white/10'}`}>
                    {p.service_type}
                  </span>
                  <span className="text-white/30 text-xs flex items-center gap-0.5"><MapPin size={10} />{p.city}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400"><Star size={12} fill="currentColor" /><span className="text-sm font-medium">{p.rating}</span></div>
                <div className="text-white/30 text-xs">{p.reviews_count} reviews</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-white/50 text-sm mb-4">
              <Wrench size={12} />
              <span>{p.price_range}</span>
            </div>
            <button className="w-full py-2 rounded-lg bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#90CAF9] text-sm hover:bg-[#1E88E5]/20 transition-colors">
              Contact Partner
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
