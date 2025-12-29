// hooks/useHomeState.js - Manages all UI state for Home page
import { useState, useCallback, useRef } from "react";
import { DEFAULT_PERSISTENT_OPTIONS } from "../configs/defaults.config";

/**
 * Hook for managing Home page UI state
 * @returns {Object} UI state and handlers
 */
export function useHomeState() {
  // Input state
  const [prompt, setPrompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  // Persistent options for content (branding, social, contact, etc.)
  const [persistentOptions, setPersistentOptions] = useState(
    DEFAULT_PERSISTENT_OPTIONS
  );

  // Modal states
  const [showOptions, setShowOptions] = useState(false);
  const [showTokenOverlay, setShowTokenOverlay] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMinimized, setPreviewMinimized] = useState(false);

  // Options overlay state
  const [optionsIntroComplete, setOptionsIntroComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);

  // Focus input
  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  // Handle input expand/collapse
  const handleInputFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!prompt) {
      setIsExpanded(false);
    }
  }, [prompt]);

  // Handle prompt change
  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
  }, []);

  // Modal handlers
  const openOptions = useCallback(() => {
    setShowOptions(true);
    setOptionsIntroComplete(false);
  }, []);

  const closeOptions = useCallback(() => {
    setShowOptions(false);
    setSelectedOption(null);
  }, []);

  const openHelp = useCallback(() => {
    setShowHelp(true);
  }, []);

  const closeHelp = useCallback(() => {
    setShowHelp(false);
  }, []);

  const openAuth = useCallback(() => {
    setShowAuth(true);
  }, []);

  const closeAuth = useCallback(() => {
    setShowAuth(false);
  }, []);

  const openTokens = useCallback(() => {
    setShowTokens(true);
  }, []);

  const closeTokens = useCallback(() => {
    setShowTokens(false);
  }, []);

  const openDeploy = useCallback(() => {
    setShowDeploy(true);
  }, []);

  const closeDeploy = useCallback(() => {
    setShowDeploy(false);
  }, []);

  const openLegal = useCallback(() => {
    setShowLegal(true);
  }, []);

  const closeLegal = useCallback(() => {
    setShowLegal(false);
  }, []);

  const toggleTokenOverlay = useCallback(() => {
    setShowTokenOverlay((prev) => !prev);
  }, []);

  const closeTokenOverlay = useCallback(() => {
    setShowTokenOverlay(false);
  }, []);

  // Preview handlers
  const openPreview = useCallback(() => {
    setShowPreview(true);
    setPreviewMinimized(false);
  }, []);

  const closePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewMinimized(false);
  }, []);

  const minimizePreview = useCallback(() => {
    setShowPreview(false);
    setPreviewMinimized(true);
  }, []);

  const restorePreview = useCallback(() => {
    setShowPreview(true);
    setPreviewMinimized(false);
  }, []);

  // Options navigation
  const selectOption = useCallback(
    (optionKey) => {
      if (selectedOption) {
        setSlideDirection(1);
      }
      setSelectedOption(optionKey);
    },
    [selectedOption]
  );

  const goBackToCategories = useCallback(() => {
    setSlideDirection(-1);
    setSelectedOption(null);
  }, []);

  // Update persistent options
  const updatePersistentOption = useCallback((key, value) => {
    setPersistentOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Reset all state
  const resetAll = useCallback(() => {
    setPrompt("");
    setIsExpanded(false);
    setPersistentOptions(DEFAULT_PERSISTENT_OPTIONS);
    setShowOptions(false);
    setShowTokenOverlay(false);
    setSelectedOption(null);
    setOptionsIntroComplete(false);
  }, []);

  return {
    // Input state
    prompt,
    setPrompt,
    isExpanded,
    inputRef,
    handleInputFocus,
    handleInputBlur,
    handlePromptChange,
    focusInput,

    // Persistent options
    persistentOptions,
    setPersistentOptions,
    updatePersistentOption,

    // Modal states
    showOptions,
    showTokenOverlay,
    showAuth,
    showTokens,
    showDeploy,
    showHelp,
    showLegal,
    showPreview,
    previewMinimized,

    // Modal handlers
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

    // Options overlay state
    optionsIntroComplete,
    setOptionsIntroComplete,
    selectedOption,
    setSelectedOption,
    slideDirection,
    setSlideDirection,
    selectOption,
    goBackToCategories,

    // Reset
    resetAll,
  };
}

export default useHomeState;
