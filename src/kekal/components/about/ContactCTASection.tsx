import { Link } from "react-router-dom";

import styles from "./ContactCTASection.module.css";

interface ContactCTASectionProps {
  title: string;

  description: string;

  buttonText: string;
}

export default function ContactCTASection({
  title,
  description,
  buttonText,
}: ContactCTASectionProps) {
  return (
    <section className={styles.section}>
      <h2>{title}</h2>

      <p>{description}</p>

      <Link to="/contact" className={styles.button}>
        {buttonText}
      </Link>
    </section>
  );
}
