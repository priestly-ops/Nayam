'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application error boundary caught an error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-screen items-center justify-center bg-nyaay-surface px-4 text-nyaay-cream">
          <div className="w-full max-w-md space-y-4">
            <div className="rounded-3xl bg-white p-6 text-center text-nyaay-navy shadow-card">
              <div className="mb-4 text-4xl" aria-hidden="true">⚠️</div>
              <h1 className="font-display text-2xl font-bold text-nyaay-navy">Something went wrong</h1>
              <p className="mt-3 text-sm leading-6 text-nyaay-muted">
                We could not complete that action. Please try again. If the issue continues, contact support.
              </p>
              {process.env.NODE_ENV === 'development' && this.state.error ? (
                <pre className="mt-4 max-h-40 overflow-auto rounded-xl bg-gray-100 p-3 text-left text-xs text-gray-700">
                  {this.state.error.message}
                </pre>
              ) : null}
              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={this.reset}
                  className="h-12 w-full rounded-2xl bg-nyaay-saffron font-bold text-white transition hover:bg-nyaay-saffron/90 active:bg-nyaay-saffron/80"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => window.location.assign('/')}
                  className="h-12 w-full rounded-2xl border border-nyaay-border bg-white font-bold text-nyaay-navy transition hover:bg-nyaay-cream active:bg-nyaay-cream/80"
                >
                  Go Home
                </button>
                <a
                  href="mailto:support@nyayaconnect.in?subject=App%20Error"
                  className="inline-block text-sm font-semibold text-nyaay-saffron hover:underline"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
