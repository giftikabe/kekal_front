import { useState } from "react";
import AcademiaHero from "../components/AcademiaHero";
import CourseTeaserCards from "../components/CourseTeaserCards";
import SectionHeader from "../components/SectionHeader";
import ContactCTASection from "../components/ContactCTASection";
import Seo from "../components/Seo";

export default function AcademiaPage() {
  const [notifyEmail, setNotifyEmail] = useState("");

  return (
    <>
      <Seo
        fallbackTitle="KEKAL Academy — Coming Soon"
        fallbackDescription="KEKAL Academy launches soon. Online courses in Ethiopian textile heritage, pattern making, and garment construction."
        noindex
      />

      <AcademiaHero />

      <section
        style={{
          background: "var(--color-ink)",
          color: "var(--color-paper)",
          padding: "var(--section-pad-block) var(--section-pad-inline)",
        }}
      >
        <div style={{ maxWidth: "var(--content-max-prose)", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-md)",
              fontWeight: "var(--weight-light)",
              color: "var(--color-paper)",
              marginBottom: "var(--space-md)",
            }}
          >
            The Vision
          </h2>
          <p style={{ lineHeight: "var(--leading-body-loose)", color: "rgba(247,245,241,0.75)" }}>
            KEKAL Academy is our commitment to preserving and sharing the knowledge of
            Ethiopian textile craft. We are building a space where designers, makers, and
            curious minds can learn the techniques, history, and artistry behind our work —
            from anywhere in the world.
          </p>
        </div>
      </section>

      <section style={{ padding: "var(--section-pad-block) var(--section-pad-inline)" }}>
        <SectionHeader title="Upcoming Courses" />
        <CourseTeaserCards />
      </section>

      <section
        style={{
          background: "var(--color-bone)",
          padding: "var(--section-pad-block) var(--section-pad-inline)",
        }}
      >
        <div style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-sm)",
              fontWeight: "var(--weight-light)",
              marginBottom: "var(--space-sm)",
            }}
          >
            Be the First to Know
          </h2>
          <p style={{ color: "var(--color-mute)", marginBottom: "var(--space-md)" }}>
            KEKAL Academy launches soon. Leave your email and we will notify you.
          </p>
          <div style={{ display: "flex", gap: 8, maxWidth: 360, margin: "0 auto" }}>
            <input
              type="email"
              value={notifyEmail}
              onChange={(e) => setNotifyEmail(e.target.value)}
              placeholder="your@email.com"
              style={{
                flex: 1,
                padding: "0.875rem 1rem",
                border: "1px solid var(--color-line)",
                fontFamily: "inherit",
                fontSize: "var(--text-body-sm)",
              }}
            />
            <a
              href={`mailto:info@kekalstudio.com?subject=KEKAL Academy Notification&body=Please notify me when KEKAL Academy launches: ${notifyEmail}`}
              style={{
                padding: "0.875rem 1.25rem",
                border: "1px solid var(--color-ink)",
                background: "var(--color-ink)",
                color: "var(--color-paper)",
                textDecoration: "none",
                fontSize: "var(--text-label)",
                letterSpacing: "var(--tracking-wide)",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              Notify Me
            </a>
          </div>
        </div>
      </section>

      <ContactCTASection
        title="Interested in Collaboration?"
        description="If you are an educator, designer, or institution interested in partnering with KEKAL Academy, we would love to hear from you."
        buttonText="Contact Us"
      />
    </>
  );
}