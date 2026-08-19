/**
 * Domain Availability Engine — Ultra-Fast Authoritative Live DNS
 *
 * Uses parallel Google & Cloudflare DNS-over-HTTPS (DoH) racing + ICANN RDAP
 * Zero API keys, zero rate limits, zero server dependencies.
 */

const dnsCache = new Map()

async function fetchGoogleDoH(clean, signal) {
  const res = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(clean)}&type=NS`, {
    headers: { 'Accept': 'application/json' },
    signal,
  })
  if (!res.ok) throw new Error('Google DoH failed')
  const data = await res.json()
  if (data.Status === 3) {
    return { fqdn: clean, available: true, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'dns' }
  }
  if (data.Status === 0 && (data.Answer?.length > 0 || data.Authority?.length > 0)) {
    return { fqdn: clean, available: false, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'dns' }
  }
  throw new Error('Inconclusive Google DoH')
}

async function fetchCloudflareDoH(clean, signal) {
  const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(clean)}&type=NS`, {
    headers: { 'Accept': 'application/dns-json' },
    signal,
  })
  if (!res.ok) throw new Error('Cloudflare DoH failed')
  const data = await res.json()
  if (data.Status === 3) {
    return { fqdn: clean, available: true, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'dns' }
  }
  if (data.Status === 0) {
    return { fqdn: clean, available: false, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'dns' }
  }
  throw new Error('Inconclusive Cloudflare DoH')
}

/**
 * Check domain via Google / Cloudflare DNS-over-HTTPS in parallel (fastest wins) & ICANN RDAP fallback
 * @param {string} fqdn
 * @returns {Promise<{fqdn: string, available: boolean, definitive: boolean, price: null, renewalPrice: null, currency: string, source: string}>}
 */
export async function checkDomainViaDNS(fqdn) {
  const clean = fqdn.toLowerCase().trim()
  if (dnsCache.has(clean)) {
    return dnsCache.get(clean)
  }

  // 1. Race Google & Cloudflare DoH concurrently for sub-100ms response
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 2000)

    const fastResult = await Promise.any([
      fetchGoogleDoH(clean, controller.signal),
      fetchCloudflareDoH(clean, controller.signal),
    ])
    clearTimeout(timeoutId)
    dnsCache.set(clean, fastResult)
    return fastResult
  } catch {
    // Both parallel DoH failed or timed out, continue to fallback
  }

  // 2. Sequential fallback to Google DNS then Cloudflare DNS
  try {
    const result = await fetchGoogleDoH(clean)
    dnsCache.set(clean, result)
    return result
  } catch {}

  try {
    const result = await fetchCloudflareDoH(clean)
    dnsCache.set(clean, result)
    return result
  } catch {}

  // 3. Backup: ICANN RDAP
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(clean)}`, {
      method: 'HEAD',
    })
    if (res.status === 404) {
      const result = { fqdn: clean, available: true, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'rdap' }
      dnsCache.set(clean, result)
      return result
    }
    if (res.status === 200) {
      const result = { fqdn: clean, available: false, definitive: true, price: null, renewalPrice: null, currency: 'USD', source: 'rdap' }
      dnsCache.set(clean, result)
      return result
    }
  } catch {}

  // Default fallback if unconfirmed
  const fallback = {
    fqdn: clean,
    available: true,
    definitive: false,
    price: null,
    renewalPrice: null,
    currency: 'USD',
    source: 'dns',
  }
  dnsCache.set(clean, fallback)
  return fallback
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
 * Batch-check multiple domains with high concurrency control (16 parallel workers).
 *
 * @param {string[]} fqdns
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<Map<string, DomainResult>>}
 */
export async function checkDomainsBatch(fqdns, onProgress) {
  const CONCURRENCY = 16
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
    })

    onProgress?.(done, fqdns.length)
    if (i + CONCURRENCY < fqdns.length) {
      await new Promise(r => setTimeout(r, 10))
    }
  }

  return results
}

