import React, { useState } from 'react';
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

  const handleBack = () => {
    setSelectedProject(null);
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

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
            <Projects onSelectProject={setSelectedProject} />
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
