import CollectionsHero from "../components/CollectionsHero";
import CollectionsGrid from "../components/CollectionsGrid";

import { getCollections } from "../services/collectionService";
import { getBrandIdentityByKey } from "../database-services/brandIdentityService";
import { getBrandMessageByKey } from "../database-services/brandMessageService";
import { getSectionByPageAndName } from "../database-services/pageSectionService";

export default function CollectionsPage() {
  const collections = getCollections();

  // ─── Collections Hero ──────────────────────────────────────────────────────
  const heroSection = getSectionByPageAndName("page-collections", "hero");
  const eyebrow = getBrandIdentityByKey("name");
  const collectionsHero = getBrandMessageByKey("collections_hero");

  return (
    <>
      <CollectionsHero
        eyebrow={eyebrow}
        title={heroSection?.sectionHeader ?? "Collections"}
        description={collectionsHero?.description ?? ""}
      />

      <CollectionsGrid collections={collections} />
    </>
  );
}
