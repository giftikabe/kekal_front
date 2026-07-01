import styles from "./ImagePreview.module.css";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  maxWidth?: number;
  maxHeight?: number;
}

/**
 * Renders an image at its natural aspect ratio, contained within an
 * optional max box. Never crops or stretches — object-fit: contain.
 */
export default function ImagePreview({
  src,
  alt = "",
  maxWidth,
  maxHeight,
}: ImagePreviewProps) {
  return (
    <div
      className={styles.box}
      style={{ maxWidth: maxWidth ?? 320, maxHeight: maxHeight ?? 240 }}
    >
      <img src={src} alt={alt} className={styles.img} />
    </div>
  );
}
