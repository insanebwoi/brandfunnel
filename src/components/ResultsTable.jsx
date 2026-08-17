import Papa from 'papaparse'
import {
  CheckIcon,
  CrossIcon,
  SparklesIcon,
  DownloadIcon,
  ExternalLinkIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  AlertCircleIcon,
  ZapIcon,
} from './Icons.jsx'

function getPlatformIcon(platform, size = 13) {
  switch (platform) {
    case 'instagram': return <InstagramIcon size={size} />
    case 'youtube':   return <YouTubeIcon size={size} />
    case 'twitter':   return <TwitterIcon size={size} />
    case 'facebook':  return <FacebookIcon size={size} />
    default:          return null
  }
}

// ── Domain status cell ──────────────────────────────────────
function DomainCell({ result }) {
  if (!result) {
    return (
      <td>
        <div className="cell-wrap">
          <span className="status-cell checking">…</span>
        </div>
      </td>
    )
  }

  if (!result.ok) {
    return (
      <td>
        <div className="cell-wrap">
          <span className="status-cell unknown" title={result.error}>Unknown</span>
        </div>
      </td>
    )
  }

  if (result.available) {
    return (
      <td>
        <div className="cell-wrap">
          <span className="status-cell avail">
            <CheckIcon size={11} />
            <span>Free</span>
          </span>
          {result.price != null ? (
            <span className="cell-price">
              {result.currency === 'USD' ? '$' : result.currency + ' '}{result.price.toFixed(2)}/yr
            </span>
          ) : (
            <span className="cell-price-source">DNS verified</span>
          )}
        </div>
      </td>
    )
  }

  return (
    <td>
      <div className="cell-wrap">
        <span className="status-cell taken">
          <CrossIcon size={10} />
          <span>Taken</span>
        </span>
      </div>
    </td>
  )
}

// ── Social status cell ──────────────────────────────────────
function SocialCell({ result, platform, username, color, stageStatus }) {
  // If this stage was skipped
  if (stageStatus === 'pending' && !result) {
    return (
      <td>
        <div className="social-cell-wrap">
          <span className="social-status skipped" title="Stage skipped because previous stage had no survivors">
            Skipped
          </span>
        </div>
      </td>
    )
  }

  if (!result) {
    return (
      <td>
        <div className="social-cell-wrap">
          <span className="social-status unknown">—</span>
        </div>
      </td>
    )
  }

  const { status, reliable } = result
  const profileUrl = {
    instagram: `https://instagram.com/${username}`,
    youtube:   `https://youtube.com/@${username}`,
    twitter:   `https://x.com/${username}`,
    facebook:  `https://facebook.com/${username}`,
  }[platform]

  if (status === 'taken') {
    return (
      <td>
        <div className="social-cell-wrap">
          <a
            className="social-status taken social-link"
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={`@${username} exists on ${platform}`}
          >
            {getPlatformIcon(platform, 12)}
            <span>Taken</span>
            <ExternalLinkIcon size={10} />
          </a>
        </div>
      </td>
    )
  }

  if (status === 'free') {
    return (
      <td>
        <div className="social-cell-wrap">
          <span className="social-status avail">
            <CheckIcon size={11} />
            <span>Free</span>
          </span>
        </div>
      </td>
    )
  }

  return (
    <td>
      <div className="social-cell-wrap">
        <span className="social-status unknown">
          <span>Unconfirmed</span>
          {!reliable && <span className="unreliable-badge"> *</span>}
        </span>
      </div>
    </td>
  )
}

// ── Pipeline Stepper ─────────────────────────────────────────
function PipelineStepper({ stages }) {
  if (!stages || !stages.length) return null

  return (
    <div className="pipeline-stepper" aria-label="Sequential pipeline status">
      {stages.map((stage, idx) => {
        const isDone = stage.status === 'done'
        const isRunning = stage.status === 'running'
        const isStopped = stage.status === 'stopped'
        const isPending = stage.status === 'pending'

        let badgeCls = 'stage-pill '
        if (isDone) badgeCls += 'done'
        else if (isRunning) badgeCls += 'running'
        else if (isStopped) badgeCls += 'stopped'
        else badgeCls += 'pending'

        return (
          <div key={stage.id} className="stepper-item">
            <div className={badgeCls}>
              <span className="stage-step-num">{idx + 1}</span>
              <span className="stage-name">{stage.label}</span>
              {isDone && (
                <span className="stage-tag pass">
                  <CheckIcon size={10} style={{ display: 'inline', marginRight: 3 }} />
                  {stage.survivors} passed
                </span>
              )}
              {isRunning && (
                <span className="stage-tag running">
                  <span className="spinner-mini" /> Checking…
                </span>
              )}
              {isStopped && (
                <span className="stage-tag stopped">
                  <CrossIcon size={10} style={{ display: 'inline', marginRight: 3 }} />
                  0 free
                </span>
              )}
              {isPending && <span className="stage-tag pending">Queued</span>}
            </div>
            {idx < stages.length - 1 && <span className="stepper-arrow">→</span>}
          </div>
        )
      })}
    </div>
  )
}

