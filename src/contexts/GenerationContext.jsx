import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

const GenerationContext = createContext({
  isGenerating: false,
  setIsGenerating: () => {},
  previewPill: null,
  showPreviewPill: () => {},
  hidePreviewPill: () => {},
});

// Generate a harmonious color palette from a random seed using golden ratio
function generateMarbleColors() {
  const hue = Math.random() * 360;
  const golden = 137.508;
  return {
    a: `hsl(${hue}, 72%, 62%)`,
    b: `hsl(${(hue + golden) % 360}, 68%, 54%)`,
    c: `hsl(${(hue + golden * 2) % 360}, 64%, 70%)`,
  };
}

export function GenerationProvider({ children }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewPill, setPreviewPill] = useState(null);
  const colorsRef = useRef(null);

  const showPreviewPill = useCallback(({ onRestore, isGenerating: gen }) => {
    if (!colorsRef.current) {
      colorsRef.current = generateMarbleColors();
    }
    setPreviewPill({
      visible: true,
      onRestore,
      isGenerating: gen || false,
      colors: colorsRef.current,
    });
  }, []);

  const hidePreviewPill = useCallback(() => {
    setPreviewPill(null);
    colorsRef.current = null;
  }, []);

  const refreshColors = useCallback(() => {
    colorsRef.current = generateMarbleColors();
    setPreviewPill((prev) =>
      prev ? { ...prev, colors: colorsRef.current } : null
    );
  }, []);

  return (
    <GenerationContext.Provider
      value={{
        isGenerating,
        setIsGenerating,
        previewPill,
        showPreviewPill,
        hidePreviewPill,
        refreshColors,
      }}
    >
      {children}
    </GenerationContext.Provider>
  );
}

export function useGenerationState() {
  const context = useContext(GenerationContext);
  if (!context) {
    throw new Error(
      "useGenerationState must be used within a GenerationProvider"
    );
  }
  return context;
}

export default GenerationContext;
