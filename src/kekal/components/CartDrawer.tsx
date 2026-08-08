import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { X, ShoppingBag } from "lucide-react";
import { useCart } from "../hooks/useCart";
import styles from "./CartDrawer.module.css";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, update, remove } = useCart();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      closeBtnRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  function handleCheckout() {
    onClose();
    navigate("/checkout");
  }

  return (
    <>
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ""}`}
        onClick={onClose}
      />
      <div
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className={styles.drawerHeader}>
          <h2 className={styles.drawerTitle}>Cart</h2>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close cart"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={32} aria-hidden="true" />
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <>
              <p>{totalCount} item(s)</p>
              {items.map((item) => (
                <div className={styles.cartItem} key={item.productId}>
                  <img
                    className={styles.cartItemImage}
                    src={item.mainImage}
                    alt={item.name}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className={styles.cartItemInfo}>
                    <p className={styles.cartItemName}>
                      <Link to={`/collections/${item.collectionSlug}/${item.slug}`}>
                        {item.name}
                      </Link>
                    </p>
                    <div className={styles.quantityControls}>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => update(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className={styles.qtyNum}>{item.quantity}</span>
                      <button
                        className={styles.qtyBtn}
                        onClick={() => update(item.productId, item.quantity + 1)}
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => remove(item.productId)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        <div className={styles.drawerFooter}>
          <p>Price on request</p>
          <button
            className={styles.checkoutBtn}
            disabled={items.length === 0}
            onClick={handleCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
