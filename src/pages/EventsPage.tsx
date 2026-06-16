import CommunityEventsHero from "../components/CommunityEventsHero";
import UpcomingEvents from "../components/UpcomingEvents";
import EventArchive from "../components/EventsArchive";
import CommunityImpact from "../components/CommunityImpact";


import {
  getUpcomingEvents,
  getPastEvents,
  getCommunityImpactItems,
} from "../services/eventService";

export default function EventsPage() {
  const upcomingEvents = getUpcomingEvents();


  const pastEvents = getPastEvents();

  const communityImpactItems = getCommunityImpactItems();

  return (
    <>
      <CommunityEventsHero />

      <UpcomingEvents events={upcomingEvents} />

      <EventArchive events={pastEvents} />

      <CommunityImpact items={communityImpactItems} />
    </>
  );
}
