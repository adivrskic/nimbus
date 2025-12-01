import { useState, useEffect } from "react";
import { X, Save, Loader, Edit } from "lucide-react";
import "./SaveDraftModal.scss";

function SaveDraftModal({
  isOpen,
  onClose,
  onSave,
  defaultName,
  isSaving,
  isEditing = false,
}) {
  const [draftName, setDraftName] = useState(defaultName || "");

  // Update draft name when defaultName changes
  useEffect(() => {
    if (defaultName) {
      setDraftName(defaultName);
    }
  }, [defaultName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (draftName.trim()) {
      onSave(draftName.trim());
    }
  };

  const handleClose = () => {
    setDraftName(defaultName || "");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="modal-backdrop modal-backdrop--visible"
        onClick={handleClose}
      />
      <div className="save-draft-modal">
        <div className="save-draft-modal__header">
          <h3>{isEditing ? "Update Draft" : "Save Draft"}</h3>
          <button
            className="save-draft-modal__close"
            onClick={handleClose}
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        <div className="save-draft-modal__content">
          <p className="save-draft-modal__description">
            {isEditing
              ? "Enter a new name for your draft or keep the existing one."
              : "Give your draft a name to save it for later editing or deployment."}
          </p>

          <form onSubmit={handleSubmit} className="save-draft-modal__form">
            <div className="form-group">
              <label htmlFor="draftName">
                Draft Name
                {isEditing && <span className="edit-badge">Editing</span>}
              </label>
              <input
                id="draftName"
                type="text"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                placeholder="Enter a name for this draft"
                autoFocus
                disabled={isSaving}
                required
              />
              {isEditing && (
                <p className="form-hint">
                  Updating will overwrite the existing draft with your current
                  changes.
                </p>
              )}
            </div>

            <div className="save-draft-modal__actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`btn ${isEditing ? "btn-warning" : "btn-primary"}`}
                disabled={!draftName.trim() || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader size={18} className="spinning" />
                    {isEditing ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  <>
                    {isEditing ? <Edit size={18} /> : <Save size={18} />}
                    {isEditing ? "Update Draft" : "Save Draft"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default SaveDraftModal;
