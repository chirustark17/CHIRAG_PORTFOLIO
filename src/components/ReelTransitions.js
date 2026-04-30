// Per-pair slide transition variants.
// direction 'next' gets bespoke animations; 'prev' gets a clean reverse.

const EASE = [0.22, 1, 0.36, 1]

const defaultPrev = {
  initial:    { x: -60, opacity: 0 },
  animate:    { x: 0,   opacity: 1 },
  exit:       { x: 60,  opacity: 0 },
  transition: { duration: 0.5, ease: EASE },
}

const reducedFade = {
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  exit:       { opacity: 0 },
  transition: { duration: 0.25 },
}

// pair 1: title → credentials  ("cards being dealt")
const pair1 = {
  initial:    { y: 80,  rotateZ: -3, opacity: 0 },
  animate:    { y: 0,   rotateZ: 0,  opacity: 1 },
  exit:       { y: -40, rotateZ: 2,  opacity: 0 },
  transition: { duration: 0.7, ease: EASE },
}

// pair 2: credentials → projects  ("tiles materializing")
const pair2 = {
  initial:    { scale: 1.06, opacity: 0, filter: 'blur(8px)' },
  animate:    { scale: 1,    opacity: 1, filter: 'blur(0px)' },
  exit:       { scale: 0.92, opacity: 0, filter: 'blur(6px)' },
  transition: { duration: 0.6, ease: 'easeOut' },
}

// pair 3: projects → featured  ("horizontal wipe reveal")
const pair3 = {
  initial:    { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  animate:    { clipPath: 'inset(0 0% 0 0)',   opacity: 1 },
  exit:       { clipPath: 'inset(0 0 0 100%)', opacity: 1 },
  transition: { duration: 0.8, ease: EASE },
}

// pair 4: featured → achievements  ("image zooms out, becomes trophy")
const pair4 = {
  initial:    { scale: 1.4, opacity: 0 },
  animate:    { scale: 1,   opacity: 1 },
  exit:       { scale: 0.6, opacity: 0 },
  transition: { duration: 0.7, ease: EASE },
}

// pair 5: achievements → contact  ("expand outward")
const pair5 = {
  initial:    { scaleY: 0.7, opacity: 0, y: 20  },
  animate:    { scaleY: 1,   opacity: 1, y: 0   },
  exit:       { scaleY: 0.7, opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: 'easeOut' },
}

export function getTransitionVariants(toKind, direction, prefersReducedMotion) {
  if (prefersReducedMotion) return reducedFade
  if (direction === 'prev')           return defaultPrev
  if (toKind === 'credentials')       return pair1
  if (toKind === 'projects')          return pair2
  if (toKind === 'featured')          return pair3
  if (toKind === 'achievements')      return pair4
  if (toKind === 'contact')           return pair5
  return defaultPrev
}