// ── Main table ──────────────────────────────────────────────
export default function ResultsTable({
  rows,
  tlds,
  activeSocials,
  stages,
  fallbackNotice,
  stopMessage,
  filterAvailable,
  onFilterChange
}) {
  const visible = filterAvailable ? rows.filter(r => r.isAlive || r.hasAny) : rows
  const aliveRows = rows.filter(r => r.isAlive)

  // Map of stageId -> status
  const stageMap = (stages || []).reduce((acc, s) => {
    acc[s.id] = s.status
    return acc
  }, {})

  function exportCSV() {
    const data = rows.map(row => {
      const record = {
        name: row.baseName,
        status: row.isAlive ? 'PASSED_ALL' : `ELIMINATED_AT_${(row.eliminatedAt || 'UNKNOWN').toUpperCase()}`
      }
      for (const tld of tlds) {
        const r = row.domainCols[tld]
        if (!r) { record[tld] = 'unknown'; continue }
        if (!r.ok) { record[tld] = 'error'; continue }
        record[tld] = r.available
          ? `free${r.price != null ? ` ($${r.price.toFixed(2)})` : ''}`
          : 'taken'
      }
      for (const p of activeSocials) {
        const sr = row.social?.[p.platform]
        record[p.platform] = sr?.status ?? (stageMap[p.platform] === 'pending' ? 'skipped' : 'unknown')
      }
      return record
    })
    const csv  = Papa.unparse(data)
    const blob = new Blob([csv], { type: 'text/csv' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url
    a.download = `brand-pipeline-check-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      {/* Pipeline Stepper Visualizer */}
      <PipelineStepper stages={stages} />

      {/* Live DNS Status Notice */}
      {fallbackNotice && (
        <div className="fallback-notice-banner">
          <ZapIcon size={14} className="fallback-notice-icon" />
          <span>{fallbackNotice}</span>
        </div>
      )}

      {/* Early Stop Banner if applicable */}
      {stopMessage && (
        <div className="stop-banner">
          <AlertCircleIcon size={18} className="stop-banner-icon" />
          <div className="stop-banner-content">
            <div className="stop-banner-title">Pipeline Stopped Early</div>
            <div className="stop-banner-desc">{stopMessage}</div>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="results-bar">
        <div>
          <span className="results-count">
            <strong>{visible.length}</strong> of {rows.length} names
          </span>
          {aliveRows.length > 0 ? (
            <span className="results-avail">
              <SparklesIcon size={12} style={{ display: 'inline', margin: '0 4px' }} />
              {aliveRows.length} passed all stages
            </span>
          ) : (
            <span className="results-stopped-note"> · 0 names cleared all stages</span>
          )}
        </div>
        <div className="results-spacer" />
        <div className="results-actions">
          <button
            className={`filter-btn${filterAvailable ? ' active' : ''}`}
            onClick={() => onFilterChange(!filterAvailable)}
          >
            <span className="filter-dot" style={{ background: filterAvailable ? 'var(--avail)' : 'var(--text-3)' }} />
            Survivors only
          </button>
          <button className="btn-export" onClick={exportCSV} disabled={!rows.length}>
            <DownloadIcon size={13} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="results-scroll">
        <table>
          <thead>
            <tr>
              <th>Name &amp; Status</th>
              {tlds.map(tld => <th key={tld} className="center">{tld}</th>)}
              {activeSocials.map(p => (
                <th key={p.platform} className="center" style={{ color: p.color }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {getPlatformIcon(p.platform, 13)}
                    {p.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map(row => {
              const isAlive = row.isAlive
              return (
                <tr key={row.baseName} className={isAlive ? 'row-alive' : 'row-eliminated'}>
                  <td>
                    <div className="td-inner">
                      <div className="name-status-row">
                        <span className="td-name">{row.baseName}</span>
                        {isAlive ? (
                          <span className="badge-alive">
                            <SparklesIcon size={11} />
                            <span>ALL CLEAR</span>
                          </span>
                        ) : (
                          <span className="badge-eliminated">
                            <CrossIcon size={9} />
                            <span>Failed: {row.eliminatedAt ? (row.eliminatedAt === 'domain' ? 'Domains' : row.eliminatedAt) : 'Taken'}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  {tlds.map(tld => (
                    <DomainCell key={tld} result={row.domainCols[tld]} />
                  ))}
                  {activeSocials.map(p => (
                    <SocialCell
                      key={p.platform}
                      result={row.social?.[p.platform]}
                      platform={p.platform}
                      username={row.baseName}
                      color={p.color}
                      stageStatus={stageMap[p.platform]}
                    />
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
