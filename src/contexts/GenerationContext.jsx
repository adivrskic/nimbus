import { createContext, useContext, useState, useCallback } from "react";

const GenerationContext = createContext({
  isGenerating: false,
  setIsGenerating: () => {},
});

export function GenerationProvider({ children }) {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <GenerationContext.Provider value={{ isGenerating, setIsGenerating }}>
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
