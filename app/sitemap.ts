import { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = headers();
  const host = headersList?.get?.('x-forwarded-host') ?? process.env.NEXTAUTH_URL ?? 'http://localhost:3000';
  const siteUrl = host?.startsWith?.('http') ? host : `https://${host}`;

  const products = await prisma.product.findMany({ select: { slug: true, updatedAt: true } });

  const productUrls = (products ?? []).map((p: any) => ({
    url: `${siteUrl}/products/${p?.slug ?? ''}`,
    lastModified: p?.updatedAt ?? new Date(),
  }));

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/products`, lastModified: new Date() },
    { url: `${siteUrl}/size-guide`, lastModified: new Date() },
    ...productUrls,
  ];
}
