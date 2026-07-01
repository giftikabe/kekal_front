import { useRef, useState } from "react";
import { GripVertical, X } from "lucide-react";
import { uploadImage } from "../api/cloudinary";
import ImagePreview from "./ImagePreview";
import styles from "./MultiImageUpload.module.css";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  disabled?: boolean;
}

export default function MultiImageUpload({
  value,
  onChange,
  label = "Images",
  disabled = false,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const dragIndex = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    const invalid = list.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      setError("Only image files are allowed");
      return;
    }
    const tooBig = list.find((f) => f.size > 10 * 1024 * 1024);
    if (tooBig) {
      setError("Each image must be under 10MB");
      return;
    }

    setError("");
    setUploading(true);
    try {
      const uploaded = await Promise.all(list.map((f) => uploadImage(f)));
      onChange([...value, ...uploaded.map((r) => r.secure_url)]);
    } catch {
      setError("One or more uploads failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };
  const handleDragOverItem = (e: React.DragEvent) => e.preventDefault();
  const handleDropOnItem = (index: number) => {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...value];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    onChange(reordered);
    dragIndex.current = null;
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.label}>{label}</label>

      {value.length > 0 && (
        <div className={styles.grid}>
          {value.map((url, index) => (
            <div
              key={url + index}
              className={styles.item}
              draggable={!disabled}
              onDragStart={() => handleDragStart(index)}
              onDragOver={handleDragOverItem}
              onDrop={() => handleDropOnItem(index)}
            >
              {!disabled && (
                <GripVertical className={styles.handle} size={14} />
              )}
              <ImagePreview
                src={url}
                alt={`Image ${index + 1}`}
                maxWidth={140}
                maxHeight={140}
              />
              {!disabled && (
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={() => handleRemove(index)}
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {!disabled && (
        <div
          className={`${styles.dropzone} ${uploading ? styles.uploading : ""}`}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className={styles.uploadingText}>Uploading...</div>
          ) : (
            <>
              <div className={styles.dropIcon}>↑</div>
              <div className={styles.dropText}>
                Drop images here or click to upload multiple
              </div>
              <div className={styles.dropHint}>
                PNG, JPG, WEBP up to 10MB each. Drag tiles to reorder.
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {error && <div className={styles.error}>{error}</div>}
    </div>
  );
}
