import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import MobileMenu from "./MobileMenu";

import { getNavigation } from "../services/navigationService";

import type { NavigationItem } from "../types/navigation";

import styles from "./Header.module.css";

export default function Header() {
  const [navigation, setNavigation] = useState<
    NavigationItem[]
  >([]);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    async function loadNavigation() {
      const data = await getNavigation();

      setNavigation(data);
    }

    loadNavigation();
  }, []);

  return (
    <>
      <header className={styles.header}>

<div className={styles.logo}>
  <Link to="/">KK</Link>
</div>

<nav className={styles.navigation}>
  {navigation.map((item) => (
    <Link
      key={item.id}
      to={item.href}
    >
      {item.label}
    </Link>
  ))}
</nav>

<button
  className={styles.menuButton}
  onClick={() =>
    setIsMenuOpen(true)
  }
>
  ☰
</button>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        navigation={navigation}
        onClose={() =>
          setIsMenuOpen(false)
        }
      />
    </>
  );
}