// hooks/useSessionStorage.js - Session storage persistence hook
import { useState, useEffect, useCallback } from "react";

/**
 * Hook for persisting state to sessionStorage
 * @param {string} key - Storage key
 * @param {*} initialValue - Initial value if not in storage
 * @returns {[*, Function]} [value, setValue] tuple
 */
export function useSessionStorage(key, initialValue) {
  // Get initial value from storage or use provided default
  const getStoredValue = () => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return initialValue;

      // Handle boolean strings
      if (item === "true") return true;
      if (item === "false") return false;

      // Try to parse JSON
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(getStoredValue);

  // Update storage when value changes
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function (like useState)
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          if (valueToStore === null || valueToStore === undefined) {
            sessionStorage.removeItem(key);
          } else if (typeof valueToStore === "object") {
            sessionStorage.setItem(key, JSON.stringify(valueToStore));
          } else {
            sessionStorage.setItem(key, String(valueToStore));
          }
        }
      } catch (error) {
        console.warn(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

/**
 * Hook for multiple session storage values
 * @param {Object} defaults - Object with key-value pairs of defaults
 * @returns {Object} { values, setters, resetAll }
 */
export function useMultiSessionStorage(defaults) {
  const entries = Object.entries(defaults);
  const hooks = entries.map(([key, defaultValue]) =>
    useSessionStorage(key, defaultValue)
  );

  const values = {};
  const setters = {};

  entries.forEach(([key], index) => {
    values[key] = hooks[index][0];
    setters[`set${key.charAt(0).toUpperCase() + key.slice(1)}`] = hooks[index][1];
  });

  const resetAll = useCallback(() => {
    entries.forEach(([key, defaultValue], index) => {
      hooks[index][1](defaultValue);
    });
  }, [entries, hooks]);

  return { values, setters, resetAll };
}

export default useSessionStorage;
