export interface AboutSection {
  title: string;

  content: string;

  images: string[];
}

export interface About {
  brandStory: AboutSection;

  craftProcess: AboutSection;

  visionImpact: AboutSection;

  closingImage: {
    image: string;

    alt: string;
  };

  contactCta: {
    title: string;

    description: string;

    buttonText: string;
  };
}
