import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthContext";
import { collectionsApi } from "../api/client";
import { productsApi } from "../api/client";
import { eventsApi } from "../api/client";
import { upcomingEventsApi } from "../api/client";
import styles from "./DashboardPage.module.css";

export default function DashboardPage() {
  const { user, canAccess } = useAuthContext();
  const [counts, setCounts] = useState({
    collections: 0,
    products: 0,
    events: 0,
    upcomingEvents: 0,
  });

  useEffect(() => {
    const load = async () => {
      const results = await Promise.allSettled([
        canAccess("collections") ? collectionsApi.getAll() : Promise.resolve([]),
        canAccess("products") ? productsApi.getAll() : Promise.resolve([]),
        canAccess("events") ? eventsApi.getAll() : Promise.resolve([]),
        canAccess("upcoming_events") ? upcomingEventsApi.getAll() : Promise.resolve([]),
      ]);

      setCounts({
        collections: results[0].status === "fulfilled" ? (results[0].value as any[]).length : 0,
        products: results[1].status === "fulfilled" ? (results[1].value as any[]).length : 0,
        events: results[2].status === "fulfilled" ? (results[2].value as any[]).length : 0,
        upcomingEvents: results[3].status === "fulfilled" ? (results[3].value as any[]).length : 0,
      });
    };
    load();
  }, [canAccess]);

  const STATS = [
    { label: "Collections", value: counts.collections, path: "/admin/collections", entity: "collections" },
    { label: "Products", value: counts.products, path: "/admin/products", entity: "products" },
    { label: "Events", value: counts.events, path: "/admin/events", entity: "events" },
    { label: "Upcoming Events", value: counts.upcomingEvents, path: "/admin/upcoming-events", entity: "upcoming_events" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.greeting}>
        <h1 className={styles.title}>
          Welcome back{user?.isSuperAdmin ? ", Super Admin" : ""}.
        </h1>
        <p className={styles.sub}>Here's an overview of your content.</p>
      </div>

      <div className={styles.stats}>
        {STATS.filter((s) => canAccess(s.entity)).map((stat) => (
          <Link key={stat.label} to={stat.path} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </Link>
        ))}
      </div>

      <div className={styles.quickLinks}>
        <h2 className={styles.sectionTitle}>Quick Actions</h2>
        <div className={styles.links}>
          {canAccess("collections") && (
            <Link to="/admin/collections" className={styles.link}>
              <span className={styles.linkIcon}>◫</span>
              <span>Manage Collections</span>
            </Link>
          )}
          {canAccess("products") && (
            <Link to="/admin/products" className={styles.link}>
              <span className={styles.linkIcon}>◻</span>
              <span>Manage Products</span>
            </Link>
          )}
          {canAccess("events") && (
            <Link to="/admin/events" className={styles.link}>
              <span className={styles.linkIcon}>◷</span>
              <span>Manage Events</span>
            </Link>
          )}
          {canAccess("brand") && (
            <Link to="/admin/brand" className={styles.link}>
              <span className={styles.linkIcon}>◆</span>
              <span>Brand Settings</span>
            </Link>
          )}
          {canAccess("pages") && (
            <Link to="/admin/pages" className={styles.link}>
              <span className={styles.linkIcon}>◱</span>
              <span>Pages & SEO</span>
            </Link>
          )}
          {user?.isSuperAdmin && (
            <Link to="/admin/users" className={styles.link}>
              <span className={styles.linkIcon}>◎</span>
              <span>Users & Roles</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
