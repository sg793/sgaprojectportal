
import React, { useEffect, useMemo, useState } from 'react'

const PORTAL_TITLE = 'SGA Client Portal'
const PORTAL_INTRO = 'This portal serves as a direct window into the progress of your project.'
const PORTAL_PRIVACY = 'Private project link. Curated for client-facing visibility.'

const FEEDS = {
  projectInfo: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=747018816&single=true&output=csv',
  projectStatus: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=475363061&single=true&output=csv',
  ownerActions: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=1104198492&single=true&output=csv',
  projectProgress: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=95397376&single=true&output=csv',
}

const PHASE_SEGMENTS = [
  { key: 'SD', label: 'SD', start: 0, end: 15 },
  { key: 'DD', label: 'DD', start: 15, end: 35 },
  { key: 'CD', label: 'CD', start: 35, end: 75 },
  { key: 'PR', label: 'PR', start: 75, end: 80 },
  { key: 'CA', label: 'CA', start: 80, end: 100 },
]

const fallbackData = {
  projectInfo: {
    projectname: 'CCA Janet Vackar High School',
    client: 'Covenant Christian Academy',
    location: 'McAllen, Texas',
    summary: '38,500 SF High School for 250 Students',
  },
  projectStatus: {
    phase: 'Schematic Design (SD)',
    progress: '5',
    progresslabel: 'Early stage of schematic design; project progressing as expected.',
    owneractionrequired: 'yes',
  },
  ownerActions: [
    {
      order: 1,
      actiontitle: 'Execute contract amendment',
      note: 'Sign AIA document G802 to align the agreement with the updated owner-approved scope of work.',
      status: 'active',
    },
    {
      order: 2,
      actiontitle: 'Confirm civil engineering lead',
      note: 'Select the civil engineer to handle subdivision, replatting, and site civil scope.',
      status: 'active',
    },
  ],
  projectProgress: [
    {
      order: 1,
      steptitle: 'Project Direction Established',
      status: 'completed',
      note: 'Overall project direction and phase framework established.',
    },
    {
      order: 2,
      steptitle: 'Program Revision Completed',
      status: 'completed',
      note: 'Program refined to reflect updated building strategy.',
    },
    {
      order: 3,
      steptitle: 'Program Confirmation',
      status: 'active',
      note: 'Program to be formally confirmed and incorporated into the amended agreement.',
    },
    {
      order: 4,
      steptitle: 'Institutional Coordination',
      status: 'upcoming',
      note: 'Coordination with South Texas College to inform classroom requirements.',
    },
    {
      order: 5,
      steptitle: 'Advance Schematic Design',
      status: 'upcoming',
      note: 'Progress schematic design work immediately after program confirmation.',
    },
  ],
}

function normalizeKey(value) {
  return String(value || '')
    .replace(/^\ufeff/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

function parseCsvLine(line) {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i]
    const nextChar = line[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

function parseCsv(text) {
  const lines = String(text || '')
    .replace(/^\ufeff/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length)

  if (!lines.length) return []

  const headers = parseCsvLine(lines[0]).map(normalizeKey)
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return headers.reduce((acc, header, index) => {
      acc[header] = (values[index] ?? '').trim()
      return acc
    }, {})
  })
}

async function fetchCsvRows(url) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) {
    throw new Error(`Feed request failed: ${response.status}`)
  }
  const text = await response.text()
  return parseCsv(text)
}

function rowsToFieldMap(rows) {
  return rows.reduce((acc, row) => {
    const field = normalizeKey(row.field)
    if (field) acc[field] = row.value || ''
    return acc
  }, {})
}

function rowsToItems(rows) {
  return rows
    .map((row) => ({
      order: Number(row.order || 999),
      steptitle: row.steptitle || row.title || row.actiontitle || '',
      actiontitle: row.actiontitle || row.steptitle || row.title || '',
      note: row.note || '',
      status: String(row.status || '').trim().toLowerCase(),
    }))
    .filter((row) => row.steptitle || row.actiontitle)
    .sort((a, b) => a.order - b.order)
}

function clamp(number, min, max) {
  return Math.min(max, Math.max(min, number))
}

