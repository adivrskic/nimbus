// hooks/useGeneration.js - Streaming optimized with caching
// IMPORTANT: Hook order must match original exactly, new hooks added at end of each group
import { useState, useCallback, useRef, useEffect } from "react";
import { buildFullPrompt } from "../utils/promptBuilder";
import { generateDemo } from "../utils/demoGenerator";
import { generateWebsiteStream } from "../utils/generateWebsiteStream";
import { useGenerationState } from "../contexts/GenerationContext";
import generationCache from "../utils/generationCache";

let streamingTimeout = null;

export function useGeneration({ onSuccess, onError, supabaseGenerate } = {}) {
  // ========================================
  // useState hooks (MUST be in this order)
  // ========================================
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingPhase, setStreamingPhase] = useState(null);
  // NEW hooks added at END of useState group
  const [generatedFiles, setGeneratedFiles] = useState(null);
  const [fromCache, setFromCache] = useState(false);

  // ========================================
  // Context hook (MUST be after useState, before useRef)
  // ========================================
  const { setIsGenerating: setGlobalGenerating } = useGenerationState();

  // ========================================
  // useRef hooks (MUST be in this order)
  // ========================================
  const generationRef = useRef(null);
  const abortControllerRef = useRef(null);
  const streamRef = useRef(null);
  // NEW ref added at END of useRef group
  const lastGenerationRef = useRef(null);

  // ========================================
  // useEffect hooks
  // ========================================
  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  // ========================================
  // useCallback hooks (MUST be in this order)
  // ========================================
  const debouncedSetCode = useCallback((html) => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    streamingTimeout = setTimeout(() => {
      setGeneratedCode(html);
    }, 50);
  }, []);

  const generate = useCallback(
    async (prompt, selections, persistentOptions, user, streaming = true) => {
      if (!prompt.trim() || isGenerating) return;

      // Cancel previous
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Store generation params for cache invalidation
      lastGenerationRef.current = { prompt, selections, persistentOptions };

      // Check cache first (before any network call)
      if (generationCache.shouldUse(false)) {
        const cached = generationCache.get(
          prompt,
          selections,
          persistentOptions
        );
        if (cached) {
          console.log("[Generation] Using cached result");
          setGeneratedCode(cached.html);
          setGeneratedFiles(cached.files);
          setFromCache(true);
          onSuccess?.({
            code: cached.html,
            files: cached.files,
            fromCache: true,
            tokensUsed: 0,
          });
          return {
            code: cached.html,
            files: cached.files,
            fromCache: true,
          };
        }
      }

      setIsGenerating(true);
      setGenerationError(null);
      setIsStreaming(streaming);
      setStreamingPhase("head");
      setGeneratedCode("");
      setGeneratedFiles(null);
      setFromCache(false);
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
            persistentOptions,
            isRefinement: false,
            signal: abortControllerRef.current.signal,
            onProgress: ({ phase, content }) => {
              setStreamingPhase(phase);
              debouncedSetCode(content);
            },
          });

          streamRef.current = streamResult;

          if (streamResult.chunks) {
            for await (const chunk of streamResult.chunks()) {
              if (abortControllerRef.current?.signal.aborted) break;
            }

            const finalHtml = streamResult.getFullHtml();
            const files = streamResult.getFiles?.() || null;

            setGeneratedCode(finalHtml);
            setGeneratedFiles(files);
            setIsStreaming(false);
            setStreamingPhase("complete");

            // Cache the result
            generationCache.set(prompt, selections, persistentOptions, {
              html: finalHtml,
              files,
              tokensUsed: streamResult.tokensUsed,
            });

            onSuccess?.({ code: finalHtml, files, isStreaming: true });
            return { code: finalHtml, files, isStreaming: true };
          }
        }

        // Non-streaming fallback
        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt: fullPrompt,
            selections,
            persistentOptions,
            isRefinement: false,
            existingCode: null,
          });

          if (result?.code || result?.html) {
            const code = result.code || result.html;
            const files = result.files || null;

            setGeneratedCode(code);
            setGeneratedFiles(files);

            // Cache it
            generationCache.set(prompt, selections, persistentOptions, {
              html: code,
              files,
              tokensUsed: result.tokensUsed,
            });

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
        setStreamingPhase(null);
      }
    },
    [isGenerating, supabaseGenerate, onSuccess, onError, debouncedSetCode]
  );

  const enhance = useCallback(
    async (originalPrompt, selections, persistentOptions, user) => {
      if (!enhancePrompt.trim() || !generatedCode || isGenerating) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsGenerating(true);
      setGenerationError(null);
      setIsStreaming(true);
      setStreamingPhase("head");
      setFromCache(false);
      abortControllerRef.current = new AbortController();

      try {
        const streamResult = await generateWebsiteStream({
          prompt: enhancePrompt,
          customization: {
            ...selections,
            isRefinement: true,
            previousHtml: generatedCode,
          },
          persistentOptions,
          signal: abortControllerRef.current.signal,
          onProgress: ({ phase, content }) => {
            setStreamingPhase(phase);
            debouncedSetCode(content);
          },
        });

        streamRef.current = streamResult;

        if (streamResult.chunks) {
          for await (const chunk of streamResult.chunks()) {
            if (abortControllerRef.current?.signal.aborted) break;
          }

          const finalHtml = streamResult.getFullHtml();
          setGeneratedCode(finalHtml);
          setEnhancePrompt("");
          setIsStreaming(false);
          setStreamingPhase("complete");

          // Invalidate old cache since content changed
          if (lastGenerationRef.current) {
            generationCache.clear(
              lastGenerationRef.current.prompt,
              lastGenerationRef.current.selections,
              lastGenerationRef.current.persistentOptions
            );
          }

          onSuccess?.({ code: finalHtml, isStreaming: true });
          return { code: finalHtml, isStreaming: true };
        }

        // Fallback to non-streaming
        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt: enhancePrompt,
            selections: selections || {},
            persistentOptions,
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
        if (error.name !== "AbortError") {
          setGenerationError(error.message);
          onError?.(error);
        }
      } finally {
        setIsGenerating(false);
        setIsStreaming(false);
        setStreamingPhase(null);
      }
    },
    [
      enhancePrompt,
      generatedCode,
      isGenerating,
      supabaseGenerate,
      onSuccess,
      onError,
      debouncedSetCode,
    ]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (streamingTimeout) clearTimeout(streamingTimeout);
    setIsGenerating(false);
    setIsStreaming(false);
    setStreamingPhase(null);
  }, []);

  const reset = useCallback(() => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    setIsGenerating(false);
    setGeneratedCode(null);
    setGeneratedFiles(null);
    setGenerationError(null);
    setEnhancePrompt("");
    setIsStreaming(false);
    setStreamingPhase(null);
    setFromCache(false);
    streamRef.current = null;
    lastGenerationRef.current = null;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const updateCode = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  // NEW callback added at END of useCallback group
  const regenerate = useCallback(
    async (prompt, selections, persistentOptions, user, streaming = true) => {
      generationCache.clear(prompt, selections, persistentOptions);
      return generate(prompt, selections, persistentOptions, user, streaming);
    },
    [generate]
  );

  return {
    isGenerating,
    generatedCode,
    generatedFiles,
    generationError,
    enhancePrompt,
    isStreaming,
    streamingPhase,
    fromCache,
    setEnhancePrompt,
    updateCode,
    generate,
    enhance,
    regenerate,
    cancel,
    reset,
  };
}

export default useGeneration;
