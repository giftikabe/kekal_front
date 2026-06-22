import type { HomeValue } from "../types/home";

import styles from "./HomeValueCards.module.css";

interface HomeValueCardsProps {
  values: HomeValue[];
}

export default function HomeValueCards({ values }: HomeValueCardsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {values.map((item) => (
          <article key={item.title} className={styles.card}>
            <div className={styles.icon}>{item.icon}</div>

            <div>
              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
