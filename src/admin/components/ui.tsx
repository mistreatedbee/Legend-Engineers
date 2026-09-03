import React from 'react';

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">{title}</h1>
        {description && <p className="text-sm text-ink/60 mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">
        {label}
        {required && <span className="text-red-600 ml-0.5">*</span>}
      </span>
      {children}
      {hint && <span className="block text-xs text-ink/50 mt-1">{hint}</span>}
    </label>
  );
}

const controlClass =
  'w-full rounded-lg border border-ink/15 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-brand-700/30 focus:border-brand-700 transition-colors';

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`${controlClass} ${className}`} {...props} />
  )
);
Input.displayName = 'Input';

export const TextArea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className = '', ...props }, ref) => (
  <textarea ref={ref} className={`${controlClass} resize-y ${className}`} {...props} />
));
TextArea.displayName = 'TextArea';

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', children, ...props }, ref) => (
    <select ref={ref} className={`${controlClass} ${className}`} {...props}>
      {children}
    </select>
  )
);
Select.displayName = 'Select';

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md';
}) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-700 hover:bg-brand-800 text-white disabled:bg-brand-700/50',
    secondary: 'bg-white border border-ink/15 text-ink hover:bg-ink/5 disabled:opacity-50',
    ghost: 'text-ink/70 hover:bg-ink/5 disabled:opacity-50',
    danger: 'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-600/50',
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors whitespace-nowrap disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}

const STATUS_STYLES: Record<string, string> = {
  published: 'bg-brand-100 text-brand-800',
  open: 'bg-brand-100 text-brand-800',
  draft: 'bg-amber-100 text-amber-800',
  closed: 'bg-ink/10 text-ink/60',
  archived: 'bg-ink/10 text-ink/50',
  new: 'bg-sky-100 text-sky-800',
  reviewing: 'bg-amber-100 text-amber-800',
  shortlisted: 'bg-violet-100 text-violet-800',
  interview: 'bg-orange-100 text-orange-800',
  hired: 'bg-brand-100 text-brand-800',
  rejected: 'bg-red-100 text-red-700',
  read: 'bg-sky-100 text-sky-800',
  replied: 'bg-brand-100 text-brand-800',
};

export function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status?.toLowerCase()] || 'bg-ink/10 text-ink/60';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="text-center py-16 px-6 border border-dashed border-ink/15 rounded-xl bg-white">
      <h3 className="text-base font-medium text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink/50 mb-5 max-w-sm mx-auto">{description}</p>}
      {action}
    </div>
  );
}

export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-6 w-6 border-2 border-ink/15 border-t-brand-700 rounded-full animate-spin ${className}`}
    />
  );
}

export function CardTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}
