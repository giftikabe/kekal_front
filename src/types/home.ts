export interface HeroContent {
  title: string;

  tagline: string;

  description: string;

  image: string;
}

export interface SectionContent {
  title: string;

  ctaText?: string;
}

export interface HomePageContent {
  hero: HeroContent;

  featuredCollections: SectionContent;

  designerSection: SectionContent;

  communityEventsSection: SectionContent;

  upcomingEventSection: SectionContent;
}