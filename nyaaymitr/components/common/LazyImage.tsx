'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
  imageClassName?: string;
  timeoutMs?: number;
  onLoad?: () => void;
  onError?: () => void;
}

export function LazyImage({
  src,
  alt,
  fallback = '🖼️',
  className = '',
  imageClassName = '',
  timeoutMs = 5000,
  onLoad,
  onError,
}: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setContainerRef = useCallback((element: HTMLDivElement | null) => {
    containerRef.current = element;
  }, []);

  useEffect(() => {
    const element = containerRef.current;
    if (!element || isVisible) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '80px' }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !src) return;

    let didCancel = false;
    setIsLoading(true);
    setHasError(false);

    const image = new window.Image();
    const timeout = window.setTimeout(() => {
      if (didCancel) return;
      setIsLoading(false);
      setHasError(true);
      onError?.();
    }, timeoutMs);

    image.onload = () => {
      if (didCancel) return;
      window.clearTimeout(timeout);
      setIsLoading(false);
      setHasError(false);
      onLoad?.();
    };

    image.onerror = () => {
      if (didCancel) return;
      window.clearTimeout(timeout);
      setIsLoading(false);
      setHasError(true);
      onError?.();
    };

    image.src = src;

    return () => {
      didCancel = true;
      window.clearTimeout(timeout);
    };
  }, [isVisible, onError, onLoad, src, timeoutMs]);

  return (
    <div ref={setContainerRef} className={`relative overflow-hidden bg-gray-100 ${className}`}>
      {isVisible && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`h-full w-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'} ${imageClassName}`}
          onLoad={() => {
            setIsLoading(false);
            setHasError(false);
          }}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        />
      ) : null}

      {isLoading && !hasError ? (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" aria-hidden="true" />
      ) : null}

      {!isVisible ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100" aria-hidden="true">
          <span className="text-2xl">{fallback}</span>
        </div>
      ) : null}

      {hasError ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-600" role="img" aria-label={`Could not load image: ${alt}`}>
          <div className="text-center">
            <AlertCircle className="mx-auto mb-2 h-8 w-8 text-gray-400" aria-hidden="true" />
            <p className="text-xs font-medium">Image failed to load</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
