// utils/imageUtils.js
import { supabase } from "../lib/supabaseClient";

/**
 * Maximum image dimensions and quality settings
 */
const IMAGE_CONFIG = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  thumbnailSize: 400,
  maxFileSizeMB: 5,
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
};

/**
 * Compress and resize an image file
 * @param {File} file - The image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<Blob>} - Compressed image blob
 */
export async function compressImage(file, options = {}) {
  const {
    maxWidth = IMAGE_CONFIG.maxWidth,
    maxHeight = IMAGE_CONFIG.maxHeight,
    quality = IMAGE_CONFIG.quality,
    outputType = "image/jpeg",
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        outputType,
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    // Create object URL for the file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate a thumbnail from an image file
 * @param {File|Blob} file - The image file
 * @param {number} size - Thumbnail size (square)
 * @returns {Promise<Blob>} - Thumbnail blob
 */
export async function generateThumbnail(
  file,
  size = IMAGE_CONFIG.thumbnailSize
) {
  return compressImage(file, {
    maxWidth: size,
    maxHeight: size,
    quality: 0.7,
  });
}

/**
 * Validate an image file
 * @param {File} file - The file to validate
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (!IMAGE_CONFIG.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${IMAGE_CONFIG.allowedTypes.join(
        ", "
      )}`,
    };
  }

  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > IMAGE_CONFIG.maxFileSizeMB) {
    return {
      valid: false,
      error: `File too large. Maximum size: ${IMAGE_CONFIG.maxFileSizeMB}MB`,
    };
  }

  return { valid: true };
}

/**
 * Get a signed URL for a private image
 * @param {string} path - Storage path
 * @param {number} expiresIn - Seconds until URL expires (default 1 hour)
 * @param {string} bucket - Bucket name
 */
export async function getSignedImageUrl(
  path,
  expiresIn = 60 * 60,
  bucket = "site-images"
) {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) throw error;
    return {
      signedUrl: data.signedUrl,
      expiresAt: Date.now() + expiresIn * 1000,
      path,
    };
  } catch (error) {
    console.error("Failed to create signed URL:", error);
    throw error;
  }
}

/**
 * Get multiple signed URLs (batch request)
 */
export async function getMultipleSignedUrls(
  paths,
  expiresIn = 60 * 60,
  bucket = "site-images"
) {
  try {
    const results = [];

    for (const path of paths) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        console.error(`Failed to get signed URL for ${path}:`, error);
        results.push({ path, error: error.message });
      } else {
        results.push({
          path,
          signedUrl: data.signedUrl,
          expiresAt: Date.now() + expiresIn * 1000,
        });
      }
    }

    return results;
  } catch (error) {
    console.error("Failed to get signed URLs:", error);
    throw error;
  }
}

/**
 * Upload an image to Supabase Storage
 * @param {File|Blob} file - The image file to upload
 * @param {string} siteId - The site ID for organizing images
 * @param {string} fieldPath - The field path (e.g., "photos[0].imageUrl")
 * @param {Object} options - Upload options
 * @returns {Promise<{ url: string, path: string, thumbnail?: string }>}
 */
export async function uploadImage(file, siteId, fieldPath, options = {}) {
  const {
    compress = true,
    generateThumb = true,
    bucket = "site-images",
    privateBucket = true, // NEW: flag for private buckets
  } = options;

  // Generate unique filename
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = file.type === "image/png" ? "png" : "jpg";
  const filename = `${timestamp}-${randomId}.${extension}`;

  // Create storage path: siteId/fieldPath/filename
  const sanitizedFieldPath = fieldPath.replace(/[\[\]\.]/g, "_");
  const storagePath = `${siteId}/${sanitizedFieldPath}/${filename}`;

  try {
    // Compress image if needed
    let imageToUpload = file;
    if (compress && file.size > 100 * 1024) {
      imageToUpload = await compressImage(file);
    }

    // Upload main image
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(storagePath, imageToUpload, {
        contentType: file.type === "image/png" ? "image/png" : "image/jpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const result = {
      path: storagePath,
      originalName: file.name || filename,
      size: imageToUpload.size,
      fieldPath: fieldPath,
      bucket: bucket,
    };

    // For private buckets, we'll create signed URLs
    if (privateBucket) {
      // Create signed URL that expires in 1 hour
      const { data: signedData, error: signedError } = await supabase.storage
        .from(bucket)
        .createSignedUrl(storagePath, 60 * 60); // 1 hour in seconds

      if (!signedError && signedData) {
        result.signedUrl = signedData.signedUrl;
        result.signedExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour from now
      }
    } else {
      // For public buckets, use public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(storagePath);
      result.url = publicUrl;
    }

    // Generate and upload thumbnail if requested
    if (generateThumb) {
      try {
        const thumbnail = await generateThumbnail(file);
        const thumbPath = `${siteId}/${sanitizedFieldPath}/thumb_${filename}`;

        await supabase.storage.from(bucket).upload(thumbPath, thumbnail, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: false,
        });

        // Get thumbnail URL based on bucket type
        if (privateBucket) {
          const { data: thumbSignedData } = await supabase.storage
            .from(bucket)
            .createSignedUrl(thumbPath, 60 * 60);

          if (thumbSignedData) {
            result.thumbnail = thumbSignedData.signedUrl;
          }
        } else {
          const {
            data: { publicUrl: thumbUrl },
          } = supabase.storage.from(bucket).getPublicUrl(thumbPath);
          result.thumbnail = thumbUrl;
        }

        result.thumbnailPath = thumbPath;
      } catch (thumbError) {
        console.warn("Failed to generate thumbnail:", thumbError);
      }
    }

    return result;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
}

/**
 * Upload multiple images
 * @param {FileList|File[]} files - Array of files to upload
 * @param {string} siteId - The site ID
 * @param {string} fieldPath - Base field path
 * @param {Function} onProgress - Progress callback (index, total, result)
 * @returns {Promise<Array>} - Array of upload results
 */
export async function uploadMultipleImages(
  files,
  siteId,
  fieldPath,
  onProgress
) {
  const results = [];
  const fileArray = Array.from(files);

  for (let i = 0; i < fileArray.length; i++) {
    const file = fileArray[i];
    const validation = validateImageFile(file);

    if (!validation.valid) {
      results.push({
        success: false,
        error: validation.error,
        originalName: file.name,
      });
      continue;
    }

    try {
      const result = await uploadImage(file, siteId, `${fieldPath}[${i}]`);
      results.push({ success: true, ...result });

      if (onProgress) {
        onProgress(i + 1, fileArray.length, result);
      }
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        originalName: file.name,
      });
    }
  }

  return results;
}

