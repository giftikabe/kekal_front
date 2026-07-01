import { NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/AuthContext";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  {
    section: "Content",
    items: [
      { label: "Collections", path: "/admin/collections", entity: "collections", icon: "◫" },
      { label: "Products", path: "/admin/products", entity: "products", icon: "◻" },
      { label: "Events", path: "/admin/events", entity: "events", icon: "◷" },
      { label: "Upcoming Events", path: "/admin/upcoming-events", entity: "upcoming_events", icon: "◈" },
    ],
  },
  {
    section: "Brand",
    items: [
      { label: "Brand Settings", path: "/admin/brand", entity: "brand", icon: "◆" },
      { label: "Pages & SEO", path: "/admin/pages", entity: "pages", icon: "◱" },
    ],
  },
  {
    section: "System",
    items: [
      { label: "Users & Roles", path: "/admin/users", entity: "users", icon: "◎" },
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
        <div className={styles.logoText}>KEKAL</div>
        <div className={styles.logoSub}>Admin Dashboard</div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((section) => {
          const visibleItems = section.items.filter((item) =>
            item.entity === "users"
              ? user?.isSuperAdmin
              : canAccess(item.entity),
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={section.section} className={styles.navSection}>
              <div className={styles.navSectionLabel}>{section.section}</div>
              {visibleItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `${styles.navItem} ${isActive ? styles.active : ""}`
                  }
                >
                  <span className={styles.navIcon}>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
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
          <span>⎋</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
