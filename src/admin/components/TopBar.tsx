import { useLocation } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthContext";
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
  '/admin/database': 'Database Manager',
  // Add to PAGE_TITLES:
'/admin/component-library': 'Component Library',
'/admin/page-builder': 'Page Builder',
// Add to PAGE_TITLES:
'/admin/commerce': 'Commerce',


};

export default function TopBar() {
  const location = useLocation();
  const { user } = useAuthContext();

  const title = PAGE_TITLES[location.pathname] || "Dashboard";

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
