/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { eventsApi } from "../api";
import PageSeo from "../components/PageSeo";
import { LoadingScreen, NotFound } from "../components/States";
import styles from "./EventDetailPage.module.css";

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    eventsApi.getBySlug(slug)
      .then(async (e: any) => {
        setEvent(e);
        const rel = await eventsApi.getRelated(slug).catch(() => []);
        setRelated((rel as any[]).filter((r) => r.type === e.type).slice(0, 3));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (notFound || !event) return <NotFound />;

  const gallery = event.gallery || [];

  return (
    <>
      <PageSeo route={`/events/${slug}`} fallbackTitle={`${event.title} | KEKAL`} />

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroImgWrap}>
          <img src={event.featuredImage} alt={event.title} className={styles.heroImg} />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <p className={styles.heroCategory}>{event.category}</p>
          <h1 className={styles.heroTitle}>{event.title}</h1>
          <p className={styles.heroMeta}>{event.eventDate} · {event.location}</p>
          <p className={styles.heroOrg}>Organized by {event.organizer}</p>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <p className={styles.introText}>{event.intro}</p>
        </div>
      </section>

      {/* Featured Media */}
      <section className={styles.media}>
        <div className={styles.container}>
          {event.videoUrl ? (
            <div className={styles.videoWrap}>
              <iframe
                src={event.videoUrl}
                title={event.title}
                className={styles.video}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className={styles.mainImgWrap}>
              <img src={event.featuredImage} alt={event.title} className={styles.mainImg} />
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={styles.contentContainer}>
          <p className={styles.contentText}>{event.content}</p>
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className={styles.gallery}>
          <div className={styles.galleryGrid}>
            {gallery.map((img: string, i: number) => (
              <div key={i} className={styles.galleryImgWrap}>
                <img src={img} alt={`${event.title} ${i + 1}`} className={styles.galleryImg} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related Events */}
      {related.length > 0 && (
        <section className={styles.related}>
          <div className={styles.relatedContainer}>
            <h2 className={styles.relatedTitle}>Related Events</h2>
            <div className={styles.relatedGrid}>
              {related.map((e) => (
                <Link key={e.id} to={`/events/${e.slug}`} className={styles.relatedCard}>
                  <div className={styles.relatedImgWrap}>
                    <img src={e.featuredImage} alt={e.title} className={styles.relatedImg} loading="lazy" />
                  </div>
                  <p className={styles.relatedCategory}>{e.category}</p>
                  <p className={styles.relatedName}>{e.title}</p>
                  <p className={styles.relatedDate}>{e.eventDate}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
