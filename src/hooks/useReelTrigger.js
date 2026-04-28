import { useEffect, useRef, useState } from 'react'

export default function useReelTrigger() {
  const [showHint, setShowHint] = useState(false)
  const timerRef = useRef(null)
  const dismissTimerRef = useRef(null)

  const dismissed =
    typeof window !== 'undefined' &&
    localStorage.getItem('reelHintDismissed') === 'true'

  function dismissHint() {
    try { localStorage.setItem('reelHintDismissed', 'true') } catch {}
    clearTimeout(dismissTimerRef.current)
    setShowHint(false)
  }

  useEffect(() => {
    if (dismissed) return

    const el = document.getElementById('contact')
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timerRef.current = setTimeout(() => setShowHint(true), 800)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      clearTimeout(timerRef.current)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!showHint) return
    dismissTimerRef.current = setTimeout(() => dismissHint(), 8000)
    return () => clearTimeout(dismissTimerRef.current)
  }, [showHint]) // eslint-disable-line react-hooks/exhaustive-deps

  return { showHint, dismissHint }
}
