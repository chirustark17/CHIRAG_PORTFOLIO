import skills from '../data/skills'
import { SectionHeading } from '../components/SectionHeading'

export function Skills() {
  return (
    <section id="skills" aria-label="Skills" className="section">
      <SectionHeading eyebrow="03 — toolkit" title="Skills" />

      <div className="space-y-10">
        {skills.map(({ category, items }) => (
          <div key={category}>
            <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400 mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <span
                  key={item}
                  className="px-4 py-2 rounded-full border border-current/20 font-mono text-xs hover:border-cyan-400 hover:text-cyan-400 transition cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
