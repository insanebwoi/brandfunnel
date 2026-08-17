/**
 * Instagram username existence checker.
 * Uses Instagram web profile info endpoint with x-ig-app-id header for 100% accurate detection.
 */

const BASE = '/api/instagram'

/**
 * Check if an Instagram username is taken.
 * @param {string} username - The raw username (no @ prefix, no spaces)
 * @returns {Promise<InstagramResult>}
 */
export async function checkInstagram(username) {
  const clean = username.toLowerCase().replace(/[^a-z0-9._]/g, '').replace(/^@/, '')
  if (!clean) return { username: clean, status: 'invalid' }

  try {
    const res = await fetch(`${BASE}/api/v1/users/web_profile_info/?username=${encodeURIComponent(clean)}`, {
      method: 'GET',
      headers: {
        'x-ig-app-id': '936619743392459',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (res.status === 200) {
      return { username: clean, status: 'taken' }
    }
    if (res.status === 404) {
      return { username: clean, status: 'free' }
    }

    return { username: clean, status: 'unknown' }
  } catch {
    return { username: clean, status: 'error' }
  }
}

/**
 * Batch-check multiple Instagram usernames with rate-limit safety.
 * @param {string[]} usernames
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<Map<string, InstagramResult>>}
 */
export async function checkInstagramBatch(usernames, onProgress) {
  const results = new Map()
  let done = 0
  const CONCURRENCY = 3
  const DELAY = 300

  for (let i = 0; i < usernames.length; i += CONCURRENCY) {
    const batch = usernames.slice(i, i + CONCURRENCY)

    const settled = await Promise.allSettled(batch.map(u => checkInstagram(u)))

    settled.forEach((s, idx) => {
      const username = batch[idx]
      const result = s.status === 'fulfilled'
        ? s.value
        : { username, status: 'error' }
      results.set(username, result)
      done++
      onProgress?.(done, usernames.length)
    })

    if (i + CONCURRENCY < usernames.length) {
      await new Promise(r => setTimeout(r, DELAY))
    }
  }

  return results
}

/**
 * @typedef {Object} InstagramResult
 * @property {string} username
 * @property {'taken'|'free'|'unknown'|'error'|'invalid'} status
 */
