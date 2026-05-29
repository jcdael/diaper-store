'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Star, Minus, Plus, Check, ArrowLeft,
  Shield, Truck, RefreshCw, Package, ChevronRight
} from 'lucide-react';
import { useCart } from '@/components/cart-provider';
import { StarRating } from '@/components/star-rating';
import { ProductCard } from '@/components/product-card';

export function ProductDetailClient({ slug }: { slug: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/products/${slug}`)
      .then((r: any) => r?.json?.())
      .then((data: any) => setProduct(data ?? null))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-muted rounded-xl" />
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-1/4" />
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-12 bg-muted rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!product || product?.error) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 py-20 text-center">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Product not found</p>
        <Link href="/products" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm mt-4">
          <ArrowLeft className="h-4 w-4" /> Back to Shop
        </Link>
      </div>
    );
  }

  const discount = Math.round((1 - (product?.price ?? 0) / (product?.originalPrice ?? 1)) * 100);

  const handleAddToCart = () => {
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
    }, quantity);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/products" className="hover:text-primary transition-colors">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground font-medium">{product?.size ?? ''}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-xl overflow-hidden bg-muted shadow-[var(--shadow-md)]"
        >
          <Image
            src={product?.imageUrl ?? ''}
            alt={product?.name ?? 'Diaper product'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {discount > 0 && (
            <span className="absolute top-4 left-4 bg-secondary text-secondary-foreground text-sm font-bold px-3 py-1.5 rounded-full">
              -{discount}% OFF
            </span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-sm text-primary font-semibold">{product?.size ?? ''} · {product?.weightRange ?? ''}</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight mt-1">{product?.name ?? ''}</h1>

          <div className="flex items-center gap-3 mt-3">
            <StarRating rating={product?.avgRating ?? 0} size="md" />
            <span className="text-sm text-muted-foreground">{product?.reviewCount ?? 0} reviews</span>
          </div>

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-foreground">${(product?.price ?? 0)?.toFixed?.(2) ?? '0.00'}</span>
            <span className="text-lg text-muted-foreground line-through">${(product?.originalPrice ?? 0)?.toFixed?.(2) ?? '0.00'}</span>
            <span className="text-sm font-semibold text-secondary">Save ${((product?.originalPrice ?? 0) - (product?.price ?? 0))?.toFixed?.(2) ?? '0.00'}</span>
          </div>
          <p className="text-sm text-primary font-medium mt-1">
            Only ${((product?.price ?? 0) / Math.max(product?.packCount ?? 1, 1))?.toFixed?.(2) ?? '0.00'} per diaper
          </p>

          <p className="text-muted-foreground mt-4 leading-relaxed">{product?.description ?? ''}</p>

          {/* Features */}
          <div className="mt-6 space-y-2">
            {(product?.features ?? []).slice(0, 5).map((f: string, i: number) => (
              <div key={i} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{f ?? ''}</span>
              </div>
            ))}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex items-center bg-muted rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 hover:bg-accent rounded-full transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2.5 hover:bg-accent rounded-full transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3.5 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart — ${((product?.price ?? 0) * quantity)?.toFixed?.(2) ?? '0.00'}
            </button>
          </div>

          {/* Mini trust */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {[
              { icon: Truck, text: 'Free shipping 49+' },
              { icon: Shield, text: 'Safe & hypoallergenic' },
              { icon: RefreshCw, text: '30-day returns' },
            ].map((item: any, i: number) => {
              const Icon = item?.icon;
              return (
                <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {Icon && <Icon className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                  <span>{item?.text ?? ''}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Reviews */}
      {(product?.reviews?.length ?? 0) > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {(product?.reviews ?? []).map((review: any, i: number) => (
              <motion.div
                key={review?.id ?? i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl p-5 shadow-[var(--shadow-sm)]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold">{review?.author ?? 'Anonymous'}</p>
                    {review?.verified && (
                      <span className="text-xs text-primary flex items-center gap-1">
                        <Check className="h-3 w-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review?.rating ?? 0} />
                </div>
                <p className="text-sm font-semibold text-foreground">{review?.title ?? ''}</p>
                <p className="text-sm text-muted-foreground mt-1">{review?.content ?? ''}</p>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Related Products */}
      {(product?.relatedProducts?.length ?? 0) > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-bold tracking-tight mb-6">Other Packs in {product?.size ?? ''}</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(product?.relatedProducts ?? []).map((rp: any, i: number) => (
              <ProductCard key={rp?.id ?? i} product={rp} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
