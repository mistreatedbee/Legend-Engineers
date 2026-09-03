import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

type Toast = { id: number; message: string; kind: 'success' | 'error' };

type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
};

type NotifyState = {
  notify: (message: string, kind?: 'success' | 'error') => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const NotifyContext = createContext<NotifyState | null>(null);

export function NotifyProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<
    (ConfirmOptions & { resolve: (v: boolean) => void }) | null
  >(null);

  const notify = useCallback((message: string, kind: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ ...options, resolve });
    });
  }, []);

  return (
    <NotifyContext.Provider value={{ notify, confirm }}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-[calc(100%-2.5rem)] max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm ${
              t.kind === 'success'
                ? 'bg-white border-brand-200 text-ink'
                : 'bg-white border-red-200 text-ink'
            }`}>
            {t.kind === 'success' ? (
              <CheckCircle2 size={18} className="text-brand-700 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <span className="flex-1">{t.message}</span>
          </div>
        ))}
      </div>

      {/* Confirm dialog */}
      {confirmState && (
        <div
          className="fixed inset-0 z-[210] flex items-center justify-center p-4 bg-ink/50"
          onClick={() => {
            confirmState.resolve(false);
            setConfirmState(null);
          }}>
          <div
            className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-2">
              {confirmState.danger && (
                <AlertTriangle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <h3 className="font-semibold text-ink text-lg">{confirmState.title}</h3>
            </div>
            {confirmState.description && (
              <p className="text-sm text-ink/60 mb-6">{confirmState.description}</p>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  confirmState.resolve(false);
                  setConfirmState(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-lg border border-ink/15 text-ink/70 hover:bg-ink/5 transition-colors">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmState.resolve(true);
                  setConfirmState(null);
                }}
                className={`px-4 py-2 text-sm font-medium rounded-lg text-white transition-colors ${
                  confirmState.danger ? 'bg-red-600 hover:bg-red-700' : 'bg-brand-700 hover:bg-brand-800'
                }`}>
                {confirmState.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotifyContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotifyContext);
  if (!ctx) throw new Error('useNotify must be used within NotifyProvider');
  return ctx;
}

export function ErrorText({ children }: { children?: string | null }) {
  if (!children) return null;
  return (
    <p className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
      <X size={14} className="flex-shrink-0" />
      {children}
    </p>
  );
}
