// components/Home/MinimizedPreviewPill/MinimizedPreviewPill.jsx
import { Maximize2, X, Loader2 } from "lucide-react";
import "./MinimizedPreviewPill.scss";

function MinimizedPreviewPill({
  onExpand,
  onDiscard,
  onOpenProjects,
  isGenerating = false,
}) {
  return (
    <div
      className={`minimized-preview-pill ${
        isGenerating ? "minimized-preview-pill--generating" : ""
      }`}
    >
      <button className="minimized-preview-pill__main" onClick={onExpand}>
        {isGenerating ? (
          <>
            <Loader2 size={14} className="minimized-preview-pill__spinner" />
            <span>Generating Website</span>
          </>
        ) : (
          <span>Customize Generated Site</span>
        )}
      </button>
      {!isGenerating && (
        <button
          className="minimized-preview-pill__link"
          onClick={onOpenProjects}
        >
          View Projects
        </button>
      )}
    </div>
  );
}

export default MinimizedPreviewPill;
