import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { q: 'What does the Lead Finder do?', a: 'Search real local businesses across 50+ categories by suburb or city. Every result is scored by website quality, includes phone number, address, and rating — all pulled live from Google.' },
    { q: 'Where does contact info come from?', a: 'Phone numbers and addresses come directly from Google Places. Emails are scraped from the business website where publicly listed. Phone numbers are found for the majority of leads.' },
    { q: 'How do the email drafts work?', a: 'Every lead gets two personalised outreach emails ready to copy — one focused on their website/marketing opportunity, one a broader intro pitch. Both include your contact details. One-click bulk email generates a draft for every lead in your pipeline.' },
    { q: 'What is the AI Business Researcher?', a: 'Ask anything about a lead — their industry, competitors, what marketing angles to use, how to pitch them — and Gemini AI answers using real context about their business.' },
    { q: 'What is the Lovable.dev prompt?', a: 'One click generates a complete website design brief for any lead, ready to paste straight into Lovable.dev to build them a site. It includes their business type, target audience, and design direction.' },
    { q: 'Is it really free?', a: 'Yes. Google Places gives $200 free credit per month — enough for thousands of searches. The AI features use Google Gemini free tier. Hosting on Vercel is free. No subscriptions, no hidden costs.' },
  ]

  return (
    <>
      <Head>
        <title>Robertson Marketing — Local Business Lead Finder</title>
        <meta name="description" content="Find local business leads, generate personalised outreach emails, and research prospects with AI. Built for freelancers and agencies." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* NAV */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(10,15,10,0.92)', backdropFilter: 'blur(16px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6d8a40, #afc28a)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, color: '#0a0f0a' }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#f0f4ed', letterSpacing: '-0.02em' }}>Robertson Marketing</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link href="/app" style={{ padding: '8px 16px', fontSize: 14, color: '#afc28a', textDecoration: 'none', borderRadius: 8 }}>Sign In</Link>
            <Link href="/app" style={{ padding: '8px 18px', fontSize: 14, fontWeight: 600, background: '#6d8a40', color: '#fff', textDecoration: 'none', borderRadius: 8 }}>Start Free</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop: 140, paddingBottom: 80, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 800, height: 500, background: 'radial-gradient(ellipse, rgba(109,138,64,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 100, border: '1px solid rgba(175,194,138,0.25)', background: 'rgba(109,138,64,0.1)', fontSize: 13, color: '#afc28a', marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6d8a40', display: 'inline-block' }} className="pulse" />
            Search → score → pitch — all in one place
          </div>
          <h1 style={{ fontSize: 'clamp(38px, 6vw, 68px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#f0f4ed', margin: '0 0 24px' }}>
            Find business leads<br />
            <span style={{ color: '#6d8a40' }}>before your competitors do.</span>
          </h1>
          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: '#9ca88e', lineHeight: 1.6, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Search local businesses, get their contact details, draft personalised outreach emails, and research prospects with AI — all in one workflow.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/app" style={{ padding: '14px 28px', fontSize: 16, fontWeight: 700, background: '#6d8a40', color: '#fff', textDecoration: 'none', borderRadius: 10, letterSpacing: '-0.01em' }}>
              Start for Free →
            </Link>
            <a href="#how-it-works" style={{ padding: '14px 28px', fontSize: 16, fontWeight: 500, color: '#afc28a', border: '1px solid rgba(175,194,138,0.25)', textDecoration: 'none', borderRadius: 10 }}>
              How it works
            </a>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', marginTop: 14 }}>No credit card required</p>
        </div>

        {/* FAKE APP PREVIEW */}
        <div style={{ maxWidth: 900, margin: '64px auto 0', padding: '0 24px' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f97316', opacity: 0.7 }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#6d8a40', opacity: 0.7 }} />
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>robertsonmarketing.vercel.app / lead-finder</span>
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
                {[{ label: 'Leads found', val: '24' }, { label: 'Hot leads', val: '8' }, { label: 'With phone', val: '21' }].map(s => (
                  <div key={s.label} style={{ background: 'rgba(109,138,64,0.1)', border: '1px solid rgba(109,138,64,0.2)', borderRadius: 10, padding: '14px 16px' }}>
                    <div style={{ fontSize: 11, color: '#6d8a40', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{s.label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color: '#afc28a' }}>{s.val}</div>
                  </div>
                ))}
              </div>
              {[
                { name: 'Lakeview Dental Group', cat: 'Dentist', score: 92, tier: 'Hot', phone: '(03) 9412 8800', website: 'No website' },
                { name: 'Sunrise Family Dentistry', cat: 'Dentist', score: 78, tier: 'Hot', phone: '(03) 9388 1200', website: 'Outdated site' },
                { name: 'North Shore Orthodontics', cat: 'Dentist', score: 61, tier: 'Warm', phone: '(03) 9419 5500', website: 'Basic site' },
                { name: 'Skokie Family Dentistry', cat: 'Dentist', score: 44, tier: 'Warm', phone: '(03) 9421 7700', website: 'Decent site' },
              ].map((lead, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: i === 0 ? 'rgba(109,138,64,0.08)' : 'rgba(255,255,255,0.02)', borderRadius: 10, marginBottom: 8, border: i === 0 ? '1px solid rgba(109,138,64,0.2)' : '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(109,138,64,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#6d8a40' }}>{lead.name.charAt(0)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#f0f4ed', marginBottom: 2 }}>{lead.name}</div>
                    <div style={{ fontSize: 12, color: '#6b7280' }}>{lead.phone} · {lead.website}</div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: '#afc28a', minWidth: 36, textAlign: 'right' }}>{lead.score}</div>
                  <div style={{ padding: '3px 10px', borderRadius: 100, fontSize: 11, fontWeight: 700, background: lead.tier === 'Hot' ? '#ef4444' : '#f97316', color: '#fff', minWidth: 44, textAlign: 'center' }}>{lead.tier}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, color: '#6d8a40', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Everything you need</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f0f4ed', margin: 0 }}>Built to close more local clients</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {[
            { icon: '🔍', title: 'Lead Finder', desc: 'Search local businesses across 50+ categories. Every result scored, with phone number, address, website quality signal, and rating.' },
            { icon: '📋', title: 'Pipeline', desc: 'Organise every lead. Track outreach stage, score, tier, and status in one clean view — saved in your browser, no account needed.' },
            { icon: '✉️', title: 'Outreach Emails', desc: 'Two personalised email drafts per lead — one targeting their website/marketing gap, one broad intro. Bulk-email your whole pipeline in one click.' },
            { icon: '🤖', title: 'AI Business Researcher', desc: 'Ask anything about a lead. Gemini AI answers with context — pitch angles, competitor landscape, what services they likely need.' },
            { icon: '⚡', title: 'Lovable.dev Prompt', desc: 'One click generates a full website design brief for any lead, ready to paste straight into Lovable.dev to build their site.' },
            { icon: '📞', title: 'Contact Info', desc: "Phone numbers from Google for the majority of leads. Emails scraped from the business website where publicly listed." },
          ].map((f, i) => (
            <div key={i} style={{ padding: '28px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14 }}>
              <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f4ed', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#9ca88e', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: '#6d8a40', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>How it works</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f0f4ed', margin: '0 0 56px' }}>Three steps from search to close</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { n: '01', title: 'Find local businesses', desc: 'Choose a category and suburb. Robertson Marketing scores every result with website quality signals, phone number, and tier.' },
              { n: '02', title: 'Save your best leads', desc: 'Review scored prospects and save the strongest to your pipeline. Hot leads flag who has no website — your easiest pitch.' },
              { n: '03', title: 'Pitch with personalised emails', desc: 'One click generates two tailored outreach emails per lead. Copy, send, follow up — all from one screen.' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: '#6d8a40', opacity: 0.5, marginBottom: 12, letterSpacing: '-0.03em' }}>{s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: '#f0f4ed', margin: '0 0 10px' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#9ca88e', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 48 }}>
            <Link href="/app" style={{ padding: '14px 28px', fontSize: 16, fontWeight: 700, background: '#6d8a40', color: '#fff', textDecoration: 'none', borderRadius: 10 }}>
              Start Finding Leads →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '80px 24px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 13, color: '#6d8a40', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Common questions</p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.03em', color: '#f0f4ed', margin: 0 }}>Quick answers</h2>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '20px 0' }}>
            <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#f0f4ed' }}>{faq.q}</span>
              <span style={{ fontSize: 20, color: '#6d8a40', flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
            </button>
            {openFaq === i && (
              <p style={{ fontSize: 14, color: '#9ca88e', lineHeight: 1.7, margin: '14px 0 0' }} className="fade-in">{faq.a}</p>
            )}
          </div>
        ))}
        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <Link href="/app" style={{ padding: '14px 28px', fontSize: 16, fontWeight: 700, background: '#6d8a40', color: '#fff', textDecoration: 'none', borderRadius: 10 }}>
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg, #6d8a40, #afc28a)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 12, color: '#0a0f0a' }}>R</div>
            <span style={{ fontWeight: 700, fontSize: 14, color: '#f0f4ed' }}>Robertson Marketing</span>
          </div>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/app" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>App</Link>
            <a href="mailto:robertsonmarketingofficial@gmail.com" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none' }}>Contact</a>
          </div>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>© 2026 Robertson Marketing · Callum Robertson</p>
        </div>
      </footer>
    </>
  )
}
