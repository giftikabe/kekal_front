import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

import MobileMenu from "./MobileMenu";

import { useNavigation } from "../hooks/useNavigation";
import { useBrandIdentityByKey } from "../hooks/useBrand";

import styles from "./Header.module.css";

/** Minimal shape this component actually needs — decoupled from any
 * shared "database-types" schema so Header can be reused/tested in
 * isolation with any object matching this shape. */
interface NavItem {
  id: string;
  label: string;
  href: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: navigationData } = useNavigation();
  const navigation: NavItem[] = (navigationData as NavItem[]) ?? [];

  const midpoint = Math.ceil(navigation.length / 2);
  const leftNavigation = navigation.slice(0, midpoint);
  const rightNavigation = navigation.slice(midpoint);

  const { value: name } = useBrandIdentityByKey("name");
  const { value: title } = useBrandIdentityByKey("title");

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navigationLeft} aria-label="Primary">
          {leftNavigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
              end={item.href === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <h1>{name || "KEKAL"}</h1>
            {title && <span>{title}</span>}
          </Link>
        </div>

        <nav className={styles.navigationRight} aria-label="Secondary">
          {rightNavigation.map((item) => (
            <NavLink
              key={item.id}
              to={item.href}
              className={({ isActive }) =>
                isActive ? styles.activeLink : undefined
              }
              end={item.href === "/"}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(true)}
          aria-label="Open menu"
          aria-haspopup="dialog"
          aria-expanded={isMenuOpen}
        >
          <span aria-hidden="true">☰</span>
        </button>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        navigation={navigation}
        onClose={() => setIsMenuOpen(false)}
      />
    </>
  );
}
