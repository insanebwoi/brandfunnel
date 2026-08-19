import { useState } from 'react'
import {
  BrandLogo,
  SearchIcon,
  ZapIcon,
  GlobeIcon,
  ShieldIcon,
  CheckIcon,
  SparklesIcon,
  ArrowRightIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  FileTextIcon,
  ExternalLinkIcon,
  AlertCircleIcon,
} from './Icons.jsx'

function Breadcrumb({ items }) {
  return (
    <nav className="seo-breadcrumb" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} className="breadcrumb-item">
          {item.onClick ? (
            <button className="breadcrumb-link" onClick={item.onClick}>{item.label}</button>
          ) : (
            <span className="breadcrumb-current">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="breadcrumb-separator">/</span>}
        </span>
      ))}
    </nav>
  )
}

function InlineToolBox({ onLaunchTool, defaultInput = 'novara', title = 'Check a Brand Name Right Now' }) {
  const [val, setVal] = useState(defaultInput)
  return (
    <div className="inline-tool-box">
      <div className="inline-tool-title">
        <ZapIcon size={16} />
        <span>{title}</span>
      </div>
      <div className="inline-tool-bar">
        <input
          type="text"
          className="inline-tool-input"
          value={val}
          onChange={e => setVal(e.target.value)}
          placeholder="enter candidate brand name..."
          onKeyDown={e => e.key === 'Enter' && onLaunchTool?.(val)}
        />
        <button className="inline-tool-btn" onClick={() => onLaunchTool?.(val)}>
          <span>Check Name</span>
          <ArrowRightIcon size={14} />
        </button>
      </div>
      <div className="inline-tool-sub">
        Validates .com/.net/.io domains + Instagram, YouTube &amp; Twitter/X handles in 1 click.
      </div>
    </div>
  )
}

/** 1. BRAND NAME CHECKER PAGE */
export function BrandNameCheckerPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Brand Name Checker' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Brand Name Checker</h1>
        <p className="seo-page-sub">
          Check and validate your brand name candidates across domain registries, social handles, trademark signals, and identity availability before launching.
        </p>
      </header>

      <InlineToolBox onLaunchTool={onLaunchTool} title="Run Brand Name Verification" />

      <article className="seo-article-body">
        <h2>What Does a Brand Name Checker Do?</h2>
        <p>
          A brand name checker evaluates candidate names against technical registry databases, DNS resolvers, and social networks to determine whether a brand identity can be successfully registered and owned across all primary digital touchpoints.
        </p>

        <h2>Why Check a Brand Name Before Launching?</h2>
        <p>
          Launching a brand under a name with a taken <code>.com</code> domain or unavailable Instagram handle creates friction, customer confusion, and potential trademark infringement liabilities. Checking your brand early ensures:
        </p>
        <ul>
          <li><strong>Domain Ownership:</strong> Securing matching <code>.com</code>, <code>.io</code>, or <code>.ai</code> TLDs.</li>
          <li><strong>Social Identity Sync:</strong> Matching handles across Instagram, YouTube, and Twitter/X.</li>
          <li><strong>Confusion Avoidance:</strong> Identifying existing registered businesses in similar verticals.</li>
          <li><strong>Resource Conservation:</strong> Avoiding costly rebrands after launch.</li>
        </ul>

        <h2>What Does Our Brand Checker Analyze?</h2>
        <div className="seo-grid-cards">
          <div className="seo-card">
            <h3>1. Domain Registry Signals</h3>
            <p>Queries Authoritative Live DNS resolvers (Google &amp; Cloudflare DoH) and ICANN RDAP to verify registry availability.</p>
          </div>
          <div className="seo-card">
            <h3>2. Social Handle Status</h3>
            <p>Validates username existence on Instagram, YouTube channel handles, Twitter/X profiles, and Facebook.</p>
          </div>
          <div className="seo-card">
            <h3>3. Trademark Research Links</h3>
            <p>Direct deep-links to USPTO TESS and WIPO Global Brand Database for preliminary similarity checks.</p>
          </div>
          <div className="seo-card">
            <h3>4. Brandability &amp; Pronunciation</h3>
            <p>Evaluates character length, phonetic clarity, and memorable brand structure.</p>
          </div>
        </div>

        <h2>What Makes a Good Brand Name?</h2>
        <p>
          Great brand names are concise (5–8 letters), easy to pronounce, phonetically distinct, and clear of conflicting trademark registrations.
        </p>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('business-name-checker')}>
          Next: Business Name Checker →
        </button>
      </div>
    </div>
  )
}

