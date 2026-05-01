import { useEffect, useRef, useState } from 'react'
import { animate } from 'framer-motion'
import { Smartphone } from 'lucide-react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import useGyroscope from '../../../hooks/useGyroscope'

const TILT_STRENGTHS = [8, 6, 5, 4]

export default function CredentialsPanelMobile({ slide, active, gyroEnabled, onEnableGyro }) {
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(reducedMotion ? slide.counterTarget : 0)
  const counterStarted = useRef(false)

  const { tiltX, tiltY, supported, permission, requestPermission } = useGyroscope({
    enabled: gyroEnabled && active && !reducedMotion,
  })

  // Auto-enable on non-iOS (permission already 'granted' on mount)
  useEffect(() => {
    if (active && supported && permission === 'granted' && !gyroEnabled) {
      onEnableGyro()
    }
  }, [active, supported, permission, gyroEnabled]) // eslint-disable-line

  // Animate counter once on first activation
  useEffect(() => {
    if (!active || counterStarted.current) return
    counterStarted.current = true
    if (reducedMotion) { setCount(slide.counterTarget); return }
    const controls = animate(0, slide.counterTarget, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: v => setCount(Math.floor(v)),
    })
    return () => controls.stop()
  }, [active]) // eslint-disable-line

  const cardStyle = (i) => {
    if (reducedMotion || !gyroEnabled) return {}
    const str = TILT_STRENGTHS[i]
    return {
      transform: `perspective(800px) rotateY(${tiltX * str}deg) rotateX(${-tiltY * str}deg)`,
      transformStyle: 'preserve-3d',
      transition: 'transform 0.05s linear',
    }
  }

  return (
    <article className="w-full max-w-md flex flex-col gap-4">
      <header>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3">
          {slide.eyebrow}
        </span>
        <h2
          id={active ? 'reel-mobile-active-title' : undefined}
          className="font-serif text-3xl text-bone-50 leading-tight"
        >
          {slide.title}
        </h2>
      </header>

      {/* Stat bento grid */}
      <div className="grid grid-cols-2 gap-3">
        {slide.stats.map((stat, i) => (
          <div
            key={stat.label}
            className="rounded-2xl p-4 flex flex-col gap-1"
            style={{
              background: 'rgba(250,250,247,0.04)',
              border: '1px solid rgba(250,250,247,0.1)',
              ...cardStyle(i),
            }}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone-50/60">
              {stat.label}
            </span>
            <span
              className={`font-serif text-2xl leading-tight ${
                stat.tone === 'amber' ? 'text-amber-500' : 'text-bone-50'
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Counter */}
      <div>
        <div className="font-serif text-7xl text-amber-500 leading-none">
          {count}
        </div>
        <p className="font-mono text-xs text-bone-50/65 mt-2 max-w-xs">
          {slide.counterCaption}
        </p>
      </div>

      {/* Gyro prompt — only when supported, not yet enabled, panel active, iOS needs permission */}
      {active && supported && permission === 'prompt' && !gyroEnabled && (
        <button
          className="w-full rounded-full px-4 py-3 font-mono text-xs uppercase tracking-wider text-cyan-400 flex items-center justify-center gap-2"
          style={{
            background: 'rgba(34,211,238,0.12)',
            border: '1px solid rgba(34,211,238,0.4)',
          }}
          onClick={async () => {
            const result = await requestPermission()
            if (result === 'granted') onEnableGyro()
          }}
        >
          <Smartphone size={14} aria-hidden="true" />
          Tilt your phone
        </button>
      )}
    </article>
  )
}