function getVisibleProgress(items) {
  const completed = items.filter((item) => item.status === 'completed').sort((a, b) => a.order - b.order)
  const active = items.filter((item) => item.status === 'active').sort((a, b) => a.order - b.order)
  const upcoming = items.filter((item) => item.status === 'upcoming').sort((a, b) => a.order - b.order)

  return {
    completed: completed.slice(Math.max(0, completed.length - 3)),
    active: active.slice(0, 3),
    upcoming: upcoming.slice(0, 3),
  }
}

function getFeedBadge(status) {
  if (status === 'live') return { label: 'Live sheet feed', tone: 'is-live' }
  if (status === 'partial') return { label: 'Partial fallback', tone: 'is-partial' }
  return { label: 'Fallback content', tone: 'is-fallback' }
}

function getCurrentPhaseKey(phase, progress) {
  const normalized = String(phase || '').toUpperCase()
  const phaseMatch = PHASE_SEGMENTS.find((segment) => normalized.includes(segment.key))
  if (phaseMatch) return phaseMatch.key
  const value = clamp(Number(progress || 0), 0, 100)
  return PHASE_SEGMENTS.find((segment) => value >= segment.start && value <= segment.end)?.key || 'SD'
}

function DetailPill({ label, value }) {
  if (!value) return null
  return (
    <div className="detail-pill">
      <span className="detail-pill-label">{label}</span>
      <span className="detail-pill-value">{value}</span>
    </div>
  )
}

function ProgressSection({ title, subtitle, items, tone }) {
  if (!items.length) return null
  return (
    <section className="progress-group">
      <div className="progress-group-head">
        <h3>{title}</h3>
        <span className={`tone-pill tone-${tone}`}>{items.length}</span>
      </div>
      {subtitle ? <p className="group-subtitle">{subtitle}</p> : null}
      <div className="progress-stack">
        {items.map((item) => (
          <article key={`${item.status}-${item.order}-${item.steptitle}`} className="progress-card">
            <div className="progress-card-top">
              <span className={`status-chip status-${tone}`}>{item.status}</span>
            </div>
            <h4>{item.steptitle}</h4>
            {item.note ? <p>{item.note}</p> : null}
          </article>
        ))}
      </div>
    </section>
  )
}