/** 2. BUSINESS NAME CHECKER PAGE */
export function BusinessNameCheckerPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Business Name Checker' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Business Name Checker</h1>
        <p className="seo-page-sub">
          Search and verify business name availability, company registry requirements, and brand identity signals.
        </p>
      </header>

      <InlineToolBox onLaunchTool={onLaunchTool} title="Search Business Name Availability" />

      <article className="seo-article-body">
        <h2>Business Name vs. Brand Name vs. Legal Company Name</h2>
        <p>
          Founders frequently confuse business names, brand names, legal entity names, and registered trademarks:
        </p>
        <table className="seo-comparison-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Primary Function</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Brand Name</strong></td>
              <td>Customer-facing market identity &amp; product logo</td>
              <td>Google</td>
            </tr>
            <tr>
              <td><strong>Legal Business Name</strong></td>
              <td>Official state LLC / Corporation tax entity</td>
              <td>Alphabet Inc.</td>
            </tr>
            <tr>
              <td><strong>Registered Trademark</strong></td>
              <td>Legally protected intellectual property mark</td>
              <td>GOOGLE® (Class 9/38/42)</td>
            </tr>
            <tr>
              <td><strong>Domain Name</strong></td>
              <td>Digital web address &amp; DNS routing identifier</td>
              <td>google.com</td>
            </tr>
          </tbody>
        </table>

        <h2>How to Check Business Name Availability</h2>
        <ol>
          <li>Run live DNS domain checks across <code>.com</code> and secondary TLDs.</li>
          <li>Validate social media username availability.</li>
          <li>Perform state LLC/Corporate registry search with your Secretary of State.</li>
          <li>Conduct preliminary trademark research on USPTO.</li>
        </ol>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('domain-name-checker')}>
          Next: Domain Name Checker →
        </button>
      </div>
    </div>
  )
}

/** 3. DOMAIN NAME CHECKER PAGE */
export function DomainNameCheckerPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Domain Name Checker' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Domain Name Checker</h1>
        <p className="seo-page-sub">
          High-speed domain resolution powered by Authoritative DNS-over-HTTPS (Google &amp; Cloudflare DoH) and ICANN RDAP lookup.
        </p>
      </header>

      <InlineToolBox onLaunchTool={onLaunchTool} title="Check Domain Availability Now" />

      <article className="seo-article-body">
        <h2>Why Your Brand Name Should Match Your Domain</h2>
        <p>
          Having a matching domain name eliminates brand dilution, improves email deliverability trust, and ensures direct type-in traffic reaches your business without leakages to third parties.
        </p>

        <h2>.com vs. Secondary Extensions (.io, .ai, .app, .in)</h2>
        <p>
          While <code>.com</code> remains the gold standard for global consumer trust, specialized TLDs like <code>.io</code> (technology), <code>.ai</code> (artificial intelligence), and <code>.app</code> (mobile applications) provide powerful alternatives for modern startups.
        </p>

        <h2>What to Do If Your Primary Domain Is Taken</h2>
        <ul>
          <li>Try adding clean prefixes or suffixes: <code>get[brand].com</code>, <code>use[brand].com</code>, <code>try[brand].com</code>.</li>
          <li>Consider tech-focused TLDs like <code>[brand].io</code> or <code>[brand].co</code>.</li>
          <li>Enforce strict all-free domain filtering in Brand Funnel to prioritize 100% available names.</li>
        </ul>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('trademark-checker')}>
          Next: Trademark Research Guide →
        </button>
      </div>
    </div>
  )
}

