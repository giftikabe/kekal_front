import { useParams } from "react-router-dom";

import UpcomingEventHero from "../components/UpcomingEventHero";
import UpcomingEventContent from "../components/UpcomingEventContent";
import UpcomingEventInformation from "../components/UpcomingEventInformation";
import UpcomingEventCTA from "../components/UpcomingEventCTA";

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
