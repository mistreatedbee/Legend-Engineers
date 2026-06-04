import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const media = [
  { type: 'video', src: '/civil2.mp4', label: 'Civil Works', caption: 'Site operations & bulk earthworks' },
  { type: 'video', src: '/civil3.mp4', label: 'Civil Engineering', caption: 'Road construction & drainage' },
  { type: 'video', src: '/mechanical1.mp4', label: 'Mechanical', caption: 'Industrial piping & welding' },
  { type: 'video', src: '/civil4.mp4', label: 'Civil Works', caption: 'Concrete & structural works' },
  { type: 'video', src: '/civil5.mp4', label: 'Civil Construction', caption: 'Infrastructure & civil works' },
  { type: 'video', src: '/geotechnical1.mp4', label: 'Geotechnical', caption: 'Geotechnical investigation in progress' },
  { type: 'video', src: '/video4.mp4', label: 'Field Operations', caption: 'Project site footage' },
  { type: 'video', src: '/video5.mp4', label: 'Engineering Works', caption: 'Project site footage' },
  { type: 'video', src: '/video8.mp4', label: 'Site Works', caption: 'Project site footage' },
];

function VideoCard({ item, idx }: { item: typeof media[0]; idx: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);

  const toggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: idx * 0.07 }}
      className="group relative overflow-hidden aspect-video bg-ink/10 cursor-pointer shadow-xl"
      onClick={toggle}>
      <video
        ref={videoRef}
        src={item.src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
      <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors" />
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/70 to-transparent">
        <span className="eyebrow text-cream/80 text-[10px] block mb-1">{item.label}</span>
        <p className="font-display text-cream text-sm font-light leading-tight">{item.caption}</p>
      </div>
      {paused && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 bg-cream/20 backdrop-blur-md flex items-center justify-center">
            <Play size={20} className="text-cream ml-1" />
          </div>
        </div>
      )}
    </motion.div>
  );
}

export function Gallery() {
  return (
    <section
      id="gallery"
      className="relative bg-ink dark:bg-dark-surface py-32 md:py-40">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
          <div className="col-span-12 md:col-span-3 flex items-start gap-4">
            <span className="w-12 h-px bg-white/40 mt-3"></span>
            <span className="eyebrow text-white/60">Chapter 04.5 — In the Field</span>
          </div>
          <div className="col-span-12 md:col-span-9">
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-cream font-light text-balance">
              Work that{' '}
              <em className="italic text-brand-400 font-normal">speaks</em>{' '}
              for itself.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {media.map((item, idx) => (
            <VideoCard key={item.src} item={item} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
}
