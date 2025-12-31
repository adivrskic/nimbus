// hooks/useGeneration.js - FIXED streaming + preview timing
import { useState, useCallback, useRef, useEffect } from "react";
import { buildFullPrompt } from "../utils/promptBuilder";
import { generateDemo } from "../utils/demoGenerator";
import { generateWebsiteStream } from "../utils/generateWebsiteStream";
import { useGenerationState } from "../contexts/GenerationContext";

let streamingTimeout = null;

export function useGeneration({ onSuccess, onError, supabaseGenerate } = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  const { setIsGenerating: setGlobalGenerating } = useGenerationState();
  const generationRef = useRef(null);
  const abortControllerRef = useRef(null);

  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  // Debounced update for streaming
  const debouncedSetCode = useCallback((html) => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    streamingTimeout = setTimeout(() => {
      setGeneratedCode(html);
    }, 100); // Faster updates
  }, []);

  const generate = useCallback(
    async (prompt, selections, persistentOptions, user, streaming = true) => {
      if (!prompt.trim() || isGenerating) return;

      // Cancel previous
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsGenerating(true);
      setGenerationError(null);
      setIsStreaming(streaming);
      setGeneratedCode(""); // Clear previous
      generationRef.current = Date.now();
      abortControllerRef.current = new AbortController();

      try {
        const fullPrompt = buildFullPrompt(
          prompt,
          selections,
          persistentOptions
        );

        if (streaming) {
          const streamResult = await generateWebsiteStream({
            prompt: fullPrompt,
            customization: selections,
            isRefinement: false,
            signal: abortControllerRef.current.signal,
          });

          if (streamResult.chunks) {
            let html = "";
            for await (const chunk of streamResult.chunks()) {
              console.log("chunks: ", chunk);
              if (abortControllerRef.current?.signal.aborted) break;
              html += chunk;
              debouncedSetCode(html);
            }
            setGeneratedCode(html);
            setIsStreaming(false);
            onSuccess?.({ code: html, isStreaming: true });

            return { code: html, isStreaming: true };
          }
        }

        // Non-streaming fallback
        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt: fullPrompt,
            selections,
            isRefinement: false,
            existingCode: null,
          });
          if (result?.code || result?.html) {
            const code = result.code || result.html;
            setGeneratedCode(code);
            onSuccess?.(result);
            return result;
          }
        }

        const demoHtml = generateDemo(prompt, selections);
        setGeneratedCode(demoHtml);
        onSuccess?.({ code: demoHtml });
        return { code: demoHtml };
      } catch (error) {
        if (error.name !== "AbortError") {
          setGenerationError(error.message);
          onError?.(error);
          const demoHtml = generateDemo(prompt, selections);
          setGeneratedCode(demoHtml);
        }
      } finally {
        setIsGenerating(false);
        setIsStreaming(false);
      }
    },
    [isGenerating, supabaseGenerate, onSuccess, onError, debouncedSetCode]
  );

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

          if (result?.code || result?.html) {
            const code = result.code || result.html;
            setGeneratedCode(code);
            setEnhancePrompt("");
            onSuccess?.(result);
            return result;
          }
        }
      } catch (error) {
        setGenerationError(error.message);
        onError?.(error);
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

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (streamingTimeout) clearTimeout(streamingTimeout);
    setIsGenerating(false);
    setIsStreaming(false);
  }, []);

  const reset = useCallback(() => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    setIsGenerating(false);
    setGeneratedCode(null);
    setGenerationError(null);
    setEnhancePrompt("");
    setIsStreaming(false);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const updateCode = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  return {
    isGenerating,
    generatedCode,
    generationError,
    enhancePrompt,
    isStreaming,
    setEnhancePrompt,
    updateCode,
    generate,
    enhance,
    cancel,
    reset,
  };
}

export default useGeneration;
