import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useBrand } from "../hooks/useBrand";
import styles from "./Header.module.css";

export default function Header() {
  const { identity, navItems } = useBrand();
  const [menuOpen, setMenuOpen] = useState(false);

  const half = Math.ceil(navItems.length / 2);
  const leftNav = navItems.slice(0, half);
  const rightNav = navItems.slice(half);

  const brandName = identity["name"] || "KEKAL";

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left nav — desktop only */}
        <nav className={styles.navLeft} aria-label="Primary left">
          {leftNav.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Center — brand name */}
        <NavLink to="/" className={styles.brand} aria-label="Home">
          <span className={styles.brandName}>{brandName}</span>
        </NavLink>

        {/* Right nav — desktop only */}
        <nav className={styles.navRight} aria-label="Primary right">
          {rightNav.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`} />
          <span className={`${styles.hamburgerLine} ${menuOpen ? styles.open : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ""}`} aria-hidden={!menuOpen}>
        <nav className={styles.drawerNav}>
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) => `${styles.drawerLink} ${isActive ? styles.drawerLinkActive : ""}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
