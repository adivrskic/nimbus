import { useState, useEffect, useCallback, useMemo, useRef } from "react";

import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";
import { useModals } from "../contexts/ModalContext";

import useTypewriter from "../hooks/useTypewriter";
import { useEscapeKey } from "../hooks/useKeyboardShortcuts";
import useSelections from "../hooks/useSelections";
import useHomeState from "../hooks/useHomeState";
import useGeneration from "../hooks/useGeneration";
import useProjectSave from "../hooks/useProjectSave";
import BackgroundWave from "../components/BackgroundWave";
import Footer from "../components/Footer";
import Header from "../components/Header";

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

  const {
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
  const [currentProjectData, setCurrentProjectData] = useState(null);

  // Refs for snapshotting state before enhancement
  const preEnhanceHtmlRef = useRef(null);
  const preEnhanceFilesRef = useRef(null);
  const enhancePromptSnapshotRef = useRef(null);

  // ─── Preview pill sync ─────────────────────────────────────────────────
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

  useEffect(() => {
    if (isGenerating) {
      refreshColors();
    }
  }, [isGenerating, refreshColors]);

  // ─── Track enhancement completion to record versions ───────────────────
  const wasEnhancingRef = useRef(false);
  useEffect(() => {
    if (isEnhancing) {
      wasEnhancingRef.current = true;
    } else if (wasEnhancingRef.current && generatedCode) {
      wasEnhancingRef.current = false;
      if (preEnhanceHtmlRef.current && enhancePromptSnapshotRef.current) {
        recordEnhancement(
          enhancePromptSnapshotRef.current,
          preEnhanceHtmlRef.current,
          preEnhanceFilesRef.current
        );
        recordEnhancementResult(
          enhancePromptSnapshotRef.current,
          generatedCode,
          generatedFiles
        );
        preEnhanceHtmlRef.current = null;
        preEnhanceFilesRef.current = null;
        enhancePromptSnapshotRef.current = null;
      }
    }
  }, [
    isEnhancing,
    generatedCode,
    generatedFiles,
    recordEnhancement,
    recordEnhancementResult,
  ]);

  // ─── Typewriter ────────────────────────────────────────────────────────
  const { text: typewriterText } = useTypewriter({
    prompts: EXAMPLE_PROMPTS,
    enabled: !isExpanded && !prompt,
    typingSpeed: 50,
    erasingSpeed: 30,
    pauseDuration: 2000,
  });

  // ─── Token calculations ────────────────────────────────────────────────
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

  // ─── Escape key ────────────────────────────────────────────────────────
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

  // ─── Pending project handling ──────────────────────────────────────────
  useEffect(() => {
    if (pendingProject && pendingAction) {
      const projectPrompt =
        pendingProject.prompt || pendingProject.customization?.prompt || "";
      setPrompt(projectPrompt);

      setCurrentProjectId(pendingProject.id);
      setCurrentProjectData(pendingProject);
      loadVersionHistory(pendingProject);

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
    loadVersionHistory,
  ]);

  // ─── Generate ──────────────────────────────────────────────────────────
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
    setCurrentProjectData(null);
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

  // ─── Enhance ───────────────────────────────────────────────────────────
  const handleEnhance = useCallback(() => {
    if (!enhancePrompt.trim() || isGenerating) return;

    if (!isAuthenticated) {
      openAuth();
      return;
    }

    const submittedEnhancePrompt = enhancePrompt.trim();

    // Snapshot current state before enhancement
    preEnhanceHtmlRef.current = generatedCode;
    preEnhanceFilesRef.current = generatedFiles;
    enhancePromptSnapshotRef.current = submittedEnhancePrompt;

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
    generatedCode,
    generatedFiles,
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

  // ─── Project actions ───────────────────────────────────────────────────
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

  // ─── Version handling ──────────────────────────────────────────────────
  const handleViewVersion = useCallback(
    (version, project) => {
      if (version.html_content) {
        updateCode(version.html_content);
        setPrompt(project.prompt || "");
        setCurrentProjectId(project.id);
        setCurrentProjectData(project);
        loadVersionHistory(project);
        setCurrentVersionId(version.id);
        openPreview();
      }
    },
    [
      updateCode,
      setPrompt,
      setCurrentProjectId,
      loadVersionHistory,
      setCurrentVersionId,
      openPreview,
    ]
  );

  const handleSelectPreviewVersion = useCallback(
    (version) => {
      if (version.html_content) {
        updateCode(version.html_content);
        setCurrentVersionId(version.id);
      }
    },
    [updateCode, setCurrentVersionId]
  );

  // Build version list for PreviewModal
  const previewVersions = useMemo(() => {
    if (!currentProjectData && versionHistory.length === 0) return [];
    return getDisplayVersions(currentProjectData);
  }, [currentProjectData, versionHistory, getDisplayVersions]);

  const handleToggleEnhanceTokenOverlay = useCallback(
    () => setShowEnhanceTokenOverlay((prev) => !prev),
    []
  );

  return (
    <div className="home">
      <Header
        modalActive={
          showOptions ||
          showPreview ||
          showHelp ||
          showTokenOverlay ||
          showDeploy
        }
      />
      <div className="home__container">
        <BackgroundWave />
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
          onEnhancePromptChange={setEnhancePrompt}
          saveProps={{
            onSave: handleSave,
            isSaving,
            saveSuccess,
          }}
          enhanceProps={{
            prompt: enhancePrompt,
            onEnhance: handleEnhance,
            tokenCost: enhanceTokenCost,
            breakdown: enhanceBreakdown,
            showTokenOverlay: showEnhanceTokenOverlay,
            onToggleTokenOverlay: handleToggleEnhanceTokenOverlay,
          }}
          tokenProps={{
            isAuthenticated,
            userTokens,
            balance: tokenBalance,
            onBuyTokens: openTokenPurchase,
          }}
          generationState={{
            isGenerating,
            isStreaming,
            isEnhancing,
            streamingPhase,
            error: generationError,
          }}
          versionProps={{
            versions: previewVersions,
            currentVersionId,
            onSelectVersion: handleSelectPreviewVersion,
          }}
          selections={selections}
          originalPrompt={prompt}
          lastRequest={lastRequest}
        />
      )}
      {showHelp && <HelpModal isOpen={showHelp} onClose={closeHelp} />}

      {/* Shared modals */}

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
          onViewVersion={handleViewVersion}
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
      <Footer />
    </div>
  );
}

export default Home;
