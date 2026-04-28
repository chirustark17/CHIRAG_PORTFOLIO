import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function AuroraBackground() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
      <motion.div
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl bg-cyan-400/10 dark:bg-cyan-400/8"
        animate={reducedMotion ? {} : {
          x: [-20, 20, -20],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl bg-amber-500/5 dark:bg-amber-500/8"
        animate={reducedMotion ? {} : {
          x: [20, -20, 20],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}

export default AuroraBackground
