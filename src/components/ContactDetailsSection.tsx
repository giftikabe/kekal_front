import SectionHeader from "./SectionHeader";

import styles from "./ContactDetailsSection.module.css";

interface ContactDetailsSectionProps {
  title: string;

  address: string;

  phone: string;

  email: string;
} 

export default function ContactDetailsSection({
  title,
  address,
  phone,
  email,
}: ContactDetailsSectionProps) {
  return (
    <div className={styles.container}>
      <SectionHeader title={title} />

      <div className={styles.item}>
        <h3>Address</h3>

        <p>{address}</p>
      </div>

      <div className={styles.item}>
        <h3>Phone</h3>

        <p>{phone}</p>
      </div>

      <div className={styles.item}>
        <h3>Email</h3>

        <p>{email}</p>
      </div>
    </div>
  );
}
