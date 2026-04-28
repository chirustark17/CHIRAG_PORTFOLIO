import { SectionHeading } from '../components/SectionHeading'

export function About() {
  return (
    <section id="about" aria-label="About" className="section">
      <SectionHeading eyebrow="01 — identity" title="About" />

      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6 max-w-prose">
          <p className="font-sans text-lg leading-relaxed opacity-85">
            Computer Science final-year at Presidency University, Bengaluru,
            specializing in Data Science. Microsoft Azure (AZ-900) certified,
            working across Python, SQL, and machine learning. I've led hackathon
            teams, shipped analytics-driven projects, and built a habit of
            turning messy data into something a decision-maker can actually act on.
          </p>
          <p className="font-sans text-lg leading-relaxed opacity-85">
            The work I'm proudest of lives at that intersection — analyzing
            300K+ crime records to support smarter policing, processing public
            feedback on draft legislation through transformer-based NLP,
            predicting groundwater levels from spatio-temporal data for
            sustainable water planning. Each one started with a real question
            and ended in a dashboard someone could use.
          </p>
          <p className="font-sans text-lg leading-relaxed opacity-85">
            I'm aiming at roles where data science meets production — cloud-native
            analytics, applied AI, and early MLOps. I care about systems that ship,
            not demos that impress. Open to full-time opportunities.
          </p>
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-current/15 p-6 space-y-5 bg-ink-900/2 dark:bg-bone-50/2 sticky top-24">
            {[
              { label: 'location', value: 'Bengaluru, India' },
              { label: 'degree', value: 'B.Tech CSE (Data Science)' },
              { label: 'university', value: 'Presidency University' },
              { label: 'status', value: 'Open to roles' },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
                  {label}
                </span>
                <span className="font-serif text-lg">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
