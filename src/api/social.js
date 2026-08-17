/**
 * Social platform username availability checker.
 *
 * All requests route through Vite proxy → server-side fetch → no CORS.
 *
 * Accurate detection methods:
 *   Instagram:
 *     GET /api/v1/users/web_profile_info/?username={username} with header `x-ig-app-id: 936619743392459`
 *     → 200 = taken (valid user profile JSON)
 *     → 404 = free (user does not exist)
 *
 *   YouTube:
 *     HEAD /@{username}
 *     → 200 = taken (channel exists)
 *     → 404 = free (channel does not exist)
 *
 *   Twitter/X:
 *     GET /{username}
 *     → title contains `(@username)` or `(@Username)` = taken
 *     → title contains `User Profile Not Found` or `404` or no profile title = free
 *
 *   Facebook:
 *     HEAD /{username}
 *     → Unreliable without Graph API access (flagged as unknown / limited accuracy)
 */

/**
 * Check Instagram username availability using web_profile_info API
 */
async function checkInstagramAPI(username) {
  const clean = username.toLowerCase().replace(/[^a-z0-9._]/g, '').replace(/^@/, '')
  if (!clean) return { platform: 'instagram', username: clean, status: 'invalid', reliable: false }

  try {
    const res = await fetch(`/api/instagram/api/v1/users/web_profile_info/?username=${encodeURIComponent(clean)}`, {
      method: 'GET',
      headers: {
        'x-ig-app-id': '936619743392459',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (res.status === 200) {
      const data = await res.json().catch(() => null)
      if (data?.data?.user) {
        return { platform: 'instagram', username: clean, status: 'taken', reliable: true }
      }
      return { platform: 'instagram', username: clean, status: 'taken', reliable: true }
    }

    if (res.status === 404) {
      return { platform: 'instagram', username: clean, status: 'free', reliable: true }
    }

    if (res.status === 429) {
      return { platform: 'instagram', username: clean, status: 'unknown', reliable: false }
    }

    return { platform: 'instagram', username: clean, status: 'unknown', reliable: false }
  } catch {
    return { platform: 'instagram', username: clean, status: 'error', reliable: false }
  }
}

/**
 * Check YouTube handle availability
 */
async function checkYouTubeHandle(username) {
  const clean = username.toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/^@/, '')
  if (!clean) return { platform: 'youtube', username: clean, status: 'invalid', reliable: false }

  try {
    const res = await fetch(`/api/youtube/@${encodeURIComponent(clean)}`, {
      method: 'HEAD',
      redirect: 'follow',
    })

    if (res.status === 200) return { platform: 'youtube', username: clean, status: 'taken', reliable: true }
    if (res.status === 404) return { platform: 'youtube', username: clean, status: 'free', reliable: true }

    return { platform: 'youtube', username: clean, status: 'unknown', reliable: false }
  } catch {
    return { platform: 'youtube', username: clean, status: 'error', reliable: false }
  }
}

/**
 * Check Twitter/X handle availability
 */
async function checkTwitterHandle(username) {
  const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '').replace(/^@/, '')
  if (!clean) return { platform: 'twitter', username: clean, status: 'invalid', reliable: false }

  try {
    const res = await fetch(`/api/twitter/${encodeURIComponent(clean)}`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (res.status === 404) {
      return { platform: 'twitter', username: clean, status: 'free', reliable: true }
    }

    if (res.ok) {
      const html = await res.text()
      // Check title for profile existence vs 404
      const is404 = html.includes('User Profile Not Found') || html.includes('404 Error') || html.includes('This account doesn’t exist')
      if (is404) {
        return { platform: 'twitter', username: clean, status: 'free', reliable: true }
      }

      const matchTitle = html.match(/<title>([^<]*)<\/title>/i)
      const title = matchTitle ? matchTitle[1] : ''
      const hasHandleInTitle = title.toLowerCase().includes(`(@${clean})`) || title.toLowerCase().includes(`@${clean}`)

      if (hasHandleInTitle) {
        return { platform: 'twitter', username: clean, status: 'taken', reliable: true }
      }

      // If page exists without explicit 404 and without handle in title, likely not a valid profile
      if (title === 'X' || title === '') {
        return { platform: 'twitter', username: clean, status: 'free', reliable: true }
      }

      return { platform: 'twitter', username: clean, status: 'taken', reliable: true }
    }

    return { platform: 'twitter', username: clean, status: 'unknown', reliable: false }
  } catch {
    return { platform: 'twitter', username: clean, status: 'error', reliable: false }
  }
}

/**
 * Check a single username on a single platform.
 * @param {'instagram'|'youtube'|'twitter'|'facebook'} platform
 * @param {string} username
 * @returns {Promise<SocialResult>}
 */
export async function checkSocial(platform, username) {
  if (platform === 'instagram') return checkInstagramAPI(username)
  if (platform === 'youtube')   return checkYouTubeHandle(username)
  if (platform === 'twitter')   return checkTwitterHandle(username)
  if (platform === 'facebook') {
    return { platform: 'facebook', username, status: 'unknown', reliable: false }
  }
  return { platform, username, status: 'unsupported', reliable: false }
}

/**
 * Batch-check multiple usernames across multiple platforms.
 * Uses interleaved concurrency to avoid hammering a single platform.
 *
 * @param {string[]} usernames
 * @param {string[]} platforms  e.g. ['instagram', 'youtube', 'twitter']
 * @param {(done: number, total: number) => void} onProgress
 * @returns {Promise<Map<string, Map<string, SocialResult>>>}
 *   Outer key: username, inner key: platform
 */
export async function checkSocialBatch(usernames, platforms, onProgress) {
  const results = new Map()
  for (const u of usernames) results.set(u, new Map())

  const tasks = []
  for (const username of usernames) {
    for (const platform of platforms) {
      tasks.push({ username, platform })
    }
  }

  const CONCURRENCY = 4
  const DELAY       = 250
  let done = 0

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY)

    const settled = await Promise.allSettled(
      batch.map(({ username, platform }) => checkSocial(platform, username))
    )

    settled.forEach((s, idx) => {
      const { username, platform } = batch[idx]
      const result = s.status === 'fulfilled'
        ? s.value
        : { platform, username, status: 'error', reliable: false }
      results.get(username).set(platform, result)
      done++
      onProgress?.(done, tasks.length)
    })

    if (i + CONCURRENCY < tasks.length) {
      await new Promise(r => setTimeout(r, DELAY))
    }
  }

  return results
}

/**
 * @typedef {Object} SocialResult
 * @property {string}  platform
 * @property {string}  username
 * @property {'taken'|'free'|'unknown'|'error'|'invalid'|'unsupported'} status
 * @property {boolean} reliable   - false = result may not be trustworthy
 */
