'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Filter, Package } from 'lucide-react';
import { ProductCard } from '@/components/product-card';

const SIZES = ['all', 'Newborn', 'Size 1', 'Size 2', 'Size 3', 'Size 4', 'Size 5', 'Size 6'];
const PACK_TYPES = ['all', 'Standard Pack', 'Value Pack', 'Bulk Box'];

export function ProductsClient() {
  const searchParams = useSearchParams();
  const initialSize = searchParams?.get?.('size') ?? 'all';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sizeFilter, setSizeFilter] = useState(initialSize);
  const [packFilter, setPackFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (sizeFilter !== 'all') params.set('size', sizeFilter);
    if (packFilter !== 'all') params.set('packType', packFilter);
    fetch(`/api/products?${params.toString()}`)
      .then((r: any) => r?.json?.())
      .then((data: any) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [sizeFilter, packFilter]);

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Shop All <span className="text-primary">Diapers</span></h1>
        <p className="text-muted-foreground mt-2">Premium diapers for every stage, every budget.</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl p-4 shadow-[var(--shadow-sm)] mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Filters</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Size</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSizeFilter(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    sizeFilter === s
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {s === 'all' ? 'All Sizes' : s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium mb-1 block">Pack Type</label>
            <div className="flex flex-wrap gap-2">
              {PACK_TYPES.map((p: string) => (
                <button
                  key={p}
                  onClick={() => setPackFilter(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    packFilter === p
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-sm)]'
                      : 'bg-muted text-muted-foreground hover:bg-accent'
                  }`}
                >
                  {p === 'all' ? 'All Packs' : p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i: number) => (
            <div key={i} className="bg-card rounded-xl overflow-hidden shadow-[var(--shadow-sm)] animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-muted rounded w-1/3" />
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : (products?.length ?? 0) === 0 ? (
        <div className="text-center py-20">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">{products?.length ?? 0} products</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(products ?? []).map((product: any, i: number) => (
              <ProductCard key={product?.id ?? i} product={product} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
