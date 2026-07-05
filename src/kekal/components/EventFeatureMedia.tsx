import styles from "./EventFeatureMedia.module.css";

interface EventFeatureMediaProps {
  image: string;
  title: string;
  videoUrl?: string | null;
}

export default function EventFeatureMedia({
  image,
  title,
  videoUrl,
}: EventFeatureMediaProps) {
  return (
    <section className={styles.section}>
      {videoUrl ? (
        <div className={styles.videoWrapper}>
          <iframe
            src={videoUrl}
            title={title}
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
      ) : (
        <img src={image} alt={title} className={styles.image} loading="lazy" decoding="async" />
      )}
    </section>
  );
}
