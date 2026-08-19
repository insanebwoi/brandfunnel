/**
 * useChecker — Sequential pipeline checker with smart resilience
 *
 * Workflow:
 *  1. Check ALL names against Authoritative Live DNS DoH domains
 *     • survivors = names with ≥1 available domain
 *     • 0 survivors → STOP immediately
 *  2. Check survivors on Instagram (using web_profile_info 404/200 detection)
 *     • survivors = names where Instagram handle is FREE
 *     • 0 survivors → STOP
 *  3. Check survivors on YouTube (@handle)
 *  4. Check survivors on Twitter (title profile existence check)
 *  5. Check survivors on Facebook
 */
import { useState, useCallback } from 'react'
import { checkDomainsBatch } from '../api/domain.js'
import { checkSocialBatch } from '../api/social.js'
import { SOCIAL_PLATFORMS } from './useSettings.js'
import { parseInput, buildCheckPlan } from './parserUtils.js'

export { parseInput, buildCheckPlan }

const PLATFORM_ORDER = ['instagram', 'youtube', 'twitter', 'facebook']
const PLATFORM_LABEL = {
  domain:    'Domains',
  instagram: 'Instagram',
  youtube:   'YouTube',
  twitter:   'Twitter / X',
  facebook:  'Facebook',
}

const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)

/** A name survives a social stage if its status is NOT definitively "taken" */
function isSurvivor(socialResult) {
  if (!socialResult) return true
  return socialResult.status !== 'taken'
}

