const slides = [
  {
    id: 'title',
    kind: 'title',
    eyebrow: 'highlight reel',
    headline: 'Chirag K S',
    subtitle: 'Data Science + Cloud',
    tagline: 'Building production systems that ship.'
  },
  {
    id: 'credentials',
    kind: 'credentials',
    eyebrow: '01 — credentials',
    title: 'Validated, ranked, and shipping.',
    stats: [
      { label: 'certified',     value: 'Azure AZ-900',  tone: 'cyan'  },
      { label: 'national rank', value: 'Top 30 / 450+', tone: 'amber' },
      { label: 'shipped',       value: '7 projects',    tone: 'cyan'  },
      { label: 'cgpa',          value: '8.66 / 10',     tone: 'cyan'  }
    ],
    counterTarget: 30,
    counterCaption: 'Top 30 of 450+ teams · Namma Suraksha National Hackathon'
  },
  {
    id: 'projects',
    kind: 'projects',
    eyebrow: '02 — selected projects',
    title: 'Real problems. Real datasets.',
    projects: [
      {
        slug: 'mca-sentiment',
        title: 'MCA Sentiment Engine',
        oneLiner: 'NLP on public feedback for draft legislation',
        image: '/images/projects/mca-sentiment.png'
      },
      {
        slug: 'rakshakanetra',
        title: 'Rakshakanetra',
        oneLiner: '300K+ crime records · Streamlit · ML hotspots',
        image: '/images/projects/rakshakanetra.png'
      },
      {
        slug: 'groundwater',
        title: 'Bhujal Anirikshana',
        oneLiner: 'Spatio-temporal groundwater prediction · Capstone',
        image: '/images/projects/groundwater.png'
      }
    ]
  },
  {
    id: 'featured',
    kind: 'featured',
    eyebrow: '03 — featured work',
    title: 'Dashboards built for decision-makers.',
    caption: 'Tableau dashboards translating analytics into action — built for non-technical stakeholders.',
    image: '/images/projects/tableau-dashboards.png'
  },
  {
    id: 'achievements',
    kind: 'achievements',
    eyebrow: '04 — recognition',
    title: 'Ranked, led, recognized.',
    items: [
      {
        rank: 'Top 30',
        rankOf: 'of 450+ teams',
        title: 'Namma Suraksha National Hackathon',
        description: 'Led 4-member Team Falcons. Built crime-analytics dashboard end-to-end.'
      },
      {
        rank: 'Host',
        rankOf: 'Microsoft, April 2026',
        title: 'Divergent Teams Hackathon',
        description: 'Volunteer, host, and interviewer — supported teams across the build cycle.'
      }
    ]
  },
  {
    id: 'contact',
    kind: 'contact',
    eyebrow: '05 — get in touch',
    title: "Hiring? Let's talk.",
    tagline: 'Open to full-time roles in data science, cloud, and applied AI.',
    links: [
      { label: 'email',    value: 'chiruchirag2447@gmail.com',       href: 'mailto:chiruchirag2447@gmail.com',      copyable: true  },
      { label: 'github',   value: 'github.com/chirustark17',          href: 'https://github.com/chirustark17',       copyable: false },
      { label: 'linkedin', value: 'linkedin.com/in/chirag-ks',        href: 'https://www.linkedin.com/in/chirag-ks', copyable: false }
    ]
  }
]

export default slides
