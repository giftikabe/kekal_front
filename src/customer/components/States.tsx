import styles from "./States.module.css";

export function LoadingScreen() {
  return (
    <div className={styles.screen}>
      <span className={styles.dot} />
      <span className={styles.dot} />
      <span className={styles.dot} />
    </div>
  );
}

export function ErrorScreen({ message }: { message?: string }) {
  return (
    <div className={styles.screen}>
      <p className={styles.errorText}>{message || "Something went wrong."}</p>
    </div>
  );
}

export function NotFound() {
  return (
    <div className={styles.screen}>
      <p className={styles.notFoundNum}>404</p>
      <p className={styles.notFoundText}>Page not found.</p>
    </div>
  );
}
