import { useParams } from "react-router-dom";

import CollectionHero from "../components/CollectionHero";
import CollectionStorySection from "../components/CollectionStorySection";
import ProductsGrid from "../components/ProductsGrid";

import { getCollectionBySlug } from "../services/collectionService";

import { getProductsByCollection } from "../services/productService";

export default function CollectionDetailsPage() {
  const { slug } = useParams();

  const collection = getCollectionBySlug(slug ?? "");

  if (!collection) {
    return <p>Collection not found.</p>;
  }

  const products = getProductsByCollection(collection.id);

  return (
    <>
      <CollectionHero collection={collection} />

      <CollectionStorySection description={collection.description} />

      <ProductsGrid products={products} />
    </>
  );
}
