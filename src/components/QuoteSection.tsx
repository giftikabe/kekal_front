import styles from "./QuoteSection.module.css";

interface QuoteSectionProps {
  quote: string;
}

export default function QuoteSection({ quote }: QuoteSectionProps) {
  return (
    <section className={styles.section}>
      <blockquote>{quote}</blockquote>
    </section>
  );
}
