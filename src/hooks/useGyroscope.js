import { useState, useEffect, useRef, useCallback } from 'react'

export default function useGyroscope({ enabled = true, smoothing = 0.15, maxTilt = 1 } = {}) {
  const [supported, setSupported] = useState(false)
  const [permission, setPermission] = useState('prompt')
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isSupported = 'DeviceOrientationEvent' in window
    setSupported(isSupported)
    if (!isSupported) {
      setPermission('unsupported')
      return
    }
    const needsPermission = typeof DeviceOrientationEvent.requestPermission === 'function'
    if (!needsPermission) setPermission('granted')
  }, [])

  const requestPermission = useCallback(async () => {
    if (typeof DeviceOrientationEvent.requestPermission !== 'function') {
      setPermission('granted')
      return 'granted'
    }
    try {
      const result = await DeviceOrientationEvent.requestPermission()
      setPermission(result)
      return result
    } catch {
      setPermission('denied')
      return 'denied'
    }
  }, [])

  useEffect(() => {
    if (!enabled || permission !== 'granted') return

    const handleOrientation = (e) => {
      const gamma = e.gamma ?? 0
      const beta = e.beta ?? 0
      const x = Math.max(-maxTilt, Math.min(maxTilt, gamma / 30))
      const y = Math.max(-maxTilt, Math.min(maxTilt, (beta - 30) / 30))
      targetRef.current = { x, y }
    }

    window.addEventListener('deviceorientation', handleOrientation)

    const tick = () => {
      setTilt(prev => ({
        x: prev.x + (targetRef.current.x - prev.x) * smoothing,
        y: prev.y + (targetRef.current.y - prev.y) * smoothing,
      }))
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, permission, smoothing, maxTilt])

  return {
    tiltX: tilt.x,
    tiltY: tilt.y,
    supported,
    permission,
    requestPermission,
  }
}
