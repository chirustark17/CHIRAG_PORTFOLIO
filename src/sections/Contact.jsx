import { useState } from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'
import { SectionHeading } from '../components/SectionHeading'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Contact() {
  const [formState, setFormState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setFormState('submitting')
    const formData = new FormData(e.target)
    formData.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY)
    formData.append('from_name', 'Portfolio Contact')
    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setFormState('success')
        e.target.reset()
      } else {
        setFormState('error')
        setErrorMessage(data.message || 'Submission failed')
      }
    } catch {
      setFormState('error')
      setErrorMessage('Network error — try again')
    }
  }

  return (
    <section id="contact" aria-label="Contact" className="section">
      <SectionHeading eyebrow="07 — let's talk" title="Get in touch" />

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left */}
        <div>
          <p className="font-serif text-3xl leading-snug">
            I'm open to full-time roles and interesting projects. The fastest way to reach me is below.
          </p>

          <div className="mt-10 space-y-5">
            {[
              { icon: <Mail size={20} />, label: 'email', content: <a href="mailto:chiruchirag2447@gmail.com" className={`font-sans text-base hover:text-cyan-400 transition ${FOCUS_RING} rounded`}>chiruchirag2447@gmail.com</a> },
              { icon: <Phone size={20} />, label: 'phone', content: <span className="font-sans text-base">+91 63633 95435</span> },
              { icon: <MapPin size={20} />, label: 'location', content: <span className="font-sans text-base">Bengaluru, India</span> },
            ].map(({ icon, label, content }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full border border-current/20 p-2.5 text-cyan-400 flex items-center justify-center shrink-0">
                  {icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">{label}</span>
                  {content}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href="https://github.com/chirustark17"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={`w-12 h-12 rounded-full border border-current/20 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition ${FOCUS_RING}`}
            >
              <GithubIcon />
            </a>
            <a
              href="https://www.linkedin.com/in/chirag-ks/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={`w-12 h-12 rounded-full border border-current/20 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition ${FOCUS_RING}`}
            >
              <LinkedinIcon />
            </a>
          </div>
        </div>

        {/* Right — contact form */}
        <div>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl border border-current/15 p-8 bg-ink-900/2 dark:bg-bone-50/2 space-y-5"
          >
            <div>
              <label htmlFor="contact-name" className="sr-only">Your name</label>
              <input
                id="contact-name"
                name="name"
                type="text"
                required
                placeholder="Your name"
                className={`w-full bg-transparent border-b border-current/20 focus:border-cyan-400 focus:outline-none py-3 font-sans transition placeholder:opacity-50 ${FOCUS_RING}`}
              />
            </div>
            <div>
              <label htmlFor="contact-email" className="sr-only">Your email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                required
                placeholder="your@email.com"
                className={`w-full bg-transparent border-b border-current/20 focus:border-cyan-400 focus:outline-none py-3 font-sans transition placeholder:opacity-50 ${FOCUS_RING}`}
              />
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="What are you building / hiring for?"
                className={`w-full bg-transparent border-b border-current/20 focus:border-cyan-400 focus:outline-none py-3 font-sans transition placeholder:opacity-50 resize-none ${FOCUS_RING}`}
              />
            </div>

            <button
              type="submit"
              disabled={formState === 'submitting'}
              className={`bg-cyan-400 text-ink-950 rounded-full px-8 py-3 font-medium hover:bg-cyan-300 disabled:opacity-50 transition font-sans ${FOCUS_RING}`}
            >
              {formState === 'submitting' ? 'Sending...' : 'Send message'}
            </button>

            {formState === 'success' && (
              <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-500 px-4 py-2 font-mono text-xs">
                Message sent. I'll reply within 48 hours.
              </div>
            )}
            {formState === 'error' && (
              <div className="rounded-full border border-red-500/40 bg-red-500/10 text-red-500 px-4 py-2 font-mono text-xs">
                {errorMessage}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
