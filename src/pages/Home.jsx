// pages/Home/Home.jsx - Complete file with streaming support and multi-page download fix
import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

import useTypewriter from "../hooks/useTypewriter";
import { useEscapeKey } from "../hooks/useKeyboardShortcuts";
import useSelections from "../hooks/useSelections";
import useHomeState from "../hooks/useHomeState";
import useGeneration from "../hooks/useGeneration";

// Configs
import { EXAMPLE_PROMPTS } from "../configs/defaults.config";

// Utils
import {
  calculateTokenCost,
  getTokenBreakdown,
} from "../utils/tokenCalculator";
import { downloadZip } from "../utils/downloadZip";

// Components
import {
  SearchBar,
  TokenOverlay,
  OptionsOverlay,
  PreviewModal,
  MinimizedPreviewPill,
} from "../components/Home";
import AuthModal from "../components/Modals/AuthModal";
import TokensModal from "../components/Modals/TokenPurchaseModal";
import DeployModal from "../components/Modals/DeployModal";
import HelpModal from "../components/Home/HelpModal";
import LegalModal from "../components/Modals/LegalModal";
import ProjectsModal from "../components/Modals/ProjectsModal";
import { generateWebsite } from "../utils/generateWebsite";
import { supabase } from "../lib/supabaseClient";

// Styles
import "./Home.scss";

function Home() {
  // Auth context
  const { user, isAuthenticated, userTokens, refreshTokens } = useAuth();

  // Project context (for editing/deploying)
  const {
    pendingProject,
    pendingAction,
    clearPendingProject,
    updateProjectInCache,
    editProject,
    deployProject,
  } = useProject();

  // UI state management
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

  // Projects modal state
  const [showProjects, setShowProjects] = useState(false);
  const openProjects = useCallback(() => setShowProjects(true), []);
  const closeProjects = useCallback(() => setShowProjects(false), []);

  // Selection state management
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

  // Generation logic - STREAMING ENABLED
  // Now also get generatedFiles for multi-page support
  const {
    isGenerating,
    generatedCode,
    generatedFiles, // <-- ADD THIS for multi-page support
    generationError,
    enhancePrompt,
    setEnhancePrompt,
    generate,
    enhance,
    reset: resetGeneration,
    updateCode,
    isStreaming,
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

  // Save state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [lastRequest, setLastRequest] = useState(null);
  // Show enhance token overlay state
  const [showEnhanceTokenOverlay, setShowEnhanceTokenOverlay] = useState(false);
  const [legalSection, setLegalSection] = useState(null);
  // Typewriter effect for placeholder
  const { text: typewriterText } = useTypewriter({
    prompts: EXAMPLE_PROMPTS,
    enabled: !isExpanded && !prompt,
    typingSpeed: 50,
    erasingSpeed: 30,
    pauseDuration: 2000,
  });

  // Token calculations
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

  // Enhance token calculations
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

      if (pendingProject.customization) {
        // If you have a way to restore selections, do it here
      }

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

    // Capture the enhance prompt BEFORE it gets cleared
    const submittedEnhancePrompt = enhancePrompt.trim();

    // Set lastRequest when enhancement starts
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

  // FIXED: Pass generatedFiles to downloadZip for multi-page support
  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const projectName = generateName(prompt) || "website";
    // Pass files object for multi-page sites, or null for single-page
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
          // Also save files for multi-page projects
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

  // Handle project edit from ProjectsModal
  const handleEditProject = useCallback(
    (project) => {
      closeProjects();
      editProject(project);
    },
    [closeProjects, editProject]
  );

  // Handle project deploy from ProjectsModal
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
            // Add prop to indicate minimized pill is present
            hasMinimizedPreview={previewMinimized}
          />

          <AnimatePresence>
            {showTokenOverlay && (
              <TokenOverlay
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
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {previewMinimized && (
            <MinimizedPreviewPill
              onExpand={restorePreview}
              onDiscard={resetGeneration}
              onOpenProjects={openProjects}
              isGenerating={isGenerating}
            />
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showOptions && (
          <OptionsOverlay
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
      </AnimatePresence>

      {/* FIXED: Show preview during generation + streaming, pass files prop */}
      <AnimatePresence>
        {showPreview && (isGenerating || generatedCode) && (
          <PreviewModal
            isOpen={showPreview}
            html={generatedCode || ""}
            files={generatedFiles} // <-- ADD THIS for multi-page support
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
            streamingPhase={streamingPhase}
            selections={selections}
            originalPrompt={prompt}
            lastRequest={lastRequest}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && (
          <AuthModal
            isOpen={showAuth}
            onClose={closeAuth}
            onOpenLegal={handleOpenLegal}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTokens && (
          <TokensModal
            isOpen={showTokens}
            onClose={closeTokens}
            onOpenAuth={openAuth}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeploy && (
          <DeployModal
            isOpen={showDeploy}
            onClose={closeDeploy}
            html={generatedCode}
            prompt={prompt}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showHelp && <HelpModal isOpen={showHelp} onClose={closeHelp} />}
      </AnimatePresence>

      <AnimatePresence>
        {showLegal && (
          <LegalModal
            isOpen={showLegal}
            onClose={handleCloseLegal}
            initialSection={legalSection}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProjects && (
          <ProjectsModal
            isOpen={showProjects}
            onClose={closeProjects}
            onEditProject={handleEditProject}
            onDeployProject={handleDeployProject}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;
