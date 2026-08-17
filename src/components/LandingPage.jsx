import { useState } from 'react'
import {
  SearchIcon,
  ZapIcon,
  GlobeIcon,
  ShieldIcon,
  KeyIcon,
  CheckIcon,
  CrossIcon,
  SparklesIcon,
  ArrowRightIcon,
  DownloadIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  LayersIcon,
  CpuIcon,
  TerminalIcon,
  ChevronDownIcon,
  ExternalLinkIcon,
  ActivityIcon,
} from './Icons.jsx'
import {
  ScrollProgressBar,
  InteractiveSpotlight,
  RevealOnScroll,
  TiltCard,
  BorderBeam,
} from './ModernEffects.jsx'
import { ArchitectureOrbit } from './ArchitectureOrbit.jsx'

export default function LandingPage({ onLaunchTool, onOpenGuide }) {
  const [openFaq, setOpenFaq] = useState(0)

  // Interactive Live Simulator State
  const [simName, setSimName] = useState('novara')
  const [simRunning, setSimRunning] = useState(false)
  const [simStage, setSimStage] = useState(4)
  const [terminalLog, setTerminalLog] = useState([
    '[INIT] Cascade pipeline listening on port 3092...',
    '[STAGE 1] Registry check: novara.com -> AVAILABLE ($11.99/yr)',
    '[STAGE 2] Instagram web profile check: @novara -> FREE (HTTP 404)',
    '[STAGE 3] YouTube channel check: /@novara -> FREE (HTTP 404)',
    '[STAGE 4] Identity confirmed -> ALL CLEAR (Survivor Ready)',
  ])

  const runSimulation = () => {
    if (simRunning) return
    setSimRunning(true)
    setSimStage(1)
    setTerminalLog([`[INIT] Starting cascade for: "${simName || 'brand'}"`])

    setTimeout(() => {
      setSimStage(1)
      setTerminalLog(prev => [...prev, `[STAGE 1] Querying GoDaddy Registry for ${simName || 'brand'}.com -> FREE`])
    }, 400)

    setTimeout(() => {
      setSimStage(2)
      setTerminalLog(prev => [...prev, `[STAGE 2] Querying Instagram web_profile_info for @${simName || 'brand'} -> FREE (404)`])
    }, 900)

    setTimeout(() => {
      setSimStage(3)
      setTerminalLog(prev => [...prev, `[STAGE 3] Querying YouTube @${simName || 'brand'} -> FREE (404)`])
    }, 1400)

    setTimeout(() => {
      setSimStage(4)
      setTerminalLog(prev => [...prev, `[STAGE 4] Twitter/X & Facebook verified -> ALL CLEAR (100% Identity Match)`])
      setSimRunning(false)
    }, 1900)
  }

  const faqs = [
    {
      q: 'How does the sequential cascade protect API quotas?',
      a: 'Traditional multi-checker tools make parallel requests across all platforms at once. If a domain is already registered, querying social media platforms for that name is a wasted call. Brand Funnel only advances surviving names with at least one free domain, saving over 75% of outbound requests.',
    },
    {
      q: 'Do I need a paid GoDaddy account to use this tool?',
      a: 'No. You can generate a free Personal Access Token (PAT) from developer.godaddy.com with the read-only scope. If your token reaches its rate limit or if you choose not to provide one, the engine automatically switches to Authoritative DNS-over-HTTPS (DoH) and ICANN RDAP verification with zero configuration.',
    },
    {
      q: 'Where are my API tokens and searched brand names stored?',
      a: 'All processing occurs directly in your browser. Tokens and configuration preferences are saved only in your local browser localStorage. We operate zero central databases, no tracking cookies, and no logging of your intellectual property.',
    },
    {
      q: 'Which social media platforms are verified?',
      a: 'The engine performs live protocol verification on Instagram (via web profile endpoint), YouTube (authoritative channel handle status), Twitter/X (profile existence detection), and Facebook.',
    },
    {
      q: 'Can I export shortlists for stakeholder presentations?',
      a: 'Yes. The results grid features a one-click CSV export that formats domain statuses, registration pricing, and social handle verification states into structured tabular files.',
    },
  ]

  const comparisons = [
    {
      dimension: 'Verification Flow',
      oldText: 'Uncoordinated checks across 5 tabs',
      newText: '1-Click automated 5-stage cascade',
    },
    {
      dimension: 'Quota Efficiency',
      oldText: 'Wastes calls querying socials for taken domains',
      newText: 'Early-stop pruning discards taken names first',
    },
    {
      dimension: 'Rate-Limit Resilience',
      oldText: 'Blocks with HTTP 429 when quota is exhausted',
      newText: 'Seamless auto-fallback to Authoritative DoH/RDAP',
    },
    {
      dimension: 'Data Privacy',
      oldText: 'Central SaaS servers log your keywords',
      newText: '100% Client-side execution in localStorage',
    },
    {
      dimension: 'Shortlist Export',
      oldText: 'Manual copy-paste into spreadsheets',
      newText: 'Instant structured CSV with live registry prices',
    },
  ]

  return (
    <div className="landing-container">
      {/* ── LASER SCROLL PROGRESS BAR ── */}
      <ScrollProgressBar />

      {/* ── INTERACTIVE MOUSE LIGHT CONE ── */}
      <InteractiveSpotlight />

      {/* ── CYBERNETIC MESH GRID BACKGROUND ── */}
      <div className="cyber-grid-backdrop" />

      {/* ── AMBIENT GLOW ORBS ── */}
      <div className="bg-glow-orb orb-1" />
      <div className="bg-glow-orb orb-2" />
      <div className="bg-glow-orb orb-3" />

      {/* ── PURE MINIMALISTIC CENTERED HERO SECTION ── */}
      <section className="hero-section">
        <RevealOnScroll delay={50}>
          <div className="hero-badge">
            <span className="hero-badge-pulse" />
            <SparklesIcon size={13} className="hero-badge-icon" />
            <span>2026 PRECISION BRAND INTELLIGENCE</span>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          <h1 className="hero-title">
            Verify Domains &amp; Social Handles <br className="hero-br" />
            <span className="text-gradient">In One Cascading Pipeline</span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <p className="hero-desc">
            Eliminate manual friction. Brand Funnel filters candidate names through an automated sequential funnel:
            verifying domain registry availability first, then cascading surviving names across
            Instagram, YouTube, Twitter/X, and Facebook in real-time.
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={200}>
          <div className="hero-actions">
            <button className="btn-hero-primary" onClick={onLaunchTool}>
              <span>Launch Brand Funnel</span>
              <ArrowRightIcon size={16} />
            </button>
            <button className="btn-hero-secondary" onClick={onOpenGuide}>
              <span>View Architecture Guide</span>
            </button>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── INTERACTIVE LIVE SIMULATOR & METRICS SECTION ── */}
      <section className="simulator-section">
        {/* Metrics Strip */}
        <RevealOnScroll delay={50}>
          <div className="hero-metrics-strip">
            <div className="metric-item">
              <div className="metric-val">&lt; 150ms</div>
              <div className="metric-lbl">DoH Resolution</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-val">5-Stage</div>
              <div className="metric-lbl">Cascade Funnel</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-val">100%</div>
              <div className="metric-lbl">Client Privacy</div>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <div className="metric-val">0 Quota</div>
              <div className="metric-lbl">DoH Fallback</div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Live Simulator Preview */}
        <RevealOnScroll delay={100} className="w-full max-w-preview">
          <TiltCard className="pipeline-preview-card" maxTilt={5}>
            <BorderBeam size={220} duration={10} />

            <div className="preview-header">
              <div className="preview-dots">
                <span className="dot dot-red" />
                <span className="dot dot-yellow" />
                <span className="dot dot-green" />
              </div>
              <div className="preview-title">
                <TerminalIcon size={13} style={{ display: 'inline', marginRight: 6 }} />
                Interactive Cascade Engine Simulation
              </div>
              <div className="preview-tag">
                <ActivityIcon size={11} style={{ display: 'inline', marginRight: 4 }} />
                Live Terminal
              </div>
            </div>

            <div className="simulator-input-bar">
              <div className="sim-input-wrap">
                <span className="sim-prompt">$ check-brand</span>
                <input
                  type="text"
                  className="sim-input"
                  value={simName}
                  onChange={(e) => setSimName(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))}
                  placeholder="enter a brand name..."
                  maxLength={20}
                  inputMode="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                />
              </div>
              <button
                className="btn-sim-run"
                onClick={runSimulation}
                disabled={simRunning || !simName}
              >
                {simRunning ? <span className="spinner-mini" /> : <ZapIcon size={13} />}
                <span>{simRunning ? 'Cascading...' : 'Test Funnel'}</span>
              </button>
            </div>

            <div className="funnel-steps-visual">
              <div className={`funnel-step-box ${simStage >= 1 ? 'active' : 'pending'}`}>
                <div className="funnel-step-left">
                  <div className="funnel-step-num">01</div>
                  <div className="funnel-step-info">
                    <div className="funnel-step-name">
                      <GlobeIcon size={14} style={{ color: 'var(--avail)' }} />
                      <span>Domain Registry (.com / .io / .in)</span>
                    </div>
                    <div className="funnel-step-sub">GoDaddy v3 / DoH Registry Lookup</div>
                  </div>
                </div>
                <div className="funnel-step-status pass">
                  <CheckIcon size={12} />
                  <span>Available</span>
                </div>
              </div>

              <div className="funnel-arrow-line">
                <div className={`line-dot ${simStage >= 2 ? 'active' : ''}`} />
              </div>

              <div className={`funnel-step-box ${simStage >= 2 ? 'active' : 'pending'}`}>
                <div className="funnel-step-left">
                  <div className="funnel-step-num">02</div>
                  <div className="funnel-step-info">
                    <div className="funnel-step-name">
                      <InstagramIcon size={14} style={{ color: '#E1306C' }} />
                      <span>Instagram Handle (@{simName || 'brand'})</span>
                    </div>
                    <div className="funnel-step-sub">Web Profile Info Verification</div>
                  </div>
                </div>
                <div className={`funnel-step-status ${simStage >= 2 ? 'pass' : 'pending'}`}>
                  {simStage >= 2 ? <CheckIcon size={12} /> : null}
                  <span>{simStage >= 2 ? 'Free Handle' : 'Queued'}</span>
                </div>
              </div>

              <div className="funnel-arrow-line">
                <div className={`line-dot ${simStage >= 3 ? 'active' : ''}`} />
              </div>

              <div className={`funnel-step-box ${simStage >= 3 ? 'active' : 'pending'}`}>
                <div className="funnel-step-left">
                  <div className="funnel-step-num">03</div>
                  <div className="funnel-step-info">
                    <div className="funnel-step-name">
                      <YouTubeIcon size={14} style={{ color: '#FF0000' }} />
                      <span>YouTube Channel (/@{simName || 'brand'})</span>
                    </div>
                    <div className="funnel-step-sub">Authoritative Channel Handle Lookup</div>
                  </div>
                </div>
                <div className={`funnel-step-status ${simStage >= 3 ? 'pass' : 'pending'}`}>
                  {simStage >= 3 ? <CheckIcon size={12} /> : null}
                  <span>{simStage >= 3 ? 'Free Channel' : 'Queued'}</span>
                </div>
              </div>

              <div className="funnel-arrow-line">
                <div className={`line-dot ${simStage >= 4 ? 'active' : ''}`} />
              </div>

              <div className={`funnel-step-box survivor-winner ${simStage >= 4 ? 'active' : 'pending'}`}>
                <div className="funnel-step-left">
                  <div className="funnel-step-num">04</div>
                  <div className="funnel-step-info">
                    <div className="funnel-step-name">
                      <TwitterIcon size={14} style={{ color: '#1DA1F2' }} />
                      <span>Twitter / X &amp; Facebook</span>
                    </div>
                    <div className="funnel-step-sub">Verified Identity Confirmation</div>
                  </div>
                </div>
                <div className={`funnel-step-status ${simStage >= 4 ? 'winner' : 'pending'}`}>
                  {simStage >= 4 ? <SparklesIcon size={12} /> : null}
                  <span>{simStage >= 4 ? 'All Clear' : 'Queued'}</span>
                </div>
              </div>
            </div>

            {/* Live Terminal Output Feed (Desktop only to keep mobile minimal) */}
            <div className="simulator-log-feed desktop-log-only">
              <div className="log-feed-header">
                <span className="log-feed-dot" />
                <span>Console Stream</span>
              </div>
              <div className="log-lines">
                {terminalLog.map((line, idx) => (
                  <div key={idx} className="log-line">{line}</div>
                ))}
              </div>
            </div>
          </TiltCard>
        </RevealOnScroll>
      </section>

      {/* ── 3D HOLOGRAPHIC ARCHITECTURE VISUALIZER ── */}
      <section className="orbit-section">
        <RevealOnScroll>
          <div className="section-header-center">
            <div className="section-kicker">CROSS-PROTOCOL ARCHITECTURE</div>
            <h2 className="section-title">Holographic Platform Ecosystem</h2>
            <p className="section-subtitle">
              Integrated mesh querying domain registries, DNS resolvers, and social networks with zero server intermediary.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={150}>
          <ArchitectureOrbit />
        </RevealOnScroll>
      </section>

      {/* ── CORE BENTO GRID FEATURES ── */}
      <section className="features-section">
        <RevealOnScroll>
          <div className="section-header-center">
            <div className="section-kicker">ENGINEERED FOR MODERN FOUNDERS</div>
            <h2 className="section-title">High-Velocity Brand Shortlisting</h2>
            <p className="section-subtitle">
              Eliminate friction between brainstorming keywords and locking down matching domain and social identities.
            </p>
          </div>
        </RevealOnScroll>

        <div className="bento-grid">
          {/* Large Card 1 */}
          <RevealOnScroll delay={50} className="bento-span-2">
            <TiltCard className="bento-card h-full">
              <BorderBeam size={180} duration={14} />
              <div className="bento-icon-wrap" style={{ color: 'var(--avail)', background: 'var(--avail-bg)', borderColor: 'var(--avail-border)' }}>
                <ZapIcon size={20} />
              </div>
              <h3 className="bento-card-title">Early-Stop Cascading Architecture</h3>
              <p className="bento-card-desc">
                If a candidate name fails registry availability at Stage 1, it is immediately pruned from the pipeline. Downstream social APIs are only queried for verified available survivors, preventing rate limits and saving processing time.
              </p>
              <div className="bento-badge-row">
                <span className="bento-pill">Zero Wasted API Calls</span>
                <span className="bento-pill">Instant Pruning</span>
                <span className="bento-pill">Live Funnel Stepper</span>
              </div>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 2 */}
          <RevealOnScroll delay={100}>
            <TiltCard className="bento-card h-full">
              <div className="bento-icon-wrap" style={{ color: 'var(--accent-2)', background: 'var(--accent-bg)', borderColor: 'var(--accent-border)' }}>
                <KeyIcon size={20} />
              </div>
              <h3 className="bento-card-title">Official GoDaddy v3 API</h3>
              <p className="bento-card-desc">
                Direct connection to GoDaddy&apos;s discovery endpoints for real-time registry check, definitive availability confirmation, and annual registration pricing.
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 3 */}
          <RevealOnScroll delay={150}>
            <TiltCard className="bento-card h-full">
              <div className="bento-icon-wrap" style={{ color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)', borderColor: 'rgba(6, 182, 212, 0.25)' }}>
                <CpuIcon size={20} />
              </div>
              <h3 className="bento-card-title">Authoritative DoH Fallback</h3>
              <p className="bento-card-desc">
                If your GoDaddy token experiences rate limits (HTTP 429) or is omitted, the engine automatically resolves availability using Google &amp; Cloudflare DNS-over-HTTPS.
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* Large Card 4 */}
          <RevealOnScroll delay={200} className="bento-span-2">
            <TiltCard className="bento-card h-full">
              <div className="bento-icon-wrap" style={{ color: '#E1306C', background: 'rgba(225, 48, 108, 0.1)', borderColor: 'rgba(225, 48, 108, 0.25)' }}>
                <LayersIcon size={20} />
              </div>
              <h3 className="bento-card-title">Multi-Platform Identity Synchronization</h3>
              <p className="bento-card-desc">
                Simultaneously validates availability across Instagram, YouTube channel handles, Twitter/X usernames, and Facebook pages. Verified taken profiles render direct inspection links.
              </p>
              <div className="social-pill-preview">
                <span className="sp-item"><InstagramIcon size={13} /> Instagram</span>
                <span className="sp-item"><YouTubeIcon size={13} /> YouTube</span>
                <span className="sp-item"><TwitterIcon size={13} /> Twitter / X</span>
                <span className="sp-item"><FacebookIcon size={13} /> Facebook</span>
              </div>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 5 */}
          <RevealOnScroll delay={250}>
            <TiltCard className="bento-card h-full">
              <div className="bento-icon-wrap" style={{ color: '#F97316', background: 'rgba(249, 115, 22, 0.1)', borderColor: 'rgba(249, 115, 22, 0.25)' }}>
                <ShieldIcon size={20} />
              </div>
              <h3 className="bento-card-title">Client-Side Zero Storage</h3>
              <p className="bento-card-desc">
                Your API tokens and searched brand names remain 100% in your local browser. No telemetry, no remote database tracking, no idea leakage.
              </p>
            </TiltCard>
          </RevealOnScroll>

          {/* Card 6 */}
          <RevealOnScroll delay={300}>
            <TiltCard className="bento-card h-full">
              <div className="bento-icon-wrap" style={{ color: 'var(--avail)', background: 'var(--avail-bg)', borderColor: 'var(--avail-border)' }}>
                <DownloadIcon size={20} />
              </div>
              <h3 className="bento-card-title">Batch &amp; 1-Click CSV Export</h3>
              <p className="bento-card-desc">
                Paste comma-separated or line-by-line batches. Download structured CSV records with pricing and stage status ready for team decision making.
              </p>
            </TiltCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── COMPARISON SECTION: TRADITIONAL VS BRAND FUNNEL ── */}
      <section className="comparison-section">
        <RevealOnScroll>
          <div className="section-header-center">
            <div className="section-kicker">EFFICIENCY BENCHMARK</div>
            <h2 className="section-title">Why Sequential Verification Wins</h2>
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={100}>
          {/* Desktop Table View */}
          <div className="comparison-table-wrap desktop-table-only">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Workflow Dimension</th>
                  <th className="th-old">Traditional Manual Checking</th>
                  <th className="th-new">Brand Funnel Cascade</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, idx) => (
                  <tr key={idx}>
                    <td className="comp-label">{item.dimension}</td>
                    <td className="comp-old"><CrossIcon size={14} className="icon-red" /> {item.oldText}</td>
                    <td className="comp-new"><CheckIcon size={14} className="icon-green" /> {item.newText}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card-By-Card View */}
          <div className="mobile-comparison-cards">
            {comparisons.map((item, idx) => (
              <div key={idx} className="mobile-comp-card">
                <div className="mobile-comp-header">{item.dimension}</div>
                <div className="mobile-comp-row bad">
                  <div className="mobile-comp-tag">Traditional</div>
                  <div className="mobile-comp-text"><CrossIcon size={12} className="icon-red" /> {item.oldText}</div>
                </div>
                <div className="mobile-comp-row good">
                  <div className="mobile-comp-tag">Brand Funnel</div>
                  <div className="mobile-comp-text"><CheckIcon size={12} className="icon-green" /> {item.newText}</div>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>
      </section>

      {/* ── 3-STEP WORKFLOW ── */}
      <section className="how-it-works-section">
        <RevealOnScroll>
          <div className="section-header-center">
            <div className="section-kicker">SIMPLE 3-STEP WORKFLOW</div>
            <h2 className="section-title">From Concept to Registered Assets</h2>
          </div>
        </RevealOnScroll>

        <div className="steps-row">
          <RevealOnScroll delay={50}>
            <TiltCard className="step-card h-full">
              <div className="step-badge-num">01</div>
              <h4 className="step-title">Input Candidate Names</h4>
              <p className="step-text">
                Paste bare brand names or full domains. Select your target extensions from .com, .io, .in, .net, .co, .app, and more.
              </p>
            </TiltCard>
          </RevealOnScroll>

          <RevealOnScroll delay={150}>
            <TiltCard className="step-card h-full">
              <div className="step-badge-num">02</div>
              <h4 className="step-title">Execute Funnel Pipeline</h4>
              <p className="step-text">
                Watch real-time live stepper indicators as each name clears registry validation and cascades through social channels.
              </p>
            </TiltCard>
          </RevealOnScroll>

          <RevealOnScroll delay={250}>
            <TiltCard className="step-card h-full">
              <div className="step-badge-num">03</div>
              <h4 className="step-title">Export All-Clear Shortlist</h4>
              <p className="step-text">
                Filter by surviving all-clear candidates, review annual registration pricing, and download structured CSV records.
              </p>
            </TiltCard>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section className="faq-section">
        <RevealOnScroll>
          <div className="section-header-center">
            <div className="section-kicker">QUESTIONS &amp; ANSWERS</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
        </RevealOnScroll>

        <div className="faq-accordion">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <RevealOnScroll key={idx} delay={idx * 60}>
                <div
                  className={`faq-item-card ${isOpen ? 'open' : ''}`}
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                >
                  <div className="faq-question-row">
                    <span className="faq-q-text">{faq.q}</span>
                    <ChevronDownIcon
                      size={16}
                      className={`faq-chevron ${isOpen ? 'rotate' : ''}`}
                    />
                  </div>
                  {isOpen && (
                    <div className="faq-answer-body">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </section>

      {/* ── BOTTOM CALL TO ACTION ── */}
      <section className="bottom-cta-section">
        <RevealOnScroll>
          <div className="cta-box-modern">
            <div className="cta-sparkle-pill">
              <SparklesIcon size={12} />
              <span>Ready in Seconds</span>
            </div>
            <h2 className="cta-title">Find Your Next Clean Brand Identity</h2>
            <p className="cta-desc">
              No signup required. Paste your candidate names and run the cascading funnel right now.
            </p>
            <div className="cta-actions-row">
              <button className="btn-hero-primary" onClick={onLaunchTool}>
                <span>Launch Brand Funnel</span>
                <ArrowRightIcon size={16} />
              </button>
              <button className="btn-hero-secondary" onClick={onOpenGuide}>
                <span>Read API Documentation</span>
              </button>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* ── MODERN FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-brand">
              <div className="footer-logo-badge">
                <SearchIcon size={14} />
              </div>
              <span className="footer-logo-text">Brand Funnel</span>
            </div>
            <span className="footer-copy">
              Precision Domain &amp; Social Identity Intelligence. Client-side execution.
            </span>
          </div>

          <div className="footer-links">
            <button className="footer-link-btn" onClick={onLaunchTool}>
              Brand Funnel Tool
            </button>
            <button className="footer-link-btn" onClick={onOpenGuide}>
              API Setup Guide
            </button>
            <a
              href="https://developer.godaddy.com/docs/api-users/domains/search"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-btn"
            >
              GoDaddy Registry Docs <ExternalLinkIcon size={11} style={{ display: 'inline', marginLeft: 2 }} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
