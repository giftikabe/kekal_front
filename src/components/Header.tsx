import { useState } from "react";

import { Link } from "react-router-dom";

import MobileMenu from "./MobileMenu";

import { getNavigation } from "../database-services/navigationService";
import { getBrandIdentityByKey } from "../database-services/brandIdentityService";

import type { Navigation } from "../database-types/navigation";

import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ─── Navigation ────────────────────────────────────────────────────────────
  const navigation: Navigation[] = getNavigation();

  const midpoint = Math.ceil(navigation.length / 2);
  const leftNavigation = navigation.slice(0, midpoint);
  const rightNavigation = navigation.slice(midpoint);

  // ─── Brand ─────────────────────────────────────────────────────────────────
  const name = getBrandIdentityByKey("name");
  const title = getBrandIdentityByKey("title");

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navigationLeft}>
          {leftNavigation.map((item) => (
            <Link key={item.id} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink}>
            <h1>{name}</h1>

            <span>{title}</span>
          </Link>
        </div>

        <nav className={styles.navigationRight}>
          {rightNavigation.map((item) => (
            <Link key={item.id} to={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(true)}
        >
          ☰
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
