import { useEffect } from 'react'

const PAGE_SEO_METADATA = {
  landing: {
    title: 'Brand Name Checker — Check & Validate Business Names | Brand Funnel',
    description: 'Check business and brand names before you launch. Research availability, domains, trademarks, social handles, similarity and brandability in one powerful brand-checking tool.',
    keywords: 'brand name checker, business name checker, domain availability, trademark research, social media handle checker, name generator',
    canonical: 'https://brandfunnel.mopgen.in/',
    schema: {
      '@type': 'WebSite',
      'name': 'Brand Funnel',
      'description': 'Precision Brand & Business Name Checker Engine',
    },
  },
  tool: {
    title: 'Brand Checker Funnel Workspace — Live Domain & Social Verification | Brand Funnel',
    description: 'Cascading sequential brand verification workspace. Filter candidate names across .com, .net, .io, .ai domains and Instagram, YouTube, Twitter handles in real-time.',
    keywords: 'brand funnel workspace, domain check tool, live dns verification, sequential handle check',
    canonical: 'https://brandfunnel.mopgen.in/#tool',
  },
  'brand-name-checker': {
    title: 'Brand Name Checker — Verify Brand Name Availability & Signals | Brand Funnel',
    description: 'Check candidate brand names across domain registries, social handles, trademark signals, and phonetic brandability scores before launching.',
    keywords: 'brand name checker, brand availability, brand signals, trademark check, check brand name',
    canonical: 'https://brandfunnel.mopgen.in/#brand-name-checker',
  },
  'business-name-checker': {
    title: 'Business Name Checker — Search Business & Company Name Availability | Brand Funnel',
    description: 'Verify business name availability, company registry requirements, DBA trade names, and domain matches in one automated tool.',
    keywords: 'business name checker, business name search, company name checker, llc name search',
    canonical: 'https://brandfunnel.mopgen.in/#business-name-checker',
  },
  'domain-name-checker': {
    title: 'Domain Name Checker — Check Domain Availability (.com, .io, .ai) | Brand Funnel',
    description: 'High-speed domain resolution powered by Authoritative DNS-over-HTTPS (Google & Cloudflare DoH) and ICANN RDAP lookup.',
    keywords: 'domain name checker, domain availability, check domain, dot com availability, doh dns search',
    canonical: 'https://brandfunnel.mopgen.in/#domain-name-checker',
  },
  'trademark-checker': {
    title: 'Trademark Research & Risk Clearance Search | Brand Funnel',
    description: 'Research trademark similarity, USPTO TESS database signals, WIPO global brand database links, and preliminary risk clearance practices.',
    keywords: 'trademark checker, trademark search, uspto tess search, wipo brand database, trademark clearance',
    canonical: 'https://brandfunnel.mopgen.in/#trademark-checker',
  },
  'social-handle-checker': {
    title: 'Social Media Handle Checker — Instagram, YouTube, Twitter/X Availability | Brand Funnel',
    description: 'Real-time protocol handle verification across Instagram, YouTube channel handles, Twitter/X usernames, and Facebook.',
    keywords: 'social handle checker, instagram username checker, youtube handle check, twitter username search',
    canonical: 'https://brandfunnel.mopgen.in/#social-handle-checker',
  },
  'brand-name-generator': {
    title: 'Brand Name Generator & Real-Time Availability Engine | Brand Funnel',
    description: 'Generate candidate business and brand names paired with real-time domain availability and social handle verification.',
    keywords: 'brand name generator, business name generator, name ideas, domain generator',
    canonical: 'https://brandfunnel.mopgen.in/#brand-name-generator',
  },
  methodology: {
    title: 'Verification Methodology & System Transparency | Brand Funnel',
    description: 'Detailed protocol documentation explaining how Brand Funnel checks DoH DNS resolvers, RDAP registries, and privacy guarantees.',
    keywords: 'brand funnel methodology, dns over https, icann rdap specs, client side privacy',
    canonical: 'https://brandfunnel.mopgen.in/#methodology',
  },
  learn: {
    title: 'Brand Naming Knowledge Hub & Educational Guides | Brand Funnel',
    description: 'Comprehensive guides on brand creation, domain availability, trademark clearance, business naming strategies, and market positioning.',
    keywords: 'brand naming guides, how to choose a business name, naming knowledge hub, brand positioning',
    canonical: 'https://brandfunnel.mopgen.in/#learn',
  },
  guide: {
    title: 'API & Technical Architecture Documentation | Brand Funnel',
    description: 'Complete technical breakdown of the 5-stage cascading engine, DoH DNS fallbacks, and local storage client-side execution.',
    keywords: 'brand funnel api, doh dns architecture, rdap integration',
    canonical: 'https://brandfunnel.mopgen.in/#guide',
  },
  privacy: {
    title: 'Privacy Policy & Zero-Telemetry Guarantee | Brand Funnel',
    description: 'Read our zero-telemetry client-side privacy policy. No central databases, no tracking cookies, no IP logging.',
    keywords: 'brand funnel privacy, zero telemetry, localstorage privacy',
    canonical: 'https://brandfunnel.mopgen.in/#privacy',
  },
}

export function useSeoHead(currentPage) {
  useEffect(() => {
    const meta = PAGE_SEO_METADATA[currentPage] || PAGE_SEO_METADATA.landing

    // 1. Update Document Title
    document.title = meta.title

    // 2. Helper to set meta tag
    const updateMetaTag = (nameAttr, nameVal, contentVal) => {
      let el = document.querySelector(`meta[${nameAttr}="${nameVal}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(nameAttr, nameVal)
        document.head.appendChild(el)
      }
      el.setAttribute('content', contentVal)
    }

    // 3. Helper to set link tag
    const updateLinkTag = (relVal, hrefVal) => {
      let el = document.querySelector(`link[rel="${relVal}"]`)
      if (!el) {
        el = document.createElement('link')
        el.setAttribute('rel', relVal)
        document.head.appendChild(el)
      }
      el.setAttribute('href', hrefVal)
    }

    // Update standard meta
    updateMetaTag('name', 'description', meta.description)
    updateMetaTag('name', 'keywords', meta.keywords)

    // Update OpenGraph meta
    updateMetaTag('property', 'og:title', meta.title)
    updateMetaTag('property', 'og:description', meta.description)
    updateMetaTag('property', 'og:url', meta.canonical)

    // Update Twitter meta
    updateMetaTag('name', 'twitter:title', meta.title)
    updateMetaTag('name', 'twitter:description', meta.description)

    // Update Canonical URL
    updateLinkTag('canonical', meta.canonical)
  }, [currentPage])
}
