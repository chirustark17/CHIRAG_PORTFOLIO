// --- src/App.js ---

import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';

// --- Icon Library ---
import { Github, Linkedin, Mail, Download, ArrowRight, Code, BarChart, BrainCircuit, Database, Award } from 'lucide-react';

// --- Portfolio Data ---
const portfolioData = {
  name: "Chirag K.S.",
  title: "Data Scientist & Developer",
  aboutMe: "I'm a Computer Science student at Presidency University, operating at the intersection of code and creativity. I thrive on building with Python, Java, and SQL while thinking through human-centered design principles. Hackathons and collaborative projects are my testing grounds, where technical skills meet real-world constraints. My goal is to build solutions that are not just functional, but also intuitive and meaningful.",
  contactInfo: {
    email: "chiruchirag2447@gmail.com",
    linkedin: "https://linkedin.com/in/chirag-ks",
    github: "https://github.com/chirustark17",
    resumeUrl: "#", // IMPORTANT: Link to your resume PDF here
  },
  skills: [
    { name: "Languages", icon: Code, items: "Python, R, SQL, JavaScript, HTML/CSS" },
    { name: "Databases", icon: Database, items: "MySQL, RDBMS" },
    { name: "Data Analytics & ML", icon: BrainCircuit, items: "Pandas, NumPy, Scikit-learn, EDA, NLP" },
    { name: "Visualization", icon: BarChart, items: "Tableau, Power BI, Streamlit, Matplotlib" },
  ],
  projects: [
    // COMMENT: To change project images, update the 'imageUrl' path for each project below.
    // Ensure your images are in the 'public/images' folder.
    { name: "Rakshakanetra Crime Analytics", description: "A predictive analytics dashboard for law enforcement, built for the Namma Suraksha Hackathon. It forecasts crime types, identifies hotspots, and supports data-driven police deployment.", techStack: ["Python", "Streamlit", "Machine Learning", "Google Maps API"], githubUrl: "https://github.com/chirustark17/chirustark17-Rakshakanetra-Crime-Dashboard", liveDemoUrl: "https://www.linkedin.com/posts/chirag-ks_rakshakanetra-crimeanalytics-smartpolicing-activity-7323633818496618496-2zBU", imageUrl: "./images/rakshakanetra.png" },
    { name: "Tableau Dashboard Showcase", description: "A collection of business intelligence dashboards analyzing customer churn, NYC Airbnb markets, and superstore sales performance to drive strategic insights.", techStack: ["Tableau", "BI", "Data Analysis"], githubUrl: "https://github.com/chirustark17/BUSINESS_INTELLIGENCE-Tableau-Power-BI-", liveDemoUrl: null, imageUrl: "./images/Screenshot 2025-08-11 014231.png" },
    { name: "Arduino Antenna Positioning", description: "A sensor-based embedded system for automated antenna control and alignment. This project was selected in the Top 100 out of 450+ entries for innovation in control systems.", techStack: ["Arduino", "C++", "Embedded Systems"], githubUrl: null, liveDemoUrl: "https://www.linkedin.com/posts/chirag-ks_we-were-particularly-proud-as-this-marked-activity-7177720706640539649-5bSn", imageUrl: "./images/arduino.jpeg" },
    { name: "Campus Placement Platform", description: "Developed an innovative platform using Raspberry Pi to streamline campus placement processes. The system connected students, employers, and placement officers for a seamless experience.", techStack: ["Raspberry Pi", "Python", "Web Server"], githubUrl: null, liveDemoUrl: "https://www.linkedin.com/posts/chirag-ks_throwback-raspberrypi-iot-activity-7361139377349029888-6hiO", imageUrl: "./images/raspi_team.jpg" },
    { name: "Age Calculator App", description: "A simple and intuitive web application built with vanilla JavaScript to calculate a user's age based on their date of birth. A fun front-end development exercise.", techStack: ["JavaScript", "HTML5", "CSS3", "Vercel"], githubUrl: "https://github.com/chirustark17/age-calculator-app", liveDemoUrl: "https://age-calculator-app-teal-one.vercel.app/", imageUrl: "./images/age_calculator_app.png" },
    { name: "Data Handling & Visualization", description: "A project focused on the fundamentals of data manipulation and visualization using core Python libraries. Associated with Presidency University Bangalore.", techStack: ["Python", "Data Visualization", "Pandas", "NumPy"], githubUrl: "https://github.com/chirustark17/Data_Handling_01", liveDemoUrl: null, imageUrl: "https://placehold.co/1200x800/e9ecef/212529?text=Data+Handling" }
  ],
  experience: [
    { role: "Team Lead | Namma Suraksha Hackathon", period: "Top 30 Nationally", description: "Led team 'Falcons' in developing 'Rakshakanetra'. Responsible for system design, front-end development with Streamlit, and ML model integration." },
    { role: "Raspberry Pi Project – Inter-Linked Platform for Campus Placements", period: "Top 70 out of 900+ Projects", description: "Presented at the 4th Innovative Project Expo 2024 at Presidency University. Developed a platform to streamline campus placements for students and employers." },
    { role: "Arduino Antenna Positioning System", period: "Top 100 out of 450+ Projects", description: "Developed a sensor-based embedded system for automated antenna control. Showcased innovation in control systems and hardware integration." },
    { role: "B.Tech, Computer Science & Data Science", period: "2022 - 2026", description: "Presidency University, Bangalore | CGPA: 8.61" }
  ],
  certifications: [
    "AI/ML for Geodata Analysis – ISRO & IIRS", "Data Analysis with R – Google (Coursera)", "Data Science BootCamp – GeeksforGeeks", "Deloitte Data Analytics Job Simulation", "AI with Python - Infosys Springboard", "Prompt Engineering for Developers – DeepLearning.AI"
  ]
};

