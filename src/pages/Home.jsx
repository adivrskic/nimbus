import { useState, useEffect, useCallback, useMemo } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

import useTypewriter from "../hooks/useTypewriter";
import { useEscapeKey } from "../hooks/useKeyboardShortcuts";
import useSelections from "../hooks/useSelections";
import useHomeState from "../hooks/useHomeState";
import useGeneration from "../hooks/useGeneration";

import { EXAMPLE_PROMPTS } from "../configs/defaults.config";

import {
  calculateTokenCost,
  getTokenBreakdown,
} from "../utils/tokenCalculator";
import { downloadZip } from "../utils/downloadZip";

import SearchBar from "../components/SearchBar";
import TokenModal from "../components/Modals/TokenModal";
import OptionsModal from "../components/Modals/OptionsModal";
import PreviewModal from "../components/Modals/PreviewModal";
import MinimizedPreviewPill from "../components/MinimizedPreviewPill";
import AuthModal from "../components/Modals/AuthModal";
import TokensModal from "../components/Modals/TokenPurchaseModal";
import HelpModal from "../components/Modals/HelpModal";
import LegalModal from "../components/Modals/LegalModal";
import ProjectsModal from "../components/Modals/ProjectsModal";
import { generateWebsite } from "../utils/generateWebsite";
import { supabase } from "../lib/supabaseClient";

import "./Home.scss";

