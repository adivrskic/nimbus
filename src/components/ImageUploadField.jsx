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
  LogIn,
  Lock,
} from "lucide-react";
import {
  uploadImage,
  uploadMultipleImages,
  validateImageFile,
  deleteImage,
  getSignedImageUrl,
  getMultipleSignedUrls,
} from "../utils/imageUtils";
import { supabase } from "../lib/supabaseClient"; // Import supabase
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
  privateBucket = true,
  expiresIn = 3600,
  requireAuth = true, // NEW: Option to require authentication
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [imageData, setImageData] = useState(() => {
    if (!value) return multiple ? [] : null;

    if (multiple && Array.isArray(value)) {
      return value.map((item) => {
        if (typeof item === "string") {
          return { url: item, isExternal: true };
        }
        return item;
      });
    } else if (!multiple && typeof value === "object" && value !== null) {
      return value;
    } else if (!multiple && typeof value === "string") {
      return { url: value, isExternal: true };
    }
    return multiple ? [] : null;
  });

  const fileInputRef = useRef(null);

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsCheckingAuth(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking authentication:", error);
        setIsAuthenticated(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Refresh signed URLs when they expire or on mount
  useEffect(() => {
    if (!privateBucket || disabled || !imageData || !isAuthenticated) return;

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

    const needsRefresh = () => {
      if (multiple && Array.isArray(imageData)) {
        return imageData.some(
          (item) =>
            !item.isExternal &&
            (!item.expiresAt || Date.now() > item.expiresAt - 60000)
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
    isAuthenticated,
  ]);

  // Handle file selection with authentication check
  const handleFileSelect = useCallback(
    async (files) => {
      if (!files || files.length === 0) return;
      if (disabled) return;

      // Check authentication if required
      if (requireAuth && !isAuthenticated) {
        setError("Please sign in to upload images");
        return;
      }

      setError(null);
      setIsUploading(true);

      try {
        if (multiple) {
          // Multiple file upload
          const filesToUpload = Array.from(files).slice(0, maxFiles);
          setUploadProgress({ current: 0, total: filesToUpload.length });

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

            const currentValues = Array.isArray(imageData) ? imageData : [];
            const newData = [...currentValues, ...successfulUploads];
            setImageData(newData);
            onChange(newData);
          } else {
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
      requireAuth,
      isAuthenticated,
    ]
  );

  // Handle URL submission (for external URLs)
  const handleUrlSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!urlInput.trim()) return;

      const url = urlInput.trim();

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

  // Handle sign in
  const handleSignIn = useCallback(() => {
    // You can trigger your auth modal or redirect to sign in page
    // For example, if using Supabase auth:
    supabase.auth.signInWithOAuth({
      provider: "github",
      // or your preferred provider
    });
  }, []);

  // Check if user can interact with the upload field
  const canUpload = !requireAuth || isAuthenticated;
  const isActuallyDisabled = disabled || !canUpload;

  // Render authentication prompt
  const renderAuthPrompt = () => {
    if (isCheckingAuth) {
      return (
        <div className="image-upload-field__auth-prompt checking">
          <Loader2 size={20} className="spinning" />
          <span>Checking authentication...</span>
        </div>
      );
    }

    if (!isAuthenticated && requireAuth) {
      return (
        <div className="image-upload-field__auth-prompt">
          <div className="image-upload-field__auth-icon">
            <Lock size={24} />
          </div>
          <div className="image-upload-field__auth-content">
            <h4 className="image-upload-field__auth-title">
              Sign in to upload images
            </h4>
            <p className="image-upload-field__auth-message">
              You need to be signed in to upload images to this site. This
              ensures your images are securely stored and managed.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

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

  // Check if URL is expired
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
      className={`image-upload-field ${isActuallyDisabled ? "disabled" : ""} ${
        privateBucket ? "private" : "public"
      } ${!canUpload ? "needs-auth" : ""}`}
    >
      {/* Authentication Prompt */}
      {!canUpload && renderAuthPrompt()}

      {/* Upload Area (only show if authenticated) */}
      {canUpload && (
        <>
          <div
            className={`image-upload-field__dropzone ${
              dragActive ? "active" : ""
            } ${isUploading ? "uploading" : ""}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() =>
              !isUploading &&
              !isActuallyDisabled &&
              fileInputRef.current?.click()
            }
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={isActuallyDisabled || isUploading}
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
                {privateBucket && (
                  <small>Images will be stored privately</small>
                )}
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
                    disabled={isActuallyDisabled}
                  />
                  <button
                    type="submit"
                    disabled={!urlInput.trim() || isActuallyDisabled}
                  >
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
                  disabled={isActuallyDisabled}
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
        </>
      )}

      {/* Hint */}
      {hint && <p className="image-upload-field__field-hint">{hint}</p>}
    </div>
  );
}

export default ImageUploadField;
