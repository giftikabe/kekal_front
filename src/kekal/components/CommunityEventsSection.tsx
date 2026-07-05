import SectionHeader from "./SectionHeader";
import EventCard from "./EventCard";

import styles from "./CommunityEventsSection.module.css";

interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  featuredImage: string;
  eventDate: string;
}

interface CommunityEventsSectionProps {
  title: string;
  events: CommunityEvent[];
}

export default function CommunityEventsSection({
  title,
  events,
}: CommunityEventsSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className={styles.section}>
      <SectionHeader title={title} />

      <div className={styles.grid}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
