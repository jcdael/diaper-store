'use client';

import Link from 'next/link';
import { Baby, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Baby className="h-6 w-6 text-primary" />
            <span className="font-display text-lg font-bold">Little<span className="text-primary">Bundle</span></span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shop</Link>
            <Link href="/size-guide" className="text-sm text-muted-foreground hover:text-primary transition-colors">Size Guide</Link>
            <Link href="/cart" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cart</Link>
          </nav>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
            Made with <Heart className="h-3 w-3 text-secondary fill-secondary" /> for little ones everywhere
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            © 2026 LittleBundle. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
