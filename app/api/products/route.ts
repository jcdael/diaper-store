export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const size = searchParams?.get?.('size') ?? null;
    const packType = searchParams?.get?.('packType') ?? null;

    const where: any = {};
    if (size && size !== 'all') where.size = size;
    if (packType && packType !== 'all') where.packType = packType;

    const products = await prisma.product.findMany({
      where,
      include: {
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: [{ size: 'asc' }, { packCount: 'asc' }],
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
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: error?.message ?? 'Unknown error' },
      { status: 500 }
    );
  }
}
