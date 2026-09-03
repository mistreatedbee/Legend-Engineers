import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Projects, Project } from './components/Projects';
import { ProjectDetail } from './components/ProjectDetail';
import { Equipment } from './components/Equipment';
import { Careers } from './components/Careers';
import { Forms } from './components/Forms';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { FloatingWidgets } from './components/FloatingWidgets';

export function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Give each project a real, bookmarkable/shareable URL (/projects/<slug>)
  // without adding a router to the public bundle — plain history API.
  const selectProject = (project: Project) => {
    setSelectedProject(project);
    if (project.slug) {
      window.history.pushState({}, '', `/projects/${project.slug}`);
    }
  };

  const handleBack = () => {
    setSelectedProject(null);
    if (window.location.pathname.startsWith('/projects/')) {
      window.history.pushState({}, '', '/');
    }
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // On load, if the URL already points at a project (e.g. someone opened a
  // shared link), fetch and open it directly.
  useEffect(() => {
    const match = window.location.pathname.match(/^\/projects\/([^/]+)$/);
    if (!match) return;
    fetch(`/api/projects?slug=${encodeURIComponent(match[1])}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.project) {
          setSelectedProject({
            id: Number.isFinite(Number(data.project.id)) ? Number(data.project.id) : 0,
            slug: data.project.slug,
            title: data.project.title,
            category: data.project.category,
            company: data.project.company || 'Legend Engineers (PTY) LTD',
            location: data.project.location,
            client: data.project.client,
            services: data.project.services,
            description: data.project.description,
            scope: data.project.scope || [],
            date: data.project.completionDate,
            value: data.project.projectValue,
            poNumber: data.project.poNumber,
            contractNumber: data.project.contractNumber,
            gpsCoords: data.project.gpsCoords,
            siteArea: data.project.siteArea,
            image: data.project.coverImage,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      if (!window.location.pathname.startsWith('/projects/')) {
        setSelectedProject(null);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-ink dark:text-cream font-sans selection:bg-brand-700 selection:text-cream">
      <Navbar />

      <AnimatePresence mode="wait">
        {selectedProject ? (
          <ProjectDetail
            key="project-detail"
            project={selectedProject}
            onBack={handleBack}
          />
        ) : (
          <motion.main
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}>
            <Hero />
            <About />
            <Services />
            <WhyChooseUs />
            <Projects onSelectProject={selectProject} />
            <Gallery />
            <Equipment />
            <Careers />
            <Forms />
            <Testimonials />
            <FAQ />
          </motion.main>
        )}
      </AnimatePresence>

      {!selectedProject && <Footer />}
      <FloatingWidgets />
    </div>
  );
}
