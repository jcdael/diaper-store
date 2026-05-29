'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '@/components/cart-provider';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    size: string;
    weightRange: string;
    packCount: number;
    packType: string;
    price: number;
    originalPrice: number;
    imageUrl: string;
    avgRating: number;
    reviewCount: number;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const discount = Math.round((1 - (product?.price ?? 0) / (product?.originalPrice ?? 1)) * 100);

  const handleAddToCart = (e: React.MouseEvent) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    addItem({
      productId: product?.id ?? '',
      name: product?.name ?? '',
      size: product?.size ?? '',
      packCount: product?.packCount ?? 0,
      packType: product?.packType ?? '',
      price: product?.price ?? 0,
      originalPrice: product?.originalPrice ?? 0,
      imageUrl: product?.imageUrl ?? '',
      slug: product?.slug ?? '',
    });
  };

  return (
    <motion.div
      initial={{ y: 12 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Link href={`/products/${product?.slug ?? ''}`} className="block group">
        <div className="bg-card rounded-xl overflow-hidden shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 group-hover:-translate-y-1">
          <div className="relative aspect-square bg-muted">
            <Image
              src={product?.imageUrl ?? '/products/newborn-diapers.png'}
              alt={`${product?.name ?? 'Diaper'} product image`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                -{discount}%
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">{product?.size ?? ''} · {product?.weightRange ?? ''}</p>
            <h3 className="text-sm font-semibold mt-1 line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
              {product?.packType ?? ''} ({product?.packCount ?? 0} ct)
            </h3>
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: 5 }).map((_, i: number) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.round(product?.avgRating ?? 0)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-400'
                  }`}
                />
              ))}
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product?.reviewCount ?? 0})</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">${(product?.price ?? 0).toFixed(2)}</span>
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">${(product?.originalPrice ?? 0).toFixed(2)}</span>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-primary text-primary-foreground p-2 rounded-full hover:opacity-90 transition-opacity"
                aria-label="Add to cart"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs font-medium mt-1 text-emerald-700 dark:text-emerald-400">
              ${((product?.price ?? 0) / Math.max(product?.packCount ?? 1, 1)).toFixed(2)}/diaper
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
