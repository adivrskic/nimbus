export const overlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  },
};

export const contentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1], delayChildren: 0.05 },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export const pillContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.02, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

export const pillVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
  hover: { y: -1, transition: { duration: 0.15 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const activePillVariants = {
  hidden: { opacity: 0, scale: 0.9, x: -8 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.9, x: -8, transition: { duration: 0.15 } },
  hover: { x: 2, transition: { duration: 0.15 } },
};

export const tokenContentVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.0, 0.9, 0.1, 1],
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
  exit: { opacity: 0, y: 6, transition: { duration: 0.2 } },
};

export const tokenItemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.0, 0.9, 0.1, 1] },
  },
};

export const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 24 : -24, opacity: 0 }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: (direction) => ({
    x: direction < 0 ? 24 : -24,
    opacity: 0,
    transition: { duration: 0.15, ease: "easeIn" },
  }),
};

export const previewOverlayVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const previewContentVariants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.23, 1, 0.32, 1] },
  },
  exit: { opacity: 0, scale: 0.96, y: 12, transition: { duration: 0.2 } },
};

export const helpContentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.0, 0.9, 0.1, 1],
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: 0.2 },
  },
};

export const helpItemVariants = {
  hidden: { opacity: 0, y: 12, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: [0.1, 0.64, 0.25, 1] },
  },
};

export const tokensModalContentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.0, 0.9, 0.1, 1],
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: 0.18 },
  },
};

export const tokensModalItemVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.1, 0.64, 0.25, 1] },
  },
};

export const authModalContentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 6 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.0, 0.9, 0.1, 1],
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 6,
    transition: { duration: 0.15 },
  },
};

export const authModalItemVariants = {
  hidden: { opacity: 0, y: 10, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.35, ease: [0.1, 0.64, 0.25, 1] },
  },
};

// Easing presets for consistent feel
export const EASINGS = {
  smooth: [0.23, 1, 0.32, 1],
  snappy: [0.16, 1, 0.3, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
};

// Duration presets
export const DURATIONS = {
  fast: 0.15,
  normal: 0.25,
  slow: 0.35,
};
