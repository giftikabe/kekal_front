/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { upcomingEventsApi } from "../api";
import Btn from "../components/Btn";
import PageSeo from "../components/PageSeo";
import { LoadingScreen, NotFound } from "../components/States";
import styles from "./UpcomingEventDetailPage.module.css";

export default function UpcomingEventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    upcomingEventsApi.getBySlug(slug)
      .then((e: any) => setEvent(e))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <LoadingScreen />;
  if (notFound || !event) return <NotFound />;

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
          <p className={styles.label}>Upcoming Event</p>
          <p className={styles.category}>{event.category}</p>
          <h1 className={styles.title}>{event.title}</h1>
          <p className={styles.meta}>{event.eventDate} · {event.location}</p>
          <p className={styles.organizer}>Organized by {event.organizer}</p>
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.container}>
          <p className={styles.introText}>{event.intro}</p>
        </div>
      </section>

      {/* Content */}
      <section className={styles.content}>
        <div className={styles.contentContainer}>
          <p className={styles.contentText}>{event.content}</p>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Interested in attending?</h2>
          <div className={styles.ctaBtns}>
            <Btn label={event.ctaText || "Register Now"} href={event.registrationUrl || "#"} variant="primary" />
            <Btn label="View All Events" to="/events" variant="ghost" />
          </div>
        </div>
      </section>
    </>
  );
}
