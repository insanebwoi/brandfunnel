import { useState } from 'react'
import Papa from 'papaparse'
import { BrandReportModal } from './BrandReportModal.jsx'
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
  CopyIcon,
  GlobeIcon,
  RefreshIcon,
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
  pipelineStatus,
  fallbackNotice,
  stopMessage,
  filterAvailable,
  onFilterChange,
  onNewSearch,
}) {
  const [toastMessage, setToastMessage] = useState(null)
  const [selectedReportRow, setSelectedReportRow] = useState(null)

  const isPipelineComplete = pipelineStatus === 'done'
  const visible = filterAvailable ? rows.filter(r => r.isAlive || r.hasAny) : rows
  const aliveRows = isPipelineComplete ? rows.filter(r => r.isAlive) : []

  // Extract winning bare brand names (strictly 100% passed survivors when pipeline is complete)
  const freeBrandNames = isPipelineComplete ? [...new Set(
    rows
      .filter(row => row.isAlive)
      .map(row => row.baseName)
  )] : []

  // Extract available domain names (e.g. brand.com, brand.io)
  const availableDomains = rows.flatMap(row => {
    return Object.entries(row.domainCols || {})
      .filter(([, res]) => res?.ok && res?.available)
      .map(([tld]) => `${row.baseName}${tld}`)
  })

  // Extract available Instagram usernames
  const availableInstaHandles = rows
    .filter(row => row.social?.instagram?.status === 'free')
    .map(row => `@${row.baseName}`)

  // Map of stageId -> status
  const stageMap = (stages || []).reduce((acc, s) => {
    acc[s.id] = s.status
    return acc
  }, {})

  function showToast(msg) {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  function copyFreeBrandNames() {
    if (!freeBrandNames.length) {
      showToast('No winning brand names available to copy.')
      return
    }
    const text = freeBrandNames.join('\n')
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${freeBrandNames.length} clean brand name${freeBrandNames.length > 1 ? 's' : ''}!`)
    }).catch(() => {
      showToast('Failed to copy to clipboard.')
    })
  }

  function copyAvailableDomains() {
    if (!availableDomains.length) {
      showToast('No free domains available to copy.')
      return
    }
    const text = availableDomains.join('\n')
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${availableDomains.length} free domain name${availableDomains.length > 1 ? 's' : ''}!`)
    }).catch(() => {
      showToast('Failed to copy to clipboard.')
    })
  }

  function copyAvailableInsta() {
    if (!availableInstaHandles.length) {
      showToast('No free Instagram handles available to copy.')
      return
    }
    const text = availableInstaHandles.join('\n')
    navigator.clipboard.writeText(text).then(() => {
      showToast(`Copied ${availableInstaHandles.length} free Instagram handle${availableInstaHandles.length > 1 ? 's' : ''}!`)
    }).catch(() => {
      showToast('Failed to copy to clipboard.')
    })
  }

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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="copy-toast-banner">
          <CheckIcon size={14} style={{ color: 'var(--avail)', flexShrink: 0 }} />
          <span>{toastMessage}</span>
        </div>
      )}

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
          {onNewSearch && (
            <button
              className="btn-copy-quick edit-names-btn"
              onClick={onNewSearch}
              title="Edit names list or change search options"
            >
              <RefreshIcon size={12} />
              <span>Edit Names</span>
            </button>
          )}
          {freeBrandNames.length > 0 && (
            <button
              className="btn-copy-quick names-only"
              onClick={copyFreeBrandNames}
              title="Copy bare 100% passed survivor brand names without TLD extensions or @ symbol"
            >
              <SparklesIcon size={12} />
              <CopyIcon size={12} />
              <span>Copy Names ({freeBrandNames.length})</span>
            </button>
          )}
          <button
            className="btn-copy-quick"
            onClick={copyAvailableDomains}
            title="Copy all available domain names to clipboard"
            disabled={!availableDomains.length}
          >
            <GlobeIcon size={12} />
            <CopyIcon size={12} />
            <span>Copy Domains ({availableDomains.length})</span>
          </button>
          <button
            className="btn-copy-quick insta"
            onClick={copyAvailableInsta}
            title="Copy all available Instagram handles to clipboard"
            disabled={!availableInstaHandles.length}
          >
            <InstagramIcon size={12} />
            <CopyIcon size={12} />
            <span>Copy Insta ({availableInstaHandles.length})</span>
          </button>
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
              const isAllClear = isPipelineComplete && row.isAlive
              const isRunning = pipelineStatus === 'running'
              return (
                <tr key={row.baseName} className={isAllClear ? 'row-alive' : 'row-eliminated'}>
                  <td>
                    <div className="td-inner">
                      <div className="name-status-row">
                        <span
                          className="td-name clickable-name"
                          onClick={() => setSelectedReportRow(row)}
                          title="Click to view detailed Brand Analysis Report"
                        >
                          {row.baseName}
                        </span>
                        {isAllClear ? (
                          <span className="badge-alive">
                            <SparklesIcon size={11} />
                            <span>ALL CLEAR</span>
                          </span>
                        ) : isRunning && row.isAlive ? (
                          <span className="badge-alive pending-clear" style={{ background: 'var(--accent-bg)', borderColor: 'var(--accent-border)', color: 'var(--accent-2)' }}>
                            <ZapIcon size={10} />
                            <span>In Funnel…</span>
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

      {/* Brand Name Analysis Report Modal */}
      {selectedReportRow && (
        <BrandReportModal
          nameRow={selectedReportRow}
          tlds={tlds}
          activeSocials={activeSocials}
          onClose={() => setSelectedReportRow(null)}
        />
      )}
    </>
  )
}

