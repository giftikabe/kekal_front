import styles from "./ClosingImageSection.module.css";

interface ClosingImageSectionProps {
  image: string;

  alt: string;
}

export default function ClosingImageSection({
  image,
  alt,
}: ClosingImageSectionProps) {
  return (
    <section className={styles.section}>
      <img src={image} alt={alt} className={styles.image} />
    </section>
  );
}
