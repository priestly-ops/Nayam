'use client';

import { useCallback, useEffect, useRef } from 'react';
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

  // Track previously focused element
  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const modal = modalRef.current;

    // Move focus to modal when opened
    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Set initial focus to close button or first focusable element
    if (showCloseButton) {
      const closeButton = modal.querySelector<HTMLButtonElement>('[aria-label="Close"]');
      closeButton?.focus();
    } else if (firstElement) {
      firstElement.focus();
    }

    // Handle keyboard events
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal on Escape
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      // Focus trap: prevent Tab from leaving modal
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift+Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    modal.addEventListener('keydown', handleKeyDown);

    // Prevent body scroll when modal open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      modal.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;

      // Restore focus to previously focused element
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
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
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className={`${sizeClasses[size]} w-full bg-white rounded-3xl shadow-lg overflow-hidden`}>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-nyaay-border/30 p-6">
            <h2 id="modal-title" className="font-display text-xl font-bold text-nyaay-navy">
              {title}
            </h2>
            {showCloseButton && (
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 rounded-lg hover:bg-gray-100 transition text-nyaay-muted hover:text-nyaay-navy focus:outline-2 focus:outline-offset-2 focus:outline-nyaay-saffron"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)]">{children}</div>
        </div>
      </div>
    </>
  );
}
