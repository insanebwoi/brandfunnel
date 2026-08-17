import { useState } from 'react'
import {
  CrossIcon,
  EyeIcon,
  EyeOffIcon,
  SunIcon,
  MoonIcon,
  AutoThemeIcon,
  KeyIcon,
  ShieldIcon,
  ExternalLinkIcon,
} from './Icons.jsx'

const THEMES = [
  { key: 'auto',  icon: AutoThemeIcon, label: 'Auto' },
  { key: 'light', icon: SunIcon,       label: 'Light' },
  { key: 'dark',  icon: MoonIcon,      label: 'Dark' },
]

export default function SettingsDrawer({ settings, onSave, onClose }) {
  const [pat,  setPat]  = useState(settings.pat)
  const [show, setShow] = useState(false)

  function handleSave() {
    onSave({ pat: pat.trim() })
    onClose()
  }

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Settings">

        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <KeyIcon size={16} />
            <h2 className="drawer-title">Configuration &amp; Keys</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close settings">
            <CrossIcon size={14} />
          </button>
        </div>

        <div className="drawer-body">

          {/* ── GoDaddy PAT ── */}
          <div>
            <div className="field-label">GODADDY PERSONAL ACCESS TOKEN (PAT)</div>
            <div className="pat-wrap">
              <input
                id="pat-input"
                className="pat-input"
                type={show ? 'text' : 'password'}
                value={pat}
                onChange={e => setPat(e.target.value)}
                placeholder="gd_pat_…"
                autoComplete="off"
                spellCheck={false}
              />
              <button
                className="pat-eye"
                onClick={() => setShow(s => !s)}
                aria-label="Toggle token visibility"
              >
                {show ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
              </button>
            </div>
            <div className="field-hint">
              Stored locally in your browser only. Used for official GoDaddy v3 registry search and pricing.
            </div>
          </div>

          {/* ── How to get PAT ── */}
          <div className="info-box">
            <strong>How to get a free GoDaddy PAT:</strong><br />
            1. Go to{' '}
            <a href="https://developer.godaddy.com/keys" target="_blank" rel="noopener noreferrer">
              developer.godaddy.com/keys <ExternalLinkIcon size={10} style={{ display: 'inline' }} />
            </a><br />
            2. Create a key with scope <code>domains.domain:read</code><br />
            3. Paste the generated token above.
          </div>

          {/* ── Theme Selector ── */}
          <div>
            <div className="field-label">APPEARANCE MODE</div>
            <div className="theme-selector">
              {THEMES.map(t => {
                const IconComp = t.icon
                return (
                  <button
                    key={t.key}
                    className={`theme-opt${settings.theme === t.key ? ' active' : ''}`}
                    onClick={() => onSave({ theme: t.key })}
                  >
                    <IconComp size={18} className="theme-opt-icon" />
                    <span>{t.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="field-hint">
              Auto automatically mirrors your operating system preference.
            </div>
          </div>

          {/* ── Zero-Storage Architecture Note ── */}
          <div style={{ padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--text)', fontWeight: 600 }}>
              <ShieldIcon size={13} style={{ color: 'var(--avail)' }} />
              <span>Zero-Storage Privacy Architecture</span>
            </div>
            All network calls forward directly to official APIs with no cloud telemetry or keyword tracking. If your token is rate limited (429), the engine automatically falls back to Authoritative DNS-over-HTTPS.
          </div>

        </div>

        <div className="drawer-footer">
          <button className="btn-save" onClick={handleSave}>
            Save Configuration
          </button>
        </div>

      </aside>
    </>
  )
}
