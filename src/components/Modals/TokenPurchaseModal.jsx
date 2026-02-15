import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Coins, Check, Loader2, LogIn } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabaseClient";
import {
  overlayVariants,
  tokensModalContentVariants,
  tokensModalItemVariants,
} from "../../configs/animations.config";
import { track } from "../../lib/analytics";
import "./modals.scss";

const TOKEN_PACKAGES = [
  {
    id: "starter",
    tokens: 50,
    bonus: 0,
    price: 2.99,
    perToken: "$0.060",
    numGensRange: "a few",
  },
  {
    id: "popular",
    tokens: 150,
    bonus: 15,
    price: 6.99,
    perToken: "$0.042",
    popular: true,
    savings: "10% bonus",
    numGensRange: "a bunch of",
  },
  {
    id: "pro",
    tokens: 350,
    bonus: 75,
    price: 14.99,
    perToken: "$0.035",
    savings: "21% bonus",
    numGensRange: "a whole lot of",
  },
  {
    id: "agency",
    tokens: 800,
    bonus: 250,
    price: 29.99,
    perToken: "$0.029",
    savings: "31% bonus",
    numGensRange: "a ludicrous amount of",
  },
];

function TokenPurchaseModal({ isOpen, onClose, onOpenAuth }) {
  const { user, profile, isAuthenticated } = useAuth();

  const [selectedPackage, setSelectedPackage] = useState("popular");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    track("token-purchase", {
      package: pkg,
    });

    setIsProcessing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "purchase-tokens",
        {
          body: {
            packageId: pkg.id,
            successUrl: `${window.location.origin}/?tokens_purchased=true`,
            cancelUrl: `${window.location.origin}/?tokens_cancelled=true`,
          },
        }
      );

      if (fnError) throw fnError;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Purchase error:", err);
      setError("Failed to start checkout. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleLoginClick = () => {
    onClose();

    if (onOpenAuth) {
      setTimeout(() => {
        onOpenAuth();
      }, 200);
    }
  };

  if (!isOpen) return null;

  const selectedPkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);
  const totalTokens = selectedPkg ? selectedPkg.tokens + selectedPkg.bonus : 0;

  return (
    <motion.div
      className="modal-overlay"
      onClick={onClose}
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <motion.div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        variants={tokensModalContentVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div className="modal-header" variants={tokensModalItemVariants}>
          <div className="modal-title">
            <Coins size={16} />
            <span>Get Tokens</span>
          </div>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </motion.div>

        {isAuthenticated && profile?.tokens !== undefined && (
          <motion.div
            className="tokens-balance"
            variants={tokensModalItemVariants}
          >
            <span>Current balance</span>
            <span>{profile.tokens} tokens</span>
          </motion.div>
        )}

        <div className="tokens-packages">
          {TOKEN_PACKAGES.map((pkg) => {
            const total = pkg.tokens + pkg.bonus;
            return (
              <motion.button
                key={pkg.id}
                className={`token-option ${
                  selectedPackage === pkg.id ? "selected" : ""
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
                variants={tokensModalItemVariants}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="token-option__left">
                  <span className="token-option__amount">{total} tokens</span>
                  <span className="token-option__rate">
                    {pkg.perToken}/token
                  </span>
                  <span className="token-option__rate">
                    Generate {pkg.numGensRange} websites
                  </span>
                </div>
                <div className="token-option__right">
                  {pkg.popular && (
                    <span className="token-option__badge token-option__badge--popular">
                      Popular
                    </span>
                  )}
                  <span className="token-option__price">${pkg.price}</span>
                  {selectedPackage === pkg.id && (
                    <span className="token-option__check">
                      <Check size={12} />
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {error && (
          <motion.div
            className="modal-error"
            variants={tokensModalItemVariants}
          >
            {error}
          </motion.div>
        )}

        {isAuthenticated ? (
          <motion.button
            className="modal-btn-primary modal-btn-primary--pill"
            onClick={handlePurchase}
            disabled={isProcessing}
            variants={tokensModalItemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <Loader2 size={14} className="spinning" />
            ) : (
              `Buy ${totalTokens} tokens for $${selectedPkg?.price}`
            )}
          </motion.button>
        ) : (
          <motion.button
            className="modal-btn-primary modal-btn-primary--pill"
            onClick={handleLoginClick}
            variants={tokensModalItemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn size={14} />
            <span>Log in to purchase tokens</span>
          </motion.button>
        )}

        <motion.div className="modal-note" variants={tokensModalItemVariants}>
          Secured by Stripe • Tokens never expire
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default TokenPurchaseModal;
