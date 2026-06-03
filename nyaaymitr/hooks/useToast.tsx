'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

type ToastAction = {
  label: string;
  onClick: () => void;
};

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  action?: ToastAction;
}

type AddToastOptions = {
  duration?: number;
  action?: ToastAction;
};

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const removeToast = useCallback((id: string) => {
    const timer = timersRef.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timersRef.current[id];
    }

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType = 'info', options: AddToastOptions = {}) => {
      const duration = options.duration ?? (type === 'error' ? 7000 : type === 'warning' ? 5000 : 4000);
      const id = crypto.randomUUID?.() ?? Math.random().toString(36).slice(2);
      const toast: Toast = { id, message, type, duration, action: options.action };

      setToasts((currentToasts) => [...currentToasts, toast]);

      if (duration > 0) {
        timersRef.current[id] = setTimeout(() => removeToast(id), duration);
      }

      return id;
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    success: (message: string, options?: AddToastOptions) => addToast(message, 'success', options),
    error: (message: string, options?: AddToastOptions) => addToast(message, 'error', options),
    info: (message: string, options?: AddToastOptions) => addToast(message, 'info', options),
    warning: (message: string, options?: AddToastOptions) => addToast(message, 'warning', options),
  };
}

function getToastClasses(type: ToastType) {
  switch (type) {
    case 'success':
      return 'border-green-200 bg-green-50 text-green-900';
    case 'error':
      return 'border-red-200 bg-red-50 text-red-900';
    case 'warning':
      return 'border-yellow-200 bg-yellow-50 text-yellow-900';
    case 'info':
    default:
      return 'border-blue-200 bg-blue-50 text-blue-900';
  }
}

function ToastIcon({ type }: { type: ToastType }) {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" aria-hidden="true" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600" aria-hidden="true" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 flex-shrink-0 text-yellow-600" aria-hidden="true" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />;
  }
}

export function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed right-5 top-5 z-50 w-[calc(100%-2.5rem)] max-w-sm space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg ${getToastClasses(toast.type)}`}
          role="status"
          aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
        >
          <ToastIcon type={toast.type} />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5">{toast.message}</p>
            {toast.action ? (
              <button
                type="button"
                onClick={toast.action.onClick}
                className="mt-2 text-xs font-bold underline-offset-4 hover:underline"
              >
                {toast.action.label}
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onRemove(toast.id)}
            className="rounded-md p-1 opacity-75 transition hover:opacity-100"
            aria-label="Close notification"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  );
}
