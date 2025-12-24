import { useState } from "react";
import { X, Coins, Check, Zap, Star, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./TokenPurchaseModal.scss";

const TOKEN_PACKAGES = [
  {
    id: "small",
    tokens: 10,
    price: 2,
    icon: <Coins size={24} />,
    description: "Quick top-up",
  },
  {
    id: "medium",
    tokens: 50,
    price: 8,
    icon: <Zap size={24} />,
    description: "Most popular",
    popular: true,
  },
  {
    id: "large",
    tokens: 100,
    price: 15,
    icon: <Star size={24} />,
    description: "Best value",
    savings: "25% off",
  },
];

function TokenPurchaseModal({ isOpen, onClose }) {
  const { user, profile } = useAuth();
  const { shouldRender, isVisible, closeModal } = useModalAnimation(
    isOpen,
    onClose
  );

  const [selectedPackage, setSelectedPackage] = useState("medium");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    const pkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);
    if (!pkg) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Create Stripe checkout session
      const response = await fetch("/api/tokens/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          packageId: pkg.id,
          tokens: pkg.tokens,
          amount: pkg.price * 100, // cents
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { checkoutUrl } = await response.json();

      // Redirect to Stripe
      window.location.href = checkoutUrl;
    } catch (err) {
      console.error("Purchase error:", err);
      setError("Failed to process payment. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!shouldRender) return null;

  const selectedPkg = TOKEN_PACKAGES.find((p) => p.id === selectedPackage);

  return (
    <div
      className={`modal-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`token-purchase-modal ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={closeModal}>
          <X size={20} />
        </button>

        <div className="token-purchase-modal__header">
          <div className="token-icon">
            <Coins size={28} />
          </div>
          <h2>Get More Tokens</h2>
          <p>Choose a token package to power your creations</p>

          {profile?.tokens !== undefined && (
            <div className="current-balance">
              Current balance: <strong>{profile.tokens} tokens</strong>
            </div>
          )}
        </div>

        <div className="token-purchase-modal__packages">
          {TOKEN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`token-package ${
                selectedPackage === pkg.id ? "selected" : ""
              } ${pkg.popular ? "popular" : ""}`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && <div className="popular-badge">Most Popular</div>}
              {pkg.savings && (
                <div className="savings-badge">{pkg.savings}</div>
              )}

              <div className="token-package__icon">{pkg.icon}</div>
              <div className="token-package__info">
                <h3>{pkg.tokens} Tokens</h3>
                <p className="token-package__description">{pkg.description}</p>
                <div className="token-package__price">${pkg.price}</div>
                <div className="token-package__per-token">
                  ${(pkg.price / pkg.tokens).toFixed(2)}/token
                </div>
              </div>

              <div className="token-package__check">
                {selectedPackage === pkg.id && <Check size={20} />}
              </div>
            </div>
          ))}
        </div>

        {error && <div className="token-purchase-modal__error">{error}</div>}

        <div className="token-purchase-modal__footer">
          <button
            className="btn btn-primary purchase-btn"
            onClick={handlePurchase}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 size={18} className="spinning" />
                Processing...
              </>
            ) : (
              <>
                Buy {selectedPkg?.tokens} Tokens for ${selectedPkg?.price}
              </>
            )}
          </button>

          <p className="secure-note">ðŸ”’ Secured by Stripe</p>
        </div>
      </div>
    </div>
  );
}

export default TokenPurchaseModal;
