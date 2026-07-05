import { Link } from "react-router-dom";

import Seo from "../components/Seo";
import styles from "./NotFoundPage.module.css";

/**
 * Previously there was no catch-all route: an unmatched or since-deleted
 * URL (bad product/collection/event slug, typo, stale bookmark) rendered
 * nothing at all. This gives visitors — and crawlers — an actual page,
 * and is also reused inline whenever a detail page's slug doesn't resolve.
 */
export default function NotFoundPage() {
  return (
    <section className={styles.section}>
      {/* A SPA can't send a real HTTP 404 status, so we at least tell
          search engines not to index this URL. */}
      <Seo
        fallbackTitle="Page not found"
        fallbackDescription="This page could not be found."
        noindex
      />
      <p className={styles.code}>404</p>
      <h1>We couldn't find that page</h1>
      <p>
        The page you're looking for may have moved or no longer exists.
      </p>
      <Link to="/" className={styles.link}>
        Back to Home
      </Link>
    </section>
  );
}
