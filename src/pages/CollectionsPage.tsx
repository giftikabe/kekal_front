import CollectionsHero from "../components/CollectionsHero";
import CollectionsGrid from "../components/CollectionsGrid";

import { getCollectionsPage } from "../services/collectionsPageService";
import { getCollections } from "../services/collectionService";

export default function CollectionsPage() {
  const page = getCollectionsPage();

  const collections = getCollections();

  return (
    <>
      <CollectionsHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.title}
        description={page.hero.description}
      />

      <CollectionsGrid collections={collections} />
    </>
  );
}
