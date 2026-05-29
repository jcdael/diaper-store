'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Jessica W.',
    text: 'Switched from a premium brand and honestly can\'t tell the difference. My baby is comfortable, no leaks, and I\'m saving over $60 a month!',
    rating: 5,
    label: 'Mom of 2',
  },
  {
    name: 'Mark & Tina D.',
    text: 'As parents of twins, diaper costs were through the roof. LittleBundle cut our bill in half without sacrificing quality. Absolute game changer.',
    rating: 5,
    label: 'Parents of twins',
  },
  {
    name: 'Priya S.',
    text: 'My pediatrician recommended switching to fragrance-free diapers for my daughter\'s sensitive skin. These are perfect — soft, gentle, and zero rashes.',
    rating: 5,
    label: 'First-time mom',
  },
];

export function Testimonials() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {(testimonials ?? []).map((t: any, i: number) => (
        <motion.div
          key={t?.name ?? i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.15 }}
          className="bg-card rounded-xl p-6 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-shadow relative"
        >
          <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
          <div className="flex items-center gap-0.5 mb-3">
            {Array.from({ length: 5 }).map((_, j: number) => (
              <Star
                key={j}
                className={`h-4 w-4 ${
                  j < (t?.rating ?? 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-4">"{t?.text ?? ''}"</p>
          <div>
            <p className="text-sm font-semibold text-foreground">{t?.name ?? ''}</p>
            <p className="text-xs text-muted-foreground">{t?.label ?? ''}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
