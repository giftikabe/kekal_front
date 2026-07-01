/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { brandApi, collectionsApi, eventsApi, upcomingEventsApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import { useBrand } from "../hooks/useBrand";
import SectionHeader from "../components/SectionHeader";
import Btn from "../components/Btn";
import PageSeo from "../components/PageSeo";
import { LoadingScreen } from "../components/States";
import styles from "./HomePage.module.css";

export default function HomePage() {
  const { identity } = useBrand();
  const { getSectionHeader, getButtonLabel } = useSectionData("page-home");
  const [values, setValues] = useState<any[]>([]);
  const [featured, setFeatured] = useState<any[]>([]);
  const [designer, setDesigner] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [community, setCommunity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      brandApi.getValues(),
      collectionsApi.getFeatured(),
      brandApi.getDesignerProfile(),
      upcomingEventsApi.getAll(),
      eventsApi.getCommunityImpact(),
    ]).then(([v, f, d, u, c]) => {
      setValues(v as any[]); setFeatured(f as any[]);
      setDesigner(d as any[]); setUpcoming(u as any[]); setCommunity(c as any[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const get = (arr: any[], key: string) => arr.find((i) => i.key === key)?.value || "";

  const heroImage = identity["home_hero_image"] || "";
  const heroTitle = identity["title"] || "EVERYDAY LIFE. RELAXED";
  const heroDesc = identity["description"] || "";

  return (
    <>
      <PageSeo route="/" fallbackTitle="KEKAL | Handmade for Restful Living" />

      {/* ─── Hero ─── */}
      <section className={styles.hero} style={{ backgroundImage: heroImage ? `url(${heroImage})` : undefined }}>
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroDesc}>{heroDesc}</p>
          <div className={styles.heroBtns}>
            <Btn label={getButtonLabel("hero", 0, "Explore Collection")} to="/collections" variant="primary" />
            <Btn label={getButtonLabel("hero", 1, "Our Story")} to="/about" variant="ghost" />
          </div>
        </div>
      </section>

      {/* ─── Brand Values ─── */}
      {values.length > 0 && (
        <section className={styles.values}>
          <div className={styles.valuesGrid}>
            {values.map((v) => (
              <div key={v.id} className={styles.valueCard}>
                <p className={styles.valueTitle}>{v.title}</p>
                <p className={styles.valueDesc}>{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Featured Collections ─── */}
      {featured.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeader title={getSectionHeader("featured_collections", "Featured Collections")} />
            <div className={`${styles.collectionGrid} ${featured.length < 4 ? styles.collectionGridCenter : ""}`}>
              {featured.map((c) => (
                <Link key={c.id} to={`/collections/${c.slug}`} className={styles.collectionCard}>
                  <div className={styles.collectionImgWrap}>
                    <img src={c.coverImage} alt={c.name} className={styles.collectionImg} loading="lazy" />
                  </div>
                  <div className={styles.collectionMeta}>
                    <span className={styles.collectionName}>{c.name}</span>
                    <span className={styles.collectionYear}>{c.releaseYear}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Designer Section ─── */}
      <section className={styles.designerSection}>
        <div className={styles.container}>
          <div className={styles.designerGrid}>
            <div className={styles.designerImgWrap}>
              <img src={get(designer, "portrait")} alt={get(designer, "name")} className={styles.designerImg} loading="lazy" />
            </div>
            <div className={styles.designerContent}>
              <p className={styles.designerLabel}>{getSectionHeader("designer_section", "Meet The Designer")}</p>
              <h2 className={styles.designerName}>{get(designer, "name")}</h2>
              <p className={styles.designerTitle}>{get(designer, "title")}</p>
              <p className={styles.designerBio}>{get(designer, "short_bio")}</p>
              <Btn label={getButtonLabel("designer_section", 0, "Read More")} to="/about" variant="text" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Upcoming Event Banner ─── */}
      {upcoming.length > 0 && (
        <UpcomingEventBanner events={upcoming} sectionHeader={getSectionHeader("upcoming_event", "Upcoming Event")} />
      )}

      {/* ─── Community Events ─── */}
      {community.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <SectionHeader title={getSectionHeader("community_events", "Community & Events")} />
            <div className={styles.communityGrid}>
              {community.slice(0, 4).map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className={styles.communityCard}>
                  <div className={styles.communityImgWrap}>
                    <img src={e.featuredImage} alt={e.title} className={styles.communityImg} loading="lazy" />
                  </div>
                  <div className={styles.communityMeta}>
                    <p className={styles.communityTitle}>{e.title}</p>
                    <p className={styles.communityDate}>{e.eventDate}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ─── Upcoming Event Banner ─────────────────────────────────────────────────────
function UpcomingEventBanner({ events, sectionHeader }: { events: any[]; sectionHeader: string }) {
  const [active, setActive] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (events.length <= 1) return;
    timer.current = setInterval(() => setActive((p) => (p + 1) % events.length), 10000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [events.length]);

  const e = events[active];

  return (
    <section className={styles.upcoming}>
      <div className={styles.upcomingInner}>
        <p className={styles.upcomingEyebrow}>{sectionHeader}</p>
        <p className={styles.upcomingCategory}>{e.category}</p>
        <h2 className={styles.upcomingTitle}>{e.title}</h2>
        <p className={styles.upcomingMeta}>{e.eventDate} · {e.location}</p>
        <p className={styles.upcomingIntro}>{e.intro}</p>
        <div className={styles.upcomingBtns}>
          <Btn label="View Details" to={`/upcoming-events/${e.slug}`} variant="ghost" />
          {e.registrationUrl && e.registrationUrl !== "#" && (
            <Btn label={e.ctaText || "Register"} href={e.registrationUrl} variant="primary" />
          )}
        </div>
        {events.length > 1 && (
          <div className={styles.dots}>
            {events.map((_, i) => (
              <button
                key={i}
                className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
                onClick={() => { setActive(i); if (timer.current) clearInterval(timer.current); }}
                aria-label={`Event ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
