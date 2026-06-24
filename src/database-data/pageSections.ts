import type { PageSection } from "../database-types/pageSection";

export const pageSections: PageSection[] = [
  // ─── Home Page ────────────────────────────────────────────────────────────────
  {
    id: "section-home-hero",
    pageId: "page-home",
    sectionName: "hero",
    sectionHeader: "",
    buttonLabels: ["Explore Collection", "Our Story"],
  },
  
  {
    id: "section-home-featured-collections",
    pageId: "page-home",
    sectionName: "featured_collections",
    sectionHeader: "Featured Collections",
    buttonLabels: [],
  },
  {
    id: "section-home-designer",
    pageId: "page-home",
    sectionName: "designer_section",
    sectionHeader: "Meet The Designer",
    buttonLabels: ["Read More →"],
  },
  {
    id: "section-home-community-events",
    pageId: "page-home",
    sectionName: "community_events",
    sectionHeader: "Community & Events",
    buttonLabels: [],
  },
  {
    id: "section-home-upcoming-event",
    pageId: "page-home",
    sectionName: "upcoming_event",
    sectionHeader: "Upcoming Event",
    buttonLabels: ["Learn More →"],
  },

  // ─── About Page ───────────────────────────────────────────────────────────────
 {
    id: "section-about-designer-story",
    pageId: "page-about",
    sectionName: "designer_story",
    sectionHeader: "The Designer",
    buttonLabels: [],
  },
  
  {
    id: "section-about-brand-story",
    pageId: "page-about",
    sectionName: "brand_story",
    sectionHeader: "Brand Story",
    buttonLabels: [],
  },
  {
    id: "section-about-craft-process",
    pageId: "page-about",
    sectionName: "craft_process",
    sectionHeader: "Craft Process",
    buttonLabels: [],
  },
  {
    id: "section-about-vision-impact",
    pageId: "page-about",
    sectionName: "vision_impact",
    sectionHeader: "Vision & Impact",
    buttonLabels: [],
  },
  {
    id: "section-about-contact-cta",
    pageId: "page-about",
    sectionName: "contact_cta",
    sectionHeader: "Let's Create Together",
    buttonLabels: ["Contact"],
  },

  // ─── Collections Page ─────────────────────────────────────────────────────────
  {
    id: "section-collections-hero",
    pageId: "page-collections",
    sectionName: "hero",
    sectionHeader: "Collections",
    buttonLabels: [],
  },

  // ─── Collection Details Page ──────────────────────────────────────────────────
  {
    id: "section-collection-details-story",
    pageId: "page-collection-details",
    sectionName: "collection_story",
    sectionHeader: "Collection Story",
    buttonLabels: [],
  },
  {
    id: "section-collection-details-products",
    pageId: "page-collection-details",
    sectionName: "products",
    sectionHeader: "Products",
    buttonLabels: [],
  },

  // ─── Product Details Page ─────────────────────────────────────────────────────
  {
    id: "section-product-details-related",
    pageId: "page-product-details",
    sectionName: "related_products",
    sectionHeader: "Related Products",
    buttonLabels: ["View Entire Collection →"],
  },

  
  // ─── Contact Page ─────────────────────────────────────────────────────────────
  {
    id: "section-contact-hero",
    pageId: "page-contact",
    sectionName: "hero",
    sectionHeader: "Contact",
    buttonLabels: [],
  },
  {
    id: "section-contact-form",
    pageId: "page-contact",
    sectionName: "contact_form",
    sectionHeader: "Contact Form",
    buttonLabels: ["Send"],
  },
  {
    id: "section-contact-details",
    pageId: "page-contact",
    sectionName: "contact_details",
    sectionHeader: "Direct Contact",
    buttonLabels: [],
  },
 
  // ─── Events Page ──────────────────────────────────────────────────────────────
  {
    id: "section-events-hero",
    pageId: "page-events",
    sectionName: "hero",
    sectionHeader: "Fashion Beyond the Studio",
    buttonLabels: [],
  },
  {
    id: "section-events-upcoming",
    pageId: "page-events",
    sectionName: "upcoming_events",
    sectionHeader: "Upcoming Event",
    buttonLabels: [],
  },
  {
    id: "section-events-archive",
    pageId: "page-events",
    sectionName: "event_archive",
    sectionHeader: "Event Archive",
    buttonLabels: [],
  },
  {
    id: "section-events-community-impact",
    pageId: "page-events",
    sectionName: "community_impact",
    sectionHeader: "Community Impact",
    buttonLabels: ["View Story"],
  },
];