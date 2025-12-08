// components/ImageUploadField.jsx
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Link,
  Loader2,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  uploadImage,
  uploadMultipleImages,
  validateImageFile,
  deleteImage,
  getSignedImageUrl,
  getMultipleSignedUrls,
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
  bucket = "site-images",
  privateBucket = true, // NEW: flag for private bucket
  expiresIn = 3600, // NEW: signed URL expiration in seconds
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [imageData, setImageData] = useState(() => {
    // Initialize state from value prop
    if (!value) return multiple ? [] : null;

    if (multiple && Array.isArray(value)) {
      // For multiple images, value should be array of objects with path and signedUrl
      return value.map((item) => {
        if (typeof item === "string") {
          // Backward compatibility: string URL
          return { url: item, isExternal: true };
        }
        return item; // Already object with path/signedUrl
      });
    } else if (!multiple && typeof value === "object" && value !== null) {
      // Single image object
      return value;
    } else if (!multiple && typeof value === "string") {
      // Backward compatibility: string URL
      return { url: value, isExternal: true };
    }
    return multiple ? [] : null;
  });

  const fileInputRef = useRef(null);

  // Refresh signed URLs when they expire or on mount
  useEffect(() => {
    if (!privateBucket || disabled || !imageData) return;

    const refreshSignedUrls = async () => {
      try {
        setIsRefreshing(true);

        if (multiple && Array.isArray(imageData)) {
          const paths = imageData
            .filter((item) => item.path && !item.isExternal)
            .map((item) => item.path);

          if (paths.length > 0) {
            const signedUrls = await getMultipleSignedUrls(
              paths,
              expiresIn,
              bucket
            );

            const updatedData = imageData.map((item) => {
              if (item.isExternal) return item;

              const signedResult = signedUrls.find((s) => s.path === item.path);
              if (signedResult && !signedResult.error) {
                return {
                  ...item,
                  signedUrl: signedResult.signedUrl,
                  expiresAt: signedResult.expiresAt,
                };
              }
              return item;
            });

            setImageData(updatedData);
            onChange(updatedData);
          }
        } else if (!multiple && imageData.path && !imageData.isExternal) {
          const signedResult = await getSignedImageUrl(
            imageData.path,
            expiresIn,
            bucket
          );
          const updatedData = {
            ...imageData,
            signedUrl: signedResult.signedUrl,
            expiresAt: signedResult.expiresAt,
          };
          setImageData(updatedData);
          onChange(updatedData);
        }
      } catch (error) {
        console.error("Failed to refresh signed URLs:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    // Check if any URLs need refreshing
    const needsRefresh = () => {
      if (multiple && Array.isArray(imageData)) {
        return imageData.some(
          (item) =>
            !item.isExternal &&
            (!item.expiresAt || Date.now() > item.expiresAt - 60000) // Refresh 1 minute before expiry
        );
      } else if (!multiple && imageData && !imageData.isExternal) {
        return !imageData.expiresAt || Date.now() > imageData.expiresAt - 60000;
      }
      return false;
    };

    if (needsRefresh()) {
      refreshSignedUrls();
    }
  }, [
    privateBucket,
    disabled,
    imageData,
    multiple,
    onChange,
    expiresIn,
    bucket,
  ]);

  // Handle file selection with private bucket support
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

          // For private buckets, we'll handle uploads differently
          if (privateBucket) {
            const uploadResults = [];

            for (let i = 0; i < filesToUpload.length; i++) {
              const file = filesToUpload[i];
              const validation = validateImageFile(file);

              if (!validation.valid) {
                uploadResults.push({
                  success: false,
                  error: validation.error,
                  originalName: file.name,
                });
                continue;
              }

              try {
                // Upload with private bucket option
                const result = await uploadImage(file, siteId, fieldPath, {
                  bucket,
                  privateBucket,
                  compress: true,
                  generateThumb: true,
                });

                uploadResults.push({
                  success: true,
                  ...result,
                });
              } catch (uploadError) {
                uploadResults.push({
                  success: false,
                  error: uploadError.message,
                  originalName: file.name,
                });
              }

              setUploadProgress({
                current: i + 1,
                total: filesToUpload.length,
              });
            }

            const successfulUploads = uploadResults
              .filter((r) => r.success)
              .map((r) => ({
                path: r.path,
                signedUrl: r.signedUrl,
                thumbnail: r.thumbnail,
                expiresAt: r.expiresAt,
                originalName: r.originalName,
                size: r.size,
              }));

            const errors = uploadResults.filter((r) => !r.success);
            if (errors.length > 0) {
              setError(`${errors.length} file(s) failed to upload`);
            }

            // Append to existing values
            const currentValues = Array.isArray(imageData) ? imageData : [];
            const newData = [...currentValues, ...successfulUploads];
            setImageData(newData);
            onChange(newData);
          } else {
            // Original public bucket logic
            const results = await uploadMultipleImages(
              filesToUpload,
              siteId,
              fieldPath,
              (current, total) => {
                setUploadProgress({ current, total });
              },
              { bucket }
            );

            const successfulUploads = results
              .filter((r) => r.success)
              .map((r) => ({ url: r.url, isExternal: false }));

            const errors = results.filter((r) => !r.success);
            if (errors.length > 0) {
              setError(`${errors.length} file(s) failed to upload`);
            }

            const currentValues = Array.isArray(imageData) ? imageData : [];
            const newData = [...currentValues, ...successfulUploads];
            setImageData(newData);
            onChange(newData);
          }
        } else {
          // Single file upload
          const file = files[0];
          const validation = validateImageFile(file);

          if (!validation.valid) {
            setError(validation.error);
            return;
          }

          // Upload with private bucket option
          const result = await uploadImage(file, siteId, fieldPath, {
            bucket,
            privateBucket,
            compress: true,
            generateThumb: true,
          });

          const newData = privateBucket
            ? {
                path: result.path,
                signedUrl: result.signedUrl,
                thumbnail: result.thumbnail,
                expiresAt: result.expiresAt,
                originalName: result.originalName,
                size: result.size,
              }
            : {
                url: result.url,
                isExternal: false,
              };

          setImageData(newData);
          onChange(newData);
        }
      } catch (err) {
        console.error("Upload error:", err);
        setError(err.message || "Upload failed");
      } finally {
        setIsUploading(false);
        setUploadProgress({ current: 0, total: 0 });
      }
    },
    [
      siteId,
      fieldPath,
      multiple,
      maxFiles,
      imageData,
      onChange,
      disabled,
      privateBucket,
      bucket,
    ]
  );

  // Handle URL submission (for external URLs)
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

      const externalImage = { url, isExternal: true };

      if (multiple) {
        const currentValues = Array.isArray(imageData) ? imageData : [];
        const newData = [...currentValues, externalImage];
        setImageData(newData);
        onChange(newData);
      } else {
        setImageData(externalImage);
        onChange(externalImage);
      }

      setUrlInput("");
      setShowUrlForm(false);
      setError(null);
    },
    [urlInput, multiple, imageData, onChange]
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
        const currentValues = Array.isArray(imageData) ? [...imageData] : [];
        const removedItem = currentValues[index];
        currentValues.splice(index, 1);

        setImageData(currentValues);
        onChange(currentValues);

        // Try to delete from storage if it's a Supabase private image
        if (removedItem && removedItem.path && !removedItem.isExternal) {
          try {
            await deleteImage(removedItem.path, bucket);
            console.log("Deleted image from storage:", removedItem.path);
          } catch (deleteError) {
            console.warn("Failed to delete from storage:", deleteError);
          }
        }
      } else {
        // For single image, delete from storage if applicable
        if (imageData && imageData.path && !imageData.isExternal) {
          try {
            await deleteImage(imageData.path, bucket);
          } catch (deleteError) {
            console.warn("Failed to delete from storage:", deleteError);
          }
        }

        setImageData(null);
        onChange(null);
      }
    },
    [multiple, imageData, onChange, bucket]
  );

  // Refresh a single signed URL
  const handleRefreshUrl = useCallback(
    async (item) => {
      if (!item.path || item.isExternal) return;

      try {
        setIsRefreshing(true);
        const signedResult = await getSignedImageUrl(
          item.path,
          expiresIn,
          bucket
        );

        if (multiple) {
          const updatedData = imageData.map((img) =>
            img.path === item.path
              ? {
                  ...img,
                  signedUrl: signedResult.signedUrl,
                  expiresAt: signedResult.expiresAt,
                }
              : img
          );
          setImageData(updatedData);
          onChange(updatedData);
        } else {
          const updatedData = {
            ...imageData,
            signedUrl: signedResult.signedUrl,
            expiresAt: signedResult.expiresAt,
          };
          setImageData(updatedData);
          onChange(updatedData);
        }
      } catch (error) {
        console.error("Failed to refresh URL:", error);
        setError("Failed to refresh image URL");
      } finally {
        setIsRefreshing(false);
      }
    },
    [multiple, imageData, onChange, expiresIn, bucket]
  );

  // Get image source URL for display
  const getImageSrc = (item) => {
    if (!item) return "";

    if (item.isExternal) {
      return item.url;
    }

    if (privateBucket) {
      return item.signedUrl || "";
    }

    return item.url || "";
  };

  // Check if URL is expired (for private bucket)
  const isUrlExpired = (item) => {
    if (!privateBucket || !item || item.isExternal) return false;
    return item.expiresAt && Date.now() > item.expiresAt;
  };

  // Render preview for single image
  const renderSinglePreview = () => {
    if (!imageData) return null;

    const src = getImageSrc(imageData);
    const expired = isUrlExpired(imageData);

    return (
      <div className="image-upload-field__preview">
        <div className="image-upload-field__preview-inner">
          {src && (
            <img
              src={src}
              alt="Preview"
              onError={(e) => {
                if (privateBucket && !imageData.isExternal) {
                  console.log("Image failed to load, might need refresh");
                  if (expired) {
                    handleRefreshUrl(imageData);
                  }
                }
              }}
            />
          )}
          {privateBucket && !imageData.isExternal && (
            <div className="image-upload-field__private-badge">
              <Shield size={12} />
              <span>Private</span>
              {expired && <span className="expired">Expired</span>}
            </div>
          )}
          {privateBucket && !imageData.isExternal && expired && (
            <button
              type="button"
              className="image-upload-field__refresh"
              onClick={() => handleRefreshUrl(imageData)}
              disabled={isRefreshing}
              title="Refresh expired URL"
            >
              <RefreshCw size={14} />
            </button>
          )}
          <button
            type="button"
            className="image-upload-field__remove"
            onClick={() => handleRemove(0)}
            disabled={disabled}
          >
            <X size={16} />
          </button>
        </div>
        {privateBucket && !imageData.isExternal && imageData.originalName && (
          <div className="image-upload-field__info">
            <span>{imageData.originalName}</span>
            <span>{(imageData.size / 1024).toFixed(1)} KB</span>
          </div>
        )}
      </div>
    );
  };

  // Render preview for multiple images
  const renderMultiplePreview = () => {
    if (!imageData || !Array.isArray(imageData) || imageData.length === 0)
      return null;

    return (
      <div className="image-upload-field__gallery">
        {imageData.map((item, index) => {
          const src = getImageSrc(item);
          const expired = isUrlExpired(item);

          return (
            <div key={index} className="image-upload-field__gallery-item">
              <div className="image-upload-field__gallery-item-inner">
                {src && (
                  <img
                    src={src}
                    alt={`Image ${index + 1}`}
                    onError={(e) => {
                      if (privateBucket && !item.isExternal && expired) {
                        handleRefreshUrl(item);
                      }
                    }}
                  />
                )}
                {privateBucket && !item.isExternal && (
                  <div className="image-upload-field__private-badge">
                    <Shield size={10} />
                    {expired && <span className="expired">!</span>}
                  </div>
                )}
                {privateBucket && !item.isExternal && expired && (
                  <button
                    type="button"
                    className="image-upload-field__refresh"
                    onClick={() => handleRefreshUrl(item)}
                    disabled={isRefreshing}
                    title="Refresh expired URL"
                  >
                    <RefreshCw size={12} />
                  </button>
                )}
                <button
                  type="button"
                  className="image-upload-field__remove"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                >
                  <X size={14} />
                </button>
              </div>
              {privateBucket && !item.isExternal && (
                <div className="image-upload-field__gallery-item-info">
                  <span title={item.originalName}>
                    {item.originalName
                      ? item.originalName.substring(0, 15)
                      : "Image"}
                    ...
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div
      className={`image-upload-field ${disabled ? "disabled" : ""} ${
        privateBucket ? "private" : "public"
      }`}
    >
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
            {privateBucket && <small>Images will be stored privately</small>}
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
              {privateBucket && " • Private storage"}
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
              {privateBucket
                ? "External URLs are public. Use upload for private storage."
                : "External URLs may not be 100% reliable"}
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

      {/* Hint */}
      {hint && <p className="image-upload-field__field-hint">{hint}</p>}
    </div>
  );
}

export default ImageUploadField;
