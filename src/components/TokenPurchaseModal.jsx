import { useState } from "react";
import { X, Coins, Check, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import useModalAnimation from "../hooks/useModalAnimation";
import "./TokenPurchaseModal.scss";

const TOKEN_PACKAGES = [
  {
    id: "small",
    tokens: 10,
    price: 2,
    perToken: "$0.20",
  },
  {
    id: "medium",
    tokens: 50,
    price: 8,
    perToken: "$0.16",
    popular: true,
  },
  {
    id: "large",
    tokens: 100,
    price: 15,
    perToken: "$0.15",
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
      const response = await fetch("/api/tokens/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({
          packageId: pkg.id,
          tokens: pkg.tokens,
          amount: pkg.price * 100,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { checkoutUrl } = await response.json();
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
      className={`tokens-overlay ${isVisible ? "active" : ""}`}
      onClick={closeModal}
    >
      <div
        className={`tokens-content ${isVisible ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="tokens-header">
          <div className="tokens-title">
            <Coins size={16} />
            <span>Get Tokens</span>
          </div>
          <button className="tokens-close" onClick={closeModal}>
            <X size={16} />
          </button>
        </div>

        {profile?.tokens !== undefined && (
          <div className="tokens-balance">
            <span>Current balance</span>
            <span>{profile.tokens} tokens</span>
          </div>
        )}

        <div className="tokens-packages">
          {TOKEN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              className={`token-option ${
                selectedPackage === pkg.id ? "selected" : ""
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="token-option__left">
                <span className="token-option__amount">
                  {pkg.tokens} tokens
                </span>
                <span className="token-option__rate">{pkg.perToken}/token</span>
              </div>
              <div className="token-option__right">
                {pkg.savings && (
                  <span className="token-option__badge">{pkg.savings}</span>
                )}
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
            </button>
          ))}
        </div>

        {error && <div className="tokens-error">{error}</div>}

        <button
          className="tokens-btn"
          onClick={handlePurchase}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <Loader2 size={14} className="spinning" />
          ) : (
            `Buy ${selectedPkg?.tokens} for $${selectedPkg?.price}`
          )}
        </button>

        <div className="tokens-note">Secured by Stripe</div>
      </div>
    </div>
  );
}

export default TokenPurchaseModal;
