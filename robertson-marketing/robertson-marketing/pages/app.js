import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

const CATEGORIES = [
  'Dentist', 'Plumber', 'Electrician', 'Roofer', 'Accountant',
  'Lawyer', 'Real estate agent', 'Landscaper', 'Painter', 'Mechanic',
  'Gym', 'Personal trainer', 'Physiotherapist', 'Chiropractor', 'Optometrist',
  'Restaurant', 'Cafe', 'Bakery', 'Hair salon', 'Barber',
  'Nail salon', 'Massage therapist', 'Cleaning service', 'Pest control',
  'Fencing contractor', 'Concreter', 'Builder', 'Architect', 'Interior designer',
  'Photographer', 'Videographer', 'Marketing agency', 'Graphic designer',
  'IT support', 'Web designer', 'Financial advisor', 'Mortgage broker',
  'Insurance broker', 'Travel agent', 'Event planner', 'Florist',
  'Vet', 'Childcare', 'Tutoring', 'Music teacher', 'Driving instructor',
  'Pool installer', 'Solar installer', 'Security installer', 'Locksmith', 'Tiler',
]

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#111a0e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'auto', padding: 28 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#f0f4ed' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function CopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} style={{ padding: '6px 14px', borderRadius: 7, border: '1px solid rgba(109,138,64,0.4)', background: copied ? 'rgba(109,138,64,0.2)' : 'transparent', color: copied ? '#afc28a' : '#6d8a40', cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s' }}>
      {copied ? '✓ Copied' : label}
    </button>
  )
}

function ScoreBadge({ score }) {
  const color = score >= 75 ? '#ef4444' : score >= 50 ? '#f97316' : '#6b7280'
  return <span style={{ fontSize: 18, fontWeight: 800, color }}>{score}</span>
}

function TierBadge({ tier }) {
  const bg = tier === 'Hot' ? '#ef4444' : tier === 'Warm' ? '#f97316' : '#374151'
  return <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: bg, color: '#fff' }}>{tier}</span>
}

