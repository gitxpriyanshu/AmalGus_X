import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fallbackProducts } from '@/lib/mockProducts'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const id = searchParams.get('id')

  // Handle specific vendor product lookup for Quote page
  if (id) {
    const { data: vp } = await supabase.from('vendor_products').select('*').eq('id', id).single()
    if (vp) return NextResponse.json(vp)
    
    // Fallback for mock/industrial integrity
    const mockVp = fallbackProducts.find(p => p.id === id)
    if (mockVp) return NextResponse.json({ price_per_sqft: mockVp.price_min })
    return NextResponse.json({ error: 'Vendor product not found' }, { status: 404 })
  }

  const type = searchParams.get('type')
  const application = searchParams.get('application')
  const maxPrice = searchParams.get('maxPrice')
  const search = searchParams.get('search')

  let query = supabase.from('glass_products').select('*')

  if (type) query = query.eq('glass_type', type)
  if (maxPrice) query = query.lte('price_min', Number(maxPrice))
  if (application) query = query.contains('application', [application])
  if (search) query = query.or(`name.ilike.%${search}%,glass_type.ilike.%${search}%,description.ilike.%${search}%`)

  const { data, error } = await query.order('created_at', { ascending: true })
  
  // God-Level Fallback Logic
  let products = data || []
  if (products.length === 0 && !type && !application && !search) {
     products = fallbackProducts
  } else if (products.length === 0) {
    // If filtering returned nothing, check if we should filter the mock data
    products = fallbackProducts.filter(p => {
      if (type && p.glass_type !== type) return false
      if (application && !p.application.includes(application)) return false
      if (maxPrice && p.price_min > Number(maxPrice)) return false
      if (search) {
        const s = search.toLowerCase()
        return p.name.toLowerCase().includes(s) || p.glass_type.toLowerCase().includes(s)
      }
      return true
    })
  }

  if (error && products.length === 0) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(products)
}
