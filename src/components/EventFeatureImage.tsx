import styles from "./EventFeatureImage.module.css";

interface EventFeatureImageProps {
  image: string;

  title: string;
}

export default function EventFeatureImage({
  image,
  title,
}: EventFeatureImageProps) {
  return (
    <section className={styles.section}>
      <img src={image} alt={title} className={styles.image} />
    </section>
  );
}
