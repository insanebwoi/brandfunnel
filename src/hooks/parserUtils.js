/**
 * Parser utilities for domain checker.
 */

/** Parse textarea input → clean, deduped list of tokens */
export function parseInput(raw) {
  return [...new Set(
    raw
      .split(/[\n,]+/)
      .map(s => {
        let clean = s.trim().toLowerCase()
        if (clean.startsWith('#')) return ''
        clean = clean
          .replace(/^https?:\/\/(?:www\.)?/, '')
          .replace(/\/$/, '')
          .replace(/\s+/g, '') // remove spaces inside tokens (e.g. "names to check" -> "namestocheck")
          .replace(/[^a-z0-9._-]/g, '') // keep valid handle/domain chars
        return clean
      })
      .filter(s => s.length >= 2 && /^[a-z0-9]/.test(s))
  )]
}

/** Build domain check plan from tokens + TLD list */
export function buildCheckPlan(tokens, tlds) {
  const nameMap = new Map()

  for (const token of tokens) {
    if (token.includes('.') && !token.startsWith('.')) {
      const dot  = token.indexOf('.')
      const base = token.slice(0, dot)
      const tld  = token.slice(dot)
      if (!nameMap.has(base)) nameMap.set(base, { fqdns: [], tlds: [], explicit: true })
      nameMap.get(base).fqdns.push(token)
      nameMap.get(base).tlds.push(tld)
    } else {
      if (!nameMap.has(token)) nameMap.set(token, { fqdns: [], tlds: [...tlds], explicit: false })
      for (const tld of tlds) {
        nameMap.get(token).fqdns.push(`${token}${tld}`)
      }
    }
  }

  return nameMap
}

