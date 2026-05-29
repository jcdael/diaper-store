'use client';

import { useCart } from '@/components/cart-provider';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Tag } from 'lucide-react';

export function CartClient() {
  const { items, itemCount, subtotal, updateItemQuantity, removeItem } = useCart();
  const shipping = subtotal >= 49 ? 0 : 5.99;
  const tax = parseFloat((subtotal * 0.08).toFixed(2));
  const total = subtotal + shipping + tax;

  if ((items?.length ?? 0) === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold tracking-tight">Your Cart is Empty</h1>
          <p className="text-muted-foreground mt-2">Looks like you haven&apos;t added any diapers yet.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium mt-6 hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="h-4 w-4" /> Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-display text-3xl font-bold tracking-tight mb-8"
      >
        Shopping <span className="text-primary">Cart</span>
        <span className="text-muted-foreground text-lg font-normal ml-3">({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </motion.h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {(items ?? []).map((item: any, i: number) => (
            <motion.div
              key={item?.productId ?? i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-4 shadow-[var(--shadow-sm)] flex gap-4"
            >
              <Link href={`/products/${item?.slug ?? ''}`} className="flex-shrink-0">
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item?.imageUrl ?? ''}
                    alt={item?.name ?? 'Product'}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item?.slug ?? ''}`} className="hover:text-primary transition-colors">
                  <h3 className="text-sm font-semibold line-clamp-2">{item?.name ?? ''}</h3>
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">{item?.size ?? ''} · {item?.packType ?? ''} ({item?.packCount ?? 0} ct)</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center bg-muted rounded-full">
                    <button
                      onClick={() => updateItemQuantity(item?.productId ?? '', (item?.quantity ?? 1) - 1)}
                      className="p-1.5 hover:bg-accent rounded-full transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item?.quantity ?? 0}</span>
                    <button
                      onClick={() => updateItemQuantity(item?.productId ?? '', (item?.quantity ?? 0) + 1)}
                      className="p-1.5 hover:bg-accent rounded-full transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground line-through">${((item?.originalPrice ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeItem(item?.productId ?? '')}
                className="self-start p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:sticky lg:top-24"
        >
          <div className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)]">
            <h2 className="font-display text-lg font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal?.toFixed?.(2) ?? '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">{shipping === 0 ? <span className="text-primary">FREE</span> : `$${shipping?.toFixed?.(2) ?? '0.00'}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="font-medium">${tax?.toFixed?.(2) ?? '0.00'}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold text-lg">${total?.toFixed?.(2) ?? '0.00'}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="mt-4 bg-accent rounded-lg p-3 flex items-start gap-2">
                <Tag className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-accent-foreground">
                  Add ${(49 - subtotal)?.toFixed?.(2) ?? '0.00'} more to get <span className="font-semibold">FREE shipping</span>!
                </p>
              </div>
            )}

            <Link
              href="/checkout"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-medium mt-6 hover:opacity-90 transition-opacity"
            >
              Checkout <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="w-full flex items-center justify-center gap-2 text-muted-foreground text-sm mt-3 hover:text-primary transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
