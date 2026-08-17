import { useEffect, useRef, useState } from 'react'

/**
 * Universal Scroll Progress Laser Bar
 */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const calcProgress = () => {
      const docEl = document.documentElement
      const body = document.body
      const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop || 0
      const scrollHeight = Math.max(
        docEl.scrollHeight,
        body.scrollHeight,
        docEl.offsetHeight,
        body.offsetHeight
      )
      const clientHeight = docEl.clientHeight || window.innerHeight
      const total = scrollHeight - clientHeight
      if (total <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.min(100, Math.max(0, (scrollTop / total) * 100)))
    }

    window.addEventListener('scroll', calcProgress, { passive: true })
    window.addEventListener('resize', calcProgress, { passive: true })
    // Also support container scroll if any
    document.addEventListener('scroll', calcProgress, { passive: true, capture: true })

    calcProgress()
    return () => {
      window.removeEventListener('scroll', calcProgress)
      window.removeEventListener('resize', calcProgress)
      document.removeEventListener('scroll', calcProgress, { capture: true })
    }
  }, [])

  return (
    <div className="scroll-progress-container" aria-hidden="true">
      <div className="scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  )
}

/**
 * Interactive Mouse Spotlight (desktop only, disabled on touch screens)
 */
export function InteractiveSpotlight() {
  const spotlightRef = useRef(null)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const handleMouseMove = (e) => {
      if (!spotlightRef.current) return
      const x = e.clientX
      const y = e.clientY
      spotlightRef.current.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`
    }
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return <div ref={spotlightRef} className="interactive-cursor-spotlight" aria-hidden="true" />
}

/**
 * Scroll Reveal Container — robust for all screen sizes
 */
export function RevealOnScroll({ children, className = '', threshold = 0.05, delay = 0 }) {
  const ref = useRef(null)
  const [isRevealed, setIsRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Immediately reveal on small mobile or if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true)
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin: '50px 0px 50px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div
      ref={ref}
      className={`reveal-init ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/**
 * 3D Tilt Card wrapper — smoothly disabled on touch devices to prevent mobile transform glitches
 */
export function TiltCard({ children, className = '', maxTilt = 8 }) {
  const cardRef = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -maxTilt
    const rotateY = ((x - centerX) / centerX) * maxTilt

    card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`
    setCoords({ x, y })
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`
    setIsHovered(false)
  }

  return (
    <div
      ref={cardRef}
      className={`tilt-card-wrap ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => {
        if (!window.matchMedia('(pointer: coarse)').matches) setIsHovered(true)
      }}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isHovered && (
        <div
          className="card-glare"
          style={{
            background: `radial-gradient(400px circle at ${coords.x}px ${coords.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
          }}
        />
      )}
    </div>
  )
}

/**
 * Animated Laser Border Beam running around cards
 */
export function BorderBeam({ size = 200, duration = 12, delay = 0 }) {
  return (
    <div
      className="border-beam"
      style={{
        '--size': `${size}px`,
        '--duration': `${duration}s`,
        '--delay': `${delay}s`,
      }}
    />
  )
}
