import { useState, useCallback } from "react";
import {
  Plus,
  X,
  Check,
  ChevronDown,
  Coins,
  Lock,
  BarChart3,
  Mail,
  FileText,
  Database,
  Puzzle,
} from "lucide-react";
import { ADDONS } from "../../configs/addons.config";
import "../../styles/modals.scss";

const ICON_MAP = { BarChart3, Mail, FileText, Database };

function AddonsModal({
  isOpen,
  onClose,
  selectedAddons = {},
  onToggleAddon,
  totalAddonCost = 0,
}) {
  const [expandedId, setExpandedId] = useState(null);

  const selectedCount = Object.values(selectedAddons).filter(Boolean).length;

  const toggle = useCallback(
    (id) => {
      const addon = ADDONS.find((a) => a.id === id);
      if (!addon || addon.status === "coming_soon") return;
      onToggleAddon?.(id);
    },
    [onToggleAddon]
  );

  if (!isOpen) return null;

  return (
    <div
      className={`modal-overlay ${isOpen ? "active" : ""}`}
      onClick={onClose}
    >
      <div
        className={`modal-content modal-content--lg ${isOpen ? "active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header-section">
          <div className="modal-header">
            <div className="modal-title">
              <Puzzle size={16} />
              <span>Add-ons</span>
            </div>
            <div className="addons-modal__header-right">
              {selectedCount > 0 && (
                <span className="addons-modal__cost-summary">
                  <Coins size={12} />
                  <span>
                    {selectedCount} selected · +{totalAddonCost} tokens
                  </span>
                </span>
              )}
              <button
                className="modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="modal-subtitle">
            Extend your generated site with extra functionality. Add-on costs
            are added to your base generation token cost.
          </div>
        </div>

        <div className="modal-body">
          {ADDONS.map((addon) => {
            const Icon = ICON_MAP[addon.icon];
            const isSelected = !!selectedAddons[addon.id];
            const isExpanded = expandedId === addon.id;
            const isComingSoon = addon.status === "coming_soon";

            return (
              <div
                key={addon.id}
                className={`addons-modal__card ${
                  isSelected ? "addons-modal__card--selected" : ""
                } ${isComingSoon ? "addons-modal__card--disabled" : ""}`}
              >
                <button
                  className="addons-modal__card-trigger"
                  onClick={() => {
                    if (isComingSoon) return;
                    setExpandedId(isExpanded ? null : addon.id);
                  }}
                  aria-expanded={!isComingSoon && isExpanded}
                  style={isComingSoon ? { cursor: "default" } : undefined}
                >
                  <div
                    className={`addons-modal__card-icon ${
                      isSelected ? "addons-modal__card-icon--active" : ""
                    }`}
                  >
                    {Icon && <Icon size={18} />}
                  </div>

                  <div className="addons-modal__card-info">
                    <div className="addons-modal__card-title-row">
                      <span className="addons-modal__card-title">
                        {addon.title}
                      </span>
                      {isComingSoon && (
                        <span className="addons-modal__card-badge">
                          Coming soon
                        </span>
                      )}
                    </div>
                    <p className="addons-modal__card-desc">
                      {addon.description}
                    </p>
                  </div>

                  <div className="addons-modal__card-meta">
                    <span className="addons-modal__card-cost">
                      <Coins size={11} />
                      {addon.costLabel}
                    </span>
                    {isComingSoon ? (
                      <Lock size={13} className="addons-modal__card-lock" />
                    ) : (
                      <ChevronDown
                        size={13}
                        className={`addons-modal__card-chevron ${
                          isExpanded ? "open" : ""
                        }`}
                      />
                    )}
                  </div>
                </button>

                {!isComingSoon && isExpanded && (
                  <div className="addons-modal__card-details">
                    <div className="addons-modal__card-how">
                      <span className="addons-modal__card-how-label">
                        How it works
                      </span>
                      {addon.howItWorks}
                    </div>

                    <button
                      className={`addons-modal__card-action ${
                        isSelected ? "addons-modal__card-action--added" : ""
                      }`}
                      onClick={() => toggle(addon.id)}
                    >
                      {isSelected ? (
                        <>
                          <Check size={13} />{" "}
                          <span>Added — click to remove</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />{" "}
                          <span>Add to generation · +{addon.cost} tokens</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default AddonsModal;
