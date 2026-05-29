// Cart types and localStorage-based persistence
export interface CartItem {
  productId: string;
  name: string;
  size: string;
  packCount: number;
  packType: string;
  price: number;
  originalPrice: number;
  imageUrl: string;
  quantity: number;
  slug: string;
}

export interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

const CART_KEY = 'littlebundle_cart';

export function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage?.getItem?.(CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage?.setItem?.(CART_KEY, JSON.stringify(items ?? []));
  } catch {
    // silently fail
  }
}

export function addToCart(items: CartItem[], product: Omit<CartItem, 'quantity'>, quantity: number = 1): CartItem[] {
  const existing = (items ?? []).find((i: CartItem) => i?.productId === product?.productId);
  let newItems: CartItem[];
  if (existing) {
    newItems = (items ?? []).map((i: CartItem) =>
      i?.productId === product?.productId
        ? { ...(i ?? {}), quantity: (i?.quantity ?? 0) + quantity }
        : i
    );
  } else {
    newItems = [...(items ?? []), { ...(product ?? {}), quantity }];
  }
  saveCart(newItems);
  return newItems;
}

export function removeFromCart(items: CartItem[], productId: string): CartItem[] {
  const newItems = (items ?? []).filter((i: CartItem) => i?.productId !== productId);
  saveCart(newItems);
  return newItems;
}

export function updateQuantity(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (quantity <= 0) return removeFromCart(items, productId);
  const newItems = (items ?? []).map((i: CartItem) =>
    i?.productId === productId ? { ...(i ?? {}), quantity } : i
  );
  saveCart(newItems);
  return newItems;
}

export function getCartTotals(items: CartItem[]): { subtotal: number; itemCount: number } {
  const safeItems = items ?? [];
  return {
    subtotal: safeItems.reduce((sum: number, i: CartItem) => sum + (i?.price ?? 0) * (i?.quantity ?? 0), 0),
    itemCount: safeItems.reduce((sum: number, i: CartItem) => sum + (i?.quantity ?? 0), 0),
  };
}
