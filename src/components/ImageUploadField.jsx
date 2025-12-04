// components/ImageUploadField.jsx
import { useState, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Link,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import {
  uploadImage,
  uploadMultipleImages,
  validateImageFile,
  deleteImage,
} from "../utils/imageUtils";
import "./ImageUploadField.scss";

function ImageUploadField({
  value,
  onChange,
  fieldPath,
  siteId,
  multiple = false,
  label = "Image",
  hint,
  accept = "image/*",
  maxFiles = 10,
  showUrlInput = true,
  disabled = false,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({
    current: 0,
    total: 0,
  });
  const [error, setError] = useState(null);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file selection
  const handleFileSelect = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      if (disabled) return;

      setError(null);
      setIsUploading(true);

      try {
        if (multiple) {
          // Multiple file upload
          const filesToUpload = Array.from(files).slice(0, maxFiles);
          setUploadProgress({ current: 0, total: filesToUpload.length });

          const results = await uploadMultipleImages(
            filesToUpload,
            siteId,
            fieldPath,
            (current, total) => {
              setUploadProgress({ current, total });
            }
          );

          const successfulUploads = results
            .filter((r) => r.success)
            .map((r) => r.url);

          const errors = results.filter((r) => !r.success);
          if (errors.length > 0) {
            setError(`${errors.length} file(s) failed to upload`);
          }

          // Append to existing values or create new array
          const currentValues = Array.isArray(value) ? value : [];
          onChange([...currentValues, ...successfulUploads]);
        } else {
          // Single file upload
          const file = files[0];
          const validation = validateImageFile(file);

          if (!validation.valid) {
            setError(validation.error);
            return;
          }

          const result = await uploadImage(file, siteId, fieldPath);
          onChange(result.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err.message || "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress({ current: 0, total: 0 });
      }
    },
    [siteId, fieldPath, multiple, maxFiles, value, onChange, disabled]
  );

  // Handle URL submission
  const handleUrlSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!urlInput.trim()) return;

      const url = urlInput.trim();

      // Basic URL validation
      try {
        new URL(url);
      } catch {
        setError("Please enter a valid URL");
        return;
      }

      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        onChange([...currentValues, url]);
      } else {
        onChange(url);
      }

      setUrlInput("");
      setShowUrlForm(false);
      setError(null);
    },
    [urlInput, multiple, value, onChange]
  );

  // Handle drag events
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileSelect(e.dataTransfer.files);
      }
    },
    [handleFileSelect]
  );

  // Remove an image
  const handleRemove = useCallback(
    async (index) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? [...value] : [];
        const removedUrl = currentValues[index];
        currentValues.splice(index, 1);
        onChange(currentValues);

        // Try to delete from storage if it's a Supabase URL
        if (removedUrl && removedUrl.includes("supabase")) {
          // Extract path from URL and delete
          // This is optional cleanup
        }
      } else {
        onChange("");
      }
    },
    [multiple, value, onChange]
  );

  // Render preview for single image
  const renderSinglePreview = () => {
    if (!value) return null;

    return (
      <div className="image-upload-field__preview">
        <img src={value} alt="Preview" />
        <button
          type="button"
          className="image-upload-field__remove"
          onClick={() => handleRemove(0)}
          disabled={disabled}
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Render preview for multiple images
  const renderMultiplePreview = () => {
    if (!value || !Array.isArray(value) || value.length === 0) return null;

    return (
      <div className="image-upload-field__gallery">
        {value.map((url, index) => (
          <div key={index} className="image-upload-field__gallery-item">
            <img src={url} alt={`Image ${index + 1}`} />
            <button
              type="button"
              className="image-upload-field__remove"
              onClick={() => handleRemove(index)}
              disabled={disabled}
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`image-upload-field ${disabled ? "disabled" : ""}`}>
      {/* Upload Area */}
      <div
        className={`image-upload-field__dropzone ${
          dragActive ? "active" : ""
        } ${isUploading ? "uploading" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() =>
          !isUploading && !disabled && fileInputRef.current?.click()
        }
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled || isUploading}
          style={{ display: "none" }}
        />

        {isUploading ? (
          <div className="image-upload-field__uploading">
            <Loader2 size={32} className="spinning" />
            {uploadProgress.total > 1 && (
              <span>
                Uploading {uploadProgress.current} of {uploadProgress.total}
              </span>
            )}
            <span>Processing...</span>
          </div>
        ) : (
          <div className="image-upload-field__placeholder">
            <Upload size={32} />
            <span className="image-upload-field__text">
              {dragActive
                ? "Drop image here"
                : multiple
                ? "Click or drag images to upload"
                : "Click or drag an image to upload"}
            </span>
            <span className="image-upload-field__hint">
              JPG, PNG, WebP up to 5MB
              {multiple && ` (max ${maxFiles} files)`}
            </span>
          </div>
        )}
      </div>

      {/* URL Input Option */}
      {showUrlInput && !isUploading && (
        <div className="image-upload-field__url-section">
          {showUrlForm ? (
            <form
              onSubmit={handleUrlSubmit}
              className="image-upload-field__url-form"
            >
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                disabled={disabled}
              />
              <button type="submit" disabled={!urlInput.trim() || disabled}>
                <CheckCircle size={18} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUrlForm(false);
                  setUrlInput("");
                }}
              >
                <X size={18} />
              </button>
            </form>
          ) : (
            <button
              type="button"
              className="image-upload-field__url-toggle"
              onClick={() => setShowUrlForm(true)}
              disabled={disabled}
            >
              <Link size={16} />
              Or paste image URL
            </button>
          )}
          {showUrlInput && (
            <p className="image-upload-field__url-disclaimer">
              External URLs may not be 100% reliable
            </p>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="image-upload-field__error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Preview */}
      {multiple ? renderMultiplePreview() : renderSinglePreview()}

      {/* Hint
      {hint && <p className="image-upload-field__field-hint">{hint}</p>} */}
    </div>
  );
}

export default ImageUploadField;
