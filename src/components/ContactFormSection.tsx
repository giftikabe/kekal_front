import styles from "./ContactFormSection.module.css";
import SectionHeader from "./SectionHeader";

interface ContactFormSectionProps {
  title: string;

  buttonText: string;
}

export default function ContactFormSection({
  title,
  buttonText,
}: ContactFormSectionProps) {
  return (
    <div className={styles.container}>
      <SectionHeader title={title} />

      <form className={styles.form}> 
        <input type="text" placeholder="Full Name" />

        <input type="email" placeholder="Email Address" />

        <input type="text" placeholder="Subject" />

        <textarea placeholder="Your Message" rows={6} />

        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}
