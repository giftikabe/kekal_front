/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { eventsApi, upcomingEventsApi, brandApi } from "../api";
import { useSectionData } from "../hooks/useSectionData";
import SectionHeader from "../components/SectionHeader";
import PageSeo from "../components/PageSeo";
import { LoadingScreen } from "../components/States";
import styles from "./EventsPage.module.css";

const CATEGORIES = ["All", "exhibition", "bazaar", "workshop", "talk", "collaboration", "other"];

export default function EventsPage() {
  const { getSectionHeader } = useSectionData("page-events");
  const [heroMsg, setHeroMsg] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [community, setCommunity] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      brandApi.getMessageByKey("events_hero"),
      eventsApi.getPast(),
      eventsApi.getCommunityImpact(),
      upcomingEventsApi.getAll(),
    ]).then(([msg, e, c, u]) => {
      setHeroMsg(msg); setEvents(e as any[]); setCommunity(c as any[]); setUpcoming(u as any[]);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingScreen />;

  const filtered = activeCategory === "All" ? events : events.filter((e) => e.category === activeCategory);

  return (
    <>
      <PageSeo route="/events" fallbackTitle="Events | KEKAL" />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>{heroMsg?.title || getSectionHeader("hero", "Fashion Beyond the Studio")}</h1>
          {heroMsg?.description && <p className={styles.heroDesc}>{heroMsg.description}</p>}
        </div>
      </section>

      {/* Upcoming Event — reuse home banner style */}
      {upcoming.length > 0 && (
        <UpcomingBanner events={upcoming} sectionHeader={getSectionHeader("upcoming_events", "Upcoming Event")} />
      )}

      {/* Past Events */}
      {events.length > 0 && (
        <section className={styles.section}>
          <div className={styles.container}>
            <div className={styles.sectionTop}>
              <SectionHeader title={getSectionHeader("event_archive", "Event Archive")} />
              <div className={styles.filters}>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`${styles.filter} ${activeCategory === cat ? styles.filterActive : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.grid}>
              {filtered.map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className={styles.card}>
                  <div className={styles.imgWrap}>
                    <img src={e.featuredImage} alt={e.title} className={styles.img} loading="lazy" />
                  </div>
                  <div className={styles.cardMeta}>
                    <p className={styles.cardCategory}>{e.category}</p>
                    <h3 className={styles.cardTitle}>{e.title}</h3>
                    <p className={styles.cardDate}>{e.eventDate} · {e.location}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Community Impact */}
      {community.length > 0 && (
        <section className={styles.section} style={{ background: "var(--color-bone)" }}>
          <div className={styles.container}>
            <SectionHeader title={getSectionHeader("community_impact", "Community Impact")} />
            <div className={styles.communityGrid}>
              {community.map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className={styles.communityCard}>
                  <div className={styles.communityImgWrap}>
                    <img src={e.featuredImage} alt={e.title} className={styles.communityImg} loading="lazy" />
                  </div>
                  <div className={styles.communityText}>
                    <h3 className={styles.communityTitle}>{e.title}</h3>
                    <p className={styles.communityIntro}>{e.intro}</p>
                    <span className={styles.communityReadMore}>Read Story →</span>
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

function UpcomingBanner({ events, sectionHeader }: { events: any[]; sectionHeader: string }) {
  const [active, setActive] = useState(0);
  const e = events[active];
  return (
    <section className={styles.upcomingBanner}>
      <div className={styles.upcomingInner}>
        <p className={styles.upcomingLabel}>{sectionHeader}</p>
        <p className={styles.upcomingCat}>{e.category}</p>
        <h2 className={styles.upcomingTitle}>{e.title}</h2>
        <p className={styles.upcomingMeta}>{e.eventDate} · {e.location}</p>
        <p className={styles.upcomingIntro}>{e.intro}</p>
        <Link to={`/upcoming-events/${e.slug}`} className={styles.upcomingLink}>View Details →</Link>
        {events.length > 1 && (
          <div className={styles.dots}>
            {events.map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === active ? styles.dotActive : ""}`} onClick={() => setActive(i)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
