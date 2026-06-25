import { Link } from "react-router-dom";

import type { Navigation } from "../database-types/navigation";

import styles from "./MobileMenu.module.css";

interface MobileMenuProps {
  isOpen: boolean;
  navigation: Navigation[];
  onClose: () => void;
}

export default function MobileMenu({
  isOpen,
  navigation,
  onClose,
}: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.topRow}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close menu"
        >
          ×
        </button>
      </div>

      <nav className={styles.nav}>
        {navigation.map((item) => (
          <Link key={item.id} to={item.href} onClick={onClose}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
