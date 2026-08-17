/**
 * Domain Availability Engine — Authoritative Live DNS
 *
 * Uses Google & Cloudflare DNS-over-HTTPS (DoH) + ICANN RDAP
 * Zero API keys, zero rate limits, zero server dependencies.
 */

/**
 * Check domain via Google / Cloudflare DNS-over-HTTPS & ICANN RDAP
 * @param {string} fqdn
 * @returns {Promise<{fqdn: string, available: boolean, definitive: boolean, price: null, renewalPrice: null, currency: string, source: string}>}
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

  // Default fallback if unconfirmed
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
 * @param {string} fqdn
 * @returns {Promise<DomainResult>}
 */
export async function checkDomain(fqdn) {
  return checkDomainViaDNS(fqdn)
}

/**
 * Batch-check multiple domains with concurrency control.
 *
 * @param {string[]} fqdns
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<Map<string, DomainResult>>}
 */
export async function checkDomainsBatch(fqdns, onProgress) {
  const CONCURRENCY = 6
  const DELAY       = 100

  const results = new Map()
  let done = 0

  for (let i = 0; i < fqdns.length; i += CONCURRENCY) {
    const batch = fqdns.slice(i, i + CONCURRENCY)

    const settled = await Promise.allSettled(
      batch.map(fqdn => checkDomain(fqdn))
    )

    settled.forEach((s, idx) => {
      const fqdn = batch[idx]
      if (s.status === 'fulfilled') {
        results.set(fqdn, { ok: true, ...s.value })
      } else {
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

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}
