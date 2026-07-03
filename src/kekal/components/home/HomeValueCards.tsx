import * as LucideIcons from "lucide-react";

import type { BrandValue } from "../database-types/brandValue";

import styles from "./HomeValueCards.module.css";

interface HomeValueCardsProps {
  values: BrandValue[];
}

export default function HomeValueCards({ values }: HomeValueCardsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {values.map((item) => {
          const Icon = LucideIcons[item.icon as keyof typeof LucideIcons] as React.ElementType;

          return (
            <article key={item.id} className={styles.card}>
              <div className={styles.icon}>
                {Icon ? <Icon size={24} /> : null}
              </div>

              <div>
                <h3>{item.title}</h3>

                <p>{item.description}</p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
