import { optimizeImageUrl } from "../utils/image";
import styles from "./AboutHero.module.css";

interface AboutHeroProps {
  name: string;
  image: string;
}

export default function AboutHero({ name, image }: AboutHeroProps) {
  return (
    <section className={styles.section}>
      <h1>{name}</h1>

      <div className={styles.imageContainer}>
        <img
          src={optimizeImageUrl(image, 900)}
          alt={name}
          className={styles.image}
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
