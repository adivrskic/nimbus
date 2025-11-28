// src/components/SaveDraftModal.jsx
import { useState } from 'react';
import { X, Save, Loader } from 'lucide-react';
import './SaveDraftModal.scss';

function SaveDraftModal({ isOpen, onClose, onSave, defaultName, isSaving }) {
  const [draftName, setDraftName] = useState(defaultName || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (draftName.trim()) {
      onSave(draftName.trim());
    }
  };

  const handleClose = () => {
    setDraftName(defaultName || '');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop modal-backdrop--visible" onClick={handleClose} />
      <div className="save-draft-modal">
        <div className="save-draft-modal__header">
          <h3>Save Draft</h3>
          <button 
            className="save-draft-modal__close" 
            onClick={handleClose}
            disabled={isSaving}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="save-draft-modal__form">
          <div className="form-group">
            <label htmlFor="draftName">Draft Name</label>
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
              className="btn btn-primary"
              disabled={!draftName.trim() || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader size={18} className="spinning" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Draft
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default SaveDraftModal;