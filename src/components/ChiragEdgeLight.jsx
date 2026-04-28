import { AnimatePresence, motion } from 'framer-motion'

function edgeColorForStep(stepIndex) {
  const map = [
    '34, 211, 238',   // 0 intro          cyan
    '124, 58, 237',   // 1 about          violet
    '245, 158, 11',   // 2 credentials    amber
    '34, 211, 238',   // 3 projects       cyan
    '34, 211, 238',   // 4 skills         cyan
    '245, 158, 11',   // 5 certifications amber
    '245, 158, 11',   // 6 achievements   amber
    '124, 58, 237',   // 7 featured       violet
    '34, 211, 238',   // 8 contact        cyan
  ]
  return map[stepIndex] ?? map[0]
}

export function ChiragEdgeLight({ stepIndex, bloomOpacity, reducedMotion }) {
  const pulseAnim = reducedMotion ? {} : { opacity: [0.85, 1, 0.85] }
  const pulseTrans = reducedMotion ? {} : { duration: 6, repeat: Infinity, ease: 'easeInOut' }

  return (
    <div className="fixed inset-0 z-60 pointer-events-none">
      {/* bloomOpacity wrapper */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: bloomOpacity }}
        transition={{ duration: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            aria-hidden="true"
          >
            {(() => {
              const color = edgeColorForStep(stepIndex)
              return (
                <>
                  {/* Top edge */}
                  <motion.div
                    className="absolute top-0 left-0 right-0"
                    animate={pulseAnim}
                    transition={pulseTrans}
                    style={{
                      height: '30vh',
                      background: `linear-gradient(180deg, rgba(${color}, 0.14) 0%, transparent 100%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                  {/* Bottom edge */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0"
                    animate={pulseAnim}
                    transition={pulseTrans}
                    style={{
                      height: '30vh',
                      background: `linear-gradient(0deg, rgba(${color}, 0.14) 0%, transparent 100%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                  {/* Left edge */}
                  <motion.div
                    className="absolute top-0 bottom-0 left-0"
                    animate={pulseAnim}
                    transition={pulseTrans}
                    style={{
                      width: '20vw',
                      background: `linear-gradient(90deg, rgba(${color}, 0.12) 0%, transparent 100%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                  {/* Right edge */}
                  <motion.div
                    className="absolute top-0 bottom-0 right-0"
                    animate={pulseAnim}
                    transition={pulseTrans}
                    style={{
                      width: '20vw',
                      background: `linear-gradient(-90deg, rgba(${color}, 0.12) 0%, transparent 100%)`,
                      filter: 'blur(20px)',
                    }}
                  />
                </>
              )
            })()}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default ChiragEdgeLight
