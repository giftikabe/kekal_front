import { useState, useRef } from "react";
import { uploadImage, getOptimizedUrl } from "../api/cloudinary";
import styles from "./ImageUpload.module.css";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  disabled?: boolean;
}

export default function ImageUpload({ value, onChange, label = "Image", disabled = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image must be under 10MB");
      return;
    }
    setError("");
    setUploading(true);
    try {
      const result = await uploadImage(file);
      setPreview(result.secure_url);
      onChange(result.secure_url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleRemove = () => {
    setPreview("");
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.label}>{label}</label>

      {preview ? (
        <div className={styles.previewWrap}>
          <img
            src={getOptimizedUrl(preview, 400)}
            alt="Preview"
            className={styles.preview}
          />
          {!disabled && (
            <div className={styles.previewActions}>
              <button
                type="button"
                className={styles.replaceBtn}
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Replace"}
              </button>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`${styles.dropzone} ${uploading ? styles.uploading : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          {uploading ? (
            <div className={styles.uploadingText}>Uploading...</div>
          ) : (
            <>
              <div className={styles.dropIcon}>↑</div>
              <div className={styles.dropText}>Drop image here or click to upload</div>
              <div className={styles.dropHint}>PNG, JPG, WEBP up to 10MB</div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {error && <div className={styles.error}>{error}</div>}

      {/* Also allow manual URL input */}
      <div className={styles.urlRow}>
        <input
          className={styles.urlInput}
          type="text"
          placeholder="Or paste image URL"
          value={preview}
          onChange={(e) => { setPreview(e.target.value); onChange(e.target.value); }}
          disabled={disabled}
        />
      </div>
    </div>
  );
}
