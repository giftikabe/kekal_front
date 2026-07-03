import styles from "./EventGallery.module.css";

interface EventGalleryProps {
  images: string[];
}

export default function EventGallery({ images }: EventGalleryProps) {
  if (images.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.gallery}>
        {images.map((image, index) => (
          <div key={index} className={styles.item}>
            <img src={image} alt="" className={styles.image} />
          </div>
        ))}
      </div>
    </section>
  );
}
