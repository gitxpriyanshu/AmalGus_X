import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SYSTEM_RULES = `
You are the AmalGus Glass Expert AI. Your goal is to recommend the right glass for building projects in India.
Follow strict safety rules: 
- Bathroom (8-10mm Toughened)
- Balcony Railings (12mm Laminated)
- Soundproofing (Laminated or DGU)
- Energy Efficiency (Low-E DGU)
Return ONLY valid JSON.
`

export async function POST(req: Request) {
  try {
    const { query, userRole } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "GROQ_API_KEY is missing in environment variables" }, { status: 500 })
    }

    // Direct fetch to Groq API (OpenAI compatible)
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Using Llama 3.3 70B for high quality
        messages: [
          { role: "system", content: SYSTEM_RULES },
          { role: "user", content: `Context: Role - ${userRole}. Goal: Recommend glass for: ${query}. Respond in JSON.` }
        ],
        response_format: { type: "json_object" }, // Ensures valid JSON
        temperature: 0.1
      })
    })

    const data = await response.json()
    
    if (data.error) throw new Error(data.error.message)

    const responseText = data.choices[0].message.content
    const recommendation = JSON.parse(responseText)

    // Enrich with database IDs
    const { data: dbProducts } = await supabase.from('glass_products').select('id, glass_type')
    
    if (recommendation.recommendations) {
      recommendation.recommendations = recommendation.recommendations.map((rec: any) => {
        const match = dbProducts?.find(p => p.glass_type?.toLowerCase() === rec.glassType?.toLowerCase())
        return { ...rec, productId: match?.id }
      })
    }

    return NextResponse.json(recommendation)
  } catch (error: any) {
    console.error("AI Match Error (Groq):", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
