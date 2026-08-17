import { useState } from 'react'
import {
  GlobeIcon,
  InstagramIcon,
  YouTubeIcon,
  TwitterIcon,
  FacebookIcon,
  ZapIcon,
  CheckIcon,
  CpuIcon,
} from './Icons.jsx'

export function ArchitectureOrbit() {
  const [activeNode, setActiveNode] = useState(null)

  const nodes = [
    {
      id: 'godaddy',
      title: 'GoDaddy Registry',
      sub: 'Authoritative Domain & Pricing',
      status: 'Ready',
      icon: GlobeIcon,
      color: '#10B981',
      pos: 'node-top',
    },
    {
      id: 'instagram',
      title: 'Instagram Graph',
      sub: 'Web Profile User ID Detection',
      status: 'Active',
      icon: InstagramIcon,
      color: '#E1306C',
      pos: 'node-right-top',
    },
    {
      id: 'youtube',
      title: 'YouTube Channel',
      sub: 'Channel Handle Validation',
      status: 'Active',
      icon: YouTubeIcon,
      color: '#FF0000',
      pos: 'node-right-bottom',
    },
    {
      id: 'twitter',
      title: 'Twitter / X Engine',
      sub: 'Live Title Tag Resolution',
      status: 'Active',
      icon: TwitterIcon,
      color: '#1DA1F2',
      pos: 'node-bottom',
    },
    {
      id: 'doh',
      title: 'Authoritative DoH',
      sub: 'Google / Cloudflare DNS (0 Quota)',
      status: 'Instant',
      icon: CpuIcon,
      color: '#06B6D4',
      pos: 'node-left-bottom',
    },
    {
      id: 'facebook',
      title: 'Facebook Graph',
      sub: 'Direct Profile Verification',
      status: 'Connected',
      icon: FacebookIcon,
      color: '#1877F2',
      pos: 'node-left-top',
    },
  ]

  return (
    <div className="orbit-wrapper">
      {/* ── DESKTOP CIRCULAR ORBIT ── */}
      <div className="orbit-system-container desktop-orbit-only">
        <div className="orbit-core">
          <div className="core-pulse-ring ring-1" />
          <div className="core-pulse-ring ring-2" />
          <div className="core-pulse-ring ring-3" />
          <div className="core-center-badge">
            <ZapIcon size={24} className="core-zap" />
            <span className="core-text">CASCADE CORE</span>
            <span className="core-sub">5-Stage Engine</span>
          </div>
        </div>

        <div className="orbit-track track-1" />
        <div className="orbit-track track-2" />

        <div className="orbit-nodes-layer">
          {nodes.map((node) => {
            const IconComponent = node.icon
            const isSelected = activeNode === node.id

            return (
              <div
                key={node.id}
                className={`orbit-satellite-card ${node.pos} ${isSelected ? 'selected' : ''}`}
                onClick={() => setActiveNode(isSelected ? null : node.id)}
                style={{ '--node-color': node.color }}
              >
                <div className="sat-icon-wrap" style={{ color: node.color }}>
                  <IconComponent size={16} />
                </div>
                <div className="sat-info">
                  <div className="sat-title">{node.title}</div>
                  <div className="sat-sub">{node.sub}</div>
                </div>
                <div className="sat-status">
                  <CheckIcon size={10} style={{ display: 'inline', marginRight: 2 }} />
                  <span>{node.status}</span>
                </div>
              </div>
            )
          })}
        </div>

        <svg className="orbit-laser-svg" viewBox="0 0 600 400" preserveAspectRatio="none">
          <line x1="300" y1="200" x2="300" y2="40" className="laser-line" />
          <line x1="300" y1="200" x2="520" y2="100" className="laser-line" />
          <line x1="300" y1="200" x2="520" y2="300" className="laser-line" />
          <line x1="300" y1="200" x2="300" y2="360" className="laser-line" />
          <line x1="300" y1="200" x2="80" y2="300" className="laser-line" />
          <line x1="300" y1="200" x2="80" y2="100" className="laser-line" />
        </svg>
      </div>

      {/* ── MOBILE ADAPTIVE FLOW GRID (< 768px) ── */}
      <div className="mobile-architecture-grid">
        <div className="mobile-core-card">
          <div className="mobile-core-icon">
            <ZapIcon size={20} />
          </div>
          <div>
            <div className="mobile-core-title">Central Cascade Core</div>
            <div className="mobile-core-sub">Zero-Server Client-Side Mesh Engine</div>
          </div>
          <span className="mobile-core-tag">5 STAGES</span>
        </div>

        <div className="mobile-nodes-list">
          {nodes.map((node) => {
            const IconComponent = node.icon
            return (
              <div key={node.id} className="mobile-node-item" style={{ '--accent-c': node.color }}>
                <div className="mobile-node-icon" style={{ color: node.color, background: `${node.color}15`, borderColor: `${node.color}30` }}>
                  <IconComponent size={16} />
                </div>
                <div className="mobile-node-text">
                  <div className="mobile-node-title">{node.title}</div>
                  <div className="mobile-node-sub">{node.sub}</div>
                </div>
                <div className="mobile-node-badge">
                  <CheckIcon size={10} style={{ marginRight: 2 }} />
                  {node.status}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
