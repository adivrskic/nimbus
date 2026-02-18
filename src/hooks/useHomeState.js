import { useState, useCallback, useRef } from "react";
import { DEFAULT_PERSISTENT_OPTIONS } from "../configs/defaults.config";
import { track } from "../lib/analytics";

export function useHomeState() {
  const [prompt, setPrompt] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  const [persistentOptions, setPersistentOptions] = useState(
    DEFAULT_PERSISTENT_OPTIONS
  );

  const [showOptions, setShowOptions] = useState(false);
  const [showTokenOverlay, setShowTokenOverlay] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTokens, setShowTokens] = useState(false);
  const [showDeploy, setShowDeploy] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMinimized, setPreviewMinimized] = useState(false);

  const [optionsIntroComplete, setOptionsIntroComplete] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [slideDirection, setSlideDirection] = useState(1);

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    if (!prompt) {
      setIsExpanded(false);
    }
  }, [prompt]);

  const handlePromptChange = useCallback((e) => {
    setPrompt(e.target.value);
  }, []);

  const openOptions = useCallback(() => {
    track("customize");
    setShowOptions(true);
    setOptionsIntroComplete(false);
  }, []);

  const closeOptions = useCallback(() => {
    setShowOptions(false);
    setSelectedOption(null);
  }, []);

  const openHelp = useCallback(() => {
    track("help");
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
    track("restore-preview");
    setShowPreview(true);
    setPreviewMinimized(false);
  }, []);

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

  const updatePersistentOption = useCallback((key, value) => {
    setPersistentOptions((prev) => ({ ...prev, [key]: value }));
  }, []);

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
    prompt,
    setPrompt,
    isExpanded,
    inputRef,
    handleInputFocus,
    handleInputBlur,
    handlePromptChange,
    focusInput,

    persistentOptions,
    setPersistentOptions,
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

    optionsIntroComplete,
    setOptionsIntroComplete,
    selectedOption,
    setSelectedOption,
    slideDirection,
    setSlideDirection,
    selectOption,
    goBackToCategories,

    resetAll,
  };
}

export default useHomeState;
