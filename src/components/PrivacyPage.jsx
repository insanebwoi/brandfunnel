import {
  ShieldIcon,
  KeyIcon,
  GlobeIcon,
  SparklesIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
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
          How your GoDaddy API credentials, search keywords, and brand ideas are protected.
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
              Unlike traditional SaaS naming platforms that log your unreleased brand names and search histories, Brand Funnel executes the entire orchestration logic in your client browser.
            </p>
            <ul className="doc-list">
              <li>
                <strong>No Central Database:</strong> We run no user database, no analytics trackers, and no idea logging.
              </li>
              <li>
                <strong>Local Storage Only:</strong> Your GoDaddy Personal Access Token (PAT) and configuration preferences live in your local browser&apos;s <code>localStorage</code>.
              </li>
              <li>
                <strong>Direct API Dispatch:</strong> Requests are forwarded directly to GoDaddy&apos;s API gateway via local reverse proxy with standard HTTPS encryption.
              </li>
            </ul>
          </div>
        </section>

        <section className="doc-card">
          <div className="doc-card-header">
            <KeyIcon size={18} className="doc-card-icon" style={{ color: 'var(--accent)' }} />
            <h2 className="doc-card-title">Token Permissions &amp; Best Practices</h2>
          </div>
          <div className="doc-card-body">
            <p>
              For maximum security, we recommend following the principle of least privilege:
            </p>
            <ul className="doc-list">
              <li>
                Use read-only scope <code>domains.domain:read</code> for your PAT.
              </li>
              <li>
                Never use a key that has purchase, DNS modification, or account administration permissions.
              </li>
              <li>
                You can revoke or regenerate your PAT anytime at{' '}
                <a href="https://developer.godaddy.com/keys" target="_blank" rel="noopener noreferrer" className="doc-link">
                  developer.godaddy.com/keys <ExternalLinkIcon size={11} style={{ display: 'inline' }} />
                </a>.
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
