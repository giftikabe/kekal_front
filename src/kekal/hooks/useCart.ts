import { useState } from "react";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  CartItem,
} from "../utils/cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(getCart());

  function add(item: Omit<CartItem, 'quantity'>) {
    addToCart(item);
    setItems(getCart());
  }

  function remove(productId: string) {
    removeFromCart(productId);
    setItems(getCart());
  }

  function update(productId: string, qty: number) {
    updateQuantity(productId, qty);
    setItems(getCart());
  }

  function clear() {
    clearCart();
    setItems(getCart());
  }

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, count, add, remove, update, clear };
}