export default function App() {
  const [tab, setTab] = useState('finder')
  const [category, setCategory] = useState('Dentist')
  const [location, setLocation] = useState('')
  const [leads, setLeads] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [pipeline, setPipeline] = useState([])
  const [selectedLead, setSelectedLead] = useState(null)
  const [modal, setModal] = useState(null) // 'emails' | 'researcher' | 'lovable' | 'bulk'
  const [aiResult, setAiResult] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [researchQuestion, setResearchQuestion] = useState('')
  const [emails, setEmails] = useState({ email1: { subject: '', body: '' }, email2: { subject: '', body: '' } })
  const [lovablePrompt, setLovablePrompt] = useState('')
  const [bulkEmail, setBulkEmail] = useState({ subject: '', body: '' })
  const [stageFilter, setStageFilter] = useState('All')
  const [toast, setToast] = useState('')

  // Load pipeline from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('rm_pipeline')
      if (saved) setPipeline(JSON.parse(saved))
    } catch {}
  }, [])

  const savePipeline = (p) => {
    setPipeline(p)
    try { localStorage.setItem('rm_pipeline', JSON.stringify(p)) } catch {}
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  const searchLeads = async () => {
    if (!location.trim()) { setSearchError('Enter a suburb or city'); return }
    setSearching(true)
    setSearchError('')
    setLeads([])
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: category, location: location.trim() })
      })
      const data = await res.json()
      if (data.error) { setSearchError(data.error); return }
      const leadsWithCategory = (data.leads || []).map(l => ({ ...l, category }))
      setLeads(leadsWithCategory)
      // Auto-scrape emails in background
      leadsWithCategory.forEach(async (lead, i) => {
        if (lead.website && !lead.website.includes('facebook') && !lead.website.includes('instagram')) {
          try {
            const emailRes = await fetch('/api/scrape-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ website: lead.website })
            })
            const emailData = await emailRes.json()
            if (emailData.email) {
              setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, email: emailData.email } : l))
            }
          } catch {}
        }
      })
    } catch (err) {
      setSearchError('Search failed. Check your internet connection.')
    } finally {
      setSearching(false)
    }
  }

  const addToPipeline = (lead) => {
    if (pipeline.find(p => p.id === lead.id)) { showToast('Already in pipeline'); return }
    const newPipeline = [...pipeline, { ...lead, stage: 'New', notes: '', addedAt: new Date().toISOString() }]
    savePipeline(newPipeline)
    showToast(`${lead.name} added to pipeline`)
  }

  const removeFromPipeline = (id) => {
    savePipeline(pipeline.filter(p => p.id !== id))
  }

  const updateStage = (id, stage) => {
    savePipeline(pipeline.map(p => p.id === id ? { ...p, stage } : p))
  }

  const updateNotes = (id, notes) => {
    savePipeline(pipeline.map(p => p.id === id ? { ...p, notes } : p))
  }

  const openEmails = async (lead) => {
    setSelectedLead(lead)
    setModal('emails')
    setAiLoading(true)
    setEmails({ email1: { subject: '', body: '' }, email2: { subject: '', body: '' } })
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'emails', lead })
      })
      const data = await res.json()
      if (data.result) {
        const text = data.result
        const e1Match = text.match(/---EMAIL1---([\s\S]*?)---EMAIL2---/)
        const e2Match = text.match(/---EMAIL2---([\s\S]*?)---END---/)
        const parseEmail = (raw) => {
          if (!raw) return { subject: '', body: '' }
          const lines = raw.trim().split('\n')
          const subjectLine = lines.find(l => l.startsWith('Subject:'))
          const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : ''
          const bodyStart = lines.findIndex(l => l.startsWith('Subject:'))
          const body = lines.slice(bodyStart + 1).join('\n').trim()
          return { subject, body }
        }
        setEmails({
          email1: parseEmail(e1Match?.[1]),
          email2: parseEmail(e2Match?.[1])
        })
      }
    } catch {}
    setAiLoading(false)
  }

  const openResearcher = (lead) => {
    setSelectedLead(lead)
    setResearchQuestion('')
    setAiResult('')
    setModal('researcher')
  }

  const askResearch = async () => {
    if (!researchQuestion.trim()) return
    setAiLoading(true)
    setAiResult('')
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'research', lead: selectedLead, question: researchQuestion })
      })
      const data = await res.json()
      setAiResult(data.result || 'No response')
    } catch { setAiResult('Request failed') }
    setAiLoading(false)
  }

  const openLovable = async (lead) => {
    setSelectedLead(lead)
    setLovablePrompt('')
    setModal('lovable')
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'lovable', lead })
      })
      const data = await res.json()
      setLovablePrompt(data.result || '')
    } catch { setLovablePrompt('Failed to generate prompt') }
    setAiLoading(false)
  }

  const openBulkEmail = async () => {
    setModal('bulk')
    setAiLoading(true)
    setBulkEmail({ subject: '', body: '' })
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'bulk_emails', leads: pipeline })
      })
      const data = await res.json()
      if (data.result) {
        const text = data.result
        const match = text.match(/---EMAIL---([\s\S]*?)---END---/)
        if (match) {
          const lines = match[1].trim().split('\n')
          const subjectLine = lines.find(l => l.startsWith('Subject:'))
          const subject = subjectLine ? subjectLine.replace('Subject:', '').trim() : ''
          const bodyStart = lines.findIndex(l => l.startsWith('Subject:'))
          const body = lines.slice(bodyStart + 1).join('\n').trim()
          setBulkEmail({ subject, body })
        }
      }
    } catch {}
    setAiLoading(false)
  }

  const filteredPipeline = stageFilter === 'All' ? pipeline : pipeline.filter(p => p.stage === stageFilter)
  const stages = ['New', 'Contacted', 'Replied', 'Meeting', 'Closed', 'Not interested']

  const NavBtn = ({ id, label, count }) => (
    <button onClick={() => setTab(id)} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: tab === id ? 'rgba(109,138,64,0.2)' : 'transparent', color: tab === id ? '#afc28a' : '#6b7280', cursor: 'pointer', fontSize: 14, fontWeight: tab === id ? 600 : 400, display: 'flex', alignItems: 'center', gap: 6 }}>
      {label}
      {count > 0 && <span style={{ background: '#6d8a40', color: '#fff', borderRadius: 100, fontSize: 11, padding: '1px 7px', fontWeight: 700 }}>{count}</span>}
    </button>
  )

  return (
    <>
      <Head>
        <title>Robertson Marketing — Lead Finder</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a2e10', border: '1px solid rgba(109,138,64,0.4)', borderRadius: 10, padding: '12px 20px', fontSize: 14, color: '#afc28a', zIndex: 9999, fontWeight: 500 }}>
          {toast}
        </div>
      )}

      {/* APP HEADER */}
      <header style={{ background: '#0a0f0a', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', height: 56, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6d8a40, #afc28a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#0a0f0a' }}>R</div>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#f0f4ed' }}>Robertson Marketing</span>
            </Link>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ display: 'flex', gap: 4 }}>
              <NavBtn id="finder" label="Lead Finder" count={0} />
              <NavBtn id="pipeline" label="Pipeline" count={pipeline.length} />
            </div>
          </div>
          {tab === 'pipeline' && pipeline.length > 0 && (
            <button onClick={openBulkEmail} style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid rgba(109,138,64,0.3)', background: 'rgba(109,138,64,0.1)', color: '#afc28a', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
              ✉ Bulk Email
            </button>
          )}
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 20px', minHeight: 'calc(100vh - 56px)' }}>

        {/* ===== LEAD FINDER TAB ===== */}
        {tab === 'finder' && (
          <div>
            {/* Search bar */}
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 20, marginBottom: 24 }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14 }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: '1 1 200px' }}>
                  <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 6 }}>Location (suburb, city, or area)</label>
                  <input value={location} onChange={e => setLocation(e.target.value)} onKeyDown={e => e.key === 'Enter' && searchLeads()} placeholder="e.g. Norwood SA, Melbourne CBD, Brisbane" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, fontSize: 14 }} />
                </div>
                <button onClick={searchLeads} disabled={searching} style={{ padding: '10px 24px', borderRadius: 8, background: '#6d8a40', color: '#fff', border: 'none', cursor: searching ? 'wait' : 'pointer', fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', opacity: searching ? 0.7 : 1 }}>
                  {searching ? <span className="spinner" style={{ width: 16, height: 16 }} /> : '🔍 Search Leads'}
                </button>
              </div>
              {searchError && <p style={{ color: '#ef4444', fontSize: 13, margin: '10px 0 0' }}>{searchError}</p>}
            </div>

            {/* Stats row */}
            {leads.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'Leads found', val: leads.length },
                  { label: 'Hot leads', val: leads.filter(l => l.tier === 'Hot').length },
                  { label: 'With phone', val: leads.filter(l => l.phone).length },
                  { label: 'With email', val: leads.filter(l => l.email).length },
                  { label: 'No website', val: leads.filter(l => !l.website || l.websiteSignal === 'No website').length },
                ].map(s => (
                  <div key={s.label} style={{ background: 'rgba(109,138,64,0.08)', border: '1px solid rgba(109,138,64,0.15)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6d8a40', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 800, color: '#afc28a' }}>{s.val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Searching state */}
            {searching && (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 16px' }} />
                <p style={{ color: '#6b7280', fontSize: 14 }}>Searching for {category}s in {location}...</p>
              </div>
            )}

            {/* Empty state */}
            {!searching && leads.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ color: '#f0f4ed', fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Search for leads above</h3>
                <p style={{ color: '#6b7280', fontSize: 14 }}>Choose a category and location to find real local businesses, scored and ready to pitch.</p>
              </div>
            )}

            {/* Lead cards */}
            {!searching && leads.map((lead, i) => (
              <div key={lead.id} className="fade-in" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(109,138,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#6d8a40', flexShrink: 0 }}>
                  {lead.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ed' }}>{lead.name}</span>
                    <TierBadge tier={lead.tier} />
                    {lead.websiteSignal === 'No website' && <span style={{ padding: '2px 8px', borderRadius: 100, fontSize: 10, fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}>NO WEBSITE</span>}
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {lead.phone && <span>📞 {lead.phone}</span>}
                    {lead.email && <span>✉ {lead.email}</span>}
                    {!lead.email && lead.website && <span style={{ color: '#374151' }}>📧 Scraping email...</span>}
                    {lead.address && <span>📍 {lead.address.split(',').slice(0, 2).join(',')}</span>}
                    {lead.rating && <span>⭐ {lead.rating} ({lead.reviewCount})</span>}
                    <span style={{ color: lead.websiteSignal === 'No website' ? '#ef4444' : '#6b7280' }}>{lead.websiteSignal}</span>
                  </div>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'center', minWidth: 44 }}>
                  <ScoreBadge score={lead.score} />
                  <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>score</div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <button onClick={() => openEmails(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(109,138,64,0.3)', background: 'transparent', color: '#afc28a', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✉ Emails</button>
                  <button onClick={() => openResearcher(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca88e', cursor: 'pointer', fontSize: 12 }}>🤖 Research</button>
                  <button onClick={() => openLovable(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca88e', cursor: 'pointer', fontSize: 12 }}>⚡ Lovable</button>
                  <button onClick={() => addToPipeline(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: 'none', background: '#6d8a40', color: '#fff', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>+ Pipeline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== PIPELINE TAB ===== */}
        {tab === 'pipeline' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#f0f4ed' }}>Pipeline <span style={{ fontSize: 14, color: '#6b7280', fontWeight: 400 }}>({pipeline.length} leads)</span></h2>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {['All', ...stages].map(s => (
                  <button key={s} onClick={() => setStageFilter(s)} style={{ padding: '5px 12px', borderRadius: 7, border: `1px solid ${stageFilter === s ? 'rgba(109,138,64,0.5)' : 'rgba(255,255,255,0.08)'}`, background: stageFilter === s ? 'rgba(109,138,64,0.15)' : 'transparent', color: stageFilter === s ? '#afc28a' : '#6b7280', cursor: 'pointer', fontSize: 12, fontWeight: stageFilter === s ? 600 : 400 }}>{s}</button>
                ))}
              </div>
            </div>

            {filteredPipeline.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
                <h3 style={{ color: '#f0f4ed', fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>Pipeline is empty</h3>
                <p style={{ color: '#6b7280', fontSize: 14, margin: '0 0 20px' }}>Search for leads and click "+ Pipeline" to save them here.</p>
                <button onClick={() => setTab('finder')} style={{ padding: '10px 20px', borderRadius: 8, background: '#6d8a40', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>Go to Lead Finder</button>
              </div>
            )}

            {filteredPipeline.map(lead => (
              <div key={lead.id} style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 20px', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(109,138,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: '#6d8a40', flexShrink: 0 }}>
                    {lead.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span style={{ fontSize: 15, fontWeight: 700, color: '#f0f4ed' }}>{lead.name}</span>
                      <TierBadge tier={lead.tier} />
                      <ScoreBadge score={lead.score} />
                    </div>
                    <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 10 }}>
                      {lead.phone && <span>📞 {lead.phone}</span>}
                      {lead.email && <span>✉ {lead.email}</span>}
                      {lead.address && <span>📍 {lead.address.split(',').slice(0, 2).join(',')}</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <select value={lead.stage} onChange={e => updateStage(lead.id, e.target.value)} style={{ padding: '5px 10px', borderRadius: 7, fontSize: 12, minWidth: 140 }}>
                        {stages.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <input value={lead.notes || ''} onChange={e => updateNotes(lead.id, e.target.value)} placeholder="Add notes..." style={{ flex: 1, minWidth: 160, padding: '5px 10px', borderRadius: 7, fontSize: 12 }} />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <button onClick={() => openEmails(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(109,138,64,0.3)', background: 'transparent', color: '#afc28a', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>✉ Emails</button>
                    <button onClick={() => openResearcher(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca88e', cursor: 'pointer', fontSize: 12 }}>🤖 Research</button>
                    <button onClick={() => openLovable(lead)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#9ca88e', cursor: 'pointer', fontSize: 12 }}>⚡ Lovable</button>
                    <button onClick={() => removeFromPipeline(lead.id)} style={{ padding: '7px 12px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: 12 }}>Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== EMAILS MODAL ===== */}
      {modal === 'emails' && selectedLead && (
        <Modal title={`Outreach emails — ${selectedLead.name}`} onClose={() => setModal(null)}>
          {aiLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280', fontSize: 14 }}>Generating personalised emails...</p>
            </div>
          ) : (
            <div>
              {[{ key: 'email1', label: 'Email 1 — Website / Marketing pitch' }, { key: 'email2', label: 'Email 2 — Intro pitch' }].map(({ key, label }) => {
                const email = emails[key]
                return (
                  <div key={key} style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#afc28a' }}>{label}</h3>
                      <CopyBtn text={`Subject: ${email.subject}\n\n${email.body}`} label="Copy email" />
                    </div>
                    {email.subject && (
                      <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 13, color: '#9ca88e' }}>
                        <strong style={{ color: '#6b7280' }}>Subject:</strong> {email.subject}
                      </div>
                    )}
                    <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '12px 14px', fontSize: 13, color: '#f0f4ed', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {email.body || 'No content generated'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Modal>
      )}

      {/* ===== RESEARCHER MODAL ===== */}
      {modal === 'researcher' && selectedLead && (
        <Modal title={`AI Researcher — ${selectedLead.name}`} onClose={() => setModal(null)}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ background: 'rgba(109,138,64,0.08)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#9ca88e', marginBottom: 14 }}>
              <strong style={{ color: '#afc28a' }}>Business:</strong> {selectedLead.name} · {selectedLead.address?.split(',').slice(0, 2).join(',')} · {selectedLead.websiteSignal}
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <input value={researchQuestion} onChange={e => setResearchQuestion(e.target.value)} onKeyDown={e => e.key === 'Enter' && askResearch()} placeholder="Ask anything — pitch angles, what they need, how to approach them..." style={{ flex: 1, padding: '10px 14px', borderRadius: 8, fontSize: 14 }} />
              <button onClick={askResearch} disabled={aiLoading || !researchQuestion.trim()} style={{ padding: '10px 18px', borderRadius: 8, background: '#6d8a40', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600, opacity: aiLoading ? 0.6 : 1 }}>
                {aiLoading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Ask'}
              </button>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {['What marketing services does this type of business need?', 'How should I pitch them?', 'What are common pain points for this business?'].map(q => (
                <button key={q} onClick={() => setResearchQuestion(q)} style={{ padding: '5px 10px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#6b7280', cursor: 'pointer', fontSize: 11 }}>{q}</button>
              ))}
            </div>
          </div>
          {aiResult && (
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#f0f4ed', lineHeight: 1.7, whiteSpace: 'pre-wrap' }} className="fade-in">
              {aiResult}
            </div>
          )}
        </Modal>
      )}

      {/* ===== LOVABLE MODAL ===== */}
      {modal === 'lovable' && selectedLead && (
        <Modal title={`Lovable.dev prompt — ${selectedLead.name}`} onClose={() => setModal(null)}>
          {aiLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280', fontSize: 14 }}>Generating website design brief...</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Paste this directly into <strong style={{ color: '#afc28a' }}>lovable.dev</strong> to build their website.</p>
                <CopyBtn text={lovablePrompt} label="Copy prompt" />
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#f0f4ed', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 440, overflowY: 'auto' }}>
                {lovablePrompt}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* ===== BULK EMAIL MODAL ===== */}
      {modal === 'bulk' && (
        <Modal title={`Bulk email — ${pipeline.length} leads`} onClose={() => setModal(null)}>
          {aiLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div className="spinner" style={{ width: 32, height: 32, margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280', fontSize: 14 }}>Generating bulk email template...</p>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Replace <strong style={{ color: '#afc28a' }}>[BUSINESS_NAME]</strong> with each business name when sending.</p>
                <CopyBtn text={`Subject: ${bulkEmail.subject}\n\n${bulkEmail.body}`} label="Copy template" />
              </div>
              {bulkEmail.subject && (
                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', marginBottom: 8, fontSize: 13, color: '#9ca88e' }}>
                  <strong style={{ color: '#6b7280' }}>Subject:</strong> {bulkEmail.subject}
                </div>
              )}
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: '14px 16px', fontSize: 13, color: '#f0f4ed', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {bulkEmail.body}
              </div>
              <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(109,138,64,0.08)', border: '1px solid rgba(109,138,64,0.2)', borderRadius: 8 }}>
                <p style={{ margin: 0, fontSize: 12, color: '#6d8a40', fontWeight: 600 }}>Your pipeline contacts:</p>
                <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {pipeline.map(l => (
                    <span key={l.id} style={{ fontSize: 11, padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#9ca88e' }}>
                      {l.name} {l.phone ? `· ${l.phone}` : ''}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
