// components/Home/MinimizedPreviewPill/MinimizedPreviewPill.jsx
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import "./MinimizedPreviewPill.scss";

function MinimizedPreviewPill({ onExpand, onDiscard, onOpenProjects }) {
  return (
    <motion.div
      className="minimized-preview-pill"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
    >
      <button className="minimized-preview-pill__main" onClick={onExpand}>
        <span>Customize Generated Site</span>
      </button>
      <button className="minimized-preview-pill__link" onClick={onOpenProjects}>
        View Projects
      </button>
    </motion.div>
  );
}

export default MinimizedPreviewPill;
