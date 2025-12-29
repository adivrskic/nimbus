// configs/index.js - Central export for all configuration

export { OPTIONS, default as options } from "./options.config";
export {
  CATEGORIES,
  CATEGORY_GROUPS,
  getFilteredCategories,
} from "./categories.config";
export {
  overlayVariants,
  contentVariants,
  pillContainerVariants,
  pillVariants,
  activePillVariants,
  tokenContentVariants,
  tokenItemVariants,
  slideVariants,
  previewOverlayVariants,
  previewContentVariants,
  EASINGS,
  DURATIONS,
} from "./animations.config";
export {
  EXAMPLE_PROMPTS,
  DEFAULT_PERSISTENT_OPTIONS,
  getInitialSelections,
} from "./defaults.config";
export { INTRO_LABELS } from "./introLabels.config";
