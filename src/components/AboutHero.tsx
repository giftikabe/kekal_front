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
        <img src={image} alt={name} className={styles.image} />
      </div>
    </section>
  );
}
