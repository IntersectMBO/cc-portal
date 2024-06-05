"use client";

import { useEffect, useState } from "react";

/**
 * Custom hook for debouncing an input value.
 * @param {string} value - The input value to be debounced.
 * @param {number} delay - The delay (in milliseconds) before updating the debounced value.
 * @returns {string} - The debounced value.
 */
export const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [value, delay]);

  return debouncedValue;
};
