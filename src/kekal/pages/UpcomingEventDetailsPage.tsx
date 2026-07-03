import { useParams } from "react-router-dom";

import UpcomingEventHero from "../components/upcoming-event-detail/UpcomingEventHero";
import UpcomingEventContent from "../components/upcoming-event-detail/UpcomingEventContent";
import UpcomingEventInformation from "../components/upcoming-event-detail/UpcomingEventInformation";
import UpcomingEventCTA from "../components/upcoming-event-detail/UpcomingEventCTA";

import { useUpcomingEventBySlug } from "../hooks/useUpcomingEvents";

export default function UpcomingEventDetailPage() {
  const { slug } = useParams();

  const { data: event, loading } = useUpcomingEventBySlug(slug ?? "");

  if (loading) return null;
  if (!event) return <div>Upcoming event not found.</div>;

  const e = event as any;

  return (
    <>
      <UpcomingEventHero event={e} />

      <UpcomingEventContent content={e.content} />

      <UpcomingEventInformation event={e} />

      <UpcomingEventCTA
        ctaText={e.ctaText}
        registrationUrl={e.registrationUrl}
      />
    </>
  );
}
