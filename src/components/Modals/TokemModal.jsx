// components/Home/TokenModal/TokenModal.jsx
import { Coins, AlertCircle, CheckCircle } from "lucide-react";
import "./modals.scss";

function TokenModal({
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
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content modal-content--sm modal-content--centered modal-content--surface ${
          isOpen ? "active" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="token-modal__header">
          <div className="token-modal__header-title">
            <Coins size={18} />
            <span className="token-modal__total">{tokenCost} tokens</span>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
        </div>

        <div className="token-modal__breakdown">
          <h4 className="token-modal__breakdown-title">Cost Breakdown</h4>
          {breakdown.map((item, i) => (
            <div
              key={i}
              className={`token-modal__item ${
                item.type === "discount" ? "discount" : ""
              }`}
            >
              <span>{item.label}</span>
              <span>
                {item.type === "discount" ? "-" : "+"}
                {item.cost}
              </span>
            </div>
          ))}
        </div>

        {isAuthenticated && (
          <div className="token-modal__balance">
            <div className="token-modal__balance-row">
              <span>Your balance</span>
              <span
                className={`token-modal__balance-value token-modal__balance-value--${tokenBalance.status}`}
              >
                {userTokens} tokens
              </span>
            </div>

            <div className="token-modal__balance-row token-modal__balance-row--cost">
              <span>Cost</span>
              <span className="token-modal__balance-cost">
                -{tokenCost} tokens
              </span>
            </div>

            <div className="token-modal__balance-row token-modal__balance-row--remaining">
              <span>After transaction</span>
              <span
                className={`token-modal__balance-remaining ${
                  !isSufficient
                    ? "token-modal__balance-remaining--insufficient"
                    : isLowBalance
                    ? "token-modal__balance-remaining--warning"
                    : "token-modal__balance-remaining--sufficient"
                }`}
              >
                {remainingTokens} tokens
                {!isSufficient && (
                  <AlertCircle
                    size={14}
                    className="token-modal__balance-icon"
                  />
                )}
                {isSufficient && isLowBalance && (
                  <AlertCircle
                    size={14}
                    className="token-modal__balance-icon"
                  />
                )}
                {isSufficient && !isLowBalance && (
                  <CheckCircle
                    size={14}
                    className="token-modal__balance-icon"
                  />
                )}
              </span>
            </div>

            {!isSufficient && (
              <div className="token-modal__insufficient">
                <AlertCircle size={14} />
                <span>Insufficient tokens</span>
              </div>
            )}

            {isLowBalance && isSufficient && (
              <div className="token-modal__warning">
                <AlertCircle size={14} />
                <span>Low balance remaining</span>
              </div>
            )}
          </div>
        )}

        {(!isAuthenticated || userTokens < tokenCost) && (
          <button className="modal-btn-primary" onClick={onBuyTokens}>
            Get More Tokens
          </button>
        )}

        {!isAuthenticated && (
          <p className="modal-note">Sign in to track your token balance</p>
        )}
      </div>
    </div>
  );
}

export default TokenModal;
