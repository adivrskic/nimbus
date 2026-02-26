import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { downloadZip } from "../utils/downloadZip";

/**
 * Generates a project name from a prompt string.
 */
function generateName(promptText) {
  if (!promptText) return "Untitled Project";
  const truncated = promptText.slice(0, 50);
  const lastSpace = truncated.lastIndexOf(" ");
  const name = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
  return name + (promptText.length > 50 ? "..." : "");
}

/**
 * Creates a version entry for the version history.
 */
function createVersionEntry({ prompt, htmlContent, files, label }) {
  return {
    id: `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    prompt: prompt || "",
    label: label || prompt?.slice(0, 60) || "Enhancement",
    html_content: htmlContent,
    files: files || null,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Hook that manages project saving, downloading, current project tracking,
 * and version history.
 *
 * Extracted from Home.jsx to keep the page component focused on orchestration
 * rather than direct Supabase calls and save state management.
 */
export function useProjectSave({
  user,
  isAuthenticated,
  prompt,
  selections,
  persistentOptions,
  generatedCode,
  generatedFiles,
  updateProjectInCache,
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [versionHistory, setVersionHistory] = useState([]);
  const [currentVersionId, setCurrentVersionId] = useState(null);

  // Track the previous HTML so we can snapshot it before an enhancement overwrites it
  const prevCodeRef = useRef(null);
  const isFirstSaveRef = useRef(true);

  // Auto-clear success indicator after 2s
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Track code changes to detect enhancements
  useEffect(() => {
    if (generatedCode && generatedCode !== prevCodeRef.current) {
      // If we already have a project and code changed, this is an enhancement
      if (currentProjectId && prevCodeRef.current) {
        // Snapshot the previous version before it's overwritten
        const prevVersion = createVersionEntry({
          prompt: "Previous version",
          htmlContent: prevCodeRef.current,
          files: null,
          label: "Previous version",
        });

        // Only add if we don't already have this content tracked
        setVersionHistory((prev) => {
          // Check if initial version is tracked
          if (prev.length === 0 && prevCodeRef.current) {
            return [prevVersion];
          }
          return prev;
        });
      }
      prevCodeRef.current = generatedCode;
    }
  }, [generatedCode, currentProjectId]);

  const handleSave = useCallback(async () => {
    if (!generatedCode || !isAuthenticated || !user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // Build version history for storage
      let updatedHistory = [...versionHistory];

      // If this is an enhancement save (we have previous versions), add current as new version
      if (currentProjectId && updatedHistory.length > 0) {
        const newVersion = createVersionEntry({
          prompt: prompt,
          htmlContent: generatedCode,
          files: generatedFiles,
          label: prompt?.slice(0, 60) || "Enhancement",
        });
        updatedHistory.push(newVersion);
        setCurrentVersionId(newVersion.id);
      }

      const projectData = {
        user_id: user.id,
        name: generateName(prompt),
        description: prompt,
        prompt: prompt,
        html_content: generatedCode,
        customization: {
          selections,
          persistentOptions,
          files: generatedFiles,
          versionHistory: updatedHistory.map((v) => ({
            id: v.id,
            prompt: v.prompt,
            label: v.label,
            html_content: v.html_content,
            files: v.files,
            timestamp: v.timestamp,
          })),
        },
      };

      let result;

      if (currentProjectId) {
        const { data, error } = await supabase
          .from("projects")
          .update(projectData)
          .eq("id", currentProjectId)
          .eq("user_id", user.id)
          .select()
          .single();

        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from("projects")
          .insert(projectData)
          .select()
          .single();

        if (error) throw error;
        result = data;
        setCurrentProjectId(result.id);
      }

      // Update local version history from saved result
      const savedHistory = result.customization?.versionHistory || [];
      setVersionHistory(savedHistory);

      setSaveSuccess(true);
      isFirstSaveRef.current = false;
      updateProjectInCache(result);
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    generatedCode,
    generatedFiles,
    isAuthenticated,
    user,
    prompt,
    selections,
    persistentOptions,
    currentProjectId,
    updateProjectInCache,
    versionHistory,
  ]);

  /**
   * Called after an enhancement completes to record the version.
   * Should be called with the enhance prompt BEFORE it gets cleared.
   */
  const recordEnhancement = useCallback(
    (enhancePromptText, previousHtml, previousFiles) => {
      if (!previousHtml) return;

      setVersionHistory((prev) => {
        // If this is the first enhancement, ensure the initial version is tracked
        if (prev.length === 0) {
          const initialVersion = createVersionEntry({
            prompt: prompt || "Initial generation",
            htmlContent: previousHtml,
            files: previousFiles,
            label: "Initial generation",
          });
          initialVersion.isInitial = true;
          return [initialVersion];
        }
        return prev;
      });
    },
    [prompt]
  );

  /**
   * Called after enhancement completes and new code is available.
   * Records the new version with the enhance prompt.
   */
  const recordEnhancementResult = useCallback(
    (enhancePromptText, newHtml, newFiles) => {
      if (!newHtml) return;

      const newVersion = createVersionEntry({
        prompt: enhancePromptText,
        htmlContent: newHtml,
        files: newFiles,
        label: enhancePromptText?.slice(0, 60) || "Enhancement",
      });

      setVersionHistory((prev) => [...prev, newVersion]);
      setCurrentVersionId(newVersion.id);
    },
    []
  );

  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const projectName = generateName(prompt) || "website";
    downloadZip(generatedCode, projectName, generatedFiles);
  }, [generatedCode, generatedFiles, prompt]);

  /**
   * Load version history from a project (when editing an existing project).
   */
  const loadVersionHistory = useCallback((project) => {
    const history = project.customization?.versionHistory || [];
    setVersionHistory(history);
    if (history.length > 0) {
      setCurrentVersionId(history[history.length - 1].id);
    } else {
      setCurrentVersionId(null);
    }
  }, []);

  /**
   * Get the full list of versions for display, including the initial version.
   * Returns versions sorted newest-first.
   */
  const getDisplayVersions = useCallback(
    (project) => {
      const history = [...versionHistory];

      // Build display list: newest first
      const sorted = history.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      // Add initial version at the end if not already present
      const hasInitial = sorted.some((v) => v.isInitial);
      if (!hasInitial && project) {
        sorted.push({
          id: "initial",
          label: "Initial generation",
          prompt: project.prompt || "",
          html_content: project.html_content,
          files: project.customization?.files || null,
          timestamp: project.created_at,
          isInitial: true,
        });
      }

      return sorted;
    },
    [versionHistory]
  );

  /**
   * Call when starting a fresh generation to reset the project association.
   */
  const resetProject = useCallback(() => {
    setCurrentProjectId(null);
    setSaveSuccess(false);
    setVersionHistory([]);
    setCurrentVersionId(null);
    prevCodeRef.current = null;
    isFirstSaveRef.current = true;
  }, []);

  return {
    isSaving,
    saveSuccess,
    currentProjectId,
    setCurrentProjectId,
    handleSave,
    handleDownload,
    resetProject,
    versionHistory,
    currentVersionId,
    setCurrentVersionId,
    recordEnhancement,
    recordEnhancementResult,
    loadVersionHistory,
    getDisplayVersions,
  };
}

export default useProjectSave;
