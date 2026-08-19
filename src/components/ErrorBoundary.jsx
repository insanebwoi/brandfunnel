import React from 'react'
import { AlertCircleIcon, RefreshIcon } from './Icons.jsx'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught error:', error, errorInfo)
  }

  handleReset = () => {
    try {
      localStorage.removeItem('brandchecker_settings_v2')
    } catch {}
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrap">
          <div className="error-boundary-card">
            <AlertCircleIcon size={36} style={{ color: 'var(--taken)', marginBottom: 12 }} />
            <h2 className="error-boundary-title">Application State Notice</h2>
            <p className="error-boundary-sub">
              An unexpected display state occurred. Click below to reset configuration settings and restore the workspace.
            </p>
            <div className="error-boundary-msg">
              {this.state.error?.toString() || 'Unknown UI Error'}
            </div>
            <button className="btn-boundary-reset" onClick={this.handleReset}>
              <RefreshIcon size={14} />
              <span>Reset Settings &amp; Recover</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
