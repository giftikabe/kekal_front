import { useParams } from "react-router-dom";

import UpcomingEventHero from "../components/UpcomingEventHero";
import UpcomingEventContent from "../components/UpcomingEventContent";
import UpcomingEventInformation from "../components/UpcomingEventInformation";
import UpcomingEventCTA from "../components/UpcomingEventCTA";
import Seo from "../components/Seo";
import NotFoundPage from "./NotFoundPage";

import { useUpcomingEventBySlug } from "../hooks/useUpcomingEvents";

export default function UpcomingEventDetailPage() {
  const { slug } = useParams();

  const { data: event, loading } = useUpcomingEventBySlug(slug ?? "");

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
          eventStatus: "https://schema.org/EventScheduled",
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

      <UpcomingEventHero event={e} />
      <UpcomingEventContent content={e.content} />
      <UpcomingEventInformation event={e} />
      <UpcomingEventCTA ctaText={e.ctaText} registrationUrl={e.registrationUrl} />
    </>
  );
}
