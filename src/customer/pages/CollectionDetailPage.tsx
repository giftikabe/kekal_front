/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collectionsApi, productsApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import SectionHeader from "../components/SectionHeader";
import PageSeo from "../components/PageSeo";
import { LoadingScreen, NotFound } from "../components/States";
import styles from "./CollectionDetailPage.module.css";

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getSectionHeader } = useSectionData("page-collection-details");
  const [collection, setCollection] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    collectionsApi.getBySlug(slug)
      .then(async (c: any) => {
        setCollection(c);
        const p = await productsApi.getByCollection(c.id);
        setProducts(p as any[]);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (notFound || !collection) return <NotFound />;

  return (
    <>
      <PageSeo route={`/collections/${slug}`} fallbackTitle={`${collection.name} | KEKAL`} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <img src={collection.coverImage} alt={collection.name} className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroYear}>{collection.releaseYear}</p>
          <h1 className={styles.heroTitle}>{collection.name}</h1>
        </div>
      </section>

      {/* Description */}
      <section className={styles.desc}>
        <div className={styles.container}>
          <SectionHeader title={getSectionHeader("collection_story", "Collection Story")} />
          <p className={styles.descText}>{collection.description}</p>
        </div>
      </section>

      {/* Products */}
      {products.length > 0 && (
        <section className={styles.products}>
          <div className={styles.container}>
            <SectionHeader title={getSectionHeader("products", "Products")} />
            <div className={styles.grid}>
              {products.map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className={styles.productCard}>
                  <div className={styles.productImgWrap}>
                    <img src={p.mainImage} alt={p.name} className={styles.productImg} loading="lazy" />
                    {!p.inStock && <span className={styles.soldOut}>Sold Out</span>}
                  </div>
                  <p className={styles.productName}>{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
