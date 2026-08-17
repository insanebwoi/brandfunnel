import { useState, useCallback } from 'react'

const STORAGE_KEY = 'brandchecker_settings_v2'

const DEFAULTS = {
  pat:            '',
  tlds:           ['.com', '.net', '.in', '.io'],
  // Social platforms
  checkInstagram: true,
  checkYoutube:   true,
  checkTwitter:   true,
  checkFacebook:  false,
  // Appearance
  theme:          'auto',   // 'auto' | 'light' | 'dark'
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULTS }
  }
}

function persist(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

export function useSettings() {
  const [settings, setState] = useState(load)

  const updateSettings = useCallback((patch) => {
    setState(prev => {
      const next = { ...prev, ...patch }
      persist(next)
      return next
    })
  }, [])

  return { settings, updateSettings }
}

export const ALL_TLDS = [
  { tld: '.com',  popular: true  },
  { tld: '.net',  popular: true  },
  { tld: '.in',   popular: true  },
  { tld: '.io',   popular: true  },
  { tld: '.co',   popular: false },
  { tld: '.app',  popular: false },
  { tld: '.dev',  popular: false },
  { tld: '.ai',   popular: false },
  { tld: '.info', popular: false },
  { tld: '.org',  popular: false },
]

export const SOCIAL_PLATFORMS = [
  { key: 'checkInstagram', platform: 'instagram', label: 'Instagram', color: '#E1306C', reliable: true  },
  { key: 'checkYoutube',   platform: 'youtube',   label: 'YouTube',   color: '#FF0000', reliable: true  },
  { key: 'checkTwitter',   platform: 'twitter',   label: 'Twitter / X', color: '#1DA1F2', reliable: true  },
  { key: 'checkFacebook',  platform: 'facebook',  label: 'Facebook',  color: '#1877F2', reliable: false },
]
