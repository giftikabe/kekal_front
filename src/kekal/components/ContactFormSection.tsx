import { useState, type FormEvent } from "react";

import { contactApi } from "../api";
import styles from "./ContactFormSection.module.css";
import SectionHeader from "./SectionHeader";

interface ContactFormSectionProps {
  title: string;
  buttonText: string;
  /** Shown in the fallback message if sending fails. */
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
  const [status, setStatus] = useState<"idle" | "error" | "sending" | "sent">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setStatus("error");
      setErrorMsg(
        "Please fill in your name, email and message before sending.",
      );
      return;
    }

    setStatus("sending");
    try {
      await contactApi.submit({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      });
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Something went wrong sending your message.",
      );
    }
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
            disabled={status === "sending"}
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
            disabled={status === "sending"}
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
            disabled={status === "sending"}
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
            disabled={status === "sending"}
          />
        </div>

        {status === "error" && (
          <p className={`${styles.status} ${styles.statusError}`} role="alert">
            {errorMsg}
            {recipientEmail && (
              <> You can also email us directly at {recipientEmail}.</>
            )}
          </p>
        )}
        {status === "sent" && (
          <p className={styles.status} role="status">
            Thanks — your message has been sent. We'll get back to you soon.
          </p>
        )}

        <button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending..." : buttonText}
        </button>
      </form>
    </div>
  );
}
