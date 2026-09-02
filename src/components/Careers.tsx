import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, X, MapPin, Briefcase, Calendar, Upload } from 'lucide-react';
import { careerOpenings, CareerOpening } from '../data/careers';

type Status = 'idle' | 'submitting' | 'success' | 'error';

const MAX_CV_BYTES = 5 * 1024 * 1024;
const ALLOWED_CV_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const ALLOWED_CV_EXT = ['.pdf', '.doc', '.docx'];

function formatClosingDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-ZA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return /^[\d\s+().-]{7,20}$/.test(phone) && digits.length >= 7;
}

function isAllowedCvFile(file: File) {
  const lower = file.name.toLowerCase();
  const hasExt = ALLOWED_CV_EXT.some((ext) => lower.endsWith(ext));
  const hasMime = ALLOWED_CV_TYPES.includes(file.type);
  return (hasExt || hasMime) && file.size <= MAX_CV_BYTES;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="flex items-baseline justify-between mb-3">
      <span className="eyebrow text-ink/60 dark:text-white/60">{label}</span>
      {required && <span className="eyebrow text-brand-700 dark:text-brand-400">Required</span>}
    </div>
  );
}

const inputClass =
  'w-full bg-transparent border-0 border-b border-ink/20 dark:border-white/20 focus:border-brand-700 dark:focus:border-brand-400 focus:ring-0 outline-none py-3 font-display text-xl md:text-2xl font-light text-ink dark:text-cream placeholder-ink/30 dark:placeholder-white/30 transition-colors';

