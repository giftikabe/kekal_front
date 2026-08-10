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
  Puzzle,
  Layout,
  Database,
  ShoppingBag,
  Table2,
} from "lucide-react";
import { useAuthContext } from "../hooks/AuthContext";
import { useCustomTables } from "../hooks/useCustomTables";
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
      { label: "Component Library", path: "/admin/component-library", entity: "brand", icon: Puzzle },
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
    section: "Commerce",
    items: [
      { label: "Commerce", path: "/admin/commerce", entity: "commerce", icon: ShoppingBag },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Users & Roles", path: "/admin/users", entity: "users", icon: Users },
    ],
  },
  {
    section: "Builder",
    items: [
      { label: "Page Builder", path: "/admin/page-builder", entity: "pages", icon: Layout },
    ],
  },
];

export default function Sidebar() {
  const { user, logout, canAccess } = useAuthContext();
  const navigate = useNavigate();

  // Dynamic custom-table entries. The hook re-fetches whenever the Sidebar
  // mounts; DatabasePage calls refresh() on its own instance of the hook
  // after create/delete, which triggers its own re-render. If you want
  // sidebar nav to update immediately after DatabasePage mutates, lift
  // useCustomTables into a shared context — for now a lightweight re-fetch
  // here on mount is sufficient and matches the existing pattern.
  const { tables: customTables } = useCustomTables();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  const showDatabaseSection = canAccess("custom_tables");

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

        {/* ── Database section: static "Database Manager" + one entry per
            custom table. Only rendered when the user can access custom_tables. */}
        {showDatabaseSection && (
          <div className={styles.navSection}>
            <div className={styles.navSectionLabel}>Database</div>

            {/* Top-level manager (create / delete tables) */}
            <NavLink
              to="/admin/database"
              end
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <Database className={styles.navIcon} size={16} aria-hidden="true" />
              Database Manager
            </NavLink>

            {/* One nav entry per custom table */}
            {customTables.map((t) => (
              <NavLink
                key={t.id}
                to={`/admin/database/${t.id}`}
                className={({ isActive }) =>
                  `${styles.navItem} ${styles.navItemSub ?? ""} ${isActive ? styles.active : ""}`
                }
              >
                <Table2 className={styles.navIcon} size={14} aria-hidden="true" />
                {t.displayName}
              </NavLink>
            ))}
          </div>
        )}
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