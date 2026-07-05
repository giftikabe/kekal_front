import styles from "./QuoteSection.module.css";

interface QuoteSectionProps {
  quote: string;
  author: string;
}

export default function QuoteSection({ quote, author }: QuoteSectionProps) {
  if (!quote) return null;
  return (
    <section className={styles.section}>
      <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
      {author && <p className={styles.author}>— {author}</p>}
    </section>
  );
}
