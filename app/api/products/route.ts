import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
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
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
