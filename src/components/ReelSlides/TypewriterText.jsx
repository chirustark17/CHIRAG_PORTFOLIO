import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

export function TypewriterText({ text, speed = 80, delay = 0, onComplete, showCursor = true, className }) {
  const reducedMotion = usePrefersReducedMotion()
  const [displayedText, setDisplayedText] = useState(reducedMotion ? text : '')
  const [cursorVisible, setCursorVisible] = useState(showCursor && !reducedMotion)
  const timeoutsRef = useRef([])

  useEffect(() => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []

    if (reducedMotion) {
      setDisplayedText(text)
      setCursorVisible(false)
      if (onComplete) {
        const t = setTimeout(onComplete, 0)
        timeoutsRef.current.push(t)
      }
      return
    }

    setDisplayedText('')
    setCursorVisible(showCursor)

    let i = 0
    function typeNext() {
      if (i < text.length) {
        i++
        setDisplayedText(text.slice(0, i))
        const t = setTimeout(typeNext, speed)
        timeoutsRef.current.push(t)
      } else {
        const t = setTimeout(() => {
          setCursorVisible(false)
          onComplete?.()
        }, 600)
        timeoutsRef.current.push(t)
      }
    }

    const startT = setTimeout(typeNext, delay)
    timeoutsRef.current.push(startT)

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }
  }, [text, speed, delay, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span className={className}>
      {displayedText}
      {showCursor && cursorVisible && (
        <motion.span
          aria-hidden="true"
          className="inline-block w-[3px] h-[0.85em] bg-cyan-400 ml-1 align-baseline"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.7, repeat: Infinity }}
        />
      )}
    </span>
  )
}

export default TypewriterText