export function useChecker() {
  const [state, setState] = useState(IDLE_STATE)

  const run = useCallback(async (rawInput, tlds, settings) => {
    const tokens = parseInput(rawInput)
    if (!tokens.length) {
      setState(s => ({ ...s, status: 'error', error: 'Enter at least one name to check.' }))
      return
    }

    const nameMap   = buildCheckPlan(tokens, tlds)
    const baseNames = [...nameMap.keys()]
    const allFqdns  = [...nameMap.values()].flatMap(v => v.fqdns)

    // Which social platforms are active
    const activePlatforms = PLATFORM_ORDER.filter(p => {
      const settingKey = `check${capitalize(p)}`
      return !!settings[settingKey]
    })

    // Pre-build stage descriptors
    const allStages = [
      { id: 'domain', label: 'Domains', status: 'pending', survivors: baseNames.length, total: baseNames.length },
      ...activePlatforms.map(p => ({ id: p, label: PLATFORM_LABEL[p], status: 'pending', survivors: null, total: null })),
    ]

    const nameData = {}
    for (const name of baseNames) {
      nameData[name] = {
        baseName:     name,
        domainCols:   {},
        social:       {},
        eliminatedAt: null,
      }
    }

    const buildRows = (survivors) => {
      const rows = baseNames.map(name => {
        const d = nameData[name]
        const availableTlds = Object.entries(d.domainCols)
          .filter(([, r]) => r?.ok && r?.available)
          .map(([tld]) => tld)
        return {
          id:           name,
          baseName:     name,
          domainCols:   { ...d.domainCols },
          social:       { ...d.social },
          availableTlds,
          hasAny:       availableTlds.length > 0,
          eliminatedAt: d.eliminatedAt,
          isAlive:      survivors.includes(name),
        }
      })

      const getInstaRank = (row) => {
        const st = row.social?.instagram?.status
        if (st === 'free') return 0       // Top priority: Instagram FREE
        if (st === 'unknown') return 1    // Second priority: Instagram UNCONFIRMED
        if (!st || st === 'pending') return 2
        return 3                          // Lowest priority: Instagram TAKEN
      }

      const stageRank = { domain: 0, instagram: 1, youtube: 2, twitter: 3, facebook: 4 }

      rows.sort((a, b) => {
        // 1. All-Clear survivors first
        if (a.isAlive && !b.isAlive) return -1
        if (!a.isAlive && b.isAlive) return 1

        // 2. Names with free domains first
        if (a.hasAny && !b.hasAny) return -1
        if (!a.hasAny && b.hasAny) return 1

        // 3. Priority to MOST free domains first (descending count: 4 TLDs > 3 TLDs > 2 TLDs > 1 TLD)
        const freeTldDiff = (b.availableTlds?.length || 0) - (a.availableTlds?.length || 0)
        if (freeTldDiff !== 0) return freeTldDiff

        // 4. Instagram availability priority (Free > Unconfirmed > Pending > Taken)
        const instaA = getInstaRank(a)
        const instaB = getInstaRank(b)
        if (instaA !== instaB) return instaA - instaB

        // 5. Later stage elimination priority
        if (!a.isAlive && !b.isAlive) {
          const ra = stageRank[a.eliminatedAt] ?? 99
          const rb = stageRank[b.eliminatedAt] ?? 99
          if (ra !== rb) return ra - rb
        }

        // 6. Alphabetical tie-breaker
        return a.baseName.localeCompare(b.baseName)
      })
      return rows
    }

    const updateStage = (stages, id, patch) =>
      stages.map(s => s.id === id ? { ...s, ...patch } : s)

    // ════════════════════════════════════════════════════════
    // STAGE 1 — DOMAIN CHECK (Authoritative Live DNS)
    // ════════════════════════════════════════════════════════
    let stages = updateStage(allStages, 'domain', { status: 'running' })

    setState({
      status:        'running',
      currentStage:  'domain',
      progress:      0,
      progressLabel: `Checking ${allFqdns.length} domain${allFqdns.length > 1 ? 's' : ''}…`,
      stages,
      rows:          [],
      stopMessage:   null,
      fallbackNotice: null,
      error:         null,
      authError:     false,
    })

    let domainResults
    try {
      domainResults = await checkDomainsBatch(allFqdns, (done) => {
        setState(s => ({
          ...s,
          progress:     Math.round((done / allFqdns.length) * 100),
          progressLabel:`Domains: ${done} / ${allFqdns.length}`,
        }))
      })
    } catch {
      domainResults = new Map()
    }

    const fallbackNotice = '⚡ Verified using Authoritative Live DNS (Google & Cloudflare DoH + ICANN RDAP)'

    // Populate domain data
    for (const [baseName, plan] of nameMap) {
      for (const fqdn of plan.fqdns) {
        const tld = fqdn.slice(baseName.length)
        nameData[baseName].domainCols[tld] = domainResults.get(fqdn) || { ok: true, available: false, fqdn }
      }
    }

    // Find domain survivors (Require ALL selected TLDs free if requireAllDomainsFree is true)
    const requireAll = settings?.requireAllDomainsFree !== false
    let survivors = baseNames.filter(name => {
      const cols = Object.values(nameData[name].domainCols)
      if (!cols.length) return false
      return requireAll
        ? cols.every(r => r?.ok && r?.available)
        : cols.some(r => r?.ok && r?.available)
    })

    // Mark domain failures
    for (const name of baseNames) {
      if (!survivors.includes(name)) nameData[name].eliminatedAt = 'domain'
    }

    stages = updateStage(stages, 'domain', {
      status:    survivors.length === 0 ? 'stopped' : 'done',
      survivors: survivors.length,
    })

    if (survivors.length === 0) {
      const stopMsg = requireAll
        ? `No candidate names have ALL selected domain TLDs free. Pruned downstream social checks.`
        : `All ${baseNames.length} domain name${baseNames.length > 1 ? 's are' : ' is'} taken across selected TLDs. Nothing to check on social platforms.`

      setState(s => ({
        ...s,
        status:        'stopped',
        currentStage:  'domain',
        progress:      100,
        stages,
        rows:          buildRows(survivors),
        fallbackNotice,
        stopMessage:   stopMsg,
      }))
      return
    }

    // ════════════════════════════════════════════════════════
    // STAGES 2–5 — SOCIAL CHECKS (sequential)
    // ════════════════════════════════════════════════════════
    for (const platform of activePlatforms) {
      if (survivors.length === 0) break

      const label = PLATFORM_LABEL[platform]
      stages = updateStage(stages, platform, { status: 'running', total: survivors.length })

      setState(s => ({
        ...s,
        currentStage:  platform,
        progress:      0,
        progressLabel: `${label}: checking ${survivors.length} name${survivors.length > 1 ? 's' : ''}…`,
        stages,
        rows:          buildRows(survivors),
        fallbackNotice,
      }))

      let platformResults
      try {
        platformResults = await checkSocialBatch(survivors, [platform], (done) => {
          setState(s => ({
            ...s,
            progress:     Math.round((done / survivors.length) * 100),
            progressLabel:`${label}: ${done} / ${survivors.length}`,
          }))
        })
      } catch {
        platformResults = new Map(
          survivors.map(u => [u, new Map([[platform, { platform, username: u, status: 'unknown', reliable: false }]])])
        )
      }

      for (const name of survivors) {
        const r = platformResults.get(name)?.get(platform)
        if (r) nameData[name].social[platform] = r
      }

      const newSurvivors = survivors.filter(name => isSurvivor(nameData[name].social[platform]))

      for (const name of survivors) {
        if (!newSurvivors.includes(name) && !nameData[name].eliminatedAt) {
          nameData[name].eliminatedAt = platform
        }
      }

      const stopped = newSurvivors.length === 0
      stages = updateStage(stages, platform, {
        status:    stopped ? 'stopped' : 'done',
        survivors: newSurvivors.length,
      })

      survivors = newSurvivors

      if (stopped) {
        setState(s => ({
          ...s,
          status:        'stopped',
          currentStage:  platform,
          progress:      100,
          stages,
          rows:          buildRows(survivors),
          fallbackNotice,
          stopMessage:   `All names are taken on ${label}. Showing results up to this stage.`,
        }))
        return
      }
    }

    // ════════════════════════════════════════════════════════
    // ALL STAGES DONE
    // ════════════════════════════════════════════════════════
    setState(s => ({
      ...s,
      status:        'done',
      currentStage:  null,
      progress:      100,
      progressLabel: `Complete — ${survivors.length} name${survivors.length !== 1 ? 's' : ''} passed all checks`,
      stages,
      rows:          buildRows(survivors),
      fallbackNotice,
      stopMessage:   null,
    }))
  }, [])

  const reset = useCallback(() => setState(IDLE_STATE), [])

  return { state, run, reset }
}

const IDLE_STATE = {
  status:        'idle',
  currentStage:  null,
  progress:      0,
  progressLabel: '',
  stages:        [],
  rows:          [],
  fallbackNotice: null,
  stopMessage:   null,
  error:         null,
  authError:     false,
}
