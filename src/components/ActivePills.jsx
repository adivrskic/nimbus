// components/Home/ActivePills/ActivePills.jsx - Display active selection pills
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { activePillVariants } from "../configs/animations.config";
import "./ActivePills.scss";

function ActivePills({ categories, onPillClick, onResetClick }) {
  if (categories.length === 0) return null;

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        className="active-pills"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="popLayout">
          {categories.map((cat) => (
            <motion.button
              key={cat.key}
              className="active-pills__pill"
              onClick={() => onPillClick(cat.key)}
              variants={activePillVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              whileHover="hover"
              layout
            >
              <span className="active-pills__label">{cat.label}</span>
              <span className="active-pills__value">{cat.value}</span>
              <span
                className="active-pills__close"
                onClick={(e) => {
                  e.stopPropagation();
                  onResetClick(cat.key);
                }}
              >
                <X size={12} />
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}

export default ActivePills;
