import { useParams } from "react-router-dom";

import EventHero from "../components/EventHero";
import EventIntro from "../components/EventIntro";
import EventFeatureMedia from "../components/EventFeatureMedia";
import EventContent from "../components/EventContent";
import EventGallery from "../components/EventGallery";
import RelatedEvents from "../components/RelatedEvents";

import { getEventBySlug, getRelatedEvents } from "../database-services/eventService";

export default function EventDetailsPage() {
  const { slug } = useParams();

  const event = getEventBySlug(slug ?? "");

  if (!event) {
    return <p>Event not found.</p>;
  }

  const relatedEvents = getRelatedEvents(event.id, 3);

  return (
    <>
      <EventHero event={event} />

      <EventIntro intro={event.intro} />

      <EventFeatureMedia
        image={event.featuredImage}
        title={event.title}
        videoUrl={event.videoUrl}
      />

      <EventContent content={event.content} />

      <EventGallery images={event.gallery} />

      <RelatedEvents title="Related Events" events={relatedEvents} />
    </>
  );
}
