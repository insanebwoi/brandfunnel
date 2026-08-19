import { useState, useEffect } from 'react'
import { useSettings, ALL_TLDS, SOCIAL_PLATFORMS } from './hooks/useSettings.js'
import { useChecker } from './hooks/useChecker.js'
import { useSeoHead } from './hooks/useSeoHead.js'
import SettingsDrawer from './components/SettingsDrawer.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import LandingPage from './components/LandingPage.jsx'
import GuidePage from './components/GuidePage.jsx'
import PrivacyPage from './components/PrivacyPage.jsx'
import {
  BrandNameCheckerPage,
  BusinessNameCheckerPage,
  DomainNameCheckerPage,
  TrademarkCheckerPage,
  SocialHandleCheckerPage,
  BrandNameGeneratorPage,
  MethodologyPage,
  LearnPage,
} from './components/SeoPages.jsx'
import {
  BrandLogo,
  BrandLogoSVG,
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
  GlobeIcon,
  CopyIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  AlertCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
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
  const validPages = [
    'tool',
    'guide',
    'privacy',
    'brand-name-checker',
    'business-name-checker',
    'domain-name-checker',
    'trademark-checker',
    'social-handle-checker',
    'brand-name-generator',
    'methodology',
    'learn',
  ]
  return validPages.includes(hash) ? hash : 'landing'
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

  // Dynamic SEO Head Manager
  useSeoHead(currentPage)
  const [input, setInput]               = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [filterAvailable, setFilter]    = useState(false)
  const [mobileToolTab, setMobileToolTab] = useState('search') // 'search' | 'results'
  const [toolViewMode, setToolViewMode] = useState('setup')   // 'setup' | 'results'

  const navigateTo = (page) => {
    setCurrentPageState(page)
    const newUrl = page === 'landing' ? window.location.pathname : `#${page}`
    if (window.location.hash !== (page === 'landing' ? '' : `#${page}`)) {
      window.history.pushState(null, '', newUrl)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleUrlSync = () => {
      const page = getPageFromHash()
      setCurrentPageState(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    window.addEventListener('hashchange', handleUrlSync)
    window.addEventListener('popstate', handleUrlSync)
    return () => {
      window.removeEventListener('hashchange', handleUrlSync)
      window.removeEventListener('popstate', handleUrlSync)
    }
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      const mode = settings.theme || 'auto'
      if (mode === 'dark' || mode === 'light') {
        document.documentElement.setAttribute('data-theme', mode)
        document.documentElement.setAttribute('data-theme-mode', mode)
      } else {
        const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
        document.documentElement.setAttribute('data-theme-mode', 'auto')
      }
    }

    applyTheme()

    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = () => {
        if ((settings.theme || 'auto') === 'auto') {
          applyTheme()
        }
      }

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange)
        return () => mediaQuery.removeListener(handleChange)
      }
    }
  }, [settings.theme])

  useEffect(() => {
    if (state.status === 'running' || state.status === 'done' || state.status === 'stopped') {
      setMobileToolTab('results')
      setToolViewMode('results')
    }
    if (state.status === 'error') {
      setMobileToolTab('results')
      setToolViewMode('results')
    }
  }, [state.status])

  function toggleTld(tld) {
    const current = Array.isArray(settings?.tlds) ? settings.tlds : ['.com', '.net', '.in', '.io']
    const next = current.includes(tld)
      ? current.filter(t => t !== tld)
      : [...current, tld]
    if (next.length === 0) return
    updateSettings({ tlds: next })
  }

  async function handleCheck() {
    if (state.status === 'running') return
    setFilter(false)
    setToolViewMode('results')
    const safeTlds = Array.isArray(settings?.tlds) ? settings.tlds : ['.com', '.net', '.in', '.io']
    await run(input, safeTlds, settings)
  }

  function handleReset() {
    reset()
    setFilter(false)
    setMobileToolTab('search')
    setToolViewMode('setup')
  }

  function cycleTheme() {
    const current = settings.theme || 'auto'
    const next = current === 'auto' ? 'light' : current === 'light' ? 'dark' : 'auto'
    updateSettings({ theme: next })
  }

  const isRunning   = state.status === 'running'
  const isDone      = state.status === 'done' || state.status === 'stopped'
  const isError     = state.status === 'error'
  const inputEmpty  = !input.trim()
  const currentTlds = Array.isArray(settings?.tlds) ? settings.tlds : ['.com', '.net', '.in', '.io']

  const activeSocials = SOCIAL_PLATFORMS.filter(p => !!settings?.[p.key])
  const resultCount   = state.rows?.length ?? 0
  const aliveCount    = state.rows?.filter(r => r.isAlive).length ?? 0

  // ── Centered Setup Workspace (Default #tool View) ──
  const centeredSetupPanel = (
    <div className="centered-tool-wrapper">
      <div className="centered-tool-card">
        <div className="centered-card-header">
          <div className="centered-badge">
            <SparklesIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            <span>Brand Pipeline Engine</span>
          </div>
          <h1 className="centered-tool-title">Names to Check</h1>
          <p className="centered-tool-sub">
            Enter brand candidates below. Click <strong>Run Funnel Pipeline</strong> to execute live domain and social availability checks.
          </p>
        </div>

        <div className="centered-textarea-wrap">
          <div className="input-hint-row">
            <span className="input-hint-text">Enter names or full domains</span>
            <span className="input-hint-sub">one per line or comma</span>
          </div>
          <textarea
            className="names-textarea centered-textarea"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={PLACEHOLDER}
            spellCheck={false}
            disabled={isRunning}
            autoCapitalize="none"
            autoCorrect="off"
            rows={7}
          />
        </div>

        {/* Action Button (Positioned directly under textarea, above Pipeline Config) */}
        <div className="centered-action-wrap">
          <button
            className="btn-check btn-hero-primary centered-run-btn"
            onClick={handleCheck}
            disabled={inputEmpty}
            title={inputEmpty ? 'Enter at least one name' : ''}
          >
            <ZapIcon size={16} />
            <span>Run Funnel Pipeline</span>
          </button>
        </div>

        {/* Enabled Config Summary & Advanced Toggle */}
        <div className="centered-summary-bar">
          <div className="enabled-summary-row">
            <span className="enabled-summary-title">Pipeline Config</span>
            <button
              className="btn-toggle-advanced"
              onClick={() => setShowAdvanced(s => !s)}
              type="button"
            >
              <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}</span>
              {showAdvanced ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
            </button>
          </div>

          <div className="active-options-preview">
            <div className="preview-chip-group">
              <span className="preview-group-label">TLDs:</span>
              {currentTlds.map(tld => (
                <span key={tld} className="preview-chip tld">
                  {tld}
                </span>
              ))}
            </div>
            <div className="preview-chip-group">
              <span className="preview-group-label">Socials:</span>
              {activeSocials.length > 0 ? (
                activeSocials.map(p => (
                  <span key={p.key} className="preview-chip social" style={{ borderColor: `${p.color}40`, color: p.color }}>
                    {getPlatformIcon(p.platform, 11)}
                    <span>{p.label}</span>
                  </span>
                ))
              ) : (
                <span className="preview-chip-none">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Advanced Settings Drawer */}
        {showAdvanced && (
          <div className="advanced-settings-wrapper centered-advanced-card">
            <div className="panel-section">
              <div className="section-label">Stage 1: TLDs to Filter</div>
              <div className="tld-grid">
                {ALL_TLDS.map(({ tld }) => (
                  <button
                    key={tld}
                    className={`tld-btn${currentTlds.includes(tld) ? ' selected' : ''}`}
                    onClick={() => toggleTld(tld)}
                    disabled={isRunning}
                  >
                    {tld}
                  </button>
                ))}
              </div>

              <div className="social-row enabled" style={{ marginTop: 10 }}>
                <div className="social-row-left">
                  <GlobeIcon size={14} style={{ color: 'var(--avail)' }} />
                  <div>
                    <div className="social-label">Require ALL selected TLDs free</div>
                    <div className="social-unreliable">Pass name only if 100% of checked TLDs are available</div>
                  </div>
                </div>
                <div
                  className={`toggle${settings.requireAllDomainsFree ? ' on' : ''}`}
                  onClick={() => !isRunning && updateSettings({ requireAllDomainsFree: !settings.requireAllDomainsFree })}
                  role="switch"
                  aria-checked={settings.requireAllDomainsFree}
                  tabIndex={0}
                >
                  <div className="toggle-knob" />
                </div>
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
                        <div className="social-label">{p.label}</div>
                      </div>
                      <div
                        className={`toggle${isOn ? ' on' : ''}`}
                        onClick={() => !isRunning && updateSettings({ [p.key]: !isOn })}
                        role="switch"
                        aria-checked={isOn}
                        tabIndex={0}
                      >
                        <div className="toggle-knob" />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )

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

      {/* Main Action Section (Positioned directly below Names to Check textarea, above Pipeline Config) */}
      <div className="panel-section action-panel-section sticky-top-actions">
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

      {/* Enabled Options Summary & Advanced Toggle */}
      <div className="panel-section summary-bar-section">
        <div className="enabled-summary-row">
          <div className="enabled-summary-title">
            <span>Pipeline Config</span>
          </div>
          <button
            className="btn-toggle-advanced"
            onClick={() => setShowAdvanced(s => !s)}
            type="button"
          >
            <span>{showAdvanced ? 'Hide Advanced' : 'Show Advanced'}</span>
            {showAdvanced ? <ChevronUpIcon size={14} /> : <ChevronDownIcon size={14} />}
          </button>
        </div>

        {/* Small Active Badges Preview */}
        <div className="active-options-preview">
          <div className="preview-chip-group">
            <span className="preview-group-label">TLDs:</span>
            {currentTlds.map(tld => (
              <span key={tld} className="preview-chip tld">
                {tld}
              </span>
            ))}
          </div>
          <div className="preview-chip-group">
            <span className="preview-group-label">Socials:</span>
            {activeSocials.length > 0 ? (
              activeSocials.map(p => (
                <span key={p.key} className="preview-chip social" style={{ borderColor: `${p.color}40`, color: p.color }}>
                  {getPlatformIcon(p.platform, 11)}
                  <span>{p.label}</span>
                </span>
              ))
            ) : (
              <span className="preview-chip-none">None</span>
            )}
          </div>
        </div>
      </div>

      {/* Advanced Settings Collapsible Drawer Content */}
      {showAdvanced && (
        <div className="advanced-settings-wrapper">
          <div className="panel-section">
            <div className="section-label">Stage 1: TLDs to Filter</div>
            <div className="tld-grid">
              {ALL_TLDS.map(({ tld }) => (
                <button
                  key={tld}
                  className={`tld-btn${currentTlds.includes(tld) ? ' selected' : ''}`}
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
        </div>
      )}

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
          pipelineStatus={state.status}
          fallbackNotice={state.fallbackNotice}
          stopMessage={state.stopMessage}
          filterAvailable={filterAvailable}
          onFilterChange={setFilter}
          onNewSearch={() => setToolViewMode('setup')}
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
              <div className="state-hint">
                <ShieldIcon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>
                  <strong>Authoritative Live DNS Active:</strong> Checks run instantly via Google &amp; Cloudflare DoH with ICANN RDAP verification. Zero API keys required.
                </span>
              </div>
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

  const handleLaunchToolWithPreset = (preset, initialInput) => {
    if (preset === 'domain') {
      updateSettings({
        tlds: ['.com', '.net', '.in', '.io', '.ai', '.co'],
        requireAllDomainsFree: true,
      })
    } else if (preset === 'social') {
      updateSettings({
        activeSocials: ['instagram', 'youtube', 'twitter', 'facebook'],
      })
    } else if (preset === 'trademark') {
      updateSettings({
        requireAllDomainsFree: true,
      })
    } else if (preset === 'business') {
      updateSettings({
        tlds: ['.com', '.net', '.io'],
        requireAllDomainsFree: true,
      })
    } else if (preset === 'generator') {
      if (!initialInput) {
        initialInput = `novara\nvelio\ntravio\ndelogen\ndaamgen`
      }
    }

    if (typeof initialInput === 'string' && initialInput.trim()) {
      setInput(initialInput)
      setToolViewMode('results')
      run(initialInput, settings.tlds, settings)
    } else {
      setToolViewMode('setup')
    }
    navigateTo('tool')
  }

  const handleLaunchTool = (initialInput) => {
    handleLaunchToolWithPreset('brand', initialInput)
  }

  return (
    <div className="app">

      {/* ── HEADER ── */}
      <header className="header">
        <div className="header-logo" onClick={() => navigateTo('landing')} style={{ cursor: 'pointer' }}>
          <div className="header-logo-mark">
            <BrandLogo size={24} />
          </div>
          <div>
            <div className="header-title">Brand Funnel</div>
            <div className="header-tagline">Sequential Domain → Social Availability</div>
          </div>
        </div>

        {/* Desktop Minimal Navigation Links */}
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
            onClick={() => handleLaunchTool()}
          >
            <ZapIcon size={13} style={{ display: 'inline', marginRight: 4 }} />
            Brand Checker
          </button>
          <button
            className={`nav-link-btn${currentPage === 'learn' ? ' active' : ''}`}
            onClick={() => navigateTo('learn')}
          >
            Learn Hub
          </button>
          <button
            className={`nav-link-btn${currentPage === 'methodology' ? ' active' : ''}`}
            onClick={() => navigateTo('methodology')}
          >
            Methodology
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
            <span className="pat-dot ok" />
            DNS Engine Live
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
            onLaunchTool={handleLaunchTool}
            onOpenGuide={() => navigateTo('guide')}
          />
        )}

        {currentPage === 'brand-name-checker' && (
          <BrandNameCheckerPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('brand', val)} />
        )}
        {currentPage === 'business-name-checker' && (
          <BusinessNameCheckerPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('business', val)} />
        )}
        {currentPage === 'domain-name-checker' && (
          <DomainNameCheckerPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('domain', val)} />
        )}
        {currentPage === 'trademark-checker' && (
          <TrademarkCheckerPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('trademark', val)} />
        )}
        {currentPage === 'social-handle-checker' && (
          <SocialHandleCheckerPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('social', val)} />
        )}
        {currentPage === 'brand-name-generator' && (
          <BrandNameGeneratorPage onNavigate={navigateTo} onLaunchTool={(val) => handleLaunchToolWithPreset('generator', val)} />
        )}
        {currentPage === 'methodology' && (
          <MethodologyPage onNavigate={navigateTo} onLaunchTool={handleLaunchTool} />
        )}
        {currentPage === 'learn' && (
          <LearnPage onNavigate={navigateTo} onLaunchTool={handleLaunchTool} />
        )}

        {currentPage === 'guide' && (
          <GuidePage
            onLaunchTool={handleLaunchTool}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}

        {currentPage === 'privacy' && (
          <PrivacyPage
            onLaunchTool={handleLaunchTool}
          />
        )}

        {currentPage === 'tool' && (
          <div className="tool-view-wrapper">
            {toolViewMode === 'setup' && state.status === 'idle' ? (
              centeredSetupPanel
            ) : (
              <>
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
              </>
            )}
          </div>
        )}
      </main>

      {/* ── GLOBAL SITE FOOTER (Rendered on non-tool content pages) ── */}
      {currentPage !== 'tool' && (
        <footer className="global-site-footer">
          <div className="footer-inner">
            <div className="footer-brand-col">
              <div className="footer-logo" onClick={() => navigateTo('landing')} style={{ cursor: 'pointer' }}>
                <BrandLogo size={20} />
                <span>Brand Funnel</span>
              </div>
              <p className="footer-tagline">
                Check, validate, and research candidate brand &amp; business names across domains, social media handles, and trademark signals before you build your brand.
              </p>
              <div className="footer-badge">
                <span className="pat-dot ok" />
                <span>Authoritative Live DoH DNS &amp; RDAP Active</span>
              </div>
            </div>

            <div className="footer-links-grid">
              <div className="footer-col">
                <div className="footer-col-title">Brand Tools</div>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('brand')}>Brand Name Checker</button>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('business')}>Business Name Checker</button>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('domain')}>Domain Name Checker</button>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('trademark')}>Trademark Research</button>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('social')}>Social Handle Checker</button>
                <button className="footer-link-btn" onClick={() => handleLaunchToolWithPreset('generator')}>Brand Name Generator</button>
              </div>

              <div className="footer-col">
                <div className="footer-col-title">Knowledge Hub</div>
                <button className="footer-link-btn" onClick={() => navigateTo('learn')}>Naming Knowledge Hub</button>
                <button className="footer-link-btn" onClick={() => navigateTo('methodology')}>Verification Methodology</button>
                <button className="footer-link-btn" onClick={() => navigateTo('guide')}>API &amp; Architecture Guide</button>
                <button className="footer-link-btn" onClick={() => navigateTo('privacy')}>Privacy &amp; Security</button>
              </div>

              <div className="footer-col">
                <div className="footer-col-title">Data Protocols</div>
                <div className="footer-static-item">Google &amp; Cloudflare DoH</div>
                <div className="footer-static-item">ICANN RDAP Registry</div>
                <div className="footer-static-item">Instagram Profile API</div>
                <div className="footer-static-item">YouTube Channel Handles</div>
                <div className="footer-static-item">Twitter / X Web Signals</div>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <span>© 2026 Brand Funnel. Zero Central Telemetry · 100% Client-Side Privacy.</span>
            <div className="footer-bottom-links">
              <button className="footer-mini-link" onClick={() => navigateTo('privacy')}>Privacy Policy</button>
              <button className="footer-mini-link" onClick={() => navigateTo('methodology')}>Methodology</button>
            </div>
          </div>
        </footer>
      )}

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
          onClick={() => {
            navigateTo('tool')
            setToolViewMode('setup')
          }}
        >
          <ZapIcon size={17} className="tab-btn-icon" />
          <span>Checker</span>
          {resultCount > 0 && (
            <span className="tab-badge">{aliveCount > 0 ? `${aliveCount}` : resultCount}</span>
          )}
        </button>
        <button
          className={`tab-btn${currentPage === 'learn' ? ' active' : ''}`}
          onClick={() => navigateTo('learn')}
        >
          <FileTextIcon size={17} className="tab-btn-icon" />
          <span>Learn</span>
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
