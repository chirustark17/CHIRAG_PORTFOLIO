import { useEffect, useState } from 'react'
import { Link } from 'react-scroll'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'

const NAV_LINKS = [
  { label: 'about', to: 'about' },
  { label: 'projects', to: 'projects' },
  { label: 'skills', to: 'skills' },
  { label: 'certifications', to: 'certifications' },
  { label: 'selected work', to: 'selected-work' },
  { label: 'contact', to: 'contact' },
]

const LINK_PROPS = {
  smooth: true,
  duration: 600,
  offset: -80,
  spy: true,
  activeClass: 'text-cyan-400',
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setIsOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-xl bg-bone-50/70 dark:bg-ink-950/70 border-b border-ink-900/10 dark:border-bone-50/10">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-serif text-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
          >
            Chirag K S
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                {...LINK_PROPS}
                className="font-sans text-sm tracking-wide opacity-70 hover:opacity-100 hover:text-cyan-400 transition cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <ThemeToggle />
          </div>

          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-current/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950"
            onClick={() => setIsOpen((o) => !o)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {isOpen && (
        <nav id="mobile-nav" aria-label="Mobile navigation" className="fixed inset-0 z-40 bg-bone-50 dark:bg-ink-950 flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              {...LINK_PROPS}
              offset={-64}
              onClick={() => setIsOpen(false)}
              className="font-serif text-4xl cursor-pointer hover:text-cyan-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      )}
    </>
  )
}

export default Navbar
