import { useParams } from "react-router-dom";

import UpcomingEventHero from "../components/UpcomingEventHero";
import UpcomingEventContent from "../components/UpcomingEventContent";
import UpcomingEventInformation from "../components/UpcomingEventInformation";
import UpcomingEventCTA from "../components/UpcomingEventCTA";

import { getUpcomingEventBySlug } from "../database-services/upcomingEventService";

export default function UpcomingEventDetailPage() {
  const { slug } = useParams();

  const event = slug ? getUpcomingEventBySlug(slug) : undefined;

  if (!event) {
    return <div>Upcoming event not found.</div>;
  }

  return (
    <>
      <UpcomingEventHero event={event} />

      <UpcomingEventContent content={event.content} />

      <UpcomingEventInformation event={event} />

      <UpcomingEventCTA
        ctaText={event.ctaText}
        registrationUrl={event.registrationUrl}
      />
    </>
  );
}
