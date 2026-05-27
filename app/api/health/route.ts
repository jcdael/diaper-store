export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const hasDbUrl = !!dbUrl;
  const dbHost = dbUrl ? new URL(dbUrl).hostname : 'N/A';

  try {
    const start = Date.now();
    const count = await prisma.product.count();
    const elapsed = Date.now() - start;

    return NextResponse.json({
      status: 'ok',
      hasDbUrl,
      dbHost,
      productCount: count,
      queryTimeMs: elapsed,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 'error',
      hasDbUrl,
      dbHost,
      error: error?.message ?? 'Unknown',
    }, { status: 500 });
  }
}
