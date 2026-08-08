import SitotaHero from "../components/SitotaHero";
import SitotaGiftCards from "../components/SitotaGiftCards";
import FeaturedCollections from "../components/FeaturedCollections";
import ContactCTASection from "../components/ContactCTASection";
import Seo from "../components/Seo";
import { useFeaturedCollections } from "../hooks/useCollections";
import { useBrandIdentityByKey } from "../hooks/useBrand";

export default function SitotaPage() {
  const { value: sitotaTagline } = useBrandIdentityByKey("sitota_tagline");
  const { value: sitotaImage } = useBrandIdentityByKey("sitota_hero_image");
  const { value: homeHeroImage } = useBrandIdentityByKey("home_hero_image");
  const { data: featuredCollections } = useFeaturedCollections();

  return (
    <>
      <Seo
        fallbackTitle="Sitota — Gifts of Craft | KEKAL Studio"
        fallbackDescription="Discover KEKAL Studio's gift collections. Handcrafted Ethiopian garments prepared with intention for every meaningful moment."
      />

      <SitotaHero
        tagline={sitotaTagline || "The Art of Giving"}
        subtitle="Gifts crafted with intention"
        image={sitotaImage || homeHeroImage}
      />

      <section
        style={{
          padding: "var(--section-pad-block) var(--section-pad-inline)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "var(--content-max-prose)", margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-display-md)",
              fontWeight: "var(--weight-light)",
              letterSpacing: "var(--tracking-tight)",
              marginBottom: "var(--space-md)",
            }}
          >
            Every Piece, a Story
          </h2>
          <p style={{ lineHeight: "var(--leading-body-loose)", color: "var(--color-mute)" }}>
            KEKAL gifts are not just garments — they are moments. Each piece is handcrafted
            by Ethiopian artisans, prepared with care, and wrapped in the warmth of our
            heritage. Whether for a newborn, a celebration, or someone you love, our pieces
            carry meaning that lasts.
          </p>
        </div>
      </section>

      <SitotaGiftCards />

      <FeaturedCollections
        title="Gift From Our Collections"
        collections={(featuredCollections as any[]) ?? []}
      />

      <ContactCTASection
        title="Commission a Custom Gift"
        description="Have something specific in mind? We create custom pieces for your most meaningful moments."
        buttonText="Get in Touch"
      />
    </>
  );
}