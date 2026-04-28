import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronsRight, Mail, Trophy } from 'lucide-react'

// ─── Shared mobile hook ───────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const onChange = e => setMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

// ─── Scene 0: Intro — CK monogram reveal ─────────────────────────────────────

function IntroScene() {
  const [revealW, setRevealW] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    const DURATION = 1800
    const start = performance.now()
    function tick(now) {
      const t = Math.min((now - start) / DURATION, 1)
      // ease-in-out cubic
      const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setRevealW(eased * 200)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <motion.div
        animate={{ opacity: [0, 0.85, 0.85, 0] }}
        transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
          <defs>
            <filter id="ck-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="ck-reveal">
              <rect x="0" y="0" width={revealW} height="200" />
            </clipPath>
          </defs>
          {/* Dim preview */}
          <text
            x="100" y="135" textAnchor="middle"
            fontFamily="'Instrument Serif', serif" fontSize="120"
            fill="none" stroke="rgba(34,211,238,0.18)" strokeWidth="1.5"
          >CK</text>
          {/* Clipped animated reveal */}
          <text
            x="100" y="135" textAnchor="middle"
            fontFamily="'Instrument Serif', serif" fontSize="120"
            fill="none" stroke="#22D3EE" strokeWidth="1.5"
            filter="url(#ck-glow)" clipPath="url(#ck-reveal)"
          >CK</text>
        </svg>
      </motion.div>
    </div>
  )
}

// ─── Scene 1: Credentials — orbiting badges ───────────────────────────────────

const TO_RAD = d => d * Math.PI / 180

