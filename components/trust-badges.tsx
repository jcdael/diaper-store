'use client';

import { Shield, Truck, RefreshCw, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const badges = [
  { icon: Shield, label: '100% Safe', desc: 'Dermatologist tested' },
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $49' },
  { icon: RefreshCw, label: '30-Day Returns', desc: 'Money-back guarantee' },
  { icon: Lock, label: 'Secure Checkout', desc: '256-bit SSL encryption' },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {(badges ?? []).map((badge: any, i: number) => {
        const Icon = badge?.icon;
        return (
          <motion.div
            key={badge?.label ?? i}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-card rounded-xl p-5 text-center shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow"
          >
            {Icon && <Icon className="h-8 w-8 text-primary mx-auto mb-2" />}
            <p className="text-sm font-semibold text-foreground">{badge?.label ?? ''}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{badge?.desc ?? ''}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
