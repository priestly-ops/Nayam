'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface FormAutosaveOptions<T extends Record<string, unknown>> {
  storageKey: string;
  enabled?: boolean;
  interval?: number;
  ttlMs?: number;
  excludeKeys?: Array<keyof T>;
}

type SavedFormData<T> = {
  formData: Partial<T>;
  savedAt: string;
  expiresAt: string;
};

function removeExcludedKeys<T extends Record<string, unknown>>(
  formData: T,
  excludeKeys: Array<keyof T>
): Partial<T> {
  return Object.fromEntries(
    Object.entries(formData).filter(([key]) => !excludeKeys.includes(key as keyof T))
  ) as Partial<T>;
}

/**
 * Privacy-aware form autosave helper.
 *
 * Use only for non-sensitive draft fields, or pass `excludeKeys` for legal facts,
 * documents, payment details, identity numbers, and other confidential values.
 */
export function useFormAutosave<T extends Record<string, unknown>>(
  formData: T,
  {
    storageKey,
    enabled = false,
    interval = 10000,
    ttlMs = 24 * 60 * 60 * 1000,
    excludeKeys = [],
  }: FormAutosaveOptions<T>
) {
  const [restoredData, setRestoredData] = useState<Partial<T> | null>(null);
  const [restored, setRestored] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  const safeFormData = useMemo(
    () => removeExcludedKeys(formData, excludeKeys),
    [excludeKeys, formData]
  );

  useEffect(() => {
    if (!enabled) {
      setRestored(true);
      return;
    }

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setRestored(true);
        return;
      }

      const parsed = JSON.parse(saved) as SavedFormData<T>;
      const expiresAt = new Date(parsed.expiresAt);

      if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
        window.localStorage.removeItem(storageKey);
        setRestored(true);
        return;
      }

      setRestoredData(parsed.formData);
      setLastSaveTime(new Date(parsed.savedAt));
    } catch (error) {
      console.warn('Failed to restore form autosave data.', error);
      window.localStorage.removeItem(storageKey);
    } finally {
      setRestored(true);
    }
  }, [enabled, storageKey]);

  useEffect(() => {
    if (!enabled || !restored) return;

    const saveTimer = window.setInterval(() => {
      try {
        const now = new Date();
        const dataToSave: SavedFormData<T> = {
          formData: safeFormData,
          savedAt: now.toISOString(),
          expiresAt: new Date(now.getTime() + ttlMs).toISOString(),
        };

        window.localStorage.setItem(storageKey, JSON.stringify(dataToSave));
        setLastSaveTime(now);
      } catch (error) {
        console.warn('Failed to save form autosave data.', error);
      }
    }, interval);

    return () => window.clearInterval(saveTimer);
  }, [enabled, interval, restored, safeFormData, storageKey, ttlMs]);

  const clearSavedData = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
      setLastSaveTime(null);
      setRestoredData(null);
    } catch (error) {
      console.warn('Failed to clear form autosave data.', error);
    }
  }, [storageKey]);

  return { restored, restoredData, lastSaveTime, clearSavedData };
}
