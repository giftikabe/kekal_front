/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { productsApi, collectionsApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import PageSeo from "../components/PageSeo";
import Btn from "../components/Btn";
import { LoadingScreen, NotFound } from "../components/States";
import styles from "./ProductDetailPage.module.css";

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getButtonLabel } = useSectionData("page-product-details");
  const [product, setProduct] = useState<any>(null);
  const [collection, setCollection] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [activeImg, setActiveImg] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const slideTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!slug) return;
    productsApi.getBySlug(slug)
      .then(async (p: any) => {
        setProduct(p);
        setSelectedColor(p.colors?.[0] || null);
        const allImgs = [p.mainImage, ...(p.gallery || [])].filter(Boolean);
        // Start slideshow
        if (allImgs.length > 1) {
          slideTimer.current = setInterval(() => {
            setActiveImg((prev) => (prev + 1) % allImgs.length);
          }, 10000);
        }
        const [col, rel] = await Promise.all([
          collectionsApi.getBySlug(p.collectionId).catch(() => null),
          productsApi.getByCollection(p.collectionId).catch(() => []),
        ]);
        setCollection(col);
        setRelated((rel as any[]).filter((r) => r.id !== p.id).slice(0, 4));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));

    return () => { if (slideTimer.current) clearInterval(slideTimer.current); };
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (notFound || !product) return <NotFound />;

  const allImages = [product.mainImage, ...(product.gallery || [])].filter(Boolean);

  const goTo = (i: number) => {
    setActiveImg(i);
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => setActiveImg((p) => (p + 1) % allImages.length), 10000);
  };

  return (
    <>
      <PageSeo route={`/products/${slug}`} fallbackTitle={`${product.name} | KEKAL`} />

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className={styles.breadcrumbInner}>
          {collection && <Link to={`/collections/${collection.slug}`} className={styles.breadLink}>{collection.name}</Link>}
          <span className={styles.breadSep}>·</span>
          <span className={styles.breadCurrent}>{product.name}</span>
        </div>
      </div>

      {/* Body */}
      <section className={styles.body}>
        <div className={styles.container}>
          {/* Left — Gallery */}
          <div className={styles.gallery}>
            {/* Main image */}
            <div className={styles.mainImgWrap} onClick={() => setFullscreen(true)}>
              <img
                src={allImages[activeImg]}
                alt={product.name}
                className={styles.mainImg}
              />
              <button className={styles.expandBtn} aria-label="View fullscreen">⤢</button>
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className={styles.thumbs}>
                {allImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    className={`${styles.thumb} ${i === activeImg ? styles.thumbActive : ""}`}
                    onClick={() => goTo(i)}
                    aria-label={`Image ${i + 1}`}
                  >
                    <img src={img} alt="" className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className={styles.details}>
            {collection && (
              <Link to={`/collections/${collection.slug}`} className={styles.collectionLink}>
                {collection.name}
              </Link>
            )}
            <h1 className={styles.productName}>{product.name}</h1>
            <p className={styles.availability}>
              {product.inStock ? "In Stock" : "Out of Stock"}
            </p>

            <p className={styles.description}>{product.description}</p>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Color{selectedColor ? <span className={styles.optionValue}> — {selectedColor}</span> : ""}</p>
                <div className={styles.colorSwatches}>
                  {product.colors.map((c: string) => (
                    <button
                      key={c}
                      className={`${styles.swatch} ${selectedColor === c ? styles.swatchActive : ""}`}
                      style={{ background: c, border: c === "#FFFFFF" ? "1px solid var(--color-line)" : "none" }}
                      onClick={() => setSelectedColor(c)}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Size</p>
                <div className={styles.sizeGrid}>
                  {product.sizes.map((s: string) => (
                    <button
                      key={s}
                      className={`${styles.sizeBtn} ${selectedSize === s ? styles.sizeBtnActive : ""}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.cta}>
              <Btn label="Enquire" to="/contact" variant="primary" fullWidth />
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedContainer}>
            <div className={styles.relatedHeader}>
              <h2 className={styles.relatedTitle}>From the Same Collection</h2>
              {related.length >= 4 && collection && (
                <Btn label={getButtonLabel("related_products", 0, "View Entire Collection")} to={`/collections/${collection.slug}`} variant="text" />
              )}
            </div>
            <div className={styles.relatedGrid}>
              {related.slice(0, 4).map((p) => (
                <Link key={p.id} to={`/products/${p.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImgWrap}>
                    <img src={p.mainImage} alt={p.name} className={styles.relatedImg} loading="lazy" />
                  </div>
                  <p className={styles.relatedName}>{p.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className={styles.fullscreen} onClick={() => setFullscreen(false)}>
          <button className={styles.closeBtn} aria-label="Close fullscreen">✕</button>
          <img src={allImages[activeImg]} alt={product.name} className={styles.fullscreenImg} />
          {allImages.length > 1 && (
            <>
              <button className={`${styles.fsNav} ${styles.fsPrev}`} onClick={(e) => { e.stopPropagation(); goTo((activeImg - 1 + allImages.length) % allImages.length); }}>‹</button>
              <button className={`${styles.fsNav} ${styles.fsNext}`} onClick={(e) => { e.stopPropagation(); goTo((activeImg + 1) % allImages.length); }}>›</button>
            </>
          )}
        </div>
      )}
    </>
  );
}
