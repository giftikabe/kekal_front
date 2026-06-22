import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import MobileMenu from "./MobileMenu";

import { getNavigation } from "../services/navigationService";

import type { NavigationItem } from "../types/navigation";

import styles from "./Header.module.css";

import { getHomePageContent } from "../services/homeService";

export default function Header() {
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const homePageContent = getHomePageContent();

  const { name, title } = homePageContent.hero;

  useEffect(() => {
    async function loadNavigation() {
      const data = await getNavigation();

      setNavigation(data);
    }

    loadNavigation();
  }, []);

  const midpoint = Math.ceil(navigation.length / 2);

  const leftNavigation = navigation.slice(0, midpoint);

  const rightNavigation = navigation.slice(midpoint);

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