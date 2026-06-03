'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;
    const getFocusableElements = () =>
      Array.from(
        modal.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ).filter((element) => !element.hasAttribute('aria-hidden'));

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (showCloseButton) {
      const closeButton = modal.querySelector<HTMLButtonElement>('[aria-label="Close"]');
      closeButton?.focus();
    } else if (firstElement) {
      firstElement.focus();
    } else {
      modal.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') return;

      const currentFocusableElements = getFocusableElements();
      const currentFirstElement = currentFocusableElements[0];
      const currentLastElement = currentFocusableElements[currentFocusableElements.length - 1];

      if (!currentFirstElement || !currentLastElement) {
        event.preventDefault();
        modal.focus();
        return;
      }

      if (event.shiftKey && document.activeElement === currentFirstElement) {
        event.preventDefault();
        currentLastElement.focus();
      }

      if (!event.shiftKey && document.activeElement === currentLastElement) {
        event.preventDefault();
        currentFirstElement.focus();
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose, showCloseButton]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={`${sizeClasses[size]} w-full overflow-hidden rounded-3xl bg-white shadow-lg`}>
          <div className="flex items-center justify-between border-b border-nyaay-border/30 p-6">
            <h2 id="modal-title" className="font-display text-xl font-bold text-nyaay-navy">
              {title}
            </h2>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-lg p-2 text-nyaay-muted transition hover:bg-gray-100 hover:text-nyaay-navy focus:outline-2 focus:outline-offset-2 focus:outline-nyaay-saffron"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
