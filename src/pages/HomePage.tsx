import Hero from "../components/Hero";
import FeaturedCollections from "../components/FeaturedCollections";

import { getHomePageContent } from "../services/homeService";
import { getFeaturedCollections } from "../services/collectionService";

export default function HomePage() {
  const homePageContent = getHomePageContent();

  const featuredCollections =
    getFeaturedCollections();

  return (
    <>
      <Hero
        title={homePageContent.hero.title}
        tagline={homePageContent.hero.tagline}
        description={homePageContent.hero.description}
        image={homePageContent.hero.image}
      />

      <FeaturedCollections
        collections={featuredCollections}
      />
    </>
  );
}