function CredentialsScene({ targetRect }) {
  const isMobile = useIsMobile()
  const radius = isMobile ? 70 : 90

  const cx = targetRect
    ? targetRect.left + targetRect.width / 2
    : (typeof window !== 'undefined' ? window.innerWidth / 2 : 500)
  const cy = targetRect
    ? targetRect.top + targetRect.height / 2
    : (typeof window !== 'undefined' ? window.innerHeight / 2 : 300)

  const BADGES = [
    { label: 'AZ-900',    angle: 0,   border: 'rgba(34,211,238,0.5)',  color: '#22D3EE' },
    { label: 'Top 30',    angle: 120, border: 'rgba(245,158,11,0.55)', color: '#F59E0B' },
    { label: '8.66 CGPA', angle: 240, border: 'rgba(124,58,237,0.5)',  color: '#C4B5FD' },
  ].map(b => ({
    ...b,
    x: Math.sin(TO_RAD(b.angle)) * radius,
    y: -Math.cos(TO_RAD(b.angle)) * radius,
  }))

  return (
    <div style={{ position: 'absolute', left: cx, top: cy, width: 0, height: 0, pointerEvents: 'none' }}>
      {/* Central pulse glow */}
      <motion.div
        style={{
          position: 'absolute',
          translateX: '-50%',
          translateY: '-50%',
          width: 80, height: 80,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,211,238,0.3), transparent)',
          filter: 'blur(8px)',
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1, 1, 0] }}
        transition={{ duration: 2.5, times: [0, 0.15, 0.3, 0.85, 1] }}
        aria-hidden="true"
      />

      {/* Rotating constellation */}
      <motion.div
        style={{ position: 'absolute', translateX: 0, translateY: 0, width: 0, height: 0 }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360, opacity: [0, 0.85, 0.85, 0] }}
        transition={{
          rotate: { duration: 2.5, ease: 'easeInOut' },
          opacity: { duration: 2.5, times: [0, 0.2, 0.8, 1] },
        }}
      >
        {BADGES.map(b => (
          <motion.div
            key={b.label}
            style={{
              position: 'absolute',
              left: b.x, top: b.y,
              translateX: '-50%', translateY: '-50%',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <div
              className="px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider whitespace-nowrap"
              style={{
                border: `1px solid ${b.border}`,
                background: 'rgba(10,5,24,0.75)',
                backdropFilter: 'blur(8px)',
                color: b.color,
              }}
            >
              {b.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Scene 2: About — rotating tech chips ring ────────────────────────────────

const CHIP_LABELS = ['Python', 'SQL', 'ML', 'Azure', 'NLP', 'EDA', 'Tableau', 'Docker']

function AboutScene() {
  const isMobile = useIsMobile()
  const radius = isMobile ? 150 : 240

  const chips = CHIP_LABELS.map((label, i) => {
    const angle = i * (360 / CHIP_LABELS.length)
    return {
      label,
      x: Math.sin(TO_RAD(angle)) * radius,
      y: -Math.cos(TO_RAD(angle)) * radius,
    }
  })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: '20%',
        left: '50%',
        width: 0, height: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      <motion.div
        style={{ position: 'absolute', translateX: 0, translateY: 0 }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360, opacity: [0, 0.85, 0.85, 0] }}
        transition={{
          rotate: { duration: 2.5, ease: 'easeInOut' },
          opacity: { duration: 2.5, times: [0, 0.2, 0.8, 1] },
        }}
      >
        {chips.map(c => (
          <motion.div
            key={c.label}
            style={{
              position: 'absolute',
              left: c.x, top: c.y,
              translateX: '-50%', translateY: '-50%',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
          >
            <div
              className="px-3 py-1 rounded-full font-mono text-[10px] uppercase tracking-wider text-bone-50/85 whitespace-nowrap"
              style={{
                border: '1px solid rgba(34,211,238,0.35)',
                background: 'rgba(10,5,24,0.75)',
                backdropFilter: 'blur(6px)',
              }}
            >
              {c.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ─── Scene 3: Projects — floating gradient tiles ──────────────────────────────

const TILE_GRADIENTS = [
  'linear-gradient(135deg, rgba(34,211,238,0.3), rgba(124,58,237,0.22))',
  'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(34,211,238,0.22))',
  'linear-gradient(135deg, rgba(124,58,237,0.26), rgba(245,158,11,0.22))',
  'linear-gradient(135deg, rgba(34,211,238,0.26), rgba(245,158,11,0.19))',
  'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(34,211,238,0.26))',
]
const TARGET_X_PCT = [0.15, 0.30, 0.50, 0.70, 0.85]

function ProjectsScene() {
  const isMobile = useIsMobile()
  const tileCount = isMobile ? 3 : 5

  const tiles = useMemo(() => {
    const W = typeof window !== 'undefined' ? window.innerWidth : 1024
    const H = typeof window !== 'undefined' ? window.innerHeight : 768
    const TILE_W = 112 // w-28

    return Array.from({ length: 5 }, (_, i) => {
      const fromLeft = i < 2
      const startX = fromLeft ? -220 : W + 220
      const endX = fromLeft ? W + 220 : -220
      const targetX = TARGET_X_PCT[i] * W - TILE_W / 2
      const startY = H * 0.1 + Math.random() * H * 0.6
      const yDrift = (Math.random() - 0.5) * 60
      const rotate = Math.floor(Math.random() * 21) - 10
      return { id: i, startX, endX, targetX, startY, yDrift, rotate, gradient: TILE_GRADIENTS[i] }
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {tiles.slice(0, tileCount).map(tile => (
        <motion.div
          key={tile.id}
          style={{
            position: 'absolute',
            top: tile.startY,
            left: 0,
            width: 112, height: 80,
            borderRadius: 12,
            border: '1px solid rgba(34,211,238,0.3)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
            background: tile.gradient,
          }}
          initial={{ x: tile.startX, opacity: 0, rotate: tile.rotate }}
          animate={{
            x: [tile.startX, tile.targetX, tile.endX],
            y: [0, tile.yDrift, 0],
            opacity: [0, 0.85, 0.85, 0],
          }}
          transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1], ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Scene 4: Featured — carousel nudge indicator ────────────────────────────

function FeaturedScene({ targetRect }) {
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('chirag-mode:advance-carousel'))
  }, [])

  const top = targetRect ? targetRect.top + 40 : 100

  return (
    <motion.div
      style={{
        position: 'absolute',
        top,
        left: '50%',
        translateX: '-50%',
        pointerEvents: 'none',
      }}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: [0, 0.85, 0.85, 0], y: 0 }}
      transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
      aria-hidden="true"
    >
      <div
        className="flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-wider text-cyan-400 whitespace-nowrap"
        style={{
          border: '1px solid rgba(124,58,237,0.5)',
          background: 'rgba(10,5,24,0.9)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <ChevronsRight size={12} />
        auto-showcasing
      </div>
    </motion.div>
  )
}

// ─── Scene 5: Achievements — trophy glint ────────────────────────────────────

function AchievementsScene({ targetRect }) {
  const cx = targetRect
    ? targetRect.right - 60
    : (typeof window !== 'undefined' ? window.innerWidth - 40 : 400)
  const cy = targetRect ? targetRect.top + 40 : 40

  return (
    <div
      style={{ position: 'absolute', left: cx, top: cy, translateX: '-50%', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Trophy with glint */}
        <motion.div
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          initial={{ scale: 0, rotate: -20, opacity: 0 }}
          animate={{ scale: [0, 1.3, 1, 1, 0.8], rotate: [-20, 0, 0, 0, 10], opacity: [0, 0.85, 0.85, 0.85, 0] }}
          transition={{ duration: 2.5, times: [0, 0.15, 0.25, 0.85, 1] }}
        >
          <Trophy size={48} className="text-amber-500" />
          {/* Glint sweep */}
          <motion.div
            style={{
              position: 'absolute',
              top: '30%',
              left: 0,
              width: 64, height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(250,250,247,0.8), transparent)',
              filter: 'blur(2px)',
            }}
            initial={{ x: -50, rotate: -35, opacity: 0 }}
            animate={{ x: [-50, 50, 50], rotate: -35, opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, delay: 0.8, times: [0, 0.5, 1] }}
          />
        </motion.div>

        {/* Numeric reveal */}
        <motion.div
          style={{ textAlign: 'center', marginTop: 8 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: [0, 0.85, 0.85, 0], y: [20, 0, 0, 0] }}
          transition={{ duration: 2.5, times: [0, 0.3, 0.85, 1] }}
        >
          <div className="font-serif text-3xl text-amber-500">TOP 30</div>
          <div className="font-mono text-xs mt-1" style={{ color: 'rgba(245,158,11,0.75)' }}>
            OF 450+ TEAMS
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Scene 6: Contact — envelope + email typing ───────────────────────────────

const EMAIL = 'chiruchirag2447@gmail.com'

function ContactScene() {
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const timerRef = useRef(null)

  useEffect(() => {
    const perChar = Math.round(1200 / EMAIL.length)
    let i = 0

    function typeNext() {
      i++
      setDisplayedText(EMAIL.slice(0, i))
      if (i < EMAIL.length) {
        timerRef.current = setTimeout(typeNext, perChar)
      } else {
        timerRef.current = setTimeout(() => setShowCursor(false), 500)
      }
    }

    timerRef.current = setTimeout(typeNext, 350)
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    >
      {/* Mail icon */}
      <motion.div
        initial={{ scale: 0, y: 30, opacity: 0 }}
        animate={{ scale: [0, 1.15, 1, 1, 0.9], y: [30, 0, 0, 0, -10], opacity: [0, 0.85, 0.85, 0.85, 0] }}
        transition={{ duration: 2.5, times: [0, 0.15, 0.25, 0.85, 1] }}
      >
        <Mail size={56} className="text-cyan-400" />
      </motion.div>

      {/* Typed email with cursor */}
      <motion.div
        className="font-mono text-base md:text-lg text-bone-50 mt-4 whitespace-nowrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 0.85, 0.85, 0], y: [10, 0, 0, 0] }}
        transition={{ duration: 2.5, times: [0, 0.15, 0.85, 1] }}
      >
        {displayedText}
        {showCursor && (
          <motion.span
            className="inline-block w-0.5 h-5 bg-cyan-400 ml-0.5 align-middle"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function ChiragStopOverlays({ stepIndex, active, targetRect, reducedMotion }) {
  if (!active || reducedMotion) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepIndex}
        className="fixed inset-0 z-[61] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        aria-hidden="true"
      >
        {stepIndex === 0 && <IntroScene />}
        {stepIndex === 1 && <AboutScene />}
        {stepIndex === 2 && <CredentialsScene targetRect={targetRect} />}
        {stepIndex === 3 && <ProjectsScene />}
        {/* steps 4 (skills) + 5 (certifications) — quiet stops, no scene overlay */}
        {stepIndex === 6 && <AchievementsScene targetRect={targetRect} />}
        {stepIndex === 7 && <FeaturedScene targetRect={targetRect} />}
        {stepIndex === 8 && <ContactScene />}
      </motion.div>
    </AnimatePresence>
  )
}

export default ChiragStopOverlays
