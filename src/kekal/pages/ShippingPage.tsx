import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

export default function ShippingPage() {
  return (
    <div
      style={{
        maxWidth: "var(--content-max-prose)",
        margin: "0 auto",
        padding: "var(--section-pad-block) var(--section-pad-inline)",
      }}
    >
      <SectionHeader title="Shipping Information" />

      <section style={{ marginTop: "var(--space-lg)" }}>
        <h2 style={{ fontSize: "var(--text-body-lg)", fontWeight: 500 }}>
          Local (Addis Ababa)
        </h2>
        <p style={{ color: "var(--color-mute)" }}>
          Orders within Addis Ababa are typically hand-delivered within 3–5
          business days of confirmation. Our team will coordinate a delivery
          window with you directly.
        </p>
      </section>

      <section style={{ marginTop: "var(--space-lg)" }}>
        <h2 style={{ fontSize: "var(--text-body-lg)", fontWeight: 500 }}>
          International
        </h2>
        <p style={{ color: "var(--color-mute)" }}>
          International shipping times vary by destination and are typically
          7–21 business days after order confirmation. Customs fees, where
          applicable, are the responsibility of the recipient.
        </p>
      </section>

      <p style={{ marginTop: "var(--space-lg)" }}>
        For specific inquiries about your order, please{" "}
        <Link to="/contact">get in touch</Link>.
      </p>
    </div>
  );
}