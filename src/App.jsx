import React, { useEffect, useMemo, useState } from 'react'

const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vReFJxB81B_Vt6Aw2_1rlKfQJWDd65r94-XRczm5dqwNxxTQ2t8rutzDBSLRvDcohOy0uT-FuAE219z/pub?gid=0&single=true&output=csv'

const fallbackProjectData = {
  portalTitle: 'SGA Client Portal',
  intro: 'This portal serves as a direct window into the progress of your project.',
  privacyNote: 'Private project link. Curated for client-facing visibility.',
  project: {
    name: 'CCA Vackar High School',
    client: 'CCTA / CCA Vackar Initiative',
    location: 'McAllen, Texas',
    type: 'Private Educational Campus',
    summary: 'This portal provides a clear, curated view of major project progress, milestones, and next steps for the CCA Vackar High School initiative.',
    phase: 'Programming / Early Design Coordination',
    progress: 24,
    progressLabel: 'Early design alignment underway',
    permitStatus: {
      label: 'Pending owner-directed advancement',
      tone: 'pending',
      detail: 'Formal permitting has not commenced. Current activity remains focused on program validation, scope alignment, and institutional coordination.',
    },
    jurisdictionStatus: {
      label: 'In coordination',
      tone: 'coordination',
      detail: 'Coordination with South Texas College remains an important input item for instructional space requirements and overall planning alignment.',
    },
    nextSteps: [
      'Finalize updated space program for client review and confirmation.',
      'Incorporate current direction regarding combined Buildings A and B and the revised classroom count.',
      'Continue coordination related to instructional-space requirements and planning assumptions.',
    ],
  },
  milestones: [
    { title: 'Initial project direction established', status: 'completed', date: 'Completed', note: 'Overall project direction and phase framework established.' },
    { title: 'Program revision in progress', status: 'current', date: 'Current', note: 'Program is being refined to reflect combined Buildings A and B and the revised classroom count.' },
    { title: 'Updated program confirmation', status: 'upcoming', date: 'Pending', note: 'Updated program document to be reviewed and confirmed as the formal basis for continued advancement.' },
    { title: 'Institutional coordination input', status: 'upcoming', date: 'Pending', note: 'South Texas College coordination to inform classroom and instructional-space assumptions.' },
  ],
  updates: [
    { date: 'March 2026', title: 'Project scope direction refined', body: 'Current direction reflects the consolidation of Buildings A and B into a single building strategy, with Building C remaining part of the overall project scope.' },
    { date: 'March 2026', title: 'Programming revision underway', body: 'The updated programming document is being prepared to confirm key space allocations and provide a formal basis for continued design advancement.' },
    { date: 'March 2026', title: 'Institutional coordination remains active', body: 'Input related to instructional space requirements remains an active coordination item and will help guide continued project alignment.' },
  ],
  gallery: [
    { title: 'Concept Rendering', subtitle: 'Reserved for curated presentation image', image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1600&q=80' },
    { title: 'Campus Character', subtitle: 'Reserved for additional rendering or site image', image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80' },
  ],
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
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean)
  if (!lines.length) return []
  const headers = parseCsvLine(lines[0])
  return lines.slice(1).map(line => {
    const values = parseCsvLine(line)
    return headers.reduce((acc, header, index) => {
      acc[header] = values[index] ?? ''
      return acc
    }, {})
  })
}

function splitPipe(value) {
  return (value || '').split('|').map(item => item.trim()).filter(Boolean)
}

function rowsToProjectData(rows) {
  const settings = {}
  const milestones = []
  const updates = []
  const gallery = []

  rows.forEach((row) => {
    const type = (row.type || '').trim().toLowerCase()
    if (type === 'setting') settings[row.key] = row.value || ''
    if (type === 'milestone') milestones.push({ title: row.title || '', status: (row.status || 'upcoming').toLowerCase(), date: row.date || 'Pending', note: row.note || '' })
    if (type === 'update') updates.push({ date: row.date || '', title: row.title || '', body: row.body || '' })
    if (type === 'gallery') gallery.push({ title: row.title || '', subtitle: row.subtitle || '', image: row.image || '' })
  })

  return {
    portalTitle: settings.portalTitle || fallbackProjectData.portalTitle,
    intro: settings.intro || fallbackProjectData.intro,
    privacyNote: settings.privacyNote || fallbackProjectData.privacyNote,
    project: {
      name: settings.projectName || fallbackProjectData.project.name,
      client: settings.client || fallbackProjectData.project.client,
      location: settings.location || fallbackProjectData.project.location,
      type: settings.projectType || fallbackProjectData.project.type,
      summary: settings.summary || fallbackProjectData.project.summary,
      phase: settings.phase || fallbackProjectData.project.phase,
      progress: Number(settings.progress || fallbackProjectData.project.progress),
      progressLabel: settings.progressLabel || fallbackProjectData.project.progressLabel,
      permitStatus: {
        label: settings.permitStatusLabel || fallbackProjectData.project.permitStatus.label,
        tone: settings.permitStatusTone || fallbackProjectData.project.permitStatus.tone,
        detail: settings.permitStatusDetail || fallbackProjectData.project.permitStatus.detail,
      },
      jurisdictionStatus: {
        label: settings.jurisdictionStatusLabel || fallbackProjectData.project.jurisdictionStatus.label,
        tone: settings.jurisdictionStatusTone || fallbackProjectData.project.jurisdictionStatus.tone,
        detail: settings.jurisdictionStatusDetail || fallbackProjectData.project.jurisdictionStatus.detail,
      },
      nextSteps: splitPipe(settings.nextSteps).length ? splitPipe(settings.nextSteps) : fallbackProjectData.project.nextSteps,
    },
    milestones: milestones.length ? milestones : fallbackProjectData.milestones,
    updates: updates.length ? updates : fallbackProjectData.updates,
    gallery: gallery.length ? gallery : fallbackProjectData.gallery,
  }
}

function statusClass(status) {
  switch (status) {
    case 'completed': return 'pill pill-dark'
    case 'current': return 'pill pill-current'
    case 'approved': return 'pill pill-dark'
    default: return 'pill pill-light'
  }
}

function App() {
  const [projectData, setProjectData] = useState(fallbackProjectData)
  const [feedStatus, setFeedStatus] = useState('fallback')

  useEffect(() => {
    let mounted = true
    async function loadFeed() {
      try {
        const response = await fetch(SHEET_CSV_URL, { cache: 'no-store' })
        if (!response.ok) throw new Error(`Feed request failed: ${response.status}`)
        const text = await response.text()
        const rows = parseCsv(text)
        const mapped = rowsToProjectData(rows)
        if (mounted) {
          setProjectData(mapped)
          setFeedStatus('live')
        }
      } catch (error) {
        console.error('Portal feed load failed', error)
        if (mounted) setFeedStatus('fallback')
      }
    }
    loadFeed()
    return () => { mounted = false }
  }, [])

  const completedMilestones = useMemo(
    () => projectData.milestones.filter((m) => m.status === 'completed').length,
    [projectData.milestones]
  )

  return (
    <div className="page">
      <div className="container">
        <section className="hero card">
          <div className="hero-left">
            <div className="badges">
              <span className="badge">{projectData.portalTitle}</span>
              <span className="badge">Pilot Project</span>
              <span className="badge">{projectData.privacyNote}</span>
              <span className="badge">
                <span className={`dot ${feedStatus === 'live' ? 'dot-live' : 'dot-fallback'}`}></span>
                {feedStatus === 'live' ? 'Live sheet feed' : 'Fallback content'}
              </span>
            </div>
            <h1>{projectData.project.name}</h1>
            <p className="intro">{projectData.intro}</p>
            <p className="summary">{projectData.project.summary}</p>
          </div>
          <div className="progress-card">
            <div className="kicker">Overall Progress</div>
            <div className="progress-number">{projectData.project.progress}%</div>
            <div className="phase-chip">{projectData.project.phase}</div>
            <div className="progress-bar"><div className="progress-fill" style={{ width: `${projectData.project.progress}%` }} /></div>
            <div className="progress-label">{projectData.project.progressLabel}</div>
          </div>
        </section>

        <section className="stats-grid">
          <div className="stat card"><div className="kicker">Project Type</div><div className="stat-value">{projectData.project.type}</div><div className="stat-sub">{projectData.project.location}</div></div>
          <div className="stat card"><div className="kicker">Current Phase</div><div className="stat-value">{projectData.project.phase}</div><div className="stat-sub">{projectData.project.client}</div></div>
          <div className="stat card"><div className="kicker">Completed Milestones</div><div className="stat-value">{completedMilestones} of {projectData.milestones.length}</div><div className="stat-sub">Curated project checkpoints</div></div>
          <div className="stat card"><div className="kicker">Portal Purpose</div><div className="stat-value">Window to Progress</div><div className="stat-sub">Major milestones, updates, and next steps</div></div>
        </section>

        <section className="content-grid">
          <div className="left-column">
            <div className="card section-card">
              <h2>Project Milestones</h2>
              <p className="section-sub">Completed, current, and upcoming checkpoints.</p>
              <div className="stack">
                {projectData.milestones.map((item, index) => (
                  <div key={index} className="item-card">
                    <div className="item-head">
                      <div>
                        <div className="item-title-row">
                          <h3>{item.title}</h3>
                          <span className={statusClass(item.status)}>{item.status}</span>
                        </div>
                        <p>{item.note}</p>
                      </div>
                      <div className="item-date">{item.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card section-card">
              <h2>Major Updates</h2>
              <p className="section-sub">Formal project updates intended for client-facing visibility.</p>
              <div className="stack">
                {projectData.updates.map((update, index) => (
                  <div key={index} className="item-card">
                    <div className="item-head">
                      <div>
                        <h3>{update.title}</h3>
                        <p>{update.body}</p>
                      </div>
                      <div className="item-date">{update.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="right-column">
            <div className="card section-card">
              <h2>Next Steps</h2>
              <p className="section-sub">Immediate items currently shaping forward progress.</p>
              <div className="stack">
                {projectData.project.nextSteps.map((step, index) => (
                  <div key={index} className="step-card"><span className="step-num">{index + 1}</span><p>{step}</p></div>
                ))}
              </div>
            </div>

            <div className="card section-card">
              <h2>Jurisdiction & Permit Status</h2>
              <p className="section-sub">High-level public-process visibility.</p>
              <div className="stack">
                <div className="item-card">
                  <div className="item-title-row"><h3>Permitting</h3><span className={statusClass(projectData.project.permitStatus.tone)}>{projectData.project.permitStatus.label}</span></div>
                  <p>{projectData.project.permitStatus.detail}</p>
                </div>
                <div className="item-card">
                  <div className="item-title-row"><h3>Institutional Coordination</h3><span className={statusClass(projectData.project.jurisdictionStatus.tone)}>{projectData.project.jurisdictionStatus.label}</span></div>
                  <p>{projectData.project.jurisdictionStatus.detail}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="card section-card">
          <h2>Project Imagery</h2>
          <p className="section-sub">Curated visual material for milestone communication.</p>
          <div className="gallery-grid">
            {projectData.gallery.map((item, index) => (
              <div key={index} className="gallery-card">
                <div className="gallery-image-wrap">
                  <img src={item.image} alt={item.title} className="gallery-image" />
                </div>
                <div className="gallery-body">
                  <h3>{item.title}</h3>
                  <p>{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="footer card">
          <div>
            <div className="footer-title">Controlled visibility</div>
            <p>This portal is intentionally curated to communicate progress with clarity while keeping internal operational detail private.</p>
          </div>
          <div className="footer-brand">Sam Garcia Architect, LLC</div>
        </footer>
      </div>
    </div>
  )
}

export default App
