import SectionHeader from "./SectionHeader";

import styles from "./ContactDetailsSection.module.css";

export default function ContactDetailsSection() {
  return (
    <div className={styles.container}>
      <SectionHeader title="Direct Contact" />

      <div className={styles.item}>
        <h3>Address</h3>

        <p>
          123 Avenue Montaigne
          <br />
          Paris, France
        </p>
      </div>

      <div className={styles.item}>
        <h3>Phone</h3>

        <p>+33 (01) 23 45 67 89</p>
      </div>

      <div className={styles.item}>
        <h3>Email</h3>

        <p>info@emmalangford.com</p>
      </div>
    </div>
  );
}
