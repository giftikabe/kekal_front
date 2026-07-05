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

      {address && (
        <div className={styles.item}>
          <h3>Address</h3>
          <p>{address}</p>
        </div>
      )}

      {phone && (
        <div className={styles.item}>
          <h3>Phone</h3>
          <a href={`tel:${phone.replace(/\s+/g, "")}`}>{phone}</a>
        </div>
      )}

      {email && (
        <div className={styles.item}>
          <h3>Email</h3>
          <a href={`mailto:${email}`}>{email}</a>
        </div>
      )}
    </div>
  );
}
