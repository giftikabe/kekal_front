import styles from "./ContactFormSection.module.css";
import SectionHeader from "./SectionHeader";

export default function ContactFormSection() {
  return (
    <div className={styles.container}>
      <SectionHeader title="Contact Form" />

      <form className={styles.form}>
        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email Address" />

        <input type="text" placeholder="Subject" />

        <textarea placeholder="Your Message" rows={6} />

        <button type="submit">Send</button>
      </form>
    </div>
  );
}
