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
 * Check Instagram username availability using web_profile_info API + HTML fallback
 */
async function checkInstagramAPI(username) {
  const clean = username.toLowerCase().replace(/[^a-z0-9._]/g, '').replace(/^@/, '')
  if (!clean) return { platform: 'instagram', username: clean, status: 'invalid', reliable: false }

  // 1. Try web_profile_info endpoint with mandatory AJAX headers
  try {
    const res = await fetch(`/api/instagram/api/v1/users/web_profile_info/?username=${encodeURIComponent(clean)}`, {
      method: 'GET',
      headers: {
        'x-ig-app-id': '936619743392459',
        'x-requested-with': 'XMLHttpRequest',
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
  } catch {}

  // 2. Fallback: Direct HTML profile page check
  try {
    const res = await fetch(`/api/instagram/${encodeURIComponent(clean)}/`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,*/*',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    })

    if (res.status === 404) {
      return { platform: 'instagram', username: clean, status: 'free', reliable: true }
    }

    if (res.ok) {
      const html = await res.text()
      const is404 = html.includes('Page Not Found') ||
                    html.includes("Sorry, this page isn't available") ||
                    html.includes('The link you followed may be broken')
      if (is404) {
        return { platform: 'instagram', username: clean, status: 'free', reliable: true }
      }

      const hasUserMeta = html.includes(`@${clean}`) ||
                          html.includes(`instagram.com/${clean}`) ||
                          html.includes('og:title')
      if (hasUserMeta) {
        return { platform: 'instagram', username: clean, status: 'taken', reliable: true }
      }
    }
  } catch {}

  return { platform: 'instagram', username: clean, status: 'unknown', reliable: false }
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

const socialCache = new Map()

/**
 * Check a single username on a single platform.
 * @param {'instagram'|'youtube'|'twitter'|'facebook'} platform
 * @param {string} username
 * @returns {Promise<SocialResult>}
 */
export async function checkSocial(platform, username) {
  const cacheKey = `${platform}:${username.toLowerCase()}`
  if (socialCache.has(cacheKey)) {
    return socialCache.get(cacheKey)
  }

  let result
  if (platform === 'instagram') result = await checkInstagramAPI(username)
  else if (platform === 'youtube') result = await checkYouTubeHandle(username)
  else if (platform === 'twitter') result = await checkTwitterHandle(username)
  else if (platform === 'facebook') {
    result = { platform: 'facebook', username, status: 'unknown', reliable: false }
  } else {
    result = { platform, username, status: 'unsupported', reliable: false }
  }

  if (result && result.status !== 'error') {
    socialCache.set(cacheKey, result)
  }
  return result
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

  const CONCURRENCY = 10
  const DELAY       = 30
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
