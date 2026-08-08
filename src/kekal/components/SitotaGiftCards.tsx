import { Link } from "react-router-dom";
import styles from "./SitotaGiftCards.module.css";

interface GiftCard {
  title: string;
  description: string;
  href: string;
}

interface SitotaGiftCardsProps {
  cards?: GiftCard[];
}

const DEFAULT_CARDS: GiftCard[] = [
  {
    title: "For New Beginnings",
    description:
      "Handcrafted pieces celebrating new life, prepared with intention for your most precious moments.",
    href: "/collections",
  },
  {
    title: "For Celebrations",
    description:
      "Mark birthdays, weddings, and milestones with garments that carry the warmth of Ethiopian craft.",
    href: "/collections",
  },
  {
    title: "For Her",
    description:
      "Thoughtfully designed pieces, chosen with care, ready to be given and treasured.",
    href: "/collections",
  },
];

export default function SitotaGiftCards({ cards = DEFAULT_CARDS }: SitotaGiftCardsProps) {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {cards.map((card) => (
          <Link key={card.title} to={card.href} className={styles.card}>
            <div className={styles.imageWrap}>
              <div className={styles.image} style={{ background: "var(--color-bone)" }} />
            </div>
            <div className={styles.content}>
              <h3 className={styles.title}>{card.title}</h3>
              <p className={styles.description}>{card.description}</p>
              <span className={styles.link}>Explore</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

