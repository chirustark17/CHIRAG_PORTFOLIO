import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export function ParallaxCard({
  project, index, mouseX, mouseY, hoveredIndex, onHover, onLeave, isTouch, reducedMotion
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
        <div className="aspect-[16/10] overflow-hidden bg-bone-50/5">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-400/10 to-violet-500/10 font-serif text-lg text-bone-50/70 p-4 text-center">
              {project.title}
            </div>
          ) : (
            <img
              src={project.image}
              alt={`${project.title} screenshot`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
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
