'use client';

import Link from 'next/link';
import { ShoppingCart, Baby, Menu, X } from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Header() {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Baby className="h-7 w-7 text-primary" />
          <span className="font-display text-xl font-bold tracking-tight text-foreground">Little<span className="text-primary">Bundle</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Shop All</Link>
          <Link href="/size-guide" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Size Guide</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-border"
          >
            <nav className="flex flex-col gap-1 p-4">
              <Link href="/" onClick={() => setMobileOpen(false)} className="text-sm font-medium p-2 rounded-lg hover:bg-accent">Home</Link>
              <Link href="/products" onClick={() => setMobileOpen(false)} className="text-sm font-medium p-2 rounded-lg hover:bg-accent">Shop All</Link>
              <Link href="/size-guide" onClick={() => setMobileOpen(false)} className="text-sm font-medium p-2 rounded-lg hover:bg-accent">Size Guide</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