function Home() {
  const { user, isAuthenticated, userTokens, refreshTokens } = useAuth();

  const {
    pendingProject,
    pendingAction,
    clearPendingProject,
    updateProjectInCache,
    editProject,
    deployProject,
  } = useProject();

  const {
    prompt,
    setPrompt,
    isExpanded,
    inputRef,
    handleInputFocus,
    handleInputBlur,
    handlePromptChange,
    focusInput,
    persistentOptions,
    updatePersistentOption,
    showOptions,
    showTokenOverlay,
    showAuth,
    showTokens,
    showDeploy,
    showHelp,
    showLegal,
    showPreview,
    previewMinimized,
    openOptions,
    closeOptions,
    openHelp,
    closeHelp,
    openAuth,
    closeAuth,
    openTokens,
    closeTokens,
    openDeploy,
    closeDeploy,
    openLegal,
    closeLegal,
    toggleTokenOverlay,
    closeTokenOverlay,
    openPreview,
    closePreview,
    minimizePreview,
    restorePreview,
  } = useHomeState();

  const [showProjects, setShowProjects] = useState(false);
  const openProjects = useCallback(() => setShowProjects(true), []);
  const closeProjects = useCallback(() => setShowProjects(false), []);

  const {
    selections,
    hasSelection,
    getDisplayValue,
    handleSelect,
    resetSelection,
    resetAll: resetSelections,
    activeCategories,
    hasCustomizations,
  } = useSelections();

  const {
    isGenerating,
    generatedCode,
    generatedFiles,
    generationError,
    enhancePrompt,
    setEnhancePrompt,
    generate,
    enhance,
    reset: resetGeneration,
    updateCode,
    isStreaming,
    isEnhancing,
    streamingPhase,
  } = useGeneration({
    onSuccess: () => {
      refreshTokens?.();
    },
    onError: (error) => {
      console.error("Generation failed:", error);
    },
    supabaseGenerate: generateWebsite,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  const [showEnhanceTokenOverlay, setShowEnhanceTokenOverlay] = useState(false);
  const [legalSection, setLegalSection] = useState(null);
  const { text: typewriterText } = useTypewriter({
    prompts: EXAMPLE_PROMPTS,
    enabled: !isExpanded && !prompt,
    typingSpeed: 50,
    erasingSpeed: 30,
    pauseDuration: 2000,
  });

  const tokenCostResult = useMemo(
    () => calculateTokenCost(prompt, selections),
    [prompt, selections]
  );
  const tokenCost = tokenCostResult.cost;

  const tokenBreakdown = useMemo(
    () => getTokenBreakdown(selections, prompt),
    [selections, prompt]
  );

  const tokenBalance = useMemo(() => {
    if (!isAuthenticated) return { status: "unknown", sufficient: false };
    const sufficient = userTokens >= tokenCost;
    return {
      status: sufficient ? "good" : userTokens > 0 ? "warning" : "critical",
      sufficient,
    };
  }, [isAuthenticated, userTokens, tokenCost]);

  const enhanceTokenCostResult = useMemo(
    () => calculateTokenCost(enhancePrompt, {}, true),
    [enhancePrompt]
  );
  const enhanceTokenCost = enhanceTokenCostResult.cost;

  const enhanceBreakdown = useMemo(
    () => getTokenBreakdown({}, enhancePrompt, true),
    [enhancePrompt]
  );

  const handleOpenLegal = (section) => {
    console.log("hello: ", section);
    setLegalSection(section);
    openLegal();
  };

  const handleCloseLegal = () => {
    closeLegal();
    setLegalSection(null);
  };

  // Escape key handler
  useEscapeKey(() => {
    if (showPreview) {
      minimizePreview();
    } else if (showOptions) {
      closeOptions();
    } else if (showHelp) {
      closeHelp();
    } else if (showAuth) {
      closeAuth();
    } else if (showTokens) {
      closeTokens();
    } else if (showDeploy) {
      closeDeploy();
    } else if (showLegal) {
      handleCloseLegal();
    } else if (showProjects) {
      closeProjects();
    }
  });

  useEffect(() => {
    if (pendingProject && pendingAction) {
      const projectPrompt =
        pendingProject.prompt || pendingProject.customization?.prompt || "";
      setPrompt(projectPrompt);

      setCurrentProjectId(pendingProject.id);

      if (pendingAction === "edit") {
        if (pendingProject.html_content) {
          updateCode(pendingProject.html_content);
          openPreview();
        }
      } else if (pendingAction === "deploy") {
        if (pendingProject.html_content) {
          updateCode(pendingProject.html_content);
          openDeploy();
        }
      }

      clearPendingProject();
    }
  }, [
    pendingProject,
    pendingAction,
    setPrompt,
    clearPendingProject,
    updateCode,
    openPreview,
    openDeploy,
  ]);

  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    if (!isAuthenticated) {
      openAuth();
      return;
    }

    if (!tokenBalance.sufficient) {
      openTokens();
      return;
    }

    setLastRequest({
      type: "initial",
      prompt: prompt.trim(),
    });

    setCurrentProjectId(null);
    setSaveSuccess(false);
    openPreview();

    generate(prompt, selections, persistentOptions, user, true);
  }, [
    prompt,
    isGenerating,
    isAuthenticated,
    tokenBalance.sufficient,
    selections,
    persistentOptions,
    user,
    generate,
    openAuth,
    openTokens,
    openPreview,
  ]);

  const handleEnhance = useCallback(() => {
    if (!enhancePrompt.trim() || isGenerating) return;

    if (!isAuthenticated) {
      openAuth();
      return;
    }

    const submittedEnhancePrompt = enhancePrompt.trim();

    setLastRequest({
      type: "enhancement",
      prompt: submittedEnhancePrompt,
    });

    enhance(prompt, selections, persistentOptions, user);
  }, [
    enhancePrompt,
    isGenerating,
    isAuthenticated,
    prompt,
    selections,
    persistentOptions,
    user,
    enhance,
    openAuth,
  ]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  const generateName = useCallback((promptText) => {
    if (!promptText) return "Untitled Project";
    const truncated = promptText.slice(0, 50);
    const lastSpace = truncated.lastIndexOf(" ");
    const name = lastSpace > 20 ? truncated.slice(0, lastSpace) : truncated;
    return name + (promptText.length > 50 ? "..." : "");
  }, []);

  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const projectName = generateName(prompt) || "website";
    downloadZip(generatedCode, projectName, generatedFiles);
  }, [generatedCode, generatedFiles, prompt, generateName]);

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
    generateName,
    updateProjectInCache,
  ]);

  const handlePersistentChange = useCallback(
    (category, field, value) => {
      updatePersistentOption(category, {
        ...persistentOptions[category],
        [field]: value,
      });
    },
    [persistentOptions, updatePersistentOption]
  );

  const handlePillClick = useCallback(
    (category) => {
      openOptions();
    },
    [openOptions]
  );

  const handleEditProject = useCallback(
    (project) => {
      closeProjects();
      editProject(project);
    },
    [closeProjects, editProject]
  );

  const handleDeployProject = useCallback(
    (project) => {
      closeProjects();
      deployProject(project);
    },
    [closeProjects, deployProject]
  );

  return (
    <div className="home">
      <div className="home__container">
        <div className="home__search-section">
          <SearchBar
            ref={inputRef}
            value={prompt}
            onChange={handlePromptChange}
            onKeyDown={handleKeyDown}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Describe your website..."
            typewriterText={typewriterText}
            showTypewriter={!isExpanded && !prompt}
            isExpanded={isExpanded}
            isGenerating={isGenerating}
            tokenCost={tokenCost}
            showTokenOverlay={showTokenOverlay}
            onTokenClick={toggleTokenOverlay}
            showOptions={showOptions}
            onOptionsClick={openOptions}
            onHelpClick={openHelp}
            onGenerate={handleGenerate}
            activeCategories={activeCategories}
            onPillClick={handlePillClick}
            onResetPill={resetSelection}
            hasMinimizedPreview={previewMinimized}
          />

          {showTokenOverlay && (
            <TokenModal
              isOpen={showTokenOverlay}
              onClose={closeTokenOverlay}
              tokenCost={tokenCost}
              breakdown={tokenBreakdown}
              userTokens={userTokens}
              isAuthenticated={isAuthenticated}
              tokenBalance={tokenBalance}
              onBuyTokens={openTokens}
            />
          )}
        </div>

        {previewMinimized && (
          <MinimizedPreviewPill
            onExpand={restorePreview}
            onDiscard={resetGeneration}
            onOpenProjects={openProjects}
            isGenerating={isGenerating}
          />
        )}
      </div>

      {showOptions && (
        <OptionsModal
          isOpen={showOptions}
          onClose={closeOptions}
          selections={selections}
          onSelect={handleSelect}
          onReset={resetSelection}
          hasSelection={hasSelection}
          getDisplayValue={getDisplayValue}
          persistentOptions={persistentOptions}
          onPersistentChange={handlePersistentChange}
        />
      )}

      {showPreview && (isGenerating || generatedCode) && (
        <PreviewModal
          isOpen={showPreview}
          html={generatedCode || ""}
          files={generatedFiles}
          onClose={closePreview}
          onMinimize={minimizePreview}
          onDownload={handleDownload}
          onSave={handleSave}
          onDeploy={openDeploy}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          isGenerating={isGenerating}
          enhancePrompt={enhancePrompt}
          onEnhancePromptChange={setEnhancePrompt}
          onEnhance={handleEnhance}
          enhanceTokenCost={enhanceTokenCost}
          enhanceBreakdown={enhanceBreakdown}
          showEnhanceTokenOverlay={showEnhanceTokenOverlay}
          onToggleEnhanceTokenOverlay={() =>
            setShowEnhanceTokenOverlay((prev) => !prev)
          }
          isAuthenticated={isAuthenticated}
          userTokens={userTokens}
          tokenBalance={tokenBalance}
          onBuyTokens={openTokens}
          isStreaming={isStreaming}
          isEnhancing={isEnhancing}
          streamingPhase={streamingPhase}
          selections={selections}
          originalPrompt={prompt}
          lastRequest={lastRequest}
        />
      )}

      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          onClose={closeAuth}
          onOpenLegal={handleOpenLegal}
        />
      )}

      {showTokens && (
        <TokensModal
          isOpen={showTokens}
          onClose={closeTokens}
          onOpenAuth={openAuth}
        />
      )}

      {showDeploy && (
        <DeployModal
          isOpen={showDeploy}
          onClose={closeDeploy}
          html={generatedCode}
          prompt={prompt}
        />
      )}

      {showHelp && <HelpModal isOpen={showHelp} onClose={closeHelp} />}

      {showLegal && (
        <LegalModal
          isOpen={showLegal}
          onClose={handleCloseLegal}
          initialSection={legalSection}
        />
      )}

      {showProjects && (
        <ProjectsModal
          isOpen={showProjects}
          onClose={closeProjects}
          onEditProject={handleEditProject}
          onDeployProject={handleDeployProject}
        />
      )}
    </div>
  );
}

export default Home;
