export interface CartItem {
  productId: string;
  name: string;
  mainImage: string;
  slug: string;
  collectionSlug: string;
  quantity: number;
}

const CART_KEY = 'kekal_cart';

export function getCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors (e.g. storage disabled)
  }
}

export function addToCart(item: Omit<CartItem, 'quantity'>): void {
  const items = getCart();
  const existing = items.find((i) => i.productId === item.productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    items.push({ ...item, quantity: 1 });
  }
  saveCart(items);
}

export function removeFromCart(productId: string): void {
  const items = getCart().filter((i) => i.productId !== productId);
  saveCart(items);
}

export function updateQuantity(productId: string, qty: number): void {
  if (qty < 1) {
    removeFromCart(productId);
    return;
  }
  const items = getCart();
  const existing = items.find((i) => i.productId === productId);
  if (existing) {
    existing.quantity = qty;
    saveCart(items);
  }
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartCount(): number {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}