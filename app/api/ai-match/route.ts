import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

const SYSTEM_RULES = `
You are the AmalGus Glass Expert AI. Your goal is to recommend the right glass for building projects in India.
Follow strict safety rules: Bathroom (8-10mm Toughened), Railings (12mm Laminated), etc.
Return ONLY valid JSON.
`

export async function POST(req: Request) {
  try {
    const { query, userRole } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) throw new Error("GEMINI_API_KEY is missing")

    // Switching to the STABLE v1 endpoint (v1 instead of v1beta)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${SYSTEM_RULES}\n\nUser Question: ${query}\nUser Role: ${userRole}\nRespond with JSON recommendation.` }]
          }]
        })
      }
    )

    const data = await response.json()
    
    if (data.error) {
       // Manual fallback to gemini-pro on v1 endpoint
       const proResponse = await fetch(
         `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
         {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({
             contents: [{
               parts: [{ text: `${SYSTEM_RULES}\n\nUser Question: ${query}\nUser Role: ${userRole}\nRespond with JSON recommendation.` }]
             }]
           })
         }
       )
       const proData = await proResponse.json()
       if (proData.error) throw new Error(proData.error.message)
       return processGeminiResponse(proData)
    }

    return processGeminiResponse(data)
  } catch (error: any) {
    console.error("AI Match Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

async function processGeminiResponse(data: any) {
  if (!data.candidates?.[0]) throw new Error("No AI candidates returned")
  const responseText = data.candidates[0].content.parts[0].text
  const jsonMatch = responseText.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error("Invalid AI response format")
  
  const recommendation = JSON.parse(jsonMatch[0])
  const { data: dbProducts } = await supabase.from('glass_products').select('id, glass_type')
  
  if (recommendation.recommendations) {
    recommendation.recommendations = recommendation.recommendations.map((rec: any) => {
      const match = dbProducts?.find(p => p.glass_type?.toLowerCase() === rec.glassType?.toLowerCase())
      return { ...rec, productId: match?.id }
    })
  }
  return NextResponse.json(recommendation)
}
