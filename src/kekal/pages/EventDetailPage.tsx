import { useParams } from "react-router-dom";

import EventHero from "../components/event-detail/EventHero";
import EventIntro from "../components/event-detail/EventIntro";
import EventFeatureMedia from "../components/event-detail/EventFeatureMedia";
import EventContent from "../components/event-detail/EventContent";
import EventGallery from "../components/event-detail/EventGallery";
import RelatedEvents from "../components/event-detail/RelatedEvents";

import { useEventBySlug, useRelatedEvents } from "../hooks/useEvents";

import Seo from "../components/common/Seo";


export default function EventDetailsPage() {
  const { slug } = useParams();

  const { data: event, loading } = useEventBySlug(slug ?? "");

  // Related events use the slug (API endpoint: /events/:slug/related)
  const { data: relatedEvents } = useRelatedEvents(slug ?? "", 3);

  if (loading) return null;
  if (!event) return <p>Event not found.</p>;

  const e = event as any;

  <Seo
    fallbackTitle={e.title}
    fallbackDescription={e.intro}
    fallbackImage={e.featuredImage}
    jsonLd={{
      "@context": "https://schema.org",
      "@type": "Event",
      name: e.title,
      startDate: e.eventDate,
      location: { "@type": "Place", name: e.location },
      image: e.featuredImage,
    }}
  />;

  return (
    <>
      <EventHero event={e} />

      <EventIntro intro={e.intro} />

      <EventFeatureMedia
        image={e.featuredImage}
        title={e.title}
        videoUrl={e.videoUrl}
      />

      <EventContent content={e.content} />

      <EventGallery images={e.gallery} />

      <RelatedEvents
        title="Related Events"
        events={(relatedEvents as any[]) ?? []}
      />
    </>
  );
}
