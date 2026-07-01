import { useParams } from "react-router-dom";

import EventHero from "../components/EventHero";
import EventIntro from "../components/EventIntro";
import EventFeatureMedia from "../components/EventFeatureMedia";
import EventContent from "../components/EventContent";
import EventGallery from "../components/EventGallery";
import RelatedEvents from "../components/RelatedEvents";

import { useEventBySlug, useRelatedEvents } from "../hooks/useEvents";

export default function EventDetailsPage() {
  const { slug } = useParams();

  const { data: event, loading } = useEventBySlug(slug ?? "");

  // Related events use the slug (API endpoint: /events/:slug/related)
  const { data: relatedEvents } = useRelatedEvents(slug ?? "", 3);

  if (loading) return null;
  if (!event) return <p>Event not found.</p>;

  const e = event as any;

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