function ApplicationModal({
  opening,
  onClose,
}: {
  opening: CareerOpening;
  onClose: () => void;
}) {
  const [status, setStatus] = useState<Status>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [cvName, setCvName] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const validate = (fd: FormData, cv: File | null) => {
    const errors: Record<string, string> = {};
    const fullName = (fd.get('fullName') as string)?.trim();
    const email = (fd.get('email') as string)?.trim();
    const phone = (fd.get('phone') as string)?.trim();
    const position = (fd.get('position') as string)?.trim();
    const coverLetter = (fd.get('coverLetter') as string)?.trim();

    if (!fullName) errors.fullName = 'Full name is required.';
    if (!email || !isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (!phone || !isValidPhone(phone)) errors.phone = 'Enter a valid phone number.';
    if (!position) errors.position = 'Position is required.';
    if (!coverLetter) errors.coverLetter = 'Cover letter is required.';
    if (!cv) errors.cv = 'Please upload your CV / resume.';
    else if (!isAllowedCvFile(cv)) {
      errors.cv = 'CV must be PDF, DOC, or DOCX and under 5 MB.';
    }

    return errors;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const cv = fileRef.current?.files?.[0] ?? null;

    const errors = validate(fd, cv);
    setFieldErrors(errors);
    if (Object.keys(errors).length) return;

    if (cv) fd.set('cv', cv);
    fd.set('position', opening.title);

    setStatus('submitting');
    try {
      const res = await fetch('/api/career-applications', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Server error');
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6"
      role="presentation"
      onClick={onClose}>
      <div className="absolute inset-0 bg-ink/60 backdrop-blur-sm" aria-hidden="true" />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="career-application-title"
        tabIndex={-1}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.35 }}
        className="relative w-full md:max-w-3xl max-h-[92vh] overflow-y-auto bg-cream dark:bg-dark-surface border border-ink/10 dark:border-white/10 md:rounded-sm shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 md:px-10 py-5 bg-cream/95 dark:bg-dark-surface/95 backdrop-blur-md border-b border-ink/10 dark:border-white/10">
          <div>
            <span className="eyebrow text-ink/50 dark:text-white/50 block mb-1">Apply</span>
            <h3
              id="career-application-title"
              className="font-display text-2xl md:text-3xl font-light text-ink dark:text-cream">
              {opening.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink/60 dark:text-white/60 hover:text-brand-700 dark:hover:text-brand-400 transition-colors"
            aria-label="Close application form">
            <X size={22} />
          </button>
        </div>

        <div className="px-6 md:px-10 py-8 md:py-10">
          {status === 'success' ? (
            <div className="border-t border-ink/15 dark:border-white/15 pt-8">
              <span className="eyebrow text-brand-700 dark:text-brand-400 mb-4 block">
                Application received
              </span>
              <h4 className="font-display text-3xl md:text-4xl text-ink dark:text-cream font-light leading-tight mb-4">
                Application submitted successfully.
              </h4>
              <p className="text-ink/60 dark:text-white/60 text-lg font-light max-w-lg">
                Thank you for your interest in joining Enerdge Group. Our team will review your
                application.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-8 eyebrow text-ink dark:text-cream border-b border-ink/30 dark:border-white/30 pb-1 hover:border-brand-700">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-8" noValidate>
              <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

              {status === 'error' && (
                <p className="eyebrow text-red-600 dark:text-red-400" role="alert">
                  We could not submit your application at this time. Please try again or contact us
                  directly.
                </p>
              )}

              <div className="grid md:grid-cols-2 gap-8">
                <label className="block">
                  <FieldLabel label="Full Name" required />
                  <input
                    name="fullName"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                    className={inputClass}
                    aria-invalid={!!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? 'err-fullName' : undefined}
                  />
                  {fieldErrors.fullName && (
                    <p id="err-fullName" className="mt-2 text-sm text-red-600" role="alert">
                      {fieldErrors.fullName}
                    </p>
                  )}
                </label>
                <label className="block">
                  <FieldLabel label="Email Address" required />
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@email.com"
                    className={inputClass}
                    aria-invalid={!!fieldErrors.email}
                  />
                  {fieldErrors.email && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <label className="block">
                  <FieldLabel label="Phone Number" required />
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+27"
                    className={inputClass}
                    aria-invalid={!!fieldErrors.phone}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-2 text-sm text-red-600" role="alert">
                      {fieldErrors.phone}
                    </p>
                  )}
                </label>
                <label className="block">
                  <FieldLabel label="Position Applying For" required />
                  <input
                    name="position"
                    type="text"
                    readOnly
                    value={opening.title}
                    className={`${inputClass} opacity-70 cursor-default`}
                  />
                </label>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <label className="block">
                  <FieldLabel label="Location" />
                  <input
                    name="location"
                    type="text"
                    placeholder="City, Province"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <FieldLabel label="Years of Experience" />
                  <input
                    name="experience"
                    type="text"
                    placeholder="e.g. 3 years"
                    className={inputClass}
                  />
                </label>
              </div>

              <label className="block">
                <FieldLabel label="LinkedIn Profile" />
                <input
                  name="linkedIn"
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  className={inputClass}
                />
              </label>

              <label className="block">
                <FieldLabel label="Cover Letter / Message" required />
                <textarea
                  name="coverLetter"
                  required
                  rows={4}
                  placeholder="Tell us why you would be a great fit..."
                  className={`${inputClass} resize-none`}
                  aria-invalid={!!fieldErrors.coverLetter}
                />
                {fieldErrors.coverLetter && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {fieldErrors.coverLetter}
                  </p>
                )}
              </label>

              <div>
                <FieldLabel label="CV / Resume" required />
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <label className="group inline-flex items-center gap-3 cursor-pointer border border-ink/20 dark:border-white/20 px-5 py-4 hover:border-brand-700 dark:hover:border-brand-400 transition-colors">
                    <Upload size={18} className="text-ink/50 dark:text-white/50" />
                    <span className="font-mono text-xs uppercase tracking-[0.15em]">
                      Choose file
                    </span>
                    <input
                      ref={fileRef}
                      name="cv"
                      type="file"
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="sr-only"
                      onChange={(e) => setCvName(e.target.files?.[0]?.name ?? '')}
                      aria-invalid={!!fieldErrors.cv}
                    />
                  </label>
                  <span className="text-ink/50 dark:text-white/50 text-sm font-light">
                    {cvName || 'PDF, DOC, or DOCX — max 5 MB'}
                  </span>
                </div>
                {fieldErrors.cv && (
                  <p className="mt-2 text-sm text-red-600" role="alert">
                    {fieldErrors.cv}
                  </p>
                )}
              </div>

              <div className="pt-4 hairline">
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="group inline-flex items-center gap-3 bg-ink dark:bg-cream text-cream dark:text-ink px-8 py-5 hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors disabled:opacity-50">
                  <span className="font-mono text-sm uppercase tracking-[0.18em]">
                    {status === 'submitting' ? 'Submitting…' : 'Submit Application'}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="group-hover:rotate-45 transition-transform duration-500"
                  />
                </button>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function Careers() {
  const [selectedOpening, setSelectedOpening] = useState<CareerOpening | null>(null);
  const openListings = careerOpenings.filter((o) => o.status === 'Open');

  return (
    <>
      <section id="careers" className="relative bg-cream dark:bg-dark-bg py-32 md:py-40">
        <div className="max-w-[1600px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-12 gap-6 md:gap-10 mb-24 md:mb-32">
            <div className="col-span-12 md:col-span-3 flex items-start gap-4">
              <span className="w-12 h-px bg-ink/40 dark:bg-white/40 mt-3" />
              <span className="eyebrow text-ink/60 dark:text-white/60">Careers</span>
            </div>
            <div className="col-span-12 md:col-span-9">
              <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-[-0.03em] text-ink dark:text-cream font-light text-balance">
                <em className="italic text-brand-700 dark:text-brand-400 font-normal">Careers</em>{' '}
                at Enerdge Group.
              </h2>
              <p className="mt-8 font-display text-xl md:text-2xl text-ink/60 dark:text-white/60 font-light italic max-w-2xl leading-snug">
                Explore current opportunities and join the Enerdge Group team.
              </p>
            </div>
          </div>

          {openListings.length === 0 ? (
            <p className="font-display text-2xl text-ink/60 dark:text-white/60 font-light italic">
              No open positions at this time. Please check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-12 gap-6 md:gap-10">
              {openListings.map((opening, idx) => (
                <motion.article
                  key={opening.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                  className="col-span-12 md:col-span-6 border-t border-ink/15 dark:border-white/15 pt-8 md:pt-10 flex flex-col">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="eyebrow text-brand-700 dark:text-brand-400">
                      {opening.status}
                    </span>
                    <span className="eyebrow text-ink/40 dark:text-white/40">
                      {opening.department}
                    </span>
                  </div>

                  <h3 className="font-display text-3xl md:text-4xl text-ink dark:text-cream font-light mb-6">
                    {opening.title}
                  </h3>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6 text-ink/60 dark:text-white/60">
                    <span className="inline-flex items-center gap-2 font-light text-sm">
                      <MapPin size={14} aria-hidden="true" />
                      {opening.location}
                    </span>
                    <span className="inline-flex items-center gap-2 font-light text-sm">
                      <Briefcase size={14} aria-hidden="true" />
                      {opening.type}
                    </span>
                    <span className="inline-flex items-center gap-2 font-light text-sm">
                      <Calendar size={14} aria-hidden="true" />
                      Closes {formatClosingDate(opening.closingDate)}
                    </span>
                  </div>

                  <p className="text-ink/70 dark:text-white/70 font-light leading-relaxed mb-6 flex-grow">
                    {opening.description}
                  </p>

                  <div className="mb-8">
                    <span className="eyebrow text-ink/50 dark:text-white/50 block mb-3">
                      Requirements
                    </span>
                    <ul className="space-y-2">
                      {opening.requirements.map((req) => (
                        <li
                          key={req}
                          className="font-light text-ink/70 dark:text-white/70 text-sm leading-relaxed pl-4 border-l border-ink/15 dark:border-white/15">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOpening(opening)}
                    className="group self-start inline-flex items-center gap-3 bg-ink dark:bg-cream text-cream dark:text-ink px-8 py-5 hover:bg-brand-700 dark:hover:bg-brand-700 dark:hover:text-cream transition-colors">
                    <span className="font-mono text-sm uppercase tracking-[0.18em]">
                      Apply Now
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="group-hover:rotate-45 transition-transform duration-500"
                    />
                  </button>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedOpening && (
          <ApplicationModal
            key={selectedOpening.id}
            opening={selectedOpening}
            onClose={() => setSelectedOpening(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
