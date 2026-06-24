import type { Event } from "../database-types/event";

import SectionHeader from "./SectionHeader";
import EventCard from "./EventCard";

import styles from "./CommunityEventsSection.module.css";

interface CommunityEventsSectionProps {
  title: string;

  events: Event[];
}

export default function CommunityEventsSection({
  title,
  events,
}: CommunityEventsSectionProps) {
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
