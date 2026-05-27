'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, loadCart, addToCart as addFn, removeFromCart as removeFn, updateQuantity as updateFn, getCartTotals } from '@/lib/cart-store';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateItemQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  itemCount: 0,
  subtotal: 0,
  addItem: () => {},
  removeItem: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setItems(loadCart());
  }, []);

  const addItem = useCallback((product: Omit<CartItem, 'quantity'>, quantity: number = 1) => {
    setItems((prev: CartItem[]) => {
      const updated = addFn(prev, product, quantity);
      return updated;
    });
    toast.success('Added to cart!', { description: product?.name ?? 'Item' });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev: CartItem[]) => removeFn(prev, productId));
    toast.info('Removed from cart');
  }, []);

  const updateItemQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev: CartItem[]) => updateFn(prev, productId, quantity));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      try { localStorage?.removeItem?.('littlebundle_cart'); } catch {}
    }
  }, []);

  const { subtotal, itemCount } = getCartTotals(mounted ? items : []);

  return (
    <CartContext.Provider value={{ items: mounted ? items : [], itemCount, subtotal, addItem, removeItem, updateItemQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
