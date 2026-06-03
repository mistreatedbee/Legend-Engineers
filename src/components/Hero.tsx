import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
export function Hero() {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 800], [0, 120]);
  const textY = useTransform(scrollY, [0, 800], [0, -40]);
  return (
    <section className="relative min-h-screen bg-cream dark:bg-dark-bg pt-32 md:pt-40 pb-20 overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12">
        {/* Eyebrow */}
        <motion.div
          initial={{
            opacity: 0,
            y: 20
          }}
          animate={{
            opacity: 1,
            y: 0
          }}
          transition={{
            duration: 0.6
          }}
          className="flex items-center gap-4 mb-12 md:mb-16">
          
          <span className="w-12 h-px bg-ink/40 dark:bg-white/40"></span>
          <span className="eyebrow text-ink/60 dark:text-white/60">
            Est. South Africa — NHBRC & CIDB Accredited
          </span>
        </motion.div>

        <div className="grid grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Massive editorial headline */}
          <motion.div
            style={{
              y: textY
            }}
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            transition={{
              duration: 0.8
            }}
            className="col-span-12 lg:col-span-8">
            
            <h1 className="font-display text-[15vw] lg:text-[11vw] xl:text-[10rem] leading-[0.88] tracking-[-0.04em] text-ink dark:text-cream font-light">
              <motion.span
                initial={{
                  opacity: 0,
                  y: 40
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.1
                }}
                className="block">
                
                Engineering,
              </motion.span>
              <motion.span
                initial={{
                  opacity: 0,
                  y: 40
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.25
                }}
                className="block italic text-brand-700 dark:text-brand-400 font-normal pl-[8%]"
                style={{
                  fontVariationSettings: '"opsz" 144, "wght" 400'
                }}>
                
                precisely
              </motion.span>
              <motion.span
                initial={{
                  opacity: 0,
                  y: 40
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.4
                }}
                className="block">
                
                delivered.
              </motion.span>
            </h1>
          </motion.div>

          {/* Right rail — caption + floating image */}
          <motion.div
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8,
              delay: 0.5
            }}
            className="col-span-12 lg:col-span-4 lg:pt-8">
            
            <motion.div
              style={{
                y: imageY
              }}
              className="relative aspect-[3/4] overflow-hidden bg-ink/5 mb-6 shadow-2xl">

              <video
                src="/video1.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover" />

            </motion.div>
            <p className="eyebrow text-ink/50 dark:text-white/50 text-[10px]">
              Fig. 01 — Legend Engineers, field operations
            </p>
          </motion.div>
        </div>

        {/* Sub-deck + CTAs row */}
        <div className="grid grid-cols-12 gap-6 md:gap-10 mt-20 md:mt-28">
          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.6
            }}
            className="col-span-12 md:col-span-5 md:col-start-2">
            
            <p className="font-display italic text-2xl md:text-3xl text-ink/70 dark:text-white/70 leading-snug text-pretty font-light">
              Geotechnical, civil and mechanical engineering — investigations,
              testing, design and consulting, delivered across South Africa with
              the care of a craftsman.
            </p>
          </motion.div>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.6,
              delay: 0.75
            }}
            className="col-span-12 md:col-span-4 md:col-start-9 flex flex-col gap-4 md:items-start">
            
            <a
              href="#booking"
              className="group inline-flex items-center gap-3 bg-ink dark:bg-cream text-cream dark:text-ink px-8 py-5 hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors">
              
              <span className="font-mono text-sm uppercase tracking-[0.18em]">
                Request Investigation
              </span>
              <ArrowUpRight
                size={18}
                className="group-hover:rotate-45 transition-transform duration-500" />
              
            </a>
            <a
              href="#quote"
              className="group inline-flex items-center gap-3 text-ink dark:text-cream px-2 py-2 border-b border-ink/30 dark:border-white/30 hover:border-brand-700 dark:hover:border-brand-400 hover:text-brand-700 dark:hover:text-brand-400 transition-colors w-fit">
              
              <span className="font-mono text-sm uppercase tracking-[0.18em]">
                Get Quotation
              </span>
              <ArrowUpRight size={16} />
            </a>
          </motion.div>
        </div>

        {/* Editorial stats footer */}
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          transition={{
            duration: 0.6,
            delay: 0.9
          }}
          className="mt-24 md:mt-32 pt-10 hairline grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          
          {[
          {
            value: '100+',
            label: 'Projects Delivered'
          },
          {
            value: '15',
            label: 'Years in Practice'
          },
          {
            value: '09',
            label: 'Provinces Served'
          },
          {
            value: '24h',
            label: 'Quote Turnaround'
          }].
          map((stat, idx) =>
          <div key={idx} className="flex flex-col gap-3">
              <span className="eyebrow text-ink/50 dark:text-white/50">
                0{idx + 1} / {stat.label}
              </span>
              <span className="font-display text-5xl md:text-6xl font-light text-ink dark:text-cream tracking-tight">
                {stat.value}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </section>);

}