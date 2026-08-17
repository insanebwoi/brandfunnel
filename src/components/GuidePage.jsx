import {
  GlobeIcon,
  ZapIcon,
  ShieldIcon,
  SparklesIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  CpuIcon,
} from './Icons.jsx'

export default function GuidePage({ onLaunchTool }) {
  return (
    <div className="doc-page-container">
      <div className="doc-header">
        <div className="doc-badge">
          <SparklesIcon size={12} style={{ display: 'inline', marginRight: 4 }} />
          TECHNICAL ARCHITECTURE &amp; GUIDE
        </div>
        <h1 className="doc-title">DNS Engine &amp; Social Cascade Guide</h1>
        <p className="doc-subtitle">
          Everything you need to know about authoritative live DNS verification, supported TLDs, and sequential funnel cascade logic.
        </p>
      </div>

      <div className="doc-grid">
        {/* ── AUTHORITATIVE DNS & RDAP ARCHITECTURE ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <GlobeIcon size={18} className="doc-card-icon" style={{ color: 'var(--accent)' }} />
            <h2 className="doc-card-title">1. Authoritative DNS &amp; RDAP Architecture</h2>
          </div>
          <div className="doc-card-body">
            <p>
              Brand Funnel resolves domain availability in real-time using high-availability <strong>DNS-over-HTTPS (DoH)</strong> endpoints from Google DNS and Cloudflare DNS, backed by ICANN RDAP protocols.
            </p>

            <ul className="doc-list">
              <li>
                <strong>Zero Configuration Needed:</strong> No API keys, personal access tokens (PAT), or registrar credentials are required.
              </li>
              <li>
                <strong>High Reliability:</strong> Primary checks verify authoritative Name Server (NS) records. Status 3 (NXDOMAIN) indicates a free domain, while Status 0 indicates registered ownership.
              </li>
              <li>
                <strong>ICANN RDAP Fallback:</strong> Secondary validation against official registry RDAP servers ensures definitive registration status.
              </li>
            </ul>

            <div className="doc-callout info">
              <ShieldIcon size={16} className="doc-callout-icon" />
              <div>
                <strong>Zero-Storage Guarantee:</strong> All DNS and social queries originate directly from your browser with zero remote database logging.
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
                <strong>Stage 1: DNS Domains</strong>
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

        {/* ── PERFORMANCE & BEST PRACTICES ── */}
        <section className="doc-card">
          <div className="doc-card-header">
            <CpuIcon size={18} className="doc-card-icon" style={{ color: '#06B6D4' }} />
            <h2 className="doc-card-title">3. High Performance &amp; Social Throttling</h2>
          </div>
          <div className="doc-card-body">
            <p>
              The DNS engine handles bulk concurrency seamlessly while respecting downstream network limits.
            </p>
            <ul className="doc-list">
              <li>
                <strong>Parallel DoH Batches:</strong> Domain checks process in concurrent micro-batches for sub-second verification.
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
