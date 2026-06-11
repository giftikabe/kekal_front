import { Link } from "react-router-dom";
import type { NavigationItem } from "../types/navigation";

interface MobileMenuProps {
  isOpen: boolean;
  navigation: NavigationItem[];
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
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#ffffff",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button onClick={onClose}>
          ✕
        </button>
      </div>

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          marginTop: "48px",
        }}
      >
        {navigation.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}