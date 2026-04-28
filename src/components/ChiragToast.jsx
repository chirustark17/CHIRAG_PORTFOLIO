import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownLeft, X } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function ChiragToast({ visible, onDismiss }) {
  const reducedMotion = usePrefersReducedMotion()
  const timerRef = useRef(null)

  useEffect(() => {
    if (!visible) return
    timerRef.current = setTimeout(onDismiss, 4000)
    return () => clearTimeout(timerRef.current)
  }, [visible, onDismiss])

  useEffect(() => {
    if (!visible) return
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onDismiss() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, onDismiss])

  function pauseTimer() {
    clearTimeout(timerRef.current)
  }

  function resumeTimer() {
    timerRef.current = setTimeout(onDismiss, 4000)
  }

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[42] pointer-events-none">
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto rounded-full px-5 py-3 flex items-center gap-3 whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, rgba(10,5,24,0.95), rgba(20,10,40,0.95))',
              border: '1px solid rgba(34,211,238,0.45)',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5), 0 0 30px -8px rgba(34,211,238,0.4)',
              backdropFilter: 'blur(12px)',
            }}
            onMouseEnter={pauseTimer}
            onMouseLeave={resumeTimer}
          >
            {/* Wiggling arrow pointing down-left toward orb */}
            <motion.span
              animate={reducedMotion ? {} : { x: [0, -3, 0], y: [0, 3, 0] }}
              transition={reducedMotion ? {} : { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-cyan-400 flex-shrink-0"
            >
              <ArrowDownLeft size={18} />
            </motion.span>

            {/* Text */}
            <span>
              <span className="font-mono text-xs uppercase tracking-wider text-cyan-400/80">psst —</span>
              <span className="font-sans text-sm text-bone-50 ml-2">something cool just unlocked</span>
            </span>

            {/* Dismiss */}
            <button
              className="ml-2 w-6 h-6 rounded-full border border-bone-50/20 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-1 focus-visible:ring-offset-ink-950 text-bone-50/60 flex-shrink-0"
              aria-label="Dismiss"
              onClick={onDismiss}
            >
              <X size={12} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChiragToast
