import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type GlassProduct = {
  id: string
  name: string
  glass_type: string
  thickness: string
  process: string
  application: string[]
  price_min: number
  price_max: number
  unit: string
  description: string
  image_url: string
  tags: string[]
  created_at: string
}

export type Vendor = {
  id: string
  name: string
  city: string
  rating: number
  delivery_days: number
  verified: boolean
}

export type VendorProduct = {
  id: string
  product_id: string
  vendor_id: string
  price_per_sqft: number
  min_order_sqft: number
  delivery_days: number
  vendors: Vendor
}

export type DailyRate = {
  id: string
  glass_type: string
  thickness: string
  rate_date: string
  price_min: number
  price_max: number
  unit: string
  change_pct: number
}

export type AlliedProduct = {
  id: string
  category: string
  name: string
  description: string
  price_range: string
  image_url: string
  related_glass_types: string[]
}

export type ServicePartner = {
  id: string
  name: string
  service_type: string
  city: string
  rating: number
  reviews_count: number
  price_range: string
  verified: boolean
}

export type Quote = {
  id: string
  glass_type: string
  thickness: string
  width_mm: number
  height_mm: number
  quantity: number
  estimated_price: number
  status: string
  created_at: string
}
