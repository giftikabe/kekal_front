import { useState } from "react";
import styles from "./ContactFormSection.module.css";
import SectionHeader from "../common/SectionHeader";

interface ContactFormSectionProps {
  title: string;
  buttonText: string;
}

export default function ContactFormSection({
  title,
  buttonText,
}: ContactFormSectionProps) {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      // TODO: POST to your contact endpoint
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className={styles.container}>
      <SectionHeader title={title} />
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <label className={styles.visuallyHidden} htmlFor="contact-name">
          Full Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Full Name"
          required
          autoComplete="name"
        />

        <label className={styles.visuallyHidden} htmlFor="contact-email">
          Email Address
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Email Address"
          required
          autoComplete="email"
        />

        <label className={styles.visuallyHidden} htmlFor="contact-subject">
          Subject
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          placeholder="Subject"
          required
        />

        <label className={styles.visuallyHidden} htmlFor="contact-message">
          Your Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Your Message"
          rows={6}
          required
        />

        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : buttonText}
        </button>

        <p role="status" aria-live="polite">
          {status === "success" && "Message sent — thank you!"}
          {status === "error" && "Something went wrong. Please try again."}
        </p>
      </form>
    </div>
  );
}
