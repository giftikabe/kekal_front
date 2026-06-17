import styles from "./EventFeatureMedia.module.css";

interface EventFeatureMediaProps {
  image: string;

  title: string;

  videoUrl?: string;
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
          />
        </div>
      ) : (
        <img
          src={image}
          alt={title}
          className={styles.image}
        />
      )}
    </section>
  );
}