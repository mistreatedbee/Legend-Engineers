import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const services = [
{
  num: '01',
  id: 'geotechnical',
  title: 'Geotechnical',
  italic: 'Engineering',
  videoSrc: '/video2.mp4',
  desc: 'Comprehensive soil and rock investigations providing authoritative reports that guide safe, cost-effective foundation decisions — required for NHBRC enrollment and municipal approvals.',
  features: [
  'Geotechnical Investigations & Site Profiling',
  'Dolomite Studies (SANS 1936)',
  'Geohydrological Assessments',
  'NHBRC Enrolments',
  'Foundation Design Recommendations',
  'DPSH, SPT & DCP In-Situ Testing',
  'Nuclear Density Compaction Tests',
  'Stability Assessments']
},
{
  num: '02',
  id: 'civil',
  title: 'Civil',
  italic: 'Engineering',
  videoSrc: '/civil1.mp4',
  desc: 'Bulk civil works from earthworks to finished surfaces — at power stations, industrial facilities, residential developments and public road infrastructure. All works SANS & QMS compliant.',
  features: [
  'Bulk Concrete Works',
  'Underground Piping: Stormwater, Drainage, Fire & Municipal Water',
  'Bulk Earthworks & Road Construction (Asphalt, Single/Double Seal)',
  'Road Drainage: V-drain, Earth Drain, Sub-soil Drain',
  'Concrete Edge Beams & Road Signage',
  'Road Maintenance: Patching, Shoulder Repairs, Edge Break']
},
{
  num: '03',
  id: 'laboratory',
  title: 'Laboratory',
  italic: 'Testing',
  image: '/laboratory testing.jpeg',
  desc: 'Accurate material testing and analysis for engineering projects of every scale — from residential foundation samples to large-scale road construction quality assurance.',
  features: [
  'Rock Testing & Classification',
  'Soil Testing & Profiling',
  'Concrete Testing (Cylinders & Cubes)',
  'Borrow Pit Material Analysis',
  'Nuclear Density Compaction Testing',
  'Quality Assurance Reporting']
},
{
  num: '04',
  id: 'mechanical',
  title: 'Mechanical',
  italic: 'Engineering',
  videoSrc: '/mechanical1.mp4',
  desc: 'Industrial piping installation, specialised welding and pressure vessel services. Proven at Eskom power stations across a wide range of pipe materials and welding grades.',
  features: [
  'Piping: Galvanised, Stainless Steel, Copper, HDPE, PVC, Screw',
  'Welding: Carbon Steel, Stainless Steel, Chrome-Moly, Duplex Grade',
  'Specialised Vessel & Tubing Welding',
  'Vessel Pressure Testing & Certification',
  'Plant Engineering & Equipment Assessments',
  'Maintenance Consulting']
},
{
  num: '05',
  id: 'surveying',
  title: 'Surveying',
  italic: 'Services',
  image: '/photo3.jpeg',
  desc: 'Precise topographical and engineering surveys using the latest instruments — from borrow pit surveys to centre-line surveys for road construction projects nationwide.',
  features: [
  'Borrow Pit Surveys',
  'Centre-Line Surveys',
  'Site Topographical Surveys',
  'Engineering Surveys',
  'Road Pavement Design Surveys',
  'GPS & Total Station Surveys']
},
{
  num: '06',
  id: 'electrical',
  title: 'Electrical',
  italic: 'Engineering',
  videoSrc: '/video6.mp4',
  desc: 'Electrical engineering services for industrial, commercial and residential projects. Contact us for a detailed scope assessment tailored to your project requirements.',
  features: [
  'Industrial Electrical Installations',
  'Commercial Electrical Works',
  'Instrumentation Services',
  'Electrical Spares Supply & Delivery',
  'Condition Assessments',
  'Project Consulting']
},
{
  num: '07',
  id: 'building',
  title: 'Building',
  italic: '& Plumbing',
  image: '/Building & Plumbing.jpeg',
  desc: 'Full building construction and plumbing services for residential and commercial clients — from concrete base construction to complete suction and discharge plumbing systems.',
  features: [
  'General Building Construction',
  'Plumbing Works',
  'Suction & Discharge Pipe Installations',
  'Water Tank Installation',
  'Rising Damp Inspection & Remediation',
  'Concrete Foundation Works']
},
{
  num: '08',
  id: 'supply',
  title: 'Supply',
  italic: '& Delivery',
  image: '/photo6.jpeg',
  desc: 'Comprehensive supply and delivery of engineering materials, spares and general goods to project sites and institutional clients — including Eskom power stations and government departments.',
  features: [
  'Mechanical, Electrical & Instrumentation Spares',
  'Conveyor Spares & Equipment',
  'Piping, Fittings & Tools',
  'Office Furniture & Décor',
  'Groceries & Provisions',
  'Site Equipment & Materials']
},
{
  num: '09',
  id: 'consulting',
  title: 'Reporting',
  italic: '& Consulting',
  image: '/photo13.jpeg',
  desc: 'Detailed technical reports, compliance documentation and expert recommendations. SAIEG-classified development suitability assessments with full foundation design guidance.',
  features: [
  'Comprehensive Geotechnical Investigation Reports',
  'Site Locality & Test Pit Position Maps',
  'Compliance & Feasibility Studies',
  'NHBRC Submission Documentation',
  'Foundation Type Recommendations',
  'Professional Consulting & Advisory']
}];

