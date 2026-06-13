import SectionHeader from "./SectionHeader";

import styles from "./ContactFormSection.module.css";

export default function ContactFormSection() {
  return (
    <section className={styles.section}>
      <SectionHeader title="Send a Message" />

      <form className={styles.form}>
        <input type="text" placeholder="Name" />

        <input type="email" placeholder="Email" />

        <textarea placeholder="Message" rows={6} />

        <button type="submit">Send Message</button>
      </form>
    </section>
  );
}
