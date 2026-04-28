import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import certifications from '../data/certifications'
import { SectionHeading } from '../components/SectionHeading'

function CertLogo({ src, alt, issuer }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="w-14 h-14 rounded-lg bg-current/5 p-2 shrink-0 flex items-center justify-center font-mono text-xs text-center">
        {issuer.slice(0, 2).toUpperCase()}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className="w-14 h-14 object-contain rounded-lg bg-current/5 p-2 shrink-0"
      onError={() => setError(true)}
    />
  )
}

export function Certifications() {
  return (
    <section id="certifications" aria-label="Certifications" className="section">
      <SectionHeading
        eyebrow="04 — credentials"
        title="Certifications"
        subtitle="Six verified. Links open the issuer's credential page."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {certifications.map((cert) => (
          <article
            key={cert.name}
            className="rounded-2xl border border-current/10 p-5 flex gap-4 items-start hover:border-cyan-400/50 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-15px_rgba(34,211,238,0.3)] transition-all duration-300"
          >
            <CertLogo src={cert.logo} alt={`${cert.issuer} logo`} issuer={cert.issuer} />

            <div className="flex-1">
              <h3 className="font-serif text-xl leading-tight">{cert.name}</h3>
              <p className="font-mono text-xs uppercase tracking-wider opacity-60 mt-1">
                {cert.issuer} · {cert.year}
              </p>
              <a
                href={cert.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-mono text-sm text-cyan-400 mt-3 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
              >
                Verify <ArrowUpRight size={14} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Certifications
