export interface HeroContent {
  name: string;

  title: string;

  tagline: string;

  description: string;

  image: string;
}

export interface HomeValue {
  icon: string;

  title: string;

  description: string;
}

export interface SectionContent {
  title: string;

  ctaText?: string;
}

export interface HomePageContent {
  hero: HeroContent;

  values: HomeValue[];

  featuredCollections: SectionContent;

  designerSection: SectionContent;

  communityEventsSection: SectionContent;

  upcomingEventSection: SectionContent;
}
