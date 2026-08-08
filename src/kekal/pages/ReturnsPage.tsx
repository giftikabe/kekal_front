import { Link } from "react-router-dom";
import SectionHeader from "../components/SectionHeader";

export default function ReturnsPage() {
  return (
    <div
      style={{
        maxWidth: "var(--content-max-prose)",
        margin: "0 auto",
        padding: "var(--section-pad-block) var(--section-pad-inline)",
      }}
    >
      <SectionHeader title="Return Policy" />

      <section style={{ marginTop: "var(--space-lg)" }}>
        <p style={{ color: "var(--color-mute)" }}>
          We accept returns within 7 days of delivery. Items must be unworn,
          unwashed, and in their original condition with all tags attached.
        </p>
        <p style={{ color: "var(--color-mute)", marginTop: "var(--space-sm)" }}>
          To start a return, please contact our team with your order number
          and reason for return. Once approved, we'll provide instructions
          for sending the item back. Refunds are processed after the
          returned item has been inspected.
        </p>
      </section>

      <p style={{ marginTop: "var(--space-lg)" }}>
        Questions about a return? <Link to="/contact">Contact us</Link>.
      </p>
    </div>
  );
}