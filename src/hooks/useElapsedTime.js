import { useEffect, useState } from 'react'

export default function useElapsedTime(thresholdMs) {
  const [elapsed, setElapsed] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('chiragModeDismissed') === 'true') return false
    return false
  })

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('chiragModeDismissed') === 'true') return
    const id = setTimeout(() => setElapsed(true), thresholdMs)
    return () => clearTimeout(id)
  }, [thresholdMs])

  return elapsed
}
