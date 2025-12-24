import { Coins, Plus, Sparkles } from "lucide-react";
import "./TokenDisplay.scss";

function TokenDisplay({ tokens = 0, onBuyTokens }) {
  const getTokenStatus = () => {
    if (tokens >= 50) return "high";
    if (tokens >= 20) return "medium";
    return "low";
  };

  return (
    <div className={`token-display token-display--${getTokenStatus()}`}>
      <div className="token-display__balance">
        <div className="token-display__icon">
          <Coins size={18} />
        </div>
        <div className="token-display__info">
          <span className="token-display__count">{tokens}</span>
          <span className="token-display__label">tokens</span>
        </div>
      </div>

      <button className="token-display__buy-btn" onClick={onBuyTokens}>
        <Plus size={16} />
        <span>Get Tokens</span>
      </button>

      {tokens < 20 && (
        <div className="token-display__warning">
          <Sparkles size={12} />
          <span>Running low!</span>
        </div>
      )}
    </div>
  );
}

export default TokenDisplay;
