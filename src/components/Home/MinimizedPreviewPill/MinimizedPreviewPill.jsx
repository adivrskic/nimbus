// components/Home/MinimizedPreviewPill/MinimizedPreviewPill.jsx
import { motion } from "framer-motion";
import { Maximize2, X } from "lucide-react";
import "./MinimizedPreviewPill.scss";

function MinimizedPreviewPill({ onExpand, onDiscard }) {
  return (
    <motion.div
      className="minimized-preview-pill"
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <button className="minimized-preview-pill__main" onClick={onExpand}>
        <span>Customize Generated Site</span>
      </button>
    </motion.div>
  );
}

export default MinimizedPreviewPill;
