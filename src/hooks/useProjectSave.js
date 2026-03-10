import { useState, useCallback, useEffect, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { downloadZip } from "../utils/downloadZip";

function generateName(promptText) {
  if (!promptText) return "Untitled Project";
  const truncated = promptText.slice(0, 50);
  const lastSpace = truncated.lastIndexOf(" ");
  const name = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
  return name + (promptText.length > 50 ? "..." : "");
}

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

  const isFirstSaveRef = useRef(true);

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
      // Don't add a version on save — versions are only created
      // explicitly by recordEnhancement / recordEnhancementResult.
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
          versionHistory: versionHistory.map((v) => ({
            id: v.id,
            prompt: v.prompt,
            label: v.label,
            html_content: v.html_content,
            files: v.files,
            timestamp: v.timestamp,
            isInitial: v.isInitial || false,
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

  const recordEnhancement = useCallback(
    (enhancePromptText, previousHtml, previousFiles) => {
      if (!previousHtml) return;

      setVersionHistory((prev) => {
        // Only add the initial version once
        if (prev.some((v) => v.isInitial)) return prev;

        const initialVersion = createVersionEntry({
          prompt: prompt || "Initial generation",
          htmlContent: previousHtml,
          files: previousFiles,
          label: "Initial generation",
        });
        initialVersion.isInitial = true;
        return [...prev, initialVersion];
      });
    },
    [prompt]
  );

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

  const handleDownload = useCallback(
    (format = "html") => {
      if (!generatedCode) return;
      const projectName = generateName(prompt) || "website";
      downloadZip(generatedCode, projectName, generatedFiles, format);
    },
    [generatedCode, generatedFiles, prompt]
  );

  const loadVersionHistory = useCallback((project) => {
    const history = project.customization?.versionHistory || [];
    setVersionHistory(history);
    if (history.length > 0) {
      setCurrentVersionId(history[history.length - 1].id);
    } else {
      setCurrentVersionId(null);
    }
  }, []);

  const getDisplayVersions = useCallback(() => {
    if (versionHistory.length === 0) return [];

    // Return in chronological order (oldest first = v1)
    const sorted = [...versionHistory].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    return sorted;
  }, [versionHistory]);

  const resetProject = useCallback(() => {
    setCurrentProjectId(null);
    setSaveSuccess(false);
    setVersionHistory([]);
    setCurrentVersionId(null);
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
