import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import MobileMenu from "./MobileMenu";

import { getNavigation } from "../services/navigationService";

import type { NavigationItem } from "../types/navigation";

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
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "16px 24px",
        }}
      >
        <Link to="/">
          KeKal Studio
        </Link>

        <button
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