/** 4. TRADEMARK CHECKER PAGE */
export function TrademarkCheckerPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Trademark Research' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Trademark Research &amp; Risk Assessment</h1>
        <p className="seo-page-sub">
          Understand trademark similarity, conflict identification, and preliminary clearance practices.
        </p>
      </header>

      <div className="doc-callout warn" style={{ marginBottom: 20 }}>
        <AlertCircleIcon size={16} className="doc-callout-icon" />
        <div>
          <strong>Important Clearance Disclaimer:</strong> Technical domain and handle checks perform digital identity verification. They do not constitute official legal trademark legal counsel or registration clearance. Always consult an IP attorney for official filings.
        </div>
      </div>

      <InlineToolBox onLaunchTool={onLaunchTool} title="Check Technical Brand Signals" />

      <article className="seo-article-body">
        <h2>How Trademark Similarity Is Evaluated</h2>
        <p>
          Trademark offices evaluate potential confusion based on commercial impression, phonetic similarity, visual appearance, and overlapping goods/services classes.
        </p>

        <h2>Official Trademark Databases for Research</h2>
        <ul>
          <li><a href="https://tmsearch.uspto.gov/" target="_blank" rel="noreferrer">USPTO TESS (United States Patent &amp; Trademark Office)</a></li>
          <li><a href="https://branddb.wipo.int/" target="_blank" rel="noreferrer">WIPO Global Brand Database (International Marks)</a></li>
          <li><a href="https://ipindiaonline.gov.in/tmrpublicsearch/" target="_blank" rel="noreferrer">IP India Trademark Public Search</a></li>
        </ul>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('social-handle-checker')}>
          Next: Social Handle Checker →
        </button>
      </div>
    </div>
  )
}

/** 5. SOCIAL HANDLE CHECKER PAGE */
export function SocialHandleCheckerPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Social Handle Checker' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Social Media Handle Checker</h1>
        <p className="seo-page-sub">
          Real-time protocol verification across Instagram, YouTube channel handles, Twitter/X usernames, and Facebook pages.
        </p>
      </header>

      <InlineToolBox onLaunchTool={onLaunchTool} title="Verify Social Handles Now" />

      <article className="seo-article-body">
        <h2>Supported Social Platforms &amp; Verification Protocols</h2>
        <div className="seo-grid-cards">
          <div className="seo-card">
            <h3><InstagramIcon size={16} /> Instagram (@username)</h3>
            <p>Queries web profile endpoint and HTML fallback for 404 non-existence verification.</p>
          </div>
          <div className="seo-card">
            <h3><YouTubeIcon size={16} /> YouTube (/@channel)</h3>
            <p>Queries channel handle endpoint for 200 vs 404 registration status.</p>
          </div>
          <div className="seo-card">
            <h3><TwitterIcon size={16} /> Twitter / X (@username)</h3>
            <p>Performs profile metadata title matching and non-existence verification.</p>
          </div>
        </div>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('brand-name-generator')}>
          Next: Brand Name Generator →
        </button>
      </div>
    </div>
  )
}

