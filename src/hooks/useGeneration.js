// hooks/useGeneration.js - Handles website generation logic
import { useState, useCallback, useRef, useEffect } from "react";
import { buildFullPrompt } from "../utils/promptBuilder";
import { generateDemo } from "../utils/demoGenerator";
import { useGenerationState } from "../contexts/GenerationContext";

/**
 * Hook for managing website generation
 * @param {Object} options - Configuration options
 * @param {Function} options.onSuccess - Callback when generation succeeds
 * @param {Function} options.onError - Callback when generation fails
 * @param {Function} options.supabaseGenerate - Supabase generation function
 * @returns {Object} Generation state and handlers
 */
export function useGeneration({ onSuccess, onError, supabaseGenerate } = {}) {
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [enhancePrompt, setEnhancePrompt] = useState("");

  // Get context setter for blob animation (renamed to avoid conflict)
  const { setIsGenerating: setGlobalGenerating } = useGenerationState();

  // Sync local isGenerating state to global context for NoiseBlob
  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  // Track generation for cancellation
  const generationRef = useRef(null);

  /**
   * Generate website from prompt and selections
   */
  const generate = useCallback(
    async (prompt, selections, persistentOptions, user) => {
      if (!prompt.trim() || isGenerating) return;

      setIsGenerating(true);
      setGenerationError(null);
      generationRef.current = Date.now();

      try {
        // Build the full prompt
        const fullPrompt = buildFullPrompt(
          prompt,
          selections,
          persistentOptions
        );

        // Try Supabase generation first
        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt: fullPrompt,
            selections,
            isRefinement: false,
            existingCode: null,
          });

          if (result?.code) {
            setGeneratedCode(result.code);
            onSuccess?.(result);
            return result;
          }
        }

        // Fallback to demo generation
        console.log("No supabaseGenerate function provided, using demo");
        const demoHtml = generateDemo(prompt, selections);
        setGeneratedCode(demoHtml);
        onSuccess?.({ code: demoHtml, isDemo: true });
        return { code: demoHtml, isDemo: true };
      } catch (error) {
        console.error("Generation error:", error);
        setGenerationError(error.message || "Generation failed");
        onError?.(error);

        // Use demo as fallback on error
        const demoHtml = generateDemo(prompt, selections);
        setGeneratedCode(demoHtml);
        return { code: demoHtml, isDemo: true, error };
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, supabaseGenerate, onSuccess, onError]
  );

  /**
   * Enhance existing generated code with additional changes
   */
  const enhance = useCallback(
    async (originalPrompt, selections, user) => {
      if (!enhancePrompt.trim() || !generatedCode || isGenerating) return;

      setIsGenerating(true);
      setGenerationError(null);

      try {
        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt: enhancePrompt,
            selections: selections || {},
            isRefinement: true,
            existingCode: generatedCode,
          });

          if (result?.code) {
            setGeneratedCode(result.code);
            setEnhancePrompt("");
            onSuccess?.(result);
            return result;
          }
        }

        // No enhancement without backend
        setGenerationError("Enhancement requires backend connection");
        return null;
      } catch (error) {
        console.error("Enhancement error:", error);
        setGenerationError(error.message || "Enhancement failed");
        onError?.(error);
        return null;
      } finally {
        setIsGenerating(false);
      }
    },
    [
      enhancePrompt,
      generatedCode,
      isGenerating,
      supabaseGenerate,
      onSuccess,
      onError,
    ]
  );

  /**
   * Cancel ongoing generation
   */
  const cancel = useCallback(() => {
    generationRef.current = null;
    setIsGenerating(false);
  }, []);

  /**
   * Reset generation state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setGeneratedCode(null);
    setGenerationError(null);
    setEnhancePrompt("");
    generationRef.current = null;
  }, []);

  /**
   * Update generated code directly (for external edits)
   */
  const updateCode = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  return {
    // State
    isGenerating,
    generatedCode,
    generationError,
    enhancePrompt,

    // Setters
    setEnhancePrompt,
    updateCode,

    // Actions
    generate,
    enhance,
    cancel,
    reset,
  };
}

export default useGeneration;
