import { motion } from 'framer-motion'
import projects from '../../data/projects'
import { SectionHeading } from '../SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import ProjectCardMobile from './ProjectCardMobile'

function buildGroups(items) {
  const groups = []
  let i = 0
  while (i < items.length) {
    if (groups.length % 2 === 0) {
      groups.push({ type: 'featured', items: [items[i]] })
      i += 1
    } else {
      const pair = items.slice(i, i + 2)
      if (pair.length === 1) {
        groups.push({ type: 'featured', items: pair })
      } else {
        groups.push({ type: 'pair', items: pair })
      }
      i += pair.length
    }
  }
  return groups
}

const groups = buildGroups(projects)

export default function ProjectsMobile() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="projects"
      className="section relative px-5 py-20 flex flex-col gap-6"
      aria-labelledby="projects-heading-mobile"
    >
      <SectionHeading
        align="left"
        eyebrow="03 — projects"
        title="Selected projects"
        subtitle="Built end-to-end. Source on every one."
        id="projects-heading-mobile"
      />

      <div className="flex flex-col gap-4">
        {groups.map((group, gi) => {
          if (group.type === 'featured') {
            const proj = group.items[0]
            return (
              <motion.div
                key={proj.slug}
                {...(reducedMotion ? {} : {
                  initial: { opacity: 0, y: 20 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: '-50px' },
                  transition: { duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] },
                })}
              >
                <ProjectCardMobile project={proj} variant="featured" index={gi} />
              </motion.div>
            )
          }

          return (
            <div key={group.items[0].slug} className="grid grid-cols-2 gap-3">
              {group.items.map((proj, pi) => (
                <motion.div
                  key={proj.slug}
                  {...(reducedMotion ? {} : {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-50px' },
                    transition: { duration: 0.5, delay: pi * 0.06, ease: [0.22, 1, 0.36, 1] },
                  })}
                >
                  <ProjectCardMobile project={proj} variant="compact" index={pi} />
                </motion.div>
              ))}
            </div>
          )
        })}
      </div>
    </section>
  )
}
