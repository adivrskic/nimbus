import { useState, useMemo, useCallback } from "react";
import { OPTIONS } from "../configs/options.config";
import { getInitialSelections } from "../configs/defaults.config";

export function useSelections() {
  const [selections, setSelections] = useState(() =>
    getInitialSelections(OPTIONS)
  );

  const hasSelection = useCallback(
    (key) => {
      const opt = OPTIONS[key];
      if (!opt) return false;

      if (opt.multi) return selections[key]?.length > 0;

      if (opt.isColorPicker) {
        return selections.palette === "Custom";
      }

      return selections[key] !== null && selections[key] !== undefined;
    },
    [selections]
  );

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

      if (key === "palette" && selections[key] === "Custom") {
        return "Custom Colors";
      }

      if (key === "customColors") {
        return null;
      }

      return selections[key];
    },
    [selections]
  );

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

  const resetSelection = useCallback((key) => {
    const opt = OPTIONS[key];
    if (!opt) return;
    if (opt.multi) {
      setSelections((prev) => ({ ...prev, [key]: [] }));
    } else {
      setSelections((prev) => ({ ...prev, [key]: null }));
    }
  }, []);

  const resetAll = useCallback(() => {
    setSelections(getInitialSelections(OPTIONS));
  }, []);

  const activeCategories = useMemo(() => {
    return Object.keys(OPTIONS)
      .filter((key) => {
        if (!hasSelection(key)) return false;
        const displayValue = getDisplayValue(key);
        return displayValue !== null && displayValue !== undefined;
      })
      .map((key) => ({
        category: key,
        label: OPTIONS[key].label,
        value: getDisplayValue(key),
        icon: OPTIONS[key].icon,
      }));
  }, [hasSelection, getDisplayValue]);

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
