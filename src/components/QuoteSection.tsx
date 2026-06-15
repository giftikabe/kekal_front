import styles from "./QuoteSection.module.css";

interface QuoteSectionProps {
  quote: string;

  author: string;
}

export default function QuoteSection({ quote, author }: QuoteSectionProps) {
  return (
    <section className={styles.section}>
      <blockquote className={styles.quote}>"{quote}"</blockquote>

      <p className={styles.author}>— {author}</p>
    </section>
  );
}
