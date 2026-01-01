// hooks/useGeneration.js - Streaming optimized with body-first rendering
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
  const [streamingPhase, setStreamingPhase] = useState(null); // 'head' | 'body' | 'styles' | 'scripts' | 'complete'

  const { setIsGenerating: setGlobalGenerating } = useGenerationState();
  const generationRef = useRef(null);
  const abortControllerRef = useRef(null);
  const streamRef = useRef(null); // Keep reference to stream for getNormalizedHtml

  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  // Debounced update for streaming - faster for better UX
  const debouncedSetCode = useCallback((html) => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    streamingTimeout = setTimeout(() => {
      setGeneratedCode(html);
    }, 50); // Even faster updates for smoother streaming
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
      setStreamingPhase("head");
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
            // Progress callback for phase updates
            onProgress: ({ phase, content }) => {
              setStreamingPhase(phase);
              // Update code on each progress (debounced)
              debouncedSetCode(content);
            },
          });

          // Store stream reference for later normalization
          streamRef.current = streamResult;

          if (streamResult.chunks) {
            // Consume the stream
            for await (const chunk of streamResult.chunks()) {
              if (abortControllerRef.current?.signal.aborted) break;
              // Chunks are already handled by onProgress callback
              // This loop just drives the async iteration
            }

            // Stream complete - get the normalized HTML (styles moved to head)
            const normalizedHtml = streamResult.getNormalizedHtml();
            setGeneratedCode(normalizedHtml);
            setIsStreaming(false);
            setStreamingPhase("complete");

            onSuccess?.({ code: normalizedHtml, isStreaming: true });
            return { code: normalizedHtml, isStreaming: true };
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
        setStreamingPhase(null);
      }
    },
    [isGenerating, supabaseGenerate, onSuccess, onError, debouncedSetCode]
  );

  const enhance = useCallback(
    async (originalPrompt, selections, user) => {
      if (!enhancePrompt.trim() || !generatedCode || isGenerating) return;

      // Cancel previous
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsGenerating(true);
      setGenerationError(null);
      setIsStreaming(true);
      setStreamingPhase("head");
      abortControllerRef.current = new AbortController();

      try {
        // Use streaming for enhance too
        const streamResult = await generateWebsiteStream({
          prompt: enhancePrompt,
          customization: {
            ...selections,
            isRefinement: true,
            previousHtml: generatedCode,
          },
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

          const normalizedHtml = streamResult.getNormalizedHtml();
          setGeneratedCode(normalizedHtml);
          setEnhancePrompt("");
          setIsStreaming(false);
          setStreamingPhase("complete");

          onSuccess?.({ code: normalizedHtml, isStreaming: true });
          return { code: normalizedHtml, isStreaming: true };
        }

        // Fallback to non-streaming
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
    setGenerationError(null);
    setEnhancePrompt("");
    setIsStreaming(false);
    setStreamingPhase(null);
    streamRef.current = null;
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
    streamingPhase, // New: expose current phase for UI indicators
    setEnhancePrompt,
    updateCode,
    generate,
    enhance,
    cancel,
    reset,
  };
}

export default useGeneration;
