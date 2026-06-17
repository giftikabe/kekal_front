import styles from "./EventContent.module.css";

interface EventContentProps {
  content: string;
}

export default function EventContent({
  content,
}: EventContentProps) {
  const paragraphs = content
    .split("\n\n")
    .filter(Boolean);

  return (
    <section className={styles.section}>
      {paragraphs.map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </section>
  );
}