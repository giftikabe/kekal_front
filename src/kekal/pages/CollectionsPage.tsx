import CollectionsHero from "../components/CollectionsHero";
import CollectionsGrid from "../components/CollectionsGrid";
import Seo from "../components/Seo";

import { useCollections } from "../hooks/useCollections";
import { useBrandIdentityByKey, useBrandMessageByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

interface PageSectionData {
  sectionHeader?: string;
}
interface BrandMessageData {
  description?: string;
}

export default function CollectionsPage() {
  const { data: collections } = useCollections();

  const { data: heroSection } = useSectionByPageAndName("page-collections", "hero");
  const { value: eyebrow } = useBrandIdentityByKey("name");
  const { data: collectionsHero } = useBrandMessageByKey("collections_hero");

  const hero = heroSection as PageSectionData | null;
  const message = collectionsHero as BrandMessageData | null;
  const list = (collections as any[]) ?? [];

  return (
    <>
      <Seo
        fallbackTitle="Collections"
        fallbackDescription={message?.description}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: hero?.sectionHeader ?? "Collections",
        }}
      />

      <CollectionsHero
        eyebrow={eyebrow}
        title={hero?.sectionHeader ?? "Collections"}
        description={message?.description ?? ""}
      />

      <CollectionsGrid collections={list} />
    </>
  );
}
