import { useState } from 'react'
import {
  SparklesIcon,
  CheckIcon,
  CrossIcon,
  GlobeIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  ExternalLinkIcon,
  DownloadIcon,
  CopyIcon,
} from './Icons.jsx'

export function BrandReportModal({ nameRow, tlds, activeSocials, onClose }) {
  const [toastMsg, setToastMsg] = useState(null)
  if (!nameRow) return null

  const name = nameRow.baseName
  const len = name.length

  // Calculate heuristic brandability metrics
  const lenScore = len >= 4 && len <= 8 ? 100 : len < 4 ? 80 : Math.max(50, 100 - (len - 8) * 8)
  const isVowelVowel = /[aeiou]{2}/.test(name)
  const pronScore = isVowelVowel ? 88 : 94
  const memoScore = Math.min(98, Math.max(70, lenScore + (isVowelVowel ? 5 : -5)))
  const brandabilityOverall = Math.round((lenScore * 0.4) + (pronScore * 0.3) + (memoScore * 0.3))

  const usptoLink = `https://tmsearch.uspto.gov/bin/showfield?f=toc&state=4809:1.1.1&p_search=searchss&p_L=50&BackLink=https%3A%2F%2Ftmsearch.uspto.gov&p_plural=yes&p_s_ALL=${encodeURIComponent(name)}`
  const wipoLink = `https://branddb.wipo.int/en/similarname?SEARCH_STRING=${encodeURIComponent(name)}`
  const googleSearchLink = `https://www.google.com/search?q=${encodeURIComponent('"' + name + '" brand business')}`

  const handleShare = () => {
    const text = `Brand Analysis Report for "${name}":\nBrandability: ${brandabilityOverall}/100\nLength: ${len} letters (${lenScore}/100)\nChecked via Brand Funnel (https://brandfunnel.mopgen.in/#check/${name})`
    navigator.clipboard.writeText(text).then(() => {
      setToastMsg('Report summary copied to clipboard!')
      setTimeout(() => setToastMsg(null), 3000)
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="report-modal-card" onClick={e => e.stopPropagation()}>
        {toastMsg && <div className="toast-modal-banner">{toastMsg}</div>}

        <div className="report-modal-header">
          <div className="report-title-row">
            <h2 className="report-brand-name">{name}</h2>
            <span className={`report-status-badge ${nameRow.isAlive ? 'alive' : 'eliminated'}`}>
              {nameRow.isAlive ? (
                <>
                  <SparklesIcon size={12} />
                  <span>ALL CLEAR SURVIVOR</span>
                </>
              ) : (
                <>
                  <CrossIcon size={10} />
                  <span>ELIMINATED ({nameRow.eliminatedAt ? (nameRow.eliminatedAt === 'domain' ? 'Domains' : nameRow.eliminatedAt) : 'Taken'})</span>
                </>
              )}
            </span>
          </div>
          <p className="report-sub">Comprehensive Brand Identity &amp; Signal Analysis Report</p>
        </div>

        <div className="report-modal-body">
          {/* Brandability Scores */}
          <div className="report-section">
            <div className="report-section-title">Brandability &amp; Structure Metrics</div>
            <div className="score-bars-grid">
              <div className="score-item">
                <div className="score-label-row">
                  <span>Overall Brandability</span>
                  <strong>{brandabilityOverall} / 100</strong>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${brandabilityOverall}%`, background: 'var(--accent)' }} />
                </div>
              </div>

              <div className="score-item">
                <div className="score-label-row">
                  <span>Memorability Score</span>
                  <strong>{memoScore} / 100</strong>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${memoScore}%`, background: '#06B6D4' }} />
                </div>
              </div>

              <div className="score-item">
                <div className="score-label-row">
                  <span>Pronunciation Clarity</span>
                  <strong>{pronScore} / 100</strong>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${pronScore}%`, background: '#10B981' }} />
                </div>
              </div>

              <div className="score-item">
                <div className="score-label-row">
                  <span>Optimal Length ({len} letters)</span>
                  <strong>{lenScore} / 100</strong>
                </div>
                <div className="score-bar-bg">
                  <div className="score-bar-fill" style={{ width: `${lenScore}%`, background: '#F59E0B' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Domain Availability Signals */}
          <div className="report-section">
            <div className="report-section-title">Domain Registry Signals</div>
            <div className="report-tld-list">
              {tlds.map(tld => {
                const res = nameRow.domainCols?.[tld]
                const avail = res?.ok && res?.available
                return (
                  <div key={tld} className={`tld-report-chip ${avail ? 'free' : 'taken'}`}>
                    <GlobeIcon size={12} />
                    <span className="tld-ext">{tld}</span>
                    <span className="tld-status-text">{avail ? 'Available' : 'Registered'}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Social Handle Signals */}
          <div className="report-section">
            <div className="report-section-title">Social Handle Signals</div>
            <div className="report-tld-list">
              {activeSocials.map(p => {
                const res = nameRow.social?.[p.platform]
                const st = res?.status
                const isFree = st === 'free'
                return (
                  <div key={p.platform} className={`tld-report-chip ${isFree ? 'free' : st === 'taken' ? 'taken' : 'unknown'}`}>
                    <span className="tld-ext">@{name} on {p.label}</span>
                    <span className="tld-status-text">{isFree ? 'Free' : st === 'taken' ? 'Taken' : 'Unconfirmed'}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* External Research Direct Links */}
          <div className="report-section">
            <div className="report-section-title">External Trademark &amp; Identity Research</div>
            <div className="research-links-row">
              <a href={usptoLink} target="_blank" rel="noreferrer" className="btn-research-link">
                <span>USPTO Trademark Search</span>
                <ExternalLinkIcon size={11} />
              </a>
              <a href={wipoLink} target="_blank" rel="noreferrer" className="btn-research-link">
                <span>WIPO Global Brand DB</span>
                <ExternalLinkIcon size={11} />
              </a>
              <a href={googleSearchLink} target="_blank" rel="noreferrer" className="btn-research-link">
                <span>Google Similarity Search</span>
                <ExternalLinkIcon size={11} />
              </a>
            </div>
          </div>
        </div>

        <div className="report-modal-footer">
          <button className="btn-modal-share" onClick={handleShare}>
            <CopyIcon size={13} />
            <span>Share Brand Report</span>
          </button>
          <button className="btn-modal-close" onClick={onClose}>
            Close Report
          </button>
        </div>
      </div>
    </div>
  )
}
