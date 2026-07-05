import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Box,
  CalendarDays,
  CalendarClock,
  Palette,
  FileText,
  Compass,
  Users,
  LogOut,
} from "lucide-react";
import { useAuthContext } from "../hooks/AuthContext";
import BrandHeader from "./BrandHeader";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  {
    section: "Content",
    items: [
      { label: "Collections", path: "/admin/collections", entity: "collections", icon: LayoutGrid },
      { label: "Products", path: "/admin/products", entity: "products", icon: Box },
      { label: "Events", path: "/admin/events", entity: "events", icon: CalendarDays },
      { label: "Upcoming Events", path: "/admin/upcoming-events", entity: "upcoming_events", icon: CalendarClock },
    ],
  },
  {
    section: "Brand",
    items: [
      { label: "Brand Settings", path: "/admin/brand", entity: "brand", icon: Palette },
      { label: "Pages & SEO", path: "/admin/pages", entity: "pages", icon: FileText },
      { label: "Navigation", path: "/admin/navigation", entity: "navigation", icon: Compass },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Users & Roles", path: "/admin/users", entity: "users", icon: Users },
    ],
  },
];

export default function Sidebar() {
  const { user, logout, canAccess } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <BrandHeader size="sm" />
      </div>

      <nav className={styles.nav} aria-label="Admin">
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.entity === "users" ? user?.isSuperAdmin : canAccess(item.entity),
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navSectionLabel}>{section.section}</div>
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.active : ""}`
                    }
                  >
                    <Icon className={styles.navIcon} size={16} aria-hidden="true" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.userInfo}>
          <div className={styles.userEmail}>{user?.email}</div>
          <div className={styles.userRole}>
            {user?.isSuperAdmin ? "Super Admin" : "Admin"}
          </div>
        </div>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          <LogOut size={14} aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
