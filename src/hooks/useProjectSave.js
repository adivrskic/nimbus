import { useState, useCallback, useEffect } from "react";
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
 * Hook that manages project saving, downloading, and current project tracking.
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

  // Auto-clear success indicator after 2s
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleSave = useCallback(async () => {
    if (!generatedCode || !isAuthenticated || !user) return;

    setIsSaving(true);
    setSaveSuccess(false);

    try {
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

      setSaveSuccess(true);
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
  ]);

  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const projectName = generateName(prompt) || "website";
    downloadZip(generatedCode, projectName, generatedFiles);
  }, [generatedCode, generatedFiles, prompt]);

  /**
   * Call when starting a fresh generation to reset the project association.
   */
  const resetProject = useCallback(() => {
    setCurrentProjectId(null);
    setSaveSuccess(false);
  }, []);

  return {
    isSaving,
    saveSuccess,
    currentProjectId,
    setCurrentProjectId,
    handleSave,
    handleDownload,
    resetProject,
  };
}

export default useProjectSave;
