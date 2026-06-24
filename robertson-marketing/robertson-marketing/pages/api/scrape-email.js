export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { website } = req.body
  if (!website) return res.status(200).json({ email: null })

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(website, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadScout/1.0)' }
    })
    clearTimeout(timeout)

    const html = await response.text()

    // Extract email from HTML
    const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g
    const emails = html.match(emailRegex) || []

    // Filter out common non-contact emails
    const filtered = emails.filter(e => {
      const lower = e.toLowerCase()
      return !lower.includes('example.') &&
        !lower.includes('sentry.') &&
        !lower.includes('wixpress.') &&
        !lower.includes('schema.') &&
        !lower.includes('w3.org') &&
        !lower.includes('@2x') &&
        !lower.includes('.png') &&
        !lower.includes('.jpg') &&
        !lower.endsWith('.js') &&
        !lower.endsWith('.css')
    })

    // Also try /contact page
    if (filtered.length === 0) {
      try {
        const baseUrl = new URL(website)
        const contactController = new AbortController()
        const contactTimeout = setTimeout(() => contactController.abort(), 4000)
        const contactRes = await fetch(`${baseUrl.origin}/contact`, {
          signal: contactController.signal,
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; LeadScout/1.0)' }
        })
        clearTimeout(contactTimeout)
        const contactHtml = await contactRes.text()
        const contactEmails = (contactHtml.match(emailRegex) || []).filter(e => {
          const lower = e.toLowerCase()
          return !lower.includes('example.') && !lower.includes('.png') && !lower.includes('.jpg')
        })
        if (contactEmails.length > 0) {
          return res.status(200).json({ email: contactEmails[0] })
        }
      } catch { /* contact page failed, that's ok */ }
    }

    return res.status(200).json({ email: filtered[0] || null })
  } catch {
    return res.status(200).json({ email: null })
  }
}
