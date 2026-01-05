// components/Home/TokenOverlay/TokenOverlay.jsx - Token cost breakdown overlay
import { motion } from "framer-motion";
import { Coins } from "lucide-react";
import {
  overlayVariants,
  tokenContentVariants,
  tokenItemVariants,
} from "../../../configs/animations.config";
import "./TokenOverlay.scss";

function TokenOverlay({
  isOpen,
  onClose,
  tokenCost,
  breakdown,
  userTokens,
  isAuthenticated,
  tokenBalance,
  onBuyTokens,
}) {
  if (!isOpen) return null;

  return (
    <motion.div
      className="token-overlay"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="token-overlay__content"
        onClick={(e) => e.stopPropagation()}
        variants={tokenContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="token-overlay__header"
          variants={tokenItemVariants}
        >
          <Coins size={18} />
          <span className="token-overlay__total">{tokenCost} tokens</span>
        </motion.div>

        <div className="token-overlay__breakdown">
          {breakdown.map((item, i) => (
            <motion.div
              key={i}
              className={`token-overlay__item ${
                item.type === "discount" ? "discount" : ""
              }`}
              variants={tokenItemVariants}
            >
              <span>{item.label}</span>
              <span>
                {item.type === "discount" ? "-" : "+"}
                {item.cost}
              </span>
            </motion.div>
          ))}
        </div>

        {isAuthenticated && (
          <motion.div
            className="token-overlay__balance"
            variants={tokenItemVariants}
          >
            <span>Your balance</span>
            <span
              className={`token-overlay__balance-value token-overlay__balance-value--${tokenBalance.status}`}
            >
              {userTokens} tokens
            </span>
          </motion.div>
        )}

        {(!isAuthenticated || userTokens < tokenCost) && (
          <motion.button
            className="token-overlay__buy-btn"
            onClick={onBuyTokens}
            variants={tokenItemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Get More Tokens
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

export default TokenOverlay;
