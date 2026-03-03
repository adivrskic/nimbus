// components/Home/AddonsPanel/AddonsPanel.jsx
import { useState, useRef, useEffect, useCallback } from "react";
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
} from "lucide-react";
import { ADDONS } from "../configs/addons.config";
import "./AddonsPanel.scss";

const ICON_MAP = { BarChart3, Mail, FileText, Database };

function AddonsPanel({
  selectedAddons = {},
  onToggleAddon,
  totalAddonCost = 0,
}) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedCount = Object.values(selectedAddons).filter(Boolean).length;

  const toggle = useCallback(
    (id) => {
      const addon = ADDONS.find((a) => a.id === id);
      if (!addon || addon.status === "coming_soon") return;
      onToggleAddon?.(id);
    },
    [onToggleAddon]
  );

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setPanelOpen(false);
      }
    };
    if (panelOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen]);

  return (
    <div className="addons">
      {/* Selected pills (when panel closed) */}
      {!panelOpen &&
        selectedCount > 0 &&
        ADDONS.filter((a) => selectedAddons[a.id]).map((addon) => {
          const Icon = ICON_MAP[addon.icon];
          return (
            <div key={addon.id} className="addons__pill">
              {Icon && <Icon size={14} />}
              <span className="addons__pill-title">{addon.title}</span>
              <span className="addons__pill-cost">+{addon.cost}</span>
              <button
                className="addons__pill-remove"
                onClick={() => toggle(addon.id)}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}

      {/* Trigger button */}
      <button
        ref={triggerRef}
        className={`addons__trigger ${
          panelOpen || selectedCount > 0 ? "addons__trigger--active" : ""
        }`}
        onClick={() => setPanelOpen(!panelOpen)}
      >
        <Plus size={14} />
        <span>Add-ons</span>
        {selectedCount > 0 && (
          <span className="addons__trigger-count">{selectedCount}</span>
        )}
        <ChevronDown
          size={12}
          className={`addons__trigger-chevron ${panelOpen ? "open" : ""}`}
        />
      </button>

      {/* Panel */}
      {panelOpen && (
        <div ref={panelRef} className="addons__panel">
          {/* Header */}
          <div className="addons__panel-header">
            <span className="addons__panel-title">Add-ons</span>
            <div className="addons__panel-header-right">
              {selectedCount > 0 && (
                <span className="addons__panel-cost">
                  <Coins size={12} /> +{totalAddonCost} tokens
                </span>
              )}
              <button
                className="addons__panel-close modal-close"
                onClick={() => setPanelOpen(false)}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Scrollable card list */}
          <div className="addons__panel-body">
            {ADDONS.map((addon) => {
              const Icon = ICON_MAP[addon.icon];
              const isSelected = !!selectedAddons[addon.id];
              const isExpanded = expandedId === addon.id;
              const isComingSoon = addon.status === "coming_soon";

              return (
                <div
                  key={addon.id}
                  className={`addons__card ${
                    isSelected ? "addons__card--selected" : ""
                  } ${isComingSoon ? "addons__card--disabled" : ""}`}
                >
                  {/* Card header */}
                  <div
                    className="addons__card-header"
                    onClick={() => setExpandedId(isExpanded ? null : addon.id)}
                  >
                    <div
                      className={`addons__card-icon ${
                        isSelected ? "addons__card-icon--active" : ""
                      }`}
                    >
                      {Icon && <Icon size={18} />}
                    </div>

                    <div className="addons__card-info">
                      <div className="addons__card-title-row">
                        <span className="addons__card-title">
                          {addon.title}
                        </span>
                        {isComingSoon && (
                          <span className="addons__card-badge">
                            Coming soon
                          </span>
                        )}
                      </div>
                      <p className="addons__card-desc">{addon.description}</p>
                    </div>

                    <div className="addons__card-meta">
                      <span className="addons__card-cost">
                        <Coins size={11} />
                        {addon.costLabel}
                      </span>
                      <ChevronDown
                        size={13}
                        className={`addons__card-chevron ${
                          isExpanded ? "open" : ""
                        }`}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <div className="addons__card-details">
                      <div className="addons__card-how">
                        <span className="addons__card-how-label">
                          How it works
                        </span>
                        {addon.howItWorks}
                      </div>

                      <button
                        className={`addons__card-action ${
                          isSelected
                            ? "addons__card-action--added"
                            : isComingSoon
                            ? "addons__card-action--locked"
                            : ""
                        }`}
                        disabled={isComingSoon}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggle(addon.id);
                        }}
                      >
                        {isComingSoon ? (
                          <>
                            <Lock size={13} /> <span>Coming Soon</span>
                          </>
                        ) : isSelected ? (
                          <>
                            <Check size={13} />{" "}
                            <span>Added — click to remove</span>
                          </>
                        ) : (
                          <>
                            <Plus size={14} />{" "}
                            <span>
                              Add to generation · +{addon.cost} tokens
                            </span>
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
      )}
    </div>
  );
}

export default AddonsPanel;
