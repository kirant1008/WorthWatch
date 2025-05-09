"use client";

import { useState, useEffect, useCallback } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        } else {
          window.localStorage.setItem(key, JSON.stringify(initialValue));
          // No need to setStoredValue again as it's already initialValue
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        // Keep initialValue if error
      }
      setIsInitialized(true);
    }
  }, [key, initialValue]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    if (typeof window !== 'undefined') {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue]);

  // Return initialValue until a value is loaded from localStorage
  // to prevent hydration mismatch if initialValue differs from localStorage.
  // Or, ensure `initialValue` is always what you expect on first render.
  return [isInitialized ? storedValue : initialValue, setValue];
}

export default useLocalStorage;
