import type { BrandIdentity } from "../database-types/brandIdentity";

import heroImage from "../assets/hero.png";

export const brandIdentity: BrandIdentity[] = [
  {
    id: "1",
    key: "name",
    label: "Brand Name",
    value: "KEKAL",
  },

  {
    id: "2",
    key: "title",
    label: "Brand Title",
    value: "EVERYDAY LIFE. RELAXED.",
  },

  {
    id: "3",
    key: "tagline",
    label: "Tagline",
    value: "Handmade for restful living",
  },

  {
    id: "4",
    key: "description",
    label: "Brand Description",
    value:
      "KEKAL creates modern garments using Ethiopian handmade fabrics and timeless craftsmanship.",
  },

  {
    id: "5",
    key: "announcement_text",
    label: "Announcement Text",
    value: "Free nationwide delivery on selected collections",
  },

  {
    id: "6",
    key: "copyright_text",
    label: "Copyright Text",
    value: "© 2026 KEKAL. All rights reserved.",
  },

  {
    id: "7",
    key: "home_hero_image",
    label: "Home Hero Image",
    value: heroImage,
  },

  {
    id: "8",
    key: "contact_hero_image",
    label: "Contact Hero Image",
    value: "",
  },

  {
    id: "9",
    key: "contact_cta_title",
    label: "Contact CTA Title",
    value: "Let's Create Something Together",
  },

  {
    id: "10",
    key: "contact_cta_description",
    label: "Contact CTA Description",
    value:
      "Reach out to discuss collections, collaborations, or custom opportunities.",
  },

  {
    id: "11",
    key: "about_cta_title",
    label: "About CTA Title",
    value: "Discover The Story Behind KEKAL",
  },

  {
    id: "12",
    key: "about_cta_description",
    label: "About CTA Description",
    value:
      "Learn about the people, values, and craftsmanship that shape every collection.",
  },
];