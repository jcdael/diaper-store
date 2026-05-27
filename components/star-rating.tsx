'use client';

import { Star } from 'lucide-react';

export function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeMap = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  const cls = sizeMap[size] ?? sizeMap.sm;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i: number) => (
        <Star
          key={i}
          className={`${cls} ${
            i < Math.round(rating ?? 0)
              ? 'text-yellow-400 fill-yellow-400'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}
