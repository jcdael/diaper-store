export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Get one product per size (Value Pack for best value display)
    const products = await prisma.product.findMany({
      where: { packType: 'Value Pack' },
      include: {
        reviews: { select: { rating: true } },
      },
      orderBy: { size: 'asc' },
    });

    const mapped = (products ?? []).map((p: any) => ({
      ...(p ?? {}),
      avgRating: (p?.reviews?.length ?? 0) > 0
        ? (p?.reviews ?? []).reduce((sum: number, r: any) => sum + (r?.rating ?? 0), 0) / (p?.reviews?.length ?? 1)
        : 0,
      reviewCount: p?.reviews?.length ?? 0,
    }));

    return NextResponse.json(mapped);
  } catch (error: any) {
    console.error('Featured API error:', error);
    return NextResponse.json([]);
  }
}
