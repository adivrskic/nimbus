// pages/Home/Home.jsx - Refactored main Home page component
import { useState, useEffect, useCallback, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useProject } from "../contexts/ProjectContext";

import useTypewriter from "../hooks/useTypewriter";
import useGenerationTimer from "../hooks/useGenerationTimer";
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

// Components
import {
  SearchBar,
  ActivePills,
  TokenOverlay,
  OptionsOverlay,
  PreviewModal,
  MinimizedPreviewPill,
} from "../components/Home";
import AuthModal from "../components/AuthModal";
import TokensModal from "../components/TokenPurchaseModal";
import DeployModal from "../components/DeployModal";
import HelpModal from "../components/Home/HelpModal";
import LegalModal from "../components/LegalModal";

// Styles
import "./Home.scss";

function Home() {
  // Auth context
  const { user, isAuthenticated, userTokens, refreshTokens } = useAuth();

  // Project context (for editing/deploying)
  const { pendingProject, clearPendingProject } = useProject();

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

  // Generation logic
  const {
    isGenerating,
    generatedCode,
    generationError,
    enhancePrompt,
    setEnhancePrompt,
    generate,
    enhance,
    reset: resetGeneration,
  } = useGeneration({
    onSuccess: () => {
      openPreview();
      refreshTokens?.();
    },
    onError: (error) => {
      console.error("Generation failed:", error);
    },
  });

  // Typewriter effect for placeholder
  const { text: typewriterText } = useTypewriter({
    prompts: EXAMPLE_PROMPTS,
    enabled: !isExpanded && !prompt,
    typingSpeed: 50,
    erasingSpeed: 30,
    pauseDuration: 2000,
  });

  // Generation timer
  const { elapsedTime, getEstimatedTimeText } = useGenerationTimer({
    isGenerating,
    estimatedTime: 20,
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
      closeLegal();
    }
  });

  // Handle pending project from context (edit mode)
  useEffect(() => {
    if (pendingProject) {
      setPrompt(pendingProject.prompt || "");
      if (pendingProject.selections) {
        // Load selections from project
      }
      clearPendingProject?.();
    }
  }, [pendingProject, setPrompt, clearPendingProject]);

  // Handle generate
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

    generate(prompt, selections, persistentOptions, user);
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
  ]);

  // Handle enhance
  const handleEnhance = useCallback(() => {
    if (!enhancePrompt.trim() || isGenerating) return;

    if (!isAuthenticated) {
      openAuth();
      return;
    }

    enhance(prompt, user);
  }, [
    enhancePrompt,
    isGenerating,
    isAuthenticated,
    prompt,
    user,
    enhance,
    openAuth,
  ]);

  // Handle keyboard shortcuts in input
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleGenerate();
      }
    },
    [handleGenerate]
  );

  // Handle download
  const handleDownload = useCallback(() => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "website.html";
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedCode]);

  // Handle save (placeholder - implement with backend)
  const handleSave = useCallback(async () => {
    if (!generatedCode || !isAuthenticated) return;
    // TODO: Implement save to projects
    console.log("Save to projects");
  }, [generatedCode, isAuthenticated]);

  // Handle persistent option changes
  const handlePersistentChange = useCallback(
    (category, field, value) => {
      updatePersistentOption(category, {
        ...persistentOptions[category],
        [field]: value,
      });
    },
    [persistentOptions, updatePersistentOption]
  );

  // Show enhance token overlay state
  const [showEnhanceTokenOverlay, setShowEnhanceTokenOverlay] = useState(false);

  return (
    <div className="home">
      <div className="home__container">
        {/* Main Search Area */}
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
          />

          {/* Token Overlay */}
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

          {/* Active Selection Pills */}
          {activeCategories.length > 0 && (
            <ActivePills
              categories={activeCategories}
              onPillClick={openOptions}
              onResetClick={resetSelection}
            />
          )}
        </div>

        {/* Generation Status */}
        {isGenerating && (
          <div className="home__status">
            <span className="home__status-text">{getEstimatedTimeText()}</span>
          </div>
        )}

        {/* Minimized Preview Pill */}
        <AnimatePresence>
          {previewMinimized && generatedCode && (
            <MinimizedPreviewPill
              onExpand={restorePreview}
              onDiscard={resetGeneration}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Modals */}
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

      <AnimatePresence>
        {showPreview && generatedCode && (
          <PreviewModal
            isOpen={showPreview}
            html={generatedCode}
            onClose={closePreview}
            onMinimize={minimizePreview}
            onDownload={handleDownload}
            onSave={handleSave}
            onDeploy={openDeploy}
            isSaving={false}
            saveSuccess={false}
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
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && <AuthModal isOpen={showAuth} onClose={closeAuth} />}
      </AnimatePresence>

      <AnimatePresence>
        {showTokens && (
          <TokensModal isOpen={showTokens} onClose={closeTokens} />
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
        {showLegal && <LegalModal isOpen={showLegal} onClose={closeLegal} />}
      </AnimatePresence>
    </div>
  );
}

export default Home;
