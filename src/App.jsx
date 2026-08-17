import { useState, useEffect } from 'react'
import { useSettings, ALL_TLDS, SOCIAL_PLATFORMS } from './hooks/useSettings.js'
import { useChecker } from './hooks/useChecker.js'
import SettingsDrawer from './components/SettingsDrawer.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import LandingPage from './components/LandingPage.jsx'
import GuidePage from './components/GuidePage.jsx'
import PrivacyPage from './components/PrivacyPage.jsx'
import {
  SearchIcon,
  ZapIcon,
  SparklesIcon,
  FileTextIcon,
  ShieldIcon,
  SettingsIcon,
  SunIcon,
  MoonIcon,
  AutoThemeIcon,
  RefreshIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  AlertCircleIcon,
} from './components/Icons.jsx'
import './index.css'

const PLACEHOLDER = `fixgen
novara
velio
travio

# Or full domains:
brandname.com`

function getPageFromHash() {
  const hash = (window.location.hash || '').replace(/^#\/?/, '').toLowerCase()
  if (hash === 'tool') return 'tool'
  if (hash === 'guide') return 'guide'
  if (hash === 'privacy') return 'privacy'
  return 'landing'
}

function getPlatformIcon(platform, size = 15) {
  switch (platform) {
    case 'instagram': return <InstagramIcon size={size} />
    case 'youtube':   return <YouTubeIcon size={size} />
    case 'twitter':   return <TwitterIcon size={size} />
    case 'facebook':  return <FacebookIcon size={size} />
    default:          return null
  }
}

export default function App() {
  const { settings, updateSettings } = useSettings()
  const { state, run, reset }        = useChecker()

  const [currentPage, setCurrentPageState] = useState(getPageFromHash)
  const [input, setInput]               = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [filterAvailable, setFilter]    = useState(false)
  const [mobileToolTab, setMobileToolTab] = useState('search') // 'search' | 'results'

  const navigateTo = (page) => {
    setCurrentPageState(page)
    if (page === 'landing') {
      window.history.replaceState(null, '', window.location.pathname)
    } else {
      window.location.hash = page
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPageState(getPageFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme || 'auto')
  }, [settings.theme])

  useEffect(() => {
    if (state.status === 'running' || state.status === 'done' || state.status === 'stopped') {
      setMobileToolTab('results')
    }
    if (state.status === 'error') {
      setMobileToolTab('results')
    }
  }, [state.status])

  function toggleTld(tld) {
    const next = settings.tlds.includes(tld)
      ? settings.tlds.filter(t => t !== tld)
      : [...settings.tlds, tld]
    if (next.length === 0) return
    updateSettings({ tlds: next })
  }

  async function handleCheck() {
    if (state.status === 'running') return
    setFilter(false)
    await run(input, settings.pat, settings.tlds, settings)
  }

  function handleReset() {
    reset()
    setFilter(false)
    setMobileToolTab('search')
  }

  function cycleTheme() {
    const current = settings.theme || 'auto'
    const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto'
    updateSettings({ theme: next })
  }

  const hasPat     = !!settings.pat
  const isRunning  = state.status === 'running'
  const isDone     = state.status === 'done' || state.status === 'stopped'
  const isError    = state.status === 'error'
  const inputEmpty = !input.trim()

  const activeSocials = SOCIAL_PLATFORMS.filter(p => settings[p.key])
  const resultCount   = state.rows?.length ?? 0
  const aliveCount    = state.rows?.filter(r => r.isAlive).length ?? 0

  // ── Search/Setup Panel ──
  const searchPanel = (
    <div className={`left-panel${mobileToolTab === 'search' ? ' mobile-active' : ''}`}>

      <div className="panel-section">
        <div className="section-label">Names to Check</div>
        <div className="input-hint-row">
          <span className="input-hint-text">Enter names or domains</span>
          <span className="input-hint-sub">one per line or comma</span>
        </div>
        <textarea
          className="names-textarea"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={PLACEHOLDER}
          spellCheck={false}
          disabled={isRunning}
          autoCapitalize="none"
          autoCorrect="off"
        />
      </div>

      <div className="panel-section">
        <div className="section-label">Stage 1: TLDs to Filter</div>
        <div className="tld-grid">
          {ALL_TLDS.map(({ tld }) => (
            <button
              key={tld}
              className={`tld-btn${settings.tlds.includes(tld) ? ' selected' : ''}`}
              onClick={() => toggleTld(tld)}
              disabled={isRunning}
            >
              {tld}
            </button>
          ))}
        </div>
        <div className="pipeline-flow-hint">
          Names must have at least 1 free domain to advance to social stages.
        </div>
      </div>

      <div className="panel-section">
        <div className="section-label">Stages 2–5: Sequential Social Funnel</div>
        <div className="social-grid">
          {SOCIAL_PLATFORMS.map((p, idx) => {
            const isOn = !!settings[p.key]
            return (
              <div key={p.key} className={`social-row${isOn ? ' enabled' : ''}`}>
                <div className="social-row-left">
                  <span className="stage-num-badge">#{idx + 2}</span>
                  <div
                    className="social-icon"
                    style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}
                  >
                    {getPlatformIcon(p.platform, 14)}
                  </div>
                  <div>
                    <div className="social-label">{p.label}</div>
                    {!p.reliable && <div className="social-unreliable">Limited accuracy</div>}
                  </div>
                </div>
                <div
                  className={`toggle${isOn ? ' on' : ''}`}
                  onClick={() => !isRunning && updateSettings({ [p.key]: !isOn })}
                  role="switch"
                  aria-checked={isOn}
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && !isRunning && updateSettings({ [p.key]: !isOn })}
                >
                  <div className="toggle-knob" />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel-section">
        {!isRunning ? (
          <>
            <button
              className="btn-check"
              onClick={handleCheck}
              disabled={inputEmpty}
              title={inputEmpty ? 'Enter at least one name' : ''}
            >
              <ZapIcon size={15} />
              <span>Run Funnel Pipeline</span>
            </button>
            {isDone && (
              <button className="btn-check secondary" onClick={handleReset}>
                <RefreshIcon size={14} />
                <span>Clear &amp; Start Over</span>
              </button>
            )}
          </>
        ) : (
          <>
            <button className="btn-check" disabled>
              <span className="spinner" />
              <span>Running Pipeline…</span>
            </button>
            <div className="progress-wrap">
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${state.progress}%` }} />
              </div>
              <div className="progress-label">{state.progress}% · {state.progressLabel}</div>
            </div>
          </>
        )}
      </div>

    </div>
  )

  // ── Results Panel ──
  const resultsPanel = (
    <div className={`right-panel${mobileToolTab === 'results' ? ' mobile-active' : ''}`}>
      {isError ? (
        <div className="error-wrap">
          <AlertCircleIcon size={20} style={{ color: 'var(--taken)', flexShrink: 0 }} />
          <div>
            <div className="error-msg">{state.error}</div>
            {state.authError && (
              <button className="error-cta" onClick={() => setShowSettings(true)}>
                Open Settings →
              </button>
            )}
          </div>
        </div>
      ) : (isDone || isRunning) && resultCount > 0 ? (
        <ResultsTable
          rows={state.rows}
          tlds={settings.tlds}
          activeSocials={activeSocials}
          stages={state.stages}
          fallbackNotice={state.fallbackNotice}
          stopMessage={state.stopMessage}
          filterAvailable={filterAvailable}
          onFilterChange={setFilter}
        />
      ) : (
        <div className="state-wrap">
          {isRunning ? (
            <>
              <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
              <div className="state-title">Running Sequential Check…</div>
              <div className="state-sub">{state.progressLabel}</div>
              <div className="progress-bar-bg" style={{ width: '100%', maxWidth: 300 }}>
                <div className="progress-bar-fill" style={{ width: `${state.progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <div className="state-icon">
                <ZapIcon size={44} />
              </div>
              <div className="state-title">Sequential Brand Funnel</div>
              <div className="state-sub">
                Enter names in Setup. The engine checks <strong>Domains</strong> first.
                Only surviving available names advance to <strong>Instagram</strong>, then <strong>YouTube</strong>,
                <strong>Twitter / X</strong>, and <strong>Facebook</strong>.
              </div>
              {!hasPat && (
                <div className="state-hint">
                  <ShieldIcon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>
                    <strong>Authoritative Live DNS Active:</strong> You can run checks immediately.
                    Optional: Add your GoDaddy PAT in <strong>Settings</strong> for official registry price estimates.
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )

  const renderThemeIcon = () => {
    if (settings.theme === 'light') return <SunIcon size={14} />
    if (settings.theme === 'dark')  return <MoonIcon size={14} />
    return <AutoThemeIcon size={14} />
  }

  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-logo" onClick={() => navigateTo('landing')} style={{ cursor: 'pointer' }}>
          <div className="header-logo-mark">
            <SearchIcon size={15} />
          </div>
          <div>
            <div className="header-title">Brand Funnel</div>
            <div className="header-tagline">Sequential Domain → Social Availability</div>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-nav" aria-label="Main Navigation">
          <button
            className={`nav-link-btn${currentPage === 'landing' ? ' active' : ''}`}
            onClick={() => navigateTo('landing')}
          >
            <SparklesIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            Home
          </button>
          <button
            className={`nav-link-btn${currentPage === 'tool' ? ' active' : ''}`}
            onClick={() => navigateTo('tool')}
          >
            <ZapIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            Brand Funnel
          </button>
          <button
            className={`nav-link-btn${currentPage === 'guide' ? ' active' : ''}`}
            onClick={() => navigateTo('guide')}
          >
            <FileTextIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            API Guide
          </button>
          <button
            className={`nav-link-btn${currentPage === 'privacy' ? ' active' : ''}`}
            onClick={() => navigateTo('privacy')}
          >
            <ShieldIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            Privacy
          </button>
        </nav>

        <div className="header-spacer" />

        <div className="header-actions">
          {/* Quick Theme Toggle */}
          <button
            className="btn-theme-quick"
            onClick={cycleTheme}
            title={`Theme: ${settings.theme || 'auto'} (click to cycle)`}
            aria-label="Toggle theme appearance"
          >
            {renderThemeIcon()}
          </button>

          <div className="pat-badge">
            <span className={`pat-dot${hasPat ? ' ok' : ' missing'}`} />
            {hasPat ? 'API connected' : 'DNS Live Mode'}
          </div>

          <button
            className={`btn-settings${showSettings ? ' active' : ''}`}
            onClick={() => setShowSettings(s => !s)}
            aria-label="Open settings"
          >
            <SettingsIcon size={13} />
            <span className="settings-btn-text">Settings</span>
          </button>
        </div>
      </header>

      {/* ── CONDITIONAL PAGE ROUTING ── */}
      <main className="content-viewport">
        {currentPage === 'landing' && (
          <LandingPage
            onLaunchTool={() => navigateTo('tool')}
            onOpenGuide={() => navigateTo('guide')}
          />
        )}

        {currentPage === 'guide' && (
          <GuidePage
            onLaunchTool={() => navigateTo('tool')}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPage
            onLaunchTool={() => navigateTo('tool')}
          />
        )}

        {currentPage === 'tool' && (
          <div className="tool-view-wrapper">
            {/* Mobile Tool View Switcher (Setup vs Results) */}
            <div className="mobile-tool-segmented">
              <button
                className={`seg-btn${mobileToolTab === 'search' ? ' active' : ''}`}
                onClick={() => setMobileToolTab('search')}
              >
                <SearchIcon size={14} style={{ display: 'inline', marginRight: 5 }} />
                <span>1. Setup &amp; Names</span>
              </button>
              <button
                className={`seg-btn${mobileToolTab === 'results' ? ' active' : ''}`}
                onClick={() => setMobileToolTab('results')}
              >
                <ZapIcon size={14} style={{ display: 'inline', marginRight: 5 }} />
                <span>2. Funnel Results</span>
                {resultCount > 0 && (
                  <span className="seg-badge">{aliveCount > 0 ? `${aliveCount} clear` : `${resultCount}`}</span>
                )}
              </button>
            </div>

            <div className="main">
              {searchPanel}
              {resultsPanel}
            </div>
          </div>
        )}
      </main>

      {/* ── GLOBAL MOBILE BOTTOM NAV (Available on ALL pages) ── */}
      <nav className="mobile-tabs" aria-label="Global Mobile Navigation">
        <button
          className={`tab-btn${currentPage === 'landing' ? ' active' : ''}`}
          onClick={() => navigateTo('landing')}
        >
          <SparklesIcon size={17} className="tab-btn-icon" />
          <span>Home</span>
        </button>
        <button
          className={`tab-btn${currentPage === 'tool' ? ' active' : ''}`}
          onClick={() => navigateTo('tool')}
        >
          <ZapIcon size={17} className="tab-btn-icon" />
          <span>Funnel</span>
          {resultCount > 0 && (
            <span className="tab-badge">{aliveCount > 0 ? `${aliveCount}` : resultCount}</span>
          )}
        </button>
        <button
          className={`tab-btn${currentPage === 'guide' ? ' active' : ''}`}
          onClick={() => navigateTo('guide')}
        >
          <FileTextIcon size={17} className="tab-btn-icon" />
          <span>Guide</span>
        </button>
        <button
          className={`tab-btn${currentPage === 'privacy' ? ' active' : ''}`}
          onClick={() => navigateTo('privacy')}
        >
          <ShieldIcon size={17} className="tab-btn-icon" />
          <span>Privacy</span>
        </button>
        <button
          className="tab-btn"
          onClick={() => setShowSettings(true)}
        >
          <SettingsIcon size={17} className="tab-btn-icon" />
          <span>Config</span>
        </button>
      </nav>

      {/* ── SETTINGS DRAWER ── */}
      {showSettings && (
        <SettingsDrawer
          settings={settings}
          onSave={updateSettings}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
