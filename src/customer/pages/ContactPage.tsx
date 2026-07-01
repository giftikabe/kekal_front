/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { brandApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import PageSeo from "../components/PageSeo";
import { LoadingScreen } from "../components/States";
import styles from "./ContactPage.module.css";

export default function ContactPage() {
  const { getSectionHeader } = useSectionData("page-contact");
  const [identity, setIdentity] = useState<any[]>([]);
  const [contact, setContact] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    Promise.all([brandApi.getIdentity(), brandApi.getContactInfo()])
      .then(([id, c]) => { setIdentity(id as any[]); setContact(c as any[]); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const getId = (key: string) => identity.find((i) => i.key === key)?.value || "";
  const getContact = (key: string) => contact.find((c) => c.key === key)?.value || "";

  const heroTitle = getId("contact_hero_eyebrow") || "Get in Touch";
  const heroDesc = getId("contact_hero_description") || "";
  const heroImg = getId("contact_hero_image") || "";
  const mapUrl = getContact("google_map");

  const socials = [
    { key: "instagram", label: "Instagram" },
    { key: "tiktok", label: "TikTok" },
    { key: "facebook", label: "Facebook" },
    { key: "linkedin", label: "LinkedIn" },
  ].filter((s) => getContact(s.key));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Contact form — submits via mailto for now
    const subject = encodeURIComponent(form.subject || "Enquiry from Website");
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${getContact("email")}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <>
      <PageSeo route="/contact" fallbackTitle="Contact | KEKAL" />

      {/* Hero */}
      <section className={styles.hero} style={{ backgroundImage: heroImg ? `url(${heroImg})` : undefined }}>
        {heroImg && <div className={styles.heroOverlay} />}
        <div className={styles.heroContent}>
          <p className={styles.heroEyebrow}>{heroTitle}</p>
          <h1 className={styles.heroTitle}>{getSectionHeader("hero", "Contact")}</h1>
          {heroDesc && <p className={styles.heroDesc}>{heroDesc}</p>}
        </div>
      </section>

      {/* Body */}
      <section className={styles.body}>
        <div className={styles.bodyInner}>
          {/* Contact Form */}
          <div className={styles.formSide}>
            <h2 className={styles.formTitle}>{getSectionHeader("contact_form", "Send a Message")}</h2>
            {submitted ? (
              <div className={styles.successMsg}>
                <p>Thank you. We'll be in touch soon.</p>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Name</label>
                    <input className={styles.input} type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Email</label>
                    <input className={styles.input} type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Subject</label>
                  <input className={styles.input} type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Message</label>
                  <textarea className={styles.textarea} required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                </div>
                <button type="submit" className={styles.submitBtn}>Send Message</button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className={styles.infoSide}>
            <h2 className={styles.infoTitle}>{getSectionHeader("contact_details", "Direct Contact")}</h2>

            <div className={styles.infoGroup}>
              {getContact("email") && (
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Email</p>
                  <a href={`mailto:${getContact("email")}`} className={styles.infoValue}>{getContact("email")}</a>
                </div>
              )}
              {getContact("phone") && (
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Phone</p>
                  <a href={`tel:${getContact("phone")}`} className={styles.infoValue}>{getContact("phone")}</a>
                </div>
              )}
              {getContact("whatsapp") && (
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>WhatsApp</p>
                  <a href={`https://wa.me/${getContact("whatsapp").replace(/\D/g, "")}`} className={styles.infoValue} target="_blank" rel="noopener noreferrer">{getContact("whatsapp")}</a>
                </div>
              )}
              {getContact("address") && (
                <div className={styles.infoItem}>
                  <p className={styles.infoLabel}>Address</p>
                  <p className={styles.infoText}>{getContact("address")}</p>
                </div>
              )}
            </div>

            {socials.length > 0 && (
              <div className={styles.socials}>
                <p className={styles.infoLabel}>Follow Us</p>
                <div className={styles.socialLinks}>
                  {socials.map((s) => (
                    <a key={s.key} href={getContact(s.key)} className={styles.socialLink} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {mapUrl && (
              <div className={styles.mapWrap}>
                <iframe src={mapUrl} className={styles.map} title="Location" loading="lazy" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
