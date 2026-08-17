/**
 * Domain Availability Engine
 *
 * Primary: GoDaddy v3 API (authoritative pricing + registry status)
 * Fallback: Authoritative DNS-over-HTTPS (Google & Cloudflare DoH) + ICANN RDAP
 *
 * Why this is resilient:
 *  - If GoDaddy PAT is valid: Uses real-time GoDaddy registry check + pricing.
 *  - If GoDaddy PAT is rate limited (429), expired, or omitted:
 *    Automatically falls back to DoH (Status 3 NXDOMAIN = Free, Status 0 = Taken)
 *    so the user is NEVER blocked by API errors.
 */

const BASE = '/api/godaddy'

/**
 * Check domain via Google / Cloudflare DNS-over-HTTPS
 * @param {string} fqdn
 * @returns {Promise<DomainResult>}
 */
export async function checkDomainViaDNS(fqdn) {
  const clean = fqdn.toLowerCase().trim()

  try {
    // 1. Primary DoH: Google DNS (Check NS record)
    const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=NS`, {
      headers: { 'Accept': 'application/json' },
    })

    if (res.ok) {
      const data = await res.json()
      // Status 3 = NXDOMAIN (Domain does not exist -> Free!)
      if (data.Status === 3) {
        return {
          fqdn: clean,
          available: true,
          definitive: true,
          price: null,
          renewalPrice: null,
          currency: 'USD',
          source: 'dns',
        }
      }

      // Status 0 = NOERROR (Domain has DNS records -> Taken!)
      if (data.Status === 0 && (data.Answer?.length > 0 || data.Authority?.length > 0)) {
        return {
          fqdn: clean,
          available: false,
          definitive: true,
          price: null,
          renewalPrice: null,
          currency: 'USD',
          source: 'dns',
        }
      }
    }
  } catch {
    // Continue to fallback
  }

  try {
    // 2. Backup DoH: Cloudflare DNS
    const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(clean)}&type=NS`, {
      headers: { 'Accept': 'application/dns-json' },
    })

    if (res.ok) {
      const data = await res.json()
      if (data.Status === 3) {
        return {
          fqdn: clean,
          available: true,
          definitive: true,
          price: null,
          renewalPrice: null,
          currency: 'USD',
          source: 'dns',
        }
      }
      if (data.Status === 0) {
        return {
          fqdn: clean,
          available: false,
          definitive: true,
          price: null,
          renewalPrice: null,
          currency: 'USD',
          source: 'dns',
        }
      }
    }
  } catch {
    // Continue to RDAP
  }

  try {
    // 3. Backup: ICANN RDAP
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`, {
      method: 'HEAD',
    })
    if (res.status === 404) {
      return { fqdn: clean, available: true, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'rdap' }
    }
    if (res.status === 200) {
      return { fqdn: clean, available: false, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'rdap' }
    }
  } catch {
    // If all fail
  }

  // Default: if unable to find records, treat as unconfirmed free
  return {
    fqdn: clean,
    available: true,
    definitive: false,
    price: null,
    renewalPrice: null,
    currency: 'USD',
    source: 'dns',
  }
}

/**
 * Check availability of a single domain.
 * Attempts GoDaddy v3 API; seamlessly falls back to DNS on 429/401/network errors.
 *
 * @param {string} fqdn
 * @param {string} pat
 * @returns {Promise<DomainResult>}
 */
export async function checkDomain(fqdn, pat) {
  const clean = fqdn.toLowerCase().trim()

  // If no PAT provided, directly use authoritative DNS check
  if (!pat?.trim()) {
    return checkDomainViaDNS(clean)
  }

  try {
    const url = `${BASE}/v3/domains/check-availability?domain=${encodeURIComponent(clean)}`
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pat.trim()}`,
        Accept: 'application/json',
      },
    })

    if (res.status === 200) {
      const data = await res.json()
      return {
        fqdn:         data.domain || clean,
        available:    Boolean(data.available),
        definitive:   Boolean(data.definitive),
        price:        extractPrice(data.prices, 1),
        renewalPrice: extractRenewalPrice(data.prices, 1),
        currency:     extractCurrency(data.prices),
        source:       'godaddy',
        raw:          data,
      }
    }

    // If rate limited (429) or token issue (401/403) or 5xx error -> Fallback to DNS!
    if (res.status === 429 || res.status === 401 || res.status === 403 || res.status >= 500) {
      const fallbackResult = await checkDomainViaDNS(clean)
      return {
        ...fallbackResult,
        fallbackUsed: true,
        fallbackReason: res.status === 429 ? 'GoDaddy Rate Limited (429)' : `GoDaddy HTTP ${res.status}`,
      }
    }

    // Other errors
    return checkDomainViaDNS(clean)
  } catch (err) {
    // Network / CORS / Proxy failure -> Use DNS fallback
    const fallbackResult = await checkDomainViaDNS(clean)
    return {
      ...fallbackResult,
      fallbackUsed: true,
      fallbackReason: 'Network fallback',
    }
  }
}

/**
 * Batch-check multiple domains with concurrency control.
 *
 * @param {string[]} fqdns
 * @param {string} pat
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<Map<string, DomainResult>>}
 */
export async function checkDomainsBatch(fqdns, pat, onProgress) {
  const CONCURRENCY = 6
  const DELAY       = 150

  const results = new Map()
  let done = 0

  for (let i = 0; i < fqdns.length; i += CONCURRENCY) {
    const batch = fqdns.slice(i, i + CONCURRENCY)

    const settled = await Promise.allSettled(
      batch.map(fqdn => checkDomain(fqdn, pat))
    )

    settled.forEach((s, idx) => {
      const fqdn = batch[idx]
      if (s.status === 'fulfilled') {
        results.set(fqdn, { ok: true, ...s.value })
      } else {
        // Even if catastrophic failure, fall back to basic domain object
        results.set(fqdn, {
          ok: true,
          fqdn,
          available: false,
          definitive: false,
          price: null,
          renewalPrice: null,
          currency: 'USD',
          source: 'dns',
        })
      }
      done++
      onProgress?.(done, fqdns.length)
    })

    if (i + CONCURRENCY < fqdns.length) {
      await sleep(DELAY)
    }
  }

  return results
}

// ── Helpers ──────────────────────────────────────────────────

function extractPrice(prices, period = 1) {
  const entry = prices?.find(p => p.period === period)
  return entry ? entry.price.value / 100 : null
}

function extractRenewalPrice(prices, period = 1) {
  const entry = prices?.find(p => p.period === period)
  return entry ? entry.renewalPrice.value / 100 : null
}

function extractCurrency(prices) {
  return prices?.[0]?.price?.currencyCode ?? 'USD'
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

export class GodaddyError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
    this.name = 'GodaddyError'
  }
}
