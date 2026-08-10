import { useLocation, matchPath } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthContext";
import { useCustomTables } from "../hooks/useCustomTables";
import styles from "./TopBar.module.css";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/collections": "Collections",
  "/admin/products": "Products",
  "/admin/events": "Events",
  "/admin/upcoming-events": "Upcoming Events",
  "/admin/brand": "Brand Settings",
  "/admin/pages": "Pages & SEO",
  "/admin/navigation": "Navigation",
  "/admin/users": "Users & Roles",
  "/admin/database": "Database Manager",
  "/admin/component-library": "Component Library",
  "/admin/page-builder": "Page Builder",
  "/admin/commerce": "Commerce",
};

export default function TopBar() {
  const location = useLocation();
  const { user } = useAuthContext();
  const { tables } = useCustomTables();

  // Check if we're on a dynamic custom-table data page.
  const dataRouteMatch = matchPath("/admin/database/:tableId", location.pathname);

  let title = PAGE_TITLES[location.pathname] ?? "Dashboard";

  if (dataRouteMatch) {
    const tableId = dataRouteMatch.params.tableId;
    const found = tables.find((t) => t.id === tableId);
    // Show the table's display name while it's loading, fall back gracefully.
    title = found ? found.displayName : "Database Manager";
  }

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>{title}</div>
      <div className={styles.right}>
        <span className={styles.badge}>
          {user?.isSuperAdmin ? "Super Admin" : "Admin"}
        </span>
      </div>
    </header>
  );
}