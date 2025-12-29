// hooks/useSelections.js - Hook for managing customization selections
import { useState, useMemo, useCallback } from "react";
import { OPTIONS } from "../configs/options.config";
import { getInitialSelections } from "../configs/defaults.config";

/**
 * Hook for managing customization selections state
 * @returns {Object} Selection state and handlers
 */
export function useSelections() {
  const [selections, setSelections] = useState(() =>
    getInitialSelections(OPTIONS)
  );

  /**
   * Check if a selection has a value
   */
  const hasSelection = useCallback(
    (key) => {
      const opt = OPTIONS[key];
      if (!opt) return false;

      if (opt.multi) return selections[key]?.length > 0;

      if (opt.isColorPicker) {
        // Only show as selected if palette is set to "Custom"
        return selections.palette === "Custom";
      }

      return selections[key] !== null && selections[key] !== undefined;
    },
    [selections]
  );

  /**
   * Get display value for a selection
   */
  const getDisplayValue = useCallback(
    (key) => {
      const opt = OPTIONS[key];
      if (!opt) return null;

      if (opt.multi) {
        const count = selections[key]?.length || 0;
        if (count === 0) return null;
        if (count === 1) return selections[key][0];
        return `${count} selected`;
      }

      // Handle custom colors specially
      if (key === "palette" && selections[key] === "Custom") {
        return "Custom Colors";
      }

      // Handle customColors object - return null since it's not a displayable value
      if (key === "customColors") {
        return null;
      }

      return selections[key];
    },
    [selections]
  );

  /**
   * Handle selection of an option
   */
  const handleSelect = useCallback((optionKey, value) => {
    const opt = OPTIONS[optionKey];
    if (opt.multi) {
      setSelections((prev) => ({
        ...prev,
        [optionKey]: prev[optionKey].includes(value)
          ? prev[optionKey].filter((v) => v !== value)
          : [...prev[optionKey], value],
      }));
    } else {
      setSelections((prev) => ({ ...prev, [optionKey]: value }));
    }
  }, []);

  /**
   * Reset a selection to its default value
   */
  const resetSelection = useCallback((key) => {
    const opt = OPTIONS[key];
    if (opt.multi) {
      setSelections((prev) => ({ ...prev, [key]: [] }));
    } else {
      setSelections((prev) => ({ ...prev, [key]: null }));
    }
  }, []);

  /**
   * Reset all selections to defaults
   */
  const resetAll = useCallback(() => {
    setSelections(getInitialSelections(OPTIONS));
  }, []);

  /**
   * Get active categories with their display values
   */
  const activeCategories = useMemo(() => {
    return Object.keys(OPTIONS)
      .filter((key) => {
        if (!hasSelection(key)) return false;
        const displayValue = getDisplayValue(key);
        return displayValue !== null && displayValue !== undefined;
      })
      .map((key) => ({
        key,
        label: OPTIONS[key].label,
        value: getDisplayValue(key),
      }));
  }, [hasSelection, getDisplayValue]);

  /**
   * Check if user has made any customizations
   */
  const hasCustomizations = useMemo(() => {
    return Object.entries(selections).some(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      if (typeof value === "object" && value !== null) {
        return Object.keys(value).length > 0;
      }
      return value !== null;
    });
  }, [selections]);

  return {
    selections,
    setSelections,
    hasSelection,
    getDisplayValue,
    handleSelect,
    resetSelection,
    resetAll,
    activeCategories,
    hasCustomizations,
  };
}

export default useSelections;
