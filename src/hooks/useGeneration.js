// hooks/useGeneration.js - Streaming optimized with caching and multi-page support
import { useState, useCallback, useRef, useEffect } from "react";
import { generateWebsiteStream } from "../utils/generateWebsiteStream";
import { useGenerationState } from "../contexts/GenerationContext";
import {
  getCachedGeneration,
  cacheGeneration,
  clearCacheEntry,
  shouldUseCache,
} from "../utils/generationCache";
import {
  isPatchResponse,
  createIncrementalApplier,
} from "../utils/patchParser";

// Throttle interval for streaming updates (ms)
const STREAM_THROTTLE_MS = 80;

// How often the for-await loop yields to the macrotask queue so React can render.
// Without this, the loop processes all buffered chunks as microtasks and React
// never gets a render cycle until the loop finishes → white screen until complete.
const YIELD_INTERVAL_MS = 80;

// Yield to macrotask queue — lets React flush batched state updates & render
const yieldToRenderer = () => new Promise((r) => setTimeout(r, 0));

export function useGeneration({ onSuccess, onError, supabaseGenerate } = {}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [generationError, setGenerationError] = useState(null);
  const [enhancePrompt, setEnhancePrompt] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingPhase, setStreamingPhase] = useState(null);
  const [generatedFiles, setGeneratedFiles] = useState(null);
  const [fromCache, setFromCache] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  const { setIsGenerating: setGlobalGenerating } = useGenerationState();

  const generationRef = useRef(null);
  const abortControllerRef = useRef(null);
  const streamRef = useRef(null);
  const lastGenerationRef = useRef(null);

  // Throttle refs for streaming updates
  const lastUpdateRef = useRef(0);
  const pendingUpdateRef = useRef(null);
  const throttleTimeoutRef = useRef(null);

  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  // Throttled set code - fires immediately on first call, then at regular intervals
  // This ensures progressive rendering during streaming instead of waiting for debounce
  const throttledSetCode = useCallback((html) => {
    const now = Date.now();
    const elapsed = now - lastUpdateRef.current;

    if (elapsed >= STREAM_THROTTLE_MS) {
      // Enough time has passed, update immediately
      lastUpdateRef.current = now;
      setGeneratedCode(html);

      // Clear any pending update
      if (throttleTimeoutRef.current) {
        clearTimeout(throttleTimeoutRef.current);
        throttleTimeoutRef.current = null;
      }
      pendingUpdateRef.current = null;
    } else {
      // Store pending update and schedule it
      pendingUpdateRef.current = html;

      if (!throttleTimeoutRef.current) {
        const remaining = STREAM_THROTTLE_MS - elapsed;
        throttleTimeoutRef.current = setTimeout(() => {
          throttleTimeoutRef.current = null;
          if (pendingUpdateRef.current) {
            lastUpdateRef.current = Date.now();
            setGeneratedCode(pendingUpdateRef.current);
            pendingUpdateRef.current = null;
          }
        }, remaining);
      }
    }
  }, []);

  // Debounced set code for enhancements (kept as-is per requirements)
  const enhanceTimeoutRef = useRef(null);
  const debouncedSetCode = useCallback((html) => {
    if (enhanceTimeoutRef.current) clearTimeout(enhanceTimeoutRef.current);
    enhanceTimeoutRef.current = setTimeout(() => {
      setGeneratedCode(html);
    }, 50);
  }, []);

  const generate = useCallback(
    async (prompt, selections, persistentOptions, user, streaming = true) => {
      if (!prompt.trim() || isGenerating) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      lastGenerationRef.current = { prompt, selections, persistentOptions };

      if (shouldUseCache(false)) {
        const cached = getCachedGeneration(
          prompt,
          selections,
          persistentOptions
        );
        if (cached) {
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
        if (streaming) {
          const streamResult = await generateWebsiteStream({
            prompt,
            customization: selections,
            persistentOptions,
            isRefinement: false,
            signal: abortControllerRef.current.signal,
            onProgress: ({ phase, content, files }) => {
              setStreamingPhase(phase);
              throttledSetCode(content);
              if (files) {
                setGeneratedFiles(files);
              }
            },
          });

          streamRef.current = streamResult;

          if (streamResult.chunks) {
            // ── Consume chunks with periodic macrotask yields ──────────
            // reader.read() can resolve as microtasks when data is buffered,
            // meaning this loop runs chunk→chunk→chunk without ever letting
            // the browser's macrotask queue execute. React renders live on
            // the macrotask queue, so without yields the UI never updates
            // until the loop finishes (white screen → full page).
            //
            // By yielding to setTimeout(0) every YIELD_INTERVAL_MS we let
            // React flush its batched state updates and paint the current
            // streamed HTML to the screen progressively.
            let lastYield = performance.now();

            for await (const chunk of streamResult.chunks()) {
              if (abortControllerRef.current?.signal.aborted) break;

              const now = performance.now();
              if (now - lastYield >= YIELD_INTERVAL_MS) {
                lastYield = now;
                await yieldToRenderer();
              }
            }

            // Flush any pending throttled update before setting final state
            if (throttleTimeoutRef.current) {
              clearTimeout(throttleTimeoutRef.current);
              throttleTimeoutRef.current = null;
            }
            pendingUpdateRef.current = null;

            const finalHtml = streamResult.getFullHtml();
            const files = streamResult.getFiles() || null;

            setGeneratedCode(finalHtml);
            setGeneratedFiles(files);
            setIsStreaming(false);
            setStreamingPhase("complete");

            cacheGeneration(prompt, selections, persistentOptions, {
              html: finalHtml,
              files,
              tokensUsed: streamResult.tokensUsed,
            });

            onSuccess?.({ code: finalHtml, files, isStreaming: true });
            return { code: finalHtml, files, isStreaming: true };
          }
        }

        if (supabaseGenerate) {
          const result = await supabaseGenerate({
            prompt,
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
            cacheGeneration(prompt, selections, persistentOptions, {
              html: code,
              files,
              tokensUsed: result.tokensUsed,
            });

            onSuccess?.(result);
            return result;
          }
        }

        return null;
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
    [isGenerating, supabaseGenerate, onSuccess, onError, throttledSetCode]
  );

  const enhance = useCallback(
    async (originalPrompt, selections, persistentOptions, user) => {
      if (!enhancePrompt.trim() || !generatedCode || isGenerating) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      setIsEnhancing(true);
      setIsGenerating(true);
      setGenerationError(null);
      setFromCache(false);
      setIsStreaming(true);
      abortControllerRef.current = new AbortController();

      // Snapshot the current HTML as the base for patch application
      const baseHtml = generatedCode;
      let patchApplier = null; // Created lazily once we know it's a patch response
      let detectedPatch = false;

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
          onProgress: ({ phase, content, files }) => {
            setStreamingPhase(phase);

            if (!content) return;

            // First time we have enough text, detect if it's a patch response
            if (!detectedPatch && content.length > 20) {
              if (isPatchResponse(content)) {
                detectedPatch = true;
                patchApplier = createIncrementalApplier(baseHtml);
              }
            }

            if (detectedPatch && patchApplier) {
              // Patch mode: apply completed ops incrementally to the base HTML
              const { html, newOpsApplied } = patchApplier.update(content);
              if (newOpsApplied) {
                debouncedSetCode(html);
              }
            } else if (!detectedPatch && content.length > 20) {
              // Full HTML mode (fallback): stream content directly
              debouncedSetCode(content);
            }

            if (files) {
              setGeneratedFiles(files);
            }
          },
        });

        streamRef.current = streamResult;

        if (streamResult.chunks) {
          // Same yield pattern for enhancement streaming
          let lastYield = performance.now();

          for await (const chunk of streamResult.chunks()) {
            if (abortControllerRef.current?.signal.aborted) break;

            const now = performance.now();
            if (now - lastYield >= YIELD_INTERVAL_MS) {
              lastYield = now;
              await yieldToRenderer();
            }
          }

          // Flush pending debounced update
          if (enhanceTimeoutRef.current) {
            clearTimeout(enhanceTimeoutRef.current);
            enhanceTimeoutRef.current = null;
          }

          let finalHtml;
          if (detectedPatch && patchApplier) {
            // Finalize: apply any remaining ops from the last chunk
            finalHtml = patchApplier.finalize(streamResult.getFullHtml());
          } else {
            finalHtml = streamResult.getFullHtml();
          }

          const files = streamResult.getFiles() || null;

          setGeneratedCode(finalHtml);
          setGeneratedFiles(files);
          setEnhancePrompt("");
          setStreamingPhase("complete");

          if (lastGenerationRef.current) {
            clearCacheEntry(
              lastGenerationRef.current.prompt,
              lastGenerationRef.current.selections,
              lastGenerationRef.current.persistentOptions
            );
          }

          onSuccess?.({ code: finalHtml, files, isStreaming: true });
          return { code: finalHtml, files, isStreaming: true };
        }

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
            const files = result.files || null;
            setGeneratedCode(code);
            setGeneratedFiles(files);
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
        setIsEnhancing(false);
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
    if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
    if (enhanceTimeoutRef.current) clearTimeout(enhanceTimeoutRef.current);
    setIsGenerating(false);
    setIsStreaming(false);
    setIsEnhancing(false);
    setStreamingPhase(null);
  }, []);

  const reset = useCallback(() => {
    if (throttleTimeoutRef.current) clearTimeout(throttleTimeoutRef.current);
    if (enhanceTimeoutRef.current) clearTimeout(enhanceTimeoutRef.current);
    setIsGenerating(false);
    setGeneratedCode(null);
    setGeneratedFiles(null);
    setGenerationError(null);
    setEnhancePrompt("");
    setIsStreaming(false);
    setIsEnhancing(false);
    setStreamingPhase(null);
    setFromCache(false);
    streamRef.current = null;
    lastGenerationRef.current = null;
    lastUpdateRef.current = 0;
    pendingUpdateRef.current = null;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const updateCode = useCallback((code) => {
    setGeneratedCode(code);
  }, []);

  const regenerate = useCallback(
    async (prompt, selections, persistentOptions, user, streaming = true) => {
      clearCacheEntry(prompt, selections, persistentOptions);
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
    isEnhancing,
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
