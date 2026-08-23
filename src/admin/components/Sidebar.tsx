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
  Layers,
  Package,
  Database,
  ShoppingBag,
  TableProperties,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useAuthContext } from "../hooks/AuthContext";
import { useSidebar } from "../hooks/SidebarContext";
import BrandHeader from "./BrandHeader";
import styles from "./Sidebar.module.css";

// ─── Static nav config ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    section: "Content",
    items: [
      { label: "Collections",     path: "/admin/collections",    entity: "collections",    icon: LayoutGrid },
      { label: "Products",         path: "/admin/products",        entity: "products",        icon: Box },
      { label: "Events",           path: "/admin/events",          entity: "events",          icon: CalendarDays },
      { label: "Upcoming Events",  path: "/admin/upcoming-events", entity: "upcoming_events", icon: CalendarClock },
      { label: "Custom Data",      path: "/admin/custom-data",     entity: "custom_tables",   icon: TableProperties },
    ],
  },
  {
    section: "Brand",
    items: [
      { label: "Brand Settings", path: "/admin/brand",      entity: "brand",      icon: Palette },
      { label: "Pages & SEO",    path: "/admin/pages",      entity: "pages",      icon: FileText },
      { label: "Navigation",     path: "/admin/navigation", entity: "navigation", icon: Compass },
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
      { label: "Page Builder",       path: "/admin/page-builder",      entity: "page_sections",  icon: Layers },
      { label: "Component Library",  path: "/admin/component-library", entity: "page_sections",  icon: Package },
      { label: "Database Manager",   path: "/admin/database",          entity: "custom_tables",  icon: Database },
    ],
  },
];

export default function Sidebar() {
  const { user, logout, canAccess } = useAuthContext();
  const navigate = useNavigate();
  const { collapsed, toggle } = useSidebar();

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.logo}>
        {!collapsed && <BrandHeader size="sm" />}
        <button
          type="button"
          className={styles.collapseBtn}
          onClick={toggle}
          title={collapsed ? "Expand sidebar (Ctrl+B)" : "Collapse sidebar (Ctrl+B)"}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </button>
      </div>

      <nav className={styles.nav} aria-label="Admin">
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.entity === "users" ? user?.isSuperAdmin : canAccess(item.entity),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.section} className={styles.navSection}>
              {!collapsed && (
                <div className={styles.navSectionLabel}>{section.section}</div>
              )}
              {visibleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/admin/database"}
                    className={({ isActive }) =>
                      `${styles.navItem} ${isActive ? styles.active : ""}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={styles.navIcon} size={16} aria-hidden="true" />
                    {!collapsed && item.label}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className={styles.footer}>
        {!collapsed && (
          <div className={styles.userInfo}>
            <div className={styles.userEmail}>{user?.email}</div>
            <div className={styles.userRole}>
              {user?.isSuperAdmin ? "Super Admin" : "Admin"}
            </div>
          </div>
        )}
        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
        >
          <LogOut size={14} aria-hidden="true" />
          {!collapsed && "Sign out"}
        </button>
      </div>
    </aside>
  );
}