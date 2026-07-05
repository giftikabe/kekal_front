import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import styles from "./MobileMenu.module.css";

interface NavItem {
  id: string;
  label: string;
  href: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  navigation: NavItem[];
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  navigation,
  onClose,
}: MobileMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus into the dialog when it opens and let Escape close it —
  // both are baseline expectations for a full-screen dialog pattern.
  useEffect(() => {
    if (isOpen) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Site menu">
      <div className={styles.topRow}>
        <button
          ref={closeButtonRef}
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>

      <nav className={styles.nav} aria-label="Primary">
        {navigation.map((item) => (
          <Link key={item.id} to={item.href} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
