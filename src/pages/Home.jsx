import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Plus, X, BarChart3, Mail, FileText, Database } from "lucide-react";

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
import AddonsModal from "../components/Modals/AddonsModal";
import { ADDONS, getAddonCost } from "../configs/addons.config";
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
import GithubImportModal from "../components/Modals/GithubImportModal";
import { useGenerationState } from "../contexts/GenerationContext";
import { generateWebsite } from "../utils/generateWebsite";

import "./Home.scss";

const ADDON_ICON_MAP = { BarChart3, Mail, FileText, Database };

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
    openGitHubImport,
    closeGitHubImport,
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
    showAddons,
    showPreview,
    previewMinimized,
    openOptions,
    closeOptions,
    openHelp,
    closeHelp,
    openAddons,
    closeAddons,
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
  const [selectedAddons, setSelectedAddons] = useState({});

  const preEnhanceHtmlRef = useRef(null);
  const preEnhanceFilesRef = useRef(null);
  const enhancePromptSnapshotRef = useRef(null);

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

  const { text: typewriterText } = useTypewriter({
    prompts: EXAMPLE_PROMPTS,
    enabled: !isExpanded && !prompt,
    typingSpeed: 50,
    erasingSpeed: 30,
    pauseDuration: 2000,
  });

  const totalAddonCost = useMemo(
    () => getAddonCost(selectedAddons),
    [selectedAddons]
  );

  const selectedCount = useMemo(
    () => Object.values(selectedAddons).filter(Boolean).length,
    [selectedAddons]
  );

  const tokenCostResult = useMemo(
    () => calculateTokenCost(prompt, selections, false, selectedAddons),
    [prompt, selections, selectedAddons]
  );
  const tokenCost = tokenCostResult.cost;

  const tokenBreakdown = useMemo(
    () => getTokenBreakdown(selections, prompt, false, selectedAddons),
    [selections, prompt, selectedAddons]
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

  useEscapeKey(() => {
    if (showPreview) {
      minimizePreview();
    } else if (showOptions) {
      closeOptions();
    } else if (showHelp) {
      closeHelp();
    } else if (showAddons) {
      closeAddons();
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
    } else if (modals.githubImport) {
      closeGitHubImport();
    }
  });

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

    generate(prompt, selections, persistentOptions, user, true, selectedAddons);
  }, [
    prompt,
    isGenerating,
    isAuthenticated,
    tokenBalance.sufficient,
    selections,
    persistentOptions,
    selectedAddons,
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

  const previewVersions = useMemo(() => {
    if (!currentProjectData && versionHistory.length === 0) return [];
    return getDisplayVersions(currentProjectData);
  }, [currentProjectData, versionHistory, getDisplayVersions]);

  const handleToggleEnhanceTokenOverlay = useCallback(
    () => setShowEnhanceTokenOverlay((prev) => !prev),
    []
  );

  const handleToggleAddon = useCallback((addonId) => {
    setSelectedAddons((prev) => ({ ...prev, [addonId]: !prev[addonId] }));
  }, []);

  const handleGitHubImport = useCallback(
    ({ repoName, files, primaryFile }) => {
      const fileKeys = Object.keys(files);
      const primaryHtml = files[primaryFile] || files[fileKeys[0]];

      setPrompt(`Imported from GitHub: ${repoName}`);

      resetProject();
      setCurrentProjectData(null);

      if (fileKeys.length === 1) {
        updateCode(primaryHtml);
      } else {
        // Multi-file import — primary goes into generatedCode,
        // the full file map is available for multi-page preview
        updateCode(primaryHtml);
        // If useGeneration exposes setGeneratedFiles, wire it here
        // to enable multi-page tab switching in PreviewModal.
      }

      openPreview();
    },
    [setPrompt, resetProject, updateCode, openPreview]
  );

  return (
    <div className="home">
      <Header
        modalActive={
          showOptions ||
          showPreview ||
          showHelp ||
          showAddons ||
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

          <div className="addons-trigger">
            {selectedCount > 0 &&
              ADDONS.filter((a) => selectedAddons[a.id]).map((addon) => {
                const Icon = ADDON_ICON_MAP[addon.icon];
                return (
                  <div key={addon.id} className="addons-trigger__pill">
                    {Icon && <Icon size={14} />}
                    <span>{addon.title}</span>
                    <span className="addons-trigger__pill-cost">
                      +{addon.cost}
                    </span>
                    <button
                      className="addons-trigger__pill-remove"
                      onClick={() => handleToggleAddon(addon.id)}
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            <button
              className={`addons-trigger__btn ${
                selectedCount > 0 ? "addons-trigger__btn--active" : ""
              }`}
              onClick={openAddons}
            >
              <Plus size={14} />
              <span>Add-ons</span>
              {selectedCount > 0 && (
                <span className="addons-trigger__btn-count">
                  {selectedCount}
                </span>
              )}
            </button>
          </div>

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
          onCodeChange={updateCode}
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

      {showAddons && (
        <AddonsModal
          isOpen={showAddons}
          onClose={closeAddons}
          selectedAddons={selectedAddons}
          onToggleAddon={handleToggleAddon}
          totalAddonCost={totalAddonCost}
        />
      )}

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

      {modals.githubImport && (
        <GithubImportModal
          isOpen={modals.githubImport}
          onClose={closeGitHubImport}
          onImport={handleGitHubImport}
        />
      )}
      <Footer />
    </div>
  );
}

export default Home;
