import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

export function ParallaxCard({
  project, index, mouseX, mouseY, hoveredIndex, onHover, onLeave, isTouch, reducedMotion, github
}) {
  const [imgError, setImgError] = useState(false)
  const [tapLifted, setTapLifted] = useState(false)
  const tapTimer = useRef(null)

  const isHovered = hoveredIndex === index
  const otherHovered = hoveredIndex !== null && !isHovered

  // 3D tilt — always call hooks (rules of hooks)
  const rotateY = useTransform(mouseX, [-1, 1], [-15, 15])
  const rotateX = useTransform(mouseY, [-1, 1], [9, -9])
  const baseRotateY = useTransform(mouseX, [-1, 1], [-10, 10])
  const baseRotateX = useTransform(mouseY, [-1, 1], [6, -6])
  const reflectionOpacity = useTransform(mouseY, [-1, 1], [0.3, 0])

  // Spring-driven hover values for smooth Z/scale/opacity transitions
  const zMV = useMotionValue(0)
  const scaleMV = useMotionValue(1)
  const opacityMV = useMotionValue(1)
  const springZ = useSpring(zMV, { stiffness: 300, damping: 25 })
  const springScale = useSpring(scaleMV, { stiffness: 300, damping: 25 })
  const springOpacity = useSpring(opacityMV, { stiffness: 200, damping: 20 })

  useEffect(() => {
    if (isTouch || reducedMotion) return
    zMV.set(isHovered ? 40 : 0)
    scaleMV.set(isHovered ? 1.05 : otherHovered ? 0.96 : 1)
    opacityMV.set(otherHovered ? 0.55 : 1)
  }, [isHovered, otherHovered, isTouch, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimeout(tapTimer.current), [])

  function handleTap() {
    if (!isTouch) return
    setTapLifted(true)
    clearTimeout(tapTimer.current)
    tapTimer.current = setTimeout(() => setTapLifted(false), 1500)
  }

  const entranceVariant = reducedMotion
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3, delay: index * 0.1 },
      }
    : {
        initial: { opacity: 0, y: 30, rotateX: -15 },
        animate: { opacity: 1, y: 0, rotateX: 0 },
        transition: { duration: 0.6, delay: 0.2 + index * 0.12, ease: [0.22, 1, 0.36, 1] },
      }

  const baseCardStyle = {
    background: 'rgba(10,8,16,0.7)',
    border: '1px solid rgba(34,211,238,0.2)',
  }

  let articleStyle
  if (isTouch) {
    articleStyle = {
      ...baseCardStyle,
      boxShadow: tapLifted
        ? '0 30px 60px -15px rgba(0,0,0,0.5), 0 0 40px -10px rgba(34,211,238,0.4)'
        : '0 10px 30px -10px rgba(0,0,0,0.4)',
      translateY: tapLifted ? -10 : 0,
      scale: tapLifted ? 1.02 : 1,
    }
  } else if (reducedMotion) {
    articleStyle = {
      ...baseCardStyle,
      boxShadow: isHovered
        ? '0 30px 60px -15px rgba(0,0,0,0.5), 0 0 40px -10px rgba(34,211,238,0.4)'
        : '0 10px 30px -10px rgba(0,0,0,0.4)',
      translateY: isHovered ? -2 : 0,
      scale: isHovered ? 1.02 : 1,
    }
  } else {
    articleStyle = {
      ...baseCardStyle,
      boxShadow: isHovered
        ? '0 30px 60px -15px rgba(0,0,0,0.5), 0 0 40px -10px rgba(34,211,238,0.4)'
        : '0 10px 30px -10px rgba(0,0,0,0.4)',
      rotateY: isHovered ? rotateY : baseRotateY,
      rotateX: isHovered ? rotateX : baseRotateX,
      translateZ: springZ,
      scale: springScale,
      opacity: springOpacity,
      transformStyle: 'preserve-3d',
    }
  }

  return (
    <motion.div
      initial={entranceVariant.initial}
      animate={entranceVariant.animate}
      transition={entranceVariant.transition}
    >
      <motion.article
        style={articleStyle}
        className="rounded-2xl overflow-hidden cursor-pointer relative focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
        onMouseEnter={!isTouch ? onHover : undefined}
        onMouseLeave={!isTouch ? onLeave : undefined}
        onFocus={!isTouch ? onHover : undefined}
        onBlur={!isTouch ? onLeave : undefined}
        onClick={handleTap}
        tabIndex={0}
        aria-label={`${project.title} — ${project.oneLiner}`}
      >
        <div className="aspect-16/10 overflow-hidden bg-bone-50/5 relative">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-violet-500/10 font-serif text-lg text-bone-50/70 p-4 text-center">
              {project.title}
            </div>
          ) : (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              aria-label={`${project.title} on GitHub`}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 z-10 hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,8,16,0.85)', border: '1px solid rgba(34,211,238,0.3)' }}
            >
              <GitHubIcon />
            </a>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-serif text-xl text-bone-50">{project.title}</h3>
          <p className="font-mono text-xs text-bone-50/65 mt-1">{project.oneLiner}</p>
        </div>

        {!reducedMotion && !isTouch && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%)',
              opacity: reflectionOpacity,
            }}
          />
        )}
      </motion.article>
    </motion.div>
  )
}

export default ParallaxCard
