import {
  KeyIcon,
  ZapIcon,
  ShieldIcon,
  GlobeIcon,
  SparklesIcon,
  ArrowRightIcon,
  CheckIcon,
  AlertCircleIcon,
  SettingsIcon,
  ExternalLinkIcon,
} from './Icons.jsx'

export default function GuidePage({ onLaunchTool, onOpenSettings }) {
  return (
    <div className="doc-page-container">
      <div className="doc-header">
        <div className="doc-badge">
          <SparklesIcon size={12} style={{ display: 'inline', marginRight: 4 }} />
          TECHNICAL ARCHITECTURE &amp; SETUP
        </div>
        <h1 className="doc-title">GoDaddy API &amp; Social Engine Guide</h1>
        <p className="doc-subtitle">
          Everything you need to know about setting up your API key, rate limits, supported TLDs, and sequential funnel cascade logic.
        </p>
      </div>

      <div className="doc-grid">
        {/* ── STEP BY STEP GODADDY PAT SETUP ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <KeyIcon size={18} className="doc-card-icon" style={{ color: 'var(--accent)' }} />
            <h2 className="doc-card-title">1. Getting Your GoDaddy PAT (Personal Access Token)</h2>
          </div>
          <div className="doc-card-body">
            <p>
              Brand Funnel connects directly to the official <strong>GoDaddy v3 Discovery REST API</strong> to perform bulk domain checks with live registry pricing.
            </p>

            <ol className="doc-steps-list">
              <li>
                <strong>Log into Developer Portal:</strong> Visit{' '}
                <a href="https://developer.godaddy.com/keys" target="_blank" rel="noopener noreferrer" className="doc-link">
                  developer.godaddy.com/keys <ExternalLinkIcon size={11} style={{ display: 'inline' }} />
                </a>
              </li>
              <li>
                <strong>Create Key:</strong> Click the <strong>&quot;Create New Key&quot;</strong> or <strong>&quot;Personal Access Tokens&quot;</strong> button.
              </li>
              <li>
                <strong>Select Scopes:</strong> Choose the <code>domains.domain:read</code> scope (read-only search permission, no credit card or billing risk).
              </li>
              <li>
                <strong>Copy Token:</strong> Copy your token string (e.g. <code>gd_pat_...</code>).
              </li>
              <li>
                <strong>Save in App:</strong> Click{' '}
                <button className="doc-inline-btn" onClick={onOpenSettings}>
                  <SettingsIcon size={12} style={{ display: 'inline', marginRight: 3 }} />
                  Settings
                </button>{' '}
                and paste your token into the field.
              </li>
            </ol>

            <div className="doc-callout info">
              <ShieldIcon size={16} className="doc-callout-icon" />
              <div>
                <strong>Zero Storage Guarantee:</strong> Your key is stored exclusively in your local browser storage (<code>localStorage</code>) and is sent with Bearer Authorization only for GoDaddy availability checks.
              </div>
            </div>
          </div>
        </section>

        {/* ── SEQUENTIAL FUNNEL ALGORITHM EXPLAINED ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <ZapIcon size={18} className="doc-card-icon" style={{ color: 'var(--avail)' }} />
            <h2 className="doc-card-title">2. How the Sequential Funnel Works</h2>
          </div>
          <div className="doc-card-body">
            <p>
              Traditional tools query all platforms simultaneously, wasting API quota on names whose domains are already taken.
              Brand Funnel implements a <strong>survivor-first cascade</strong>:
            </p>

            <div className="pipeline-flow-diagram">
              <div className="flow-node">
                <strong>Input List (N names)</strong>
                <span>All candidate brand keywords</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <strong>Stage 1: GoDaddy Domains</strong>
                <span>Checks all selected TLDs</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <strong>Stage 2: Instagram</strong>
                <span>Only checks names with ≥1 free domain</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <strong>Stage 3: YouTube</strong>
                <span>Only checks free Instagram survivors</span>
              </div>
              <div className="flow-arrow">→</div>
              <div className="flow-node">
                <strong>Stages 4–5: X &amp; Facebook</strong>
                <span>Final survivor confirmation</span>
              </div>
            </div>

            <div className="doc-callout warn">
              <AlertCircleIcon size={16} className="doc-callout-icon" />
              <div>
                <strong>Early Stop Rule:</strong> If at any stage 0 names survive (e.g. all names are taken on Instagram), the engine immediately stops and displays the results gathered up to that stage, marking where each name was eliminated.
              </div>
            </div>
          </div>
        </section>

        {/* ── RATE LIMITS & BEST PRACTICES ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <GlobeIcon size={18} className="doc-card-icon" style={{ color: '#06B6D4' }} />
            <h2 className="doc-card-title">3. Rate Limits &amp; Auto-Fallback Resilience</h2>
          </div>
          <div className="doc-card-body">
            <p>
              GoDaddy enforces rate limits per token on discovery endpoints.
            </p>
            <ul className="doc-list">
              <li>
                <strong>Authoritative DoH Fallback:</strong> If your token hits HTTP 429 (Rate Limited), the engine automatically falls back to Google and Cloudflare DNS-over-HTTPS (DoH) so you are never blocked.
              </li>
              <li>
                <strong>Social Throttling:</strong> Social requests are interleaved with safe delays to prevent network rate limits.
              </li>
              <li>
                <strong>Recommended Batch Size:</strong> 10 to 50 names per run yields the fastest response times.
              </li>
            </ul>
          </div>
        </section>

        {/* ── SUPPORTED TLDS ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <GlobeIcon size={18} className="doc-card-icon" style={{ color: 'var(--accent-2)' }} />
            <h2 className="doc-card-title">4. Supported Extensions &amp; Handles</h2>
          </div>
          <div className="doc-card-body">
            <div className="tld-pill-list">
              <span className="tld-tag">.com</span>
              <span className="tld-tag">.net</span>
              <span className="tld-tag">.in</span>
              <span className="tld-tag">.io</span>
              <span className="tld-tag">.co</span>
              <span className="tld-tag">.app</span>
              <span className="tld-tag">.dev</span>
              <span className="tld-tag">.ai</span>
              <span className="tld-tag">.org</span>
              <span className="tld-tag">.info</span>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--text-2)' }}>
              Handles on social networks follow standard alphanumeric formatting rules (letters, numbers, underscores, dots where allowed).
            </p>
          </div>
        </section>
      </div>

      <div className="doc-footer-cta">
        <button className="btn-hero-primary" onClick={onLaunchTool}>
          <span>Open Brand Funnel Tool</span>
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}
