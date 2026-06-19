import styles from "./UpcomingEventContent.module.css";

interface UpcomingEventContentProps {
  content: string;
}

export default function UpcomingEventContent({
  content,
}: UpcomingEventContentProps) {
  const paragraphs = content.split("\n\n");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