/** 6. BRAND NAME GENERATOR PAGE */
export function BrandNameGeneratorPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Tools', onClick: () => onNavigate('tool') },
          { label: 'Brand Name Generator' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Brand Name Generator &amp; Validation Engine</h1>
        <p className="seo-page-sub">
          Generate candidate names paired with real-time domain availability and social verification.
        </p>
      </header>

      <InlineToolBox onLaunchTool={onLaunchTool} defaultInput="novara, velio, travio" title="Run Bulk Generator Check" />

      <article className="seo-article-body">
        <h2>Modern Naming Styles &amp; Formula Patterns</h2>
        <ul>
          <li><strong>Invented / Abstract:</strong> <code>Novara</code>, <code>Spotify</code>, <code>Zendesk</code> (Short, unique, highly brandable).</li>
          <li><strong>Compound Words:</strong> <code>Snapchat</code>, <code>AirBnb</code>, <code>YouTube</code> (Combines 2 familiar concepts).</li>
          <li><strong>Suffix Modification:</strong> <code>Shopify</code>, <code>Spotify</code>, <code>Coursera</code> (Adds -ify, -era, -io endings).</li>
        </ul>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('methodology')}>
          Next: View Methodology →
        </button>
      </div>
    </div>
  )
}

/** 7. METHODOLOGY & TRANSPARENCY PAGE */
export function MethodologyPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'About', onClick: () => onNavigate('landing') },
          { label: 'Methodology' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Verification Methodology &amp; System Transparency</h1>
        <p className="seo-page-sub">
          How Brand Funnel checks domain DNS resolvers, social profile protocols, and privacy guarantees.
        </p>
      </header>

      <article className="seo-article-body">
        <h2>1. Domain Registry Protocol (DoH + RDAP)</h2>
        <p>
          Domain queries execute directly from your browser using Authoritative DNS-over-HTTPS (Google DoH at <code>dns.google</code> and Cloudflare DoH at <code>cloudflare-dns.com</code>) paired with ICANN Registration Data Access Protocol (RDAP).
        </p>

        <h2>2. Sequential Early-Stop Pruning</h2>
        <p>
          Downstream social APIs are only queried for survivor names that pass Stage 1 domain checks (or 100% all-free domain requirements). This prunes 75%+ of unnecessary outbound calls.
        </p>

        <h2>3. 100% Client-Side Privacy Guarantee</h2>
        <p>
          Searched keywords and configuration settings are processed strictly in your local browser state. Zero telemetry, zero remote database logs, zero idea leakage.
        </p>
      </article>

      <div className="seo-nav-footer">
        <button className="btn-seo-nav" onClick={() => onNavigate('learn')}>
          Explore Knowledge Hub →
        </button>
      </div>
    </div>
  )
}

/** 8. LEARN / KNOWLEDGE HUB PAGE */
export function LearnPage({ onNavigate, onLaunchTool }) {
  return (
    <div className="seo-page-container">
      <Breadcrumb
        items={[
          { label: 'Home', onClick: () => onNavigate('landing') },
          { label: 'Learn Knowledge Hub' },
        ]}
      />

      <header className="seo-page-header">
        <h1 className="seo-page-title">Brand Naming Knowledge Hub</h1>
        <p className="seo-page-sub">
          Comprehensive guides on brand creation, domain availability, trademark research, and business identity.
        </p>
      </header>

      <div className="seo-grid-cards">
        <div className="seo-card clickable" onClick={() => onNavigate('brand-name-checker')}>
          <h3>How to Check a Brand Name</h3>
          <p>Learn the 5-step framework for validating candidate names across domains, socials, and trademarks.</p>
        </div>
        <div className="seo-card clickable" onClick={() => onNavigate('business-name-checker')}>
          <h3>Business Name vs. Brand Name</h3>
          <p>Understand the critical differences between DBA trade names, legal entities, and registered trademarks.</p>
        </div>
        <div className="seo-card clickable" onClick={() => onNavigate('domain-name-checker')}>
          <h3>How to Choose the Right Domain</h3>
          <p>Explore <code>.com</code> vs <code>.io</code> vs <code>.ai</code> TLD strategies and domain prefix techniques.</p>
        </div>
        <div className="seo-card clickable" onClick={() => onNavigate('trademark-checker')}>
          <h3>Trademark Clearance Essentials</h3>
          <p>Preliminary research strategies using USPTO and WIPO global databases.</p>
        </div>
      </div>
    </div>
  )
}
