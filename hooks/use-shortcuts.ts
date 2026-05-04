import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export type Shortcut = {
  id: string;
  label: string;
  code: string;
};

const SHORTCUTS_STORAGE_KEY = 'bxutility.shortcuts';

export const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'button-1', label: 'Balance Check', code: '*131#' },
  { id: 'button-2', label: '100 Menu', code: '*100#' },
  { id: 'button-3', label: 'MTN paka', code: '*100*2*1*1*1*1*1*1*2#' },
  { id: 'button-4', label: 'Airtime Top Up', code: '*136#' },
];

export function useShortcuts() {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(DEFAULT_SHORTCUTS);
  const [isHydrated, setIsHydrated] = useState(false);

  const loadShortcuts = useCallback(async () => {
    try {
      const storedValue = await AsyncStorage.getItem(SHORTCUTS_STORAGE_KEY);
      if (!storedValue) {
        return;
      }

      const parsed = JSON.parse(storedValue) as unknown;
      if (!Array.isArray(parsed)) {
        return;
      }

      const validShortcuts = parsed.filter((item): item is Shortcut => {
        if (!item || typeof item !== 'object') {
          return false;
        }

        const value = item as Record<string, unknown>;
        return (
          typeof value.id === 'string' &&
          typeof value.label === 'string' &&
          typeof value.code === 'string'
        );
      });

      if (validShortcuts.length > 0) {
        setShortcuts(validShortcuts);
      }
    } catch {
      // Keep defaults when persisted data is unavailable or invalid.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    void loadShortcuts();
  }, [loadShortcuts]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    void AsyncStorage.setItem(SHORTCUTS_STORAGE_KEY, JSON.stringify(shortcuts));
  }, [isHydrated, shortcuts]);

  return { shortcuts, setShortcuts, loadShortcuts, isHydrated };
}
