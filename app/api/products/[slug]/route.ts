export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params?.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        reviews: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const avgRating = (product?.reviews?.length ?? 0) > 0
      ? (product?.reviews ?? []).reduce((sum: number, r: any) => sum + (r?.rating ?? 0), 0) / (product?.reviews?.length ?? 1)
      : 0;

    // Get related products (same size, different pack type)
    const related = await prisma.product.findMany({
      where: {
        size: product.size,
        slug: { not: slug },
      },
      include: {
        reviews: { select: { rating: true } },
      },
    });

    return NextResponse.json({
      ...(product ?? {}),
      avgRating,
      reviewCount: product?.reviews?.length ?? 0,
      relatedProducts: (related ?? []).map((r: any) => ({
        ...(r ?? {}),
        avgRating: (r?.reviews?.length ?? 0) > 0
          ? (r?.reviews ?? []).reduce((s: number, rv: any) => s + (rv?.rating ?? 0), 0) / (r?.reviews?.length ?? 1)
          : 0,
        reviewCount: r?.reviews?.length ?? 0,
      })),
    });
  } catch (error: any) {
    console.error('Product detail API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
