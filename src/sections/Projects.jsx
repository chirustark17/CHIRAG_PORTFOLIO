import { motion } from 'framer-motion'
import projects from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'
import { SectionHeading } from '../components/SectionHeading'

export function Projects() {
  return (
    <section id="projects" aria-label="Projects" className="section">
      <SectionHeading
        eyebrow="02 — work"
        title="Projects"
        subtitle="Seven shipped. Source linked on each."
      />

      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </motion.div>
    </section>
  )
}

export default Projects
