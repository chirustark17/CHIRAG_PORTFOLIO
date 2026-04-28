import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import useElapsedTime from '../hooks/useElapsedTime'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import ChiragInvite from './ChiragInvite'
import ChiragToast from './ChiragToast'

export function ChiragModeOrb({ onActivate }) {
  const [dismissed, setDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('chiragModeDismissed') === 'true'
  )
  const [inviteDismissed, setInviteDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem('chiragInviteDismissed') === 'true'
  )
  const [inviteVisible, setInviteVisible] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [shockwaveDone, setShockwaveDone] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const elapsed = useElapsedTime(25000)
  const reducedMotion = usePrefersReducedMotion()
  const inviteTimerRef = useRef(null)
  const shockwaveTimerRef = useRef(null)

  const visible = elapsed && !dismissed

  // Show invite + toast + shockwave once orb appears
  useEffect(() => {
    if (visible && !inviteDismissed) {
      setInviteVisible(true)
      setToastVisible(true)
      inviteTimerRef.current = setTimeout(() => {
        dismissInvite()
      }, 8000)
      if (!reducedMotion) {
        shockwaveTimerRef.current = setTimeout(() => setShockwaveDone(true), 1500)
      } else {
        setShockwaveDone(true)
      }
    }
    return () => {
      clearTimeout(inviteTimerRef.current)
      clearTimeout(shockwaveTimerRef.current)
    }
  }, [visible]) // eslint-disable-line react-hooks/exhaustive-deps

  function dismissInvite() {
    clearTimeout(inviteTimerRef.current)
    setInviteVisible(false)
    setToastVisible(false)
    localStorage.setItem('chiragInviteDismissed', 'true')
    setInviteDismissed(true)
  }

  function handleOrbClick() {
    dismissInvite()
    onActivate()
  }

  function handleDismissOrb(e) {
    e.stopPropagation()
    dismissInvite()
    localStorage.setItem('chiragModeDismissed', 'true')
    setDismissed(true)
  }

  return (
    <>
      {/* Top-center toast — fires simultaneously with invite bubble */}
      <ChiragToast
        visible={toastVisible}
        onDismiss={dismissInvite}
      />

      {/* Invitation bubble — rendered outside the orb's AnimatePresence */}
      <ChiragInvite
        visible={inviteVisible}
        onEnter={() => { dismissInvite(); onActivate() }}
        onDismiss={dismissInvite}
      />

      <AnimatePresence>
        {visible && (
          <div className="fixed bottom-6 left-6 z-40">
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative w-12 h-12 rounded-full bg-cyan-400 text-ink-950 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 group"
              aria-label="Enter Chirag Mode — guided tour"
              aria-haspopup="dialog"
              onClick={handleOrbClick}
              onMouseEnter={() => { setShowTooltip(true); setIsHovered(true) }}
              onMouseLeave={() => { setShowTooltip(false); setIsHovered(false) }}
              onFocus={() => { setShowTooltip(true); setIsHovered(true) }}
              onBlur={() => { setShowTooltip(false); setIsHovered(false) }}
              style={{
                boxShadow: isHovered
                  ? '0 0 40px -5px rgba(34,211,238,0.9), 0 0 70px -15px rgba(124,58,237,0.5)'
                  : '0 0 30px -5px rgba(34,211,238,0.6), 0 0 50px -15px rgba(124,58,237,0.35)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              {/* One-time shockwave ring on first appearance */}
              {!reducedMotion && !shockwaveDone && (
                <motion.span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full pointer-events-none"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 4, opacity: 0 }}
                  transition={{ duration: 1.4, ease: 'easeOut' }}
                  style={{
                    background: 'radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)',
                  }}
                />
              )}

              {/* Extra glow rings while invitation is active */}
              {!reducedMotion && inviteVisible && (
                <>
                  {/* Outer slow ping */}
                  <span
                    className="absolute -inset-3 rounded-full bg-cyan-400/20 animate-ping"
                    style={{ animationDuration: '2.4s' }}
                    aria-hidden="true"
                  />
                  {/* Outermost breathe ring */}
                  <motion.span
                    className="absolute -inset-6 rounded-full bg-cyan-400/10"
                    animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    aria-hidden="true"
                  />
                </>
              )}

              {/* Inner ping — always present */}
              {!reducedMotion && (
                <span className="absolute inset-0 rounded-full bg-cyan-400/40 animate-ping" aria-hidden="true" />
              )}

              <Sparkles size={22} className="relative z-10" />

              {/* Dismiss orb button */}
              <button
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-ink-900 dark:bg-bone-50 text-bone-50 dark:text-ink-950 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition focus:opacity-100"
                aria-label="Dismiss Chirag Mode"
                onClick={handleDismissOrb}
              >
                ×
              </button>
            </motion.button>

            {/* Tooltip — only show when invite is gone */}
            <AnimatePresence>
              {showTooltip && !inviteVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute bottom-full mb-3 left-0 whitespace-nowrap px-3 py-2 rounded-lg bg-ink-900 text-bone-50 dark:bg-bone-50 dark:text-ink-900 font-mono text-xs shadow-lg pointer-events-none"
                >
                  Enter Chirag Mode — 60s walkthrough
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChiragModeOrb
