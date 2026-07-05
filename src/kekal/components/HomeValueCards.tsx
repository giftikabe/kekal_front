import * as LucideIcons from "lucide-react";

import styles from "./HomeValueCards.module.css";

interface BrandValueItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface HomeValueCardsProps {
  values: BrandValueItem[];
}

export default function HomeValueCards({ values }: HomeValueCardsProps) {
  if (values.length === 0) return null;

  return (
    <section className={styles.section} aria-label="Why shop with us">
      <div className={styles.grid}>
        {values.map((item) => {
          const Icon = LucideIcons[
            item.icon as keyof typeof LucideIcons
          ] as React.ElementType | undefined;

          return (
            <article key={item.id} className={styles.card}>
              <div className={styles.icon} aria-hidden="true">
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