// --- Main App Component ---
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainContainerRef = useRef(null);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    const gsapScript = document.createElement('script'); gsapScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js'; gsapScript.async = true; document.body.appendChild(gsapScript);
    gsapScript.onload = () => {
      const scrollTriggerScript = document.createElement('script'); scrollTriggerScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js'; scrollTriggerScript.async = true; document.body.appendChild(scrollTriggerScript);
      scrollTriggerScript.onload = () => { setScriptsLoaded(true); };
    };
  }, []);

  useLayoutEffect(() => {
    if (!scriptsLoaded) return;
    const { gsap } = window; gsap.registerPlugin(window.ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from("#hero-title", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
      gsap.from("#hero-subtitle", { opacity: 0, y: 30, duration: 1, delay: 0.4 });
      gsap.from("#hero-buttons", { opacity: 0, y: 30, duration: 1, delay: 0.6 });
      gsap.from("#hero-image", { opacity: 0, scale: 0.9, duration: 1, delay: 0.8 });
      const sectionTitles = gsap.utils.toArray('.section-title');
      sectionTitles.forEach(title => { gsap.from(title, { scrollTrigger: { trigger: title, start: "top 85%", toggleActions: "play none none none", }, opacity: 0, y: 30, duration: 0.8 }); });
      const animatedLists = gsap.utils.toArray('.animated-list');
      animatedLists.forEach(list => { gsap.from(list.children, { scrollTrigger: { trigger: list, start: "top 85%", toggleActions: "play none none none", }, opacity: 0, y: 20, duration: 0.5, stagger: 0.1 }); });
      const projects = gsap.utils.toArray('.project-card');
      if (projects.length > 0) { gsap.to(projects, { scrollTrigger: { trigger: "#projects", start: "top top", end: () => "+=" + (projects.length * 350), scrub: 1, pin: true, anticipatePin: 1, }, opacity: 1, y: 0, stagger: 0.2, ease: "power1.inOut" }); }
    }, mainContainerRef);
    return () => ctx.revert();
  }, [scriptsLoaded]);

  return (
    <>
    <style>{`
      /* --- Global Styles & Variables --- */
      :root {
        --bg-light: #f8f9fa;
        --text-dark: #212529;
        --text-muted: #6c757d;
        --accent-blue: #0d6efd;
        --accent-blue-darker: #0b5ed7;
        --border-color: #dee2e6;
        --white: #ffffff;
        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }

      /* Conic Gradient Animation Property */
      @property --angle {
        syntax: '<angle>';
        initial-value: 0deg;
        inherits: false;
      }

      body {
        background-color: var(--bg-light);
        color: var(--text-dark);
        font-family: var(--font-sans);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        line-height: 1.6;
      }

      .container {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px;
      }

      /* --- Header & Navigation --- */
      header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 40;
        background-color: rgba(248, 249, 250, 0.8);
        backdrop-filter: blur(10px);
        border-bottom: 1px solid var(--border-color);
      }

      header nav.container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        padding-bottom: 1rem;
      }

      .logo {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--accent-blue);
        text-decoration: none;
      }

      .nav-links {
        display: none; /* Hidden on mobile */
        align-items: center;
        gap: 2rem;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .nav-links a {
        color: var(--text-muted);
        text-decoration: none;
        transition: color 0.3s;
      }

      .nav-links a:hover {
        color: var(--text-dark);
      }

      .mobile-menu-button {
        display: block; /* Shown on mobile */
        background: none;
        border: none;
        cursor: pointer;
      }

      .mobile-menu {
        display: block;
        background-color: var(--white);
        padding: 0.5rem 0;
        border-top: 1px solid var(--border-color);
      }

      .mobile-menu a {
        display: block;
        text-align: center;
        padding: 0.75rem 1rem;
        font-size: 0.875rem;
        text-decoration: none;
        color: var(--text-dark);
      }

      .mobile-menu a:hover {
        background-color: #f1f3f5;
      }

      /* --- Main Content & Sections --- */
      main {
        padding-top: 6rem;
      }

      section {
        padding: 6rem 0;
      }

      .section-title {
        font-size: 2rem;
        font-weight: 700;
        text-align: center;
        margin-bottom: 1rem;
      }

      .section-subtitle {
        text-align: center;
        color: var(--text-muted);
        margin-bottom: 3rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      /* --- Hero Section --- */
      #hero {
        min-height: 100vh;
        display: flex;
        align-items: center;
      }

      .hero-content {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
        align-items: center;
        width: 100%;
      }

      .hero-text {
        text-align: center;
      }

      #hero-title {
        font-size: 2.5rem;
        font-weight: 800;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      #hero-subtitle {
        font-size: 1.125rem;
        color: var(--text-muted);
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      #hero-buttons {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
      }

      .hero-image-container {
        display: flex;
        justify-content: center;
        position: relative;
      }

      .hero-image {
        position: relative;
        width: 18rem;
        height: 18rem;
        border-radius: 9999px;
        object-fit: cover;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }

      .hero-image-bg {
        position: absolute;
        inset: 0;
        background-color: #e9ecef;
        border-radius: 9999px;
        filter: blur(2rem);
        opacity: 0.5;
      }

      /* --- Skills Section --- */
      .skills-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .skill-item {
        background-color: var(--white);
        padding: 1.5rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        text-align: center;
      }

      .skill-icon {
        width: 2.5rem;
        height: 2.5rem;
        margin: 0 auto 1rem auto;
        color: var(--accent-blue);
      }

      .skill-name {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .skill-items {
        font-size: 0.875rem;
        color: var(--text-muted);
        min-height: 40px; /* Ensures consistent height */
      }

      /* --- Projects Section --- */
      .projects-header {
        position: sticky;
        top: 0;
        padding-top: 4rem;
        padding-bottom: 3rem;
        background-color: var(--bg-light);
        z-index: 30;
      }

      .projects-grid {
        position: relative;
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        z-index: 10;
      }

      .project-card {
        display: flex; /* Changed to flex */
        flex-direction: column; /* Stack items vertically */
        background-color: var(--white);
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.07);
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        opacity: 0; /* Initial state for GSAP */
        transform: translateY(4rem); /* Initial state for GSAP */
        transition: box-shadow 0.3s;
        position: relative;
      }

      .project-card:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
      }

      .project-card-main-link {
        text-decoration: none;
        color: inherit;
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }

      .project-image {
        width: 100%;
        height: 14rem;
        object-fit: cover;
        flex-shrink: 0;
      }
      
      .project-content-top {
        padding: 1.5rem 1.5rem 0 1.5rem;
        flex-grow: 1;
      }

      .project-content-bottom {
        padding: 0 1.5rem 1.5rem 1.5rem;
        margin-top: auto;
      }

      .project-content-top h3 {
        font-size: 1.25rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
        min-height: 2.5rem;
      }

      .project-content-top p {
        color: var(--text-muted);
        font-size: 0.875rem;
        margin-bottom: 1rem;
      }

      .project-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
        min-height: 3.5rem;
      }

      .project-tags span {
        background-color: #e9ecef;
        color: #495057;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
      }

      .project-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: auto;
      }

      .project-links {
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .project-links a {
        color: var(--text-muted);
        transition: color 0.3s;
        position: relative;
        z-index: 20;
      }

      .project-links a:hover {
        color: var(--accent-blue);
      }


      /* --- Experience Section --- */
      .journey-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
      }

      .journey-subtitle {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      .timeline {
        position: relative;
        border-left: 2px solid var(--border-color);
      }

      .timeline-item {
        position: relative;
        padding-left: 2rem;
        margin-bottom: 2rem;
      }

      .timeline-marker {
        position: absolute;
        left: -11px;
        top: 4px;
        width: 20px;
        height: 20px;
        border-radius: 9999px;
        border: 4px solid var(--white);
        background: conic-gradient(from var(--angle), #4285F4, #DB4437, #F4B400, #0F9D58, #4285F4);
        animation: rotate 4s linear infinite;
      }

      .timeline-period {
        font-size: 0.875rem;
        color: var(--text-muted);
      }

      .timeline-role {
        font-weight: 600;
      }

      .timeline-description {
        font-size: 0.875rem;
        color: var(--text-muted);
      }

      .certifications-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .certifications-list li {
        display: flex;
        align-items: center;
        background-color: var(--white);
        padding: 1rem;
        border-radius: 0.5rem;
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
      }

      /* --- Contact Section --- */
      #contact {
        text-align: center;
      }

      .contact-buttons {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
      }

      .social-link {
        color: var(--text-muted);
        padding: 0.75rem;
        border-radius: 9999px;
        background-color: var(--white);
        border: 1px solid var(--border-color);
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
        transition: all 0.3s;
      }

      .social-link:hover {
        color: var(--accent-blue);
      }

      /* --- Footer --- */
      footer {
        padding: 2rem 0;
        text-align: center;
        font-size: 0.875rem;
        color: var(--text-muted);
        border-top: 1px solid var(--border-color);
      }

      footer p:last-child {
        margin-top: 0.25rem;
      }

      /* --- Buttons & Icons --- */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        background-color: var(--white);
        border: 1px solid var(--border-color);
        color: var(--text-dark);
        font-weight: 500;
        border-radius: 0.375rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07);
        text-decoration: none;
        transition: all 0.3s;
        transform: scale(1);
      }

      .btn:hover {
        transform: scale(1.05);
      }

      .btn-primary {
        background-color: var(--accent-blue);
        color: var(--white);
        border-color: var(--accent-blue);
      }

      .btn-primary:hover {
        background-color: var(--accent-blue-darker);
      }

      .btn .icon {
        margin-right: 0.5rem;
        width: 1.25rem;
        height: 1.25rem;
      }

      .icon-award {
        width: 1.5rem;
        height: 1.5rem;
        color: var(--accent-blue);
        margin-right: 1rem;
        flex-shrink: 0;
      }

      /* --- Responsive Media Queries --- */
      @media (min-width: 768px) {
        .nav-links { display: flex; }
        .mobile-menu-button { display: none; }
        .mobile-menu { display: none; }
        #hero-title { font-size: 3.75rem; }
        .hero-content { grid-template-columns: 3fr 2fr; }
        .hero-text { text-align: left; }
        #hero-subtitle { margin-left: 0; }
        #hero-buttons { flex-direction: row; justify-content: flex-start; }
        .hero-image { width: 24rem; height: 24rem; }
        .skills-grid { grid-template-columns: repeat(4, 1fr); }
        .projects-grid { grid-template-columns: repeat(2, 1fr); }
        .journey-grid { grid-template-columns: repeat(2, 1fr); }
        .journey-subtitle { text-align: left; }
      }

      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    `}</style>
    <div ref={mainContainerRef}>
      <header>
        <nav className="container">
          <a href="#hero" className="logo">CKS.</a>
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#contact" className="btn">Contact</a>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </nav>
        {isMenuOpen && (
          <div className="mobile-menu">
            <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
            <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
            <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
            <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div>
        )}
      </header>
      <main className="container">
        <section id="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 id="hero-title">{portfolioData.name}</h1>
              <p id="hero-subtitle">{portfolioData.title}</p>
              <div id="hero-buttons">
                <a href={portfolioData.contactInfo.resumeUrl} download className="btn btn-primary"><Download className="icon" />Download Resume</a>
                <a href="#contact" className="btn"><ArrowRight className="icon" />Contact Info</a>
              </div>
            </div>
            <div id="hero-image" className="hero-image-container">
              <div className="hero-image-bg"></div>
              <img className="hero-image" src="./images/chirag.jpg" alt="Chirag K.S Headshot" />
            </div>
          </div>
        </section>
        <section id="about">
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">{portfolioData.aboutMe}</p>
          <div className="skills-grid animated-list">
            {portfolioData.skills.map((skill, index) => (<div key={index} className="skill-item"><skill.icon className="skill-icon" /><h3 className="skill-name">{skill.name}</h3><p className="skill-items">{skill.items}</p></div>))}
          </div>
        </section>
        <section id="projects">
          <div className="projects-header">
              <h2 className="section-title">My Portfolio</h2>
              <p className="section-subtitle">A selection of projects that showcase my passion for turning data into meaningful insights.</p>
          </div>
          <div id="projects-container" className="projects-grid">
              {portfolioData.projects.map((project, index) => (
                  <div key={index} className="project-card">
                      <a href={project.githubUrl || project.liveDemoUrl || '#'} target="_blank" rel="noopener noreferrer" className="project-card-main-link">
                          <img src={project.imageUrl} alt={project.name} className="project-image" />
                          <div className="project-content-top">
                              <h3>{project.name}</h3>
                              <p>{project.description}</p>
                          </div>
                      </a>
                      <div className="project-content-bottom">
                          <div className="project-tags">
                              {project.techStack.map((tech) => (<span key={tech}>{tech}</span>))}
                          </div>
                          <div className="project-footer">
                              <div className="project-links">
                                  {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github /></a>}
                                  {project.liveDemoUrl && (<a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer"><ArrowRight /></a>)}
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
        </section>
        <section id="experience">
          <h2 className="section-title">Career Journey</h2>
          <div className="journey-grid">
              <div>
                  <h3 className="journey-subtitle">Experience & Education</h3>
                  <div className="timeline animated-list">
                      {portfolioData.experience.map((item, index) => (
                          <div key={index} className="timeline-item">
                              <div className="timeline-marker"></div>
                              <p className="timeline-period">{item.period}</p>
                              <h4 className="timeline-role">{item.role}</h4>
                              <p className="timeline-description">{item.description}</p>
                          </div>
                      ))}
                  </div>
              </div>
              <div>
                  <h3 className="journey-subtitle">Certifications</h3>
                  <ul className="certifications-list animated-list">
                      {portfolioData.certifications.map((cert, index) => (
                          <li key={index}><Award className="icon-award" /><span>{cert}</span></li>
                      ))}
                  </ul>
              </div>
          </div>
        </section>
        <section id="contact">
          <h2 className="section-title">Let's Connect</h2>
          <p className="section-subtitle">I'm currently seeking internship opportunities. If you have a project in mind or just want to connect, feel free to reach out.</p>
          <div className="contact-buttons">
            <a href={`mailto:${portfolioData.contactInfo.email}`} className="btn btn-primary"><Mail className="icon" />Say Hello</a>
            <a href={portfolioData.contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="social-link"><Linkedin /></a>
            <a href={portfolioData.contactInfo.github} target="_blank" rel="noopener noreferrer" className="social-link"><Github /></a>
          </div>
        </section>
      </main>
      <footer>
        <p>Copyright © {new Date().getFullYear()} {portfolioData.name}. All Rights Reserved.</p>
        <p>Designed & Built with React & GSAP</p>
      </footer>
    </div>
    </>
  );
};

export default App;
