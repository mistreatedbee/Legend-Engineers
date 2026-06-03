import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

type Status = 'idle' | 'submitting' | 'success';

const serviceOptions = [
  { value: 'geotechnical', label: 'Geotechnical Investigation' },
  { value: 'dolomite', label: 'Dolomite Study' },
  { value: 'nhbrc', label: 'NHBRC Enrollment' },
  { value: 'civil', label: 'Civil Engineering' },
  { value: 'mechanical', label: 'Mechanical Engineering' },
  { value: 'electrical', label: 'Electrical Engineering' },
  { value: 'building', label: 'Building & Plumbing' },
  { value: 'survey', label: 'Site Survey' },
  { value: 'lab', label: 'Laboratory Testing' },
  { value: 'supply', label: 'Supply & Delivery' },
];

const urgencyOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'emergency', label: 'Emergency' },
];

function EditorialInput({
  label,
  type = 'text',
  required = false,
  placeholder = '',
  as,
  options,
}: {
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  as?: 'textarea' | 'select';
  options?: { value: string; label: string }[];
}) {
  const selectOptions = options ?? serviceOptions;
  return (
    <label className="block group">
      <div className="flex items-baseline justify-between mb-3">
        <span className="eyebrow text-ink/60 dark:text-white/60">{label}</span>
        {required && (
          <span className="eyebrow text-brand-700 dark:text-brand-400">Required</span>
        )}
      </div>
      {as === 'textarea' ? (
        <textarea
          required={required}
          rows={3}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-ink dark:text-cream placeholder-ink/30 dark:placeholder-white/30 resize-none transition-colors" />
      ) : as === 'select' ? (
        <select
          required={required}
          className="w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-ink dark:text-cream transition-colors appearance-none cursor-pointer">
          <option value="" className="bg-cream dark:bg-dark-bg">Select...</option>
          {selectOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-cream dark:bg-dark-bg">
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-ink dark:text-cream placeholder-ink/30 dark:placeholder-white/30 transition-colors" />
      )}
    </label>);
}

export function Forms() {
  const [bookingStatus, setBookingStatus] = useState<Status>('idle');
  const [quoteStatus, setQuoteStatus] = useState<Status>('idle');
  const submit = (setter: (s: Status) => void) => (e: React.FormEvent) => {
    e.preventDefault();
    setter('submitting');
    setTimeout(() => setter('success'), 1200);
  };

  return (
    <>
      {/* Booking Section */}
      <section id="booking" className="relative bg-cream dark:bg-dark-bg py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-3 flex items-start gap-4">
              <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3"></span>
              <span className="eyebrow text-ink/60 dark:text-white/60">
                Chapter 08 — Engage
              </span>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
                Begin a{' '}
                <em className="italic text-brand-700 dark:text-brand-400 font-normal">project</em>{' '}
                with us.
              </h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <p className="font-display italic text-2xl text-ink/60 dark:text-white/60 font-light leading-snug md:sticky md:top-32">
                Request a site investigation or consultation. We respond within 24 business hours.
              </p>
            </div>

            <div className="col-span-12 md:col-span-9">
              {bookingStatus === 'success' ? (
                <div className="border-t border-ink/15 dark:border-white/15 pt-12">
                  <span className="eyebrow text-brand-700 dark:text-brand-400 mb-6 block">
                    Received — {new Date().toLocaleDateString('en-ZA')}
                  </span>
                  <h3 className="font-display text-5xl md:text-6xl text-ink dark:text-cream font-light leading-tight mb-6">
                    Thank you. Your request is{' '}
                    <em className="italic text-brand-700 dark:text-brand-400">in our hands</em>.
                  </h3>
                  <p className="text-ink/60 dark:text-white/60 text-lg font-light mb-8 max-w-xl">
                    A member of our team will reach out within one business day to confirm details and
                    schedule your investigation.
                  </p>
                  <button
                    onClick={() => setBookingStatus('idle')}
                    className="eyebrow text-ink dark:text-cream border-b border-ink/30 dark:border-white/30 pb-1 hover:border-brand-700">
                    Submit another request
                  </button>
                </div>
              ) : (
                <form onSubmit={submit(setBookingStatus)} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <EditorialInput label="Full Name" required placeholder="Your full name" />
                    <EditorialInput label="Company" placeholder="Optional" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <EditorialInput label="Email" type="email" required placeholder="you@company.com" />
                    <EditorialInput label="Phone" type="tel" required placeholder="+27" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <EditorialInput label="Service Required" required as="select" />
                    <EditorialInput label="Preferred Date" type="date" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <EditorialInput label="Project Location" required placeholder="City, Province" />
                    <EditorialInput label="GPS Coordinates" placeholder="Optional — e.g. -25.8553, 29.2428" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <EditorialInput label="Urgency" required as="select" options={urgencyOptions} />
                    <EditorialInput label="Site Area / Size" placeholder="Optional — e.g. 500 m²" />
                  </div>
                  <EditorialInput label="Project Description" as="textarea" placeholder="Tell us about the project..." />

                  <div className="flex flex-wrap items-center gap-6 pt-8 hairline">
                    <button
                      type="submit"
                      disabled={bookingStatus === 'submitting'}
                      className="group inline-flex items-center gap-3 bg-ink dark:bg-cream text-cream dark:text-ink px-8 py-5 hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors disabled:opacity-50">
                      <span className="font-mono text-sm uppercase tracking-[0.18em]">
                        {bookingStatus === 'submitting' ? 'Sending…' : 'Request Investigation'}
                      </span>
                      <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                    <span className="eyebrow text-ink/40 dark:text-white/40">
                      Or call +27 73 881 5050
                    </span>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quotation Section — dark contrast */}
      <section id="quote" className="relative bg-ink text-cream py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-3 flex items-start gap-4">
              <span className="w-12 h-px bg-cream/40 mt-3"></span>
              <span className="eyebrow text-cream/60">Chapter 09 — Estimate</span>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] font-light text-balance">
                An{' '}
                <em className="italic text-brand-400 font-normal">instant</em>{' '}
                quotation, considered.
              </h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-span-3">
              <p className="font-display italic text-2xl text-cream/60 font-light leading-snug md:sticky md:top-32">
                Share a few details and we'll send a tailored estimate within 24 hours, free of charge.
              </p>
            </div>

            <div className="col-span-12 md:col-span-9">
              {quoteStatus === 'success' ? (
                <div className="border-t border-cream/15 pt-12">
                  <span className="eyebrow text-brand-400 mb-6 block">Quotation Pending</span>
                  <h3 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6">
                    Your estimate is being{' '}
                    <em className="italic text-brand-400">prepared</em>.
                  </h3>
                  <p className="text-cream/60 text-lg font-light mb-8 max-w-xl">
                    Our estimation team is reviewing your details. Expect a detailed quotation within 24 hours.
                  </p>
                  <button
                    onClick={() => setQuoteStatus('idle')}
                    className="eyebrow text-cream border-b border-cream/30 pb-1 hover:border-brand-400">
                    Request another quote
                  </button>
                </div>
              ) : (
                <form onSubmit={submit(setQuoteStatus)} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-10">
                    <label className="block">
                      <div className="eyebrow text-cream/60 mb-3">Name — Required</div>
                      <input required type="text" placeholder="Your name"
                        className="w-full bg-transparent border-0 border-b border-cream/20 focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-cream placeholder-cream/30 transition-colors" />
                    </label>
                    <label className="block">
                      <div className="eyebrow text-cream/60 mb-3">Email — Required</div>
                      <input required type="email" placeholder="you@company.com"
                        className="w-full bg-transparent border-0 border-b border-cream/20 focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-cream placeholder-cream/30 transition-colors" />
                    </label>
                  </div>
                  <div className="grid md:grid-cols-2 gap-10">
                    <label className="block">
                      <div className="eyebrow text-cream/60 mb-3">Service Type — Required</div>
                      <select required
                        className="w-full bg-transparent border-0 border-b border-cream/20 focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-cream transition-colors appearance-none cursor-pointer">
                        <option value="" className="bg-ink">Select...</option>
                        <option value="geotechnical" className="bg-ink">Geotechnical</option>
                        <option value="civil" className="bg-ink">Civil Engineering</option>
                        <option value="mechanical" className="bg-ink">Mechanical Engineering</option>
                        <option value="electrical" className="bg-ink">Electrical Engineering</option>
                        <option value="building" className="bg-ink">Building & Plumbing</option>
                        <option value="supply" className="bg-ink">Supply & Delivery</option>
                      </select>
                    </label>
                    <label className="block">
                      <div className="eyebrow text-cream/60 mb-3">Project Scope</div>
                      <input type="text" placeholder="e.g. 500 m² commercial site"
                        className="w-full bg-transparent border-0 border-b border-cream/20 focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-cream placeholder-cream/30 transition-colors" />
                    </label>
                  </div>
                  <label className="block">
                    <div className="eyebrow text-cream/60 mb-3">Additional Notes</div>
                    <textarea rows={2} placeholder="Anything else we should know..."
                      className="w-full bg-transparent border-0 border-b border-cream/20 focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-2xl font-light text-cream placeholder-cream/30 resize-none transition-colors" />
                  </label>

                  <div className="pt-8 border-t border-cream/15">
                    <button type="submit" disabled={quoteStatus === 'submitting'}
                      className="group inline-flex items-center gap-3 bg-cream text-ink px-8 py-5 hover:bg-brand-400 transition-colors disabled:opacity-50">
                      <span className="font-mono text-sm uppercase tracking-[0.18em]">
                        {quoteStatus === 'submitting' ? 'Processing…' : 'Request Free Quotation'}
                      </span>
                      <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform duration-500" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </>);
}
