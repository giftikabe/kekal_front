// ImagePreview.tsx
import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  maxWidth?: number;
  maxHeight?: number;
}

export default function ImagePreview({
  src,
  alt = "",
  maxWidth = 320,
  maxHeight = 240,
}: ImagePreviewProps) {
  return (
    <div className={styles.box} style={{ maxWidth, height: maxHeight }}>
      <img
        src={src}
        alt={alt}
        className={styles.img}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
