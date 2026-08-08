import styles from "./CourseTeaserCards.module.css";

const COURSES = [
  {
    title: "Ethiopian Textile Heritage",
    description:
      "Explore the history, techniques, and cultural significance of handwoven Ethiopian fabrics.",
  },
  {
    title: "Contemporary Pattern Making",
    description:
      "Learn to create modern silhouettes inspired by traditional Ethiopian design principles.",
  },
  {
    title: "Garment Construction Fundamentals",
    description:
      "From fabric selection to final stitch — the complete process of crafting a KEKAL piece.",
  },
];

export default function CourseTeaserCards() {
  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {COURSES.map((course) => (
          <div key={course.title} className={styles.card}>
            <span className={styles.badge}>Upcoming</span>
            <h3 className={styles.title}>{course.title}</h3>
            <p className={styles.description}>{course.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}