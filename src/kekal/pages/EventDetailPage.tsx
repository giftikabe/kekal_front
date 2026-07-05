import { useParams } from "react-router-dom";

import EventHero from "../components/EventHero";
import EventIntro from "../components/EventIntro";
import EventFeatureMedia from "../components/EventFeatureMedia";
import EventContent from "../components/EventContent";
import EventGallery from "../components/EventGallery";
import RelatedEvents from "../components/RelatedEvents";
import Seo from "../components/Seo";
import NotFoundPage from "./NotFoundPage";

import { useEventBySlug, useRelatedEvents } from "../hooks/useEvents";

export default function EventDetailsPage() {
  const { slug } = useParams();

  const { data: event, loading } = useEventBySlug(slug ?? "");
  const { data: relatedEvents } = useRelatedEvents(slug ?? "", 3);

  if (loading) return null;
  if (!event) return <NotFoundPage />;

  const e = event as any;

  return (
    <>
      <Seo
        fallbackTitle={e.title}
        fallbackDescription={e.intro}
        fallbackImage={e.featuredImage}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: e.title,
          startDate: e.eventDate,
          location: {
            "@type": "Place",
            name: e.location,
          },
          organizer: {
            "@type": "Organization",
            name: e.organizer,
          },
          image: e.featuredImage || undefined,
          description: e.intro,
        }}
      />

      <EventHero event={e} />
      <EventIntro intro={e.intro} />
      <EventFeatureMedia image={e.featuredImage} title={e.title} videoUrl={e.videoUrl} />
      <EventContent content={e.content} />
      <EventGallery images={e.gallery ?? []} />
      <RelatedEvents title="Related Events" events={(relatedEvents as any[]) ?? []} />
    </>
  );
}
