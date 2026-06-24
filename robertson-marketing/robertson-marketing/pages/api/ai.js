export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { type, lead, question } = req.body
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) return res.status(500).json({ error: 'Gemini API key not configured' })

  const businessContext = lead ? `
Business Name: ${lead.name}
Address: ${lead.address || 'Unknown'}
Phone: ${lead.phone || 'Not listed'}
Website: ${lead.website || 'None'}
Website Status: ${lead.websiteSignal || 'Unknown'}
Rating: ${lead.rating ? `${lead.rating}/5 (${lead.reviewCount} reviews)` : 'Not rated'}
Category: ${lead.category || 'Local business'}
` : ''

  let prompt = ''

  if (type === 'research') {
    prompt = `You are a sharp sales research assistant helping a marketing consultant named Callum Robertson.

${businessContext}

Question: ${question}

Answer concisely and practically. Focus on actionable insights Callum can use when pitching this business. Keep it under 200 words unless detail is needed.`
  }

  if (type === 'emails') {
    prompt = `You are writing outreach emails on behalf of Callum Robertson, a marketing consultant.

Callum's contact info:
- Email: robertsonmarketingofficial@gmail.com
- Phone: 0405 866 392
- Name: Callum Robertson

${businessContext}

Write TWO professional outreach emails. They must:
- Sound like a real human wrote them, NOT AI
- Be concise, direct, and confident (not grovelling or over-selling)
- Reference something specific about this business
- Have a clear call to action
- Include Callum's contact info at the end

EMAIL 1 - Website/Marketing pitch:
Focus on their website gap (${lead?.websiteSignal || 'marketing opportunity'}). Offer to help with their online presence.

EMAIL 2 - General marketing intro:
A broader intro to Robertson Marketing's services. Pick an angle relevant to their business type.

Format your response EXACTLY like this:
---EMAIL1---
Subject: [subject line]
[email body]
---EMAIL2---
Subject: [subject line]
[email body]
---END---`
  }

  if (type === 'lovable') {
    prompt = `You are creating a website design brief for Lovable.dev to build a website for a local business.

${businessContext}

Write a detailed Lovable.dev prompt that will generate a professional website for this business. Include:
- Type of business and their target customers
- Pages needed (Home, About, Services, Contact, etc.)
- Design direction (colors, feel, style)
- Key content sections for each page
- Any specific features (booking form, gallery, testimonials, etc.)
- Mobile-first requirement

Make it specific to THIS business, not generic. The prompt should be ready to paste directly into Lovable.dev.`
  }

  if (type === 'bulk_emails') {
    const { leads } = req.body
    prompt = `You are writing a bulk outreach email template on behalf of Callum Robertson.

Callum's contact info:
- Email: robertsonmarketingofficial@gmail.com  
- Phone: 0405 866 392

The email will be sent to multiple local businesses. Write ONE email that:
- Uses [BUSINESS_NAME] as a placeholder for the business name
- Sounds personal and human, not like a mass email
- Focuses on helping local businesses improve their online marketing
- Is brief (under 150 words)
- Has a strong subject line
- Ends with Callum's contact details

Format:
---EMAIL---
Subject: [subject]
[body with [BUSINESS_NAME] placeholder]
---END---`
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1500 }
        })
      }
    )

    const data = await geminiRes.json()

    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Gemini API error' })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    return res.status(200).json({ result: text })
  } catch (err) {
    console.error('Gemini error:', err)
    return res.status(500).json({ error: 'AI request failed' })
  }
}
