import {
  CrossIcon,
  SunIcon,
  MoonIcon,
  AutoThemeIcon,
  SettingsIcon,
  ShieldIcon,
} from './Icons.jsx'

const THEMES = [
  { key: 'auto',  icon: AutoThemeIcon, label: 'Auto' },
  { key: 'light', icon: SunIcon,       label: 'Light' },
  { key: 'dark',  icon: MoonIcon,      label: 'Dark' },
]

export default function SettingsDrawer({ settings, onSave, onClose }) {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-label="Settings">

        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SettingsIcon size={16} />
            <h2 className="drawer-title">Application Settings</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close settings">
            <CrossIcon size={14} />
          </button>
        </div>

        <div className="drawer-body">

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
          <div style={{ padding: '12px 14px', background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, color: 'var(--text)', fontWeight: 600 }}>
              <ShieldIcon size={13} style={{ color: 'var(--avail)' }} />
              <span>Zero-Storage Privacy Architecture</span>
            </div>
            Domain availability checks use Authoritative DNS-over-HTTPS (Google &amp; Cloudflare DoH) and ICANN RDAP directly from your browser. Zero API keys, zero user tracking, and zero keyword logging.
          </div>

        </div>

        <div className="drawer-footer">
          <button className="btn-save" onClick={onClose}>
            Done
          </button>
        </div>

      </aside>
    </>
  )
}
