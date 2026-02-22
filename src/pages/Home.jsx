import { useState, useEffect, useCallback, useMemo } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import { useModals } from "../contexts/ModalContext";

import useTypewriter from "../hooks/useTypewriter";
import { useEscapeKey } from "../hooks/useKeyboardShortcuts";
import useSelections from "../hooks/useSelections";
import useHomeState from "../hooks/useHomeState";
import useGeneration from "../hooks/useGeneration";
import useProjectSave from "../hooks/useProjectSave";

import { EXAMPLE_PROMPTS } from "../configs/defaults.config";

import {
  calculateTokenCost,
  getTokenBreakdown,
} from "../utils/tokenCalculator";

import SearchBar from "../components/SearchBar";
import TokenModal from "../components/Modals/TokenModal";
import OptionsModal from "../components/Modals/OptionsModal";
import PreviewModal from "../components/Modals/PreviewModal";
import AuthModal from "../components/Modals/AuthModal";
import TokenPurchaseModal from "../components/Modals/TokenPurchaseModal";
import HelpModal from "../components/Modals/HelpModal";
import LegalModal from "../components/Modals/LegalModal";
import ProjectsModal from "../components/Modals/ProjectsModal";
import RoadmapModal from "../components/Modals/RoadmapModal";
import SupportModal from "../components/Modals/SupportModal";
import { useGenerationState } from "../contexts/GenerationContext";
import { generateWebsite } from "../utils/generateWebsite";

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

  // Shared modals via context (Header, Footer, and Home all use these)
  const {
    modals,
    legalSection,
    openAuth,
    closeAuth,
    openTokenPurchase,
    closeTokenPurchase,
    openProjects,
    closeProjects,
    openLegal,
    closeLegal,
    openRoadmap,
    closeRoadmap,
    openSupport,
    closeSupport,
  } = useModals();

  // Page-specific modals (only Home needs these)
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
    showDeploy,
    showHelp,
    showPreview,
    previewMinimized,
    openOptions,
    closeOptions,
    openHelp,
    closeHelp,
    openDeploy,
    closeDeploy,
    toggleTokenOverlay,
    closeTokenOverlay,
    openPreview,
    closePreview,
    minimizePreview,
    restorePreview,
  } = useHomeState();

  const { showPreviewPill, hidePreviewPill, refreshColors } =
    useGenerationState();

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

  // Fix #11: Save/download logic extracted into dedicated hook
  const {
    isSaving,
    saveSuccess,
    currentProjectId,
    setCurrentProjectId,
    handleSave,
    handleDownload,
    resetProject,
  } = useProjectSave({
    user,
    isAuthenticated,
    prompt,
    selections,
    persistentOptions,
    generatedCode,
    generatedFiles,
    updateProjectInCache,
  });

  const [lastRequest, setLastRequest] = useState(null);
  const [showEnhanceTokenOverlay, setShowEnhanceTokenOverlay] = useState(false);

  // Sync minimized preview state to context so Header can show the pill
  useEffect(() => {
    if (generatedCode && !showPreview) {
      showPreviewPill({ onRestore: restorePreview, isGenerating });
    } else {
      hidePreviewPill();
    }
  }, [
    generatedCode,
    showPreview,
    isGenerating,
    restorePreview,
    showPreviewPill,
    hidePreviewPill,
  ]);

  // Fresh colors for each new generation
  useEffect(() => {
    if (isGenerating) {
      refreshColors();
    }
  }, [isGenerating, refreshColors]);

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

  // Escape key handler
  useEscapeKey(() => {
    if (showPreview) {
      minimizePreview();
    } else if (showOptions) {
      closeOptions();
    } else if (showHelp) {
      closeHelp();
    } else if (modals.auth) {
      closeAuth();
    } else if (modals.tokenPurchase) {
      closeTokenPurchase();
    } else if (showDeploy) {
      closeDeploy();
    } else if (modals.legal) {
      closeLegal();
    } else if (modals.projects) {
      closeProjects();
    } else if (modals.roadmap) {
      closeRoadmap();
    } else if (modals.support) {
      closeSupport();
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
    setCurrentProjectId,
    clearPendingProject,
    updateCode,
    openPreview,
    openDeploy,
  ]);

  const handleGenerate = useCallback(() => {
    if (!prompt.trim() || isGenerating) return;

    if (!isAuthenticated) {
      openAuth();
      return;
    }

    if (!tokenBalance.sufficient) {
      openTokenPurchase();
      return;
    }

    setLastRequest({
      type: "initial",
      prompt: prompt.trim(),
    });

    resetProject();
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
    openTokenPurchase,
    openPreview,
    resetProject,
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

  const handlePersistentChange = useCallback(
    (category, field, value) => {
      updatePersistentOption(category, {
        ...persistentOptions[category],
        [field]: value,
      });
    },
    [persistentOptions, updatePersistentOption]
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

  // ---- Grouped props for PreviewModal (Fix #13) ----

  const previewSaveProps = useMemo(
    () => ({ onSave: handleSave, isSaving, saveSuccess }),
    [handleSave, isSaving, saveSuccess]
  );

  const previewEnhanceProps = useMemo(
    () => ({
      prompt: enhancePrompt,
      onChange: setEnhancePrompt,
      onEnhance: handleEnhance,
      tokenCost: enhanceTokenCost,
      breakdown: enhanceBreakdown,
      showTokenOverlay: showEnhanceTokenOverlay,
      onToggleTokenOverlay: () => setShowEnhanceTokenOverlay((prev) => !prev),
    }),
    [
      enhancePrompt,
      setEnhancePrompt,
      handleEnhance,
      enhanceTokenCost,
      enhanceBreakdown,
      showEnhanceTokenOverlay,
    ]
  );

  const previewTokenProps = useMemo(
    () => ({
      isAuthenticated,
      userTokens,
      balance: tokenBalance,
      onBuyTokens: openTokenPurchase,
    }),
    [isAuthenticated, userTokens, tokenBalance, openTokenPurchase]
  );

  const previewGenerationState = useMemo(
    () => ({
      isGenerating,
      isStreaming,
      isEnhancing,
      streamingPhase,
      error: generationError,
    }),
    [isGenerating, isStreaming, isEnhancing, streamingPhase, generationError]
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
              onBuyTokens={openTokenPurchase}
            />
          )}
        </div>
      </div>

      {/* Page-specific modals */}

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
          saveProps={previewSaveProps}
          enhanceProps={previewEnhanceProps}
          tokenProps={previewTokenProps}
          generationState={previewGenerationState}
          selections={selections}
          originalPrompt={prompt}
          lastRequest={lastRequest}
        />
      )}

      {showHelp && <HelpModal isOpen={showHelp} onClose={closeHelp} />}

      {/* Shared modals (triggered by Header, Footer, or Home) */}

      {modals.auth && (
        <AuthModal
          isOpen={modals.auth}
          onClose={closeAuth}
          onOpenLegal={openLegal}
        />
      )}

      {modals.tokenPurchase && (
        <TokenPurchaseModal
          isOpen={modals.tokenPurchase}
          onClose={closeTokenPurchase}
          onOpenAuth={openAuth}
        />
      )}

      {modals.projects && (
        <ProjectsModal
          isOpen={modals.projects}
          onClose={closeProjects}
          onEditProject={handleEditProject}
          onDeployProject={handleDeployProject}
        />
      )}

      {modals.legal && (
        <LegalModal
          isOpen={modals.legal}
          onClose={closeLegal}
          initialSection={legalSection}
        />
      )}

      {modals.roadmap && (
        <RoadmapModal isOpen={modals.roadmap} onClose={closeRoadmap} />
      )}

      {modals.support && (
        <SupportModal isOpen={modals.support} onClose={closeSupport} />
      )}
    </div>
  );
}

export default Home;
