import {
  createContext,
  useContext,
  useRef,
  useState,
  useCallback,
} from "react";
import { defaultConfig } from "../config/blobDefaults";
import { presets } from "../config/presets";

const BlobContext = createContext(null);

export function BlobProvider({ children }) {
  const configRef = useRef({ ...defaultConfig });
  const [configValues, setConfigValues] = useState({ ...defaultConfig });

  const updateConfig = useCallback((key, value) => {
    configRef.current[key] = value;
    setConfigValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const applyPreset = useCallback((presetId) => {
    const preset = presets[presetId];
    if (preset) {
      Object.assign(configRef.current, preset.config);
      setConfigValues({ ...preset.config });
    }
  }, []);

  const resetToDefault = useCallback(() => {
    Object.assign(configRef.current, defaultConfig);
    setConfigValues({ ...defaultConfig });
  }, []);

  const exportConfig = useCallback(() => {
    return JSON.stringify(configRef.current, null, 2);
  }, []);

  const value = {
    configRef,
    configValues,
    updateConfig,
    applyPreset,
    resetToDefault,
    exportConfig,
  };

  return <BlobContext.Provider value={value}>{children}</BlobContext.Provider>;
}

export function useBlob() {
  const context = useContext(BlobContext);
  if (!context) {
    throw new Error("useBlob must be used within a BlobProvider");
  }
  return context;
}
