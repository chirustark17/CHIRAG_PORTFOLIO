import { motion } from 'framer-motion'
import achievements from '../data/achievements'
import { AchievementCard } from '../components/AchievementCard'
import { SectionHeading } from '../components/SectionHeading'

export function Achievements() {
  return (
    <section id="achievements" aria-label="Achievements" className="section">
      <SectionHeading eyebrow="05 — beyond the classroom" title="Achievements" />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.15 } },
        }}
        className="space-y-6"
      >
        {achievements.map((a, i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
          >
            <AchievementCard {...a} isLast={i === achievements.length - 1} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default Achievements
