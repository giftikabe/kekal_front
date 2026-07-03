import CollectionsHero from "../components/collections/CollectionsHero";
import CollectionsGrid from "../components/collections/CollectionsGrid";

import { useCollections } from "../hooks/useCollections";
import { useBrandIdentityByKey, useBrandMessageByKey } from "../hooks/useBrand";
import { useSectionByPageAndName } from "../hooks/usePages";

export default function CollectionsPage() {
  const { data: collections } = useCollections();

  // ─── Collections Hero ──────────────────────────────────────────────────────
  const { data: heroSection } = useSectionByPageAndName("page-collections", "hero");
  const { value: eyebrow } = useBrandIdentityByKey("name");
  const { data: collectionsHero } = useBrandMessageByKey("collections_hero");

  return (
    <>
      <CollectionsHero
        eyebrow={eyebrow}
        title={(heroSection as any)?.sectionHeader ?? "Collections"}
        description={(collectionsHero as any)?.description ?? ""}
      />

      <CollectionsGrid collections={(collections as any[]) ?? []} />
    </>
  );
}
