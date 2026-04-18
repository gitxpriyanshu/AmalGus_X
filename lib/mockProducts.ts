import type { GlassProduct } from './supabase'

export const fallbackProducts: GlassProduct[] = [
  {
    id: 'toughened-8mm',
    name: '8mm Clear Toughened Glass',
    glass_type: 'Toughened',
    thickness: '8mm',
    price_min: 140,
    price_max: 165,
    unit: 'sq.ft',
    description: 'High-strength safety glass processed by controlled thermal treatment. Ideal for frameless doors and shopfronts.',
    application: ['Shower Enclosure', 'Doors', 'Partitions'],
    image_url: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'dgu-24mm',
    name: '24mm Energy Saver IGU (6+12+6)',
    glass_type: 'DGU / IGU',
    thickness: '24mm',
    price_min: 420,
    price_max: 480,
    unit: 'sq.ft',
    description: 'Double Glazed Unit with 12mm air gap for superior thermal insulation and noise reduction (STC 35+).',
    application: ['Facade', 'Windows', 'Soundproof Office'],
    image_url: 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'laminated-12mm',
    name: '12.52mm PVB Laminated Safety Glass',
    glass_type: 'Laminated',
    thickness: '12.52mm',
    price_min: 240,
    price_max: 280,
    unit: 'sq.ft',
    description: 'Ultra-secure glass with interleaved PVB film. Stays in place even if broken. Indian Standard IS 2553 compliant.',
    application: ['Railing', 'Skylight', 'Burglary Resistance'],
    image_url: 'https://images.unsplash.com/photo-1541824306700-c0a188c93c1d?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'low-e-6mm',
    name: '6mm High-Performance Low-E Glass',
    glass_type: 'Low-E Glass',
    thickness: '6mm',
    price_min: 220,
    price_max: 260,
    unit: 'sq.ft',
    description: 'Spectrally selective coating that blocks solar heat while allowing natural light. LEED certification support.',
    application: ['Curtain Wall', 'Facade', 'Skylight'],
    image_url: 'https://images.unsplash.com/photo-1507652313519-d4c9174996dd?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'frosted-6mm',
    name: '6mm Privacy Acid-Etched Glass',
    glass_type: 'Frosted',
    thickness: '6mm',
    price_min: 110,
    price_max: 135,
    unit: 'sq.ft',
    description: 'Evenly satin-finished surface that provides permanent privacy while diffusing light beautifully.',
    application: ['Partition', 'Shower Enclosure', 'Cabinets'],
    image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  },
  {
    id: 'back-painted-8mm',
    name: '8mm Lacquered Back-Painted Glass',
    glass_type: 'Back-Painted',
    thickness: '8mm',
    price_min: 180,
    price_max: 220,
    unit: 'sq.ft',
    description: 'High-quality opaque glass with industrial grade paint coating. Scratch resistant and easy to clean.',
    application: ['Kitchen Backsplash', 'Wall Paneling', 'Tabletops'],
    image_url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop',
    created_at: new Date().toISOString()
  }
]
