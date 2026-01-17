'use client'

import { useState, useEffect } from 'react'

interface Agent {
  id: number
  first_name: string
  middle_name: string
  last_name: string
  address_line_1: string
  address_line_2: string
  address_line_3: string
  city: string
  state: string
  zip: string
  featured: boolean
}

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]

export default function FindEAPage() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState('MI')
  const [city, setCity] = useState('')
  const [name, setName] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const searchAgents = async (newPage = 1) => {
    setLoading(true)
    setPage(newPage)

    const params = new URLSearchParams()
    if (state) params.set('state', state)
    if (city) params.set('city', city)
    if (name) params.set('name', name)
    params.set('page', newPage.toString())

    try {
      const res = await fetch('/api/find-ea?' + params.toString())
      const data = await res.json()
      setAgents(data.agents || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Search error:', error)
    }

    setLoading(false)
  }

  useEffect(() => {
    searchAgents()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchAgents(1)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
          }}>
            📊
          </div>
          <div>
            <h1 style={{ color: 'white', fontSize: '20px', margin: 0, fontWeight: 600 }}>
              TaxScope AI
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>
              Find an Enrolled Agent
            </p>
          </div>
        </a>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a href="/" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Home</a>
          <a href="/chat" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontSize: '14px' }}>Chat</a>
          <a href="/find-ea" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>Find an EA</a>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' as const }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ color: 'white', fontSize: '36px', margin: '0 0 12px', fontWeight: 700 }}>
            Find an Enrolled Agent
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', margin: 0, maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            Search our directory of {total > 0 ? total.toLocaleString() : '70,000+'} IRS-licensed Enrolled Agents across the United States.
          </p>
        </div>

        <form onSubmit={handleSearch} style={{
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              >
                <option value="all" style={{ background: '#1a1a2e' }}>All States</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s} style={{ background: '#1a1a2e' }}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Detroit"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginBottom: '8px' }}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Smith"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255,255,255,0.2)',
                  background: 'rgba(255,255,255,0.05)',
                  color: 'white',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        <div style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '16px', fontSize: '14px' }}>
          Found <span style={{ color: 'white', fontWeight: 600 }}>{total.toLocaleString()}</span> Enrolled Agents
          {state && state !== 'all' && <span> in <span style={{ color: 'white', fontWeight: 600 }}>{state}</span></span>}
          {city && <span> near <span style={{ color: 'white', fontWeight: 600 }}>{city}</span></span>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {agents.map((agent) => (
            <div
              key={agent.id}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '12px',
                padding: '20px',
                border: agent.featured ? '2px solid #667eea' : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {agent.featured && (
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: 600,
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}>
                  Featured
                </span>
              )}
              <h3 style={{ color: 'white', fontSize: '18px', margin: '0 0 8px', fontWeight: 600 }}>
                {agent.first_name} {agent.middle_name} {agent.last_name}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 4px', fontSize: '14px' }}>
                📍 {agent.city}, {agent.state} {agent.zip}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0 0 12px', fontSize: '13px' }}>
                {agent.address_line_1}
                {agent.address_line_2 && ', ' + agent.address_line_2}
              </p>
              <span style={{
                display: 'inline-block',
                padding: '6px 12px',
                background: 'rgba(74, 222, 128, 0.2)',
                color: '#4ade80',
                fontSize: '13px',
                borderRadius: '20px',
              }}>
                ✓ IRS Enrolled Agent
              </span>
            </div>
          ))}
        </div>

        {!loading && agents.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>No Enrolled Agents found. Try adjusting your search.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
            <button
              onClick={() => searchAgents(page - 1)}
              disabled={page <= 1 || loading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: page <= 1 ? 'rgba(255,255,255,0.3)' : 'white',
                fontSize: '14px',
                cursor: page <= 1 || loading ? 'not-allowed' : 'pointer',
              }}
            >
              ← Previous
            </button>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => searchAgents(page + 1)}
              disabled={page >= totalPages || loading}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.05)',
                color: page >= totalPages ? 'rgba(255,255,255,0.3)' : 'white',
                fontSize: '14px',
                cursor: page >= totalPages || loading ? 'not-allowed' : 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}

        <div style={{
          marginTop: '48px',
          textAlign: 'center',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '16px',
          padding: '32px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}>
          <h2 style={{ color: 'white', fontSize: '24px', margin: '0 0 12px', fontWeight: 600 }}>Are you an Enrolled Agent?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', margin: '0 0 20px', fontSize: '15px' }}>Claim your profile to get more visibility and connect with potential clients.</p>
          <a
            href="/chat"
            style={{
              display: 'inline-block',
              padding: '14px 28px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Claim Your Profile
          </a>
        </div>
      </main>

      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '24px',
        textAlign: 'center',
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', margin: '0 0 8px' }}>© 2025 TaxScope AI. All rights reserved.</p>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', margin: 0 }}>Data sourced from IRS FOIA public records.</p>
      </footer>
    </div>
  )
}