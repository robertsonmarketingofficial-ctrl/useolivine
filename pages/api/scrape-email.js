export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { website } = req.body
  if (!website) return res.status(200).json({ email: null })

  // Validate it's actually a URL
  let parsedUrl
  try {
    parsedUrl = new URL(website)
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) return res.status(200).json({ email: null })
  } catch {
    return res.status(200).json({ email: null })
  }

  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g

  const scrapeUrl = async (url) => {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 6000)
    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        }
      })
      clearTimeout(timeout)
      if (!response.ok) return []
      const html = await response.text()
      const found = html.match(emailRegex) || []
      return found.filter(e => {
        const lower = e.toLowerCase()
        return !lower.includes('example.') &&
          !lower.includes('sentry.') &&
          !lower.includes('wixpress.') &&
          !lower.includes('schema.org') &&
          !lower.includes('w3.org') &&
          !lower.includes('@2x.') &&
          !lower.includes('noreply') &&
          !lower.includes('no-reply') &&
          !lower.endsWith('.png') &&
          !lower.endsWith('.jpg') &&
          !lower.endsWith('.js') &&
          !lower.endsWith('.css') &&
          e.includes('.')
      })
    } catch {
      clearTimeout(timeout)
      return []
    }
  }

  // Try homepage first
  const homeEmails = await scrapeUrl(website)
  if (homeEmails.length > 0) return res.status(200).json({ email: homeEmails[0] })

  // Try /contact-us and /contact
  for (const path of ['/contact', '/contact-us', '/about']) {
    const emails = await scrapeUrl(`${parsedUrl.origin}${path}`)
    if (emails.length > 0) return res.status(200).json({ email: emails[0] })
  }

  return res.status(200).json({ email: null })
}
