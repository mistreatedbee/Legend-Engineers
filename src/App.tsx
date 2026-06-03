import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Projects } from './components/Projects';
import { Equipment } from './components/Equipment';
import { Forms } from './components/Forms';
import { Testimonials } from './components/Testimonials';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { Gallery } from './components/Gallery';
import { FloatingWidgets } from './components/FloatingWidgets';
export function App() {
  return (
    <div className="min-h-screen bg-cream dark:bg-dark-bg text-ink dark:text-cream font-sans selection:bg-brand-700 selection:text-cream">
      <Navbar />

      <main>
        <Hero />
        <About />
        <Services />
        <WhyChooseUs />
        <Projects />
        <Gallery />
        <Equipment />
        <Forms />
        <Testimonials />
        <FAQ />
      </main>

      <Footer />
      <FloatingWidgets />
    </div>);

}