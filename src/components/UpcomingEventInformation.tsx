import type { UpcomingEvent } from "../database-types/upcomingEvent";

import styles from "./UpcomingEventInformation.module.css";

interface UpcomingEventInformationProps {
  event: UpcomingEvent;
}

export default function UpcomingEventInformation({
  event,
}: UpcomingEventInformationProps) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        <div>
          <h3>Date</h3>
          <p>{event.eventDate}</p>
        </div>

        <div>
          <h3>Location</h3>
          <p>{event.location}</p>
        </div>

        <div>
          <h3>Organizer</h3>
          <p>{event.organizer}</p>
        </div>
      </div>
    </section>
  );
}
