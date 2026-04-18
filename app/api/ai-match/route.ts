import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SYSTEM_RULES = `
You are the AmalGus Glass Expert AI. Your goal is to recommend the right glass for projects in India.
Return a JSON object exactly with these keys:
{
  "summary": "Expert advice text",
  "recommendations": [
    {
      "glassType": "Clear Float|Toughened|Laminated|DGU / IGU|Frosted|Reflective|Low-E Glass|Back-Painted",
      "thickness": "Thickness e.g. 8mm",
      "process": "Process e.g. Tempered",
      "reason": "Why this glass?",
      "safetyNote": "Safety warning",
      "priceRange": "Price range in INR",
      "alternative": "Alternative option"
    }
  ],
  "followUpQuestion": "A clarifying question"
}
`

export async function POST(req: Request) {
  try {
    const { query, userRole } = await req.json()
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) return NextResponse.json({ error: "GROQ_API_KEY missing" }, { status: 500 })

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: SYSTEM_RULES },
          { role: "user", content: `Query: ${query} (User Role: ${userRole}). Provide recommendations as JSON.` }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      })
    })

    const data = await response.json()
    if (data.error) throw new Error(data.error.message)

    const responseText = data.choices[0].message.content
    console.log("AI RESPONSE RAW:", responseText); // Debugging log
    
    const recommendation = JSON.parse(responseText)

    // Ensure common keys exist to prevent empty UI
    if (!recommendation.summary && recommendation.advice) recommendation.summary = recommendation.advice;
    if (!recommendation.recommendations && recommendation.products) recommendation.recommendations = recommendation.products;

    // Database enrichment
    const { data: dbProducts } = await supabase.from('glass_products').select('id, glass_type')
    if (recommendation.recommendations) {
      recommendation.recommendations = recommendation.recommendations.map((rec: any) => {
        const match = dbProducts?.find(p => 
          p.glass_type?.toLowerCase().includes(rec.glassType?.toLowerCase()) ||
          rec.glassType?.toLowerCase().includes(p.glass_type?.toLowerCase())
        )
        return { ...rec, productId: match?.id }
      })
    }

    return NextResponse.json(recommendation)
  } catch (error: any) {
    console.error("AI Match Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
