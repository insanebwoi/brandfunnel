import {
  ShieldIcon,
  GlobeIcon,
  ArrowRightIcon,
  CheckIcon,
} from './Icons.jsx'

export default function PrivacyPage({ onLaunchTool }) {
  return (
    <div className="doc-page-container">
      <div className="doc-header">
        <div className="doc-badge">
          <ShieldIcon size={12} style={{ display: 'inline', marginRight: 4 }} />
          SECURITY &amp; PRIVACY
        </div>
        <h1 className="doc-title">Client-Side Zero-Storage Architecture</h1>
        <p className="doc-subtitle">
          How your search keywords, candidate names, and brand ideas are protected.
        </p>
      </div>

      <div className="doc-grid">
        <section className="doc-card">
          <div className="doc-card-header">
            <ShieldIcon size={18} className="doc-card-icon" style={{ color: 'var(--avail)' }} />
            <h2 className="doc-card-title">Zero Server-Side Storage</h2>
          </div>
          <div className="doc-card-body">
            <p>
              Unlike traditional SaaS naming platforms that log your unreleased brand names and search histories, Brand Funnel executes the entire orchestration logic directly in your browser.
            </p>
            <ul className="doc-list">
              <li>
                <strong>No Central Database:</strong> We operate no user database, no analytics trackers, and no idea logging.
              </li>
              <li>
                <strong>Local Storage Only:</strong> Only your UI appearance theme preference lives in your browser&apos;s <code>localStorage</code>.
              </li>
              <li>
                <strong>Zero Credentials Required:</strong> No API keys or tokens are stored, transmitted, or required to perform full domain and social availability checks.
              </li>
            </ul>
          </div>
        </section>

        <section className="doc-card">
          <div className="doc-card-header">
            <GlobeIcon size={18} className="doc-card-icon" style={{ color: 'var(--accent)' }} />
            <h2 className="doc-card-title">Direct Public Protocol Inspection</h2>
          </div>
          <div className="doc-card-body">
            <p>
              All queries are dispatched over secure encrypted connections (HTTPS) to public DNS-over-HTTPS &amp; ICANN RDAP endpoints:
            </p>
            <ul className="doc-list">
              <li>
                <strong>Google &amp; Cloudflare DoH:</strong> Queries standard public DNS records using official Google &amp; Cloudflare DoH APIs.
              </li>
              <li>
                <strong>ICANN RDAP:</strong> Validates domain registration states via standard open registry RDAP services.
              </li>
              <li>
                <strong>No Intermediary SaaS:</strong> Candidate names never pass through third-party branding servers or domain squatting databases.
              </li>
            </ul>
          </div>
        </section>
      </div>

      <div className="doc-footer-cta">
        <button className="btn-hero-primary" onClick={onLaunchTool}>
          <span>Return to Brand Funnel</span>
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}
