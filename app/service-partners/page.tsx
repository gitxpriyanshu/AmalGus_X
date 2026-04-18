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

function PartnerCard({ p }: { p: ServicePartner }) {
  const [requested, setRequested] = useState(false)
  return (
    <div className="glass-card p-6 border-white/5 group hover:border-[#1E88E5]/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold tracking-tight text-white group-hover:text-[#1E88E5] transition-colors">{p.name}</h3>
            {p.verified && <CheckCircle size={16} className="text-[#1E88E5]" />}
          </div>
          <div className="flex items-center gap-2 mt-1.5">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${serviceColors[p.service_type] || 'bg-white/5 text-white/40 border-white/10'}`}>
              {p.service_type}
            </span>
            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5"><MapPin size={12} />{p.city}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 text-[#1E88E5] font-bold"><Star size={14} fill="currentColor" /><span className="text-sm">{p.rating}</span></div>
          <div className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">{p.reviews_count} reviews</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-white/40 text-xs mb-6">
        <Wrench size={14} />
        <span>Starts at {p.price_range}</span>
      </div>
      <button 
        onClick={() => setRequested(true)}
        className={`${requested ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'btn-secondary'} w-full py-3 text-[10px] uppercase font-bold tracking-widest`}>
        {requested ? '✓ Callback Scheduled' : 'Contact Partner'}
      </button>
    </div>
  )
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 reveal active-immediate">
      <div className="mb-12">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#1E88E5] mb-4">Service Ecosystem</h2>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Professional Partners</h1>
        <p className="text-white/30 max-w-2xl leading-relaxed">Verified glass installation, measurement, and maintenance professionals. Measurement precision is critical — a 1mm error results in complete panel rejection.</p>
      </div>
      
      <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
        <div className="flex gap-3 flex-wrap">
          {serviceTypes.map(s => (
            <button key={s} onClick={() => setServiceType(s)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${serviceType === s ? 'bg-[#1E88E5] text-white shadow-lg shadow-[#1E88E5]/20' : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'}`}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${city === c ? 'bg-white/10 text-white border-white/20' : 'bg-transparent border border-white/10 text-white/40 hover:text-white'}`}>
              <MapPin size={12} />{c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(p => (
          <PartnerCard key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}