/**
 * Delete an image from storage
 * @param {string} path - The storage path to delete
 * @param {string} bucket - Storage bucket name
 */
export async function deleteImage(path, bucket = "site-images") {
  try {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Failed to delete image:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete all images for a site
 * @param {string} siteId - The site ID
 * @param {string} bucket - Storage bucket name
 */
export async function deleteAllSiteImages(siteId, bucket = "site-images") {
  try {
    // List all files in the site's folder
    const { data: files, error: listError } = await supabase.storage
      .from(bucket)
      .list(siteId, { limit: 1000 });

    if (listError) throw listError;

    if (files && files.length > 0) {
      // Recursively get all files (including in subfolders)
      const allPaths = [];

      for (const item of files) {
        if (item.id) {
          // It's a file
          allPaths.push(`${siteId}/${item.name}`);
        } else {
          // It's a folder, list its contents
          const { data: subFiles } = await supabase.storage
            .from(bucket)
            .list(`${siteId}/${item.name}`);

          if (subFiles) {
            subFiles.forEach((subFile) => {
              if (subFile.id) {
                allPaths.push(`${siteId}/${item.name}/${subFile.name}`);
              }
            });
          }
        }
      }

      if (allPaths.length > 0) {
        const { error: deleteError } = await supabase.storage
          .from(bucket)
          .remove(allPaths);

        if (deleteError) throw deleteError;
      }
    }

    return { success: true, deletedCount: files?.length || 0 };
  } catch (error) {
    console.error("Failed to delete site images:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Fetch an image as a blob (for including in zip)
 * @param {string} url - Image URL
 * @returns {Promise<{ blob: Blob, contentType: string } | null>}
 */
export async function fetchImageAsBlob(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const blob = await response.blob();
    const contentType = response.headers.get("content-type") || "image/jpeg";

    return { blob, contentType };
  } catch (error) {
    console.warn(`Failed to fetch image: ${url}`, error);
    return null;
  }
}

/**
 * Extract all image URLs from customization data
 * @param {Object} customization - The customization object
 * @returns {Array<{ fieldPath: string, url: string }>}
 */
export function extractImageUrls(customization) {
  const images = [];

  function traverse(obj, path = "") {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === "string" && isImageUrl(value)) {
        images.push({ fieldPath: currentPath, url: value });
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          traverse(item, `${currentPath}[${index}]`);
        });
      } else if (typeof value === "object" && value !== null) {
        traverse(value, currentPath);
      }
    }
  }

  traverse(customization);
  return images;
}

/**
 * Check if a string is likely an image URL
 * @param {string} str - String to check
 * @returns {boolean}
 */
export function isImageUrl(str) {
  if (!str || typeof str !== "string") return false;

  // Check for common image URL patterns
  const imagePatterns = [
    /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i,
    /^https?:\/\/.*\/(image|photo|img|media|upload)/i,
    /unsplash\.com/i,
    /cloudinary\.com/i,
    /imgur\.com/i,
    /supabase.*storage/i,
  ];

  return imagePatterns.some((pattern) => pattern.test(str));
}

/**
 * Convert image URLs in customization to relative paths for zip
 * @param {Object} customization - Original customization
 * @param {Map<string, string>} urlToPathMap - Map of URL to local path
 * @returns {Object} - Updated customization with relative paths
 */
export function convertUrlsToRelativePaths(customization, urlToPathMap) {
  const converted = JSON.parse(JSON.stringify(customization));

  function traverse(obj) {
    if (!obj || typeof obj !== "object") return;

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && urlToPathMap.has(value)) {
        obj[key] = urlToPathMap.get(value);
      } else if (Array.isArray(value)) {
        value.forEach((item) => traverse(item));
      } else if (typeof value === "object" && value !== null) {
        traverse(value);
      }
    }
  }

  traverse(converted);
  return converted;
}