function App() {
  const [data, setData] = useState(fallbackData)
  const [feedStatus, setFeedStatus] = useState('fallback')

  useEffect(() => {
    let mounted = true

    async function loadFeeds() {
      const results = await Promise.allSettled([
        fetchCsvRows(FEEDS.projectInfo),
        fetchCsvRows(FEEDS.projectStatus),
        fetchCsvRows(FEEDS.ownerActions),
        fetchCsvRows(FEEDS.projectProgress),
      ])

      if (!mounted) return

      const nextData = {
        projectInfo: fallbackData.projectInfo,
        projectStatus: fallbackData.projectStatus,
        ownerActions: fallbackData.ownerActions,
        projectProgress: fallbackData.projectProgress,
      }

      let fulfilled = 0

      if (results[0].status === 'fulfilled' && results[0].value.length) {
        nextData.projectInfo = { ...fallbackData.projectInfo, ...rowsToFieldMap(results[0].value) }
        fulfilled += 1
      }

      if (results[1].status === 'fulfilled' && results[1].value.length) {
        nextData.projectStatus = { ...fallbackData.projectStatus, ...rowsToFieldMap(results[1].value) }
        fulfilled += 1
      }

      if (results[2].status === 'fulfilled' && results[2].value.length) {
        nextData.ownerActions = rowsToItems(results[2].value)
        fulfilled += 1
      }

      if (results[3].status === 'fulfilled' && results[3].value.length) {
        nextData.projectProgress = rowsToItems(results[3].value)
        fulfilled += 1
      }

      setData(nextData)
      setFeedStatus(fulfilled === 4 ? 'live' : fulfilled > 0 ? 'partial' : 'fallback')
    }

    loadFeeds().catch((error) => {
      console.error('Portal feed load failed', error)
      if (mounted) setFeedStatus('fallback')
    })

    return () => {
      mounted = false
    }
  }, [])

  const projectName = data.projectInfo.projectname || fallbackData.projectInfo.projectname
  const client = data.projectInfo.client || fallbackData.projectInfo.client
  const location = data.projectInfo.location || fallbackData.projectInfo.location
  const summary = data.projectInfo.summary || fallbackData.projectInfo.summary

  const phase = data.projectStatus.phase || fallbackData.projectStatus.phase
  const progress = clamp(Number(data.projectStatus.progress || fallbackData.projectStatus.progress || 0), 0, 100)
  const progressLabel = data.projectStatus.progresslabel || fallbackData.projectStatus.progresslabel
  const ownerActionRequired = String(data.projectStatus.owneractionrequired || '').trim().toLowerCase() === 'yes'

  const ownerActions = useMemo(
    () => data.ownerActions.filter((item) => item.status === 'active').slice(0, 3),
    [data.ownerActions]
  )

  const visibleProgress = useMemo(
    () => getVisibleProgress(data.projectProgress.filter((item) => item.status)),
    [data.projectProgress]
  )

  const activePhaseKey = getCurrentPhaseKey(phase, progress)
  const badge = getFeedBadge(feedStatus)

  return (
    <div className="page-shell">
      <div className="page-frame">
        <header className="hero card">
          <div className="hero-copy">
            <div className="hero-badges">
              <span className="badge">{PORTAL_TITLE}</span>
              <span className="badge">Pilot Project</span>
              <span className="badge">{PORTAL_PRIVACY}</span>
              <span className={`badge badge-status ${badge.tone}`}>{badge.label}</span>
            </div>
            <h1>{projectName}</h1>
            <p className="hero-intro">{PORTAL_INTRO}</p>
            <p className="hero-summary">{summary}</p>
            <div className="detail-row">
              <DetailPill label="Client" value={client} />
              <DetailPill label="Location" value={location} />
            </div>
          </div>

          <aside className="status-panel">
            <div className="eyebrow">Project Status</div>
            <div className="phase-chip">{phase}</div>
            <div className="progress-value">{progress}%</div>
            <div className="progress-text">Overall project progress</div>

            <div className="segmented-progress-wrap">
              <div className="segmented-progress-bar" aria-label="Overall project progress segmented by phase">
                <div className="segmented-progress-fill" style={{ width: `${progress}%` }} />
                {PHASE_SEGMENTS.slice(0, -1).map((segment) => (
                  <span
                    key={`divider-${segment.key}`}
                    className="segment-divider"
                    style={{ left: `${segment.end}%` }}
                  />
                ))}
              </div>
              <div className="segment-label-row">
                {PHASE_SEGMENTS.map((segment) => (
                  <span
                    key={segment.key}
                    className={`segment-label ${activePhaseKey === segment.key ? 'is-active' : ''}`}
                    style={{ width: `${segment.end - segment.start}%` }}
                  >
                    {segment.label}
                  </span>
                ))}
              </div>
            </div>

            <p className="progress-caption">{progressLabel}</p>
          </aside>
        </header>

        {ownerActionRequired && ownerActions.length ? (
          <section className="owner-action card accent-card">
            <div className="section-head tight">
              <div>
                <div className="eyebrow danger">Action Required</div>
                <h2>Items currently in your court</h2>
              </div>
            </div>
            <div className="action-stack">
              {ownerActions.map((action) => (
                <article key={`${action.order}-${action.actiontitle}`} className="action-row">
                  <div className="action-count">{action.order}</div>
                  <div>
                    <h3>{action.actiontitle}</h3>
                    {action.note ? <p>{action.note}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="card main-section">
          <div className="section-head">
            <div>
              <div className="eyebrow">Project Progress</div>
              <h2>Current view of recently completed, active, and upcoming work</h2>
            </div>
          </div>

          <div className="progress-grid">
            <ProgressSection
              title="Recently Completed"
              subtitle="Work that has just been finished."
              items={visibleProgress.completed}
              tone="completed"
            />
            <ProgressSection
              title="Current Focus"
              subtitle="Work actively underway now."
              items={visibleProgress.active}
              tone="active"
            />
            <ProgressSection
              title="Coming Up"
              subtitle="What is expected next."
              items={visibleProgress.upcoming}
              tone="upcoming"
            />
          </div>
        </section>

        <footer className="portal-footer">
          <div>
            <div className="footer-title">Sam Garcia Architect, LLC</div>
            <p>This portal is intentionally curated to communicate progress with clarity while keeping internal operational detail private.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
