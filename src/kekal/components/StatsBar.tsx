import styles from "./StatsBar.module.css";

interface StatsBarProps {
  stats: Array<{ id: string; value: string; label: string }>;
}

export default function StatsBar({ stats }: StatsBarProps) {
  if (stats.length === 0) return null;

  return (
    <div className={styles.bar}>
      <div className={styles.grid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.stat}>
            <span className={styles.value}>{stat.value}</span>
            <span className={styles.label}>{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}