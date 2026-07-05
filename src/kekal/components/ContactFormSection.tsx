import { useState, type FormEvent } from "react";

import styles from "./ContactFormSection.module.css";
import SectionHeader from "./SectionHeader";

interface ContactFormSectionProps {
  title: string;
  buttonText: string;
  /** Where the message should ultimately go. There is no form-submission
   * API in the backend yet, so this composes a mailto: link as a working
   * fallback rather than shipping a form that silently does nothing. */
  recipientEmail?: string;
}

export default function ContactFormSection({
  title,
  buttonText,
  recipientEmail,
}: ContactFormSectionProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "error" | "sent">("idle");

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      return;
    }

    if (!recipientEmail) {
      setStatus("error");
      return;
    }

    const subject = encodeURIComponent(form.subject || `Message from ${form.name}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name} (${form.email})`,
    );
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    setStatus("sent");
  };

  return (
    <div className={styles.container}>
      <SectionHeader title={title} />

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="contact-name" className="sr-only">
            Full name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Full Name"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange("name")}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-email" className="sr-only">
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange("email")}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-subject" className="sr-only">
            Subject
          </label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={handleChange("subject")}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-message" className="sr-only">
            Your message
          </label>
          <textarea
            id="contact-message"
            name="message"
            placeholder="Your Message"
            rows={6}
            required
            value={form.message}
            onChange={handleChange("message")}
          />
        </div>

        {status === "error" && (
          <p className={`${styles.status} ${styles.statusError}`} role="alert">
            Please fill in your name, email and message before sending.
          </p>
        )}
        {status === "sent" && (
          <p className={styles.status} role="status">
            Opening your email app to send this — if nothing happens, email
            us directly at {recipientEmail}.
          </p>
        )}

        <button type="submit">{buttonText}</button>
      </form>
    </div>
  );
}
