// components/Home/TokenOverlay/TokenOverlay.jsx
import { motion, AnimatePresence } from "framer-motion";
import { Coins, AlertCircle, CheckCircle } from "lucide-react";
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
  const remainingTokens = userTokens - tokenCost;
  const isSufficient = remainingTokens >= 0;
  const isLowBalance = remainingTokens >= 0 && remainingTokens < 10;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
              <div className="token-overlay__header-title">
                <Coins size={18} />
                <span className="token-overlay__total">{tokenCost} tokens</span>
              </div>
              <button
                className="token-overlay__close-btn"
                onClick={onClose}
                aria-label="Close"
              >
                &times;
              </button>
            </motion.div>

            <div className="token-overlay__breakdown">
              <h4 className="token-overlay__breakdown-title">Cost Breakdown</h4>
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
                <div className="token-overlay__balance-row">
                  <span>Your balance</span>
                  <span
                    className={`token-overlay__balance-value token-overlay__balance-value--${tokenBalance.status}`}
                  >
                    {userTokens} tokens
                  </span>
                </div>

                <div className="token-overlay__balance-row token-overlay__balance-row--cost">
                  <span>Cost</span>
                  <span className="token-overlay__balance-cost">
                    -{tokenCost} tokens
                  </span>
                </div>

                <div className="token-overlay__balance-row token-overlay__balance-row--remaining">
                  <span>After transaction</span>
                  <span
                    className={`token-overlay__balance-remaining ${
                      !isSufficient
                        ? "token-overlay__balance-remaining--insufficient"
                        : isLowBalance
                        ? "token-overlay__balance-remaining--warning"
                        : "token-overlay__balance-remaining--sufficient"
                    }`}
                  >
                    {remainingTokens} tokens
                    {!isSufficient && (
                      <AlertCircle
                        size={14}
                        className="token-overlay__balance-icon"
                      />
                    )}
                    {isSufficient && isLowBalance && (
                      <AlertCircle
                        size={14}
                        className="token-overlay__balance-icon"
                      />
                    )}
                    {isSufficient && !isLowBalance && (
                      <CheckCircle
                        size={14}
                        className="token-overlay__balance-icon"
                      />
                    )}
                  </span>
                </div>

                {!isSufficient && (
                  <motion.div
                    className="token-overlay__insufficient"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} />
                    <span>Insufficient tokens</span>
                  </motion.div>
                )}

                {isLowBalance && isSufficient && (
                  <motion.div
                    className="token-overlay__warning"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AlertCircle size={14} />
                    <span>Low balance remaining</span>
                  </motion.div>
                )}
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

            {!isAuthenticated && (
              <motion.p
                className="token-overlay__login-note"
                variants={tokenItemVariants}
              >
                Sign in to track your token balance
              </motion.p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TokenOverlay;