export function Services() {
  return (
    <section
      id="services"
      className="relative bg-cream-50 dark:bg-dark-surface py-32 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
            <span className="eyebrow text-ink/60 dark:text-white/60">
              Chapter 02 — Disciplines
            </span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
              Nine disciplines,{' '}
              <em className="italic text-brand-700 dark:text-brand-400 font-normal">
                one
              </em>{' '}
              standard of care.
            </h2>
          </div>
        </div>

        {/* Alternating editorial rows */}
        <div className="space-y-32 md:space-y-40">
          {services.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.8 }}
                className="grid grid-cols-12 gap-6 md:gap-10 items-center">

                {/* Media column */}
                <div className={`col-span-12 lg:col-span-7 ${isEven ? 'lg:order-1' : 'lg:order-2 lg:col-start-6'}`}>
                  <div className="relative aspect-[4/3] overflow-hidden shadow-2xl group">
                    {service.videoSrc ? (
                      <video
                        src={service.videoSrc}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover" />
                    ) : (
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                    )}
                    <span className="absolute top-6 left-6 font-display text-7xl md:text-8xl text-cream font-light leading-none drop-shadow-2xl">
                      {service.num}
                    </span>
                  </div>
                </div>

                {/* Text column */}
                <div className={`col-span-12 lg:col-span-4 ${isEven ? 'lg:order-2 lg:col-start-9' : 'lg:order-1 lg:col-start-2'}`}>
                  <span className="eyebrow text-brand-700 dark:text-brand-400 mb-6 block">
                    Discipline {service.num}
                  </span>
                  <h3 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-[-0.02em] text-ink dark:text-cream font-light mb-6">
                    {service.title}{' '}
                    <em className="italic font-normal text-brand-700 dark:text-brand-400">
                      {service.italic}
                    </em>
                  </h3>
                  <p className="text-lg text-ink/70 dark:text-white/70 leading-relaxed mb-8 font-light text-pretty">
                    {service.desc}
                  </p>

                  <ul className="space-y-3 mb-10">
                    {service.features.map((feat, i) =>
                    <li key={i} className="flex items-baseline gap-4 font-light">
                        <span className="font-mono text-[10px] text-ink/40 dark:text-white/40 uppercase tracking-wider flex-shrink-0">
                          0{i + 1}
                        </span>
                        <span className="text-ink/80 dark:text-white/80">
                          {feat}
                        </span>
                      </li>
                    )}
                  </ul>

                  <a
                    href="#quote"
                    className="group inline-flex items-center gap-3 text-ink dark:text-cream border-b border-ink/30 dark:border-white/30 hover:border-brand-700 dark:hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors pb-2">
                    <span className="font-mono text-xs uppercase tracking-[0.18em]">
                      Request a quote
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="group-hover:rotate-45 transition-transform duration-500" />
                  </a>
                </div>
              </motion.article>);
          })}
        </div>
      </div>
    </section>);
}
