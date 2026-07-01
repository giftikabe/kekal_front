/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collectionsApi, brandApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import PageSeo from "../components/PageSeo";
import { LoadingScreen } from "../components/States";
import styles from "./CollectionsPage.module.css";

export default function CollectionsPage() {
  const { getSectionHeader } = useSectionData("page-collections");
  const [collections, setCollections] = useState<any[]>([]);
  const [heroMsg, setHeroMsg] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      collectionsApi.getLatest(),
      brandApi.getMessageByKey("collections_hero"),
    ]).then(([c, msg]) => {
      setCollections(c as any[]);
      setHeroMsg(msg);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  return (
    <>
      <PageSeo route="/collections" fallbackTitle="Collections | KEKAL" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{heroMsg?.title || getSectionHeader("hero", "Collections")}</h1>
          {heroMsg?.description && <p className={styles.heroDesc}>{heroMsg.description}</p>}
        </div>
      </section>

      {/* Grid */}
      <section className={styles.listing}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {collections.map((c) => (
              <Link key={c.id} to={`/collections/${c.slug}`} className={styles.card}>
                <div className={styles.imgWrap}>
                  <img src={c.coverImage} alt={c.name} className={styles.img} loading="lazy" />
                  <span className={`${styles.statusBadge} ${c.status === "current" ? styles.badgeCurrent : styles.badgeArchive}`}>
                    {c.status}
                  </span>
                </div>
                <div className={styles.meta}>
                  <span className={styles.name}>{c.name}</span>
                  <span className={styles.year}>{c.releaseYear}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
