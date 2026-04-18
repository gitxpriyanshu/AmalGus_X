import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { calculateQuote } from '@/lib/data'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { glassType, widthMm, heightMm, quantity, pricePerSqft } = body

  if (!glassType || !widthMm || !heightMm || !quantity || !pricePerSqft) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const result = calculateQuote(Number(widthMm), Number(heightMm), Number(quantity), Number(pricePerSqft))

  const { data, error } = await supabase.from('quotes').insert({
    glass_type: glassType,
    width_mm: widthMm,
    height_mm: heightMm,
    quantity,
    estimated_price: result.total,
    status: 'draft',
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ quote: data, calculation: result })
}
