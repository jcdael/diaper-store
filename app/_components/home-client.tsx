'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Heart, Droplets, ShieldCheck, Leaf, Baby, Package } from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { TrustBadges } from '@/components/trust-badges';
import { Testimonials } from '@/components/testimonials';
import { CountUp } from '@/components/count-up';

export function HomeClient() {
  const [featured, setFeatured] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/featured')
      .then((r: any) => r?.json?.())
      .then((data: any) => setFeatured(Array.isArray(data) ? data : []))
      .catch(() => setFeatured([]));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-accent via-white to-accent">
        <div className="max-w-[1200px] mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Sparkles className="h-3.5 w-3.5" /> Premium Quality, Honest Pricing
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight">
                Happy Babies,<br />
                <span className="text-primary">Happy Wallets</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 max-w-md leading-relaxed">
                Premium diapers without the premium price tag. Soft, absorbent, hypoallergenic — everything your little one needs at prices that make sense.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
                >
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/size-guide"
                  className="inline-flex items-center justify-center gap-2 bg-card text-foreground px-6 py-3 rounded-full font-medium shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground"><CountUp end={50000} suffix="+" /></p>
                  <p className="text-xs text-muted-foreground">Happy families</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground"><CountUp end={4} suffix=".8" /></p>
                  <p className="text-xs text-muted-foreground">Average rating</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground"><CountUp end={40} suffix="%" /></p>
                  <p className="text-xs text-muted-foreground">Less than brands</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-[var(--shadow-lg)]"
            >
              <Image
                src="https://cdn.abacus.ai/images/310fca7e-512b-433e-af50-32e1a4254a62.png"
                alt="Happy baby wearing a soft white diaper on a pastel teal background"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-[1200px] mx-auto px-4 -mt-6 relative z-10">
        <TrustBadges />
      </section>

      {/* Why Choose Us */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Why Parents <span className="text-primary">Love</span> Us</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">Premium quality diapers designed with your baby\'s comfort and your budget in mind.</p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Heart, title: 'Ultra Soft', desc: 'Cloud-like softness that\'s gentle on delicate newborn skin.' },
            { icon: Droplets, title: 'Super Absorbent', desc: 'Advanced core locks away moisture for up to 12 hours.' },
            { icon: ShieldCheck, title: 'Hypoallergenic', desc: 'Free from chlorine, latex, parabens, and fragrances.' },
            { icon: Leaf, title: 'Eco-Conscious', desc: 'Responsibly sourced materials with less environmental impact.' },
          ].map((item: any, i: number) => {
            const Icon = item?.icon;
            return (
              <motion.div
                key={item?.title ?? i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card rounded-xl p-6 shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-all text-center"
              >
                {Icon && <Icon className="h-10 w-10 text-primary mx-auto mb-3" />}
                <h3 className="font-semibold text-foreground">{item?.title ?? ''}</h3>
                <p className="text-sm text-muted-foreground mt-1">{item?.desc ?? ''}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Best <span className="text-primary">Sellers</span></h2>
              <p className="text-muted-foreground mt-1">Our most popular sizes and packs, loved by families everywhere.</p>
            </div>
            <Link
              href="/products"
              className="hidden md:inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
            >
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(featured ?? []).slice(0, 4).map((product: any, i: number) => (
              <ProductCard key={product?.id ?? i} product={product} index={i} />
            ))}
          </div>
          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              View All Products <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Size range banner */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-accent to-primary/5 rounded-2xl p-8 md:p-12 text-center"
        >
          <Baby className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Every Size, Every Stage</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            From their very first moments to toddlerhood — we\'ve got your baby covered in comfort.
            Newborn through Size 6.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {['Newborn', 'Size 1', 'Size 2', 'Size 3', 'Size 4', 'Size 5', 'Size 6'].map((s: string) => (
              <Link
                key={s}
                href={`/products?size=${encodeURIComponent(s)}`}
                className="bg-card text-foreground px-4 py-2 rounded-full text-sm font-medium shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {s}
              </Link>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/50 py-16 md:py-20">
        <div className="max-w-[1200px] mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight">What <span className="text-primary">Parents</span> Say</h2>
            <p className="text-muted-foreground mt-2">Real feedback from real families who made the switch.</p>
          </motion.div>
          <Testimonials />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1200px] mx-auto px-4 py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-2xl p-8 md:p-12 text-center text-primary-foreground"
        >
          <Package className="h-12 w-12 mx-auto mb-4 opacity-90" />
          <h2 className="font-display text-2xl md:text-3xl font-bold">Ready to Save on Diapers?</h2>
          <p className="mt-2 opacity-90 max-w-md mx-auto">
            Join thousands of happy families. Free shipping on orders over $49.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white text-primary px-8 py-3 rounded-full font-semibold mt-6 hover:bg-white/90 transition-colors"
          >
            Shop Now <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
