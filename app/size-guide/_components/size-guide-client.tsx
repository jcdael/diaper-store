'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Baby, Ruler, ArrowRight, HelpCircle, Check } from 'lucide-react';

const SIZES = [
  { size: 'Newborn', weight: 'Up to 10 lbs', age: '0-1 months', diapers: '8-12/day', tip: 'Look for umbilical cord cutout for newborn comfort.' },
  { size: 'Size 1', weight: '8-14 lbs', age: '0-4 months', diapers: '8-10/day', tip: 'If the current size leaves red marks, move up a size.' },
  { size: 'Size 2', weight: '12-18 lbs', age: '2-8 months', diapers: '8-10/day', tip: 'The waistband should sit just below the belly button.' },
  { size: 'Size 3', weight: '16-28 lbs', age: '5-18 months', diapers: '6-8/day', tip: 'Make sure the diaper covers the entire bottom.' },
  { size: 'Size 4', weight: '22-37 lbs', age: '12-30 months', diapers: '6-8/day', tip: 'Active toddlers may need a size up for better coverage.' },
  { size: 'Size 5', weight: '27+ lbs', age: '2-4 years', diapers: '5-7/day', tip: 'Great for daytime and nighttime use.' },
  { size: 'Size 6', weight: '35+ lbs', age: '3+ years', diapers: '4-6/day', tip: 'Ideal for overnight protection for bigger kids.' },
];

const TIPS = [
  'If the diaper is leaving red marks on your baby\'s legs or waist, it\'s time to size up.',
  'When two fingers no longer fit between the waistband and your baby\'s tummy, move up a size.',
  'Frequent leaks often mean the diaper is too small, not too big.',
  'Weight ranges overlap between sizes — choose based on fit, not just weight.',
  'A properly fitting diaper should be snug but not tight, with no gaps around the legs.',
];

export function SizeGuideClient() {
  return (
    <div className="max-w-[1200px] mx-auto px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <Ruler className="h-10 w-10 text-primary mx-auto mb-3" />
        <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight">Diaper <span className="text-primary">Size Guide</span></h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Finding the right fit makes all the difference. Use this guide to pick the perfect diaper size for your baby.
        </p>
      </motion.div>

      {/* Size Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card rounded-xl shadow-[var(--shadow-md)] overflow-hidden mb-12"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="px-4 py-3 text-left font-semibold">Size</th>
                <th className="px-4 py-3 text-left font-semibold">Weight Range</th>
                <th className="px-4 py-3 text-left font-semibold">Typical Age</th>
                <th className="px-4 py-3 text-left font-semibold">Changes/Day</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Tip</th>
                <th className="px-4 py-3 text-center font-semibold">Shop</th>
              </tr>
            </thead>
            <tbody>
              {(SIZES ?? []).map((s: any, i: number) => (
                <tr key={s?.size ?? i} className={`border-t border-border ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    <div className="flex items-center gap-2">
                      <Baby className="h-4 w-4 text-primary" />
                      {s?.size ?? ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s?.weight ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s?.age ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground">{s?.diapers ?? ''}</td>
                  <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">{s?.tip ?? ''}</td>
                  <td className="px-4 py-3 text-center">
                    <Link
                      href={`/products?size=${encodeURIComponent(s?.size ?? '')}`}
                      className="inline-flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-xs font-medium hover:opacity-90"
                    >
                      Shop <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Fitting Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-accent rounded-xl p-6 md:p-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h2 className="font-display text-xl font-bold">Fitting Tips</h2>
        </div>
        <div className="space-y-3">
          {(TIPS ?? []).map((tip: string, i: number) => (
            <div key={i} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{tip ?? ''}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-12"
      >
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
        >
          Shop All Sizes <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}
