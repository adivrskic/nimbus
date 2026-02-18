// hooks/useGeneration.js - Streaming optimized with caching and multi-page support
import { useState, useCallback, useRef, useEffect } from "react";
import { buildFullPrompt } from "../utils/promptBuilder";
import { generateWebsiteStream } from "../utils/generateWebsiteStream";
import { useGenerationState } from "../contexts/GenerationContext";

const generationCache = {
  get: () => null,
  set: () => {},
  clear: () => {},
  shouldUse: () => false,
};

let streamingTimeout = null;

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

  useEffect(() => {
    setGlobalGenerating(isGenerating);
  }, [isGenerating, setGlobalGenerating]);

  const debouncedSetCode = useCallback((html) => {
    if (streamingTimeout) clearTimeout(streamingTimeout);
    streamingTimeout = setTimeout(() => {
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
            onProgress: ({ phase, content, files }) => {
              setStreamingPhase(phase);
              debouncedSetCode(content);
              if (files) {
                setGeneratedFiles(files);
              }
            },
          });

          streamRef.current = streamResult;

          if (streamResult.chunks) {
            for await (const chunk of streamResult.chunks()) {
              if (abortControllerRef.current?.signal.aborted) break;
            }

            const finalHtml = streamResult.getFullHtml();
            const files = streamResult.getFiles() || null;

            setGeneratedCode(finalHtml);
            setGeneratedFiles(files);
            setIsStreaming(false);
            setStreamingPhase("complete");

            generationCache.set(prompt, selections, persistentOptions, {
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

        return { code: demoHtml };
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
    [isGenerating, supabaseGenerate, onSuccess, onError, debouncedSetCode]
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
          onProgress: ({ phase, files }) => {
            setStreamingPhase(phase);
          },
        });

        streamRef.current = streamResult;

        if (streamResult.chunks) {
          for await (const chunk of streamResult.chunks()) {
            if (abortControllerRef.current?.signal.aborted) break;
          }

          const finalHtml = streamResult.getFullHtml();
          const files = streamResult.getFiles() || null;

          setGeneratedCode(finalHtml);
          setGeneratedFiles(files);
          setEnhancePrompt("");
          setStreamingPhase("complete");

          if (lastGenerationRef.current) {
            generationCache.clear(
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
    if (streamingTimeout) clearTimeout(streamingTimeout);
    setIsGenerating(false);
    setIsStreaming(false);
    setIsEnhancing(false);
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
    setIsEnhancing(false);
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
